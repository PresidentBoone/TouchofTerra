const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const path = require('path');
const OpenAI = require('openai');
const { dbRun, dbAll, dbGet } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize OpenAI
// WARNING: Ensure OPENAI_API_KEY is in your .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware for Admin Routes
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Simple admin protection (e.g. "Bearer mysecretpassword")
  // In production, use real JWT or sessions.
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET || 'admin-secret'}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Rate limiting middleware (simple in-memory implementation)
const rateLimit = {};
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10) * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!rateLimit[ip]) {
    rateLimit[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    return next();
  }

  if (now > rateLimit[ip].resetTime) {
    rateLimit[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    return next();
  }

  if (rateLimit[ip].count >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((rateLimit[ip].resetTime - now) / 1000)
    });
  }

  rateLimit[ip].count++;
  next();
};

app.use(rateLimiter);

// Simple cache middleware
const cache = new Map();
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '3600', 10) * 1000; // 1 hour default

const cacheMiddleware = (duration = CACHE_TTL) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < duration) {
      return res.json(cached.data);
    }

    res.originalJson = res.json;
    res.json = (data) => {
      cache.set(key, { data, timestamp: Date.now() });
      res.originalJson(data);
    };

    next();
  };
};

// API Routes

// --- Chatbot Endpoint (Secure) ---
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: 'Service unavailable (API key missing)',
        message: "I'm running in offline mode right now, but I can still help you find resources using the buttons below!"
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.3,
      max_tokens: 600
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});


// --- Statistics ---

// Get current homelessness statistics
app.get('/api/stats/current', async (req, res) => {
  try {
    const row = await dbGet("SELECT value FROM stats WHERE key = 'current_stats'");
    let stats;

    if (row && row.value) {
      stats = JSON.parse(row.value);
    } else {
      // Fallback if DB empty (shouldn't happen due to seeding)
      stats = {
        totalHomeless: 1157,
        sheltered: 680,
        unsheltered: 477,
        families: 89,
        veterans: 142,
        youth: 78,
        chronicHomeless: 234,
        lastUpdated: new Date().toISOString()
      };
    }
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update current stats (Secure)
app.put('/api/admin/stats/current', authenticateAdmin, async (req, res) => {
  try {
    const newStats = req.body;
    // Basic validation
    if (!newStats.totalHomeless) {
      return res.status(400).json({ error: "Invalid stats data" });
    }

    newStats.lastUpdated = new Date().toISOString();

    // Upsert logic (insert or replace)
    await dbRun(
      "INSERT OR REPLACE INTO stats (key, value, updatedAt) VALUES (?, ?, ?)",
      ['current_stats', JSON.stringify(newStats), new Date().toISOString()]
    );

    res.json({ success: true, stats: newStats });
  } catch (err) {
    console.error('Error updating stats:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get historical trend data
app.get('/api/stats/historical', (req, res) => {
  const historicalData = [
    { year: 2020, total: 997, sheltered: 615, unsheltered: 382 },
    { year: 2021, total: 1049, sheltered: 650, unsheltered: 399 },
    { year: 2022, total: 1089, sheltered: 663, unsheltered: 426 },
    { year: 2023, total: 1123, sheltered: 672, unsheltered: 451 },
    { year: 2024, total: 1157, sheltered: 680, unsheltered: 477 }
  ];
  res.json(historicalData);
});

// Get shelter bed availability
app.get('/api/stats/beds', (req, res) => {
  const bedData = {
    total: 850,
    available: 145,
    occupancyRate: 82.9,
    emergency: 340,      // Emergency shelter beds
    transitional: 298,   // Transitional housing beds
    permanent: 212       // Permanent supportive housing beds
  };
  res.json(bedData);
});

// --- Resources (SQLite) ---

// Get all resource locations
app.get('/api/resources', async (req, res) => {
  try {
    const { type } = req.query;
    let sql = "SELECT * FROM resources";
    let params = [];

    if (type) {
      sql += " WHERE type = ?";
      params.push(type);
    }

    const resources = await dbAll(sql, params);

    // Parse JSON services and booleans
    const parsedResources = resources.map(r => ({
      ...r,
      services: JSON.parse(r.services || '[]'),
      coordinates: { lat: r.lat, lng: r.lng },
      isOpen: r.isOpen === 1
    }));

    res.json(parsedResources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get single resource by ID
app.get('/api/resources/:id', async (req, res) => {
  try {
    const resource = await dbGet("SELECT * FROM resources WHERE id = ?", [req.params.id]);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const parsedResource = {
      ...resource,
      services: JSON.parse(resource.services || '[]'),
      coordinates: { lat: resource.lat, lng: resource.lng },
      isOpen: resource.isOpen === 1
    };
    res.json(parsedResource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// --- Alerts ---
app.get('/api/alerts', (req, res) => {
  // Return cached alerts from memory variable (refreshed by cron)
  res.json(global.alerts || []);
});

// --- Volunteers (SQLite) ---

// Volunteer signup endpoint
app.post('/api/volunteers', async (req, res) => {
  try {
    const { name, email, phone, availability, skills, referralSource, message } = req.body;
    const submittedAt = new Date().toISOString();

    await dbRun(
      `INSERT INTO volunteers (name, email, phone, availability, skills, referralSource, message, submittedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, availability, skills, referralSource, message, submittedAt]
    );

    console.log('📧 New volunteer signup saved to DB:', { name, email });

    res.status(201).json({
      success: true,
      message: 'Thank you for volunteering! We will contact you soon.'
    });
  } catch (error) {
    console.error('Error processing volunteer signup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process volunteer signup. Please try again.'
    });
  }
});

// Get all volunteer submissions (Admin Protected)
app.get('/api/admin/volunteers', authenticateAdmin, async (req, res) => {
  try {
    const volunteers = await dbAll("SELECT * FROM volunteers ORDER BY submittedAt DESC");
    res.json(volunteers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// --- External API Proxies ---

// HUD Data proxy
app.get('/api/external/hud', cacheMiddleware(24 * 60 * 60 * 1000), async (req, res) => {
  try {
    // Real implementation would go here
    const mockData = { message: "HUD Data placeholder" };
    res.json({
      success: true,
      data: mockData,
      source: 'HUD Exchange',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('HUD API error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch HUD data',
      fallback: true
    });
  }
});

// Louisville Open Data proxy
app.get('/api/external/louisville/stats', cacheMiddleware(), async (req, res) => {
  try {
    // Placeholder for real proxy
    const mockData = { message: "Louisville Data placeholder" };
    res.json({
      success: true,
      data: mockData,
      source: 'Louisville Metro',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Louisville API error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Louisville data'
    });
  }
});

// Data.gov proxy
app.get('/api/external/datagov/search', cacheMiddleware(), async (req, res) => {
  try {
    // Placeholder
    const mockData = { message: "Data.gov Data placeholder" };
    res.json({
      success: true,
      data: mockData,
      source: 'Data.gov',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Data.gov API error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to search Data.gov'
    });
  }
});

// Impact metrics endpoint
app.get('/api/impact-metrics', cacheMiddleware(15 * 60 * 1000), (req, res) => {
  res.json({
    peopleHelped: 2847,
    backpacksDistributed: 1523,
    mealsServed: 8934,
    lastUpdated: new Date().toISOString(),
    yearToDate: {
      peopleHelped: 2847,
      backpacksDistributed: 1523,
      mealsServed: 8934,
      volunteersEngaged: 412,
      communityPartners: 37,
      eventsHosted: 24
    }
  });
});

// Analytics events endpoint
app.post('/api/analytics/events', (req, res) => {
  try {
    const { events } = req.body;
    console.log(`Received ${events?.length || 0} analytics events`);
    res.json({
      success: true,
      message: 'Events logged successfully'
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log analytics events'
    });
  }
});

// --- Admin Endpoints (Secure Resource Management) ---

// Add new resource
app.post('/api/admin/resources', authenticateAdmin, async (req, res) => {
  try {
    const r = req.body;
    const servicesJson = JSON.stringify(r.services);
    const isOpen = r.isOpen ? 1 : 0;
    const createdAt = new Date().toISOString();

    await dbRun(
      `INSERT INTO resources (name, type, address, lat, lng, hours, phone, services, capacity, available, isOpen, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.name, r.type, r.address, r.coordinates.lat, r.coordinates.lng, r.hours, r.phone, servicesJson, r.capacity, r.available, isOpen, createdAt]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update resource
app.put('/api/admin/resources/:id', authenticateAdmin, async (req, res) => {
  try {
    const r = req.body;
    const servicesJson = JSON.stringify(r.services);
    const isOpen = r.isOpen ? 1 : 0;
    const updatedAt = new Date().toISOString();

    await dbRun(
      `UPDATE resources SET name=?, type=?, address=?, lat=?, lng=?, hours=?, phone=?, services=?, capacity=?, available=?, isOpen=?, updatedAt=? WHERE id=?`,
      [r.name, r.type, r.address, r.coordinates.lat, r.coordinates.lng, r.hours, r.phone, servicesJson, r.capacity, r.available, isOpen, updatedAt, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete resource
app.delete('/api/admin/resources/:id', authenticateAdmin, async (req, res) => {
  try {
    await dbRun("DELETE FROM resources WHERE id = ?", [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// --- Background Jobs ---

// Data ingestion from Louisville Open Data Portal
async function fetchLouisvilleData() {
  // Placeholder logic
  // In a real implementation, you would write this data to the 'resources' table
  // ensuring no duplicates.
  console.log('Fetching Louisville homelessness data... (Placeholder)');
}

// Weather alert check for extreme weather nights
global.alerts = [];
async function checkWeatherAlerts() {
  try {
    // National Weather Service API for Louisville
    const response = await axios.get(
      'https://api.weather.gov/alerts/active?point=38.2527,-85.7585'
    );

    const newAlerts = [];

    if (response.data && response.data.features) {
      response.data.features.forEach(alert => {
        if (alert.properties.event.includes('Cold') ||
          alert.properties.event.includes('Heat') ||
          alert.properties.event.includes('Winter')) {
          newAlerts.push({
            type: 'weather',
            severity: alert.properties.severity,
            event: alert.properties.event,
            headline: alert.properties.headline,
            description: alert.properties.description,
            instruction: alert.properties.instruction
          });
        }
      });

      global.alerts = newAlerts;

      if (newAlerts.length > 0) {
        console.log(`${newAlerts.length} weather alerts detected`);
      }
    }
  } catch (error) {
    console.error('Error checking weather alerts:', error.message);
  }
}

// Schedule data updates
// Run every 6 hours
cron.schedule('0 */6 * * *', () => {
  console.log('Running scheduled data update...');
  fetchLouisvilleData();
});

// Check weather alerts every hour
cron.schedule('0 * * * *', () => {
  console.log('Checking weather alerts...');
  checkWeatherAlerts();
});

// Serve static files from the React app
const frontendDistPath = path.join(__dirname, '../frontend/touch-of-terra-dashboard/dist');
app.use(express.static(frontendDistPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    db: 'sqlite'
  });
});

// All other GET requests not handled by API routes should serve the React app (catch-all route must be last)
app.use((req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Initial data fetch on startup
fetchLouisvilleData();
checkWeatherAlerts();

app.listen(PORT, () => {
  console.log(`🚀 Touch of Terra Dashboard running on port ${PORT}`);
});

module.exports = app;

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

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

// In-memory database for MVP (replace with Firebase/PostgreSQL later)
let homelessnessData = {
  currentStats: {
    totalHomeless: 1157, // 2024 Coalition data
    sheltered: 680,
    unsheltered: 477,
    families: 89,
    veterans: 142,
    youth: 78,
    chronicHomeless: 234,
    lastUpdated: new Date().toISOString()
  },
  historicalData: [
    { year: 2020, total: 997, sheltered: 615, unsheltered: 382 },
    { year: 2021, total: 1049, sheltered: 650, unsheltered: 399 },
    { year: 2022, total: 1089, sheltered: 663, unsheltered: 426 },
    { year: 2023, total: 1123, sheltered: 672, unsheltered: 451 },
    { year: 2024, total: 1157, sheltered: 680, unsheltered: 477 }
  ],
  shelterBeds: {
    total: 850,
    available: 145,
    occupancyRate: 82.9,
    emergency: 340,      // Emergency shelter beds
    transitional: 298,   // Transitional housing beds
    permanent: 212       // Permanent supportive housing beds
  },
  alerts: []
};

// Volunteer submissions storage
let volunteerSubmissions = [];

let resourceLocations = [
  {
    id: 1,
    name: "Wayside Christian Mission",
    type: "shelter",
    address: "432 E Jefferson St, Louisville, KY 40202",
    coordinates: { lat: 38.2527, lng: -85.7485 },
    hours: "24/7",
    phone: "(502) 584-3711",
    services: ["Emergency Shelter", "Meals", "Case Management"],
    capacity: 400,
    available: 45,
    isOpen: true
  },
  {
    id: 2,
    name: "St. John Center",
    type: "shelter",
    address: "500 E Jefferson St, Louisville, KY 40202",
    coordinates: { lat: 38.2531, lng: -85.7472 },
    hours: "Mon-Fri 8am-4pm",
    phone: "(502) 568-6758",
    services: ["Day Shelter", "Showers", "Laundry", "Job Training"],
    isOpen: true
  },
  {
    id: 3,
    name: "The Healing Place",
    type: "shelter",
    address: "1020 W Market St, Louisville, KY 40202",
    coordinates: { lat: 38.2545, lng: -85.7714 },
    hours: "24/7",
    phone: "(502) 585-4848",
    services: ["Recovery Program", "Emergency Shelter", "Medical Care"],
    capacity: 850,
    available: 78,
    isOpen: true
  },
  {
    id: 4,
    name: "Family Health Centers - Phoenix",
    type: "clinic",
    address: "1147 S 28th St, Louisville, KY 40211",
    coordinates: { lat: 38.2389, lng: -85.7851 },
    hours: "Mon-Fri 8am-5pm",
    phone: "(502) 774-8631",
    services: ["Medical Care", "Dental", "Behavioral Health"],
    isOpen: true
  },
  {
    id: 5,
    name: "Dare to Care Food Bank",
    type: "food",
    address: "6500 Strawberry Ln, Louisville, KY 40214",
    coordinates: { lat: 38.1849, lng: -85.7799 },
    hours: "Mon-Fri 9am-4pm",
    phone: "(502) 966-3821",
    services: ["Food Pantry", "Emergency Food"],
    isOpen: true
  },
  {
    id: 6,
    name: "St. Vincent de Paul",
    type: "food",
    address: "1015 S Jackson St, Louisville, KY 40203",
    coordinates: { lat: 38.2411, lng: -85.7563 },
    hours: "Mon-Sat 9am-3pm",
    phone: "(502) 637-4771",
    services: ["Food Pantry", "Clothing", "Financial Assistance"],
    isOpen: true
  },
  {
    id: 7,
    name: "Coalition for the Homeless",
    type: "services",
    address: "1000 E Liberty St, Louisville, KY 40204",
    coordinates: { lat: 38.2501, lng: -85.7412 },
    hours: "Mon-Fri 9am-5pm",
    phone: "(502) 589-4004",
    services: ["Case Management", "Housing Assistance", "Advocacy"],
    isOpen: true
  },
  {
    id: 8,
    name: "Home of the Innocents",
    type: "shelter",
    address: "1100 E Market St, Louisville, KY 40206",
    coordinates: { lat: 38.2532, lng: -85.7389 },
    hours: "24/7",
    phone: "(502) 596-1000",
    services: ["Youth Shelter", "Foster Care", "Mental Health"],
    capacity: 50,
    available: 8,
    isOpen: true
  },
  {
    id: 9,
    name: "Louisville Rescue Mission",
    type: "shelter",
    address: "1015 S Hancock St, Louisville, KY 40203",
    coordinates: { lat: 38.2407, lng: -85.7551 },
    hours: "24/7",
    phone: "(502) 636-0771",
    services: ["Emergency Shelter", "Meals", "Addiction Recovery"],
    capacity: 200,
    available: 32,
    isOpen: true
  },
  {
    id: 10,
    name: "Volunteers of America Family Emergency Shelter",
    type: "shelter",
    address: "Address Confidential (Call for Location)",
    coordinates: { lat: 38.2527, lng: -85.7585 },
    hours: "24/7",
    phone: "(502) 636-4660",
    services: ["Family Shelter", "Domestic Violence Support"],
    capacity: 60,
    available: 12,
    isOpen: true
  }
];

// API Routes

// Get current homelessness statistics
app.get('/api/stats/current', (req, res) => {
  res.json(homelessnessData.currentStats);
});

// Get historical trend data
app.get('/api/stats/historical', (req, res) => {
  res.json(homelessnessData.historicalData);
});

// Get shelter bed availability
app.get('/api/stats/beds', (req, res) => {
  res.json(homelessnessData.shelterBeds);
});

// Get all resource locations
app.get('/api/resources', (req, res) => {
  const { type } = req.query;
  if (type) {
    const filtered = resourceLocations.filter(r => r.type === type);
    return res.json(filtered);
  }
  res.json(resourceLocations);
});

// Get single resource by ID
app.get('/api/resources/:id', (req, res) => {
  const resource = resourceLocations.find(r => r.id === parseInt(req.params.id));
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  res.json(resource);
});

// Get alerts
app.get('/api/alerts', (req, res) => {
  res.json(homelessnessData.alerts);
});

// Volunteer signup endpoint
app.post('/api/volunteers', (req, res) => {
  try {
    const volunteer = {
      id: volunteerSubmissions.length + 1,
      ...req.body,
      submittedAt: req.body.submittedAt || new Date().toISOString(),
      status: 'pending' // pending, contacted, active
    };

    volunteerSubmissions.push(volunteer);

    // Log to console for now (replace with email notification later)
    console.log('📧 New volunteer signup:', {
      name: volunteer.name,
      email: volunteer.email,
      availability: volunteer.availability,
      submittedAt: volunteer.submittedAt
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for volunteering! We will contact you soon.',
      volunteerId: volunteer.id
    });
  } catch (error) {
    console.error('Error processing volunteer signup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process volunteer signup. Please try again.'
    });
  }
});

// Get all volunteer submissions (admin only)
app.get('/api/admin/volunteers', (req, res) => {
  res.json(volunteerSubmissions);
});

// External API proxy endpoints (with caching)

// HUD Data proxy
app.get('/api/external/hud', cacheMiddleware(24 * 60 * 60 * 1000), async (req, res) => {
  try {
    const { coc = 'KY-501', year = new Date().getFullYear() } = req.query;

    // Note: HUD data is typically available as downloadable files
    // This is a placeholder - real implementation would parse Excel/CSV files
    const response = await axios.get(`${process.env.HUD_API_URL}`, {
      timeout: 10000
    });

    res.json({
      success: true,
      data: response.data,
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
    const response = await axios.get(
      `${process.env.LOUISVILLE_DATA_URL}/homeless-stats`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.LOUISVILLE_API_KEY}`
        },
        timeout: 10000
      }
    );

    res.json({
      success: true,
      data: response.data,
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
    const { q = 'homelessness Louisville', rows = 10 } = req.query;

    const response = await axios.get(
      `${process.env.DATAGOV_API_URL}/package_search`,
      {
        params: { q, rows },
        headers: {
          'X-API-Key': process.env.DATAGOV_API_KEY
        },
        timeout: 10000
      }
    );

    res.json({
      success: true,
      data: response.data,
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
  // In production, this would fetch from a database
  // For now, return mock data matching impact-metrics.json
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

    // In production, store these in a database
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

// Admin endpoints (basic - add auth later)

// Add new resource
app.post('/api/admin/resources', (req, res) => {
  const newResource = {
    id: resourceLocations.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  resourceLocations.push(newResource);
  res.status(201).json(newResource);
});

// Update resource
app.put('/api/admin/resources/:id', (req, res) => {
  const index = resourceLocations.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  resourceLocations[index] = {
    ...resourceLocations[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(resourceLocations[index]);
});

// Delete resource
app.delete('/api/admin/resources/:id', (req, res) => {
  const index = resourceLocations.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  resourceLocations.splice(index, 1);
  res.status(204).send();
});

// Data ingestion from Louisville Open Data Portal
async function fetchLouisvilleData() {
  try {
    console.log('Fetching Louisville homelessness data...');

    // Example: Louisville Metro Open Data Portal
    // Using ArcGIS REST API for Louisville Metro data
    const response = await axios.get(
      'https://services1.arcgis.com/79kfd2K6fskCAkyg/arcgis/rest/services/Homeless_Service_Providers/FeatureServer/0/query',
      {
        params: {
          where: '1=1',
          outFields: '*',
          f: 'json'
        }
      }
    );

    if (response.data && response.data.features) {
      console.log(`Fetched ${response.data.features.length} homeless service providers from Louisville Open Data`);
      // Process and update resourceLocations if needed
      // This is a placeholder - actual data structure may vary
    }

  } catch (error) {
    console.error('Error fetching Louisville data:', error.message);
  }
}

// Weather alert check for extreme weather nights
async function checkWeatherAlerts() {
  try {
    // National Weather Service API for Louisville
    const response = await axios.get(
      'https://api.weather.gov/alerts/active?point=38.2527,-85.7585'
    );

    homelessnessData.alerts = [];

    if (response.data && response.data.features) {
      response.data.features.forEach(alert => {
        if (alert.properties.event.includes('Cold') ||
            alert.properties.event.includes('Heat') ||
            alert.properties.event.includes('Winter')) {
          homelessnessData.alerts.push({
            type: 'weather',
            severity: alert.properties.severity,
            event: alert.properties.event,
            headline: alert.properties.headline,
            description: alert.properties.description,
            instruction: alert.properties.instruction
          });
        }
      });

      if (homelessnessData.alerts.length > 0) {
        console.log(`${homelessnessData.alerts.length} weather alerts detected`);
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Initial data fetch on startup
fetchLouisvilleData();
checkWeatherAlerts();

app.listen(PORT, () => {
  console.log(`🚀 Touch of Terra Dashboard API running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/stats/current`);
  console.log(`📍 Resources: http://localhost:${PORT}/api/resources`);
});

module.exports = app;

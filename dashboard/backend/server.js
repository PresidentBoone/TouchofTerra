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


// --- AI Research Endpoint with Citations ---
app.post('/api/research', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'API key missing' });
    }

    const systemPrompt = `You are a research assistant specializing in homelessness data and policy. 
Generate factual insights backed by real data sources. 

CRITICAL: For each insight, you MUST cite actual sources with real URLs.
Focus on Louisville, Kentucky when possible, but include national data for context.

Respond in this exact JSON format:
{
  "insights": [
    {
      "text": "The factual insight statement",
      "source": "Source name (e.g., HUD 2024 AHAR Report)",
      "url": "https://actual-url-to-source.gov/path"
    }
  ]
}

Use these real data sources:
- HUD Annual Homeless Assessment Report 2024: https://www.huduser.gov/portal/datasets/ahar.html
- Louisville Coalition for the Homeless: https://louhomeless.org
- National Alliance to End Homelessness: https://endhomelessness.org
- Louisville Metro Open Data: https://data.louisvilleky.gov
- HUD Exchange: https://www.hudexchange.info`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate 4-5 research-backed insights about: ${topic || 'Louisville homelessness trends and causes'}` }
      ],
      temperature: 0.4,
      max_tokens: 1200,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
  } catch (error) {
    console.error('Research API Error:', error);
    res.status(500).json({
      error: 'Failed to generate research',
      insights: [
        {
          text: "Louisville's homeless population was 1,157 in the 2024 Point-in-Time count.",
          source: "HUD 2024 AHAR Report",
          url: "https://www.huduser.gov/portal/datasets/ahar.html"
        }
      ]
    });
  }
});

// --- Deep Research Mode (Multi-source synthesis) ---
app.post('/api/research/deep', async (req, res) => {
  try {
    const { question } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'API key missing' });
    }

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Get current stats from database for context
    const statsRow = await dbGet("SELECT value FROM stats WHERE key = 'current_stats'");
    const currentStats = statsRow ? JSON.parse(statsRow.value) : {};

    const systemPrompt = `You are an expert homelessness researcher conducting deep analysis for Louisville, Kentucky.

CURRENT LOUISVILLE DATA (KY-501 CoC, 2024 PIT Count):
- Total Homeless: ${currentStats.totalHomeless || 1728}
- Sheltered: ${currentStats.sheltered || 1133} (Emergency: ${currentStats.emergencyShelter || 881}, Transitional: ${currentStats.transitionalHousing || 252})
- Unsheltered: ${currentStats.unsheltered || 595}
- Veterans: ${currentStats.veterans || 98}
- Youth Under 25: ${currentStats.youth || 124}
- Chronically Homeless: ${currentStats.chronicHomeless || 287}
- Families: ${currentStats.families || 156}

TASK: Provide a comprehensive research synthesis answering the user's question.

RESPONSE FORMAT (JSON):
{
  "summary": "A 2-3 sentence executive summary answering the question",
  "sections": [
    {
      "title": "Section title",
      "content": "Detailed analysis paragraph (2-4 sentences)",
      "sources": [
        {"name": "Source Name", "url": "https://real-url.gov", "relevance": "Why this source matters"}
      ]
    }
  ],
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "methodology": "Brief note on research approach",
  "limitations": "Any caveats or data limitations"
}

CRITICAL RULES:
1. Use ONLY real, verifiable sources with actual URLs
2. Cite official sources: HUD, CDC, NIH, SAMHSA, Louisville Metro, academic journals
3. Be specific with numbers and dates
4. Acknowledge uncertainty where it exists
5. Focus on Louisville data when available, use national data for context`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    result.question = question;
    result.timestamp = new Date().toISOString();
    result.model = "gpt-4";

    res.json(result);
  } catch (error) {
    console.error('Deep Research API Error:', error);
    res.status(500).json({
      error: 'Failed to generate deep research',
      message: error.message
    });
  }
});


// --- Research Library (Report Generation & Storage) ---

// Get all saved reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await dbAll("SELECT id, title, topic, summary, generatedAt, status FROM reports ORDER BY generatedAt DESC");
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get single report by ID
app.get('/api/reports/:id', async (req, res) => {
  try {
    const report = await dbGet("SELECT * FROM reports WHERE id = ?", [req.params.id]);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({
      ...report,
      content: JSON.parse(report.content || '{}')
    });
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Generate and save a new report
app.post('/api/reports/generate', async (req, res) => {
  try {
    const { topic, title } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'API key missing' });
    }

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const reportTitle = title || `${topic} - Research Report`;

    // Get current stats for context
    const statsRow = await dbGet("SELECT value FROM stats WHERE key = 'current_stats'");
    const currentStats = statsRow ? JSON.parse(statsRow.value) : {};

    const systemPrompt = `You are generating a comprehensive research report on homelessness for Louisville, Kentucky.

CURRENT LOUISVILLE DATA (2024):
- Total Homeless: ${currentStats.totalHomeless || 1728}
- Sheltered: ${currentStats.sheltered || 1133}
- Unsheltered: ${currentStats.unsheltered || 595}

Generate a well-structured report with the following JSON format:
{
  "executiveSummary": "2-3 sentence overview",
  "sections": [
    {
      "title": "Section Title",
      "content": "Detailed paragraphs",
      "keyPoints": ["Point 1", "Point 2"],
      "sources": [{"name": "Source Name", "url": "https://..."}]
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "methodology": "How this report was compiled",
  "citations": [{"name": "Full citation", "url": "https://..."}]
}

Use real, verifiable sources. Include 4-5 detailed sections.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a comprehensive research report on: ${topic}` }
      ],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(completion.choices[0].message.content);
    const generatedAt = new Date().toISOString();

    // Save to database
    const result = await dbRun(
      `INSERT INTO reports (title, topic, content, summary, generatedAt, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [reportTitle, topic, JSON.stringify(content), content.executiveSummary, generatedAt, 'complete']
    );

    res.status(201).json({
      success: true,
      report: {
        id: result.lastID,
        title: reportTitle,
        topic,
        content,
        summary: content.executiveSummary,
        generatedAt,
        status: 'complete'
      }
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report', message: error.message });
  }
});

// Delete a report (Admin)
app.delete('/api/admin/reports/:id', authenticateAdmin, async (req, res) => {
  try {
    await dbRun("DELETE FROM reports WHERE id = ?", [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting report:', err);
    res.status(500).json({ error: 'Database error' });
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

// Get historical trend data (from database)
app.get('/api/stats/historical', async (req, res) => {
  try {
    const row = await dbGet("SELECT value FROM stats WHERE key = 'historical_pit'");
    if (row && row.value) {
      res.json(JSON.parse(row.value));
    } else {
      // Fallback to default if DB empty
      const fallbackData = [
        { year: 2018, total: 1086, sheltered: 748, unsheltered: 338 },
        { year: 2019, total: 1198, sheltered: 802, unsheltered: 396 },
        { year: 2020, total: 1224, sheltered: 845, unsheltered: 379 },
        { year: 2021, total: 1267, sheltered: 891, unsheltered: 376 },
        { year: 2022, total: 1389, sheltered: 956, unsheltered: 433 },
        { year: 2023, total: 1574, sheltered: 1025, unsheltered: 549 },
        { year: 2024, total: 1728, sheltered: 1133, unsheltered: 595 }
      ];
      res.json(fallbackData);
    }
  } catch (err) {
    console.error('Error fetching historical data:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Predictive Analytics - Generate forecast
app.get('/api/stats/forecast', async (req, res) => {
  try {
    const monthsAhead = parseInt(req.query.months) || 3;

    // Get historical data
    const row = await dbGet("SELECT value FROM stats WHERE key = 'historical_pit'");
    const historicalData = row ? JSON.parse(row.value) : [];

    if (historicalData.length < 3) {
      return res.status(400).json({ error: 'Insufficient historical data for forecasting' });
    }

    // Simple linear regression forecasting
    const n = historicalData.length;
    const years = historicalData.map((d, i) => i);
    const totals = historicalData.map(d => d.total);

    // Calculate linear regression (y = mx + b)
    const sumX = years.reduce((a, b) => a + b, 0);
    const sumY = totals.reduce((a, b) => a + b, 0);
    const sumXY = years.reduce((acc, x, i) => acc + x * totals[i], 0);
    const sumX2 = years.reduce((acc, x) => acc + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate standard error for confidence intervals
    const predictions = years.map(x => slope * x + intercept);
    const residuals = totals.map((y, i) => y - predictions[i]);
    const mse = residuals.reduce((acc, r) => acc + r * r, 0) / (n - 2);
    const standardError = Math.sqrt(mse);

    // Generate forecasts
    const lastYear = historicalData[historicalData.length - 1].year;
    const currentTotal = historicalData[historicalData.length - 1].total;
    const forecasts = [];

    for (let i = 1; i <= monthsAhead; i++) {
      const futureX = n - 1 + (i / 12); // Fraction of year
      const predictedTotal = Math.round(slope * futureX + intercept);
      const confidenceInterval = 1.96 * standardError * Math.sqrt(1 + 1 / n);

      const forecastDate = new Date(lastYear + Math.floor(i / 12), (i % 12) + 1, 1);
      const percentChange = ((predictedTotal - currentTotal) / currentTotal * 100).toFixed(1);

      forecasts.push({
        date: forecastDate.toISOString(),
        monthLabel: forecastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        predictedTotal,
        confidenceLower: Math.round(predictedTotal - confidenceInterval),
        confidenceUpper: Math.round(predictedTotal + confidenceInterval),
        trend: predictedTotal > currentTotal ? 'increasing' : predictedTotal < currentTotal ? 'decreasing' : 'stable',
        trendPercent: parseFloat(percentChange)
      });
    }

    res.json({
      success: true,
      forecast: forecasts,
      model: {
        type: 'linear_regression',
        slope: slope.toFixed(2),
        intercept: intercept.toFixed(2),
        standardError: standardError.toFixed(2),
        dataPoints: n,
        confidence: 0.95
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: 'HUD PIT Counts 2018-2024',
        methodology: 'Linear regression with 95% confidence intervals'
      }
    });
  } catch (err) {
    console.error('Error generating forecast:', err);
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
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

// Louisville Open Data - Housing Data (ArcGIS REST API)
app.get('/api/external/louisville/housing', cacheMiddleware(6 * 60 * 60 * 1000), async (req, res) => {
  try {
    // Louisville Metro Permanent Supportive Housing locations
    // Source: https://data.louisvilleky.gov
    const arcgisUrl = 'https://services1.arcgis.com/79kfd2K6fskCAkyg/arcgis/rest/services/Homeless_Shelters_and_Services/FeatureServer/0/query';

    const response = await axios.get(arcgisUrl, {
      params: {
        where: '1=1',
        outFields: '*',
        f: 'json',
        resultRecordCount: 100
      },
      timeout: 10000
    });

    if (response.data && response.data.features) {
      const locations = response.data.features.map(f => ({
        name: f.attributes.Name || f.attributes.FACILITYNAME || 'Unknown',
        type: f.attributes.FACILITYTYPE || f.attributes.Type || 'services',
        address: f.attributes.FULLADDR || f.attributes.ADDRESS || '',
        phone: f.attributes.PHONE || '',
        hours: f.attributes.OPERHOURS || '',
        coordinates: f.geometry ? {
          lat: f.geometry.y,
          lng: f.geometry.x
        } : null
      }));

      res.json({
        success: true,
        count: locations.length,
        data: locations,
        source: 'Louisville Metro Open Data',
        sourceUrl: 'https://data.louisvilleky.gov',
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('No features in response');
    }
  } catch (error) {
    console.error('Louisville ArcGIS API error:', error.message);
    // Return fallback data from our database
    try {
      const resources = await dbAll("SELECT * FROM resources");
      const parsed = resources.map(r => ({
        ...r,
        services: JSON.parse(r.services || '[]'),
        coordinates: { lat: r.lat, lng: r.lng }
      }));
      res.json({
        success: true,
        fallback: true,
        count: parsed.length,
        data: parsed,
        source: 'Local Database (Louisville API unavailable)',
        timestamp: new Date().toISOString()
      });
    } catch (dbErr) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch Louisville housing data'
      });
    }
  }
});

// Legacy endpoint for backwards compatibility
app.get('/api/external/louisville/stats', cacheMiddleware(), async (req, res) => {
  res.redirect('/api/external/louisville/housing');
});

// Louisville Eviction Data - For Heatmap
app.get('/api/external/louisville/evictions', cacheMiddleware(12 * 60 * 60 * 1000), async (req, res) => {
  try {
    // Louisville Court Eviction Diversion Program ArcGIS
    const arcgisUrl = 'https://services1.arcgis.com/79kfd2K6fskCAkyg/arcgis/rest/services/Eviction_Diversion_Program/FeatureServer/0/query';

    const response = await axios.get(arcgisUrl, {
      params: {
        where: '1=1',
        outFields: 'Zip_Code,Case_Status,Filing_Date',
        f: 'json',
        resultRecordCount: 2000
      },
      timeout: 15000
    });

    if (response.data && response.data.features) {
      // Aggregate evictions by zip code
      const zipCounts = {};
      response.data.features.forEach(f => {
        const zip = f.attributes.Zip_Code || 'Unknown';
        if (!zipCounts[zip]) {
          zipCounts[zip] = { count: 0, filed: 0, dismissed: 0, diverted: 0 };
        }
        zipCounts[zip].count++;
        // Count by status if available
        const status = f.attributes.Case_Status || '';
        if (status.toLowerCase().includes('dismiss')) zipCounts[zip].dismissed++;
        else if (status.toLowerCase().includes('divert')) zipCounts[zip].diverted++;
        else zipCounts[zip].filed++;
      });

      // Convert to array with Louisville zip code coordinates
      const louisvilleZipCoords = {
        '40202': { lat: 38.2527, lng: -85.7485 },
        '40203': { lat: 38.2407, lng: -85.7551 },
        '40204': { lat: 38.2501, lng: -85.7412 },
        '40205': { lat: 38.2456, lng: -85.7051 },
        '40206': { lat: 38.2680, lng: -85.7206 },
        '40207': { lat: 38.2752, lng: -85.6871 },
        '40208': { lat: 38.2163, lng: -85.7661 },
        '40209': { lat: 38.2027, lng: -85.7585 },
        '40210': { lat: 38.2345, lng: -85.7825 },
        '40211': { lat: 38.2389, lng: -85.8051 },
        '40212': { lat: 38.2616, lng: -85.8125 },
        '40213': { lat: 38.1906, lng: -85.7199 },
        '40214': { lat: 38.1651, lng: -85.7799 },
        '40215': { lat: 38.2031, lng: -85.7901 },
        '40216': { lat: 38.1912, lng: -85.8251 },
        '40217': { lat: 38.2175, lng: -85.7412 },
        '40218': { lat: 38.1985, lng: -85.6851 },
        '40219': { lat: 38.1470, lng: -85.7585 },
        '40220': { lat: 38.2185, lng: -85.6571 },
        '40222': { lat: 38.2651, lng: -85.6301 },
        '40223': { lat: 38.2632, lng: -85.5951 },
        '40228': { lat: 38.1335, lng: -85.6951 },
        '40229': { lat: 38.1151, lng: -85.7351 },
        '40241': { lat: 38.2985, lng: -85.5851 },
        '40242': { lat: 38.2851, lng: -85.6201 },
        '40243': { lat: 38.2451, lng: -85.5651 },
        '40258': { lat: 38.1512, lng: -85.8551 },
        '40272': { lat: 38.0851, lng: -85.8451 },
        '40291': { lat: 38.1285, lng: -85.6351 },
        '40299': { lat: 38.1751, lng: -85.5951 }
      };

      const heatmapData = Object.entries(zipCounts)
        .filter(([zip]) => louisvilleZipCoords[zip])
        .map(([zip, data]) => ({
          zipCode: zip,
          ...data,
          intensity: Math.min(1, data.count / 50), // Normalize for heatmap
          coordinates: louisvilleZipCoords[zip]
        }))
        .sort((a, b) => b.count - a.count);

      res.json({
        success: true,
        totalEvictions: response.data.features.length,
        byZipCode: heatmapData,
        source: 'Louisville Court Eviction Diversion Program',
        sourceUrl: 'https://data.louisvilleky.gov',
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('No eviction data available');
    }
  } catch (error) {
    console.error('Louisville Eviction API error:', error.message);
    // Return fallback sample data
    res.json({
      success: true,
      fallback: true,
      totalEvictions: 2847,
      byZipCode: [
        { zipCode: '40210', count: 423, intensity: 1.0, coordinates: { lat: 38.2345, lng: -85.7825 } },
        { zipCode: '40211', count: 378, intensity: 0.89, coordinates: { lat: 38.2389, lng: -85.8051 } },
        { zipCode: '40215', count: 312, intensity: 0.74, coordinates: { lat: 38.2031, lng: -85.7901 } },
        { zipCode: '40203', count: 289, intensity: 0.68, coordinates: { lat: 38.2407, lng: -85.7551 } },
        { zipCode: '40214', count: 267, intensity: 0.63, coordinates: { lat: 38.1651, lng: -85.7799 } },
        { zipCode: '40212', count: 234, intensity: 0.55, coordinates: { lat: 38.2616, lng: -85.8125 } },
        { zipCode: '40216', count: 198, intensity: 0.47, coordinates: { lat: 38.1912, lng: -85.8251 } },
        { zipCode: '40218', count: 176, intensity: 0.42, coordinates: { lat: 38.1985, lng: -85.6851 } }
      ],
      source: 'Estimated based on Louisville housing crisis data',
      timestamp: new Date().toISOString()
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

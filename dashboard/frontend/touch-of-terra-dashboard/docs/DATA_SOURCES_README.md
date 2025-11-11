# Touch of Terra Dashboard - Data Sources Guide

Complete guide for managing, updating, and configuring data sources for the homelessness dashboard.

## Table of Contents
- [Overview](#overview)
- [Primary Data Sources](#primary-data-sources)
- [Data Flow Architecture](#data-flow-architecture)
- [Adding New Data Sources](#adding-new-data-sources)
- [Updating Fallback Data](#updating-fallback-data)
- [API Configuration](#api-configuration)
- [Data Refresh Schedule](#data-refresh-schedule)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Touch of Terra Dashboard aggregates data from multiple sources to provide comprehensive homelessness statistics for Louisville, KY. The system uses a layered approach with fallback mechanisms to ensure reliability.

### Data Hierarchy
1. **Primary**: Live API data from external sources
2. **Secondary**: Cached data from previous successful fetches
3. **Tertiary**: Fallback JSON files stored locally

---

## Primary Data Sources

### 1. HUD Exchange (Federal Level)

**Purpose**: Point-in-Time (PIT) Count and Housing Inventory Count (HIC) data

**Source URL**: https://www.hudexchange.info/

**API Access**:
- HUD data is typically available as Excel/CSV downloads
- Annual data published late spring (covers previous January PIT Count)
- CoC Code for Louisville: **KY-501**

**Data Updated**: Annually (January count, published ~May)

**Implementation Location**:
- Service: `src/services/hudDataService.js`
- Proxy Endpoint: `/api/external/hud`
- Fallback: `public/data/fallback-hud-data.json`

**Sample Data Structure**:
```json
{
  "year": 2024,
  "cocCode": "KY-501",
  "totalHomeless": 1157,
  "sheltered": 680,
  "unsheltered": 477,
  "veterans": 142,
  "youth": 78,
  "families": 89,
  "chronicHomeless": 234
}
```

**Setup Instructions**:
1. Visit HUD Exchange website
2. Navigate to CoC Data Reports
3. Download data for KY-501 (Louisville/Jefferson County)
4. Update fallback JSON with latest data

---

### 2. Louisville Metro Open Data Portal

**Purpose**: Local-level homeless services, shelter capacity, real-time data

**Source URL**: https://data.louisvilleky.gov/

**API Access**:
- REST API available for registered users
- Free API key registration
- ArcGIS REST Services for geospatial data

**Data Updated**: Varies by dataset (some daily, some monthly)

**Implementation Location**:
- Service: `src/services/louisvilleOpenDataService.js`
- Proxy Endpoint: `/api/external/louisville/*`
- Fallback: `public/data/fallback-resources.json`

**Key Datasets**:
- Homeless Service Providers
- Shelter Bed Availability
- 311 Service Requests (homeless-related)
- Social Services Locations

**Setup Instructions**:
1. Create account at data.louisvilleky.gov
2. Generate API key
3. Add key to `.env`: `LOUISVILLE_API_KEY=your_key`
4. Update `louisvilleOpenDataService.js` with correct endpoint URLs

---

### 3. Data.gov (Federal Datasets)

**Purpose**: Federal homelessness statistics, housing data, veteran data

**Source URL**: https://catalog.data.gov/

**API Access**:
- CKAN API (open source data portal)
- API key recommended for higher rate limits
- Free registration

**Data Updated**: Varies by dataset

**Implementation Location**:
- Service: `src/services/dataGovService.js`
- Proxy Endpoint: `/api/external/datagov/*`

**Useful Datasets**:
- HUD AHAR (Annual Homeless Assessment Report)
- VA Homeless Services
- HHS SAMHSA homelessness data
- Fair Market Rent data

**Setup Instructions**:
1. Register at data.gov
2. Generate API key
3. Add to `.env`: `DATAGOV_API_KEY=your_key`

---

### 4. National Weather Service API

**Purpose**: Weather alerts for extreme conditions (Code Red/Blue nights)

**Source URL**: https://api.weather.gov/

**API Access**:
- No API key required
- RESTful API
- Louisville coordinates: 38.2527, -85.7585

**Data Updated**: Real-time

**Implementation Location**:
- Backend: `dashboard/backend/server.js` (checkWeatherAlerts function)
- Endpoint: `/api/alerts`

**Alert Types Monitored**:
- Cold Weather Warnings
- Heat Advisories
- Winter Storm Warnings

**Sample Request**:
```bash
curl https://api.weather.gov/alerts/active?point=38.2527,-85.7585
```

---

### 5. Google Maps Geocoding API

**Purpose**: Address geocoding, ZIP code search, distance calculations

**Source URL**: https://developers.google.com/maps/documentation/geocoding

**API Access**:
- Requires API key
- Paid service (free tier: 28,000 requests/month)
- OpenStreetMap Nominatim used as fallback

**Implementation Location**:
- Utility: `src/utils/geocoder.js`
- Used in: EnhancedResourceMap component

**Setup Instructions**:
1. Create Google Cloud Project
2. Enable Geocoding API
3. Generate API key with restrictions
4. Add to `.env`: `VITE_GOOGLE_MAPS_API_KEY=your_key`

**Cost Optimization**:
- Cache geocoding results
- Use OpenStreetMap Nominatim as free fallback
- Restrict API key to specific domains

---

## Data Flow Architecture

```
┌─────────────────┐
│  Frontend App   │
└────────┬────────┘
         │
         ├─→ Data Aggregator Service
         │   └─→ Combines multiple sources
         │       ├─→ HUD Data Service
         │       ├─→ Louisville Service
         │       └─→ Data.gov Service
         │
         ├─→ Backend API Proxy
         │   └─→ Caches responses
         │       └─→ External APIs
         │
         └─→ Fallback JSON Files
             (when APIs unavailable)
```

### Data Aggregation Logic

Located in: `src/services/dataAggregator.js`

**Priority Order**:
1. Louisville local data (most specific)
2. HUD federal data (authoritative)
3. Data.gov supplementary data
4. Fallback JSON (last resort)

**Caching**:
- In-memory cache with TTL (1 hour default)
- Service Worker cache for offline
- Backend cache for API responses

---

## Adding New Data Sources

### Step 1: Create Service File

Create new file in `src/services/`:

```javascript
// src/services/newDataService.js
import config from '../config/environment';

export const fetchNewData = async () => {
  try {
    const response = await fetch(`${config.backendUrl}/api/external/new-source`);
    const data = await response.json();

    return {
      success: true,
      data: transformNewData(data),
      source: 'New Data Source',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching new data:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const transformNewData = (rawData) => {
  // Transform to standard format
  return {
    // your data structure
  };
};

export default { fetchNewData };
```

### Step 2: Add Backend Proxy Endpoint

Edit `dashboard/backend/server.js`:

```javascript
app.get('/api/external/new-source', cacheMiddleware(), async (req, res) => {
  try {
    const response = await axios.get(
      process.env.NEW_SOURCE_API_URL,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEW_SOURCE_API_KEY}`
        },
        timeout: 10000
      }
    );

    res.json({
      success: true,
      data: response.data,
      source: 'New Source',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('New source API error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch new source data'
    });
  }
});
```

### Step 3: Update Data Aggregator

Edit `src/services/dataAggregator.js`:

```javascript
import newDataService from './newDataService';

export const fetchCombinedStats = async () => {
  const [existingData, newData] = await Promise.allSettled([
    existingService.fetchData(),
    newDataService.fetchNewData(),
  ]);

  // Merge results
  return mergeData([existingData, newData]);
};
```

### Step 4: Add Environment Variables

```env
# Frontend .env
VITE_NEW_SOURCE_API_KEY=your_key

# Backend .env
NEW_SOURCE_API_URL=https://api.newsource.com
NEW_SOURCE_API_KEY=your_key
```

### Step 5: Create Fallback Data

Add `public/data/new-source-fallback.json` with sample data.

---

## Updating Fallback Data

Fallback data ensures the dashboard works even when APIs are unavailable.

### Location
- `public/data/fallback-hud-data.json`
- `public/data/fallback-resources.json`
- `public/data/impact-metrics.json`

### Update Process

**1. Download Latest Data**:
- Visit primary source website
- Export data as JSON/CSV
- Convert to required format

**2. Validate Structure**:
```bash
# Validate JSON syntax
jq . public/data/fallback-hud-data.json
```

**3. Update File**:
```json
{
  "currentStats": {
    "totalHomeless": 1157,
    "sheltered": 680,
    "unsheltered": 477,
    // ... other fields
    "lastUpdated": "2024-01-15T00:00:00Z"
  },
  "historicalData": [
    // array of historical points
  ]
}
```

**4. Test Offline**:
- Set browser to offline mode
- Verify data loads from fallback
- Check Service Worker cache

---

## API Configuration

### Rate Limits

**Default Limits** (configurable in backend `.env`):
- Window: 15 minutes
- Max requests: 100 per IP

**External API Limits**:
- Google Maps: 28,000 requests/month (free tier)
- Data.gov: 1,000 requests/hour (with API key)
- HUD Exchange: No official limit (file downloads)
- Weather.gov: No authentication required

### Cache Duration

**Backend Cache TTL** (in seconds):
```env
CACHE_TTL=3600  # 1 hour

# Or per-endpoint in code:
app.get('/api/stats', cacheMiddleware(24 * 60 * 60 * 1000), ...);  // 24 hours
```

**Frontend Cache**:
- In-memory: 1 hour
- Service Worker: Until manually cleared
- Browser cache: Respects HTTP cache headers

---

## Data Refresh Schedule

### Automatic Refresh (Backend)

**Cron Schedule** (in `server.js`):
```javascript
// Every 6 hours
cron.schedule('0 */6 * * *', () => {
  fetchLouisvilleData();
});

// Every hour
cron.schedule('0 * * * *', () => {
  checkWeatherAlerts();
});
```

**Cron Format**: `minute hour day month weekday`
- `0 */6 * * *` = Every 6 hours at minute 0
- `0 0 * * *` = Daily at midnight
- `0 0 * * 0` = Weekly on Sunday at midnight

### Manual Refresh (Frontend)

**Programmatic**:
```javascript
import dataAggregator from './services/dataAggregator';

await dataAggregator.refreshAllData();
```

**UI Button**:
All major components have a "Refresh" button that clears cache and fetches fresh data.

---

## Troubleshooting

### API Connection Issues

**Problem**: "Failed to fetch data from [source]"

**Solutions**:
1. Check API key is valid and set in `.env`
2. Verify backend is running and accessible
3. Check API rate limits not exceeded
4. Inspect browser Network tab for error details
5. Test direct API call with curl

**Example curl test**:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://data.louisvilleky.gov/api/homeless-stats
```

### Data Not Updating

**Problem**: Dashboard shows stale data

**Solutions**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear Service Worker cache:
   - DevTools > Application > Clear storage
3. Restart backend server to clear server cache
4. Check cron schedule is running:
   ```bash
   # Check cron logs
   tail -f /var/log/syslog | grep CRON
   ```

### Fallback Data Not Loading

**Problem**: Dashboard shows errors in offline mode

**Solutions**:
1. Verify fallback JSON files exist in `public/data/`
2. Check JSON syntax is valid
3. Ensure Service Worker is registered
4. Check browser console for Service Worker errors

### Rate Limit Exceeded

**Problem**: "Too many requests" error

**Solutions**:
1. Implement exponential backoff in retry logic
2. Increase cache TTL to reduce API calls
3. Upgrade to paid API tier if available
4. Use fallback data during high-traffic periods

---

## Best Practices

### Data Quality
- Validate all incoming data before storing
- Log data transformation errors
- Monitor data freshness (check lastUpdated timestamps)
- Compare data across sources for discrepancies

### Performance
- Cache aggressively (1-24 hours for static data)
- Use CDN for fallback JSON files
- Compress large datasets
- Paginate large result sets

### Security
- Never commit API keys to version control
- Use environment variables for all secrets
- Rotate API keys periodically
- Restrict API key permissions to minimum required

### Reliability
- Always provide fallback data
- Implement retry logic with exponential backoff
- Monitor API health and uptime
- Set up alerts for data staleness

---

## Support

For data source issues:
- **Coalition for the Homeless**: (502) 589-3777
- **Louisville Metro Open Data**: data@louisvilleky.gov
- **Technical Support**: touchofterralouisville@gmail.com

---

**Last Updated**: January 2025
**Version**: 1.0.0

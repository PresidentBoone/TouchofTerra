# Touch of Terra Dashboard - Deployment Guide

Complete guide for deploying the Touch of Terra Homelessness Dashboard to production environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Deployment Platforms](#deployment-platforms)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher (or yarn/pnpm)
- **Git**: For version control

### Required Accounts (for production)
- **Netlify** or **Vercel** account (for frontend hosting)
- **Railway** or **Heroku** account (for backend hosting)
- **Google Maps API** key (for geocoding features)
- **HUD Exchange** access (for homelessness data)
- **Louisville Open Data** API key (optional)
- **Data.gov API** key (optional)

---

## Environment Configuration

### Frontend Environment Variables

Create `.env` file in `/dashboard/frontend/touch-of-terra-dashboard/`:

```env
# API URLs
VITE_API_URL=https://your-backend-api.railway.app
VITE_BACKEND_URL=https://your-backend-api.railway.app

# External Data Sources
VITE_HUD_API_KEY=your_hud_api_key_here
VITE_LOUISVILLE_API_KEY=your_louisville_api_key_here
VITE_DATAGOV_API_KEY=your_datagov_api_key_here

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# OpenWeather API
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_FORECASTING=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_EXPORT=true

# Data Refresh Intervals (milliseconds)
VITE_DATA_REFRESH_INTERVAL=3600000
VITE_WEATHER_REFRESH_INTERVAL=1800000

# Environment
VITE_NODE_ENV=production
```

### Backend Environment Variables

Create `.env` file in `/dashboard/backend/`:

```env
# Server Configuration
PORT=5001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.netlify.app

# External Data Sources
HUD_API_KEY=your_hud_api_key_here
HUD_API_URL=https://www.hudexchange.info/resource/reportmanagement/published/CoC_PopSub_NatlTerrDC_2024.xlsx

LOUISVILLE_DATA_URL=https://data.louisvilleky.gov/api
LOUISVILLE_API_KEY=your_louisville_api_key_here

DATAGOV_API_KEY=your_datagov_api_key_here
DATAGOV_API_URL=https://catalog.data.gov/api/3/action

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# OpenWeather API
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Cache Configuration
CACHE_TTL=3600

# Data Refresh Schedule (cron format)
DATA_REFRESH_CRON=0 */6 * * *

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_in_production
JWT_SECRET=your_jwt_secret_here

# Logging
LOG_LEVEL=info
```

---

## Local Development

### 1. Install Dependencies

**Frontend:**
```bash
cd dashboard/frontend/touch-of-terra-dashboard
npm install
```

**Backend:**
```bash
cd dashboard/backend
npm install
```

### 2. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd dashboard/backend
npm run dev
# Server runs on http://localhost:5001
```

**Terminal 2 - Frontend:**
```bash
cd dashboard/frontend/touch-of-terra-dashboard
npm run dev
# App runs on http://localhost:5174
```

### 3. Access Dashboard
Open browser to `http://localhost:5174`

---

## Production Deployment

### Build Process

#### Frontend Build
```bash
cd dashboard/frontend/touch-of-terra-dashboard
npm run build
# Output: dist/ directory
```

#### Backend Preparation
```bash
cd dashboard/backend
# No build step needed for Node.js backend
# Ensure package.json has start script:
# "start": "node server.js"
```

---

## Deployment Platforms

### Option 1: Netlify (Frontend) + Railway (Backend)

#### Deploy Backend to Railway

1. **Create Railway Account**: https://railway.app
2. **Create New Project**: Click "New Project"
3. **Deploy from GitHub**:
   - Connect your GitHub repository
   - Select the repository
   - Set root directory: `/dashboard/backend`
4. **Add Environment Variables**:
   - Go to Variables tab
   - Add all backend environment variables
5. **Deploy**:
   - Railway automatically detects Node.js
   - Deployment happens automatically
6. **Get Backend URL**: Copy the Railway-provided URL (e.g., `https://your-app.railway.app`)

#### Deploy Frontend to Netlify

1. **Create Netlify Account**: https://netlify.com
2. **New Site from Git**:
   - Connect GitHub repository
   - Select repository
3. **Build Settings**:
   - Base directory: `dashboard/frontend/touch-of-terra-dashboard`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Environment Variables**:
   - Go to Site settings > Build & deploy > Environment
   - Add all frontend environment variables
   - **Important**: Set `VITE_API_URL` to your Railway backend URL
5. **Deploy Site**: Click "Deploy site"
6. **Custom Domain** (optional):
   - Go to Domain settings
   - Add custom domain

---

### Option 2: Vercel (Frontend + Backend)

Vercel can host both frontend and serverless backend functions.

#### Deploy to Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy Frontend**:
```bash
cd dashboard/frontend/touch-of-terra-dashboard
vercel --prod
```

3. **Deploy Backend as Serverless Functions**:
   - Convert Express routes to Vercel serverless functions
   - Place in `/api` directory
   - Vercel automatically deploys

4. **Environment Variables**:
```bash
vercel env add VITE_API_URL production
vercel env add VITE_GOOGLE_MAPS_API_KEY production
# Add all other variables
```

---

### Option 3: Self-Hosted (VPS/Cloud)

#### Deploy to Ubuntu Server

**1. Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**2. Install PM2 (Process Manager):**
```bash
sudo npm install -g pm2
```

**3. Clone Repository:**
```bash
git clone https://github.com/your-repo/touch-of-terra-dashboard.git
cd touch-of-terra-dashboard
```

**4. Setup Backend:**
```bash
cd dashboard/backend
npm install
cp .env.example .env
# Edit .env with production values
nano .env

# Start with PM2
pm2 start server.js --name touch-of-terra-api
pm2 save
pm2 startup
```

**5. Setup Frontend:**
```bash
cd ../frontend/touch-of-terra-dashboard
npm install
npm run build

# Serve with Nginx
sudo apt-get install nginx
sudo cp dist/* /var/www/html/
```

**6. Configure Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**7. Enable HTTPS with Let's Encrypt:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Post-Deployment

### 1. Verify Deployment

**Check Frontend:**
- Visit your deployed URL
- Verify all pages load
- Check browser console for errors

**Check Backend:**
- Test API endpoints: `https://your-api.com/api/health`
- Verify data loads correctly

### 2. Enable Service Worker

Service Worker is automatically registered. Verify in Chrome DevTools:
1. Open DevTools > Application tab
2. Check Service Workers section
3. Verify "activated and running"

### 3. Test Offline Mode

1. Open DevTools > Network tab
2. Set throttling to "Offline"
3. Refresh page
4. Verify fallback data loads

### 4. Monitor Performance

**Using Lighthouse:**
```bash
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### 5. Setup Monitoring

**Recommended Tools:**
- **Sentry**: Error tracking
- **Google Analytics**: User analytics
- **Uptime Robot**: Uptime monitoring
- **LogRocket**: Session replay

---

## Troubleshooting

### Frontend Issues

**Build Fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variables Not Loading:**
- Verify `.env` file exists
- Check variable names start with `VITE_`
- Rebuild after changing env vars

**API Connection Failed:**
- Verify `VITE_API_URL` points to correct backend
- Check CORS settings on backend
- Verify backend is running

### Backend Issues

**Port Already in Use:**
```bash
# Find and kill process
lsof -ti:5001 | xargs kill -9
```

**External API Failures:**
- Check API keys are valid
- Verify API rate limits not exceeded
- Check fallback data is loading

**Memory Issues:**
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`
- Optimize cache size in code

### Performance Issues

**Slow Load Times:**
- Enable gzip compression on server
- Optimize images
- Implement lazy loading
- Use CDN for static assets

**High Memory Usage:**
- Clear cache periodically
- Reduce data refresh intervals
- Optimize data structures

---

## Continuous Deployment

### GitHub Actions (Automated Deployment)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Dashboard

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          curl -X POST ${{ secrets.RAILWAY_WEBHOOK_URL }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Netlify
        run: |
          npm install -g netlify-cli
          cd dashboard/frontend/touch-of-terra-dashboard
          npm install
          npm run build
          netlify deploy --prod --dir=dist --auth=${{ secrets.NETLIFY_TOKEN }}
```

---

## Support

For deployment issues:
- **Email**: touchofterralouisville@gmail.com
- **GitHub Issues**: https://github.com/your-repo/touch-of-terra/issues
- **Documentation**: See other README files in `/docs`

---

**Last Updated**: January 2025
**Version**: 1.0.0

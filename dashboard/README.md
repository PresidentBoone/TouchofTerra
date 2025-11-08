# Touch of Terra Homelessness Dashboard

A comprehensive web application serving Touch of Terra, Inc. to visualize homelessness data, provide resource mapping, and support data-driven advocacy in Louisville, KY.

![Dashboard Preview](screenshots/dashboard-preview.png)

## 🎯 Project Overview

This dashboard provides three core modules:
1. **Public Dashboard** - Real-time statistics, trend analysis, and policy insights
2. **Resource Map/Finder** - Interactive map of shelters, food banks, clinics, and services
3. **Admin Portal** - Resource management and data entry interface

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 (Vite)
- TailwindCSS for styling
- Recharts for data visualization
- Leaflet/React-Leaflet for mapping
- Responsive design with mobile-first approach

**Backend:**
- Node.js with Express
- RESTful API architecture
- In-memory storage (MVP) - ready for Firebase/PostgreSQL
- Scheduled data ingestion with node-cron
- CORS-enabled for cross-origin requests

**Data Sources:**
- Coalition for the Homeless (Louisville Census)
- Louisville Metro Open Data Portal (ArcGIS Hub)
- National Weather Service API (weather alerts)
- Kentucky Housing Corporation (K-Count data)

## 📁 Project Structure

```
dashboard/
├── backend/
│   ├── server.js          # Express API server
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
└── frontend/
    └── touch-of-terra-dashboard/
        ├── src/
        │   ├── components/
        │   │   ├── Dashboard.jsx      # Main dashboard with metrics
        │   │   ├── ResourceMap.jsx    # Interactive map
        │   │   ├── AdminPortal.jsx    # Admin CRUD interface
        │   │   ├── StarsBackground.jsx # Animated background
        │   │   └── ThemeToggle.jsx    # Light/dark mode toggle
        │   ├── App.jsx               # Main app component
        │   ├── index.css             # Tailwind + custom styles
        │   └── main.jsx              # React entry point
        ├── public/
        ├── package.json              # Frontend dependencies
        ├── tailwind.config.js        # Tailwind configuration
        ├── vite.config.js            # Vite configuration
        └── .env                      # Frontend environment vars
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository:**
```bash
cd /path/to/TouchofTerra-1/dashboard
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend/touch-of-terra-dashboard
npm install
```

4. **Configure environment variables:**

Backend `.env`:
```env
PORT=5000
NODE_ENV=development
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

**Option 1: Run backend and frontend separately**

Terminal 1 - Backend:
```bash
cd dashboard/backend
npm start
```

Terminal 2 - Frontend:
```bash
cd dashboard/frontend/touch-of-terra-dashboard
npm run dev
```

**Option 2: Quick start script** (create this file)

Create `dashboard/start.sh`:
```bash
#!/bin/bash
cd backend && npm start &
cd frontend/touch-of-terra-dashboard && npm run dev
```

Then run:
```bash
chmod +x start.sh
./start.sh
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## 📊 Features

### Dashboard Module
- **Key Metrics:** Total homeless population, sheltered vs unsheltered, bed availability
- **Demographics:** Families, veterans, youth breakdown
- **Trend Charts:** 5-year historical data with line charts
- **Distribution Charts:** Pie charts for sheltered/unsheltered ratio
- **Bed Availability:** Real-time shelter capacity visualization
- **Community Stories:** Human-centered testimonials
- **Policy Insights:** Research bullets and correlations (eviction rates, rent costs)
- **Weather Alerts:** Emergency cold/heat night notifications

### Resource Map Module
- **Interactive Map:** Leaflet-based map of Louisville
- **Filter by Type:** Shelters, food banks, clinics, services
- **Resource Cards:** Clickable cards with details
- **Bed Availability:** Live capacity for shelters
- **Directions:** Direct Google Maps integration
- **Mobile Responsive:** Touch-friendly on all devices

### Admin Portal
- **Add Resources:** Form to create new resource locations
- **Edit Resources:** Update existing entries
- **Delete Resources:** Remove outdated resources
- **Geocoding:** Latitude/longitude input for precise mapping
- **Service Tags:** Multiple services per location

### Design Features
- **Light/Dark Mode:** Default dark mode with starry sky background
- **Gradient Boxes:** Brand-consistent (#2a357a → #f3e6ff palette)
- **Box Animations:** Hover effects and slide-up animations
- **Responsive:** Desktop, tablet, and mobile optimized
- **Accessibility:** High contrast, readable fonts, keyboard navigation

## 🔌 API Endpoints

### Public Endpoints

```
GET  /api/stats/current          # Current homelessness statistics
GET  /api/stats/historical       # 5-year trend data
GET  /api/stats/beds            # Shelter bed availability
GET  /api/resources             # All resource locations
GET  /api/resources?type=shelter # Filter by type
GET  /api/resources/:id         # Single resource by ID
GET  /api/alerts                # Weather/emergency alerts
GET  /api/health                # API health check
```

### Admin Endpoints (Add authentication in production)

```
POST   /api/admin/resources     # Create new resource
PUT    /api/admin/resources/:id # Update resource
DELETE /api/admin/resources/:id # Delete resource
```

## 📈 Data Pipeline

### Current Implementation (MVP)

The backend includes:
1. **Initial data seeding:** 10 real Louisville resources pre-populated
2. **Scheduled updates:** Cron jobs run every 6 hours to fetch Louisville Open Data
3. **Weather monitoring:** Hourly checks for extreme weather alerts
4. **API integration:** National Weather Service API for alerts

### Data Sources

**Louisville Metro Open Data Portal:**
```javascript
https://services1.arcgis.com/79kfd2K6fskCAkyg/arcgis/rest/services/Homeless_Service_Providers/FeatureServer/0/query
```

**National Weather Service:**
```javascript
https://api.weather.gov/alerts/active?point=38.2527,-85.7585
```

### Future Production Pipeline

For production deployment:
1. Replace in-memory storage with Firebase Firestore or PostgreSQL
2. Add authentication (Firebase Auth or NextAuth)
3. Implement proper API keys and rate limiting
4. Add data validation and sanitization
5. Schedule more frequent updates (hourly)
6. Add webhook integrations for real-time shelter updates

## 🎨 Customization

### Brand Colors

Update `tailwind.config.js`:
```javascript
colors: {
  primary: {
    dark: '#2a357a',    // Your brand navy
    light: '#f3e6ff',   // Your brand lavender
  },
}
```

### Data Sources

Update API endpoints in `backend/server.js`:
```javascript
// Line 153: Louisville Open Data
const response = await axios.get('YOUR_DATA_PORTAL_URL');

// Line 177: Weather Alerts
const response = await axios.get('YOUR_WEATHER_API_URL');
```

## 🚀 Deployment

### Option 1: Vercel (Recommended for Frontend)

**Frontend:**
```bash
cd frontend/touch-of-terra-dashboard
npm run build
# Deploy dist/ folder to Vercel
```

**Backend:**
Deploy to Vercel Serverless Functions or separate backend hosting

### Option 2: Render

**Backend:**
1. Push to GitHub
2. Create new Web Service on Render
3. Build command: `cd dashboard/backend && npm install`
4. Start command: `npm start`

**Frontend:**
1. Create new Static Site on Render
2. Build command: `cd dashboard/frontend/touch-of-terra-dashboard && npm install && npm run build`
3. Publish directory: `dashboard/frontend/touch-of-terra-dashboard/dist`

### Option 3: AWS

**Backend:** Deploy to AWS Lambda with API Gateway
**Frontend:** Host on S3 + CloudFront
**Database:** RDS PostgreSQL or DynamoDB

### Environment Variables (Production)

Backend:
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=your_database_url
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```

Frontend:
```env
VITE_API_URL=https://your-api-domain.com
```

## 🔐 Security Considerations

### Before Production:

1. **Add Authentication:**
   - Implement Firebase Auth or NextAuth
   - Protect admin routes with middleware
   - Use JWT tokens for API authorization

2. **Rate Limiting:**
   - Add express-rate-limit to prevent abuse
   - Implement API key authentication

3. **Input Validation:**
   - Validate all user inputs
   - Sanitize data before database insertion
   - Use parameterized queries

4. **HTTPS:**
   - Enable SSL certificates
   - Force HTTPS redirects

5. **Environment Variables:**
   - Never commit `.env` files
   - Use proper secret management (AWS Secrets Manager, etc.)

6. **CORS:**
   - Update CORS to whitelist only your frontend domain
   - Remove wildcard origins

## 📱 Screenshots

### Desktop Dashboard
![Desktop Dashboard](screenshots/desktop-dashboard.png)

### Resource Map
![Resource Map](screenshots/resource-map.png)

### Mobile View
![Mobile View](screenshots/mobile-view.png)

### Admin Portal
![Admin Portal](screenshots/admin-portal.png)

## 🧪 Testing

### Manual Testing Checklist

- [ ] Dashboard loads with correct statistics
- [ ] Trend charts display historical data
- [ ] Resource map shows all locations
- [ ] Map markers are clickable
- [ ] Filter buttons work correctly
- [ ] Dark/light mode toggle functions
- [ ] Starry background appears in dark mode
- [ ] Admin portal CRUD operations work
- [ ] Responsive on mobile devices
- [ ] Weather alerts display when active
- [ ] Get Directions links work

### Future Testing

Add automated tests:
- Unit tests: Jest + React Testing Library
- API tests: Supertest
- E2E tests: Playwright or Cypress

## 🔄 Future Enhancements

### Phase 2 Features
- [ ] Live bed availability feed from shelter APIs
- [ ] Emergency shelter "white flag" night notifications
- [ ] Volunteer opportunity matching widget
- [ ] Impact measurement dashboard (backpacks distributed, etc.)
- [ ] SMS/email alerts for emergency openings
- [ ] Multi-language support (Spanish translation)
- [ ] Printable resource guide PDF generation
- [ ] Social media sharing integration

### Phase 3 Features
- [ ] Machine learning predictions for shelter demand
- [ ] Integration with 211 service database
- [ ] Public API for other nonprofits to embed dashboard
- [ ] Mobile app (React Native)
- [ ] Volunteer check-in/tracking system
- [ ] Donation integration (Stripe)
- [ ] Real-time chat support

## 🤝 Contributing

This is a nonprofit project. Contributions welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Contact & Support

**Touch of Terra, Inc.**
- Website: [Your website]
- Email: [Your email]
- GitHub: [Your GitHub]

For technical questions or data updates, please open an issue on GitHub.

## 🙏 Acknowledgments

- Coalition for the Homeless - Louisville Census data
- Louisville Metro Government - Open Data Portal
- National Weather Service - Weather alert API
- Kentucky Housing Corporation - Statewide homelessness data
- OpenStreetMap contributors - Map tiles

---

**Built with ❤️ by Touch of Terra, Inc.**

*Last updated: November 2024*

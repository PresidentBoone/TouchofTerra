# Quick Start Guide - Touch of Terra Dashboard

Get the dashboard running in under 5 minutes!

## Prerequisites

Ensure you have installed:
- Node.js 18+ ([Download](https://nodejs.org))
- npm (comes with Node.js)

Verify installation:
```bash
node --version  # Should show v18 or higher
npm --version   # Should show 9 or higher
```

## Step 1: Navigate to Dashboard Directory

```bash
cd /Users/dylonboone/ToT\ Website/TouchofTerra-1/dashboard
```

## Step 2: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend/touch-of-terra-dashboard
npm install
```

## Step 3: Start the Application

### Option A: Automatic Start (Recommended)

From the `dashboard` directory:
```bash
./start.sh
```

This will start both backend and frontend automatically!

### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd dashboard/backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd dashboard/frontend/touch-of-terra-dashboard
npm run dev
```

## Step 4: Access the Dashboard

Open your browser and navigate to:

- **Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

## What You'll See

### Dashboard View (Default)
- Key metrics cards showing homeless population statistics
- 5-year trend line chart
- Sheltered vs unsheltered pie chart
- Bed availability progress bar
- Community stories
- Policy insights

### Resource Map View
- Interactive map of Louisville with 10 pre-loaded resources
- Filter buttons: Shelters, Food, Medical, Services
- Clickable resource cards
- "Get Directions" links to Google Maps

### Admin Portal
- Add new resource locations
- Edit existing resources
- Delete resources
- Full CRUD functionality

## Features to Try

1. **Toggle Dark/Light Mode** - Click the sun/moon icon in the header
2. **View Trend Charts** - Scroll down on Dashboard to see 5-year trends
3. **Filter Resources** - Click filter buttons on Resource Map
4. **Add a Resource** - Go to Admin Portal, click "+ Add Resource"
5. **Interactive Map** - Click markers to see resource details
6. **Get Directions** - Click "Get Directions" on any resource

## Troubleshooting

### Port Already in Use

If you see "Port 5000 is already in use":
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

If port 5173 is in use:
```bash
lsof -ti:5173 | xargs kill -9
```

### Dependencies Won't Install

Clear npm cache:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Backend Won't Start

Check that `.env` file exists in `dashboard/backend/`:
```bash
cd dashboard/backend
cat .env
```

Should show:
```
PORT=5000
NODE_ENV=development
```

### Frontend Won't Build

Check that `.env` file exists in `dashboard/frontend/touch-of-terra-dashboard/`:
```bash
cd dashboard/frontend/touch-of-terra-dashboard
cat .env
```

Should show:
```
VITE_API_URL=http://localhost:5000
```

### Map Not Loading

The map uses Leaflet with OpenStreetMap tiles, which requires internet connection. Ensure you're online.

### Charts Not Showing

Charts use Recharts library. Check browser console (F12) for errors.

## Stopping the Application

Press `Ctrl+C` in both terminal windows (or in the single terminal if using `start.sh`)

## Next Steps

1. **Customize Data**: Edit `backend/server.js` to modify the statistics and resource data
2. **Add Real Data Sources**: Integrate with Louisville Open Data Portal APIs
3. **Deploy**: Follow the deployment guide in [README.md](./README.md)
4. **Add Authentication**: Protect the Admin Portal with Firebase Auth
5. **Connect Database**: Replace in-memory storage with Firebase or PostgreSQL

## File Structure Quick Reference

```
dashboard/
├── backend/
│   ├── server.js       ← Main API server
│   ├── .env           ← Backend config
│   └── package.json
└── frontend/
    └── touch-of-terra-dashboard/
        ├── src/
        │   ├── components/
        │   │   ├── Dashboard.jsx     ← Main dashboard
        │   │   ├── ResourceMap.jsx   ← Interactive map
        │   │   └── AdminPortal.jsx   ← Admin interface
        │   ├── App.jsx               ← Root component
        │   └── index.css             ← Styles
        ├── .env                      ← Frontend config
        └── package.json
```

## API Endpoints Reference

Test these in your browser or with curl:

```bash
# Current statistics
curl http://localhost:5000/api/stats/current

# Historical data (5 years)
curl http://localhost:5000/api/stats/historical

# All resources
curl http://localhost:5000/api/resources

# Shelter bed availability
curl http://localhost:5000/api/stats/beds

# Weather alerts
curl http://localhost:5000/api/alerts
```

## Default Data Included

The dashboard comes pre-loaded with:

**Statistics:**
- Total Homeless: 1,157
- Sheltered: 680
- Unsheltered: 477
- Families: 89
- Veterans: 142
- Youth: 78

**Resources:** 10 real Louisville locations:
1. Wayside Christian Mission
2. St. John Center
3. The Healing Place
4. Family Health Centers - Phoenix
5. Dare to Care Food Bank
6. St. Vincent de Paul
7. Coalition for the Homeless
8. Home of the Innocents
9. Louisville Rescue Mission
10. Volunteers of America Family Emergency Shelter

## Screenshots Location

After running the app, take screenshots for:
- Desktop dashboard view
- Resource map view
- Mobile view (use browser dev tools)
- Admin portal

Save to `dashboard/screenshots/` for documentation.

## Support

For issues or questions:
- Check the full [README.md](./README.md)
- Review code comments in source files
- Open an issue on GitHub

## Success Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] Dashboard displays metrics correctly
- [ ] Resource map shows 10 locations
- [ ] Map markers are clickable
- [ ] Dark/light mode toggle works
- [ ] Starry background appears in dark mode
- [ ] Admin portal loads
- [ ] Can add/edit/delete resources
- [ ] Charts render properly
- [ ] Mobile responsive design works

---

**You're all set! 🎉**

The Touch of Terra Homelessness Dashboard is now running locally. Start exploring the features and customizing the data to fit your needs!

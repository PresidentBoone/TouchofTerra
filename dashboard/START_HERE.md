# 🚀 START HERE - Touch of Terra Dashboard

## Welcome to Your Homelessness Dashboard!

This application is **complete and ready to run**. Follow these simple steps to launch it.

---

## ⚡ Quick Launch (2 Commands)

### Step 1: Install Dependencies

Open Terminal and run:

```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard/backend"
npm install

cd "../frontend/touch-of-terra-dashboard"
npm install
```

### Step 2: Start the Application

From the dashboard directory:

```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard"
./start.sh
```

**That's it!** Your dashboard will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 📚 Documentation Quick Links

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- **[README.md](./README.md)** - Complete technical documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - What was built and what's next

---

## ✅ What's Included

### 1. Public Dashboard
- Real-time homelessness statistics
- 5-year trend charts
- Shelter bed availability
- Community stories
- Policy insights
- Weather alerts

### 2. Resource Map
- Interactive map of Louisville
- 10 real resource locations pre-loaded
- Filter by type (shelters, food, medical, services)
- "Get Directions" integration
- Mobile-responsive

### 3. Admin Portal
- Add new resources
- Edit existing locations
- Delete outdated resources
- Full resource management

### Design Features
- ✨ Dark mode with starry background (default)
- 🌞 Light mode option
- 📱 Fully responsive
- 🎨 Touch of Terra brand colors
- ⚡ Smooth animations

---

## 🎯 First Things to Try

1. **View the Dashboard**
   - Navigate to http://localhost:5173
   - See key metrics and trend charts
   - Toggle between light and dark mode

2. **Explore the Resource Map**
   - Click "Resource Map" in navigation
   - Filter resources by type
   - Click on map markers for details
   - Try "Get Directions"

3. **Test the Admin Portal**
   - Click "Admin Portal" in navigation
   - Add a new resource location
   - Edit an existing resource
   - See changes reflected on the map

4. **Test Mobile View**
   - Right-click → Inspect (Chrome/Firefox)
   - Click device toolbar icon
   - Select iPhone/iPad to test responsive design

---

## 🔧 Troubleshooting

### Port Already in Use?

Kill the process and restart:
```bash
lsof -ti:5000 | xargs kill -9  # Kill backend
lsof -ti:5173 | xargs kill -9  # Kill frontend
./start.sh                      # Restart
```

### Dependencies Won't Install?

Clear cache and reinstall:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend/touch-of-terra-dashboard
rm -rf node_modules package-lock.json
npm install
```

### Can't See the Map?

Ensure you have internet connection (maps use OpenStreetMap tiles).

---

## 📊 Pre-Loaded Data

Your dashboard comes with:

- **1,157 total homeless** (2024 Louisville data)
- **680 sheltered**, 477 unsheltered
- **10 real resource locations** in Louisville
- **5 years of historical trend data**
- **Real addresses and phone numbers**

All data is editable through the Admin Portal!

---

## 🎨 Customization

### Update Statistics
Edit `backend/server.js` line 14-50 to change numbers

### Change Brand Colors
Edit `frontend/touch-of-terra-dashboard/tailwind.config.js` line 10-13

### Add Resources
Use the Admin Portal at http://localhost:5173 (click Admin Portal tab)

### Modify Layout
Edit React components in `frontend/touch-of-terra-dashboard/src/components/`

---

## 🚀 Deployment to Production

When you're ready to make this live:

1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Set up Firebase (for database)
3. Deploy frontend to Vercel (free)
4. Deploy backend to Render (free tier available)
5. Configure custom domain

**Estimated time to deploy:** 1-2 hours
**Cost:** $0-20/month for small scale

---

## 📦 Project Structure

```
dashboard/
├── START_HERE.md          ← You are here!
├── README.md              ← Full docs
├── QUICKSTART.md          ← Setup guide
├── DEPLOYMENT.md          ← Production guide
├── PROJECT_SUMMARY.md     ← What was built
├── start.sh               ← Auto-start script
│
├── backend/
│   ├── server.js          ← API server
│   └── package.json
│
└── frontend/
    └── touch-of-terra-dashboard/
        ├── src/
        │   ├── components/
        │   │   ├── Dashboard.jsx
        │   │   ├── ResourceMap.jsx
        │   │   ├── AdminPortal.jsx
        │   │   ├── StarsBackground.jsx
        │   │   └── ThemeToggle.jsx
        │   └── App.jsx
        └── package.json
```

---

## ❓ Need Help?

1. Check [QUICKSTART.md](./QUICKSTART.md) for setup issues
2. Review [README.md](./README.md) for technical details
3. Read code comments in source files
4. Check browser console (F12) for errors

---

## 🎉 You're All Set!

Your Touch of Terra Homelessness Dashboard is fully functional and ready to use.

**Next Steps:**
1. Run the application locally (see Quick Launch above)
2. Test all features
3. Customize data for your needs
4. Deploy to production (see DEPLOYMENT.md)
5. Share with your team and stakeholders!

---

**Built for Touch of Terra, Inc.**
*Supporting community advocacy through data-driven insights*

---

## 🏃 Ready to Start?

Run these two commands now:

```bash
# Install dependencies
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard/backend" && npm install
cd "../frontend/touch-of-terra-dashboard" && npm install

# Start application
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard" && ./start.sh
```

Then open: **http://localhost:5173**

Enjoy your new dashboard! 🎊

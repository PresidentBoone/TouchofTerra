# Deploy Dashboard to Vercel - Step by Step Guide

## 🎯 Goal
Deploy the Touch of Terra Homelessness Dashboard to Vercel so it's publicly accessible at a URL like:
- Frontend: `https://tot-dashboard.vercel.app`
- Backend API: `https://tot-dashboard-api.vercel.app`

---

## ✅ Prerequisites

You already have:
- ✅ GitHub account
- ✅ Vercel account (connected to your main website)
- ✅ Dashboard code ready

---

## 📋 Deployment Steps

### Step 1: Push Dashboard Code to GitHub

Since your main website is already on GitHub, you have two options:

#### Option A: Same Repository (Recommended)
The dashboard is already in your TouchofTerra-1 repo, so you just need to commit and push:

```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1"

git add dashboard/
git add stats.html
git commit -m "Add homelessness dashboard with backend API and frontend"
git push origin main
```

#### Option B: Separate Repository
If you want the dashboard in its own repo:

```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard"
git init
git add .
git commit -m "Initial dashboard commit"

# Create new repo on GitHub called "touch-of-terra-dashboard"
# Then:
git remote add origin https://github.com/YOUR-USERNAME/touch-of-terra-dashboard.git
git push -u origin main
```

---

### Step 2: Deploy Backend to Vercel

#### 2.1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**

#### 2.2: Import Repository
- Select your GitHub repository (TouchofTerra-1)
- Click **"Import"**

#### 2.3: Configure Backend Project
**Project Settings:**
- **Project Name:** `tot-dashboard-api`
- **Framework Preset:** Other
- **Root Directory:** `dashboard/backend` ← IMPORTANT!
- **Build Command:** Leave empty (Node.js doesn't need build)
- **Output Directory:** Leave empty
- **Install Command:** `npm install`

**Environment Variables:**
Click "Environment Variables" and add:
- `NODE_ENV` = `production`

#### 2.4: Deploy
- Click **"Deploy"**
- Wait 2-3 minutes for deployment
- Copy the production URL (e.g., `https://tot-dashboard-api.vercel.app`)

#### 2.5: Test Backend
Visit: `https://your-backend-url.vercel.app/api/health`

Should see:
```json
{
  "status": "ok",
  "timestamp": "2024-11-08T...",
  "version": "1.0.0"
}
```

---

### Step 3: Deploy Frontend to Vercel

#### 3.1: Update Frontend Environment Variable

Before deploying, update `.env.production` with your actual backend URL:

```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard/frontend/touch-of-terra-dashboard"
```

Edit `.env.production`:
```
VITE_API_URL=https://tot-dashboard-api.vercel.app
```
(Replace with your actual backend URL from Step 2.4)

#### 3.2: Commit the Change
```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1"
git add dashboard/frontend/touch-of-terra-dashboard/.env.production
git commit -m "Update production API URL"
git push origin main
```

#### 3.3: Create New Vercel Project for Frontend
1. Go to Vercel Dashboard
2. Click **"Add New..."** → **"Project"**
3. Select your repository again

#### 3.4: Configure Frontend Project
**Project Settings:**
- **Project Name:** `tot-dashboard`
- **Framework Preset:** Vite
- **Root Directory:** `dashboard/frontend/touch-of-terra-dashboard` ← IMPORTANT!
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Environment Variables:**
Add the backend URL:
- `VITE_API_URL` = `https://tot-dashboard-api.vercel.app` (your backend URL)

#### 3.5: Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Copy the production URL (e.g., `https://tot-dashboard.vercel.app`)

---

### Step 4: Test the Dashboard

Visit your frontend URL: `https://tot-dashboard.vercel.app`

You should see:
- ✅ Dashboard with statistics
- ✅ Resource map with 10 Louisville locations
- ✅ Charts displaying correctly
- ✅ Dark mode working
- ✅ All data loading from backend API

---

### Step 5: Update Your Main Website

Now update stats.html to point to the live dashboard:

#### 5.1: Update stats.html

Edit `/Users/dylonboone/ToT Website/TouchofTerra-1/stats.html`:

**Option A: Direct Redirect (Simplest)**

Replace the entire script section with:
```javascript
<script>
    // Redirect to dashboard
    window.location.href = 'https://tot-dashboard.vercel.app';
</script>
```

**Option B: Keep Status Page (Better UX)**

Update the health check and button URLs:

Find line ~273:
```javascript
const response = await fetch('https://tot-dashboard-api.vercel.app/api/health', {
```

Find the "Open Dashboard" button (~219):
```html
<a href="https://tot-dashboard.vercel.app" target="_blank" class="btn btn-primary" id="openDashboard">
```

And remove the localhost detection (delete lines 246-268) since it's now always online.

#### 5.2: Commit and Push
```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1"
git add stats.html
git commit -m "Update stats page to point to live dashboard"
git push origin main
```

Vercel will auto-deploy your main website with the updated stats.html.

---

### Step 6: Update Navbar Stats Link (Optional)

If you want the Stats button to go directly to the dashboard (skipping stats.html):

Update all navbar links in your HTML files:

Change:
```html
<li><a href="stats.html">Stats</a></li>
```

To:
```html
<li><a href="https://tot-dashboard.vercel.app" target="_blank">Stats</a></li>
```

In these files:
- index.html
- about.html
- donate.html
- contact.html
- volunteer.html

---

## 🎨 Optional: Custom Domain

### For Backend API:
1. Go to backend project settings in Vercel
2. Click "Domains"
3. Add: `api-dashboard.touchofterra.com`
4. Update DNS (Vercel will show you the records)

### For Frontend Dashboard:
1. Go to frontend project settings
2. Click "Domains"
3. Add: `dashboard.touchofterra.com`
4. Update DNS

Then update `.env.production` and stats.html with the custom domains.

---

## 🔧 Environment Variables Summary

### Backend (tot-dashboard-api)
```
NODE_ENV=production
```

### Frontend (tot-dashboard)
```
VITE_API_URL=https://tot-dashboard-api.vercel.app
```
(Or your custom domain if you set one up)

---

## 🚀 Auto-Deployment Setup

### Enable Auto-Deploy:
Both projects are now set to auto-deploy when you push to GitHub:

1. Make changes locally
2. Commit: `git commit -m "Update dashboard"`
3. Push: `git push origin main`
4. Vercel automatically deploys both projects ✅

---

## ✅ Verification Checklist

After deployment:

**Backend:**
- [ ] `https://your-backend-url.vercel.app/api/health` returns JSON
- [ ] `https://your-backend-url.vercel.app/api/stats/current` shows statistics
- [ ] `https://your-backend-url.vercel.app/api/resources` shows 10 locations

**Frontend:**
- [ ] `https://your-frontend-url.vercel.app` loads dashboard
- [ ] Dashboard shows real statistics (1,157 total homeless)
- [ ] Resource map displays 10 locations
- [ ] Clicking markers shows location details
- [ ] Charts render correctly
- [ ] Dark/light mode toggle works
- [ ] Admin portal loads

**Main Website:**
- [ ] Stats button appears in navbar on all pages
- [ ] Clicking Stats opens the dashboard
- [ ] No console errors

---

## 📊 Expected URLs

After deployment, you'll have:

**Production URLs:**
- Dashboard: `https://tot-dashboard.vercel.app`
- API: `https://tot-dashboard-api.vercel.app`
- Main website: `https://touchofterra.com` (with Stats button)

**Or with custom domains:**
- Dashboard: `https://dashboard.touchofterra.com`
- API: `https://api-dashboard.touchofterra.com`

---

## 🐛 Troubleshooting

### Backend Deployment Issues:

**Error: "Build failed"**
- Check that Root Directory is set to `dashboard/backend`
- Verify `vercel.json` exists in backend folder

**Error: "Cannot find module"**
- Make sure all dependencies are in `package.json`
- Check Install Command is `npm install`

**API returns 404:**
- Verify routes in `vercel.json` are correct
- Check server.js has all endpoint definitions

### Frontend Deployment Issues:

**Error: "Build failed"**
- Check that Root Directory is `dashboard/frontend/touch-of-terra-dashboard`
- Verify Build Command is `npm run build`
- Check Output Directory is `dist`

**Dashboard loads but no data:**
- Verify `VITE_API_URL` environment variable is set correctly
- Check browser console for CORS errors
- Test backend URL directly

**Charts not displaying:**
- Check that recharts dependency installed
- Verify data is loading (check Network tab in DevTools)

### CORS Errors:

If you see CORS errors, the backend already has CORS enabled in server.js.
But if you have issues, verify this line exists:
```javascript
app.use(cors());
```

---

## 📝 Quick Command Reference

### Push to GitHub:
```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1"
git add .
git commit -m "Your commit message"
git push origin main
```

### Test Backend Locally:
```bash
cd dashboard/backend
npm start
# Test: http://localhost:5000/api/health
```

### Test Frontend Locally:
```bash
cd dashboard/frontend/touch-of-terra-dashboard
npm run dev
# Open: http://localhost:5173
```

### Build Frontend for Production:
```bash
cd dashboard/frontend/touch-of-terra-dashboard
npm run build
# Creates dist/ folder
```

---

## 🎯 Summary

**What You'll Do:**
1. ✅ Push dashboard code to GitHub
2. ✅ Deploy backend to Vercel (2-3 min)
3. ✅ Deploy frontend to Vercel (2-3 min)
4. ✅ Update stats.html with production URLs
5. ✅ Test everything works

**Total Time:** ~15-20 minutes
**Cost:** $0/month (Vercel free tier)

**Result:**
- 🌐 Public dashboard accessible to anyone
- 📊 Real Louisville homelessness data
- 🗺️ Interactive resource map
- 📱 Mobile-responsive
- 🚀 Auto-deploys on every git push

---

## 🆘 Need Help?

If you run into issues:
1. Check the Vercel deployment logs
2. Review browser console for errors
3. Test API endpoints directly
4. Verify environment variables are set

Common fixes:
- Clear browser cache
- Rebuild and redeploy
- Check all environment variables
- Verify Root Directory settings

---

**Ready to deploy? Start with Step 1!** 🚀

Once deployed, share your dashboard URL with stakeholders, donors, and the community!

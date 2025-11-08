# 🚀 Deployment Checklist - Touch of Terra Dashboard

## Quick Start: Deploy in 15 Minutes

Follow these steps in order to deploy your dashboard to production.

---

## ☑️ Pre-Deployment Checklist

- [x] Dashboard works locally (tested at http://localhost:5173)
- [x] Backend API works (tested at http://localhost:5000)
- [x] All features tested (Dashboard, Map, Admin Portal)
- [x] Vercel configuration files created
- [x] Environment variables configured
- [ ] Ready to push to GitHub

---

## 📝 Step-by-Step Deployment

### Step 1: Push Code to GitHub (2 minutes)

```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1"

# Add all dashboard files
git add dashboard/
git add stats.html

# Commit
git commit -m "Add Touch of Terra Homelessness Dashboard

- Public dashboard with real Louisville statistics
- Interactive resource map with 10 locations
- Admin portal for resource management
- Dark mode with starry background
- Mobile-responsive design
- Real-time weather alerts integration
"

# Push to GitHub
git push origin main
```

**✅ Checkpoint:** Verify files uploaded to GitHub

---

### Step 2: Deploy Backend API (5 minutes)

1. **Go to Vercel:** https://vercel.com/dashboard

2. **Create New Project:**
   - Click "Add New..." → "Project"
   - Select your GitHub repository

3. **Configure Backend:**
   - **Project Name:** `tot-dashboard-api`
   - **Root Directory:** `dashboard/backend` ⚠️ IMPORTANT
   - **Framework:** Other
   - **Build Command:** (leave empty)
   - **Install Command:** `npm install`

4. **Environment Variables:**
   - Add: `NODE_ENV` = `production`

5. **Deploy:** Click "Deploy" button

6. **Wait:** ~2-3 minutes for deployment

7. **Copy URL:** Save your backend URL (e.g., `https://tot-dashboard-api.vercel.app`)

**✅ Test Backend:**
Visit: `https://your-backend-url.vercel.app/api/health`

Should return:
```json
{"status":"ok","timestamp":"...","version":"1.0.0"}
```

---

### Step 3: Update Frontend Config (1 minute)

Update the frontend to use your production backend:

```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard/frontend/touch-of-terra-dashboard"
```

Edit `.env.production`:
```
VITE_API_URL=https://tot-dashboard-api.vercel.app
```
☝️ Replace with YOUR actual backend URL from Step 2

**Push the change:**
```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1"
git add dashboard/frontend/touch-of-terra-dashboard/.env.production
git commit -m "Configure production API URL"
git push origin main
```

---

### Step 4: Deploy Frontend (5 minutes)

1. **Go to Vercel:** https://vercel.com/dashboard

2. **Create New Project:**
   - Click "Add New..." → "Project"
   - Select your repository AGAIN

3. **Configure Frontend:**
   - **Project Name:** `tot-dashboard`
   - **Root Directory:** `dashboard/frontend/touch-of-terra-dashboard` ⚠️ IMPORTANT
   - **Framework:** Vite (should auto-detect)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment Variables:**
   - Add: `VITE_API_URL` = `https://tot-dashboard-api.vercel.app` (your backend URL)

5. **Deploy:** Click "Deploy"

6. **Wait:** ~2-3 minutes

7. **Copy URL:** Save frontend URL (e.g., `https://tot-dashboard.vercel.app`)

**✅ Test Frontend:**
Visit your dashboard URL and verify:
- [ ] Dashboard loads
- [ ] Statistics display (1,157 total homeless)
- [ ] Resource map shows 10 locations
- [ ] Charts render
- [ ] Dark mode works
- [ ] Can click map markers

---

### Step 5: Update Main Website (2 minutes)

**Option A: Direct Link (Simplest)**

Update navbar Stats links to go directly to dashboard:

Edit these files:
- index.html
- about.html
- donate.html
- contact.html
- volunteer.html

Change:
```html
<li><a href="stats.html">Stats</a></li>
```

To:
```html
<li><a href="https://tot-dashboard.vercel.app" target="_blank">Stats</a></li>
```

**Option B: Keep Launcher Page**

Edit `stats.html` and update URLs:

Line ~273:
```javascript
const response = await fetch('https://tot-dashboard-api.vercel.app/api/health', {
```

Line ~219:
```html
<a href="https://tot-dashboard.vercel.app" target="_blank">
```

**Push changes:**
```bash
git add index.html about.html donate.html contact.html volunteer.html stats.html
git commit -m "Update Stats links to production dashboard"
git push origin main
```

**✅ Checkpoint:** Vercel auto-deploys your main website

---

## ✅ Final Testing

### Test Everything:

1. **Main Website:**
   - [ ] Visit https://touchofterra.com
   - [ ] Click "Stats" button in navbar
   - [ ] Dashboard opens in new tab

2. **Dashboard Features:**
   - [ ] Key metrics display correctly
   - [ ] 5-year trend chart shows
   - [ ] Sheltered vs unsheltered pie chart displays
   - [ ] Bed availability bar shows
   - [ ] Community stories appear
   - [ ] Policy insights load

3. **Resource Map:**
   - [ ] Click "Resource Map" tab
   - [ ] Map displays Louisville
   - [ ] 10 resource markers appear
   - [ ] Can filter by type (Shelters, Food, Medical, Services)
   - [ ] Clicking markers shows details
   - [ ] "Get Directions" links work

4. **Admin Portal:**
   - [ ] Click "Admin Portal" tab
   - [ ] Can see all 10 resources
   - [ ] Click "+ Add Resource" button works
   - [ ] Can edit existing resources
   - [ ] Changes save successfully

5. **Mobile Testing:**
   - [ ] Open dashboard on phone
   - [ ] All features work
   - [ ] Touch controls responsive
   - [ ] Maps work on mobile

6. **Performance:**
   - [ ] Dashboard loads in < 3 seconds
   - [ ] No console errors
   - [ ] API calls complete successfully

---

## 🎉 Deployment Complete!

Your dashboard is now live and public!

**Share these URLs:**
- 📊 Dashboard: `https://tot-dashboard.vercel.app`
- 🔌 API: `https://tot-dashboard-api.vercel.app`
- 🌐 Main Site: `https://touchofterra.com`

---

## 📱 Share With:

- ✉️ Board members
- 📧 Stakeholders
- 🌍 Community partners
- 💼 Donors
- 📢 Social media

**Sample announcement:**
> 🎉 Exciting news! Touch of Terra's new Homelessness Dashboard is live!
>
> View real-time Louisville homelessness statistics, find resources, and see our impact.
>
> 📊 Visit: https://tot-dashboard.vercel.app
>
> #TouchOfTerra #EndHomelessness #Louisville

---

## 🔄 Future Updates

When you need to update the dashboard:

1. **Make changes locally**
2. **Test:** Run `./start.sh` and verify at localhost:5173
3. **Commit:** `git commit -m "Your update description"`
4. **Push:** `git push origin main`
5. **Auto-deploy:** Vercel automatically deploys both projects! ✅

No manual deployment needed - just push to GitHub!

---

## 🆘 Troubleshooting

### Dashboard loads but shows no data:
- Check `VITE_API_URL` environment variable in Vercel
- Test backend directly: visit `/api/stats/current`
- Check browser console for errors

### Backend returns 404:
- Verify Root Directory is `dashboard/backend`
- Check `vercel.json` exists
- Redeploy backend

### Map doesn't display:
- Check internet connection (uses OpenStreetMap tiles)
- Verify coordinates are correct
- Check browser console

### Charts not rendering:
- Verify recharts installed
- Check data is loading (Network tab)
- Test API endpoint directly

---

## 📊 URLs Reference

After deployment:

| Component | URL |
|-----------|-----|
| Frontend Dashboard | `https://tot-dashboard.vercel.app` |
| Backend API | `https://tot-dashboard-api.vercel.app` |
| Health Check | `https://tot-dashboard-api.vercel.app/api/health` |
| Current Stats | `https://tot-dashboard-api.vercel.app/api/stats/current` |
| Resources | `https://tot-dashboard-api.vercel.app/api/resources` |
| Main Website | `https://touchofterra.com` |

---

## 🎯 Success Criteria

✅ **Deployment successful when:**
- Dashboard accessible at public URL
- All data loads correctly
- Map displays all 10 locations
- Charts render properly
- Admin portal works
- Mobile-responsive
- No console errors
- Main website Stats button works

---

**Total deployment time:** ~15-20 minutes
**Ongoing cost:** $0/month (Vercel free tier)
**Auto-deploys:** Yes, on every git push

**You're ready to go public! 🚀**

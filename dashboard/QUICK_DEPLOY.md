# Quick Deployment Guide - Make Dashboard Public

## 🌐 Current Situation

✅ **CORS Errors Fixed!** - stats.html now detects if you're on live website
- On touchofterra.com: Shows instructions (no errors)
- On localhost: Checks dashboard status

## 🚀 Option 1: Deploy Dashboard to Vercel (FREE & EASIEST)

### Time: 15-20 minutes
### Cost: $0/month

### Steps:

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Build the Frontend
```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard/frontend/touch-of-terra-dashboard"
npm run build
```

#### 3. Deploy Frontend to Vercel
```bash
vercel --prod
```

Follow prompts:
- Link to existing project? **N** (first time)
- Project name? **touch-of-terra-dashboard**
- Directory? **Press Enter** (current directory)
- Deploy? **Y**

You'll get a URL like: `https://touch-of-terra-dashboard.vercel.app`

#### 4. Deploy Backend to Vercel

Create `vercel.json` in backend folder:
```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard/backend"
```

Create file `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

Then deploy:
```bash
vercel --prod
```

You'll get a backend URL like: `https://tot-dashboard-api.vercel.app`

#### 5. Update Frontend to Use Production API

Edit `.env.production` in frontend:
```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard/frontend/touch-of-terra-dashboard"
```

Create/edit `.env.production`:
```
VITE_API_URL=https://your-backend-url.vercel.app
```

Rebuild and redeploy frontend:
```bash
npm run build
vercel --prod
```

#### 6. Update stats.html on Your Website

Replace the health check URL in stats.html:
```javascript
const response = await fetch('https://your-backend-url.vercel.app/api/health', {
```

And update the "Open Dashboard" button:
```html
<a href="https://touch-of-terra-dashboard.vercel.app" target="_blank">
```

---

## 🚀 Option 2: Deploy to Render (FREE Alternative)

### Frontend (Static Site)
1. Push code to GitHub
2. Go to https://render.com
3. Create Static Site
4. Connect repository
5. Build command: `cd dashboard/frontend/touch-of-terra-dashboard && npm install && npm run build`
6. Publish directory: `dashboard/frontend/touch-of-terra-dashboard/dist`

### Backend (Web Service)
1. Create Web Service on Render
2. Connect repository
3. Build command: `cd dashboard/backend && npm install`
4. Start command: `npm start`
5. Environment: Add `NODE_ENV=production`

---

## 🎯 Option 3: Simple Redirect (5 minutes)

Just redirect stats.html to localhost dashboard when you're on your Mac:

Update stats.html to automatically open localhost if available:
```javascript
// After detecting live website
if (isLiveWebsite) {
    statusMessage.innerHTML = '⚠️ <strong>Dashboard is not publicly available yet</strong><br>Click below to contact us for access.';

    // Or redirect to a contact form
    setTimeout(() => {
        window.location.href = 'contact.html?subject=Dashboard%20Access';
    }, 3000);
}
```

---

## 📝 Recommendation

### For Internal Use (Staff, Board):
✅ **Current setup is perfect** - No changes needed!
- Stats.html already fixed (no more CORS errors)
- Instructions show how to run locally
- No deployment costs

### For Public Access:
🚀 **Deploy to Vercel** (Option 1)
- Free hosting
- Easy setup
- Professional URL
- Auto-scaling
- 15 minutes to deploy

---

## 🔧 Quick Fix Summary

### What I Just Fixed:
✅ **CORS errors eliminated** - stats.html detects if on live site
✅ **Better user experience** - Shows appropriate message based on context
✅ **No more console errors** - Doesn't try to connect to localhost from live site

### How It Works Now:

**On touchofterra.com:**
```
ℹ️ Dashboard runs locally on your computer
Follow the instructions below to start it on your Mac.
```

**On localhost:**
```
🟢 Dashboard online at localhost:5173
[Open Dashboard] button appears
```

---

## 💡 Next Steps

### If Keeping Local (No Action Needed):
✅ You're done! No more errors.
- Upload the updated stats.html to your server
- Users will see instructions instead of errors

### If Deploying to Production:
1. Choose Vercel (easiest) or Render
2. Follow deployment steps above
3. Update stats.html with production URLs
4. Upload to your website

---

**The CORS errors are fixed!** 🎉

Upload the updated stats.html to your website and the errors will be gone.

# 🚀 Deploy Touch of Terra Dashboard - Step by Step

**Production build is ready!** Follow these steps to get your dashboard live in 15 minutes.

---

## ✅ What You Have Ready

- ✓ Production frontend build in `dist/` folder
- ✓ Backend API ready to deploy
- ✓ All styling and features complete
- ✓ Real Louisville homelessness data

---

## 🎯 OPTION 1: Deploy via Vercel (FASTEST - 10 minutes)

### Step 1: Deploy Backend to Railway

1. **Go to https://railway.app** and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository (or upload the `dashboard/backend` folder)
4. Railway will auto-detect Node.js
5. Click **"Deploy Now"**
6. Once deployed, click on your service → **"Settings"** → Copy the **Public Domain**
   - Example: `https://touch-of-terra-api.up.railway.app`

### Step 2: Deploy Frontend to Vercel

1. **Go to https://vercel.com** and sign up with GitHub
2. Click **"Add New Project"**
3. Import your repository (or upload `dashboard/frontend/touch-of-terra-dashboard`)
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. **Environment Variables** → Add:
   ```
   VITE_API_URL=https://your-railway-backend-url.up.railway.app
   ```
8. Click **"Deploy"**
9. Once deployed, copy your frontend URL
   - Example: `https://touch-of-terra-dashboard.vercel.app`

### Step 3: Update Main Website

1. Open `/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard.html`
2. Find line 442 and update:
   ```html
   <iframe src="https://touch-of-terra-dashboard.vercel.app" ...>
   ```
3. Find line 550 and update:
   ```javascript
   const DASHBOARD_URL = 'https://touch-of-terra-dashboard.vercel.app';
   ```
4. Save the file

### Step 4: Test Everything

1. Visit your Vercel URL
2. Verify dashboard loads
3. Check all three tabs work
4. Test on mobile

---

## 🎯 OPTION 2: Deploy via Command Line (Terminal)

### Step 1: Deploy Backend

```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard/backend"

# Deploy to Railway
npx railway login
npx railway init
npx railway up

# Copy the URL shown
```

### Step 2: Deploy Frontend

```bash
cd "/Users/dylonboone/ToT Website/TouchofTerra-1/dashboard/frontend/touch-of-terra-dashboard"

# Set environment variable
npx vercel env add VITE_API_URL production
# Paste your Railway backend URL

# Deploy
npx vercel --prod

# Copy the production URL shown
```

### Step 3: Update Website

Same as Option 1, Step 3

---

## 🔧 Update Backend CORS for Production

After deployment, update your backend to allow your frontend domain:

1. Edit `dashboard/backend/server.js` line 10:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:5173', 'https://your-frontend-url.vercel.app'],
     credentials: true
   }));
   ```

2. Redeploy backend:
   ```bash
   # Railway will auto-deploy on git push
   git add .
   git commit -m "Update CORS for production"
   git push
   ```

---

## 📊 What You'll Have Live

- **Public Dashboard**: Real-time Louisville homelessness data
- **Interactive Charts**: Historical trends, demographics
- **Resource Map**: Framework ready for Mapbox integration
- **Admin Portal**: For future content management
- **Professional Branding**: Touch of Terra identity throughout

---

## 🎉 After Deployment

### Share Your Dashboard

1. **Local Media**
   - Louisville Courier Journal
   - WDRB News
   - Louisville Public Media

2. **Partners**
   - Coalition for the Homeless
   - Wayside Christian Mission
   - St. John Center
   - Louisville Metro Council

3. **Social Media**
   ```
   🚀 Touch of Terra launches Louisville's first comprehensive homelessness
   data dashboard!

   ✅ Real-time statistics
   ✅ Resource locations
   ✅ Historical trends
   ✅ Transparency & impact

   View it live: [your-url]

   #Louisville #EndHomelessness #DataForGood
   ```

### Gather Feedback

Create a simple feedback form:
1. Add button: "Have feedback? Contact us"
2. Link to: touchofterralouisville@gmail.com
3. Ask for:
   - What's most useful?
   - What's missing?
   - Partnership interest?

---

## 🛠️ Troubleshooting

### Dashboard won't load
- Check backend URL in environment variables
- Verify both services are running
- Check browser console for errors

### Data not showing
- Verify backend API is accessible
- Test: `curl https://your-backend-url/api/stats/current`
- Should return JSON data

### Styling broken
- Clear browser cache
- Check Tailwind CSS built correctly
- Verify all CSS files loaded

### CORS errors
- Update backend CORS settings
- Add your frontend domain to allowed origins
- Redeploy backend

---

## 📈 Next Steps (See ROADMAP.md)

**Week 1: Generate Traction**
- [ ] Share with 10 stakeholders
- [ ] Get feedback from 3 nonprofits
- [ ] Present to Coalition for the Homeless

**Week 2-3: Add Interactive Features**
- [ ] Integrate Mapbox for live resource locations
- [ ] Add volunteer signup form
- [ ] Enable donation portal

**Month 2-3: Intelligence Layer**
- [ ] Add AI chatbot
- [ ] Connect live data feeds
- [ ] Basic predictive analytics

---

## 💰 Costs

**Free Tier (Recommended for Launch)**
- Vercel: Free (100GB bandwidth)
- Railway: $5/month credit included
- **Total**: $0-5/month

**As You Grow**
- Vercel Pro: $20/month (if needed)
- Railway: ~$10-20/month
- APIs (Mapbox, AI): $50-200/month
- **Total**: $80-240/month at scale

---

## 🆘 Need Help?

1. **Vercel Docs**: https://vercel.com/docs
2. **Railway Docs**: https://docs.railway.app
3. **Touch of Terra**: touchofterralouisville@gmail.com

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] CORS updated for production
- [ ] Main website updated with production URL
- [ ] Dashboard tested on desktop
- [ ] Dashboard tested on mobile
- [ ] Shared with first 5 people
- [ ] Feedback form ready
- [ ] Social media posts drafted

---

**You're ready to launch!** 🎉

Once deployed, you'll have a professional, data-driven platform that shows Touch of Terra is serious about solving homelessness through technology and compassion.

**Deploy time**: 10-15 minutes
**Impact**: Immediate credibility with donors, partners, and policymakers

Let's get this live!

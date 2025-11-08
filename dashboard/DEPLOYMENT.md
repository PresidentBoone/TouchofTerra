# Production Deployment Guide

Complete guide for deploying the Touch of Terra Dashboard to production.

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Test all features locally
- [ ] Review and update data sources
- [ ] Set up production database (Firebase/PostgreSQL)
- [ ] Configure authentication (Firebase Auth/NextAuth)
- [ ] Add rate limiting to API
- [ ] Enable HTTPS/SSL
- [ ] Set up domain name
- [ ] Configure environment variables
- [ ] Add error monitoring (Sentry)
- [ ] Set up analytics (Google Analytics)

## Recommended Architecture

```
Frontend (Vercel/Netlify)
    ↓
Backend API (Render/Railway/Vercel Functions)
    ↓
Database (Firebase Firestore / PostgreSQL)
    ↓
External APIs (Louisville Open Data, Weather)
```

## Option 1: Vercel (Recommended for MVP)

### Frontend Deployment

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Build the frontend:**
```bash
cd dashboard/frontend/touch-of-terra-dashboard
npm run build
```

3. **Deploy to Vercel:**
```bash
vercel --prod
```

4. **Set environment variables in Vercel:**
```bash
vercel env add VITE_API_URL production
# Enter your production API URL: https://your-api.vercel.app
```

### Backend Deployment (Vercel Serverless)

1. **Create `vercel.json` in backend directory:**
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

2. **Deploy backend:**
```bash
cd dashboard/backend
vercel --prod
```

3. **Set environment variables:**
```bash
vercel env add NODE_ENV production
vercel env add DATABASE_URL production
```

## Option 2: Render (Full-Stack)

### Backend Deployment

1. **Push code to GitHub**

2. **Create New Web Service on Render:**
   - Connect GitHub repository
   - Root Directory: `dashboard/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

3. **Add Environment Variables:**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your_database_url
```

4. **Deploy** - Render will auto-deploy on git push

### Frontend Deployment

1. **Create New Static Site on Render:**
   - Root Directory: `dashboard/frontend/touch-of-terra-dashboard`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Add Environment Variables:**
```env
VITE_API_URL=https://your-backend.onrender.com
```

## Option 3: AWS (Enterprise Scale)

### Backend (AWS Lambda + API Gateway)

1. **Install Serverless Framework:**
```bash
npm install -g serverless
```

2. **Create `serverless.yml`:**
```yaml
service: tot-dashboard-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    DATABASE_URL: ${env:DATABASE_URL}

functions:
  api:
    handler: server.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
```

3. **Deploy:**
```bash
cd dashboard/backend
serverless deploy
```

### Frontend (S3 + CloudFront)

1. **Build frontend:**
```bash
cd dashboard/frontend/touch-of-terra-dashboard
npm run build
```

2. **Create S3 bucket:**
```bash
aws s3 mb s3://tot-dashboard
```

3. **Upload dist files:**
```bash
aws s3 sync dist/ s3://tot-dashboard --acl public-read
```

4. **Create CloudFront distribution** (via AWS Console)

5. **Set up Route 53** for custom domain

## Database Setup

### Option A: Firebase Firestore (Easiest)

1. **Create Firebase project** at console.firebase.google.com

2. **Enable Firestore Database**

3. **Download service account key:**
   - Project Settings → Service Accounts
   - Generate new private key
   - Save as `serviceAccountKey.json`

4. **Update backend code:**
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Replace in-memory arrays with Firestore queries
app.get('/api/stats/current', async (req, res) => {
  const doc = await db.collection('stats').doc('current').get();
  res.json(doc.data());
});
```

5. **Set environment variables:**
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
```

### Option B: PostgreSQL (Production-Grade)

1. **Create PostgreSQL database:**
   - Render: Add PostgreSQL service
   - AWS: Use RDS
   - Supabase: Use their hosted PostgreSQL

2. **Install PostgreSQL client:**
```bash
npm install pg
```

3. **Create schema:**
```sql
CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  total_homeless INT,
  sheltered INT,
  unsheltered INT,
  families INT,
  veterans INT,
  youth INT,
  chronic_homeless INT,
  last_updated TIMESTAMP
);

CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50),
  address TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  hours VARCHAR(255),
  phone VARCHAR(20),
  services TEXT[],
  capacity INT,
  available INT,
  is_open BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
```

4. **Update backend:**
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/api/resources', async (req, res) => {
  const result = await pool.query('SELECT * FROM resources');
  res.json(result.rows);
});
```

## Authentication Setup

### Firebase Auth

1. **Enable Firebase Authentication** in Firebase Console

2. **Install dependencies:**
```bash
npm install firebase
```

3. **Create auth context (frontend):**
```javascript
// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  const signIn = () => signInWithPopup(auth, new GoogleAuthProvider());
  const signOut = () => auth.signOut();

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

4. **Protect admin routes:**
```javascript
// In AdminPortal.jsx
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function AdminPortal() {
  const { user, signIn } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl mb-4">Admin Access Required</h2>
        <button onClick={signIn} className="px-6 py-3 bg-blue-600 text-white rounded">
          Sign In with Google
        </button>
      </div>
    );
  }

  // ... rest of admin portal
}
```

5. **Verify tokens on backend:**
```javascript
const admin = require('firebase-admin');

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Protect admin routes
app.post('/api/admin/resources', verifyToken, (req, res) => {
  // ... create resource
});
```

## Security Hardening

### 1. Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

### 3. Input Validation

```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/admin/resources', [
  body('name').isString().trim().isLength({ min: 3 }),
  body('address').isString().trim(),
  body('coordinates.lat').isFloat({ min: -90, max: 90 }),
  body('coordinates.lng').isFloat({ min: -180, max: 180 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ... proceed with creation
});
```

### 4. Environment Variables

**Never commit `.env` files!**

Add to `.gitignore`:
```
.env
.env.local
.env.production
serviceAccountKey.json
```

## Monitoring & Analytics

### Error Monitoring (Sentry)

1. **Install Sentry:**
```bash
npm install @sentry/react @sentry/node
```

2. **Configure frontend:**
```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

3. **Configure backend:**
```javascript
// server.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Analytics (Google Analytics)

```bash
npm install react-ga4
```

```javascript
// src/main.jsx
import ReactGA from "react-ga4";

ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);
```

## Performance Optimization

### Frontend

1. **Code splitting:**
```javascript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./components/Dashboard'));
const ResourceMap = lazy(() => import('./components/ResourceMap'));

// In App.jsx
<Suspense fallback={<Loading />}>
  {currentView === 'dashboard' && <Dashboard />}
</Suspense>
```

2. **Image optimization:**
- Use WebP format
- Implement lazy loading
- Use CDN for images

3. **Bundle size reduction:**
```bash
npm run build -- --analyze
```

### Backend

1. **Caching:**
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

app.get('/api/stats/current', (req, res) => {
  const cached = cache.get('currentStats');
  if (cached) return res.json(cached);

  const stats = getCurrentStats();
  cache.set('currentStats', stats);
  res.json(stats);
});
```

2. **Database connection pooling**
3. **Compression:**
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

## SSL/HTTPS Setup

### Let's Encrypt (Free SSL)

If self-hosting:
```bash
sudo apt-get install certbot
sudo certbot --nginx -d yourdomain.com
```

For Vercel/Render/Netlify: SSL is automatic!

## Custom Domain Setup

1. **Purchase domain** (Namecheap, Google Domains, etc.)

2. **Add DNS records:**

For Vercel:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

3. **Configure in platform:**
   - Vercel: Project Settings → Domains
   - Render: Settings → Custom Domain
   - Netlify: Domain Settings → Add custom domain

## Backup Strategy

### Database Backups

**Firebase:**
- Use Firebase scheduled backups
- Export to Cloud Storage daily

**PostgreSQL:**
```bash
# Daily backup cron job
0 2 * * * pg_dump -U username dbname > /backups/db_$(date +\%Y\%m\%d).sql
```

## Monitoring Checklist

- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic, Datadog)
- [ ] Log aggregation (Logtail, Papertrail)
- [ ] Analytics (Google Analytics, Plausible)

## Post-Deployment

1. **Test all features in production**
2. **Set up monitoring alerts**
3. **Document deployment process**
4. **Train team on admin portal**
5. **Schedule regular data updates**
6. **Plan for scaling**

## Scaling Considerations

### When to scale:
- >10,000 daily users
- API response time >500ms
- Database queries slow (>100ms)

### Scaling options:
- Add CDN (Cloudflare)
- Use Redis for caching
- Implement database read replicas
- Move to Kubernetes/Docker
- Use message queue (RabbitMQ, SQS)

## Cost Estimates

### Small Scale (MVP)
- **Vercel Free Tier:** $0/month
- **Render Free Tier:** $0/month
- **Firebase Spark Plan:** $0/month
- **Total:** $0-20/month

### Medium Scale
- **Vercel Pro:** $20/month
- **Render Starter:** $7/month
- **Firebase Blaze:** ~$25/month
- **Total:** $50-75/month

### Enterprise Scale
- **AWS/GCP:** $200-1000+/month
- Depends on traffic and features

## Support & Maintenance

### Regular Tasks
- [ ] Weekly: Review error logs
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Annually: Full code review

### Emergency Contacts
- Hosting support
- Database admin
- Security team
- Development team

---

**Ready to deploy? Follow this checklist step by step!**

For questions, refer to platform-specific documentation or open an issue on GitHub.

# Touch of Terra Dashboard - Integration Guide

Complete guide for integrating all components and getting the enhanced dashboard running.

## Table of Contents
- [Quick Start](#quick-start)
- [Component Integration](#component-integration)
- [State Management Setup](#state-management-setup)
- [Service Worker Registration](#service-worker-registration)
- [Testing Checklist](#testing-checklist)
- [Common Issues](#common-issues)

---

## Quick Start

### Prerequisites Installed
- Node.js v18+ and npm v9+
- Git
- Text editor (VS Code recommended)

### Installation Steps

**1. Clone or navigate to project:**
```bash
cd /Users/dylonboone/Touch\ of\ Terra/TouchofTerra-4/dashboard
```

**2. Install dependencies:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend/touch-of-terra-dashboard
npm install
```

**3. Set up environment variables:**
```bash
# Frontend
cp .env.example .env
# Edit .env with your API keys

# Backend
cd ../../backend
cp .env.example .env
# Edit .env with your API keys
```

**4. Start development servers:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend/touch-of-terra-dashboard
npm run dev
```

**5. Open browser:**
```
http://localhost:5174
```

---

## Component Integration

### Step 1: Wrap App with DashboardProvider

Edit `src/App.jsx` (or create if it doesn't exist):

```jsx
import React from 'react';
import { DashboardProvider } from './context/DashboardContext';
import EmergencyBar from './components/EmergencyBar';
import ImpactCounters from './components/ImpactCounters';
import EnhancedTrendsChart from './components/EnhancedTrendsChart';
import ForecastChart from './components/ForecastChart';
import BedCapacityChart from './components/BedCapacityChart';
import EnhancedResourceMap from './components/EnhancedResourceMap';
import StarsBackground from './components/StarsBackground';
import ErrorBoundary from './components/ErrorBoundary';
import { useTheme } from './hooks/useTheme';
import './styles/animations.css';

function DashboardContent() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
      {/* Stars background (dark mode only) */}
      <StarsBackground starCount={100} />

      {/* Emergency contact bar */}
      <EmergencyBar />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Theme toggle */}
        <div className="flex justify-end">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
            aria-label="Toggle theme"
          >
            <i className={`fas fa-${isDark ? 'sun' : 'moon'}`} />
          </button>
        </div>

        {/* Impact metrics */}
        <ErrorBoundary>
          <ImpactCounters />
        </ErrorBoundary>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ErrorBoundary>
            <EnhancedTrendsChart />
          </ErrorBoundary>

          <ErrorBoundary>
            <ForecastChart />
          </ErrorBoundary>
        </div>

        {/* Bed capacity */}
        <ErrorBoundary>
          <BedCapacityChart />
        </ErrorBoundary>

        {/* Resource map */}
        <ErrorBoundary>
          <EnhancedResourceMap />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Touch of Terra, Inc. All rights reserved.</p>
          <p className="mt-2 text-sm">Carrying compassion, one backpack at a time.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </ErrorBoundary>
  );
}

export default App;
```

### Step 2: Update main.jsx

Edit `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { validateConfig } from './config/environment';

// Validate configuration
validateConfig();

// Register Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 3: Update index.css

Ensure `src/index.css` imports Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global styles */
body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure full height */
#root {
  min-height: 100vh;
}

/* Custom scrollbar for dark mode */
.dark::-webkit-scrollbar {
  width: 8px;
}

.dark::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.dark::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
```

---

## State Management Setup

### Using Dashboard Context

The `DashboardContext` provides global state for all dashboard data.

**Available State:**
```javascript
const {
  // Data
  currentStats,         // Current homelessness stats
  historicalData,       // Historical trends (12 months)
  bedAvailability,      // Bed capacity data
  resources,            // Service locations
  forecastData,         // 3-month projections
  impactMetrics,        // Touch of Terra impact metrics
  weatherAlerts,        // Active weather alerts

  // State
  isLoading,            // Global loading state
  error,                // Global error state
  lastUpdated,          // Last data refresh timestamp
  dataSources,          // List of active data sources
  filters,              // Active filters

  // Actions
  refreshData,          // Manually refresh all data
  updateImpactMetrics,  // Update impact metrics
  updateForecastData,   // Update forecast data
  updateFilters,        // Update active filters
  getFilteredResources, // Get filtered resource list
  clearError,           // Clear error state
} = useDashboard();
```

**Usage Example:**
```jsx
import { useDashboard } from '../context/DashboardContext';

function MyComponent() {
  const { currentStats, isLoading, refreshData } = useDashboard();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Total Homeless: {currentStats.totalHomeless}</h2>
      <button onClick={refreshData}>Refresh</button>
    </div>
  );
}
```

---

## Service Worker Registration

### Automatic Registration

Service Worker is automatically registered in production builds.

### Manual Control

```javascript
// Check if Service Worker is registered
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    console.log('Active Service Workers:', registrations.length);
  });
}

// Manually update Service Worker
navigator.serviceWorker.getRegistration().then((registration) => {
  if (registration) {
    registration.update();
  }
});

// Clear Service Worker cache
navigator.serviceWorker.getRegistration().then((registration) => {
  if (registration) {
    registration.unregister().then(() => {
      window.location.reload();
    });
  }
});
```

### Testing Offline Mode

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Set throttling to "Offline"
4. Refresh page
5. Verify fallback data loads

---

## Testing Checklist

### Frontend Tests

- [ ] All components render without errors
- [ ] Dark mode toggle works
- [ ] Charts display data correctly
- [ ] Map loads and markers are clickable
- [ ] Search/filter functionality works
- [ ] Emergency bar is sticky
- [ ] Impact counters animate smoothly
- [ ] Forecast chart shows projections
- [ ] Star animation visible in dark mode
- [ ] Responsive on mobile/tablet/desktop

### Backend Tests

- [ ] Server starts without errors (`npm run dev`)
- [ ] Health check endpoint works: `http://localhost:5001/api/health`
- [ ] Current stats endpoint: `http://localhost:5001/api/stats/current`
- [ ] Resources endpoint: `http://localhost:5001/api/resources`
- [ ] Rate limiting works (test with many requests)
- [ ] Caching works (check response times)
- [ ] Cron jobs are scheduled (check logs)

### Integration Tests

- [ ] Frontend connects to backend successfully
- [ ] Data loads from backend API
- [ ] Fallback data loads when API fails
- [ ] Service Worker caches data
- [ ] Offline mode works
- [ ] Analytics events are tracked
- [ ] Error boundaries catch errors

### Accessibility Tests

```bash
# Install pa11y
npm install -g pa11y

# Run accessibility test
pa11y http://localhost:5174

# Should score 90+ on all metrics
```

### Performance Tests

```bash
# Install Lighthouse
npm install -g lighthouse

# Run performance test
lighthouse http://localhost:5174 --view

# Target scores:
# Performance: 90+
# Accessibility: 90+
# Best Practices: 90+
# SEO: 90+
```

---

## Common Issues

### Issue: Components not rendering

**Symptoms**: Blank screen or React errors

**Solutions**:
1. Check console for errors (F12)
2. Verify all dependencies installed: `npm install`
3. Check import paths are correct
4. Verify `DashboardProvider` wraps app
5. Clear browser cache

### Issue: API connection failed

**Symptoms**: "Failed to fetch data" errors

**Solutions**:
1. Verify backend is running: `curl http://localhost:5001/api/health`
2. Check `.env` file has correct `VITE_API_URL`
3. Check CORS settings in backend
4. Verify firewall not blocking connections

### Issue: Dark mode not working

**Symptoms**: Theme doesn't change or persist

**Solutions**:
1. Check `useTheme` hook is imported
2. Verify `dark` class is added to html element
3. Check localStorage for `theme` key
4. Ensure Tailwind config has `darkMode: 'class'`

### Issue: Service Worker not registering

**Symptoms**: Offline mode doesn't work

**Solutions**:
1. Service Worker only works in production builds
2. Build project: `npm run build`
3. Serve build: `npx serve dist`
4. Check DevTools > Application > Service Workers

### Issue: Charts not displaying

**Symptoms**: Empty chart containers

**Solutions**:
1. Verify Recharts is installed: `npm install recharts`
2. Check data is loaded: `console.log(historicalData)`
3. Verify data structure matches chart expectations
4. Check for console errors

### Issue: Map markers not showing

**Symptoms**: Map loads but no markers

**Solutions**:
1. Verify Leaflet CSS is imported
2. Check resources data is loaded
3. Verify coordinates are valid (lat/lng)
4. Check browser console for Leaflet errors

---

## Next Steps

### After Integration

1. **Test thoroughly**: Run through all testing checklists
2. **Customize branding**: Update colors, logos, text
3. **Add real API keys**: Replace placeholder keys in `.env`
4. **Deploy to production**: Follow DEPLOYMENT_README.md
5. **Monitor performance**: Set up error tracking and analytics

### Ongoing Maintenance

1. **Update data sources**: Keep fallback JSON files current
2. **Monitor APIs**: Check for API changes/deprecations
3. **Update dependencies**: `npm outdated` and `npm update`
4. **Review analytics**: Check user behavior and errors
5. **Gather feedback**: User testing and improvements

---

## Additional Resources

- **Component Docs**: See individual component files for detailed API docs
- **Data Sources**: See DATA_SOURCES_README.md
- **Deployment**: See DEPLOYMENT_README.md
- **Theming**: See THEMING_README.md
- **Support**: touchofterralouisville@gmail.com

---

**Last Updated**: January 2025
**Version**: 1.0.0

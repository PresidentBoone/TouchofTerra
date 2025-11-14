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
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`} style={{ backgroundColor: isDark ? '#1a1a1a' : '#F5F2E8' }}>
      {/* Stars background (dark mode only) */}
      <StarsBackground starCount={100} />

      {/* Emergency contact bar */}
      <EmergencyBar />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 space-y-8" style={{ maxWidth: '1200px', paddingTop: '2rem' }}>
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#2D3E35' }}>
              Louisville Homelessness Dashboard
            </h1>
            <p style={{ color: isDark ? '#d1d5db' : '#6B7C73' }}>
              Live Data & Resources • Touch of Terra
            </p>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            style={{
              backgroundColor: isDark ? '#374151' : '#fff',
              color: isDark ? '#d1d5db' : '#2D3E35',
              border: isDark ? '1px solid #4b5563' : '1px solid rgba(123, 160, 91, 0.2)'
            }}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <span className="flex items-center gap-2">
                <i className="fas fa-sun" />
                <span className="hidden sm:inline">Light Mode</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <i className="fas fa-moon" />
                <span className="hidden sm:inline">Dark Mode</span>
              </span>
            )}
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
      <footer className="relative z-10 py-8" style={{
        backgroundColor: isDark ? '#111827' : '#2D3E35',
        color: '#fff',
        borderTop: isDark ? '1px solid #374151' : '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Touch of Terra, Inc. All rights reserved.</p>
          <p className="mt-2 text-sm" style={{ opacity: 0.8 }}>Carrying compassion, one backpack at a time.</p>
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

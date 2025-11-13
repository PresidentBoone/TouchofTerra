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
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Touch of Terra Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Homelessness Data & Resources for Louisville, KY
            </p>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-gray-700 dark:text-gray-300"
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
      <footer className="relative z-10 py-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 Touch of Terra, Inc. All rights reserved.</p>
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

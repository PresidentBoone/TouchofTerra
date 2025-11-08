import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ResourceMap from './components/ResourceMap';
import AdminPortal from './components/AdminPortal';
import StarsBackground from './components/StarsBackground';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'map', or 'admin'

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Starry background for dark mode */}
      {darkMode && <StarsBackground />}

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-primary-dark to-indigo-800 dark:from-primary-dark dark:to-indigo-900 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Touch of Terra
              </h1>
              <p className="text-indigo-200 mt-1">Homelessness Dashboard - Louisville, KY</p>
            </div>
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-white text-primary-dark shadow-lg'
                  : 'bg-indigo-700 text-white hover:bg-indigo-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('map')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentView === 'map'
                  ? 'bg-white text-primary-dark shadow-lg'
                  : 'bg-indigo-700 text-white hover:bg-indigo-600'
              }`}
            >
              Resource Map
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                currentView === 'admin'
                  ? 'bg-white text-primary-dark shadow-lg'
                  : 'bg-indigo-700 text-white hover:bg-indigo-600'
              }`}
            >
              Admin Portal
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'map' && <ResourceMap />}
        {currentView === 'admin' && <AdminPortal />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-800 dark:bg-gray-950 text-gray-300 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Touch of Terra, Inc.</h3>
              <p className="text-sm">
                Supporting our community through direct action and data-driven insights.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Data Sources</h3>
              <ul className="text-sm space-y-2">
                <li>• Coalition for the Homeless</li>
                <li>• Louisville Metro Open Data</li>
                <li>• National Weather Service</li>
                <li>• Kentucky Housing Corporation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
              <p className="text-sm">
                For questions or data corrections, please contact us.
              </p>
              <p className="text-sm mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Touch of Terra, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

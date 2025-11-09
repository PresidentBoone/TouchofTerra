import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ResourceMap from './components/ResourceMap';
import AdminPortal from './components/AdminPortal';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'map', or 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-br from-tot-beige to-tot-beige-warm">
      {/* Premium Header - Touch of Terra Style */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-tot-medium border-b border-tot-green-sage/10">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-tot-green-primary to-tot-teal rounded-2xl flex items-center justify-center shadow-tot-medium">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-tot-text-dark">
                  Touch of Terra
                </h1>
                <p className="text-sm text-tot-text-light font-medium">Homelessness Dashboard • Louisville, KY</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right mr-2">
                <p className="text-xs text-tot-text-light">Powered by</p>
                <p className="text-sm font-semibold text-tot-green-primary">Real-time Data</p>
              </div>
              <div className="w-2 h-2 bg-tot-green-primary rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Premium Navigation Tabs */}
          <nav className="flex gap-2 bg-tot-beige/50 p-1.5 rounded-2xl border border-tot-green-sage/20">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                currentView === 'dashboard'
                  ? 'bg-white text-tot-green-primary shadow-tot-medium scale-105'
                  : 'text-tot-text-light hover:text-tot-text-dark hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setCurrentView('map')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                currentView === 'map'
                  ? 'bg-white text-tot-green-primary shadow-tot-medium scale-105'
                  : 'text-tot-text-light hover:text-tot-text-dark hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Resource Map</span>
              </div>
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                currentView === 'admin'
                  ? 'bg-white text-tot-green-primary shadow-tot-medium scale-105'
                  : 'text-tot-text-light hover:text-tot-text-dark hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Admin Portal</span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        <div className="animate-fade-in">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'map' && <ResourceMap />}
          {currentView === 'admin' && <AdminPortal />}
        </div>
      </main>

      {/* Premium Footer - Touch of Terra Style */}
      <footer className="bg-gradient-to-br from-tot-beige to-white mt-20 border-t-2 border-tot-green-primary/20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-tot-green-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-tot-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-tot-text-dark">Touch of Terra, Inc.</h3>
              </div>
              <p className="text-tot-text-light leading-relaxed">
                Carrying compassion, one backpack at a time. Supporting our community through direct action and data-driven insights.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-tot-text-dark">
                <svg className="w-5 h-5 text-tot-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Data Sources
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-tot-text-light text-sm">
                  <span className="text-tot-green-primary">•</span>
                  Coalition for the Homeless
                </li>
                <li className="flex items-start gap-2 text-tot-text-light text-sm">
                  <span className="text-tot-green-primary">•</span>
                  Louisville Metro Open Data Portal
                </li>
                <li className="flex items-start gap-2 text-tot-text-light text-sm">
                  <span className="text-tot-green-primary">•</span>
                  National Weather Service
                </li>
                <li className="flex items-start gap-2 text-tot-text-light text-sm">
                  <span className="text-tot-green-primary">•</span>
                  Kentucky Housing Corporation
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-tot-text-dark">
                <svg className="w-5 h-5 text-tot-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </h3>
              <p className="text-tot-text-light text-sm mb-4">
                For questions, data corrections, or partnership opportunities, please reach out to us.
              </p>
              <div className="bg-tot-green-primary/10 rounded-xl p-3 border border-tot-green-primary/20">
                <p className="text-xs text-tot-text-light mb-1">Last Data Update</p>
                <p className="text-sm font-semibold text-tot-green-primary">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-tot-green-primary/20 mt-10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-tot-text-light text-sm">
                &copy; 2024 Touch of Terra, Inc. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-tot-text-light hover:text-tot-green-primary text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-tot-text-light hover:text-tot-green-primary text-sm transition-colors">
                  Terms of Use
                </a>
                <a href="#" className="text-tot-text-light hover:text-tot-green-primary text-sm transition-colors">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

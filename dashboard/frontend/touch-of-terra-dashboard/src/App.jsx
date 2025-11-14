import React, { useState, useEffect } from 'react';
import { DashboardProvider } from './context/DashboardContext';
import EmergencyBar from './components/EmergencyBar';
import ImpactCounters from './components/ImpactCounters';
import EnhancedTrendsChart from './components/EnhancedTrendsChart';
import ForecastChart from './components/ForecastChart';
import BedCapacityChart from './components/BedCapacityChart';
import EnhancedResourceMap from './components/EnhancedResourceMap';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/animations.css';

function DashboardContent() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarStyles = {
    position: 'fixed',
    top: 0,
    width: '100%',
    background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    zIndex: 1000,
    padding: '1rem 2rem',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid rgba(123, 160, 91, 0.1)',
    boxShadow: scrolled ? '0 4px 20px rgba(123, 160, 91, 0.1)' : 'none'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F2E8' }}>

      {/* Navigation Bar */}
      <nav style={navbarStyles}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <a href="/index.html" style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2D3E35', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'transform 0.3s ease' }}>
            <img src="/images/logo2.png" alt="Touch of Terra Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Touch of</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '700' }}>Terra</span>
            </div>
          </a>

          <ul style={{ display: mobileMenuOpen ? 'flex' : 'none', listStyle: 'none', gap: '2rem', alignItems: 'center', '@media (min-width: 769px)': { display: 'flex' } }} className="nav-links-desktop">
            <li><a href="/index.html" style={{ textDecoration: 'none', color: '#2D3E35', fontWeight: '500', transition: 'all 0.3s ease', position: 'relative' }}>Home</a></li>
            <li><a href="/about.html" style={{ textDecoration: 'none', color: '#2D3E35', fontWeight: '500', transition: 'all 0.3s ease', position: 'relative' }}>About</a></li>
            <li><a href="/donate.html" style={{ textDecoration: 'none', color: '#2D3E35', fontWeight: '500', transition: 'all 0.3s ease', position: 'relative' }}>Donate</a></li>
            <li><a href="/dashboard.html" style={{ textDecoration: 'none', color: '#7BA05B', fontWeight: '500', transition: 'all 0.3s ease', position: 'relative' }} className="active">Stats</a></li>
            <li style={{ position: 'relative' }}>
              <a href="#" style={{ textDecoration: 'none', color: '#2D3E35', fontWeight: '500', transition: 'all 0.3s ease' }}>More <i className="fas fa-chevron-down"></i></a>
            </li>
          </ul>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', color: '#7BA05B', cursor: 'pointer' }}
            className="mobile-menu-toggle"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Emergency contact bar */}
      <div style={{ marginTop: '80px' }}>
        <EmergencyBar />
      </div>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 space-y-8" style={{ maxWidth: '1200px', paddingTop: '2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#2D3E35', fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Louisville Homelessness Dashboard
          </h1>
          <p style={{ color: '#6B7C73', fontSize: '1.2rem' }}>
            Live Data & Resources for Louisville, KY
          </p>
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
      <footer className="relative z-10" style={{
        background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)',
        color: '#fff',
        padding: '4rem 0 2rem',
        marginTop: '4rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Footer Top Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '3rem', marginBottom: '3rem' }}>
            {/* Logo and Mission */}
            <div style={{ maxWidth: '350px' }}>
              <a href="/index.html" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: '#fff', marginBottom: '1.5rem', transition: 'transform 0.3s ease' }}>
                <img src="/images/logo2.png" alt="Touch of Terra Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Touch of</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '700' }}>Terra</span>
                </div>
              </a>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem', opacity: 0.9 }}>
                Carrying compassion, one backpack at a time. Providing essential supplies to those experiencing homelessness while advocating for lasting solutions.
              </p>

              {/* Social Media Links */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ background: 'rgba(255, 255, 255, 0.1)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', textDecoration: 'none', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }} aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" style={{ background: 'rgba(255, 255, 255, 0.1)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', textDecoration: 'none', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }} aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" style={{ background: 'rgba(255, 255, 255, 0.1)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', textDecoration: 'none', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }} aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>Quick Links</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><a href="/index.html" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.3s ease' }}>Home</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="/about.html" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.3s ease' }}>About Us</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="/volunteer.html" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.3s ease' }}>Volunteer</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="/donate.html" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.3s ease' }}>Donate</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="/contact.html" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.3s ease' }}>Contact</a></li>
              </ul>
            </div>

            {/* Get Involved */}
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>Get Involved</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><a href="/volunteer.html" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.3s ease' }}>Become a Volunteer</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="/donate.html" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.3s ease' }}>Make a Donation</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="/contact.html" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.3s ease' }}>Partner with Us</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>Contact Us</h3>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  <i className="fas fa-envelope" style={{ width: '20px', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}></i>
                  <a href="mailto:touchofterralouisville@gmail.com" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', transition: 'color 0.3s ease' }}>touchofterralouisville@gmail.com</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  <i className="fas fa-phone" style={{ width: '20px', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}></i>
                  <a href="tel:+15027970244" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', transition: 'color 0.3s ease' }}>(502) 797-0244</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  <i className="fas fa-map-marker-alt" style={{ width: '20px', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}></i>
                  <span>Louisville, KY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)', margin: '2rem 0' }}></div>

          {/* Footer Bottom */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p>&copy; 2025 Touch of Terra. All rights reserved.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>501(c)(3) Nonprofit Organization</p>
            </div>
          </div>
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

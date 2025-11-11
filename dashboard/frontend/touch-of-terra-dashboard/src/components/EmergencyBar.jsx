/**
 * Emergency Bar Component
 * Sticky banner at top of page with emergency contact options
 * Provides quick access to crisis hotline and Touch of Terra contact
 */

import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

const EmergencyBar = () => {
  const { trackEmergency } = useAnalytics();
  const [isVisible, setIsVisible] = useState(true);

  const handleCall211 = () => {
    trackEmergency('call_211');
    window.location.href = 'tel:211';
  };

  const handleEmail = () => {
    trackEmergency('email');
    window.location.href = 'mailto:touchofterralouisville@gmail.com?subject=Need Help';
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('emergency_bar_dismissed', 'true');
  };

  // Check if user previously dismissed
  React.useEffect(() => {
    const dismissed = sessionStorage.getItem('emergency_bar_dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) {
    // Show minimal restore button when closed
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all flex items-center gap-2"
        aria-label="Show emergency contacts"
      >
        <i className="fas fa-phone-alt" aria-hidden="true"></i>
        <span className="hidden sm:inline">Need Help?</span>
      </button>
    );
  }

  return (
    <div
      className="sticky top-0 z-50 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-lg animate-slide-down"
      role="banner"
      aria-label="Emergency contact bar"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Emergency Message */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/20 rounded-full animate-pulse">
              <i className="fas fa-exclamation-triangle text-xl" aria-hidden="true"></i>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold">Need Help Now?</h2>
              <p className="text-sm text-white/90">Immediate assistance available 24/7</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCall211}
              className="px-6 py-2.5 bg-white text-red-600 hover:bg-gray-100 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-md"
              aria-label="Call 211 for immediate help"
            >
              <i className="fas fa-phone-alt" aria-hidden="true"></i>
              <span>Call 211</span>
            </button>

            <button
              onClick={handleEmail}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
              aria-label="Email Touch of Terra"
            >
              <i className="fas fa-envelope" aria-hidden="true"></i>
              <span className="hidden md:inline">Email Us</span>
              <span className="md:hidden">Email</span>
            </button>

            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close emergency bar"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Additional Resources (Mobile Dropdown) */}
        <div className="mt-3 pt-3 border-t border-white/20 sm:hidden">
          <details className="text-sm">
            <summary className="cursor-pointer font-medium flex items-center gap-2">
              <i className="fas fa-info-circle" aria-hidden="true"></i>
              More Emergency Resources
            </summary>
            <ul className="mt-2 space-y-1 text-white/90 pl-6">
              <li>
                <a href="tel:988" className="hover:underline flex items-center gap-2">
                  <i className="fas fa-phone w-4" aria-hidden="true"></i>
                  988 - Suicide & Crisis Lifeline
                </a>
              </li>
              <li>
                <a href="tel:911" className="hover:underline flex items-center gap-2">
                  <i className="fas fa-phone w-4" aria-hidden="true"></i>
                  911 - Life-Threatening Emergency
                </a>
              </li>
              <li>
                <a href="tel:18002738255" className="hover:underline flex items-center gap-2">
                  <i className="fas fa-phone w-4" aria-hidden="true"></i>
                  1-800-273-8255 - National Helpline
                </a>
              </li>
            </ul>
          </details>
        </div>
      </div>

      {/* Inline Animations */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default EmergencyBar;

import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * Animated Counter Component
 */
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (easeOutExpo)
      const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

      setCount(Math.floor(ease * value));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

/**
 * Counter Card Component
 */
const CounterCard = ({ icon, label, value, color, lastUpdated }) => {
  const formatTimestamp = (isoString) => {
    if (!isoString) return 'recently';
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // minutes

    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const colorStyles = {
    green: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
    teal: { bg: '#F0FDFA', text: '#0F766E', border: '#CCFBF1' },
    sage: { bg: '#F4F7F5', text: '#5D8A7A', border: '#E2E8E4' }
  };

  const style = colorStyles[color] || colorStyles.green;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 transition-transform hover:scale-105 duration-300"
      style={{ borderLeftColor: style.text }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <div className="text-3xl font-bold" style={{ color: style.text }}>
            <AnimatedCounter value={value} />
          </div>
        </div>
        <div className={`p-3 rounded-full`} style={{ backgroundColor: style.bg, color: style.text }}>
          {icon}
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-400 flex items-center">
        <i className="far fa-clock mr-1"></i>
        Updated {formatTimestamp(lastUpdated)}
      </div>
    </div>
  );
};

const ImpactCounters = () => {
  const { impactMetrics, updateImpactMetrics } = useDashboard();
  const { t } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh impact metrics every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      updateImpactMetrics();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [updateImpactMetrics]);

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await updateImpactMetrics();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Default values if metrics not loaded
  const metrics = impactMetrics || {
    peopleHelped: 0,
    backpacksDistributed: 0,
    mealsServed: 0,
    lastUpdated: new Date().toISOString(),
    yearToDate: {
      peopleHelped: 0,
      backpacksDistributed: 0,
      itemsDistributed: 0,
      volunteersEngaged: 0,
      partnersCollaborated: 0,
      eventsHosted: 0
    }
  };

  return (
    <section className="py-8" aria-labelledby="impact-heading">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 id="impact-heading" className="text-2xl md:text-3xl font-bold" style={{ color: '#2D3E35' }}>
            {t('impact.title')}
          </h2>
          <p className="mt-1" style={{ color: '#6B7C73' }}>
            {t('impact.subtitle')}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: '500',
            transition: 'all 0.3s',
            opacity: isRefreshing ? 0.5 : 1,
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: 'none'
          }}
          aria-label="Refresh impact metrics"
        >
          <i className={`fas fa-sync-alt ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true"></i>
          <span className="hidden sm:inline">{t('impact.refresh')}</span>
        </button>
      </div>

      {/* Counter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CounterCard
          icon={<i className="fas fa-heart" aria-hidden="true"></i>}
          label={t('impact.peopleHelped')}
          value={metrics.yearToDate?.peopleHelped || metrics.peopleHelped || 0}
          color="green"
          lastUpdated={metrics.lastUpdated}
        />

        <CounterCard
          icon={<i className="fas fa-backpack" aria-hidden="true"></i>}
          label={t('impact.backpacks')}
          value={metrics.yearToDate?.backpacksDistributed || metrics.backpacksDistributed || 0}
          color="teal"
          lastUpdated={metrics.lastUpdated}
        />

        <CounterCard
          icon={<i className="fas fa-box" aria-hidden="true"></i>}
          label={t('impact.items')}
          value={metrics.yearToDate?.itemsDistributed || metrics.itemsDistributed || metrics.mealsServed || 0}
          color="sage"
          lastUpdated={metrics.lastUpdated}
        />
      </div>

      {/* Additional Stats Bar */}
      {metrics.yearToDate && (
        <div className="mt-6 p-6 rounded-xl shadow-lg" style={{ backgroundColor: '#fff' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#2D3E35' }}>
            Year to Date Highlights
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#7BA05B' }}>
                {metrics.yearToDate.volunteersEngaged || 0}
              </div>
              <div className="text-sm" style={{ color: '#6B7C73' }}>{t('impact.volunteers')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#5D8A7A' }}>
                {metrics.yearToDate.partnersCollaborated || metrics.yearToDate.communityPartners || 0}
              </div>
              <div className="text-sm" style={{ color: '#6B7C73' }}>{t('impact.partners')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#A8B89C' }}>
                {metrics.yearToDate.eventsHosted || 0}
              </div>
              <div className="text-sm" style={{ color: '#6B7C73' }}>{t('impact.events')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Inline Styles for Pulse Animation */}
      <style jsx>{`
        @keyframes pulse-effect {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .pulse-animation {
          animation: pulse-effect 0.6s ease-in-out;
        }

        @keyframes pulse-overlay-effect {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: scale(1.05);
          }
        }

        .pulse-overlay {
          animation: pulse-overlay-effect 1.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ImpactCounters;

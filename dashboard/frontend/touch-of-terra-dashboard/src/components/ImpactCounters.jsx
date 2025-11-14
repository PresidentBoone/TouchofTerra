/**
 * Impact Counters Component
 * Displays animated counters for Touch of Terra impact metrics
 * Features smooth number transitions and pulse animations on updates
 */

import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';

/**
 * Animated counter that transitions from old to new value
 * @param {Object} props - Component props
 * @param {number} props.value - Target value
 * @param {number} props.duration - Animation duration in ms
 * @param {Function} props.formatValue - Value formatter
 */
const AnimatedCounter = ({ value, duration = 2000, formatValue = (v) => v.toLocaleString() }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value === displayValue) return;

    setIsAnimating(true);
    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, displayValue]);

  return (
    <span className={`text-4xl md:text-5xl font-bold transition-all ${isAnimating ? 'pulse-animation' : ''}`}>
      {formatValue(displayValue)}
    </span>
  );
};

/**
 * Individual counter card component
 */
const CounterCard = ({ icon, label, value, color, lastUpdated }) => {
  // ONLY Touch of Terra colors
  const colorStyles = {
    green: { background: 'linear-gradient(135deg, #7BA05B, #9BC177)' },
    teal: { background: 'linear-gradient(135deg, #5D8A7A, #4A6B5D)' },
    sage: { background: 'linear-gradient(135deg, #A8B89C, #7BA05B)' },
  };

  return (
    <div className="relative overflow-hidden rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
         style={colorStyles[color] || colorStyles.green}
         role="region"
         aria-label={`${label} counter`}>

      {/* Background Icon */}
      <div className="absolute top-0 right-0 opacity-10 text-8xl transform translate-x-4 -translate-y-4">
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">{icon}</div>
          <h3 className="text-lg font-semibold text-white/90">{label}</h3>
        </div>

        <AnimatedCounter value={value} />

        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-white/80">
            <i className="fas fa-clock mr-2" aria-hidden="true"></i>
            Updated {formatTimestamp(lastUpdated)}
          </p>
        </div>
      </div>

      {/* Pulse effect on update */}
      <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 pulse-overlay pointer-events-none"></div>
    </div>
  );
};

/**
 * Format timestamp to relative time
 */
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'recently';

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
};

/**
 * Main Impact Counters Component
 */
const ImpactCounters = () => {
  const { impactMetrics, updateImpactMetrics } = useDashboard();
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
  };

  return (
    <section className="py-8" aria-labelledby="impact-heading">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 id="impact-heading" className="text-2xl md:text-3xl font-bold" style={{ color: '#2D3E35' }}>
            Community Impact
          </h2>
          <p className="mt-1" style={{ color: '#6B7C73' }}>
            Carrying compassion, one backpack at a time
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
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Counter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CounterCard
          icon={<i className="fas fa-heart" aria-hidden="true"></i>}
          label="People Helped"
          value={metrics.peopleHelped}
          color="green"
          lastUpdated={metrics.lastUpdated}
        />

        <CounterCard
          icon={<i className="fas fa-backpack" aria-hidden="true"></i>}
          label="Backpacks Distributed"
          value={metrics.backpacksDistributed}
          color="teal"
          lastUpdated={metrics.lastUpdated}
        />

        <CounterCard
          icon={<i className="fas fa-utensils" aria-hidden="true"></i>}
          label="Meals Served"
          value={metrics.mealsServed}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#7BA05B' }}>
                {metrics.yearToDate.volunteersEngaged || 0}
              </div>
              <div className="text-sm" style={{ color: '#6B7C73' }}>Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#5D8A7A' }}>
                {metrics.yearToDate.communityPartners || 0}
              </div>
              <div className="text-sm" style={{ color: '#6B7C73' }}>Partners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#A8B89C' }}>
                {metrics.yearToDate.eventsHosted || 0}
              </div>
              <div className="text-sm" style={{ color: '#6B7C73' }}>Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#7BA05B' }}>
                {metrics.progress?.peopleHelpedPercent || 0}%
              </div>
              <div className="text-sm" style={{ color: '#6B7C73' }}>Goal Progress</div>
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

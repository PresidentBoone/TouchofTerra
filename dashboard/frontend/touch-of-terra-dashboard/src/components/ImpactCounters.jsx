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
  const colorClasses = {
    green: 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
    blue: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
    purple: 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
    orange: 'from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700',
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
         style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
         className={`bg-gradient-to-br ${colorClasses[color] || colorClasses.blue}`}
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
          <h2 id="impact-heading" className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Community Impact
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Carrying compassion, one backpack at a time
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          color="blue"
          lastUpdated={metrics.lastUpdated}
        />

        <CounterCard
          icon={<i className="fas fa-utensils" aria-hidden="true"></i>}
          label="Meals Served"
          value={metrics.mealsServed}
          color="orange"
          lastUpdated={metrics.lastUpdated}
        />
      </div>

      {/* Additional Stats Bar */}
      {metrics.yearToDate && (
        <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Year to Date Highlights
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.yearToDate.volunteersEngaged || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {metrics.yearToDate.communityPartners || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Partners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {metrics.yearToDate.eventsHosted || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {metrics.progress?.peopleHelpedPercent || 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Goal Progress</div>
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

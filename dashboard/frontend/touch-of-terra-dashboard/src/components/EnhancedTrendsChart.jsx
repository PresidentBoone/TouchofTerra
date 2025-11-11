/**
 * Enhanced Trends Chart Component
 * 12-month rolling view of homelessness trends with percentage changes
 * Interactive chart with multiple metrics and comparison views
 */

import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';

/**
 * Custom tooltip for trends chart
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {entry.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Calculate percentage change from previous period
 */
const calculatePercentChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return (((current - previous) / previous) * 100).toFixed(1);
};

/**
 * Enhanced Trends Chart Component
 */
const EnhancedTrendsChart = () => {
  const { historicalData } = useDashboard();
  const [viewType, setViewType] = useState('area'); // 'area' or 'line'
  const [showMetric, setShowMetric] = useState('all'); // 'all', 'sheltered', 'unsheltered'
  const [timeRange, setTimeRange] = useState(12); // months to show

  // Process and format data for chart
  const chartData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return [];

    // Take last N months
    const recentData = historicalData.slice(-timeRange);

    return recentData.map((point, index) => {
      const prevPoint = index > 0 ? recentData[index - 1] : null;
      const total = point.totalHomeless || point.total || 0;
      const sheltered = point.sheltered || 0;
      const unsheltered = point.unsheltered || 0;

      return {
        date: point.date || point.year,
        month: formatMonth(point.date || point.year),
        total,
        sheltered,
        unsheltered,
        totalChange: prevPoint ? calculatePercentChange(total, prevPoint.totalHomeless || prevPoint.total) : 0,
        shelteredChange: prevPoint ? calculatePercentChange(sheltered, prevPoint.sheltered) : 0,
        unshelteredChange: prevPoint ? calculatePercentChange(unsheltered, prevPoint.unsheltered) : 0,
      };
    });
  }, [historicalData, timeRange]);

  /**
   * Format date to month name
   */
  function formatMonth(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }

  /**
   * Calculate summary statistics
   */
  const statistics = useMemo(() => {
    if (chartData.length === 0) return null;

    const firstPoint = chartData[0];
    const lastPoint = chartData[chartData.length - 1];

    return {
      currentTotal: lastPoint.total,
      previousTotal: firstPoint.total,
      totalChange: calculatePercentChange(lastPoint.total, firstPoint.total),
      currentSheltered: lastPoint.sheltered,
      currentUnsheltered: lastPoint.unsheltered,
      averageTotal: Math.round(chartData.reduce((sum, p) => sum + p.total, 0) / chartData.length),
      trend: lastPoint.total > firstPoint.total ? 'increasing' : 'decreasing',
    };
  }, [chartData]);

  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Loading historical data...
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6" aria-labelledby="trends-heading">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 id="trends-heading" className="text-2xl font-bold text-gray-900 dark:text-white">
            Historical Trends
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {timeRange}-month rolling view of homelessness data
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            aria-label="Select time range"
          >
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
            <option value={24}>24 Months</option>
            <option value={36}>36 Months</option>
          </select>

          {/* View Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewType('area')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewType === 'area'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              aria-label="Area chart view"
              aria-pressed={viewType === 'area'}
            >
              <i className="fas fa-chart-area mr-1" aria-hidden="true"></i>
              Area
            </button>
            <button
              onClick={() => setViewType('line')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewType === 'line'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              aria-label="Line chart view"
              aria-pressed={viewType === 'line'}
            >
              <i className="fas fa-chart-line mr-1" aria-hidden="true"></i>
              Line
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-800 dark:text-blue-300 mb-1">Current Total</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {statistics.currentTotal.toLocaleString()}
            </div>
            <div className={`text-sm font-medium mt-1 flex items-center gap-1 ${
              statistics.trend === 'increasing'
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            }`}>
              <i className={`fas fa-arrow-${statistics.trend === 'increasing' ? 'up' : 'down'}`} aria-hidden="true"></i>
              {Math.abs(statistics.totalChange)}% from {timeRange} mo ago
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-sm text-green-800 dark:text-green-300 mb-1">Sheltered</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {statistics.currentSheltered.toLocaleString()}
            </div>
            <div className="text-sm text-green-700 dark:text-green-400 mt-1">
              {((statistics.currentSheltered / statistics.currentTotal) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="text-sm text-orange-800 dark:text-orange-300 mb-1">Unsheltered</div>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {statistics.currentUnsheltered.toLocaleString()}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-400 mt-1">
              {((statistics.currentUnsheltered / statistics.currentTotal) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-sm text-purple-800 dark:text-purple-300 mb-1">Average</div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {statistics.averageTotal.toLocaleString()}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-400 mt-1">
              Over {timeRange} months
            </div>
          </div>
        </div>
      )}

      {/* Metric Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setShowMetric('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            showMetric === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-pressed={showMetric === 'all'}
        >
          All Metrics
        </button>
        <button
          onClick={() => setShowMetric('sheltered')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            showMetric === 'sheltered'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-pressed={showMetric === 'sheltered'}
        >
          Sheltered Only
        </button>
        <button
          onClick={() => setShowMetric('unsheltered')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            showMetric === 'unsheltered'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-pressed={showMetric === 'unsheltered'}
        >
          Unsheltered Only
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        {viewType === 'area' ? (
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorSheltered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorUnsheltered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" stroke="#666" style={{ fontSize: '12px' }} />
            <YAxis stroke="#666" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />

            {(showMetric === 'all' || showMetric === 'sheltered') && (
              <Area
                type="monotone"
                dataKey="sheltered"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSheltered)"
                name="Sheltered"
                animationDuration={1500}
              />
            )}

            {(showMetric === 'all' || showMetric === 'unsheltered') && (
              <Area
                type="monotone"
                dataKey="unsheltered"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUnsheltered)"
                name="Unsheltered"
                animationDuration={1500}
              />
            )}

            {showMetric === 'all' && (
              <Area
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotal)"
                name="Total Homeless"
                animationDuration={2000}
              />
            )}
          </AreaChart>
        ) : (
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" stroke="#666" style={{ fontSize: '12px' }} />
            <YAxis stroke="#666" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />

            {(showMetric === 'all' || showMetric === 'sheltered') && (
              <Line
                type="monotone"
                dataKey="sheltered"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                name="Sheltered"
                animationDuration={1500}
              />
            )}

            {(showMetric === 'all' || showMetric === 'unsheltered') && (
              <Line
                type="monotone"
                dataKey="unsheltered"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
                name="Unsheltered"
                animationDuration={1500}
              />
            )}

            {showMetric === 'all' && (
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={4}
                dot={{ fill: '#3b82f6', r: 5 }}
                name="Total Homeless"
                animationDuration={2000}
              />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>

      {/* Month-over-Month Changes */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Recent Month-over-Month Changes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {chartData.slice(-3).reverse().map((point, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
              <span className="text-gray-600 dark:text-gray-400">{point.month}</span>
              <span className={`font-semibold ${
                parseFloat(point.totalChange) > 0
                  ? 'text-red-600 dark:text-red-400'
                  : parseFloat(point.totalChange) < 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {parseFloat(point.totalChange) > 0 && '+'}
                {point.totalChange}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedTrendsChart;

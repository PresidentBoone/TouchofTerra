/**
 * Forecast Chart Component
 * Displays 3-month homelessness projections using forecasting engine
 * Shows "Projected vs Actual" trends with confidence intervals
 */

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { useForecasting } from '../hooks/useForecasting';

/**
 * Custom tooltip for forecast chart
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
 * Forecast Chart Component
 */
const ForecastChart = () => {
  const { historicalData, forecastData, updateForecastData } = useDashboard();
  const { forecast, isGenerating, error, regenerate } = useForecasting(historicalData, {
    monthsAhead: 3,
    metric: 'totalHomeless',
    includeConfidence: true,
  });

  const [showConfidence, setShowConfidence] = useState(true);
  const [combinedData, setCombinedData] = useState([]);

  // Update context with generated forecast
  useEffect(() => {
    if (forecast && forecast.length > 0) {
      updateForecastData(forecast);
    }
  }, [forecast, updateForecastData]);

  // Combine historical and forecast data
  useEffect(() => {
    if (!historicalData || historicalData.length === 0) return;

    // Take last 12 months of historical data
    const recentHistorical = historicalData.slice(-12).map((point) => ({
      date: point.date || point.year || point.month,
      month: formatMonth(point.date || point.year),
      actual: point.totalHomeless || point.total || 0,
      type: 'historical',
    }));

    // Add forecast data
    const forecastPoints = (forecast || []).map((point) => ({
      date: point.date,
      month: formatMonth(point.date),
      predicted: point.predictedTotal,
      confidenceLower: point.confidenceLower,
      confidenceUpper: point.confidenceUpper,
      trend: point.trend,
      type: 'forecast',
    }));

    // Combine with overlap on last historical point
    const combined = [
      ...recentHistorical,
      {
        date: recentHistorical[recentHistorical.length - 1]?.date,
        month: recentHistorical[recentHistorical.length - 1]?.month,
        actual: recentHistorical[recentHistorical.length - 1]?.actual,
        predicted: recentHistorical[recentHistorical.length - 1]?.actual,
        type: 'transition',
      },
      ...forecastPoints,
    ];

    setCombinedData(combined);
  }, [historicalData, forecast]);

  /**
   * Format date to month name
   */
  function formatMonth(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }

  /**
   * Handle regenerate forecast
   */
  const handleRegenerate = () => {
    regenerate();
  };

  if (!historicalData || historicalData.length < 3) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Insufficient data for forecasting. Need at least 3 historical data points.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6" aria-labelledby="forecast-heading">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 id="forecast-heading" className="text-2xl font-bold text-gray-900 dark:text-white">
            3-Month Forecast
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Projected homelessness trends based on historical data
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={showConfidence}
              onChange={(e) => setShowConfidence(e.target.checked)}
              className="rounded"
              aria-label="Show confidence intervals"
            />
            <span>Confidence Interval</span>
          </label>

          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
            aria-label="Regenerate forecast"
          >
            <i className={`fas fa-sync-alt ${isGenerating ? 'animate-spin' : ''}`} aria-hidden="true"></i>
            Regenerate
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">
            <i className="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i>
            {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-600 dark:text-blue-400 mb-4" aria-hidden="true"></i>
            <p className="text-gray-600 dark:text-gray-400">Generating forecast...</p>
          </div>
        </div>
      )}

      {/* Chart */}
      {!isGenerating && combinedData.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: '12px' }}
                label={{ value: 'Total Homeless', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />

              {/* Confidence Interval Area */}
              {showConfidence && (
                <Area
                  type="monotone"
                  dataKey="confidenceUpper"
                  stroke="none"
                  fill="#93c5fd"
                  fillOpacity={0.3}
                  name="Confidence Upper"
                  connectNulls
                />
              )}
              {showConfidence && (
                <Area
                  type="monotone"
                  dataKey="confidenceLower"
                  stroke="none"
                  fill="#93c5fd"
                  fillOpacity={0.3}
                  name="Confidence Lower"
                  connectNulls
                />
              )}

              {/* Reference line at transition point */}
              <ReferenceLine
                x={combinedData.find((d) => d.type === 'transition')?.month}
                stroke="#999"
                strokeDasharray="5 5"
                label={{ value: 'Forecast Start', position: 'top', fill: '#666' }}
              />

              {/* Historical actual line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#5D8A7A"
                strokeWidth={3}
                dot={{ fill: '#5D8A7A', r: 4 }}
                name="Actual"
                connectNulls
              />

              {/* Predicted line */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#7BA05B"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#7BA05B', r: 4 }}
                name="Predicted"
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Forecast Summary */}
          {forecast && forecast.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <i className="fas fa-chart-line text-blue-600 dark:text-blue-400" aria-hidden="true"></i>
                Forecast Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {forecast.map((point, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {formatMonth(point.date)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {point.predictedTotal?.toLocaleString()}
                    </div>
                    <div className={`text-sm font-medium ${
                      point.trend === 'increasing' ? 'text-red-600 dark:text-red-400' :
                      point.trend === 'decreasing' ? 'text-green-600 dark:text-green-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {point.trend === 'increasing' && <i className="fas fa-arrow-up mr-1" aria-hidden="true"></i>}
                      {point.trend === 'decreasing' && <i className="fas fa-arrow-down mr-1" aria-hidden="true"></i>}
                      {point.trendPercent}% vs current
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700 text-xs text-gray-600 dark:text-gray-400">
                <p>
                  <i className="fas fa-info-circle mr-1" aria-hidden="true"></i>
                  Forecast generated using linear regression and moving average. Confidence level: 95%
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ForecastChart;

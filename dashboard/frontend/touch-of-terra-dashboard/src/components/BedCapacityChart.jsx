/**
 * Bed Capacity Chart Component
 * Horizontal bar chart showing bed availability with color-coded status
 * Red < 10%, Yellow 10-50%, Green > 50%
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useDashboard } from '../context/DashboardContext';

/**
 * Get color based on availability percentage
 * @param {number} percent - Availability percentage
 * @returns {string} Color hex code
 */
const getColorByAvailability = (percent) => {
  if (percent < 10) return '#ef4444'; // Red
  if (percent < 50) return '#f59e0b'; // Yellow/Orange
  return '#10b981'; // Green
};

/**
 * Get status text based on availability
 * @param {number} percent - Availability percentage
 * @returns {Object} Status info
 */
const getStatus = (percent) => {
  if (percent < 10) {
    return {
      label: 'Critical',
      icon: 'fa-exclamation-triangle',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    };
  }
  if (percent < 50) {
    return {
      label: 'Limited',
      icon: 'fa-exclamation-circle',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    };
  }
  return {
    label: 'Available',
    icon: 'fa-check-circle',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
  };
};

/**
 * Custom tooltip for bed capacity chart
 */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const availabilityPercent = ((data.available / data.total) * 100).toFixed(1);
  const status = getStatus(parseFloat(availabilityPercent));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.name}</p>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-600 dark:text-gray-400">Total Beds:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{data.total}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600 dark:text-gray-400">Available:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{data.available}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600 dark:text-gray-400">Occupied:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{data.occupied}</span>
        </div>
        <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`font-semibold ${status.color}`}>
              <i className={`fas ${status.icon} mr-1`} aria-hidden="true"></i>
              {status.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Bed Capacity Chart Component
 */
const BedCapacityChart = () => {
  const { bedAvailability } = useDashboard();

  if (!bedAvailability) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Loading bed availability data...
        </p>
      </div>
    );
  }

  // Prepare data for chart
  const chartData = [
    {
      name: 'Emergency Shelter',
      total: bedAvailability.breakdown?.emergency || 0,
      occupied: Math.round((bedAvailability.breakdown?.emergency || 0) * (bedAvailability.occupancyRate / 100)),
      available: Math.round((bedAvailability.breakdown?.emergency || 0) * (1 - bedAvailability.occupancyRate / 100)),
    },
    {
      name: 'Transitional Housing',
      total: bedAvailability.breakdown?.transitional || 0,
      occupied: Math.round((bedAvailability.breakdown?.transitional || 0) * (bedAvailability.occupancyRate / 100)),
      available: Math.round((bedAvailability.breakdown?.transitional || 0) * (1 - bedAvailability.occupancyRate / 100)),
    },
    {
      name: 'Permanent Supportive',
      total: bedAvailability.breakdown?.permanent || 0,
      occupied: Math.round((bedAvailability.breakdown?.permanent || 0) * (bedAvailability.occupancyRate / 100)),
      available: Math.round((bedAvailability.breakdown?.permanent || 0) * (1 - bedAvailability.occupancyRate / 100)),
    },
  ];

  const availabilityPercent = ((bedAvailability.available / bedAvailability.total) * 100).toFixed(1);
  const status = getStatus(parseFloat(availabilityPercent));

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6" aria-labelledby="bed-capacity-heading">
      {/* Header */}
      <div className="mb-6">
        <h2 id="bed-capacity-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Bed Availability
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Current shelter capacity across Louisville
        </p>
      </div>

      {/* Overall Status Card */}
      <div className={`mb-6 p-4 rounded-lg border ${status.bgColor} ${status.borderColor}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`text-3xl ${status.color}`}>
              <i className={`fas ${status.icon}`} aria-hidden="true"></i>
            </div>
            <div>
              <div className={`text-lg font-bold ${status.color}`}>
                {status.label} Capacity
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {bedAvailability.available} of {bedAvailability.total} beds available
              </div>
            </div>
          </div>
          <div className={`text-3xl font-bold ${status.color}`}>
            {availabilityPercent}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full transition-all duration-500"
            style={{
              width: `${100 - availabilityPercent}%`,
              backgroundColor: getColorByAvailability(parseFloat(availabilityPercent)),
            }}
          ></div>
        </div>

        <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{bedAvailability.occupied} Occupied ({bedAvailability.occupancyRate}%)</span>
          <span>{bedAvailability.available} Available ({availabilityPercent}%)</span>
        </div>
      </div>

      {/* Breakdown Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Capacity by Type
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" stroke="#666" style={{ fontSize: '12px' }} />
            <YAxis dataKey="name" type="category" stroke="#666" style={{ fontSize: '12px' }} width={110} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              payload={[
                { value: 'Occupied', type: 'square', color: '#6b7280' },
                { value: 'Available', type: 'square', color: '#10b981' },
              ]}
            />
            <Bar dataKey="occupied" stackId="a" fill="#6b7280" name="Occupied" />
            <Bar dataKey="available" stackId="a" name="Available">
              {chartData.map((entry, index) => {
                const percent = (entry.available / entry.total) * 100;
                return <Cell key={`cell-${index}`} fill={getColorByAvailability(percent)} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Explanation */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Status Indicators
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-gray-600 dark:text-gray-400">Critical: &lt; 10% available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-gray-600 dark:text-gray-400">Limited: 10-50% available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-gray-600 dark:text-gray-400">Available: &gt; 50% available</span>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      {bedAvailability.lastUpdated && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          <i className="fas fa-clock mr-1" aria-hidden="true"></i>
          Last updated: {new Date(bedAvailability.lastUpdated).toLocaleString()}
        </div>
      )}
    </section>
  );
};

export default BedCapacityChart;

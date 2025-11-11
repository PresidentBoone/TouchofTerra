/**
 * Scheduled Updates Service
 * Handles periodic data refresh using intervals
 * Triggers updates for dashboard data at configured intervals
 */

import dataAggregator from './dataAggregator';
import config from '../config/environment';

// Store interval IDs for cleanup
let dataRefreshInterval = null;
let weatherRefreshInterval = null;

// Callbacks to notify when data is updated
const updateCallbacks = [];

/**
 * Register a callback to be called when data is updated
 * @param {Function} callback - Function to call on update
 * @returns {Function} Unregister function
 */
export const onDataUpdate = (callback) => {
  updateCallbacks.push(callback);

  // Return unregister function
  return () => {
    const index = updateCallbacks.indexOf(callback);
    if (index > -1) {
      updateCallbacks.splice(index, 1);
    }
  };
};

/**
 * Notify all registered callbacks of data update
 * @param {Object} data - Updated data
 */
const notifyUpdate = (data) => {
  updateCallbacks.forEach((callback) => {
    try {
      callback(data);
    } catch (error) {
      console.error('Error in update callback:', error);
    }
  });
};

/**
 * Perform a data refresh
 * @returns {Promise<Object>} Refresh result
 */
const performDataRefresh = async () => {
  try {
    console.log('Performing scheduled data refresh...');
    const result = await dataAggregator.refreshAllData();

    if (result.success) {
      console.log('Data refresh completed successfully');
      notifyUpdate(result.data);
    } else {
      console.warn('Data refresh completed with errors');
    }

    return result;
  } catch (error) {
    console.error('Error during scheduled data refresh:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Start scheduled data updates
 * @param {number} intervalMs - Interval in milliseconds (default from config)
 * @returns {Object} Interval control object
 */
export const startScheduledUpdates = (intervalMs = config.dataRefreshInterval) => {
  // Clear any existing interval
  if (dataRefreshInterval) {
    clearInterval(dataRefreshInterval);
  }

  console.log(`Starting scheduled updates every ${intervalMs / 1000} seconds`);

  // Perform initial refresh
  performDataRefresh();

  // Set up recurring refresh
  dataRefreshInterval = setInterval(() => {
    performDataRefresh();
  }, intervalMs);

  return {
    stop: stopScheduledUpdates,
    refresh: performDataRefresh,
  };
};

/**
 * Stop scheduled data updates
 */
export const stopScheduledUpdates = () => {
  if (dataRefreshInterval) {
    console.log('Stopping scheduled updates');
    clearInterval(dataRefreshInterval);
    dataRefreshInterval = null;
  }
};

/**
 * Start weather alerts refresh
 * @param {Function} weatherCallback - Callback for weather updates
 * @param {number} intervalMs - Interval in milliseconds
 */
export const startWeatherUpdates = (weatherCallback, intervalMs = config.weatherRefreshInterval) => {
  if (weatherRefreshInterval) {
    clearInterval(weatherRefreshInterval);
  }

  console.log(`Starting weather updates every ${intervalMs / 1000} seconds`);

  // Initial fetch
  fetchWeatherAlerts(weatherCallback);

  // Set up recurring fetch
  weatherRefreshInterval = setInterval(() => {
    fetchWeatherAlerts(weatherCallback);
  }, intervalMs);
};

/**
 * Stop weather updates
 */
export const stopWeatherUpdates = () => {
  if (weatherRefreshInterval) {
    console.log('Stopping weather updates');
    clearInterval(weatherRefreshInterval);
    weatherRefreshInterval = null;
  }
};

/**
 * Fetch weather alerts
 * @param {Function} callback - Callback to receive alerts
 */
const fetchWeatherAlerts = async (callback) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/alerts`);
    if (response.ok) {
      const alerts = await response.json();
      callback(alerts);
    }
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
  }
};

/**
 * Check if updates are currently running
 * @returns {boolean} True if updates are active
 */
export const isUpdating = () => {
  return dataRefreshInterval !== null;
};

/**
 * Get last update timestamp from localStorage
 * @returns {string|null} ISO timestamp or null
 */
export const getLastUpdateTime = () => {
  return localStorage.getItem('lastDataUpdate');
};

/**
 * Set last update timestamp in localStorage
 * @param {string} timestamp - ISO timestamp
 */
export const setLastUpdateTime = (timestamp = new Date().toISOString()) => {
  localStorage.setItem('lastDataUpdate', timestamp);
};

/**
 * Manual refresh trigger (clears cache and fetches fresh data)
 * @returns {Promise<Object>} Refresh result
 */
export const manualRefresh = async () => {
  console.log('Manual data refresh triggered');
  const result = await performDataRefresh();
  setLastUpdateTime();
  return result;
};

/**
 * Initialize scheduled updates with configuration
 * @param {Object} options - Configuration options
 * @param {number} options.dataInterval - Data refresh interval
 * @param {number} options.weatherInterval - Weather refresh interval
 * @param {Function} options.onDataUpdate - Data update callback
 * @param {Function} options.onWeatherUpdate - Weather update callback
 * @returns {Object} Control object with start/stop functions
 */
export const initialize = (options = {}) => {
  const {
    dataInterval = config.dataRefreshInterval,
    weatherInterval = config.weatherRefreshInterval,
    onDataUpdate: dataCallback,
    onWeatherUpdate: weatherCallback,
  } = options;

  // Register data update callback if provided
  if (dataCallback) {
    onDataUpdate(dataCallback);
  }

  // Start data updates
  const dataControl = startScheduledUpdates(dataInterval);

  // Start weather updates if callback provided
  if (weatherCallback) {
    startWeatherUpdates(weatherCallback, weatherInterval);
  }

  // Return control object
  return {
    stopData: stopScheduledUpdates,
    stopWeather: stopWeatherUpdates,
    stopAll: () => {
      stopScheduledUpdates();
      stopWeatherUpdates();
    },
    refresh: manualRefresh,
    isActive: isUpdating,
  };
};

/**
 * Cleanup function to stop all intervals
 * Call this when unmounting or closing the app
 */
export const cleanup = () => {
  stopScheduledUpdates();
  stopWeatherUpdates();
  updateCallbacks.length = 0;
};

// Export default object with all functions
export default {
  startScheduledUpdates,
  stopScheduledUpdates,
  startWeatherUpdates,
  stopWeatherUpdates,
  onDataUpdate,
  isUpdating,
  getLastUpdateTime,
  setLastUpdateTime,
  manualRefresh,
  initialize,
  cleanup,
};

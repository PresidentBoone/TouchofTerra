/**
 * Data Aggregator Service
 * Combines data from multiple sources (HUD, Louisville, Data.gov)
 * Handles fallbacks, caching, and data normalization
 */

import hudDataService from './hudDataService';
import louisvilleOpenDataService from './louisvilleOpenDataService';
import dataGovService from './dataGovService';
import config from '../config/environment';

// Cache duration in milliseconds (1 hour default)
const CACHE_DURATION = 60 * 60 * 1000;

// In-memory cache
const cache = new Map();

/**
 * Get data from cache if available and not expired
 * @param {string} key - Cache key
 * @returns {Object|null} Cached data or null
 */
const getFromCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

/**
 * Store data in cache
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 */
const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Fetch and aggregate current statistics from all sources
 * @returns {Promise<Object>} Aggregated current statistics
 */
export const fetchCurrentStats = async () => {
  const cacheKey = 'current_stats';
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    // Attempt to fetch from multiple sources in parallel
    const [hudResult, louisvilleResult, dataGovResult] = await Promise.allSettled([
      hudDataService.fetchHUDData(),
      louisvilleOpenDataService.fetchLouisvilleStats(),
      dataGovService.fetchFederalHomelessStats(),
    ]);

    // Combine results, prioritizing Louisville local data
    const stats = mergeStatistics([
      louisvilleResult.status === 'fulfilled' ? louisvilleResult.value : null,
      hudResult.status === 'fulfilled' ? hudResult.value : null,
      dataGovResult.status === 'fulfilled' ? dataGovResult.value : null,
    ]);

    // If all sources failed, load from fallback
    if (!stats.totalHomeless || stats.totalHomeless === 0) {
      console.warn('All data sources failed, loading fallback data');
      return await loadFallbackStats();
    }

    const result = {
      success: true,
      data: stats,
      sources: getSuccessfulSources([hudResult, louisvilleResult, dataGovResult]),
      timestamp: new Date().toISOString(),
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching current stats:', error);
    return await loadFallbackStats();
  }
};

/**
 * Fetch and aggregate historical data
 * @param {number} months - Number of months to retrieve
 * @returns {Promise<Object>} Aggregated historical data
 */
export const fetchHistoricalData = async (months = 12) => {
  const cacheKey = `historical_${months}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - Math.ceil(months / 12);

    const [hudHistorical, louisvilleTrends] = await Promise.allSettled([
      hudDataService.fetchHistoricalPITData('KY-501', startYear, currentYear),
      louisvilleOpenDataService.fetchMonthlyTrends(months),
    ]);

    // Merge and normalize historical data
    const historical = mergeHistoricalData([
      louisvilleTrends.status === 'fulfilled' ? louisvilleTrends.value : null,
      hudHistorical.status === 'fulfilled' ? hudHistorical.value : null,
    ], months);

    if (!historical || historical.length === 0) {
      console.warn('Historical data fetch failed, loading fallback');
      return await loadFallbackHistorical();
    }

    const result = {
      success: true,
      data: historical,
      sources: getSuccessfulSources([hudHistorical, louisvilleTrends]),
      timestamp: new Date().toISOString(),
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return await loadFallbackHistorical();
  }
};

/**
 * Fetch bed availability data
 * @returns {Promise<Object>} Bed availability data
 */
export const fetchBedAvailability = async () => {
  const cacheKey = 'bed_availability';
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const [shelterData, hicData] = await Promise.allSettled([
      louisvilleOpenDataService.fetchShelterAvailability(),
      hudDataService.fetchHICData(),
    ]);

    const beds = mergeBedData([
      shelterData.status === 'fulfilled' ? shelterData.value : null,
      hicData.status === 'fulfilled' ? hicData.value : null,
    ]);

    const result = {
      success: true,
      data: beds,
      sources: getSuccessfulSources([shelterData, hicData]),
      timestamp: new Date().toISOString(),
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching bed availability:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetch service locations from all sources
 * @returns {Promise<Object>} Aggregated service locations
 */
export const fetchServiceLocations = async () => {
  const cacheKey = 'service_locations';
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const locations = await louisvilleOpenDataService.fetchServiceLocations('all');

    // If Louisville data is unavailable, fall back to our static list
    if (!locations.success || !locations.data || locations.data.length === 0) {
      return await loadFallbackResources();
    }

    const result = {
      success: true,
      data: locations.data,
      source: 'Louisville Metro',
      timestamp: new Date().toISOString(),
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching service locations:', error);
    return await loadFallbackResources();
  }
};

/**
 * Merge statistics from multiple sources
 * Priority: Louisville > HUD > Data.gov > Fallback
 * @param {Array} sources - Array of source results
 * @returns {Object} Merged statistics
 */
const mergeStatistics = (sources) => {
  const merged = {
    totalHomeless: 0,
    sheltered: 0,
    unsheltered: 0,
    families: 0,
    veterans: 0,
    youth: 0,
    chronicHomeless: 0,
  };

  // Priority order: Louisville, HUD, Data.gov
  for (const source of sources) {
    if (!source || !source.success) continue;

    const data = source.data;
    if (!data) continue;

    // Use first available non-zero value for each field
    if (data.totalHomeless && !merged.totalHomeless) merged.totalHomeless = data.totalHomeless;
    if (data.sheltered && !merged.sheltered) merged.sheltered = data.sheltered;
    if (data.unsheltered && !merged.unsheltered) merged.unsheltered = data.unsheltered;
    if (data.families && !merged.families) merged.families = data.families;
    if (data.veterans && !merged.veterans) merged.veterans = data.veterans;
    if (data.youth && !merged.youth) merged.youth = data.youth;
    if (data.chronicHomeless && !merged.chronicHomeless) merged.chronicHomeless = data.chronicHomeless;
  }

  // Calculate percentages
  if (merged.totalHomeless > 0) {
    merged.shelteredPercent = ((merged.sheltered / merged.totalHomeless) * 100).toFixed(1);
    merged.unshelteredPercent = ((merged.unsheltered / merged.totalHomeless) * 100).toFixed(1);
  }

  return merged;
};

/**
 * Merge historical data from multiple sources
 * @param {Array} sources - Array of source results
 * @param {number} months - Number of months requested
 * @returns {Array} Merged historical data
 */
const mergeHistoricalData = (sources, months) => {
  const dataMap = new Map();

  for (const source of sources) {
    if (!source || !source.success || !source.data) continue;

    const dataArray = Array.isArray(source.data) ? source.data : [source.data];

    for (const point of dataArray) {
      const key = point.date || point.year || point.month;
      if (!key) continue;

      if (!dataMap.has(key)) {
        dataMap.set(key, point);
      } else {
        // Merge with existing data point
        const existing = dataMap.get(key);
        dataMap.set(key, { ...existing, ...point });
      }
    }
  }

  // Convert to array and sort by date
  const result = Array.from(dataMap.values()).sort((a, b) => {
    const dateA = new Date(a.date || a.year);
    const dateB = new Date(b.date || b.year);
    return dateA - dateB;
  });

  // Return only the requested number of most recent months
  return result.slice(-months);
};

/**
 * Merge bed availability data
 * @param {Array} sources - Array of source results
 * @returns {Object} Merged bed data
 */
const mergeBedData = (sources) => {
  const merged = {
    total: 0,
    available: 0,
    occupied: 0,
    occupancyRate: 0,
    breakdown: {
      emergency: 0,
      transitional: 0,
      permanent: 0,
    },
  };

  for (const source of sources) {
    if (!source || !source.success || !source.data) continue;

    const data = source.data;

    // Use first available non-zero values
    if (data.totalBeds && !merged.total) merged.total = data.totalBeds;
    if (data.total && !merged.total) merged.total = data.total;
    if (data.available && !merged.available) merged.available = data.available;
    if (data.occupied && !merged.occupied) merged.occupied = data.occupied;

    if (data.breakdown) {
      if (data.breakdown.emergency && !merged.breakdown.emergency) merged.breakdown.emergency = data.breakdown.emergency;
      if (data.breakdown.emergencyBeds && !merged.breakdown.emergency) merged.breakdown.emergency = data.breakdown.emergencyBeds;
      if (data.breakdown.transitional && !merged.breakdown.transitional) merged.breakdown.transitional = data.breakdown.transitional;
      if (data.breakdown.transitionalBeds && !merged.breakdown.transitional) merged.breakdown.transitional = data.breakdown.transitionalBeds;
      if (data.breakdown.permanent && !merged.breakdown.permanent) merged.breakdown.permanent = data.breakdown.permanent;
      if (data.breakdown.permanentBeds && !merged.breakdown.permanent) merged.breakdown.permanent = data.breakdown.permanentBeds;
    }
  }

  // Calculate derived values
  if (!merged.occupied && merged.total && merged.available) {
    merged.occupied = merged.total - merged.available;
  }
  if (!merged.available && merged.total && merged.occupied) {
    merged.available = merged.total - merged.occupied;
  }
  if (merged.total > 0 && merged.occupied > 0) {
    merged.occupancyRate = ((merged.occupied / merged.total) * 100).toFixed(1);
  }

  return merged;
};

/**
 * Get list of successful sources from results
 * @param {Array} results - Promise.allSettled results
 * @returns {Array} Array of successful source names
 */
const getSuccessfulSources = (results) => {
  const sourceNames = ['HUD Exchange', 'Louisville Metro', 'Data.gov'];
  return results
    .map((result, index) => (result.status === 'fulfilled' && result.value?.success ? sourceNames[index] : null))
    .filter(Boolean);
};

/**
 * Load fallback statistics from local JSON file
 * @returns {Promise<Object>} Fallback statistics
 */
const loadFallbackStats = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/fallback-hud-data.json`);
    const data = await response.json();

    return {
      success: true,
      data: data.currentStats || data,
      source: 'Fallback Data',
      isFallback: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error loading fallback stats:', error);
    // Return hardcoded fallback as last resort
    return {
      success: true,
      data: {
        totalHomeless: 1157,
        sheltered: 680,
        unsheltered: 477,
        families: 89,
        veterans: 142,
        youth: 78,
        chronicHomeless: 234,
      },
      source: 'Hardcoded Fallback',
      isFallback: true,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Load fallback historical data from local JSON file
 * @returns {Promise<Object>} Fallback historical data
 */
const loadFallbackHistorical = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/fallback-hud-data.json`);
    const data = await response.json();

    return {
      success: true,
      data: data.historicalData || [],
      source: 'Fallback Data',
      isFallback: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error loading fallback historical:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Load fallback resources from local JSON file
 * @returns {Promise<Object>} Fallback resources
 */
const loadFallbackResources = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/fallback-resources.json`);
    const data = await response.json();

    return {
      success: true,
      data: data.resources || data,
      source: 'Fallback Data',
      isFallback: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error loading fallback resources:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Clear all cached data
 */
export const clearCache = () => {
  cache.clear();
};

/**
 * Refresh all data (clear cache and fetch fresh)
 * @returns {Promise<Object>} Refreshed data
 */
export const refreshAllData = async () => {
  clearCache();
  const [stats, historical, beds, locations] = await Promise.all([
    fetchCurrentStats(),
    fetchHistoricalData(),
    fetchBedAvailability(),
    fetchServiceLocations(),
  ]);

  return {
    success: true,
    data: {
      currentStats: stats,
      historicalData: historical,
      bedAvailability: beds,
      serviceLocations: locations,
    },
    timestamp: new Date().toISOString(),
  };
};

export default {
  fetchCurrentStats,
  fetchHistoricalData,
  fetchBedAvailability,
  fetchServiceLocations,
  clearCache,
  refreshAllData,
};

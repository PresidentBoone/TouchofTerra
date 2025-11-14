/**
 * Dashboard Context
 * Global state management for the Touch of Terra Dashboard
 * Provides centralized access to dashboard data, loading states, and actions
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import dataAggregator from '../services/dataAggregator';
import scheduledUpdates from '../services/scheduledUpdates';

// Create context
const DashboardContext = createContext(null);

/**
 * Dashboard Provider Component
 * Wraps the application and provides global dashboard state
 */
export const DashboardProvider = ({ children }) => {
  // State for dashboard data
  const [currentStats, setCurrentStats] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [bedAvailability, setBedAvailability] = useState(null);
  const [resources, setResources] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [impactMetrics, setImpactMetrics] = useState(null);
  const [weatherAlerts, setWeatherAlerts] = useState([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataSources, setDataSources] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    resourceTypes: [],
    searchQuery: '',
    dateRange: null,
  });

  /**
   * Initial data load
   */
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [statsResult, historicalResult, bedsResult, locationsResult] = await Promise.all([
        dataAggregator.fetchCurrentStats(),
        dataAggregator.fetchHistoricalData(12),
        dataAggregator.fetchBedAvailability(),
        dataAggregator.fetchServiceLocations(),
      ]);

      // Update state with results
      if (statsResult.success) {
        setCurrentStats(statsResult.data);
        setDataSources((prev) => [...new Set([...prev, ...(statsResult.sources || [])])]);
      }

      if (historicalResult.success) {
        setHistoricalData(historicalResult.data);
        setDataSources((prev) => [...new Set([...prev, ...(historicalResult.sources || [])])]);
      }

      if (bedsResult.success) {
        setBedAvailability(bedsResult.data);
        setDataSources((prev) => [...new Set([...prev, ...(bedsResult.sources || [])])]);
      }

      if (locationsResult.success) {
        setResources(locationsResult.data);
      }

      setLastUpdated(new Date().toISOString());
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh all data
   */
  const refreshData = useCallback(async () => {
    try {
      const result = await dataAggregator.refreshAllData();

      if (result.success) {
        if (result.data.currentStats?.success) {
          setCurrentStats(result.data.currentStats.data);
        }
        if (result.data.historicalData?.success) {
          setHistoricalData(result.data.historicalData.data);
        }
        if (result.data.bedAvailability?.success) {
          setBedAvailability(result.data.bedAvailability.data);
        }
        if (result.data.serviceLocations?.success) {
          setResources(result.data.serviceLocations.data);
        }

        setLastUpdated(new Date().toISOString());
        scheduledUpdates.setLastUpdateTime();
      }

      return result;
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Handle scheduled data updates
   */
  const handleScheduledUpdate = useCallback((data) => {
    console.log('Received scheduled update');

    if (data.currentStats?.data) {
      setCurrentStats(data.currentStats.data);
    }
    if (data.historicalData?.data) {
      setHistoricalData(data.historicalData.data);
    }
    if (data.bedAvailability?.data) {
      setBedAvailability(data.bedAvailability.data);
    }
    if (data.serviceLocations?.data) {
      setResources(data.serviceLocations.data);
    }

    setLastUpdated(new Date().toISOString());
  }, []);

  /**
   * Handle weather alerts update
   */
  const handleWeatherUpdate = useCallback((alerts) => {
    setWeatherAlerts(alerts);
  }, []);

  /**
   * Update impact metrics
   */
  const updateImpactMetrics = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/impact-metrics.json`);
      const metrics = await response.json();
      setImpactMetrics(metrics);
    } catch (err) {
      console.error('Error loading impact metrics:', err);
    }
  }, []);

  /**
   * Update forecast data
   */
  const updateForecastData = useCallback((forecast) => {
    setForecastData(forecast);
  }, []);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Get filtered resources
   */
  const getFilteredResources = useCallback(() => {
    let filtered = [...resources];

    // Filter by resource types
    if (filters.resourceTypes.length > 0) {
      filtered = filtered.filter((resource) => filters.resourceTypes.includes(resource.type));
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (resource) =>
          resource.name.toLowerCase().includes(query) ||
          resource.address.toLowerCase().includes(query) ||
          resource.services.some((service) => service.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [resources, filters]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadInitialData();

    // Start scheduled updates
    const updateControl = scheduledUpdates.initialize({
      onDataUpdate: handleScheduledUpdate,
      onWeatherUpdate: handleWeatherUpdate,
    });

    // Load impact metrics
    updateImpactMetrics();

    // Cleanup on unmount
    return () => {
      updateControl.stopAll();
    };
  }, [loadInitialData, handleScheduledUpdate, handleWeatherUpdate, updateImpactMetrics]);

  // Context value
  const value = {
    // Data
    currentStats,
    historicalData,
    bedAvailability,
    resources,
    forecastData,
    impactMetrics,
    weatherAlerts,

    // State
    isLoading,
    error,
    lastUpdated,
    dataSources,
    filters,

    // Actions
    refreshData,
    updateImpactMetrics,
    updateForecastData,
    updateFilters,
    getFilteredResources,
    clearError,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

/**
 * Hook to use Dashboard Context
 * @returns {Object} Dashboard context value
 */
export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }

  return context;
};

export default DashboardContext;

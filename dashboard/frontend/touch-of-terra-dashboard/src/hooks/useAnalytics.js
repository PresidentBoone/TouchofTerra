/**
 * useAnalytics Hook
 * Hook for tracking user interactions and analytics events
 */

import { useCallback } from 'react';
import { trackEvent } from '../utils/analyticsTracker';

/**
 * Custom hook for analytics tracking
 * @returns {Object} { trackPageView, trackClick, trackExport, trackSearch, trackFilter }
 */
export const useAnalytics = () => {
  /**
   * Track page view
   * @param {string} pageName - Name of the page viewed
   */
  const trackPageView = useCallback((pageName) => {
    trackEvent({
      event: 'page_view',
      category: 'Navigation',
      label: pageName,
    });
  }, []);

  /**
   * Track button/link click
   * @param {string} elementName - Name of the clicked element
   * @param {string} category - Event category (default: 'Click')
   */
  const trackClick = useCallback((elementName, category = 'Click') => {
    trackEvent({
      event: 'click',
      category,
      label: elementName,
    });
  }, []);

  /**
   * Track chart/map export
   * @param {string} exportType - Type of export ('png', 'pdf')
   * @param {string} contentType - What was exported ('chart', 'map', 'full_dashboard')
   */
  const trackExport = useCallback((exportType, contentType) => {
    trackEvent({
      event: 'export',
      category: 'Export',
      label: `${contentType}_${exportType}`,
    });
  }, []);

  /**
   * Track search query
   * @param {string} query - Search query string
   */
  const trackSearch = useCallback((query) => {
    trackEvent({
      event: 'search',
      category: 'Search',
      label: query,
    });
  }, []);

  /**
   * Track filter usage
   * @param {string} filterType - Type of filter applied
   * @param {string} filterValue - Filter value
   */
  const trackFilter = useCallback((filterType, filterValue) => {
    trackEvent({
      event: 'filter',
      category: 'Filter',
      label: `${filterType}: ${filterValue}`,
    });
  }, []);

  /**
   * Track direction request
   * @param {string} resourceName - Name of the resource
   */
  const trackDirections = useCallback((resourceName) => {
    trackEvent({
      event: 'get_directions',
      category: 'Interaction',
      label: resourceName,
    });
  }, []);

  /**
   * Track data refresh
   * @param {boolean} isManual - Whether refresh was manual or automatic
   */
  const trackRefresh = useCallback((isManual = false) => {
    trackEvent({
      event: 'data_refresh',
      category: 'Data',
      label: isManual ? 'manual' : 'automatic',
    });
  }, []);

  /**
   * Track emergency button click
   * @param {string} emergencyType - Type of emergency action ('call_211', 'email')
   */
  const trackEmergency = useCallback((emergencyType) => {
    trackEvent({
      event: 'emergency_action',
      category: 'Emergency',
      label: emergencyType,
    });
  }, []);

  /**
   * Track chart interaction
   * @param {string} chartType - Type of chart interacted with
   * @param {string} action - Action performed ('hover', 'click', 'zoom')
   */
  const trackChartInteraction = useCallback((chartType, action) => {
    trackEvent({
      event: 'chart_interaction',
      category: 'Chart',
      label: `${chartType}_${action}`,
    });
  }, []);

  return {
    trackPageView,
    trackClick,
    trackExport,
    trackSearch,
    trackFilter,
    trackDirections,
    trackRefresh,
    trackEmergency,
    trackChartInteraction,
  };
};

export default useAnalytics;

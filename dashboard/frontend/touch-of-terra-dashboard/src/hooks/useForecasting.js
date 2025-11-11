/**
 * useForecasting Hook
 * Hook for generating and managing forecast data
 */

import { useState, useEffect, useCallback } from 'react';
import { generateForecast } from '../utils/forecastingEngine';

/**
 * Custom hook for forecasting with historical data
 * @param {Array} historicalData - Array of historical data points
 * @param {Object} options - Forecasting options
 * @param {number} options.monthsAhead - Months to forecast (default: 3)
 * @param {string} options.metric - Metric to forecast (default: 'totalHomeless')
 * @param {boolean} options.includeConfidence - Include confidence intervals (default: true)
 * @returns {Object} { forecast, isGenerating, error, regenerate }
 */
export const useForecasting = (historicalData, options = {}) => {
  const {
    monthsAhead = 3,
    metric = 'totalHomeless',
    includeConfidence = true,
  } = options;

  const [forecast, setForecast] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generate forecast from historical data
   */
  const generateForecastData = useCallback(async () => {
    if (!historicalData || historicalData.length < 3) {
      setError('Insufficient historical data for forecasting');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateForecast(historicalData, {
        monthsAhead,
        metric,
        includeConfidence,
      });

      if (result && result.length > 0) {
        setForecast(result);
      } else {
        throw new Error('Failed to generate forecast');
      }
    } catch (err) {
      console.error('Forecasting error:', err);
      setError(err.message || 'Failed to generate forecast');
    } finally {
      setIsGenerating(false);
    }
  }, [historicalData, monthsAhead, metric, includeConfidence]);

  /**
   * Regenerate forecast
   */
  const regenerate = useCallback(() => {
    generateForecastData();
  }, [generateForecastData]);

  // Generate forecast when historical data changes
  useEffect(() => {
    if (historicalData && historicalData.length >= 3) {
      generateForecastData();
    }
  }, [generateForecastData]);

  return {
    forecast,
    isGenerating,
    error,
    regenerate,
  };
};

export default useForecasting;

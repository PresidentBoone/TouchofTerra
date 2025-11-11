/**
 * useFetchData Hook
 * Reusable hook for fetching data with loading, error, and retry logic
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with built-in error handling and retry
 * @param {Function} fetchFunction - Async function that fetches data
 * @param {Object} options - Configuration options
 * @param {boolean} options.immediate - Whether to fetch immediately (default: true)
 * @param {Array} options.dependencies - Dependencies to trigger refetch
 * @param {number} options.retryAttempts - Number of retry attempts (default: 3)
 * @param {number} options.retryDelay - Delay between retries in ms (default: 1000)
 * @returns {Object} { data, isLoading, error, refetch, reset }
 */
export const useFetchData = (fetchFunction, options = {}) => {
  const {
    immediate = true,
    dependencies = [],
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Fetch data with retry logic
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();

      if (result && result.success !== false) {
        setData(result);
        setRetryCount(0);
        setIsLoading(false);
        return result;
      } else {
        throw new Error(result?.error || 'Data fetch failed');
      }
    } catch (err) {
      console.error('Fetch error:', err);

      if (retryCount < retryAttempts) {
        console.log(`Retrying... (${retryCount + 1}/${retryAttempts})`);
        setRetryCount((prev) => prev + 1);

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        // Recursive retry
        return fetchData();
      } else {
        setError(err.message || 'Failed to fetch data');
        setIsLoading(false);
        return null;
      }
    }
  }, [fetchFunction, retryCount, retryAttempts, retryDelay]);

  /**
   * Manual refetch
   */
  const refetch = useCallback(() => {
    setRetryCount(0);
    return fetchData();
  }, [fetchData]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
    setRetryCount(0);
  }, []);

  // Fetch on mount or when dependencies change
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, ...dependencies]);

  return {
    data,
    isLoading,
    error,
    refetch,
    reset,
  };
};

export default useFetchData;

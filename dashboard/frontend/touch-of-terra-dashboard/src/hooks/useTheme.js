/**
 * useTheme Hook
 * Hook for managing theme (light/dark mode) with localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for theme management
 * @param {string} defaultTheme - Default theme ('light' or 'dark', default: 'dark')
 * @returns {Object} { theme, toggleTheme, setTheme, isDark }
 */
export const useTheme = (defaultTheme = 'dark') => {
  // Initialize theme from localStorage or default
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored || defaultTheme;
  });

  /**
   * Set theme and persist to localStorage
   */
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    // Update document class for CSS
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  /**
   * Check if current theme is dark
   */
  const isDark = theme === 'dark';

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Listen for system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only auto-switch if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setTheme]);

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark,
  };
};

export default useTheme;

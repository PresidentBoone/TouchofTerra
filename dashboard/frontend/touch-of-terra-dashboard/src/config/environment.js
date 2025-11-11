/**
 * Environment Configuration Module
 * Centralized access to environment variables with fallbacks
 */

const config = {
  // API URLs
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001',

  // External Data Sources
  hudApiKey: import.meta.env.VITE_HUD_API_KEY || '',
  hudApiUrl: import.meta.env.VITE_HUD_API_URL || 'https://www.hudexchange.info/resource/reportmanagement/published/CoC_PopSub_NatlTerrDC_2024.xlsx',

  louisvilleDataUrl: import.meta.env.VITE_LOUISVILLE_DATA_URL || 'https://data.louisvilleky.gov/api',
  louisvilleApiKey: import.meta.env.VITE_LOUISVILLE_API_KEY || '',

  dataGovApiKey: import.meta.env.VITE_DATAGOV_API_KEY || '',
  dataGovApiUrl: import.meta.env.VITE_DATAGOV_API_URL || 'https://catalog.data.gov/api/3/action',

  // Google Maps API
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',

  // OpenWeather API
  openWeatherApiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '',

  // Feature Flags
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableForecasting: import.meta.env.VITE_ENABLE_FORECASTING === 'true',
  enableOfflineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  enableExport: import.meta.env.VITE_ENABLE_EXPORT === 'true',

  // Data Refresh Intervals (in milliseconds)
  dataRefreshInterval: parseInt(import.meta.env.VITE_DATA_REFRESH_INTERVAL || '3600000', 10),
  weatherRefreshInterval: parseInt(import.meta.env.VITE_WEATHER_REFRESH_INTERVAL || '1800000', 10),

  // Environment
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development' || import.meta.env.DEV,
  isProduction: import.meta.env.VITE_NODE_ENV === 'production' || import.meta.env.PROD,

  // Louisville CoC Code
  cocCode: 'KY-501',

  // Default coordinates for Louisville, KY
  defaultCoordinates: {
    lat: 38.2527,
    lng: -85.7585
  }
};

// Validation function to check if required keys are present
export const validateConfig = () => {
  const warnings = [];

  if (!config.googleMapsApiKey && config.isProduction) {
    warnings.push('Google Maps API key is missing. Directions feature may not work.');
  }

  if (!config.hudApiKey && config.isProduction) {
    warnings.push('HUD API key is missing. Live data updates may be limited.');
  }

  if (warnings.length > 0 && config.isDevelopment) {
    console.warn('Configuration warnings:', warnings);
  }

  return warnings;
};

export default config;

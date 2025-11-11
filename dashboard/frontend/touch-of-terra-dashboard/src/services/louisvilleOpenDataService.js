/**
 * Louisville Metro Open Data Service
 * Fetches local homelessness data from Louisville's open data portal
 * Source: https://data.louisvilleky.gov/
 */

import config from '../config/environment';

const LOUISVILLE_API_BASE = config.louisvilleDataUrl;

/**
 * Fetch current homelessness statistics for Louisville
 * @returns {Promise<Object>} Current statistics
 */
export const fetchLouisvilleStats = async () => {
  try {
    // Louisville Open Data may have datasets on:
    // - 311 Service Requests (homeless-related calls)
    // - Social Services data
    // - Housing data
    const response = await fetch(`${config.backendUrl}/api/external/louisville/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Louisville API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: transformLouisvilleStats(data),
      source: 'Louisville Metro Open Data',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching Louisville data:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetch shelter capacity and availability data
 * @returns {Promise<Object>} Shelter data
 */
export const fetchShelterAvailability = async () => {
  try {
    const response = await fetch(`${config.backendUrl}/api/external/louisville/shelters`);

    if (!response.ok) {
      throw new Error(`Shelter data request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: transformShelterData(data),
      source: 'Louisville Metro',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching shelter data:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetch service locations (shelters, food banks, clinics)
 * @param {string} type - Type of service ("shelter", "food", "clinic", "all")
 * @returns {Promise<Object>} Service locations
 */
export const fetchServiceLocations = async (type = 'all') => {
  try {
    const response = await fetch(`${config.backendUrl}/api/external/louisville/services?type=${type}`);

    if (!response.ok) {
      throw new Error(`Service locations request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.map(transformServiceLocation),
      source: 'Louisville Metro',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching service locations:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetch 311 service requests related to homelessness
 * @param {number} days - Number of days to look back
 * @returns {Promise<Object>} Service requests
 */
export const fetch311Requests = async (days = 30) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/external/louisville/311?days=${days}`);

    if (!response.ok) {
      throw new Error(`311 data request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: transform311Data(data),
      source: 'Louisville 311',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching 311 data:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetch monthly trend data from Louisville sources
 * @param {number} months - Number of months to retrieve
 * @returns {Promise<Object>} Monthly trend data
 */
export const fetchMonthlyTrends = async (months = 12) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/external/louisville/trends?months=${months}`);

    if (!response.ok) {
      throw new Error(`Monthly trends request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.map(transformMonthlyData),
      source: 'Louisville Metro',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching monthly trends:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Transform Louisville statistics to standard format
 * @param {Object} rawData - Raw Louisville data
 * @returns {Object} Transformed data
 */
const transformLouisvilleStats = (rawData) => {
  if (!rawData) return null;

  return {
    totalHomeless: parseInt(rawData.total_homeless || rawData.totalCount || 0, 10),
    sheltered: parseInt(rawData.sheltered_count || 0, 10),
    unsheltered: parseInt(rawData.unsheltered_count || 0, 10),
    families: parseInt(rawData.family_households || 0, 10),
    individuals: parseInt(rawData.individual_adults || 0, 10),
    lastUpdated: rawData.last_updated || new Date().toISOString(),
  };
};

/**
 * Transform shelter data to standard format
 * @param {Object} rawData - Raw shelter data
 * @returns {Object} Transformed data
 */
const transformShelterData = (rawData) => {
  if (!rawData) return null;

  return {
    totalBeds: parseInt(rawData.total_beds || rawData.capacity || 0, 10),
    available: parseInt(rawData.available_beds || 0, 10),
    occupied: parseInt(rawData.occupied_beds || 0, 10),
    occupancyRate: parseFloat(rawData.occupancy_rate || 0),
    breakdown: {
      emergency: parseInt(rawData.emergency_beds || 0, 10),
      transitional: parseInt(rawData.transitional_beds || 0, 10),
      permanent: parseInt(rawData.permanent_beds || 0, 10),
    },
    lastUpdated: rawData.updated_at || new Date().toISOString(),
  };
};

/**
 * Transform service location data to standard format
 * @param {Object} location - Raw location data
 * @returns {Object} Transformed location
 */
const transformServiceLocation = (location) => {
  return {
    id: location.id || location.facility_id,
    name: location.name || location.facility_name,
    type: normalizeServiceType(location.type || location.service_type),
    address: location.address || location.street_address,
    coordinates: {
      lat: parseFloat(location.latitude || location.lat || 0),
      lng: parseFloat(location.longitude || location.lng || location.lon || 0),
    },
    phone: location.phone || location.phone_number || '',
    hours: location.hours || location.operating_hours || 'Call for hours',
    services: Array.isArray(location.services) ? location.services : [],
    capacity: location.capacity ? parseInt(location.capacity, 10) : null,
    website: location.website || '',
  };
};

/**
 * Transform 311 data to standard format
 * @param {Array} requests - Array of 311 requests
 * @returns {Object} Aggregated 311 data
 */
const transform311Data = (requests) => {
  if (!Array.isArray(requests)) return { count: 0, requests: [] };

  return {
    count: requests.length,
    requests: requests.map((req) => ({
      id: req.request_id,
      type: req.request_type,
      description: req.description,
      location: req.location,
      date: req.created_date,
      status: req.status,
    })),
  };
};

/**
 * Transform monthly data point
 * @param {Object} dataPoint - Raw monthly data
 * @returns {Object} Transformed data point
 */
const transformMonthlyData = (dataPoint) => {
  return {
    month: dataPoint.month,
    year: dataPoint.year,
    date: `${dataPoint.year}-${String(dataPoint.month).padStart(2, '0')}-01`,
    total: parseInt(dataPoint.total || 0, 10),
    sheltered: parseInt(dataPoint.sheltered || 0, 10),
    unsheltered: parseInt(dataPoint.unsheltered || 0, 10),
  };
};

/**
 * Normalize service type to standard categories
 * @param {string} type - Raw service type
 * @returns {string} Normalized type
 */
const normalizeServiceType = (type) => {
  const typeMap = {
    shelter: 'shelter',
    'emergency shelter': 'shelter',
    'day shelter': 'shelter',
    'food bank': 'food',
    'food pantry': 'food',
    'meal service': 'food',
    clinic: 'clinic',
    'health center': 'clinic',
    'medical clinic': 'clinic',
    services: 'services',
    'case management': 'services',
    'social services': 'services',
  };

  return typeMap[type?.toLowerCase()] || 'services';
};

export default {
  fetchLouisvilleStats,
  fetchShelterAvailability,
  fetchServiceLocations,
  fetch311Requests,
  fetchMonthlyTrends,
};

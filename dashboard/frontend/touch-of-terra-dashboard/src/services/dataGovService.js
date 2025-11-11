/**
 * Data.gov Service
 * Fetches federal homelessness datasets from Data.gov API
 * Source: https://catalog.data.gov/
 */

import config from '../config/environment';

const DATAGOV_API_BASE = config.dataGovApiUrl;

/**
 * Search for homelessness-related datasets on Data.gov
 * @param {string} query - Search query
 * @param {number} rows - Number of results to return
 * @returns {Promise<Object>} Search results
 */
export const searchDatasets = async (query = 'homelessness Louisville', rows = 10) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/external/datagov/search?q=${encodeURIComponent(query)}&rows=${rows}`);

    if (!response.ok) {
      throw new Error(`Data.gov search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.result?.results || [],
      count: data.result?.count || 0,
      source: 'Data.gov',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error searching Data.gov:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetch specific dataset from Data.gov
 * @param {string} datasetId - Dataset identifier
 * @returns {Promise<Object>} Dataset details
 */
export const fetchDataset = async (datasetId) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/external/datagov/dataset/${datasetId}`);

    if (!response.ok) {
      throw new Error(`Dataset fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: transformDatasetInfo(data),
      source: 'Data.gov',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching dataset:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetch homelessness statistics from federal sources via Data.gov
 * @returns {Promise<Object>} Federal statistics
 */
export const fetchFederalHomelessStats = async () => {
  try {
    // This would query specific datasets like:
    // - HUD Annual Homeless Assessment Report (AHAR)
    // - SAMHSA homeless services data
    // - VA homeless veterans data
    const response = await fetch(`${config.backendUrl}/api/external/datagov/homeless-stats`);

    if (!response.ok) {
      throw new Error(`Federal stats request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: transformFederalStats(data),
      source: 'Data.gov / Federal Agencies',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching federal stats:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetch housing and rent data relevant to homelessness
 * @param {string} location - Location code (e.g., "Jefferson County, KY")
 * @returns {Promise<Object>} Housing data
 */
export const fetchHousingData = async (location = 'Jefferson County, KY') => {
  try {
    const response = await fetch(
      `${config.backendUrl}/api/external/datagov/housing?location=${encodeURIComponent(location)}`
    );

    if (!response.ok) {
      throw new Error(`Housing data request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: transformHousingData(data),
      source: 'Data.gov / HUD',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching housing data:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetch veteran homelessness data from VA sources
 * @returns {Promise<Object>} Veteran data
 */
export const fetchVeteranData = async () => {
  try {
    const response = await fetch(`${config.backendUrl}/api/external/datagov/veterans`);

    if (!response.ok) {
      throw new Error(`Veteran data request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: transformVeteranData(data),
      source: 'VA / Data.gov',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching veteran data:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Transform dataset information to standard format
 * @param {Object} rawData - Raw dataset info from Data.gov
 * @returns {Object} Transformed dataset info
 */
const transformDatasetInfo = (rawData) => {
  if (!rawData) return null;

  return {
    id: rawData.id || rawData.name,
    title: rawData.title,
    description: rawData.notes || rawData.description,
    organization: rawData.organization?.title || 'Unknown',
    lastUpdated: rawData.metadata_modified || rawData.revision_timestamp,
    resources: rawData.resources?.map((res) => ({
      id: res.id,
      name: res.name,
      format: res.format,
      url: res.url,
      description: res.description,
    })) || [],
    tags: rawData.tags?.map((tag) => tag.name || tag.display_name) || [],
  };
};

/**
 * Transform federal statistics to standard format
 * @param {Object} rawData - Raw federal data
 * @returns {Object} Transformed data
 */
const transformFederalStats = (rawData) => {
  if (!rawData) return null;

  return {
    national: {
      totalHomeless: parseInt(rawData.national_total || 0, 10),
      sheltered: parseInt(rawData.national_sheltered || 0, 10),
      unsheltered: parseInt(rawData.national_unsheltered || 0, 10),
      veterans: parseInt(rawData.national_veterans || 0, 10),
      families: parseInt(rawData.national_families || 0, 10),
    },
    state: {
      totalHomeless: parseInt(rawData.state_total || 0, 10),
      sheltered: parseInt(rawData.state_sheltered || 0, 10),
      unsheltered: parseInt(rawData.state_unsheltered || 0, 10),
    },
    year: rawData.year || new Date().getFullYear(),
  };
};

/**
 * Transform housing data to standard format
 * @param {Object} rawData - Raw housing data
 * @returns {Object} Transformed data
 */
const transformHousingData = (rawData) => {
  if (!rawData) return null;

  return {
    medianRent: parseFloat(rawData.median_rent || 0),
    medianHomePrice: parseFloat(rawData.median_home_price || 0),
    affordableUnits: parseInt(rawData.affordable_units || 0, 10),
    housingCostBurden: parseFloat(rawData.cost_burden_percent || 0),
    evictionRate: parseFloat(rawData.eviction_rate || 0),
    vacancyRate: parseFloat(rawData.vacancy_rate || 0),
    year: rawData.year || new Date().getFullYear(),
  };
};

/**
 * Transform veteran data to standard format
 * @param {Object} rawData - Raw veteran data
 * @returns {Object} Transformed data
 */
const transformVeteranData = (rawData) => {
  if (!rawData) return null;

  return {
    totalVeteranHomeless: parseInt(rawData.total_homeless || 0, 10),
    sheltered: parseInt(rawData.sheltered || 0, 10),
    unsheltered: parseInt(rawData.unsheltered || 0, 10),
    chronicHomeless: parseInt(rawData.chronic || 0, 10),
    servicesProvided: parseInt(rawData.services_provided || 0, 10),
    year: rawData.year || new Date().getFullYear(),
  };
};

/**
 * Fetch resource from Data.gov by URL
 * @param {string} resourceUrl - Direct URL to data resource
 * @returns {Promise<Object>} Resource data
 */
export const fetchResourceByUrl = async (resourceUrl) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/external/datagov/fetch?url=${encodeURIComponent(resourceUrl)}`);

    if (!response.ok) {
      throw new Error(`Resource fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching resource:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

export default {
  searchDatasets,
  fetchDataset,
  fetchFederalHomelessStats,
  fetchHousingData,
  fetchVeteranData,
  fetchResourceByUrl,
};

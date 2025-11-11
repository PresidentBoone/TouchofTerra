/**
 * HUD Data Service
 * Fetches Point-in-Time (PIT) and Housing Inventory Count (HIC) data
 * from U.S. Department of Housing and Urban Development
 */

import config from '../config/environment';

const HUD_EXCHANGE_BASE_URL = 'https://www.hudexchange.info/resource/reportmanagement/published';

/**
 * Fetch HUD PIT/HIC data for Louisville (KY-501 CoC)
 * @param {string} cocCode - Continuum of Care code (default: KY-501)
 * @param {number} year - Year for data (default: current year)
 * @returns {Promise<Object>} HUD data response
 */
export const fetchHUDData = async (cocCode = 'KY-501', year = new Date().getFullYear()) => {
  try {
    // Note: HUD publishes annual data, typically available in late spring
    // We'll try to fetch from our backend proxy first
    const response = await fetch(`${config.backendUrl}/api/external/hud?coc=${cocCode}&year=${year}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HUD API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: transformHUDData(data),
      source: 'HUD Exchange',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching HUD data:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetch historical PIT data for trend analysis
 * @param {string} cocCode - Continuum of Care code
 * @param {number} startYear - Start year
 * @param {number} endYear - End year
 * @returns {Promise<Object>} Historical data array
 */
export const fetchHistoricalPITData = async (
  cocCode = 'KY-501',
  startYear = 2020,
  endYear = new Date().getFullYear()
) => {
  try {
    const response = await fetch(
      `${config.backendUrl}/api/external/hud/historical?coc=${cocCode}&startYear=${startYear}&endYear=${endYear}`
    );

    if (!response.ok) {
      throw new Error(`Historical PIT data request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.map(transformHUDData),
      source: 'HUD Exchange',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching historical PIT data:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fetch Housing Inventory Count (HIC) data
 * @param {string} cocCode - Continuum of Care code
 * @param {number} year - Year for data
 * @returns {Promise<Object>} HIC data response
 */
export const fetchHICData = async (cocCode = 'KY-501', year = new Date().getFullYear()) => {
  try {
    const response = await fetch(`${config.backendUrl}/api/external/hud/hic?coc=${cocCode}&year=${year}`);

    if (!response.ok) {
      throw new Error(`HIC data request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: transformHICData(data),
      source: 'HUD Exchange',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching HIC data:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Transform raw HUD PIT data to our standard format
 * @param {Object} rawData - Raw HUD data
 * @returns {Object} Transformed data
 */
const transformHUDData = (rawData) => {
  if (!rawData) return null;

  return {
    year: rawData.year || new Date().getFullYear(),
    cocCode: rawData.cocCode || 'KY-501',
    cocName: rawData.cocName || 'Louisville/Jefferson County CoC',
    totalHomeless: parseInt(rawData.totalHomeless || rawData.Overall_Homeless_Total || 0, 10),
    sheltered: parseInt(rawData.sheltered || rawData.Sheltered_Total_Homeless || 0, 10),
    unsheltered: parseInt(rawData.unsheltered || rawData.Unsheltered_Total_Homeless || 0, 10),
    chronicHomeless: parseInt(rawData.chronicHomeless || rawData.Overall_Homeless_Chronic || 0, 10),
    veterans: parseInt(rawData.veterans || rawData.Overall_Homeless_Veterans || 0, 10),
    youth: parseInt(rawData.youth || rawData.Overall_Homeless_Under_25 || 0, 10),
    families: parseInt(rawData.families || rawData.Overall_Homeless_Parenting_Youth_Households || 0, 10),
  };
};

/**
 * Transform raw HUD HIC data to our standard format
 * @param {Object} rawData - Raw HIC data
 * @returns {Object} Transformed data
 */
const transformHICData = (rawData) => {
  if (!rawData) return null;

  return {
    year: rawData.year || new Date().getFullYear(),
    cocCode: rawData.cocCode || 'KY-501',
    totalBeds: parseInt(rawData.totalBeds || rawData.Total_Year_Round_Beds_ES_SH_TH || 0, 10),
    emergencyBeds: parseInt(rawData.emergencyBeds || rawData.Emergency_Shelter_Total_Year_Round_Beds || 0, 10),
    transitionalBeds: parseInt(rawData.transitionalBeds || rawData.Transitional_Housing_Total_Year_Round_Beds || 0, 10),
    permanentBeds: parseInt(rawData.permanentBeds || rawData.Permanent_Supportive_Housing_Total_Year_Round_Beds || 0, 10),
  };
};

/**
 * Parse HUD Excel/CSV file (if direct download is needed)
 * Note: This is a fallback method if API is unavailable
 * @param {string} fileUrl - URL to HUD data file
 * @returns {Promise<Object>} Parsed data
 */
export const parseHUDFile = async (fileUrl) => {
  try {
    // This would require a library like xlsx or papaparse
    // For now, we'll proxy through the backend
    const response = await fetch(`${config.backendUrl}/api/external/hud/parse?url=${encodeURIComponent(fileUrl)}`);

    if (!response.ok) {
      throw new Error(`File parsing failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error parsing HUD file:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

export default {
  fetchHUDData,
  fetchHistoricalPITData,
  fetchHICData,
  parseHUDFile,
};

/**
 * Geocoder Utility
 * Handles geocoding (address to coordinates) and reverse geocoding
 * Uses Google Maps Geocoding API or fallback to OpenStreetMap Nominatim
 */

import config from '../config/environment';

/**
 * Geocode an address to coordinates using Google Maps API
 * @param {string} address - Address to geocode
 * @returns {Promise<Object>} Coordinates and formatted address
 */
export const geocodeAddress = async (address) => {
  if (!address) {
    throw new Error('Address is required');
  }

  // Try Google Maps API first if key is available
  if (config.googleMapsApiKey) {
    try {
      return await geocodeWithGoogle(address);
    } catch (error) {
      console.warn('Google geocoding failed, falling back to OSM:', error);
    }
  }

  // Fallback to OpenStreetMap Nominatim (free, no API key)
  return await geocodeWithOSM(address);
};

/**
 * Geocode using Google Maps Geocoding API
 * @param {string} address - Address to geocode
 * @returns {Promise<Object>} Geocoding result
 */
const geocodeWithGoogle = async (address) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${config.googleMapsApiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'OK' && data.results.length > 0) {
    const result = data.results[0];
    return {
      success: true,
      coordinates: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      },
      formattedAddress: result.formatted_address,
      placeId: result.place_id,
      source: 'Google Maps',
    };
  } else {
    throw new Error(data.status || 'Geocoding failed');
  }
};

/**
 * Geocode using OpenStreetMap Nominatim
 * @param {string} address - Address to geocode
 * @returns {Promise<Object>} Geocoding result
 */
const geocodeWithOSM = async (address) => {
  // Add Louisville, KY context if not already in address
  const searchAddress = address.includes('Louisville') ? address : `${address}, Louisville, KY`;

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchAddress)}&format=json&limit=1`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'TouchOfTerra-Dashboard/1.0',
    },
  });

  const data = await response.json();

  if (data.length > 0) {
    const result = data[0];
    return {
      success: true,
      coordinates: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
      formattedAddress: result.display_name,
      source: 'OpenStreetMap',
    };
  } else {
    throw new Error('No results found');
  }
};

/**
 * Reverse geocode coordinates to address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Address information
 */
export const reverseGeocode = async (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error('Valid coordinates required');
  }

  // Try Google Maps API first
  if (config.googleMapsApiKey) {
    try {
      return await reverseGeocodeWithGoogle(lat, lng);
    } catch (error) {
      console.warn('Google reverse geocoding failed, falling back to OSM:', error);
    }
  }

  // Fallback to OSM
  return await reverseGeocodeWithOSM(lat, lng);
};

/**
 * Reverse geocode using Google Maps
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Address result
 */
const reverseGeocodeWithGoogle = async (lat, lng) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.googleMapsApiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'OK' && data.results.length > 0) {
    const result = data.results[0];
    return {
      success: true,
      address: result.formatted_address,
      components: result.address_components,
      source: 'Google Maps',
    };
  } else {
    throw new Error(data.status || 'Reverse geocoding failed');
  }
};

/**
 * Reverse geocode using OpenStreetMap
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Address result
 */
const reverseGeocodeWithOSM = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'TouchOfTerra-Dashboard/1.0',
    },
  });

  const data = await response.json();

  if (data && data.display_name) {
    return {
      success: true,
      address: data.display_name,
      components: data.address,
      source: 'OpenStreetMap',
    };
  } else {
    throw new Error('No address found');
  }
};

/**
 * Search for ZIP code and get coordinates
 * @param {string} zipCode - ZIP code to search
 * @returns {Promise<Object>} Coordinates and bounds
 */
export const geocodeZipCode = async (zipCode) => {
  const query = `${zipCode}, Louisville, KY`;
  return await geocodeAddress(query);
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {Object} coord1 - First coordinate {lat, lng}
 * @param {Object} coord2 - Second coordinate {lat, lng}
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km

  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
const toRadians = (degrees) => {
  return (degrees * Math.PI) / 180;
};

/**
 * Find nearest resources to a location
 * @param {Object} location - Location coordinates {lat, lng}
 * @param {Array} resources - Array of resources with coordinates
 * @param {number} limit - Maximum number of results (default: 5)
 * @returns {Array} Sorted array of resources with distances
 */
export const findNearestResources = (location, resources, limit = 5) => {
  const resourcesWithDistance = resources.map((resource) => {
    const distance = calculateDistance(location, resource.coordinates);
    return {
      ...resource,
      distance: parseFloat(distance.toFixed(2)),
      distanceMiles: parseFloat((distance * 0.621371).toFixed(2)),
    };
  });

  // Sort by distance
  resourcesWithDistance.sort((a, b) => a.distance - b.distance);

  return resourcesWithDistance.slice(0, limit);
};

/**
 * Get Google Maps directions URL
 * @param {Object} origin - Origin coordinates {lat, lng} or address string
 * @param {Object} destination - Destination coordinates {lat, lng} or address
 * @returns {string} Google Maps directions URL
 */
export const getDirectionsUrl = (origin, destination) => {
  const formatLocation = (loc) => {
    if (typeof loc === 'string') return encodeURIComponent(loc);
    if (loc.lat && loc.lng) return `${loc.lat},${loc.lng}`;
    return '';
  };

  const originStr = formatLocation(origin);
  const destStr = formatLocation(destination);

  return `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}`;
};

export default {
  geocodeAddress,
  reverseGeocode,
  geocodeZipCode,
  calculateDistance,
  findNearestResources,
  getDirectionsUrl,
};

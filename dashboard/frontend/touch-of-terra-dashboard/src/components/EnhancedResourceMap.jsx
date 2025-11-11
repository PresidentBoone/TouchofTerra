/**
 * Enhanced Resource Map Component
 * Interactive Leaflet map with search, filtering, and color-coded markers
 * Features ZIP/neighborhood search and Google Maps directions integration
 */

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDashboard } from '../context/DashboardContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { geocodeAddress, geocodeZipCode, getDirectionsUrl, findNearestResources } from '../utils/geocoder';
import config from '../config/environment';

/**
 * Component to update map center
 */
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

/**
 * Create custom marker icon based on resource type and availability
 */
const createMarkerIcon = (type, availability) => {
  const colors = {
    shelter: '#2563eb',
    food: '#16a34a',
    clinic: '#dc2626',
    services: '#9333ea',
  };

  const color = colors[type] || '#6b7280';

  // Determine opacity based on availability
  let opacity = 1;
  if (availability !== undefined) {
    const percent = availability;
    if (percent < 10) opacity = 0.5;
    else if (percent < 50) opacity = 0.75;
  }

  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 26 16 26s16-17.2 16-26C32 7.2 24.8 0 16 0z"
            fill="${color}" opacity="${opacity}" stroke="#fff" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="#fff"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

/**
 * Get availability percentage for a resource
 */
const getAvailabilityPercent = (resource) => {
  if (!resource.capacity || !resource.available) return undefined;
  return (resource.available / resource.capacity) * 100;
};

/**
 * Enhanced Resource Map Component
 */
const EnhancedResourceMap = () => {
  const { resources, getFilteredResources, updateFilters, filters } = useDashboard();
  const { trackSearch, trackDirections, trackFilter } = useAnalytics();

  const [mapCenter, setMapCenter] = useState(config.defaultCoordinates);
  const [mapZoom, setMapZoom] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [nearbyResources, setNearbyResources] = useState([]);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);

  const mapRef = useRef();

  // Get filtered resources
  const filteredResources = getFilteredResources();

  // Display resources (filtered or nearby)
  const displayResources = showNearbyOnly && nearbyResources.length > 0
    ? nearbyResources
    : filteredResources;

  /**
   * Handle search by ZIP or address
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    trackSearch(searchQuery);

    try {
      let result;

      // Check if query is a ZIP code
      if (/^\d{5}$/.test(searchQuery.trim())) {
        result = await geocodeZipCode(searchQuery.trim());
      } else {
        result = await geocodeAddress(searchQuery);
      }

      if (result.success) {
        setMapCenter(result.coordinates);
        setMapZoom(14);

        // Find nearby resources
        const nearby = findNearestResources(result.coordinates, resources, 10);
        setNearbyResources(nearby);
        setShowNearbyOnly(true);
      } else {
        setSearchError('Location not found. Please try a different search.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to search location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handle filter by resource type
   */
  const handleTypeFilter = (type) => {
    let newTypes;
    if (selectedTypes.includes(type)) {
      newTypes = selectedTypes.filter((t) => t !== type);
    } else {
      newTypes = [...selectedTypes, type];
    }

    setSelectedTypes(newTypes);
    updateFilters({ resourceTypes: newTypes });
    trackFilter('type', type);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setSelectedTypes([]);
    setShowNearbyOnly(false);
    setNearbyResources([]);
    setSearchQuery('');
    setMapCenter(config.defaultCoordinates);
    setMapZoom(12);
    updateFilters({ resourceTypes: [], searchQuery: '' });
  };

  /**
   * Handle directions click
   */
  const handleGetDirections = (resource) => {
    trackDirections(resource.name);
    const url = getDirectionsUrl('current+location', resource.coordinates);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Resource type options
  const resourceTypes = [
    { value: 'shelter', label: 'Shelters', icon: 'fa-home', color: 'blue' },
    { value: 'food', label: 'Food Banks', icon: 'fa-utensils', color: 'green' },
    { value: 'clinic', label: 'Health Clinics', icon: 'fa-heartbeat', color: 'red' },
    { value: 'services', label: 'Services', icon: 'fa-hands-helping', color: 'purple' },
  ];

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6" aria-labelledby="map-heading">
      {/* Header */}
      <div className="mb-6">
        <h2 id="map-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Resource Locations
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Find shelters, food banks, and services near you
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by ZIP code or address..."
              className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              aria-label="Search for location"
            />
            <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true"></i>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Search location"
          >
            {isSearching ? (
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {searchError && (
          <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
            {searchError}
          </div>
        )}
      </div>

      {/* Type Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {resourceTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => handleTypeFilter(type.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              selectedTypes.includes(type.value)
                ? `bg-${type.color}-600 text-white shadow-md`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label={`Filter by ${type.label}`}
            aria-pressed={selectedTypes.includes(type.value)}
          >
            <i className={`fas ${type.icon}`} aria-hidden="true"></i>
            <span>{type.label}</span>
            {selectedTypes.includes(type.value) && (
              <i className="fas fa-check ml-1" aria-hidden="true"></i>
            )}
          </button>
        ))}

        {(selectedTypes.length > 0 || showNearbyOnly) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            aria-label="Clear all filters"
          >
            <i className="fas fa-times mr-2" aria-hidden="true"></i>
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {displayResources.length} of {resources.length} locations
        {showNearbyOnly && ' (nearest to your search)'}
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700" style={{ height: '500px' }}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          ref={mapRef}
        >
          <MapUpdater center={mapCenter} zoom={mapZoom} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {displayResources.map((resource) => {
            const availability = getAvailabilityPercent(resource);

            return (
              <Marker
                key={resource.id}
                position={[resource.coordinates.lat, resource.coordinates.lng]}
                icon={createMarkerIcon(resource.type, availability)}
              >
                <Popup maxWidth={300}>
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-2">{resource.name}</h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <i className="fas fa-map-marker-alt mt-1 text-gray-500" aria-hidden="true"></i>
                        <span>{resource.address}</span>
                      </div>

                      {resource.phone && (
                        <div className="flex items-center gap-2">
                          <i className="fas fa-phone text-gray-500" aria-hidden="true"></i>
                          <a href={`tel:${resource.phone}`} className="text-blue-600 hover:underline">
                            {resource.phone}
                          </a>
                        </div>
                      )}

                      {resource.hours && (
                        <div className="flex items-start gap-2">
                          <i className="fas fa-clock mt-1 text-gray-500" aria-hidden="true"></i>
                          <span>{resource.hours}</span>
                        </div>
                      )}

                      {resource.capacity && (
                        <div className="flex items-center gap-2">
                          <i className="fas fa-bed text-gray-500" aria-hidden="true"></i>
                          <span>
                            {resource.available} / {resource.capacity} beds available
                          </span>
                        </div>
                      )}

                      {resource.services && resource.services.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="font-semibold mb-1">Services:</div>
                          <div className="flex flex-wrap gap-1">
                            {resource.services.slice(0, 3).map((service, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {service}
                              </span>
                            ))}
                            {resource.services.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                +{resource.services.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {resource.distance && (
                        <div className="text-xs text-gray-500 mt-2">
                          <i className="fas fa-route mr-1" aria-hidden="true"></i>
                          {resource.distanceMiles} miles away
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleGetDirections(resource)}
                      className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      aria-label={`Get directions to ${resource.name}`}
                    >
                      <i className="fas fa-directions" aria-hidden="true"></i>
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Map Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {resourceTypes.map((type) => (
            <div key={type.value} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: type.value === 'shelter' ? '#2563eb' :
                                          type.value === 'food' ? '#16a34a' :
                                          type.value === 'clinic' ? '#dc2626' : '#9333ea' }}
              ></div>
              <span className="text-gray-600 dark:text-gray-400">{type.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedResourceMap;

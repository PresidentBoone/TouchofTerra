import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Custom marker icons for different resource types
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${color}" d="M12 0C7.6 0 4 3.6 4 8c0 5.4 8 16 8 16s8-10.6 8-16c0-4.4-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const iconTypes = {
  shelter: createCustomIcon('#2563eb'),
  food: createCustomIcon('#16a34a'),
  clinic: createCustomIcon('#dc2626'),
  services: createCustomIcon('#9333ea'),
};

function ResourceMap() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);

  // Louisville coordinates
  const center = [38.2527, -85.7585];

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter((r) => r.type === selectedType));
    }
  }, [selectedType, resources]);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${API_URL}/api/resources`);
      const data = await response.json();
      setResources(data);
      setFilteredResources(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'shelter':
        return '🏠';
      case 'food':
        return '🍽️';
      case 'clinic':
        return '🏥';
      case 'services':
        return '🤝';
      default:
        return '📍';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'shelter':
        return 'bg-blue-500';
      case 'food':
        return 'bg-green-500';
      case 'clinic':
        return 'bg-red-500';
      case 'services':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-dark dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading resource map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-tot-beige to-tot-beige-warm rounded-3xl shadow-tot-large p-8 border border-tot-green-sage/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-tot-teal to-tot-green-primary rounded-2xl flex items-center justify-center shadow-tot-medium">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-tot-text-dark">Louisville Resource Finder</h2>
            <p className="text-tot-text-light">
              Find shelters, food banks, medical clinics, and support services near you
            </p>
          </div>
        </div>
        <div className="bg-tot-green-primary/10 rounded-xl p-4 border border-tot-green-primary/20">
          <p className="text-sm text-tot-text-dark">
            📍 <strong>{resources.length} resources</strong> available in the Louisville area • Updated daily
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-tot-text-dark mb-4">Filter by Type</h3>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <FilterButton
            active={selectedType === 'all'}
            onClick={() => setSelectedType('all')}
            icon="📍"
            label="All Resources"
            count={resources.length}
          />
          <FilterButton
            active={selectedType === 'shelter'}
            onClick={() => setSelectedType('shelter')}
            icon="🏠"
            label="Shelters"
            count={resources.filter((r) => r.type === 'shelter').length}
            color="blue"
          />
          <FilterButton
            active={selectedType === 'food'}
            onClick={() => setSelectedType('food')}
            icon="🍽️"
            label="Food"
            count={resources.filter((r) => r.type === 'food').length}
            color="green"
          />
          <FilterButton
            active={selectedType === 'clinic'}
            onClick={() => setSelectedType('clinic')}
            icon="🏥"
            label="Medical"
            count={resources.filter((r) => r.type === 'clinic').length}
            color="red"
          />
          <FilterButton
            active={selectedType === 'services'}
            onClick={() => setSelectedType('services')}
            icon="🤝"
            label="Services"
            count={resources.filter((r) => r.type === 'services').length}
            color="purple"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Resource List */}
        <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onClick={() => setSelectedResource(resource)}
              isSelected={selectedResource?.id === resource.id}
              getTypeIcon={getTypeIcon}
              getTypeColor={getTypeColor}
            />
          ))}
          {filteredResources.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No resources found for this category.
            </p>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-2 h-[600px] rounded-lg overflow-hidden shadow-2xl">
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredResources.map((resource) => (
              <Marker
                key={resource.id}
                position={[resource.coordinates.lat, resource.coordinates.lng]}
                icon={iconTypes[resource.type] || iconTypes.services}
                eventHandlers={{
                  click: () => setSelectedResource(resource),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-2">
                      {getTypeIcon(resource.type)} {resource.name}
                    </h3>
                    <p className="text-sm mb-2">{resource.address}</p>
                    {resource.hours && (
                      <p className="text-sm mb-2">
                        <strong>Hours:</strong> {resource.hours}
                      </p>
                    )}
                    {resource.phone && (
                      <p className="text-sm mb-2">
                        <strong>Phone:</strong>{' '}
                        <a href={`tel:${resource.phone}`} className="text-blue-600">
                          {resource.phone}
                        </a>
                      </p>
                    )}
                    {resource.services && (
                      <div className="text-sm">
                        <strong>Services:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {resource.services.map((service, index) => (
                            <li key={index}>{service}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {resource.capacity && (
                      <p className="text-sm mt-2 font-semibold">
                        Capacity: {resource.available}/{resource.capacity} beds available
                      </p>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${resource.coordinates.lat},${resource.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                      Get Directions
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Selected Resource Detail (Mobile) */}
      {selectedResource && (
        <div className="lg:hidden gradient-box">
          <h3 className="text-xl font-bold mb-3 text-white">
            {getTypeIcon(selectedResource.type)} {selectedResource.name}
          </h3>
          <div className="space-y-2 text-white">
            <p>{selectedResource.address}</p>
            {selectedResource.hours && (
              <p>
                <strong>Hours:</strong> {selectedResource.hours}
              </p>
            )}
            {selectedResource.phone && (
              <p>
                <strong>Phone:</strong>{' '}
                <a href={`tel:${selectedResource.phone}`} className="underline">
                  {selectedResource.phone}
                </a>
              </p>
            )}
            {selectedResource.services && (
              <div>
                <strong>Services:</strong>
                <ul className="list-disc list-inside mt-1">
                  {selectedResource.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedResource.capacity && (
              <p className="font-semibold">
                Capacity: {selectedResource.available}/{selectedResource.capacity}{' '}
                beds available
              </p>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedResource.coordinates.lat},${selectedResource.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block bg-white text-primary-dark px-6 py-2 rounded-lg hover:bg-gray-100 font-semibold"
            >
              Get Directions →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterButton({ active, onClick, icon, label, count, color = 'gray' }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-xl font-semibold transition-all shadow-tot-medium hover:shadow-tot-large hover:scale-105 ${
        active
          ? 'bg-gradient-to-r from-tot-teal to-tot-green-primary text-white'
          : 'bg-white border-2 border-tot-green-sage/20 text-tot-text-dark hover:border-tot-green-primary/40'
      }`}
    >
      {icon} {label} <span className="text-sm opacity-80">({count})</span>
    </button>
  );
}

function ResourceCard({ resource, onClick, isSelected, getTypeIcon, getTypeColor }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-5 rounded-2xl transition-all shadow-tot-medium hover:shadow-tot-large ${
        isSelected
          ? 'bg-gradient-to-br from-tot-teal to-tot-green-primary text-white scale-105 border-2 border-white'
          : 'bg-white hover:scale-102 border-2 border-tot-green-sage/20 hover:border-tot-green-primary/40'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-lg">
          {getTypeIcon(resource.type)} {resource.name}
        </h3>
        {resource.isOpen && (
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
            isSelected ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
          }`}>
            Open Now
          </span>
        )}
      </div>
      <p className={`text-sm mb-2 ${isSelected ? 'text-white/90' : 'text-tot-text-light'}`}>
        {resource.address}
      </p>
      {resource.hours && (
        <p className={`text-sm flex items-center gap-2 ${isSelected ? 'text-white/80' : 'text-tot-text-light'}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {resource.hours}
        </p>
      )}
      {resource.capacity && (
        <div className={`mt-3 pt-3 border-t ${isSelected ? 'border-white/20' : 'border-tot-green-sage/20'}`}>
          <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-tot-text-dark'}`}>
            <span className="text-lg">{resource.available}</span> / {resource.capacity} beds available
          </p>
        </div>
      )}
    </div>
  );
}

export default ResourceMap;

import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AdminPortal() {
  const [activeTab, setActiveTab] = useState('resources'); // resources, stats
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [adminSecret, setAdminSecret] = useState(localStorage.getItem('adminSecret') || '');

  // Resource Form Data
  const [formData, setFormData] = useState({
    name: '',
    type: 'shelter',
    address: '',
    coordinates: { lat: 38.2527, lng: -85.7585 },
    hours: '',
    phone: '',
    services: '',
    capacity: '',
    available: '',
    isOpen: true,
  });

  useEffect(() => {
    fetchResources();
    fetchStats();
  }, [adminSecret]);

  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminSecret}`
    };
  };

  const handleAuthError = () => {
    const secret = prompt("Please enter the Admin Secret Key:");
    if (secret) {
      setAdminSecret(secret);
      localStorage.setItem('adminSecret', secret);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await fetch(`${API_URL}/api/resources`);
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats/current`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // --- Resource Handlers ---

  const handleResourceSubmit = async (e) => {
    e.preventDefault();

    const resourceData = {
      ...formData,
      services: formData.services.split(',').map((s) => s.trim()),
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      available: formData.available ? parseInt(formData.available) : undefined,
    };

    try {
      const url = editingResource
        ? `${API_URL}/api/admin/resources/${editingResource.id}`
        : `${API_URL}/api/admin/resources`;

      const method = editingResource ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(resourceData),
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        fetchResources();
        resetForm();
        alert(
          editingResource
            ? 'Resource updated successfully!'
            : 'Resource added successfully!'
        );
      } else {
        alert("Failed to save resource.");
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Error saving resource');
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      address: resource.address,
      coordinates: resource.coordinates,
      hours: resource.hours || '',
      phone: resource.phone || '',
      services: resource.services ? resource.services.join(', ') : '',
      capacity: resource.capacity || '',
      available: resource.available || '',
      isOpen: resource.isOpen,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/resources/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        fetchResources();
        alert('Resource deleted successfully!');
      } else {
        alert('Failed to delete resource.');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Error deleting resource');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingResource(null);
    setFormData({
      name: '',
      type: 'shelter',
      address: '',
      coordinates: { lat: 38.2527, lng: -85.7585 },
      hours: '',
      phone: '',
      services: '',
      capacity: '',
      available: '',
      isOpen: true,
    });
  };

  // --- Stats Handlers ---

  const handleStatsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/admin/stats/current`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(stats)
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        alert("Statistics updated successfully!");
        fetchStats();
      } else {
        alert("Failed to update statistics.");
      }
    } catch (error) {
      console.error("Error updating stats:", error);
      alert("Error updating stats");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Portal</h1>
        <div className="flex gap-4">
          {!adminSecret && (
            <button onClick={handleAuthError} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">
              Login
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'resources' ? 'border-b-2 border-primary-dark text-primary-dark' : 'text-gray-500'}`}
          onClick={() => setActiveTab('resources')}
        >
          Manage Resources
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'stats' ? 'border-b-2 border-primary-dark text-primary-dark' : 'text-gray-500'}`}
          onClick={() => setActiveTab('stats')}
        >
          Update Statistics
        </button>
      </div>

      {/* RESOURCES TAB */}
      {activeTab === 'resources' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showForm ? 'Cancel' : '+ Add Resource'}
            </button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="gradient-box mb-8">
              <h2 className="text-2xl font-bold mb-6 text-white">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h2>
              <form onSubmit={handleResourceSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="shelter">Shelter</option>
                      <option value="food">Food</option>
                      <option value="clinic">Clinic</option>
                      <option value="services">Services</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formData.coordinates.lat}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: {
                            ...formData.coordinates,
                            lat: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formData.coordinates.lng}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: {
                            ...formData.coordinates,
                            lng: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Hours
                    </label>
                    <input
                      type="text"
                      value={formData.hours}
                      onChange={(e) =>
                        setFormData({ ...formData, hours: e.target.value })
                      }
                      placeholder="e.g., Mon-Fri 9am-5pm"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="(502) 555-1234"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Services (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.services}
                    onChange={(e) =>
                      setFormData({ ...formData, services: e.target.value })
                    }
                    placeholder="Emergency Shelter, Meals, Case Management"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Total Capacity
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                      Available Beds
                    </label>
                    <input
                      type="number"
                      value={formData.available}
                      onChange={(e) =>
                        setFormData({ ...formData, available: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isOpen"
                    checked={formData.isOpen}
                    onChange={(e) =>
                      setFormData({ ...formData, isOpen: e.target.checked })
                    }
                    className="mr-2 h-5 w-5"
                  />
                  <label htmlFor="isOpen" className="text-white font-semibold">
                    Currently Open
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-white text-primary-dark rounded-lg hover:bg-gray-100 font-semibold transition-colors"
                  >
                    {editingResource ? 'Update Resource' : 'Add Resource'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Resource List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">All Resources ({resources.length})</h2>
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{resource.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Type: <span className="capitalize font-semibold">{resource.type}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {resource.address}
                    </p>
                    {resource.phone && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Phone: {resource.phone}
                      </p>
                    )}
                    {resource.hours && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Hours: {resource.hours}
                      </p>
                    )}
                    {resource.capacity && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Capacity: {resource.available}/{resource.capacity} beds available
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Status: {resource.isOpen ? '🟢 Open' : '🔴 Closed'}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATS TAB */}
      {activeTab === 'stats' && stats && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Update Impact Statistics</h2>
          <form onSubmit={handleStatsSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Total Homeless Population</label>
                <input
                  type="number"
                  value={stats.totalHomeless}
                  onChange={(e) => setStats({ ...stats, totalHomeless: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Sheltered Individuals</label>
                <input
                  type="number"
                  value={stats.sheltered}
                  onChange={(e) => setStats({ ...stats, sheltered: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Unsheltered Individuals</label>
                <input
                  type="number"
                  value={stats.unsheltered}
                  onChange={(e) => setStats({ ...stats, unsheltered: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Families</label>
                <input
                  type="number"
                  value={stats.families}
                  onChange={(e) => setStats({ ...stats, families: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Veterans</label>
                <input
                  type="number"
                  value={stats.veterans}
                  onChange={(e) => setStats({ ...stats, veterans: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Youth</label>
                <input
                  type="number"
                  value={stats.youth}
                  onChange={(e) => setStats({ ...stats, youth: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-primary-dark text-white rounded-lg hover:bg-opacity-90 font-semibold"
                style={{ backgroundColor: '#7BA05B' }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminPortal;

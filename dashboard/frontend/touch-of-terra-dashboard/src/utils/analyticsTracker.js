/**
 * Analytics Tracker
 * Tracks user interactions and events for analytics
 * Stores events locally and provides export functionality
 */

import config from '../config/environment';

// In-memory event store
const events = [];

// Maximum events to store in memory
const MAX_EVENTS = 1000;

/**
 * Track an analytics event
 * @param {Object} eventData - Event data
 * @param {string} eventData.event - Event name
 * @param {string} eventData.category - Event category
 * @param {string} eventData.label - Event label
 * @param {number} eventData.value - Event value (optional)
 * @returns {Object} The tracked event
 */
export const trackEvent = (eventData) => {
  // Only track if analytics is enabled
  if (!config.enableAnalytics) {
    return null;
  }

  const event = {
    ...eventData,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    userId: getUserId(),
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    url: window.location.href,
    referrer: document.referrer,
  };

  // Add to events array
  events.push(event);

  // Maintain size limit
  if (events.length > MAX_EVENTS) {
    events.shift();
  }

  // Store in localStorage for persistence
  storeEvent(event);

  // Log in development
  if (config.isDevelopment) {
    console.log('[Analytics]', event);
  }

  // You could also send to external analytics service here
  // e.g., Google Analytics, Mixpanel, etc.
  // sendToExternalService(event);

  return event;
};

/**
 * Get or create session ID
 * @returns {string} Session ID
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }

  return sessionId;
};

/**
 * Get or create user ID
 * @returns {string} User ID
 */
const getUserId = () => {
  let userId = localStorage.getItem('analytics_user_id');

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_user_id', userId);
  }

  return userId;
};

/**
 * Store event in localStorage
 * @param {Object} event - Event to store
 */
const storeEvent = (event) => {
  try {
    const storedEvents = getStoredEvents();
    storedEvents.push(event);

    // Keep only last 500 events in localStorage
    const recentEvents = storedEvents.slice(-500);

    localStorage.setItem('analytics_events', JSON.stringify(recentEvents));
  } catch (error) {
    console.error('Error storing analytics event:', error);
  }
};

/**
 * Get stored events from localStorage
 * @returns {Array} Stored events
 */
const getStoredEvents = () => {
  try {
    const stored = localStorage.getItem('analytics_events');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading stored events:', error);
    return [];
  }
};

/**
 * Get all tracked events
 * @param {Object} filters - Filter options
 * @returns {Array} Filtered events
 */
export const getEvents = (filters = {}) => {
  let filteredEvents = [...events];

  if (filters.category) {
    filteredEvents = filteredEvents.filter((e) => e.category === filters.category);
  }

  if (filters.event) {
    filteredEvents = filteredEvents.filter((e) => e.event === filters.event);
  }

  if (filters.startDate) {
    filteredEvents = filteredEvents.filter((e) => new Date(e.timestamp) >= new Date(filters.startDate));
  }

  if (filters.endDate) {
    filteredEvents = filteredEvents.filter((e) => new Date(e.timestamp) <= new Date(filters.endDate));
  }

  return filteredEvents;
};

/**
 * Get event summary statistics
 * @returns {Object} Summary statistics
 */
export const getEventSummary = () => {
  const allEvents = getStoredEvents();

  const summary = {
    totalEvents: allEvents.length,
    uniqueSessions: new Set(allEvents.map((e) => e.sessionId)).size,
    eventsByCategory: {},
    eventsByType: {},
    mostCommonEvents: [],
  };

  // Count by category
  allEvents.forEach((event) => {
    summary.eventsByCategory[event.category] = (summary.eventsByCategory[event.category] || 0) + 1;
    summary.eventsByType[event.event] = (summary.eventsByType[event.event] || 0) + 1;
  });

  // Get most common events
  summary.mostCommonEvents = Object.entries(summary.eventsByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([event, count]) => ({ event, count }));

  return summary;
};

/**
 * Export events as JSON
 * @param {Object} filters - Filter options
 * @returns {string} JSON string of events
 */
export const exportEventsJSON = (filters = {}) => {
  const filteredEvents = getEvents(filters);
  return JSON.stringify(filteredEvents, null, 2);
};

/**
 * Export events as CSV
 * @param {Object} filters - Filter options
 * @returns {string} CSV string of events
 */
export const exportEventsCSV = (filters = {}) => {
  const filteredEvents = getEvents(filters);

  if (filteredEvents.length === 0) {
    return 'No events to export';
  }

  // CSV headers
  const headers = ['timestamp', 'event', 'category', 'label', 'value', 'sessionId', 'url'];
  const csvRows = [headers.join(',')];

  // CSV data rows
  filteredEvents.forEach((event) => {
    const row = headers.map((header) => {
      const value = event[header] || '';
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

/**
 * Clear all stored events
 */
export const clearEvents = () => {
  events.length = 0;
  localStorage.removeItem('analytics_events');
};

/**
 * Download events as file
 * @param {string} format - Format ('json' or 'csv')
 * @param {Object} filters - Filter options
 */
export const downloadEvents = (format = 'json', filters = {}) => {
  const data = format === 'csv' ? exportEventsCSV(filters) : exportEventsJSON(filters);
  const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `touch-of-terra-analytics-${Date.now()}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Send events to backend for server-side storage
 * @param {Array} eventsToSend - Events to send
 * @returns {Promise<Object>} Response from backend
 */
export const sendEventsToBackend = async (eventsToSend = null) => {
  if (!config.enableAnalytics) {
    return { success: false, message: 'Analytics disabled' };
  }

  const dataToSend = eventsToSend || events.slice(-100);

  try {
    const response = await fetch(`${config.backendUrl}/api/analytics/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events: dataToSend }),
    });

    if (response.ok) {
      return { success: true, message: 'Events sent successfully' };
    } else {
      throw new Error('Failed to send events');
    }
  } catch (error) {
    console.error('Error sending events to backend:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Batch send events periodically
 * @param {number} intervalMs - Interval in milliseconds (default: 5 minutes)
 * @returns {Function} Stop function
 */
export const startBatchSending = (intervalMs = 300000) => {
  const intervalId = setInterval(() => {
    sendEventsToBackend();
  }, intervalMs);

  return () => clearInterval(intervalId);
};

// Track page load automatically
if (typeof window !== 'undefined') {
  trackEvent({
    event: 'page_load',
    category: 'System',
    label: window.location.pathname,
  });
}

export default {
  trackEvent,
  getEvents,
  getEventSummary,
  exportEventsJSON,
  exportEventsCSV,
  clearEvents,
  downloadEvents,
  sendEventsToBackend,
  startBatchSending,
};

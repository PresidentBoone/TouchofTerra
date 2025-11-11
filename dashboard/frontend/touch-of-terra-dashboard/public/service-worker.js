/**
 * Touch of Terra Dashboard Service Worker
 * Provides offline support and caching for essential resources
 */

const CACHE_NAME = 'touch-of-terra-v1';
const RUNTIME_CACHE = 'touch-of-terra-runtime';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/data/fallback-hud-data.json',
  '/data/fallback-resources.json',
  '/data/impact-metrics.json',
];

// API routes to cache
const API_CACHE_ROUTES = [
  '/api/stats/current',
  '/api/stats/historical',
  '/api/stats/beds',
  '/api/resources',
  '/api/alerts',
  '/api/impact-metrics',
];

/**
 * Install event - cache essential assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );

  // Force the waiting service worker to become active
  self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );

  // Claim all clients immediately
  return self.clients.claim();
});

/**
 * Fetch event - serve from cache or network
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(cacheFirstStrategy(request));
});

/**
 * Cache-first strategy
 * Try cache first, fallback to network
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    // Check cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return fallback for offline scenarios
    return getFallbackResponse(request);
  }
}

/**
 * Network-first strategy
 * Try network first, fallback to cache
 */
async function networkFirstStrategy(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    // Try network first
    const networkResponse = await fetch(request, { timeout: 5000 });

    // Cache successful API responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Fallback to cache if network fails
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('[Service Worker] Serving from cache:', request.url);
      return cachedResponse;
    }

    // Return fallback data
    return getFallbackResponse(request);
  }
}

/**
 * Get fallback response for offline scenarios
 */
async function getFallbackResponse(request) {
  const url = new URL(request.url);

  // API fallback responses
  if (url.pathname.includes('/api/stats/current') || url.pathname.includes('/api/stats/historical')) {
    const fallbackCache = await caches.match('/data/fallback-hud-data.json');
    if (fallbackCache) return fallbackCache;
  }

  if (url.pathname.includes('/api/resources')) {
    const fallbackCache = await caches.match('/data/fallback-resources.json');
    if (fallbackCache) return fallbackCache;
  }

  if (url.pathname.includes('/api/impact-metrics')) {
    const fallbackCache = await caches.match('/data/impact-metrics.json');
    if (fallbackCache) return fallbackCache;
  }

  // HTML fallback
  if (request.destination === 'document') {
    const fallbackCache = await caches.match('/index.html');
    if (fallbackCache) return fallbackCache;
  }

  // Generic offline response
  return new Response(
    JSON.stringify({
      success: false,
      error: 'You are offline. Some data may be outdated.',
      offline: true,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Background sync for analytics events
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalyticsEvents());
  }
});

/**
 * Sync analytics events when back online
 */
async function syncAnalyticsEvents() {
  try {
    // Retrieve pending events from IndexedDB
    // This is a placeholder - actual implementation would use IndexedDB
    console.log('[Service Worker] Syncing analytics events...');

    // Send events to server
    // await fetch('/api/analytics/events', { ... });

    return Promise.resolve();
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    return Promise.reject(error);
  }
}

/**
 * Push notification handler (for future use)
 */
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'New update from Touch of Terra',
    icon: '/logo.png',
    badge: '/badge.png',
    data: data,
  };

  event.waitUntil(self.registration.showNotification(data.title || 'Touch of Terra', options));
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

/**
 * Message handler for cache updates
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[Service Worker] Loaded successfully');

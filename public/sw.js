/// <reference lib="webworker" />

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Assets to precache
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

// Cache size limits
const CACHE_LIMITS = {
  [DYNAMIC_CACHE]: 50,
  [IMAGE_CACHE]: 30,
  [API_CACHE]: 20,
};

// ============================================
// CACHE STRATEGIES
// ============================================

/**
 * CACHE FIRST (Cache Falling Back to Network)
 * Best for: Static assets, fonts, images that rarely change
 * How it works: Check cache first, if not found, fetch from network and cache
 */
async function cacheFirst(request, cacheName = STATIC_CACHE) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log(`[SW] Cache First HIT: ${request.url}`);
    return cachedResponse;
  }
  
  console.log(`[SW] Cache First MISS, fetching: ${request.url}`);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log(`[SW] Cache First network error: ${error}`);
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    throw error;
  }
}

/**
 * NETWORK FIRST (Network Falling Back to Cache)
 * Best for: API requests, frequently changing data
 * How it works: Try network first, if fails, fall back to cache
 */
async function networkFirst(request, cacheName = DYNAMIC_CACHE) {
  try {
    console.log(`[SW] Network First, fetching: ${request.url}`);
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      await trimCache(cacheName, CACHE_LIMITS[cacheName]);
    }
    return networkResponse;
  } catch (error) {
    console.log(`[SW] Network First failed, checking cache: ${request.url}`);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

/**
 * STALE WHILE REVALIDATE
 * Best for: Assets that can be slightly stale, like avatars, non-critical updates
 * How it works: Return cache immediately, then update cache in background
 */
async function staleWhileRevalidate(request, cacheName = DYNAMIC_CACHE) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        console.log(`[SW] SWR updating cache: ${request.url}`);
        cache.put(request, networkResponse.clone());
        trimCache(cacheName, CACHE_LIMITS[cacheName]);
      }
      return networkResponse;
    })
    .catch(error => {
      console.log(`[SW] SWR network error: ${error}`);
      return cachedResponse;
    });

  if (cachedResponse) {
    console.log(`[SW] SWR returning cached: ${request.url}`);
    return cachedResponse;
  }
  
  console.log(`[SW] SWR no cache, waiting for network: ${request.url}`);
  return fetchPromise;
}

/**
 * NETWORK ONLY
 * Best for: Non-cacheable requests, real-time data, analytics
 * How it works: Always fetch from network, never cache
 */
async function networkOnly(request) {
  console.log(`[SW] Network Only: ${request.url}`);
  return fetch(request);
}

/**
 * CACHE ONLY
 * Best for: Precached static assets that never change
 * How it works: Only serve from cache, never fetch
 */
async function cacheOnly(request) {
  console.log(`[SW] Cache Only: ${request.url}`);
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  throw new Error('Not found in cache');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Limit cache size by removing oldest entries
 */
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    console.log(`[SW] Trimming cache ${cacheName}: ${keys.length} > ${maxItems}`);
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxItems);
  }
}

/**
 * Determine which strategy to use based on request
 */
function getStrategy(request) {
  const url = new URL(request.url);
  
  // API requests - Network First
  if (url.pathname.startsWith('/api/')) {
    return { strategy: 'networkFirst', cache: API_CACHE };
  }
  
  // Images - Cache First
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
    return { strategy: 'cacheFirst', cache: IMAGE_CACHE };
  }
  
  // Static assets (JS, CSS) - Stale While Revalidate
  if (url.pathname.match(/\.(js|css)$/) || url.pathname.startsWith('/_next/static/')) {
    return { strategy: 'staleWhileRevalidate', cache: STATIC_CACHE };
  }
  
  // Fonts - Cache First (they rarely change)
  if (request.destination === 'font' || url.pathname.match(/\.(woff|woff2|ttf|otf)$/)) {
    return { strategy: 'cacheFirst', cache: STATIC_CACHE };
  }
  
  // Navigation requests - Network First
  if (request.mode === 'navigate') {
    return { strategy: 'networkFirst', cache: DYNAMIC_CACHE };
  }
  
  // Default - Stale While Revalidate
  return { strategy: 'staleWhileRevalidate', cache: DYNAMIC_CACHE };
}

// ============================================
// SERVICE WORKER EVENTS
// ============================================

// Install event - Precache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return !cacheName.includes(CACHE_VERSION);
            })
            .map(cacheName => {
              console.log(`[SW] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - Apply caching strategies
self.addEventListener('fetch', (event) => {
  // Skip chrome-extension and non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  const { strategy, cache } = getStrategy(event.request);
  
  let responsePromise;
  switch (strategy) {
    case 'cacheFirst':
      responsePromise = cacheFirst(event.request, cache);
      break;
    case 'networkFirst':
      responsePromise = networkFirst(event.request, cache);
      break;
    case 'staleWhileRevalidate':
      responsePromise = staleWhileRevalidate(event.request, cache);
      break;
    case 'networkOnly':
      responsePromise = networkOnly(event.request);
      break;
    case 'cacheOnly':
      responsePromise = cacheOnly(event.request);
      break;
    default:
      responsePromise = fetch(event.request);
  }
  
  event.respondWith(
    responsePromise.catch(() => {
      // Fallback for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/offline');
      }
      return new Response('Offline', { status: 503 });
    })
  );
});

// ============================================
// PUSH NOTIFICATIONS
// ============================================

self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  let data = {
    title: 'PWA Notification',
    body: 'You have a new notification!',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/badge-72x72.svg',
    tag: 'default',
    data: { url: '/' }
  };
  
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {
    console.log('[SW] Could not parse push data');
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    data: data.data,
    vibrate: [100, 50, 100],
    actions: data.actions || [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if there's already a window/tab open
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed');
});

// ============================================
// BACKGROUND SYNC
// ============================================

self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[SW] Syncing data...');
  // Implement your sync logic here
  // This runs when the browser comes back online
  
  try {
    // Example: Send queued requests
    const cache = await caches.open('sync-queue');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        await fetch(request);
        await cache.delete(request);
        console.log('[SW] Synced:', request.url);
      } catch (e) {
        console.log('[SW] Sync failed for:', request.url);
      }
    }
  } catch (e) {
    console.log('[SW] Sync error:', e);
  }
}

// ============================================
// PERIODIC BACKGROUND SYNC
// ============================================

self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync:', event.tag);
  
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  console.log('[SW] Updating content in background...');
  // Fetch and cache new content periodically
}

// ============================================
// MESSAGE HANDLING
// ============================================

self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'GET_CACHE_STATUS') {
    getCacheStatus().then(status => {
      event.ports[0].postMessage(status);
    });
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    status[name] = {
      count: keys.length,
      urls: keys.slice(0, 5).map(r => r.url)
    };
  }
  
  return status;
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('[SW] All caches cleared');
}

console.log('[SW] Service Worker loaded');


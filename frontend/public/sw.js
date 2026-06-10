const CACHE_VERSION = 'v4';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DATASHEET_CACHE = `datasheets-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGES_CACHE = `images-${CACHE_VERSION}`;

const ALL_CACHES = [STATIC_CACHE, DATASHEET_CACHE, API_CACHE, IMAGES_CACHE];

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !ALL_CACHES.includes(name))
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Helper: invalidate all cached /api/components entries after a mutation
function invalidateComponentsCache() {
  caches.open(API_CACHE).then((cache) => {
    cache.keys().then((keys) => {
      keys.forEach((key) => {
        if (new URL(key.url).pathname.startsWith('/api/components')) {
          cache.delete(key);
        }
      });
    });
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // PDF datasheets
  if (url.pathname.startsWith('/uploads/') && url.pathname.endsWith('.pdf')) {
    event.respondWith(
      caches.open(DATASHEET_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => new Response('PDF not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
          }));
        });
      })
    );
    return;
  }

  // Component images
  if (url.pathname.startsWith('/uploads/')) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => new Response('Image not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
          }));
        });
      })
    );
    return;
  }

  // Component API (GET)
  if (url.pathname.startsWith('/api/components') && request.method === 'GET') {
    event.respondWith(
      fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(API_CACHE).then((cache) => cache.put(request, clone));
          return response;
        }

        if (response.status >= 500) {
          return caches.open(API_CACHE).then((cache) => {
            return cache.match(request).then((cached) => {
              if (cached) return cached;
              return new Response(
                JSON.stringify({ error: 'Server unavailable — showing cached data', components: [], total: 0, page: 1, per_page: 10, total_pages: 0 }),
                { status: 503, headers: { 'Content-Type': 'application/json' } }
              );
            });
          });
        }

        return response;
      }).catch(() => {
        return caches.open(API_CACHE).then((cache) => {
          return cache.match(request).then((cached) => {
            if (cached) return cached;
            return new Response(
              JSON.stringify({ error: 'Offline — cached data unavailable', components: [], total: 0, page: 1, per_page: 10, total_pages: 0 }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
          });
        });
      })
    );
    return;
  }

  // Component API (Mutations)
  if (url.pathname.startsWith('/api/components') && request.method !== 'GET') {
    event.respondWith(
      fetch(request).then((response) => {
        if (response && response.ok) {
          invalidateComponentsCache();
        }
        return response;
      }).catch(() => new Response(
        JSON.stringify({ error: 'Network unavailable' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      ))
    );
    return;
  }

  // Other API calls
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) {
    event.respondWith(
      fetch(request).catch(() => new Response(
        JSON.stringify({ error: 'Network unavailable' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      ))
    );
    return;
  }

  // Static assets
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

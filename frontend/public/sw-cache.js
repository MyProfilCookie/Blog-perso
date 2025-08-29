// Service Worker pour cache intelligent - Ne modifie pas le site
const CACHE_NAME = 'autistudy-cache-v1';
const STATIC_CACHE = 'autistudy-static-v1';
const DYNAMIC_CACHE = 'autistudy-dynamic-v1';

// Ressources critiques à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/assets/home/home.webp',
  '/assets/family/chantal.webp',
  '/assets/logo/logo.webp',
  '/_next/static/css/',
  '/_next/static/chunks/'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache : Cache First pour les assets statiques
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache First pour les images et assets statiques
  if (request.destination === 'image' || 
      url.pathname.includes('/_next/static/') ||
      url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Network First pour les pages
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((response) => {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      }).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  // Stale While Revalidate pour les autres ressources
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, networkResponse.clone());
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});

// Optimisation : Préchargement des ressources critiques
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'PRELOAD_CRITICAL') {
    const criticalResources = [
      '/assets/home/home.webp',
      '/assets/family/chantal.webp'
    ];
    
    event.waitUntil(
      caches.open(STATIC_CACHE).then((cache) => {
        return Promise.all(
          criticalResources.map((resource) => {
            return cache.add(resource).catch(() => {
              // Ignore les erreurs de préchargement
            });
          })
        );
      })
    );
  }
});

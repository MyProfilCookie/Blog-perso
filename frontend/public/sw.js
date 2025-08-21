const CACHE_NAME = 'autistudy-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/_next/static/css/app.css',
  '/_next/static/chunks/framework.js',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js',
];

const API_CACHE_URLS = [
  '/api/subjects/',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache first pour les ressources statiques
  if (STATIC_CACHE_URLS.some(path => url.pathname.includes(path))) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request);
        })
    );
    return;
  }

  // Network first avec fallback cache pour les API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cloner la réponse car elle ne peut être lue qu'une fois
          const responseClone = response.clone();
          
          // Mettre en cache seulement les réponses réussies
          if (response.status === 200) {
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          
          return response;
        })
        .catch(() => {
          // En cas d'échec réseau, essayer le cache
          return caches.match(request);
        })
    );
    return;
  }

  // Stale while revalidate pour les autres ressources
  event.respondWith(
    caches.match(request)
      .then((response) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, networkResponse.clone());
              });
            return networkResponse;
          });

        return response || fetchPromise;
      })
  );
});
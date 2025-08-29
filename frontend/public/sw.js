
// Service Worker pour optimisations mobile
const CACHE_NAME = 'autistudy-mobile-v1';
const urlsToCache = [
  '/',
  '/assets/home/home.webp',
  '/assets/family/chantal.webp',
  '/styles/globals.css',
  '/styles/performance.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la version en cache si disponible
        if (response) {
          return response;
        }
        
        // Sinon, faire la requête réseau
        return fetch(event.request);
      })
  );
});

// Optimisations pour mobile
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

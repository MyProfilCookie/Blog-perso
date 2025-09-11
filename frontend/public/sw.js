
// Service Worker pour optimisations mobile
const CACHE_NAME = 'autistudy-mobile-v2';
const urlsToCache = [
  '/',
  '/_next/static/css/',
  '/_next/static/js/',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Ajouter les ressources une par une avec gestion d'erreur
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Impossible de mettre en cache ${url}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        // Forcer l'activation du nouveau service worker
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la version en cache si disponible
        if (response) {
          return response;
        }
        
        // Sinon, faire la requête réseau avec gestion d'erreur
        return fetch(event.request).catch(err => {
          console.warn('Erreur réseau:', err);
          // Retourner une réponse par défaut en cas d'erreur
          return new Response('Service temporairement indisponible', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer les anciens caches
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prendre le contrôle de toutes les pages
      return self.clients.claim();
    })
  );
});

// Optimisations pour mobile
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

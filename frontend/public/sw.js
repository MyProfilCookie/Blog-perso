
// Service Worker pour optimisations mobile et performances
const CACHE_NAME = 'autistudy-mobile-v3';
const STATIC_CACHE = 'autistudy-static-v3';
const DYNAMIC_CACHE = 'autistudy-dynamic-v3';

const urlsToCache = [
  '/',
  '/_next/static/css/',
  '/_next/static/js/',
  '/favicon.ico',
  '/manifest.json'
];

// Stratégies de cache par type de ressource
const CACHE_STRATEGIES = {
  images: /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i,
  fonts: /\.(woff|woff2|ttf|eot)$/i,
  api: /\/api\//,
  static: /\/_next\/static\//,
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
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

  const url = new URL(event.request.url);

  // Stratégie pour les images - Cache First
  if (CACHE_STRATEGIES.images.test(url.pathname)) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache => 
        cache.match(event.request).then(response => {
          if (response) return response;
          
          return fetch(event.request).then(networkResponse => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => response || new Response('Image non disponible'));
        })
      )
    );
    return;
  }

  // Stratégie pour les polices - Cache First
  if (CACHE_STRATEGIES.fonts.test(url.pathname)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache => 
        cache.match(event.request).then(response => {
          return response || fetch(event.request).then(networkResponse => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
      )
    );
    return;
  }

  // Stratégie pour les API - Network First
  if (CACHE_STRATEGIES.api.test(url.pathname)) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response.ok) {
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      }).catch(() => {
        return caches.match(event.request).then(response => {
          return response || new Response('API non disponible', { status: 503 });
        });
      })
    );
    return;
  }

  // Stratégie par défaut
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

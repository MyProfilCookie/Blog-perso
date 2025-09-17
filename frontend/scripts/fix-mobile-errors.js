#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Correction des erreurs mobiles...\n');

// Fonction pour nettoyer les fichiers de build
function cleanBuildFiles() {
  const buildDirs = ['.next', 'out', 'node_modules/.cache'];
  
  buildDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      console.log(`🗑️  Suppression de ${dir}...`);
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  });
}

// Fonction pour optimiser next.config.js pour mobile
function optimizeNextConfig() {
  const configPath = path.join(process.cwd(), 'next.config.js');
  
  if (fs.existsSync(configPath)) {
    let config = fs.readFileSync(configPath, 'utf8');
    
    // Ajouter des optimisations mobiles si pas déjà présentes
    if (!config.includes('mobileOptimizations')) {
      const mobileOptimizations = `
    // Optimisations mobiles
    experimental: {
      optimizeCss: true,
      optimizePackageImports: ['@nextui-org/react', 'framer-motion', 'lucide-react'],
    },
    
    // Optimisations pour les performances mobiles
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    
    // Headers pour le cache mobile
    async headers() {
      return [
        {
          source: '/_next/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/assets/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },`;
      
      config = config.replace(
        /module\.exports = \{/,
        `module.exports = {${mobileOptimizations}`
      );
      
      fs.writeFileSync(configPath, config);
      console.log('✅ Configuration Next.js optimisée pour mobile');
    }
  }
}

// Fonction pour créer un service worker optimisé
function createOptimizedServiceWorker() {
  const swContent = `
// Service Worker optimisé pour mobile
const CACHE_NAME = 'autistudy-mobile-v1';
const STATIC_CACHE = 'autistudy-static-v1';

// Ressources critiques à mettre en cache
const CRITICAL_RESOURCES = [
  '/',
  '/_next/static/css/app.css',
  '/_next/static/chunks/framework.js',
  '/_next/static/chunks/main.js',
  '/assets/home/home.webp',
  '/assets/family/chantal.webp'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Gestion des requêtes
self.addEventListener('fetch', (event) => {
  // Stratégie Cache First pour les ressources statiques
  if (event.request.url.includes('/_next/static/') || 
      event.request.url.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
  
  // Stratégie Network First pour les API
  else if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
  
  // Stratégie Stale While Revalidate pour les pages
  else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseClone);
                  });
              }
              return networkResponse;
            });
          
          return response || fetchPromise;
        })
    );
  }
});

// Gestion des erreurs de chunks
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHUNK_ERROR') {
    // Nettoyer le cache en cas d'erreur de chunk
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Notifier le client de recharger
      event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
    });
  }
});
`;

  const swPath = path.join(process.cwd(), 'public', 'sw-mobile.js');
  fs.writeFileSync(swPath, swContent);
  console.log('✅ Service Worker mobile créé');
}

// Fonction pour optimiser les CSS pour mobile
function optimizeMobileCSS() {
  const cssPath = path.join(process.cwd(), 'styles', 'mobile-optimizations.css');
  
  const mobileCSS = `
/* Optimisations mobiles critiques */
@media (max-width: 768px) {
  /* Réduire les animations sur mobile */
  * {
    animation-duration: 0.2s !important;
    transition-duration: 0.2s !important;
  }
  
  /* Optimiser les images */
  img {
    max-width: 100%;
    height: auto;
    loading: lazy;
  }
  
  /* Réduire les ombres pour les performances */
  .shadow-lg {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  }
  
  /* Optimiser les grilles */
  .grid {
    gap: 0.5rem;
  }
  
  /* Réduire les espacements */
  .space-y-4 > * + * {
    margin-top: 0.5rem !important;
  }
  
  .space-y-6 > * + * {
    margin-top: 1rem !important;
  }
  
  /* Optimiser les boutons */
  button {
    min-height: 44px; /* Taille tactile recommandée iOS */
    min-width: 44px;
  }
  
  /* Optimiser les inputs */
  input, textarea, select {
    min-height: 44px;
    font-size: 16px; /* Éviter le zoom automatique sur iOS */
  }
}

/* Optimisations pour les appareils avec encoche */
@supports (padding: max(0px)) {
  .safe-area-inset {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
    padding-top: max(1rem, env(safe-area-inset-top));
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}

/* Optimisations pour les performances */
.performance-optimized {
  contain: layout style paint;
  will-change: transform;
}

.image-optimized {
  aspect-ratio: 16/9;
  object-fit: cover;
}

/* Prévenir les erreurs de layout shift */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Mode sombre optimisé */
@media (prefers-color-scheme: dark) {
  .skeleton {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    background-size: 200% 100%;
  }
}
`;

  fs.writeFileSync(cssPath, mobileCSS);
  console.log('✅ CSS mobile optimisé');
}

// Fonction principale
function main() {
  try {
    console.log('🚀 Début des corrections mobiles...\n');
    
    cleanBuildFiles();
    optimizeNextConfig();
    createOptimizedServiceWorker();
    optimizeMobileCSS();
    
    console.log('\n🎉 Corrections mobiles terminées !');
    console.log('\n📱 Optimisations appliquées :');
    console.log('  • Service Worker mobile créé');
    console.log('  • CSS optimisé pour mobile');
    console.log('  • Configuration Next.js optimisée');
    console.log('  • Cache nettoyé');
    console.log('\n🔄 Prochaines étapes :');
    console.log('  1. npm run build');
    console.log('  2. vercel --prod');
    console.log('  3. Tester sur iPhone');
    
  } catch (error) {
    console.error('❌ Erreur lors des corrections mobiles:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { main };

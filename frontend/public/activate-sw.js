// Script d'activation du Service Worker - Ne modifie pas le site
(function() {
  'use strict';
  
  // Vérifier si le Service Worker est supporté
  if ('serviceWorker' in navigator) {
    // Attendre que la page soit chargée
    window.addEventListener('load', function() {
      // Enregistrer le Service Worker
      navigator.serviceWorker.register('/sw-cache.js')
        .then(function(registration) {
          console.log('Service Worker enregistré avec succès:', registration.scope);
          
          // Précharger les ressources critiques
          if (registration.active) {
            registration.active.postMessage({
              type: 'PRELOAD_CRITICAL'
            });
          }
          
          // Mettre à jour automatiquement
          registration.addEventListener('updatefound', function() {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nouvelle version disponible
                newWorker.postMessage({
                  type: 'SKIP_WAITING'
                });
              }
            });
          });
        })
        .catch(function(error) {
          console.log('Échec de l\'enregistrement du Service Worker:', error);
        });
    });
  }
  
  // Préchargement des ressources critiques
  function preloadCriticalResources() {
    const criticalResources = [
      '/assets/home/home.webp',
      '/assets/family/chantal.webp',
      '/assets/logo/logo.webp'
    ];
    
    criticalResources.forEach(function(resource) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resource;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
  
  // Précharger les polices critiques
  function preloadFonts() {
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];
    
    fonts.forEach(function(font) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = font;
      document.head.appendChild(link);
    });
  }
  
  // Optimisations de performance
  function optimizePerformance() {
    // Réduire les animations sur mobile
    if (window.innerWidth <= 768) {
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
    }
    
    // Optimiser les images
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
      if (!img.loading) {
        img.loading = 'lazy';
      }
    });
  }
  
  // Exécuter les optimisations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      preloadCriticalResources();
      preloadFonts();
      optimizePerformance();
    });
  } else {
    preloadCriticalResources();
    preloadFonts();
    optimizePerformance();
  }
})();

// Script d'activation du Service Worker - Ne modifie pas le site
(function() {
  'use strict';
  
  // Vérifier si le Service Worker est supporté
  if ('serviceWorker' in navigator) {
    // Attendre que la page soit chargée
    window.addEventListener('load', function() {
      // Enregistrer le Service Worker
      navigator.serviceWorker.register('/sw.js')
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
  
  // Préchargement des ressources critiques (seulement les ressources essentielles)
  function preloadCriticalResources() {
    // Précharger seulement le favicon qui est utilisé sur toutes les pages
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/favicon.ico';
    document.head.appendChild(link);
  }
  
  // Précharger les polices critiques (désactivé pour éviter les erreurs de performance)
  function preloadFonts() {
    // Les polices sont déjà chargées dans _document.tsx
    // Pas besoin de les précharger à nouveau ici
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

"use client";

import { useEffect } from 'react';

export default function LCPOptimizer() {
  useEffect(() => {
    // Optimisation LCP agressive - Préchargement des ressources critiques
    const preloadCriticalResources = () => {
      // Précharger les images critiques avec priorité maximale
      const criticalImages = [
        { src: '/assets/home/home.webp', priority: 'high' },
        { src: '/assets/family/chantal.webp', priority: 'high' },
        { src: '/assets/family/family.webp', priority: 'auto' },
        { src: '/assets/home/hero-bg.webp', priority: 'auto' }
      ];

      criticalImages.forEach(({ src, priority }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.type = 'image/webp';
        if (priority === 'high') {
          link.setAttribute('fetchpriority', 'high');
        }
        document.head.appendChild(link);
      });

      // Précharger les scripts critiques avec modulepreload
      const criticalScripts = [
        '/_next/static/chunks/framework.js',
        '/_next/static/chunks/main.js',
        '/_next/static/chunks/webpack.js'
      ];

      criticalScripts.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'modulepreload';
        link.href = src;
        document.head.appendChild(link);
      });

      // Précharger les CSS critiques
      const criticalCSS = [
        '/_next/static/css/app.css',
        '/_next/static/css/globals.css'
      ];

      criticalCSS.forEach((href) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
      });
    };

    // Optimisation agressive des images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        const rect = img.getBoundingClientRect();
        const isAboveFold = rect.top < window.innerHeight;
        
        if (isAboveFold) {
          // Images above-the-fold : priorité maximale
          img.setAttribute('loading', 'eager');
          img.setAttribute('fetchpriority', 'high');
          img.setAttribute('decoding', 'sync');
        } else {
          // Images below-the-fold : lazy loading
          img.setAttribute('loading', 'lazy');
          img.setAttribute('fetchpriority', 'low');
        }
        
        // Optimiser les dimensions pour éviter le CLS
        if (!img.width || !img.height) {
          img.style.aspectRatio = '16/9';
          img.style.width = '100%';
          img.style.height = 'auto';
        }

        // Ajouter des attributs d'optimisation
        img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
      });
    };

    // Optimisation des polices
    const optimizeFonts = () => {
      // Les polices sont déjà gérées par Next.js Font, pas besoin de les charger manuellement
      console.log('Polices optimisées via Next.js Font');
    };

    // Optimisation des ressources non critiques
    const optimizeNonCritical = () => {
      // Lazy load les images non critiques
      const lazyImages = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });

      lazyImages.forEach((img) => imageObserver.observe(img));

      // Optimiser les scripts non critiques
      const scripts = document.querySelectorAll('script[data-defer]');
      scripts.forEach((script) => {
        script.setAttribute('defer', '');
      });
    };

    // Exécuter les optimisations critiques immédiatement
    preloadCriticalResources();
    optimizeImages();
    optimizeFonts();

    // Optimisation différée pour les ressources non critiques
    requestIdleCallback(() => {
      optimizeNonCritical();
    });

    // Optimisation continue pendant le chargement
    const optimizeDuringLoad = () => {
      // Vérifier si les images critiques sont chargées
      const criticalImages = document.querySelectorAll('img[fetchpriority="high"]');
      let loadedCount = 0;
      
      criticalImages.forEach((img) => {
        if (img instanceof HTMLImageElement && img.complete) {
          loadedCount++;
        }
      });

      // Si toutes les images critiques sont chargées, optimiser le reste
      if (loadedCount === criticalImages.length) {
        optimizeNonCritical();
      }
    };

    // Vérifier périodiquement le chargement
    const checkInterval = setInterval(optimizeDuringLoad, 100);
    
    // Nettoyer après 5 secondes
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 5000);

  }, []);

  return null;
}

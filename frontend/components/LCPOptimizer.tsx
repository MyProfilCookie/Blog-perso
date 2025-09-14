"use client";

import { useEffect } from 'react';

export default function LCPOptimizer() {
  useEffect(() => {
    // Optimisation LCP - Préchargement des ressources critiques
    const preloadCriticalResources = () => {
      // Précharger les images critiques de la page d'accueil
      const criticalImages = [
        '/assets/home/home.webp',
        '/assets/family/chantal.webp',
        '/assets/family/family.webp',
        '/assets/home/hero-bg.webp'
      ];

      criticalImages.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.type = 'image/webp';
        document.head.appendChild(link);
      });

      // Précharger les polices critiques
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.as = 'style';
      document.head.appendChild(fontLink);

      // Précharger les scripts critiques
      const scriptLink = document.createElement('link');
      scriptLink.rel = 'modulepreload';
      scriptLink.href = '/_next/static/chunks/framework.js';
      document.head.appendChild(scriptLink);
    };

    // Optimisation des images existantes
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        // Ajouter loading="eager" aux images above-the-fold
        if (img.getBoundingClientRect().top < window.innerHeight) {
          img.setAttribute('loading', 'eager');
          img.setAttribute('fetchpriority', 'high');
        }
        
        // Optimiser les images avec des dimensions fixes
        if (!img.width || !img.height) {
          img.style.aspectRatio = '16/9';
        }
      });
    };

    // Optimisation des ressources CSS critiques
    const optimizeCSS = () => {
      // Inline les styles critiques
      const criticalCSS = `
        body { 
          font-family: Inter, system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f8faff;
        }
        .dark body { background-color: #111827; }
        .min-h-screen { min-height: 100vh; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .w-full { width: 100%; }
        .h-full { height: 100%; }
      `;
      
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      document.head.insertBefore(style, document.head.firstChild);
    };

    // Exécuter les optimisations
    preloadCriticalResources();
    optimizeImages();
    optimizeCSS();

    // Optimisation différée pour les ressources non critiques
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
      });

      lazyImages.forEach((img) => imageObserver.observe(img));
    };

    // Exécuter l'optimisation non critique après le chargement initial
    setTimeout(optimizeNonCritical, 100);

  }, []);

  return null;
}

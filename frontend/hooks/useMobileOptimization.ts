import { useState, useEffect, useCallback } from 'react';

interface MobileOptimizationConfig {
  enableReducedMotion?: boolean;
  enableLowQualityImages?: boolean;
  enableLazyLoading?: boolean;
  enablePreloadCritical?: boolean;
}

export function useMobileOptimization(config: MobileOptimizationConfig = {}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Détection de connexion lente
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const isSlow = connection.effectiveType === 'slow-2g' || 
                     connection.effectiveType === '2g' || 
                     connection.effectiveType === '3g';
      setIsSlowConnection(isSlow);
    }
  }, []);

  // Détection des préférences de mouvement réduit
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Optimisations pour images
  const getImageQuality = useCallback(() => {
    if (isMobile && config.enableLowQualityImages) return 60;
    if (isSlowConnection) return 50;
    return 75;
  }, [isMobile, isSlowConnection, config.enableLowQualityImages]);

  // Optimisations pour animations
  const shouldReduceMotion = useCallback(() => {
    return isReducedMotion || (isMobile && config.enableReducedMotion);
  }, [isReducedMotion, isMobile, config.enableReducedMotion]);

  // Optimisations pour lazy loading
  const shouldLazyLoad = useCallback(() => {
    return config.enableLazyLoading !== false;
  }, [config.enableLazyLoading]);

  // Préchargement des ressources critiques
  const preloadCriticalResources = useCallback(() => {
    if (!config.enablePreloadCritical || isSlowConnection) return;

    const criticalResources = [
      '/assets/home/home.webp',
      '/assets/family/chantal.webp'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resource;
      document.head.appendChild(link);
    });
  }, [config.enablePreloadCritical, isSlowConnection]);

  // Optimisations de performance
  const optimizePerformance = useCallback(() => {
    if (isMobile) {
      // Réduire les animations sur mobile
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
      
      // Optimiser les polices
      if ('fonts' in document) {
        (document as any).fonts.ready.then(() => {
          // Polices chargées, optimiser le rendu
        });
      }
    }
  }, [isMobile]);

  return {
    isMobile,
    isSlowConnection,
    isReducedMotion,
    getImageQuality,
    shouldReduceMotion,
    shouldLazyLoad,
    preloadCriticalResources,
    optimizePerformance
  };
}

import dynamic from 'next/dynamic';
import React from 'react';

// Utilitaires pour les imports dynamiques optimisés
export const createLazyComponent = (
  importFn: () => Promise<{ default: any }>,
  fallback?: () => JSX.Element,
  options?: {
    ssr?: boolean;
    loading?: () => JSX.Element;
  }
) => {
  return dynamic(importFn, {
    ssr: options?.ssr ?? false,
    loading: options?.loading || fallback || (() => <div className="animate-pulse bg-gray-200 rounded" />),
  });
};

// Imports dynamiques pour les bibliothèques lourdes
export const LazyChart = createLazyComponent(
  () => import('../components/Charts'),
  () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded" />
);

export const LazyMotionDiv = createLazyComponent(
  () => import('framer-motion').then(mod => ({ default: mod.motion.div })),
  () => <div className="opacity-0" />
);

export const LazyAnimatePresence = createLazyComponent(
  () => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })),
  () => <div />
);

// Hook pour détecter si on est sur mobile (pour désactiver les animations)
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};
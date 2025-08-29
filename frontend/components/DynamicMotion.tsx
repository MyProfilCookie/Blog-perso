"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import de Framer Motion avec fallback
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.div })),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
  }
);

const MotionSection = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.section })),
  {
    ssr: false,
    loading: () => <section className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
  }
);

const AnimatePresence = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })),
  {
    ssr: false,
    loading: () => <div />
  }
);

// Variantes d'animation optimisées (sans Framer Motion)
const cssAnimations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideLeft: 'animate-slide-left',
  scale: 'animate-scale',
  bounce: 'animate-bounce'
};

// Composant léger sans Framer Motion pour les cas simples
interface LightAnimationProps {
  children: React.ReactNode;
  animation?: keyof typeof cssAnimations;
  delay?: number;
  className?: string;
}

export const LightAnimation: React.FC<LightAnimationProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  className = ""
}) => {
  return (
    <div 
      className={`${cssAnimations[animation]} ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        willChange: 'transform, opacity',
        transform: 'translateZ(0)'
      }}
    >
      {children}
    </div>
  );
};

// Composant Motion avec fallback CSS
interface DynamicMotionProps {
  children: React.ReactNode;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  className?: string;
  useFallback?: boolean; // Force l'utilisation du fallback CSS
}

export const DynamicMotion: React.FC<DynamicMotionProps> = ({
  children,
  initial,
  animate,
  exit,
  transition,
  className = "",
  useFallback = false
}) => {
  // Si useFallback est true, utiliser l'animation CSS légère
  if (useFallback) {
    return (
      <LightAnimation animation="fadeIn" className={className}>
        {children}
      </LightAnimation>
    );
  }

  return (
    <Suspense fallback={
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}>
        {children}
      </div>
    }>
      <MotionDiv
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        className={className}
      >
        {children}
      </MotionDiv>
    </Suspense>
  );
};

// Hook pour détecter si les animations sont nécessaires
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Composant intelligent qui choisit entre Framer Motion et CSS
export const SmartMotion: React.FC<DynamicMotionProps> = (props) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Utiliser le fallback CSS si l'utilisateur préfère les animations réduites
  return <DynamicMotion {...props} useFallback={prefersReducedMotion} />;
};

export { MotionDiv, MotionSection, AnimatePresence };
export default DynamicMotion;
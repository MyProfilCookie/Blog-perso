"use client";
import React, { useState, useEffect } from 'react';

interface OptimizedMotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'scale-in';
  threshold?: number;
}

export const OptimizedMotion: React.FC<OptimizedMotionProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 300,
  animation = 'fade-in',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        }
      },
      { threshold }
    );

    const element = document.querySelector(`[data-motion-id="${Math.random().toString(36)}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [delay, threshold, hasAnimated]);

  const getAnimationClass = () => {
    if (!isVisible) return '';
    
    const baseClass = 'animation-optimized';
    const animationClasses = {
      'fade-in': 'animate-fade-in',
      'slide-up': 'animate-slide-up',
      'slide-left': 'animate-slide-left',
      'scale-in': 'animate-scale'
    };
    
    return `${baseClass} ${animationClasses[animation]}`;
  };

  return (
    <div
      data-motion-id={Math.random().toString(36)}
      className={`${className} ${getAnimationClass()}`}
      style={{
        transitionDuration: `${duration}ms`,
        contain: 'layout style paint'
      }}
    >
      {children}
    </div>
  );
};

// Composant optimisé pour les transitions de page
export const OptimizedPageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div 
      className={`page-transition-optimized ${className}`}
      style={{
        contain: 'layout style paint',
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};

// Hook pour optimiser les animations
export const useOptimizedAnimation = (delay: number = 0) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isReady;
};

export default OptimizedMotion;
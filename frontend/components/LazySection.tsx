"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Spinner } from '@nextui-org/react';

interface LazySectionProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  placeholder?: React.ReactNode;
  minHeight?: string;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  threshold = 0.1,
  className = "",
  placeholder,
  minHeight = "200px"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Délai pour éviter le chargement simultané de tous les éléments
          setTimeout(() => setIsLoaded(true), 100);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: '50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const defaultPlaceholder = (
    <div 
      className="flex items-center justify-center p-8 skeleton-optimized"
      style={{ minHeight }}
    >
      <Spinner color="primary" size="sm" className="spinner-optimized" />
    </div>
  );

  return (
    <div 
      ref={sectionRef}
      className={`lazy-section-optimized ${className}`}
      style={{ minHeight: isVisible ? 'auto' : minHeight }}
    >
      {!isVisible && placeholder ? placeholder : !isVisible && defaultPlaceholder}
      {isVisible && isLoaded && children}
    </div>
  );
};

export default LazySection;

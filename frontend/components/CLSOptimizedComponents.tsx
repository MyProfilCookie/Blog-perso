"use client";

import React from 'react';
import { Card, CardBody } from '@nextui-org/react';

// Composant Card optimisé pour éviter le CLS
interface CLSOptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  aspectRatio?: string;
}

export const CLSOptimizedCard: React.FC<CLSOptimizedCardProps> = ({
  children,
  className = "",
  minHeight = "200px",
  aspectRatio
}) => {
  const style: React.CSSProperties = {
    minHeight,
    contain: 'layout style paint',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    ...(aspectRatio && { aspectRatio })
  };

  return (
    <Card 
      className={`performance-optimized card-optimized ${className}`}
      style={style}
    >
      <CardBody className="p-4 sm:p-6">
        {children}
      </CardBody>
    </Card>
  );
};

// Composant Image avec dimensions fixes pour éviter le CLS
interface CLSOptimizedImageContainerProps {
  children: React.ReactNode;
  width: number;
  height: number;
  className?: string;
}

export const CLSOptimizedImageContainer: React.FC<CLSOptimizedImageContainerProps> = ({
  children,
  width,
  height,
  className = ""
}) => {
  return (
    <div 
      className={`relative overflow-hidden image-optimized ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        aspectRatio: `${width}/${height}`,
        contain: 'layout style paint'
      }}
    >
      {children}
    </div>
  );
};

// Composant Grid optimisé pour éviter le CLS
interface CLSOptimizedGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: string;
  className?: string;
}

export const CLSOptimizedGrid: React.FC<CLSOptimizedGridProps> = ({
  children,
  columns = 3,
  gap = "1rem",
  className = ""
}) => {
  return (
    <div 
      className={`grid-optimized ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(250px, 1fr))`,
        gap,
        contain: 'layout style'
      }}
    >
      {children}
    </div>
  );
};

// Composant Skeleton pour les états de chargement
interface CLSSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const CLSSkeleton: React.FC<CLSSkeletonProps> = ({
  width = "100%",
  height = "20px",
  className = "",
  variant = 'rectangular'
}) => {
  const baseClasses = "skeleton-optimized animate-pulse bg-gray-200 dark:bg-gray-700";
  
  const variantClasses = {
    text: "rounded",
    rectangular: "rounded-md",
    circular: "rounded-full"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        width,
        height,
        contain: 'layout style'
      }}
    />
  );
};

// Composant Button optimisé pour éviter le CLS
interface CLSOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const CLSOptimizedButton: React.FC<CLSOptimizedButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = 'primary',
  size = 'md'
}) => {
  const baseClasses = "button-optimized transition-optimized";
  
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      style={{
        contain: 'layout style',
        transform: 'translateZ(0)',
        minHeight: size === 'sm' ? '32px' : size === 'md' ? '40px' : '48px'
      }}
    >
      {children}
    </button>
  );
};

// Composant Layout avec dimensions fixes
interface CLSOptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const CLSOptimizedLayout: React.FC<CLSOptimizedLayoutProps> = ({
  children,
  className = ""
}) => {
  return (
    <div 
      className={`min-h-screen performance-optimized ${className}`}
      style={{
        contain: 'layout style paint',
        minHeight: '100vh'
      }}
    >
      {children}
    </div>
  );
};

// Hook pour mesurer et optimiser le CLS
export const useCLSOptimization = () => {
  React.useEffect(() => {
    // Observer pour mesurer le CLS
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            console.log('CLS detected:', entry.value);
            
            // Si le CLS est élevé, appliquer des optimisations
            if (entry.value > 0.1) {
              // Ajouter des classes d'optimisation aux éléments problématiques
              document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
                img.classList.add('image-optimized');
              });
              
              document.querySelectorAll('.card:not(.performance-optimized)').forEach(card => {
                card.classList.add('performance-optimized');
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });

      return () => observer.disconnect();
    }
  }, []);
};

export default {
  CLSOptimizedCard,
  CLSOptimizedImageContainer,
  CLSOptimizedGrid,
  CLSSkeleton,
  CLSOptimizedButton,
  CLSOptimizedLayout,
  useCLSOptimization
};
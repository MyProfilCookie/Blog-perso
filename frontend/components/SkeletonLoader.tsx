'use client';

import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'card' | 'image' | 'button' | 'list' | 'chart' | 'table';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
  aspectRatio?: '1:1' | '4:3' | '3:2' | '16:9' | '21:9';
}

export default function SkeletonLoader({
  type = 'text',
  width = '100%',
  height,
  count = 1,
  className = '',
  aspectRatio = '16:9'
}: SkeletonLoaderProps) {
  const getSkeletonContent = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`skeleton skeleton-text ${className}`} style={{ width, height }} />
        );

      case 'card':
        return (
          <div className={`skeleton-card ${className}`} style={{ width, height }}>
            <div className="skeleton skeleton-text title mb-3" />
            <div className="skeleton skeleton-text paragraph mb-2" />
            <div className="skeleton skeleton-text paragraph mb-2" />
            <div className="skeleton skeleton-text paragraph" style={{ width: '60%' }} />
            <div className="mt-4">
              <div className="skeleton button-skeleton" />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className={`image-container ratio-${aspectRatio.replace(':', '-')} ${className}`} style={{ width, height }}>
            <div className="skeleton absolute inset-0" />
          </div>
        );

      case 'button':
        return (
          <div className={`skeleton button-skeleton ${className}`} style={{ width, height }} />
        );

      case 'list':
        return (
          <div className={`list-item-skeleton ${className}`}>
            <div className="skeleton avatar" />
            <div className="content">
              <div className="skeleton skeleton-text title mb-2" style={{ width: '70%' }} />
              <div className="skeleton skeleton-text paragraph" style={{ width: '90%' }} />
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className={`chart-skeleton ${className}`} style={{ width, height }}>
            <div className="text-gray-400 text-sm">Chargement du graphique...</div>
          </div>
        );

      case 'table':
        return (
          <div className={`${className}`} style={{ width, height }}>
            <table className="table-skeleton w-full">
              <thead>
                <tr>
                  {[...Array(4)].map((_, i) => (
                    <th key={i}>
                      <div className="skeleton cell-skeleton" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(4)].map((_, colIndex) => (
                      <td key={colIndex}>
                        <div className="skeleton cell-skeleton" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <div className={`skeleton ${className}`} style={{ width, height }} />
        );
    }
  };

  if (count === 1) {
    return getSkeletonContent();
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {getSkeletonContent()}
        </div>
      ))}
    </div>
  );
}

// Composants spécialisés pour des cas d'usage courants
export const TextSkeleton = ({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <SkeletonLoader
        key={i}
        type="text"
        width={i === lines - 1 ? '60%' : '100%'}
        className="h-4"
      />
    ))}
  </div>
);

export const CardSkeleton = ({ className = '' }: { className?: string }) => (
  <SkeletonLoader type="card" className={className} />
);

export const ImageSkeleton = ({ 
  aspectRatio = '16:9', 
  className = '' 
}: { 
  aspectRatio?: '1:1' | '4:3' | '3:2' | '16:9' | '21:9'; 
  className?: string;
}) => (
  <SkeletonLoader type="image" aspectRatio={aspectRatio} className={className} />
);

export const ListSkeleton = ({ 
  items = 5, 
  className = '' 
}: { 
  items?: number; 
  className?: string;
}) => (
  <div className={`space-y-0 ${className}`}>
    {[...Array(items)].map((_, i) => (
      <SkeletonLoader key={i} type="list" />
    ))}
  </div>
);

export const ChartSkeleton = ({ className = '' }: { className?: string }) => (
  <SkeletonLoader type="chart" height="300px" className={className} />
);

export const TableSkeleton = ({ className = '' }: { className?: string }) => (
  <SkeletonLoader type="table" className={className} />
);

// Hook pour gérer l'état de chargement avec skeleton
export const useSkeletonLoader = (isLoading: boolean, delay: number = 0) => {
  const [showSkeleton, setShowSkeleton] = React.useState(isLoading);

  React.useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true);
    } else {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isLoading, delay]);

  return showSkeleton;
};
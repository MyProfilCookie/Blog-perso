"use client";

import React from 'react';

// Skeleton pour les cartes
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`card-cls-optimized loading-state-cls-optimized ${className}`}>
    <div className="p-6 space-y-4">
      <div className="skeleton-optimized h-6 w-3/4 rounded"></div>
      <div className="skeleton-optimized h-4 w-full rounded"></div>
      <div className="skeleton-optimized h-4 w-2/3 rounded"></div>
      <div className="skeleton-optimized h-10 w-24 rounded"></div>
    </div>
  </div>
);

// Skeleton pour les images
export const ImageSkeleton: React.FC<{ 
  width?: number; 
  height?: number; 
  aspectRatio?: string;
  className?: string;
}> = ({ 
  width = 400, 
  height = 300, 
  aspectRatio,
  className = "" 
}) => (
  <div 
    className={`cls-image-container skeleton-optimized ${className}`}
    style={{
      width: `${width}px`,
      height: `${height}px`,
      ...(aspectRatio && { aspectRatio })
    }}
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <svg 
        className="w-12 h-12 text-gray-400" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
          clipRule="evenodd" 
        />
      </svg>
    </div>
  </div>
);

// Skeleton pour les graphiques
export const ChartSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`chart-container dynamic-content-container loading-state-cls-optimized ${className}`}>
    <div className="p-6 space-y-4">
      <div className="skeleton-optimized h-6 w-1/3 rounded"></div>
      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="skeleton-optimized w-16 h-16 rounded-full mx-auto mb-4"></div>
          <div className="skeleton-optimized h-4 w-32 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton pour les listes
export const ListSkeleton: React.FC<{ 
  items?: number; 
  className?: string;
}> = ({ 
  items = 5, 
  className = "" 
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="card-cls-optimized loading-state-cls-optimized p-4">
        <div className="flex items-center space-x-4">
          <div className="skeleton-optimized w-12 h-12 rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="skeleton-optimized h-4 w-3/4 rounded"></div>
            <div className="skeleton-optimized h-3 w-1/2 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton pour les tableaux
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number;
  className?: string;
}> = ({ 
  rows = 5, 
  columns = 4,
  className = "" 
}) => (
  <div className={`table-cls-optimized ${className}`}>
    <table className="w-full">
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index} className="p-3">
              <div className="skeleton-optimized h-4 w-full rounded"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="p-3">
                <div className="skeleton-optimized h-4 w-full rounded"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Skeleton pour les grilles
export const GridSkeleton: React.FC<{ 
  items?: number; 
  columns?: number;
  className?: string;
}> = ({ 
  items = 6, 
  columns = 3,
  className = "" 
}) => (
  <div 
    className={`grid-cls-optimized ${className}`}
    style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
  >
    {Array.from({ length: items }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton pour les profils utilisateur
export const ProfileSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`card-cls-optimized loading-state-cls-optimized p-6 ${className}`}>
    <div className="flex items-center space-x-6">
      <div className="skeleton-optimized w-24 h-24 rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-4">
        <div className="skeleton-optimized h-6 w-1/2 rounded"></div>
        <div className="skeleton-optimized h-4 w-3/4 rounded"></div>
        <div className="skeleton-optimized h-4 w-1/3 rounded"></div>
        <div className="flex space-x-2">
          <div className="skeleton-optimized h-8 w-20 rounded"></div>
          <div className="skeleton-optimized h-8 w-20 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton pour les statistiques
export const StatsSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`grid-cls-optimized ${className}`} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="card-cls-optimized loading-state-cls-optimized p-6 text-center">
        <div className="skeleton-optimized w-12 h-12 rounded-full mx-auto mb-4"></div>
        <div className="skeleton-optimized h-8 w-16 rounded mx-auto mb-2"></div>
        <div className="skeleton-optimized h-4 w-20 rounded mx-auto"></div>
      </div>
    ))}
  </div>
);

// Skeleton pour les formulaires
export const FormSkeleton: React.FC<{ fields?: number; className?: string }> = ({ 
  fields = 4, 
  className = "" 
}) => (
  <div className={`card-cls-optimized loading-state-cls-optimized p-6 space-y-6 ${className}`}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <div className="skeleton-optimized h-4 w-24 rounded"></div>
        <div className="skeleton-optimized h-10 w-full rounded"></div>
      </div>
    ))}
    <div className="flex space-x-4 pt-4">
      <div className="skeleton-optimized h-10 w-24 rounded"></div>
      <div className="skeleton-optimized h-10 w-24 rounded"></div>
    </div>
  </div>
);

// Hook pour gérer les états de chargement avec skeleton
export const useSkeletonLoader = (loading: boolean, delay: number = 200) => {
  const [showSkeleton, setShowSkeleton] = React.useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (loading) {
      timer = setTimeout(() => {
        setShowSkeleton(true);
      }, delay);
    } else {
      setShowSkeleton(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, delay]);

  return showSkeleton;
};

export default {
  CardSkeleton,
  ImageSkeleton,
  ChartSkeleton,
  ListSkeleton,
  TableSkeleton,
  GridSkeleton,
  ProfileSkeleton,
  StatsSkeleton,
  FormSkeleton,
  useSkeletonLoader
};
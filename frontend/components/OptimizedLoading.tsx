"use client";

import React from 'react';
import { Spinner } from '@nextui-org/react';

interface OptimizedLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const OptimizedLoading: React.FC<OptimizedLoadingProps> = ({ 
  message = "Chargement optimisé...", 
  size = 'lg',
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] p-4 ${className}`}>
      <div className="text-center">
        <div className="relative">
          <Spinner color="primary" size={size} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-purple-600 dark:text-purple-300 font-medium">
          {message}
        </p>
        <p className="mt-2 text-sm text-purple-500 dark:text-purple-400">
          Récupération des données en cours
        </p>
      </div>
    </div>
  );
};

export default OptimizedLoading;

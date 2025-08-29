"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy loading des graphiques avec des skeletons optimisés
const Charts = dynamic(() => import('./Charts'), {
  ssr: false,
  loading: () => (
    <div className="chart-container chart-loading">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Chargement du graphique...</p>
        </div>
      </div>
    </div>
  )
});

// Composant wrapper pour les graphiques avec gestion d'erreur
interface LazyChartsProps {
  type: 'line' | 'bar' | 'doughnut';
  data: any;
  options: any;
  fallback?: React.ReactNode;
}

const LazyCharts: React.FC<LazyChartsProps> = ({ 
  type, 
  data, 
  options, 
  fallback 
}) => {
  return (
    <Suspense fallback={
      fallback || (
        <div className="chart-container chart-loading">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Chargement du graphique...</p>
            </div>
          </div>
        </div>
      )
    }>
      <div className="chart-container">
        <Charts type={type} data={data} options={options} />
      </div>
    </Suspense>
  );
};

export default LazyCharts;
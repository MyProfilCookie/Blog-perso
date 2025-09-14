"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy loading des graphiques
const Line = dynamic(() => import("react-chartjs-2").then(mod => ({ default: mod.Line })), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
});

const Bar = dynamic(() => import("react-chartjs-2").then(mod => ({ default: mod.Bar })), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
});

const Doughnut = dynamic(() => import("react-chartjs-2").then(mod => ({ default: mod.Doughnut })), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
});

interface ChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: any;
  options: any;
}

const chartContainerStyle = {
  height: '256px',
  width: '100%',
  contain: 'layout style paint',
  minHeight: '256px'
};

const Charts: React.FC<ChartProps> = ({ type, data, options }) => {
  const [isChartJSLoaded, setIsChartJSLoaded] = useState(false);

  useEffect(() => {
    // Initialiser Chart.js seulement côté client
    if (typeof window !== 'undefined' && !isChartJSLoaded) {
      import('chart.js').then(({ Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend }) => {
        Chart.register(
          CategoryScale,
          LinearScale,
          PointElement,
          LineElement,
          BarElement,
          ArcElement,
          Title,
          Tooltip,
          Legend,
        );
        setIsChartJSLoaded(true);
      });
    }
  }, [isChartJSLoaded]);

  if (!isChartJSLoaded) {
    return <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded chart-container-fixed dynamic-content-container chart-container dynamic-content-container" />;
  }

  switch (type) {
    case 'line':
      return <div className="chart-container dynamic-content-container chart-container dynamic-content-container"><Line data={data} options={options} /></div>;
    case 'bar':
      return <div className="chart-container dynamic-content-container chart-container dynamic-content-container"><Bar data={data} options={options} /></div>;
    case 'doughnut':
      return <div className="chart-container dynamic-content-container chart-container dynamic-content-container"><Doughnut data={data} options={options} /></div>;
    default:
      return null;
  }
};

export default Charts;

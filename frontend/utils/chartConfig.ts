// Exports des éléments Chart.js pour utilisation dans les composants
export {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Configuration par défaut pour les performances (sans enregistrement global)
export const defaultChartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 300, // Animation plus rapide
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
    axis: 'x' as const,
    includeInvisible: false,
  },
};

// Options communes pour tous les graphiques
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false,
      },
      ticks: {
        font: {
          size: 11,
        },
        color: 'rgba(0, 0, 0, 0.6)',
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false,
      },
      ticks: {
        font: {
          size: 11,
        },
        color: 'rgba(0, 0, 0, 0.6)',
      },
    },
  },
  elements: {
    point: {
      radius: 3,
      hoverRadius: 5,
      borderWidth: 2,
    },
    line: {
      borderWidth: 2,
      tension: 0.4,
    },
    bar: {
      borderRadius: 4,
      borderSkipped: false,
    },
  },
};

// Options spécifiques pour les graphiques en barres
export const barChartOptions = {
  ...commonChartOptions,
  plugins: {
    ...commonChartOptions.plugins,
    legend: {
      display: false,
    },
  },
  scales: {
    ...commonChartOptions.scales,
    y: {
      ...commonChartOptions.scales.y,
      beginAtZero: true,
      max: 100,
      ticks: {
        ...commonChartOptions.scales.y.ticks,
        callback: (value: any) => `${value}%`,
      },
    },
  },
};

// Options spécifiques pour les graphiques en ligne
export const lineChartOptions = {
  ...commonChartOptions,
  plugins: {
    ...commonChartOptions.plugins,
    legend: {
      display: false,
    },
    filler: {
      propagate: false,
    },
  },
  scales: {
    ...commonChartOptions.scales,
    y: {
      ...commonChartOptions.scales.y,
      beginAtZero: true,
      max: 100,
      ticks: {
        ...commonChartOptions.scales.y.ticks,
        callback: (value: any) => `${value}%`,
      },
    },
  },
  elements: {
    ...commonChartOptions.elements,
    point: {
      ...commonChartOptions.elements.point,
      backgroundColor: '#ffffff',
      borderWidth: 2,
    },
  },
};

// Options spécifiques pour les graphiques en secteurs
export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        label: (context: any) => {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
  cutout: '60%',
  elements: {
    arc: {
      borderWidth: 0,
      hoverBorderWidth: 2,
      hoverBorderColor: '#ffffff',
    },
  },
};

// Palette de couleurs optimisée
export const colorPalette = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F97316',
  info: '#06B6D4',
  success: '#22C55E',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
};

// Fonction pour générer des couleurs avec transparence
export const generateColors = (baseColor: string, count: number) => {
  const colors = [];
  const baseHue = parseInt(baseColor.slice(1), 16);
  
  for (let i = 0; i < count; i++) {
    const hue = (baseHue + (i * 360 / count)) % 360;
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  
  return colors;
};

// Fonction pour créer des datasets optimisés
export const createOptimizedDataset = (data: number[], label: string, color: string) => {
  return {
    label,
    data,
    backgroundColor: color + '80', // Ajouter transparence
    borderColor: color,
    borderWidth: 2,
    pointBackgroundColor: color,
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
    tension: 0.4,
    fill: true,
  };
};
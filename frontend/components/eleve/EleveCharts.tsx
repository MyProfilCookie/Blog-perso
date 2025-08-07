import React, { useMemo, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { SubjectStats, DailyStats, CategoryStats, SUBJECTS_CONFIG } from '../../types/eleve';
import { useMemoizedCalculation } from '../../utils/memoization';
import {
  barChartOptions,
  lineChartOptions,
  doughnutChartOptions,
  colorPalette,
  createOptimizedDataset,
} from '../../utils/chartConfig';

// Import dynamique des composants Chart.js pour éviter les problèmes SSR
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => ({ default: mod.Bar })), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
});

const Line = dynamic(() => import('react-chartjs-2').then((mod) => ({ default: mod.Line })), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
});

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => ({ default: mod.Doughnut })), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
});

// Hook pour l'enregistrement des composants Chart.js
const useChartJS = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const registerChartJS = async () => {
      if (typeof window !== 'undefined' && !isRegistered) {
        const {
           Chart,
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
         } = await import('chart.js');

        Chart.register(
          CategoryScale,
          LinearScale,
          BarElement,
          LineElement,
          PointElement,
          ArcElement,
          Title,
          Tooltip,
          Legend,
          Filler
        );
        setIsRegistered(true);
      }
    };

    registerChartJS();
  }, [isRegistered]);

  return isRegistered;
};

interface EleveChartsProps {
  subjects: SubjectStats[];
  categoryStats: CategoryStats[];
  dailyStats: DailyStats[];
}

const EleveCharts: React.FC<EleveChartsProps> = ({ subjects, categoryStats, dailyStats }) => {
  const isChartReady = useChartJS();

  // Couleurs dynamiques basées sur la configuration des matières
  const getSubjectColors = useMemoizedCalculation(() => {
    return subjects.map(subject => {
      const config = SUBJECTS_CONFIG[subject.subject as keyof typeof SUBJECTS_CONFIG];
      if (config) {
        const colorMap: { [key: string]: string } = {
          'yellow': colorPalette.warning,
          'red': colorPalette.danger,
          'green': colorPalette.success,
          'purple': colorPalette.purple,
          'indigo': colorPalette.indigo,
          'teal': colorPalette.info,
          'pink': colorPalette.pink,
          'cyan': colorPalette.info,
          'rose': colorPalette.pink,
          'gray': '#6B7280',
          'orange': colorPalette.warning,
        };
        
        const colorKey = config.color.split('-')[1];
        return colorMap[colorKey] || colorPalette.primary;
      }
      return colorPalette.primary;
    });
  }, [subjects]);

  // Options pour le graphique en barres
  const barOptions = useMemo(() => ({
    ...barChartOptions,
    plugins: {
      ...barChartOptions.plugins,
      title: {
        display: true,
        text: 'Scores par matière',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Score: ${context.parsed.y.toFixed(1)}%`;
          },
        },
      },
    },
  }), []);

  // Options pour le graphique en ligne
  const lineOptions = useMemo(() => ({
    ...lineChartOptions,
    plugins: {
      ...lineChartOptions.plugins,
      title: {
        display: true,
        text: 'Évolution des scores dans le temps',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Score: ${context.parsed.y.toFixed(1)}%`;
          },
        },
      },
    },
  }), []);

  const doughnutOptions = useMemo(() => ({
    ...doughnutChartOptions,
    plugins: {
      ...doughnutChartOptions.plugins,
      title: {
        display: true,
        text: 'Répartition par catégorie',
      },
      tooltip: {
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
  }), []);

  const barChartData = useMemo(() => {
    if (!subjects || subjects.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    return {
      labels: subjects.map(s => SUBJECTS_CONFIG[s.subject as keyof typeof SUBJECTS_CONFIG]?.name || s.subject),
      datasets: [
        {
          label: 'Score moyen (%)',
          data: subjects.map(s => s.averageScore),
          backgroundColor: getSubjectColors.map(color => color + '80'), // Ajouter transparence
          borderColor: getSubjectColors,
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  }, [subjects, getSubjectColors]);

  const lineChartData = useMemo(() => {
    if (!dailyStats || dailyStats.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    return {
      labels: dailyStats.map(d => new Date(d.date).toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      })),
      datasets: [
        {
          label: 'Score moyen (%)',
          data: dailyStats.map(d => d.averageScore),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [dailyStats]);

  const doughnutChartData = useMemo(() => {
    if (!categoryStats || categoryStats.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    return {
      labels: categoryStats.map(c => c.category),
      datasets: [
        {
          data: categoryStats.map(c => c.count),
          backgroundColor: [
            '#F59E0B',
            '#EF4444',
            '#10B981',
            '#8B5CF6',
            '#6366F1',
            '#14B8A6',
            '#EC4899',
            '#06B6D4',
            '#F43F5E',
            '#6B7280',
          ],
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: '#ffffff',
        },
      ],
    };
  }, [categoryStats]);

  return (
    <>
      {/* Graphique des scores par matière */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-800/50 shadow-lg border border-indigo-200 dark:border-indigo-700">
        <CardBody>
          <h3 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-100">
            Scores par matière
          </h3>
          <div className="h-64 w-full overflow-hidden">
            <div className="w-full h-full">
              {isChartReady ? (
                <Bar data={barChartData} options={barOptions} />
              ) : (
                <div className="h-full bg-gray-100 animate-pulse rounded flex items-center justify-center">
                  <span className="text-gray-500">Chargement du graphique...</span>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Graphique de progression */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/50 dark:to-rose-800/50 shadow-lg border border-pink-200 dark:border-pink-700">
        <CardBody>
          <h3 className="text-xl font-semibold mb-4 text-pink-800 dark:text-pink-100">
            Évolution des scores
          </h3>
          <div className="h-64 w-full overflow-hidden">
            <div className="w-full h-full">
              {isChartReady ? (
                <Line data={lineChartData} options={lineOptions} />
              ) : (
                <div className="h-full bg-gray-100 animate-pulse rounded flex items-center justify-center">
                  <span className="text-gray-500">Chargement du graphique...</span>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Graphique en secteurs */}
      {categoryStats && categoryStats.length > 0 && (
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/50 dark:to-cyan-800/50 shadow-lg border border-teal-200 dark:border-teal-700">
          <CardBody>
            <h3 className="text-xl font-semibold mb-4 text-teal-800 dark:text-teal-100">
              Répartition par catégorie
            </h3>
            <div className="h-64 w-full overflow-hidden">
              <div className="w-full h-full">
                {isChartReady ? (
                  <Doughnut data={doughnutChartData} options={doughnutOptions} />
                ) : (
                  <div className="h-full bg-gray-100 animate-pulse rounded flex items-center justify-center">
                    <span className="text-gray-500">Chargement du graphique...</span>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

EleveCharts.displayName = 'EleveCharts';

export default EleveCharts;
import React, { useMemo } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { SubjectStats, DailyStats, CategoryStats, SUBJECTS_CONFIG } from '../../types/eleve';
import {
  barChartOptions,
  lineChartOptions,
  doughnutChartOptions,
  colorPalette,
  createOptimizedDataset,
} from '../../utils/chartConfig';
import { useMemoizedCalculation } from '../../utils/memoization';

interface EleveChartsProps {
  subjects: SubjectStats[];
  categoryStats: CategoryStats[];
  dailyStats: DailyStats[];
}

const EleveCharts: React.FC<EleveChartsProps> = ({ subjects, categoryStats, dailyStats }) => {
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
              <Bar data={barChartData} options={barOptions} />
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
              <Line data={lineChartData} options={lineOptions} />
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
                <Doughnut data={doughnutChartData} options={doughnutOptions} />
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
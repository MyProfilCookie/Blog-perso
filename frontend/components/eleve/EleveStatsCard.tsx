import React from 'react';
import { Card, CardBody, CardHeader, Progress, Chip } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { SubjectStats, SUBJECTS_CONFIG, getScoreColor } from '../../types/eleve';

interface EleveStatsCardProps {
  stats: SubjectStats;
}

const EleveStatsCard: React.FC<EleveStatsCardProps> = ({ stats }) => {
  const subjectConfig = SUBJECTS_CONFIG[stats.subject as keyof typeof SUBJECTS_CONFIG];
  const scoreColor = getScoreColor(stats.averageScore);
  const progressColor = getScoreColor(stats.progress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`h-full ${subjectConfig?.bgColor || 'bg-gray-50 dark:bg-gray-900/20'}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start w-full">
            <div>
              <h3 className="text-lg font-semibold">
                {subjectConfig?.name || stats.subject}
              </h3>
              <p className="text-sm text-gray-500">
                {stats.exercisesCompleted} exercices complétés
              </p>
            </div>
            <Chip
              color={scoreColor}
              variant="flat"
              size="sm"
              className={subjectConfig?.color}
            >
              {stats.averageScore.toFixed(1)}%
            </Chip>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Progression</span>
                <span className="font-semibold">{stats.progress.toFixed(1)}%</span>
              </div>
              <Progress
                value={stats.progress}
                color={progressColor}
                className="h-3"
                showValueLabel={false}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {stats.totalExercises}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">exercices</p>
              </div>
              <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Réussites</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {stats.correctAnswers}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.totalExercises > 0 ? 
                    `${((stats.correctAnswers / stats.totalExercises) * 100).toFixed(0)}%` : 
                    '0%'
                  }
                </p>
              </div>
            </div>

            {stats.lastActivity && (
              <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                Dernière activité: {new Date(stats.lastActivity).toLocaleDateString('fr-FR')}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

EleveStatsCard.displayName = 'EleveStatsCard';

export default EleveStatsCard;
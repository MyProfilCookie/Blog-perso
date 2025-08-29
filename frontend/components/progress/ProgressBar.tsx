"use client";

import { useEffect, useState } from "react";
import { Progress } from '@nextui-org/react';
import { motion } from "framer-motion";

interface ProgressBarProps {
  totalQuestions: number;
  correctAnswers: number;
  onProgressComplete?: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  totalQuestions,
  correctAnswers,
  onProgressComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (totalQuestions > 0) {
      const newProgress = (correctAnswers / totalQuestions) * 100;
      setProgress(newProgress);

      if (newProgress === 100 && onProgressComplete) {
        onProgressComplete();
      }
    }
  }, [correctAnswers, totalQuestions, onProgressComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progression
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress
        value={progress}
        color="success"
        className="w-full"
        showValueLabel={false}
      />
    </motion.div>
  );
}; 
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  initialProgress?: number;
  onProgressComplete?: () => void;
}

export default function ProgressBar({ initialProgress = 0, onProgressComplete }: ProgressBarProps) {
  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          onProgressComplete?.();
          return 100;
        }
        const newProgress = Math.min(oldProgress + 1, 100);
        return newProgress;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [onProgressComplete]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
      <motion.div
        className="bg-violet-600 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
      <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
        <span>{progress}% terminé</span>
        <span>Temps restant: {Math.ceil((100 - progress) * 0.6)} min</span>
      </div>
    </div>
  );
} 
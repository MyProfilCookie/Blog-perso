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
    <div className="w-full">
      <div className="w-full bg-white/20 rounded-full h-2.5">
        <motion.div 
          className="bg-yellow-300 h-2.5 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
        <span>Progression : {progress}%</span>
        <span>Temps restant : {Math.ceil((100 - progress) * 0.6)} min</span>
      </div>
    </div>
  );
} 
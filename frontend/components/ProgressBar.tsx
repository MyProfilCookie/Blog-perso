import dynamic from 'next/dynamic';
"use client";

const motion = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion })), { ssr: false });
import { useEffect, useState } from "react";

interface ProgressBarProps {
  totalQuestions: number;
  correctAnswers: number;
  onProgressComplete?: () => void;
}

export default function ProgressBar({
  totalQuestions,
  correctAnswers,
  onProgressComplete,
}: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = (correctAnswers / totalQuestions) * 100;
    setProgress(newProgress);

    if (newProgress === 100) {
      onProgressComplete?.();
    }
  }, [correctAnswers, totalQuestions, onProgressComplete]);

  return (
    <div className="w-full">
      <div className="w-full bg-white/20 rounded-full h-2.5">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="bg-yellow-300 h-2.5 rounded-full"
          initial={{ width: "0%" }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
        <span>Progression : {Math.round(progress)}%</span>
        <span>Réponses correctes : {correctAnswers}/{totalQuestions}</span>
      </div>
    </div>
  );
}

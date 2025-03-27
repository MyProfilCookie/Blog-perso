"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";

import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";

// Interface pour les exercices de musique
interface Exercise {
  id: number;
  title: string;
  content: string;
  question: string;
  options?: string[];
  image?: string;
  answer: string;
  difficulty?: "Facile" | "Moyen" | "Difficile";
  estimatedTime?: string;
  category?: string;
}

const MusicPage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [emoji, setEmoji] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [completedExercises, setCompletedExercises] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  const [showTips, setShowTips] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  // Messages d'encouragement
  const encouragementMessages = [
    "🎵 Tu as l'oreille musicale !",
    "🎼 Excellent sens du rythme !",
    "🎹 Continue d'explorer la musique !",
    "🎸 Tes connaissances musicales s'améliorent !",
    "🎺 Tu deviens un vrai musicien !",
    "🚀 Tu progresses en harmonie !"
  ];

  // Données statiques pour les exercices de musique
  const mockExercises: Exercise[] = [
    {
      id: 1,
      title: "Notes de Musique",
      content: "Les notes sur la portée",
      question: "Quelle est la première note de la gamme de Do majeur ?",
      options: ["Do", "Ré", "Mi", "Fa"],
      answer: "Do",
      difficulty: "Facile",
      category: "Théorie Musicale"
    },
    // Ajoutez plus d'exercices ici...
  ];

  useEffect(() => {
    setExercises(mockExercises);
    setLoading(false);
  }, []);

  // ... Le reste du code est similaire au composant Language

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex-1 w-full max-w-7xl mx-auto">
        <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6 relative">
            <div className="absolute top-0 left-0 z-10">
              <BackButton />
            </div>
            <motion.div 
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 sm:mb-6"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                Musique
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices de musique
              </p>
            </motion.div>
            <div className="flex justify-end items-center mb-4">
              <Timer timeLeft={timeLeft} />
            </div>
            {/* ... Reste du contenu similaire au composant Language ... */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MusicPage; 
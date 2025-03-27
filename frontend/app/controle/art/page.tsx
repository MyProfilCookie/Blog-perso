/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";
import { useRouter } from "next/navigation";

// Interface pour les exercices d'art
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

const ArtPage: React.FC = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [finalScore, setFinalScore] = useState<number>(0);
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
    "🎨 Tu as un vrai talent artistique !",
    "🖼️ Continue comme ça, tu as l'œil !",
    "🎭 Ta créativité est impressionnante !",
    "✨ Tu as une excellente perception artistique !",
    "🌈 Laisse libre cours à ton imagination !",
    "🚀 Tu progresses comme un vrai artiste !"
  ];

  // Données statiques pour les exercices d'art
  const mockExercises: Exercise[] = [
    {
      id: 1,
      title: "Histoire de l'Art",
      content: "Découvrez les grands mouvements artistiques",
      question: "Quel artiste est connu pour 'La Nuit étoilée' ?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet", "Salvador Dalí"],
      answer: "Vincent van Gogh",
      difficulty: "Facile",
      category: "Peinture"
    },
    // Ajoutez plus d'exercices ici...
  ];

  // Effets et gestionnaires d'événements similaires au composant Language
  useEffect(() => {
    setExercises(mockExercises);
    setLoading(false);
  }, []);

  const handleAnswer = (answer: string) => {
    if (!exercises.length) return;
    
    setUserAnswers({ ...userAnswers, [currentExercise]: answer });
    if (answer === exercises[currentExercise].answer) {
      setResults({ ...results, [currentExercise]: true });
      setTotalPoints(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
    } else {
      setResults({ ...results, [currentExercise]: false });
      setCurrentStreak(0);
    }
    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setUserAnswers({ ...userAnswers, [currentExercise + 1]: "" });
        setCompletedExercises(prev => prev + 1);
      } else {
        setShowResults(true);
        setFinalScore(totalPoints);
      }
    }, 1000);
  };

  const calculatePercentage = () => {
    if (!exercises.length) return 0;
    return Math.round((totalPoints / exercises.length) * 100);
  };

  const getFeedback = () => {
    const percentage = calculatePercentage();
    if (percentage >= 80) return "🌟 Excellent ! Tu es un vrai artiste !";
    if (percentage >= 60) return "🎨 Très bien ! Continue comme ça !";
    if (percentage >= 40) return "🎭 Pas mal ! Tu peux encore progresser !";
    return "🎪 Continue d'apprendre, tu vas y arriver !";
  };

  const calculateFinalScore = () => {
    // Implementation of calculateFinalScore
  };

  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Résultats</h2>
          <p className="text-xl mb-2">
            Score : {totalPoints} sur {exercises.length}
          </p>
          <p className="text-xl mb-4">{getFeedback()}</p>
          <Button
            color="primary"
            onClick={() => router.push("/controle")}
            className="mt-4"
          >
            Retour au menu
          </Button>
        </motion.div>
      </div>
    );
  }

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
                Art
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices d'art et culture artistique
              </p>
            </motion.div>
            <div className="flex justify-end items-center mb-4">
              <Timer timeLeft={timeLeft} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArtPage;

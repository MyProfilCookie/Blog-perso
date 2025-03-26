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

// Interface pour les exercices de mathématiques
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

const MathPage: React.FC = () => {
  const router = useRouter();
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

  // Statistiques et badges
  const [badges, setBadges] = useState<{
    perfectScore: boolean;
    streakMaster: boolean;
    mathExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    mathExpert: false,
    quickLearner: false,
  });

  // Nouvel état pour le minuteur (1 heure = 3600 secondes)
  const [timeLeft, setTimeLeft] = useState<number>(3600);

  // Messages d'encouragement
  const encouragementMessages = [
    "🌟 Tu t'en sors très bien !",
    "💪 Continue comme ça, tu es sur la bonne voie !",
    "🎯 Reste concentré, tu fais du bon travail !",
    "✨ Tu es capable de réussir !",
    "🌈 N'hésite pas à prendre ton temps !",
    "🚀 Tu progresses bien !"
  ];

  // Gestion du minuteur et des messages d'encouragement
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let encouragementTimer: NodeJS.Timeout;

    if (timeLeft > 0) {
      // Minuteur principal
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            calculateFinalScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Messages d'encouragement toutes les 10 minutes
      encouragementTimer = setInterval(() => {
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        setEmoji(randomMessage);
        setTimeout(() => setEmoji(""), 5000); // Le message disparaît après 5 secondes
      }, 600000); // 600000ms = 10 minutes
    }

    return () => {
      clearInterval(timer);
      clearInterval(encouragementTimer);
    };
  }, [timeLeft]);

  // Fonction pour formater le temps restant
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const mockExercises: Exercise[] = [
      {
        id: 1,
        title: "Nombres",
        content: "Les nombres simples",
        question: "Combien font 2 + 2 ?",
        options: ["3", "4", "5", "6"],
        answer: "4",
        category: "Nombres",
        difficulty: "Facile" as const
      },
      {
        id: 2,
        title: "Formes",
        content: "Les formes simples",
        question: "Quelle est la forme d'un carré ?",
        options: ["Ronde", "Carrée", "Triangle", "Rectangle"],
        answer: "Carrée",
        category: "Formes",
        difficulty: "Facile" as const
      },
      {
        id: 3,
        title: "Formes",
        content: "Les formes simples",
        question: "Combien y a-t-il de côtés dans un triangle ?",
        options: ["2", "3", "4", "5"],
        answer: "3",
        category: "Formes",
        difficulty: "Facile" as const
      },
      {
        id: 4,
        title: "Couleurs",
        content: "Les couleurs",
        question: "Quelle est la couleur du chiffre 5 ?",
        options: ["Rouge", "Bleu", "Vert", "Jaune"],
        answer: "Bleu",
        category: "Couleurs",
        difficulty: "Facile" as const
      },
      {
        id: 5,
        title: "Nombres",
        content: "Les nombres simples",
        question: "Combien font 5 - 3 ?",
        options: ["1", "2", "3", "4"],
        answer: "2",
        category: "Nombres",
        difficulty: "Facile" as const
      },
      {
        id: 6,
        title: "Formes",
        content: "Les formes simples",
        question: "Quelle est la forme d'un cercle ?",
        options: ["Carrée", "Triangle", "Ronde", "Rectangle"],
        answer: "Ronde",
        category: "Formes",
        difficulty: "Facile" as const
      },
      {
        id: 7,
        title: "Nombres",
        content: "Les nombres simples",
        question: "Combien font 3 × 2 ?",
        options: ["4", "5", "6", "7"],
        answer: "6",
        category: "Nombres",
        difficulty: "Facile" as const
      },
      {
        id: 8,
        title: "Formes",
        content: "Les formes simples",
        question: "Quelle est la plus grande forme ?",
        options: ["Cercle", "Carré", "Triangle", "Rectangle"],
        answer: "Carré",
        category: "Formes",
        difficulty: "Facile" as const
      },
      {
        id: 9,
        title: "Nombres",
        content: "Les nombres simples",
        question: "Combien font 10 ÷ 2 ?",
        options: ["3", "4", "5", "6"],
        answer: "5",
        category: "Nombres",
        difficulty: "Facile" as const
      },
      {
        id: 10,
        title: "Couleurs",
        content: "Les couleurs",
        question: "Quelle est la couleur du chiffre 8 ?",
        options: ["Rouge", "Bleu", "Vert", "Jaune"],
        answer: "Vert",
        category: "Couleurs",
        difficulty: "Facile" as const
      }
    ];
    setExercises(mockExercises);
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = (id: number, correctAnswer: string) => {
    const userAnswer = userAnswers[id];
    const isCorrect = userAnswer?.toString().trim().toLowerCase() === correctAnswer.toLowerCase();

    setResults({ ...results, [id]: isCorrect });
    
    if (isCorrect) {
      setCompletedExercises(prev => prev + 1);
      setTotalPoints(prev => prev + 10);
      setCurrentStreak(prev => prev + 1);
    } else {
      setCurrentStreak(0);
    }
  };

  const calculateFinalScore = () => {
    const total = exercises.length;
    const correct = Object.values(results).filter(Boolean).length;
    const score = (correct / total) * 100;

    setFinalScore(score);
    setShowResults(true);

    // Mise à jour des badges
    setBadges(prev => ({
      ...prev,
      perfectScore: score === 100,
      streakMaster: currentStreak >= 5,
      mathExpert: completedExercises >= 10,
      quickLearner: score >= 80 && completedExercises >= 5,
    }));

    if (score === 100) {
      setEmoji("🌟");
    } else if (score >= 80) {
      setEmoji("😊");
    } else if (score >= 50) {
      setEmoji("😐");
    } else {
      setEmoji("😢");
    }
  };

  const filteredExercises = selectedCategory === "Tout" 
    ? exercises 
    : exercises.filter(ex => ex.category && ex.category === selectedCategory);

  // Extraction des catégories uniques
  const uniqueCategories = exercises
    .map(ex => ex.category)
    .filter((category): category is string => Boolean(category));
  const categories = ["Tout", ...Array.from(new Set(uniqueCategories))];

  const handleRating = (rating: "Facile" | "Moyen" | "Difficile") => {
    // Ici, vous pouvez ajouter la logique pour sauvegarder la progression
    console.log(`Progression en mathématiques : ${rating}`);
  };

  if (loading) {
    return (
      <motion.div 
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-spin text-4xl">🔄</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen gap-4"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-2xl text-red-600">⚠️</div>
        <p className="text-lg text-gray-600">Erreur: {error}</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex-1 w-full max-w-7xl mx-auto">
        <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6 relative">
            <motion.div 
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 sm:mb-6"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                Mathématiques
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices de mathématiques
              </p>
            </motion.div>
            <div className="flex justify-center mb-4">
              <BackButton />
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-between items-center mb-4">
        <BackButton />
        <Timer timeLeft={timeLeft} />
      </div>

      <div className="mb-6">
        <ProgressBar 
          totalQuestions={exercises.length} 
          correctAnswers={completedExercises}
          onProgressComplete={() => {
            if (completedExercises === exercises.length) {
              calculateFinalScore();
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map(ex => (
          <Card key={ex.id} className="w-full h-full">
            <CardBody className="p-4">
              <h2 className="text-xl font-bold mb-2">{ex.title}</h2>
              <p className="text-base text-gray-600 dark:text-gray-400">{ex.content}</p>
              <div className="mt-4">
                {ex.options?.map((option, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md mr-2 mb-2"
                    onClick={() => handleSubmit(ex.id, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MathPage;

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
  const [isStarted, setIsStarted] = useState<boolean>(false);

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

    if (isStarted && timeLeft > 0) {
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
  }, [isStarted, timeLeft]);

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
        title: "Opérations",
        content: "Les additions simples",
        question: "Combien font 5 + 3 ?",
        options: ["8", "7", "9", "6"],
        answer: "8",
        category: "Opérations",
        difficulty: "Facile" as const
      },
      {
        id: 2,
        title: "Opérations",
        content: "Les soustractions simples",
        question: "Combien font 10 - 4 ?",
        options: ["6", "5", "7", "4"],
        answer: "6",
        category: "Opérations",
        difficulty: "Facile" as const
      },
      {
        id: 3,
        title: "Opérations",
        content: "Les multiplications simples",
        question: "Combien font 4 × 3 ?",
        options: ["12", "10", "14", "8"],
        answer: "12",
        category: "Opérations",
        difficulty: "Facile" as const
      },
      {
        id: 4,
        title: "Opérations",
        content: "Les divisions simples",
        question: "Combien font 15 ÷ 3 ?",
        options: ["5", "4", "6", "3"],
        answer: "5",
        category: "Opérations",
        difficulty: "Facile" as const
      },
      {
        id: 5,
        title: "Fractions",
        content: "Les fractions simples",
        question: "Quelle est la moitié de 10 ?",
        options: ["5", "4", "6", "3"],
        answer: "5",
        category: "Fractions",
        difficulty: "Facile" as const
      },
      {
        id: 6,
        title: "Géométrie",
        content: "Les formes simples",
        question: "Combien de côtés a un carré ?",
        options: ["4", "3", "5", "6"],
        answer: "4",
        category: "Géométrie",
        difficulty: "Facile" as const
      },
      {
        id: 7,
        title: "Mesures",
        content: "Les unités de mesure",
        question: "Combien de centimètres dans un mètre ?",
        options: ["100", "50", "200", "150"],
        answer: "100",
        category: "Mesures",
        difficulty: "Facile" as const
      },
      {
        id: 8,
        title: "Nombres",
        content: "Les nombres pairs et impairs",
        question: "Quel est le plus petit nombre pair ?",
        options: ["2", "1", "3", "4"],
        answer: "2",
        category: "Nombres",
        difficulty: "Facile" as const
      },
      {
        id: 9,
        title: "Problèmes",
        content: "Les problèmes simples",
        question: "Si j'ai 3 pommes et j'en mange 1, combien m'en reste-t-il ?",
        options: ["2", "1", "3", "4"],
        answer: "2",
        category: "Problèmes",
        difficulty: "Facile" as const
      },
      {
        id: 10,
        title: "Calcul mental",
        content: "Les calculs rapides",
        question: "Combien font 20 + 30 ?",
        options: ["50", "40", "60", "45"],
        answer: "50",
        category: "Calcul mental",
        difficulty: "Facile" as const
      },
      {
        id: 11,
        title: "Opérations",
        content: "Les additions avec retenue",
        question: "Combien font 25 + 37 ?",
        options: ["62", "61", "63", "60"],
        answer: "62",
        category: "Opérations",
        difficulty: "Moyen" as const
      },
      {
        id: 12,
        title: "Opérations",
        content: "Les soustractions avec retenue",
        question: "Combien font 45 - 28 ?",
        options: ["17", "16", "18", "15"],
        answer: "17",
        category: "Opérations",
        difficulty: "Moyen" as const
      },
      {
        id: 13,
        title: "Opérations",
        content: "Les multiplications à un chiffre",
        question: "Combien font 7 × 6 ?",
        options: ["42", "41", "43", "40"],
        answer: "42",
        category: "Opérations",
        difficulty: "Moyen" as const
      },
      {
        id: 14,
        title: "Opérations",
        content: "Les divisions avec reste",
        question: "Combien font 25 ÷ 4 ?",
        options: ["6 reste 1", "5 reste 5", "7 reste 3", "4 reste 9"],
        answer: "6 reste 1",
        category: "Opérations",
        difficulty: "Moyen" as const
      },
      {
        id: 15,
        title: "Fractions",
        content: "Les fractions équivalentes",
        question: "Quelle fraction est égale à 1/2 ?",
        options: ["2/4", "1/3", "3/6", "4/8"],
        answer: "2/4",
        category: "Fractions",
        difficulty: "Moyen" as const
      },
      {
        id: 16,
        title: "Géométrie",
        content: "Les angles",
        question: "Quel est l'angle d'un carré ?",
        options: ["90 degrés", "45 degrés", "180 degrés", "360 degrés"],
        answer: "90 degrés",
        category: "Géométrie",
        difficulty: "Moyen" as const
      },
      {
        id: 17,
        title: "Mesures",
        content: "Les conversions",
        question: "Combien de mètres dans 2 kilomètres ?",
        options: ["2000", "1000", "3000", "1500"],
        answer: "2000",
        category: "Mesures",
        difficulty: "Moyen" as const
      },
      {
        id: 18,
        title: "Nombres",
        content: "Les nombres décimaux",
        question: "Quel est le nombre décimal pour 1/2 ?",
        options: ["0,5", "0,2", "0,8", "0,3"],
        answer: "0,5",
        category: "Nombres",
        difficulty: "Moyen" as const
      },
      {
        id: 19,
        title: "Problèmes",
        content: "Les problèmes à étapes",
        question: "Si j'ai 5 bonbons et j'en donne 2 à mon ami, combien m'en reste-t-il ?",
        options: ["3", "2", "4", "1"],
        answer: "3",
        category: "Problèmes",
        difficulty: "Moyen" as const
      },
      {
        id: 20,
        title: "Calcul mental",
        content: "Les calculs rapides",
        question: "Combien font 100 - 25 ?",
        options: ["75", "70", "80", "65"],
        answer: "75",
        category: "Calcul mental",
        difficulty: "Moyen" as const
      },
      {
        id: 21,
        title: "Opérations",
        content: "Les additions de grands nombres",
        question: "Combien font 234 + 567 ?",
        options: ["801", "800", "802", "799"],
        answer: "801",
        category: "Opérations",
        difficulty: "Difficile" as const
      },
      {
        id: 22,
        title: "Opérations",
        content: "Les soustractions de grands nombres",
        question: "Combien font 789 - 456 ?",
        options: ["333", "332", "334", "331"],
        answer: "333",
        category: "Opérations",
        difficulty: "Difficile" as const
      },
      {
        id: 23,
        title: "Opérations",
        content: "Les multiplications à deux chiffres",
        question: "Combien font 12 × 11 ?",
        options: ["132", "131", "133", "130"],
        answer: "132",
        category: "Opérations",
        difficulty: "Difficile" as const
      },
      {
        id: 24,
        title: "Opérations",
        content: "Les divisions à deux chiffres",
        question: "Combien font 144 ÷ 12 ?",
        options: ["12", "11", "13", "10"],
        answer: "12",
        category: "Opérations",
        difficulty: "Difficile" as const
      },
      {
        id: 25,
        title: "Fractions",
        content: "Les fractions complexes",
        question: "Quelle fraction est égale à 3/4 ?",
        options: ["6/8", "4/6", "8/10", "5/7"],
        answer: "6/8",
        category: "Fractions",
        difficulty: "Difficile" as const
      },
      {
        id: 26,
        title: "Géométrie",
        content: "Les périmètres",
        question: "Quel est le périmètre d'un carré de 5 cm de côté ?",
        options: ["20 cm", "15 cm", "25 cm", "10 cm"],
        answer: "20 cm",
        category: "Géométrie",
        difficulty: "Difficile" as const
      },
      {
        id: 27,
        title: "Mesures",
        content: "Les conversions complexes",
        question: "Combien de centimètres dans 2,5 mètres ?",
        options: ["250", "200", "300", "150"],
        answer: "250",
        category: "Mesures",
        difficulty: "Difficile" as const
      },
      {
        id: 28,
        title: "Nombres",
        content: "Les nombres négatifs",
        question: "Quel est le résultat de -5 + 3 ?",
        options: ["-2", "-1", "-3", "-4"],
        answer: "-2",
        category: "Nombres",
        difficulty: "Difficile" as const
      },
      {
        id: 29,
        title: "Problèmes",
        content: "Les problèmes complexes",
        question: "Si j'ai 20 bonbons et j'en donne 3 à chaque ami, combien d'amis peuvent en avoir ?",
        options: ["6", "5", "7", "4"],
        answer: "6",
        category: "Problèmes",
        difficulty: "Difficile" as const
      },
      {
        id: 30,
        title: "Calcul mental",
        content: "Les calculs rapides complexes",
        question: "Combien font 1000 - 333 ?",
        options: ["667", "666", "668", "665"],
        answer: "667",
        category: "Calcul mental",
        difficulty: "Difficile" as const
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

      <Timer />
    </div>
  );
};

export default MathPage;

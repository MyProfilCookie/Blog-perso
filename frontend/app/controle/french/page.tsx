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

// Interface pour les exercices de français
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

const FrenchPage: React.FC = () => {
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
    frenchExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    frenchExpert: false,
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
        title: "Vocabulaire",
        content: "Les animaux",
        question: "Quel animal miaule ?",
        options: ["Le chat", "Le chien", "L'oiseau", "Le lapin"],
        answer: "Le chat",
        category: "Vocabulaire",
        difficulty: "Facile" as const
      },
      {
        id: 2,
        title: "Vocabulaire",
        content: "Les couleurs",
        question: "Quelle est la couleur du ciel ?",
        options: ["Bleu", "Rouge", "Vert", "Jaune"],
        answer: "Bleu",
        category: "Vocabulaire",
        difficulty: "Facile" as const
      },
      {
        id: 3,
        title: "Vocabulaire",
        content: "Les objets",
        question: "Sur quoi s'assoit-on ?",
        options: ["La chaise", "La table", "Le lit", "L'armoire"],
        answer: "La chaise",
        category: "Vocabulaire",
        difficulty: "Facile" as const
      },
      {
        id: 4,
        title: "Vocabulaire",
        content: "Les aliments",
        question: "Quel fruit est rouge ?",
        options: ["La pomme", "La banane", "L'orange", "Le citron"],
        answer: "La pomme",
        category: "Vocabulaire",
        difficulty: "Facile" as const
      },
      {
        id: 5,
        title: "Vocabulaire",
        content: "Les vêtements",
        question: "Que met-on sur la tête ?",
        options: ["Le chapeau", "Les chaussures", "Le pantalon", "La chemise"],
        answer: "Le chapeau",
        category: "Vocabulaire",
        difficulty: "Facile" as const
      },
      {
        id: 6,
        title: "Vocabulaire",
        content: "Les émotions",
        question: "Quand on est content, on est...",
        options: ["Heureux", "Triste", "En colère", "Fatigué"],
        answer: "Heureux",
        category: "Vocabulaire",
        difficulty: "Facile" as const
      },
      {
        id: 7,
        title: "Vocabulaire",
        content: "Les actions",
        question: "Que fait-on quand on a soif ?",
        options: ["On boit", "On mange", "On dort", "On marche"],
        answer: "On boit",
        category: "Vocabulaire",
        difficulty: "Facile" as const
      },
      {
        id: 8,
        title: "Vocabulaire",
        content: "Les lieux",
        question: "Où va-t-on pour manger ?",
        options: ["La cuisine", "La salle de bain", "Le garage", "Le jardin"],
        answer: "La cuisine",
        category: "Vocabulaire",
        difficulty: "Facile" as const
      },
      {
        id: 9,
        title: "Vocabulaire",
        content: "Les saisons",
        question: "Quelle saison est la plus chaude ?",
        options: ["L'été", "L'hiver", "Le printemps", "L'automne"],
        answer: "L'été",
        category: "Vocabulaire",
        difficulty: "Facile" as const
      },
      {
        id: 10,
        title: "Vocabulaire",
        content: "Les jours",
        question: "Quel jour vient après lundi ?",
        options: ["Mardi", "Mercredi", "Jeudi", "Vendredi"],
        answer: "Mardi",
        category: "Vocabulaire",
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
      frenchExpert: completedExercises >= 10,
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
    console.log(`Progression en français : ${rating}`);
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
                Français
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices de français
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
              <p className="text-gray-600 dark:text-gray-400 text-sm">{ex.content}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FrenchPage;

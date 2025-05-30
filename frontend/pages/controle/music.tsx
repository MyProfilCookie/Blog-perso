/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { useRevision } from "@/app/RevisionContext";
import AIAssistant from "@/components/AIAssistant";
import { MusicQuestion } from "@/components/questions/MusicQuestion";

// Interface pour les exercices de musique
interface Exercise {
  _id: string;
  title: string;
  content: string;
  question: string;
  options?: string[];
  image?: string;
  answer: string;
  difficulty?: string;
  category: string;
}

interface Result {
  isCorrect: boolean;
  answer: string;
}

const MusicPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<Result[]>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [emoji, setEmoji] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [completedExercises, setCompletedExercises] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  const [showTips, setShowTips] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [isFinished, setIsFinished] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 20;
  const correctSound =
    typeof Audio !== "undefined" ? new Audio("/sounds/correct.mp3") : null;
  const [timeSpent, setTimeSpent] = useState(0);
  const [rating, setRating] = useState<number | null>(null);
  const { addError } = useRevision();

  // Statistiques et badges
  const [badges, setBadges] = useState<{
    perfectScore: boolean;
    streakMaster: boolean;
    musicExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    musicExpert: false,
    quickLearner: false,
  });

  // Messages d'encouragement
  const encouragementMessages = [
    "🎵 Tu es un excellent musicien !",
    "🎼 Ta compréhension musicale s'améliore !",
    "🎹 Continue à explorer la musique !",
    "🎸 Tes connaissances musicales sont impressionnantes !",
    "🎺 Tu deviens un expert en musique !",
    "🌟 Tu progresses comme un pro !",
  ];

  const getEmojiForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case "instruments":
        return "🎸";
      case "théorie":
        return "🎼";
      case "histoire":
        return "📚";
      case "compositeurs":
        return "👨‍🎤";
      case "genres":
        return "🎵";
      case "rythme":
        return "🥁";
      case "harmonie":
        return "🎹";
      default:
        return "🎵";
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/music`
        );

        setExercises(response.data.questions || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des exercices");
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Gestion du minuteur et des messages d'encouragement
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let encouragementTimer: NodeJS.Timeout;

    if (timeLeft > 0 && !isFinished) {
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
        setEmoji(`Page ${currentPage} : ${randomMessage}`);
        setTimeout(() => setEmoji(""), 5000);
      }, 900000);
    } else if (timeLeft === 0) {
      setIsFinished(true);
      setShowResults(true);
    }

    return () => {
      clearInterval(timer);
      clearInterval(encouragementTimer);
    };
  }, [timeLeft, isFinished, currentPage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    id: string,
  ) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = (id: string, correctAnswer: string) => {
    const userAnswer = userAnswers[id];
    const isCorrect = userAnswer?.toLowerCase().trim() === correctAnswer.toLowerCase();

    setResults([...results, { isCorrect, answer: correctAnswer }]);
    
    if (isCorrect) {
      correctSound?.play();
      setCompletedExercises(prev => prev + 1);
      setTotalPoints(prev => prev + 10);
      setCurrentStreak(prev => prev + 1);

      // Messages d'encouragement pour les bonnes réponses
      if (currentStreak >= 3) {
        toast.success(`Super ! Tu es en série de ${currentStreak + 1} bonnes réponses ! 🎵`);
      } else if (currentStreak >= 5) {
        toast.success(`Incroyable ! ${currentStreak + 1} bonnes réponses d'affilée ! 🎼`);
      } else {
        toast.success("Bonne réponse ! Continue à explorer la musique ! 🎼");
      }
    } else {
      setCurrentStreak(0);
      // Messages d'encouragement pour les mauvaises réponses
      toast.error("Mauvaise réponse. Essayez encore !");
      const question = exercises.find(q => q._id === id);
      if (question) {
        addError({
          _id: `${id}-${Date.now()}`,
          questionId: id,
          questionText: question.question,
          selectedAnswer: userAnswer,
          correctAnswer: correctAnswer,
          category: "music",
          date: new Date().toISOString(),
          attempts: 1
        });
      }
    }
  };

  const calculateFinalScore = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      if (!userId || !token) {
        console.error("Utilisateur non connecté");
        toast.error("Vous devez être connecté pour sauvegarder votre score");
        return;
      }

      const correctAnswers = results.filter((r: Result) => r.isCorrect).length;
      const scorePercentage = (correctAnswers / exercises.length) * 100;

      // Messages de fin basés sur le score
      if (scorePercentage >= 90) {
        toast.success("Excellent travail ! Tu es un véritable musicien ! 🎵");
      } else if (scorePercentage >= 70) {
        toast.success("Très bon travail ! Ta sensibilité musicale est impressionnante ! 🎼");
      } else if (scorePercentage >= 50) {
        toast.success("Bon travail ! Continue à explorer la musique ! 🎼");
      } else {
        toast.info("Ne te décourage pas ! La musique est un voyage passionnant ! 🎹");
      }

      const pageData = {
        pageNumber: currentPage,
        score: finalScore,
        timeSpent: timeSpent,
        correctAnswers: correctAnswers,
        totalQuestions: exercises.length
      };

      const response = await fetch("/api/eleves/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          subjectName: "music",
          pageData
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde de la note");
      }

      // Rediriger vers le profil de l'élève
      router.push(`/eleve/${userId}`);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue lors de la sauvegarde de ton score");
    }
  };

  const filteredAllExercises =
    selectedCategory === "Tout"
      ? exercises
      : exercises.filter((ex) => ex.category === selectedCategory);

  const totalPages = Math.ceil(filteredAllExercises.length / questionsPerPage);
  const paginatedExercises = filteredAllExercises.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage,
  );

  // Extraction des catégories uniques
  const uniqueCategories = Array.from(
    new Set(exercises.map((ex) => ex.category)),
  );
  const categories = ["Tout", ...uniqueCategories];

  const isAnswerSubmitted = (exerciseId: string) => {
    return results.some((r) => r.answer === exerciseId);
  };

  const isAnswerCorrect = (exerciseId: string) => {
    return results.some((r) => r.answer === exerciseId && r.isCorrect);
  };

  const handleRating = (exerciseId: string, value: number) => {
    setRating(value);
    toast.success(`Merci d'avoir noté cet exercice ! Difficulté : ${value}/5`);
  };

  if (loading) {
    return (
      <motion.div 
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-3xl animate-spin">🔄</div>
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
    <div className="min-h-screen bg-cream p-4 sm:p-6 lg:p-8 dark:bg-background">
      <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <BackButton />
        <Timer timeLeft={timeLeft} />
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-violet-600 dark:text-violet-400">
          Musique {getEmojiForCategory(selectedCategory)}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Exercices interactifs
        </p>
      </motion.div>

          {/* Timer et Progression */}
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div className="w-full sm:w-auto">
              <Timer timeLeft={timeLeft} />
            </div>
            <div className="w-full sm:w-auto flex-1">
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
          </div>

          {/* Filtres et catégories */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <select
              className="w-full sm:w-auto p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Tout">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Liste des exercices */}
          <div className="grid grid-cols-1 gap-6">
            {exercises
              .filter(
                (exercise) =>
                  selectedCategory === "Tout" ||
                  exercise.category === selectedCategory
              )
              .slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage)
              .map((exercise) => (
                <MusicQuestion
                  key={exercise._id}
                  questionId={exercise._id}
                  title={exercise.title}
                  content={exercise.content}
                  question={exercise.question}
                  options={exercise.options}
                  image={exercise.image}
                  answer={exercise.answer}
                  onAnswer={(id, selectedAnswer) => handleSubmit(id, selectedAnswer)}
                  onRating={(id, value) => handleRating(id, value)}
                />
              ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <Button
              size="lg"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto py-3"
            >
              Précédent
            </Button>
            <span className="flex items-center px-4 text-base">
              Page {currentPage} sur {Math.ceil(exercises.length / questionsPerPage)}
            </span>
            <Button
              size="lg"
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(exercises.length / questionsPerPage), prev + 1))}
              disabled={currentPage >= Math.ceil(exercises.length / questionsPerPage)}
              className="w-full sm:w-auto py-3"
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
  );
};

export default MusicPage;
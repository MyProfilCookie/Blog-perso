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
import { ScienceQuestion } from "@/components/questions/ScienceQuestion";

// Interface pour les exercices de sciences
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

const SciencesPage: React.FC = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    scienceExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    scienceExpert: false,
    quickLearner: false,
  });

  // Messages d'encouragement
  const encouragementMessages = [
    "🧪 Tu es un vrai scientifique !",
    "Excellent esprit d'observation !",
    "🧬 Continue d'explorer la science !",
    "⚗️ Tes connaissances scientifiques s'améliorent !",
    "🔍 Tu deviens un expert en sciences !",
    "🧪 Tu progresses comme un pro !",
  ];

  const getEmojiForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case "physique":
        return "⚛️";
      case "chimie":
        return "🧪";
      case "biologie":
        return "🧬";
      case "astronomie":
        return "🌌";
      case "géologie":
        return "🌋";
      case "écologie":
        return "🌱";
      case "expérimentation":
        return "🔬";
      default:
        return "🧪";
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/sciences`,
        );

        setExercises(response.data.questions);
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

      // Messages d'encouragement toutes les 15 minutes
      encouragementTimer = setInterval(() => {
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        setEmoji(`Page ${currentPage} : ${randomMessage}`);
        setTimeout(() => setEmoji(""), 5000); // Le message disparaît après 5 secondes
      }, 900000); // 900000ms = 15 minutes
    } else if (timeLeft === 0) {
      setIsFinished(true);
      calculateFinalScore();
    }

    return () => {
      clearInterval(timer);
      clearInterval(encouragementTimer);
    };
  }, [timeLeft, isFinished, currentPage]);

  // Fonction pour formater le temps restant
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    id: string,
  ) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = (id: string, correctAnswer: string) => {
    const userAnswer = userAnswers[id];
    const isCorrect = userAnswer?.toLowerCase().trim() === correctAnswer.toLowerCase();
    const exerciseIndex = exercises.findIndex(ex => ex._id === id);
    
    if (exerciseIndex !== -1) {
      const newResults = [...results];
      newResults[exerciseIndex] = { isCorrect, answer: userAnswer || '' };
      setResults(newResults);
      
      if (isCorrect) {
        correctSound?.play();
        setCompletedExercises(prev => prev + 1);
        setTotalPoints(prev => prev + 10);
        setCurrentStreak(prev => prev + 1);

        // Messages d'encouragement pour les bonnes réponses
        if (currentStreak >= 3) {
          toast.success(`Super ! Tu es en série de ${currentStreak + 1} bonnes réponses ! 🧪`);
        } else if (currentStreak >= 5) {
          toast.success(`Incroyable ! ${currentStreak + 1} bonnes réponses d'affilée ! 🔬`);
        } else {
          toast.success("Bonne réponse ! Continue à explorer les sciences ! ⚗️");
        }
      } else {
        setCurrentStreak(0);
        // Messages d'encouragement pour les mauvaises réponses
        toast.error("Ce n'est pas la bonne réponse, mais la science est faite d'expérimentation ! Essaie encore ! 🧬");
        const question = exercises.find(q => q._id === id);
        if (question) {
          addError({
            _id: `${id}-${Date.now()}`,
            questionId: id,
            questionText: question.question,
            selectedAnswer: userAnswer || '',
            correctAnswer: question.answer,
            category: "sciences",
            date: new Date().toISOString(),
            attempts: 1
          });
        }
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
        toast.success("Excellent travail ! Tu es un véritable scientifique ! 🧪");
      } else if (scorePercentage >= 70) {
        toast.success("Très bon travail ! Ton esprit scientifique est impressionnant ! 🔬");
      } else if (scorePercentage >= 50) {
        toast.success("Bon travail ! Continue à explorer les sciences ! ⚗️");
      } else {
        toast.info("Ne te décourage pas ! La science est un voyage passionnant ! 🧬");
      }

      const pageData = {
        pageNumber: currentPage,
        score: finalScore,
        timeSpent: timeSpent,
        correctAnswers: correctAnswers,
        totalQuestions: exercises.length
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/scores`,
        {
          userId,
          token,
          pageId: "sciences",
          score: finalScore,
          timeSpent,
          correctAnswers: results.filter((r: Result) => r.isCorrect).length,
          totalQuestions: exercises.length
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status !== 200) {
        throw new Error("Erreur lors de la sauvegarde de la note");
      }

      // Rediriger vers le profil de l'élève
      router.push(`/eleve/${userId}`);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue lors de la sauvegarde de ton score");
    }
  };

  const isAnswerSubmitted = (exerciseId: string) => {
    const exerciseIndex = exercises.findIndex(ex => ex._id === exerciseId);
    return exerciseIndex !== -1 && results[exerciseIndex] !== undefined;
  };

  const isAnswerCorrect = (exerciseId: string) => {
    const exerciseIndex = exercises.findIndex(ex => ex._id === exerciseId);
    return exerciseIndex !== -1 && results[exerciseIndex]?.isCorrect;
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
    <div className="min-h-screen bg-cream p-4 dark:bg-background">
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
            Sciences {getEmojiForCategory(selectedCategory)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Exercices interactifs
          </p>
        </motion.div>

        <AIAssistant />

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

        {/* Message d'encouragement */}
        {emoji && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-lg font-medium text-primary mb-4"
          >
            {emoji}
          </motion.div>
        )}

        {/* Filtres et catégories */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            className="w-full sm:w-auto p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
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
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {exercises
              .filter(
                (exercise) =>
                  selectedCategory === "Tout" ||
                  exercise.category === selectedCategory
              )
              .slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage)
              .map((exercise) => (
                <ScienceQuestion
                  key={exercise._id}
                  questionId={exercise._id}
                  title={exercise.title}
                  content={exercise.content}
                  question={exercise.question}
                  options={exercise.options}
                  image={exercise.image}
                  answer={exercise.answer}
                  onAnswer={(id, answer) => handleSubmit(id, answer)}
                  onRating={(id, value) => handleRating(id, value)}
                />
              ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-auto"
          >
            Précédent
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage} sur {Math.ceil(exercises.length / questionsPerPage)}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(exercises.length / questionsPerPage), prev + 1))}
            disabled={currentPage >= Math.ceil(exercises.length / questionsPerPage)}
            className="w-auto"
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SciencesPage;

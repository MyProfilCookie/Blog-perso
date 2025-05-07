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

// Interface pour les exercices d'histoire
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

const HistoryPage: React.FC = () => {
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

  // Statistiques et badges
  const [badges, setBadges] = useState<{
    perfectScore: boolean;
    streakMaster: boolean;
    historyExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    historyExpert: false,
    quickLearner: false,
  });

  // Messages d'encouragement
  const encouragementMessages = [
    "📜 Tu es un excellent historien !",
    "🏛️ Ta connaissance de l'histoire s'améliore !",
    "⚔️ Continue d'explorer le passé !",
    "👑 Tes compétences historiques sont impressionnantes !",
    "🎯 Tu deviens un expert en histoire !",
    "📚 Tu progresses comme un pro !",
  ];

  const getEmojiForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case "antiquité":
        return "🏺";
      case "moyen âge":
        return "⚔️";
      case "renaissance":
        return "🎨";
      case "révolution":
        return "⚡";
      case "contemporaine":
        return "🏛️";
      case "personnages":
        return "👑";
      case "événements":
        return "📜";
      default:
        return "📚";
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/history`
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
        toast.success(`Super ! Tu es en série de ${currentStreak + 1} bonnes réponses ! 📜`);
      } else if (currentStreak >= 5) {
        toast.success(`Incroyable ! ${currentStreak + 1} bonnes réponses d'affilée ! 👑`);
      } else {
        toast.success("Bonne réponse ! Continue à explorer l'histoire ! 🏛️");
      }
    } else {
      setCurrentStreak(0);
      // Messages d'encouragement pour les mauvaises réponses
      toast.error("Ce n'est pas la bonne réponse, mais l'histoire est faite d'apprentissages ! Essaie encore ! ⚔️");
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
        toast.success("Excellent travail ! Tu es un véritable historien ! 📜");
      } else if (scorePercentage >= 70) {
        toast.success("Très bon travail ! Ta connaissance de l'histoire est impressionnante ! 🏛️");
      } else if (scorePercentage >= 50) {
        toast.success("Bon travail ! Continue à découvrir notre passé ! 👑");
      } else {
        toast.info("Ne te décourage pas ! L'histoire est un voyage passionnant ! ⚔️");
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
          subjectName: "history",
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
          Histoire {getEmojiForCategory(selectedCategory)}
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
                <Card
                  key={exercise._id}
                  className="w-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardBody className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      {/* Titre et catégorie */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {exercise.title}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {exercise.category}
                        </span>
                      </div>

                      {/* Contenu et question */}
                      <div className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300">{exercise.content}</p>
                        <p className="font-medium">{exercise.question}</p>
                      </div>

                      {/* Options ou champ de réponse */}
                      <div className="space-y-4">
                        {exercise.options ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {exercise.options.map((option, index) => (
                              <label
                                key={index}
                                className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={exercise._id}
                                  value={option}
                                  onChange={(e) => handleChange(e, exercise._id)}
                                  disabled={isAnswerSubmitted(exercise._id)}
                                  className="form-radio h-5 w-5"
                                />
                                <span className="text-base">{option}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="Votre réponse"
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-base"
                            onChange={(e) => handleChange(e, exercise._id)}
                            disabled={isAnswerSubmitted(exercise._id)}
                          />
                        )}
                      </div>

                      {/* Bouton de soumission et résultat */}
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <Button
                          size="lg"
                          color={isAnswerSubmitted(exercise._id) ? (isAnswerCorrect(exercise._id) ? "success" : "danger") : "primary"}
                          onClick={() => handleSubmit(exercise._id, exercise.answer)}
                          disabled={!userAnswers[exercise._id] || isAnswerSubmitted(exercise._id)}
                          className="w-full sm:w-auto py-3 px-6"
                        >
                          {isAnswerSubmitted(exercise._id) ? (isAnswerCorrect(exercise._id) ? "Correct ✓" : "Incorrect ✗") : "Valider"}
                        </Button>

                        {isAnswerSubmitted(exercise._id) && (
                          <div className="flex flex-wrap sm:flex-nowrap gap-2">
                            <Button
                              size="lg"
                              color="default"
                              variant="flat"
                              onClick={() => handleRating(exercise._id, 1)}
                              className="w-full sm:w-auto py-3"
                            >
                              1
                            </Button>
                            <Button
                              size="lg"
                              color="default"
                              variant="flat"
                              onClick={() => handleRating(exercise._id, 2)}
                              className="w-full sm:w-auto py-3"
                            >
                              2
                            </Button>
                            <Button
                              size="lg"
                              color="default"
                              variant="flat"
                              onClick={() => handleRating(exercise._id, 3)}
                              className="w-full sm:w-auto py-3"
                            >
                              3
                            </Button>
                            <Button
                              size="lg"
                              color="default"
                              variant="flat"
                              onClick={() => handleRating(exercise._id, 4)}
                              className="w-full sm:w-auto py-3"
                            >
                              4
                            </Button>
                            <Button
                              size="lg"
                              color="default"
                              variant="flat"
                              onClick={() => handleRating(exercise._id, 5)}
                              className="w-full sm:w-auto py-3"
                            >
                              5
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
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

export default HistoryPage;

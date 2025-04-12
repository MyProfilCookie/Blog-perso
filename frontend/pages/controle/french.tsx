"use client";
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import { ProgressBar } from "@/components/progress/ProgressBar";

// Interface pour les exercices de français
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

const FrenchPage: React.FC = () => {
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

  // Messages d'encouragement
  const encouragementMessages = [
    "📚 Tu es un excellent lecteur !",
    "✍️ Ta maîtrise de la langue est impressionnante !",
    "📝 Continue d'enrichir ton vocabulaire !",
    "🎯 Tes connaissances grammaticales s'améliorent !",
    "📖 Tu deviens un expert en français !",
    "💫 Tu progresses comme un pro !",
  ];

  const getEmojiForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case "grammaire":
        return "📝";
      case "conjugaison":
        return "📚";
      case "orthographe":
        return "✍️";
      case "vocabulaire":
        return "📖";
      case "lecture":
        return "📚";
      case "expression":
        return "💭";
      case "analyse":
        return "🔍";
      default:
        return "📚";
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/french`
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
    } else {
      setCurrentStreak(0);
    }
  };

  const calculateFinalScore = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      if (!userId || !token) {
        console.error("Utilisateur non connecté");

        return;
      }

      const pageData = {
        pageNumber: currentPage,
        score: finalScore,
        timeSpent: timeSpent,
        correctAnswers: results.filter((r: Result) => r.isCorrect).length,
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
          subjectName: "french",
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
    <div className="p-4 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
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
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          Français 📚
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Exercices interactifs
        </p>
      </motion.div>

      <ProgressBar
        correctAnswers={completedExercises}
        totalQuestions={exercises.length}
        onProgressComplete={() => {
          if (completedExercises === exercises.length) {
            calculateFinalScore();
          }
        }}
      />

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <select
          className="w-full sm:w-80 p-4 text-lg font-semibold rounded-2xl border border-blue-400 bg-blue-50 dark:bg-gray-900 shadow-md focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </motion.div>

      <div className="flex justify-center my-4 gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-full font-semibold transition-transform transform border shadow-sm hover:scale-105 hover:bg-blue-200 ${
              currentPage === idx + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            }`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {emoji && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-5 text-lg rounded-xl shadow-xl border-2 border-blue-300 z-50 font-semibold text-blue-600 dark:text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-lg">{emoji}</p>
        </motion.div>
      )}

      {exercises.length === 0 && (
        <div className="text-center text-red-500 font-semibold mb-6">
          Aucune question n'est disponible pour le moment. Veuillez réessayer plus tard.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {paginatedExercises.map((ex, idx) => (
          <motion.div
            key={ex._id}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="w-full border border-blue-200">
              <CardBody className="p-4">
                <h3 className="font-bold mb-3 text-lg sm:text-xl text-blue-700 dark:text-blue-300">
                  {getEmojiForCategory(ex.category)} {ex.title}
                </h3>
                <p className="mb-2">{ex.content}</p>
                <p className="mb-4">{ex.question}</p>
                {ex.image && (
                  <div className="mb-4">
                    <Image
                      alt={ex.title}
                      className="rounded-lg object-cover w-full h-48"
                      height={200}
                      src={`/assets/french/${ex.image}`}
                      width={300}
                    />
                  </div>
                )}
                {ex.options ? (
                  <select
                    className="w-full mb-2 p-4 text-base rounded-xl border border-blue-300 dark:bg-gray-700 font-medium shadow-md focus:ring-2 focus:ring-blue-400"
                    disabled={isAnswerSubmitted(ex._id)}
                    value={userAnswers[ex._id] || ""}
                    onChange={(e) => handleChange(e, ex._id)}
                  >
                    <option value="">Sélectionner une réponse</option>
                    {ex.options.map((option, optIdx) => (
                      <option key={optIdx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="w-full mb-2"
                    disabled={isAnswerSubmitted(ex._id)}
                    type="text"
                    value={userAnswers[ex._id] || ""}
                    onChange={(e) => handleChange(e, ex._id)}
                  />
                )}
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-2 rounded-xl hover:brightness-110 transition"
                  disabled={isAnswerSubmitted(ex._id)}
                  onClick={() => handleSubmit(ex._id, ex.answer)}
                >
                  Soumettre
                </Button>
                {isAnswerSubmitted(ex._id) && (
                  <p
                    className={`mt-3 text-center font-semibold text-lg ${
                      isAnswerCorrect(ex._id) ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isAnswerCorrect(ex._id) ? "Bonne réponse !" : "Mauvaise réponse"}
                  </p>
                )}
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {showResults && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          initial={{ opacity: 0, y: 20 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-violet-600 dark:text-violet-400 mb-4">
              Résultats {emoji}
            </h2>
            <p className="text-center text-xl mb-6">
              Score final : {finalScore?.toFixed(1)}%
            </p>
            <div className="space-y-4">
              {badges.perfectScore && (
                <div className="flex items-center gap-2 text-yellow-500">
                  <span>🌟</span>
                  <p>Score parfait !</p>
                </div>
              )}
              {badges.streakMaster && (
                <div className="flex items-center gap-2 text-orange-500">
                  <span>🔥</span>
                  <p>Maître des séries !</p>
                </div>
              )}
              {badges.frenchExpert && (
                <div className="flex items-center gap-2 text-blue-500">
                  <span>📚</span>
                  <p>Expert en français !</p>
                </div>
              )}
              {badges.quickLearner && (
                <div className="flex items-center gap-2 text-green-500">
                  <span>⚡</span>
                  <p>Apprenant rapide !</p>
                </div>
              )}
            </div>
            <Button
              className="w-full mt-6 bg-violet-500 text-white hover:bg-violet-600"
              onClick={() => setShowResults(false)}
            >
              Fermer
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FrenchPage;
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import { ProgressBar } from "@/components/progress/ProgressBar";

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
  exerciseId: string;
}

const TechnologyPage: React.FC = () => {
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
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isFinished, setIsFinished] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 20;
  const correctSound =
    typeof Audio !== "undefined" ? new Audio("/sounds/correct.mp3") : null;
  const [timeSpent, setTimeSpent] = useState(0);
  const [rating, setRating] = useState<number | null>(null);

  const encouragementMessages = [
    "💻 Tu es un vrai geek !",
    "🔧 Excellent esprit technique !",
    "🌐 Continue d'explorer la technologie !",
    "⚡ Tes connaissances techniques s'améliorent !",
    "🤖 Tu deviens un expert en tech !",
    "🚀 Tu progresses comme un pro !",
  ];

  const getEmojiForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case "hardware":
        return "💻";
      case "software":
        return "🧠";
      case "internet":
        return "🌐";
      case "mobile":
        return "📱";
      case "sécurité":
      case "securité":
        return "🔒";
      case "programming":
        return "🖥️";
      case "innovation":
        return "🚀";
      default:
        return "🔧";
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/technology`,
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let encouragementTimer: NodeJS.Timeout;

    if (timeLeft > 0 && !isFinished) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);

      encouragementTimer = setInterval(() => {
        const randomMessage =
          encouragementMessages[
            Math.floor(Math.random() * encouragementMessages.length)
          ];

        setEmoji(`Page ${currentPage} : ${randomMessage}`);
        setTimeout(() => setEmoji(""), 5000);
      }, 900000);
    } else if (timeLeft === 0) {
      setIsFinished(true);
      calculateFinalScore();
    }

    return () => {
      clearInterval(timer);
      clearInterval(encouragementTimer);
    };
  }, [timeLeft, isFinished, currentPage]);

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
    const isCorrect =
      userAnswer?.toLowerCase().trim() === correctAnswer.toLowerCase();

    setResults([...results, { isCorrect, exerciseId: id }]);
    if (isCorrect) {
      correctSound?.play();
      setCompletedExercises((prev) => prev + 1);
      setTotalPoints((prev) => prev + 10);
      setCurrentStreak((prev) => prev + 1);
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
          subjectName: "technology",
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

  const uniqueCategories = Array.from(
    new Set(exercises.map((ex) => ex.category)),
  );
  const categories = ["Tout", ...uniqueCategories];

  const isAnswerSubmitted = (exerciseId: string) => {
    return results.some((r) => r.exerciseId === exerciseId);
  };

  const isAnswerCorrect = (exerciseId: string) => {
    return results.some((r) => r.exerciseId === exerciseId && r.isCorrect);
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
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="p-4 bg-gradient-to-br from-white to-violet-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
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
          Technologie {getEmojiForCategory(selectedCategory)}
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
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <select
          className="w-full sm:w-80 p-4 text-lg font-semibold rounded-2xl border border-violet-400 bg-violet-50 dark:bg-gray-900 shadow-md focus:ring-2 focus:ring-violet-500"
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
            className={`px-4 py-2 rounded-full font-semibold transition-transform transform border shadow-sm hover:scale-105 hover:bg-violet-200 ${
              currentPage === idx + 1
                ? "bg-violet-500 text-white"
                : "bg-white text-violet-500"
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
          className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-5 text-lg rounded-xl shadow-xl border-2 border-violet-300 z-50 font-semibold text-violet-600 dark:text-violet-400"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-lg">{emoji}</p>
        </motion.div>
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
            <Card className="w-full border border-violet-200">
              <CardBody className="p-4">
                <h3 className="font-bold mb-3 text-lg sm:text-xl text-violet-700 dark:text-violet-300">
                  {getEmojiForCategory(ex.category)} {ex.title}
                </h3>
                <p className="mb-2">{ex.content}</p>
                <p className="mb-4">{ex.question}</p>
                {ex.options ? (
                  <select
                    className="w-full mb-2 p-4 text-base rounded-xl border border-violet-300 dark:bg-gray-700 font-medium shadow-md focus:ring-2 focus:ring-violet-400"
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
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-2 rounded-xl hover:brightness-110 transition"
                  disabled={isAnswerSubmitted(ex._id)}
                  onClick={() => handleSubmit(ex._id, ex.answer)}
                >
                  Soumettre
                </Button>
                {isAnswerSubmitted(ex._id) && (
                  <>
                    <p
                      className={`mt-3 text-center font-semibold text-lg ${
                        isAnswerCorrect(ex._id) ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {isAnswerCorrect(ex._id) ? "Bonne réponse !" : "Mauvaise réponse"}
                    </p>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Noter la difficulté de cet exercice :</p>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Button
                            key={value}
                            size="lg"
                            color="default"
                            variant="flat"
                            onClick={() => handleRating(ex._id, value)}
                            className="w-full h-12 sm:h-10 flex items-center justify-center text-lg"
                          >
                            {value}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TechnologyPage;

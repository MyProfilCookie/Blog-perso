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

const TechnologyPage: React.FC = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<{ [key: string]: boolean }>({});
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
  const correctSound = typeof Audio !== "undefined" ? new Audio("/sounds/correct.mp3") : null;

  const encouragementMessages = [
    "💻 Tu es un vrai geek !",
    "🔧 Excellent esprit technique !",
    "🌐 Continue d'explorer la technologie !",
    "⚡ Tes connaissances techniques s'améliorent !",
    "🤖 Tu deviens un expert en tech !",
    "🚀 Tu progresses comme un pro !"
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subjects/technology`);
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
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: string) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = (id: string, correctAnswer: string) => {
    const userAnswer = userAnswers[id];
    const isCorrect = userAnswer?.toLowerCase().trim() === correctAnswer.toLowerCase();
    setResults({ ...results, [id]: isCorrect });
    if (isCorrect) {
      correctSound?.play();
      setCompletedExercises((prev) => prev + 1);
      setTotalPoints((prev) => prev + 10);
      setCurrentStreak((prev) => prev + 1);
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
  };

  const filteredAllExercises = selectedCategory === "Tout"
    ? exercises
    : exercises.filter((ex) => ex.category === selectedCategory);

  const totalPages = Math.ceil(filteredAllExercises.length / questionsPerPage);
  const paginatedExercises = filteredAllExercises.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const uniqueCategories = Array.from(new Set(exercises.map((ex) => ex.category)));
  const categories = ["Tout", ...uniqueCategories];

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <BackButton />
        <Timer timeLeft={timeLeft} />
      </div>

      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-violet-600 dark:text-violet-400">
          Technologie 🔧
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Exercices interactifs</p>
      </motion.div>

      <ProgressBar
        totalQuestions={exercises.length}
        correctAnswers={completedExercises}
        onProgressComplete={() => {
          if (completedExercises === exercises.length) {
            calculateFinalScore();
          }
        }}
      />

      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <div className="flex justify-center my-4 gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded-md border ${
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
          className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-violet-200 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg">{emoji}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {paginatedExercises.map((ex, idx) => (
          <motion.div
            key={ex._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="w-full border border-violet-200">
              <CardBody className="p-4">
                <h3 className="font-bold mb-2">
                  {getEmojiForCategory(ex.category)} {ex.title}
                </h3>
                <p className="mb-2">{ex.content}</p>
                <p className="mb-4">{ex.question}</p>
                {ex.options ? (
                  <select
                    className="w-full mb-2 p-3 text-base rounded-lg border border-violet-300 dark:bg-gray-700"
                    disabled={results[ex._id] !== undefined}
                    value={userAnswers[ex._id] || ""}
                    onChange={(e) => handleChange(e, ex._id)}
                  >
                    <option value="">Sélectionner une réponse</option>
                    {ex.options.map((option, optIdx) => (
                      <option key={optIdx} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="w-full mb-2"
                    type="text"
                    value={userAnswers[ex._id] || ""}
                    onChange={(e) => handleChange(e, ex._id)}
                    disabled={results[ex._id] !== undefined}
                  />
                )}
                <Button
                  onClick={() => handleSubmit(ex._id, ex.answer)}
                  disabled={results[ex._id] !== undefined}
                  className="w-full bg-violet-500 text-white"
                >
                  Soumettre
                </Button>
                {results[ex._id] !== undefined && (
                  <p className={`mt-2 text-center ${results[ex._id] ? "text-green-500" : "text-red-500"}`}>
                    {results[ex._id] ? "Bonne réponse !" : "Mauvaise réponse"}
                  </p>
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
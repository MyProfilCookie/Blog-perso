import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useRevision } from "@/app/RevisionContext";
import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import { ProgressBar } from "@/components/progress/ProgressBar";
import AIAssistant from "@/components/AIAssistant";
import { GeographyQuestion } from "@/components/questions/GeographyQuestion";

interface Exercise {
  _id: string;
  title: string;
  content: string;
  question: string;
  options: string[];
  image?: string;
  answer: string;
  difficulty: string;
  category: string;
}

const GeographiePage: React.FC = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Array<{ isCorrect: boolean; answer: string }>>([]);
  const [correctSound] = useState(new Audio('/sounds/correct.mp3'));
  const [completedExercises, setCompletedExercises] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 20;
  const [emoji, setEmoji] = useState<string>("");
  const { addError, addAttempt, canAttempt } = useRevision();

  // Messages d'encouragement
  const encouragementMessages = [
    "🌍 Tu es un excellent géographe !",
    "🗺️ Ta connaissance du monde s'améliore !",
    "🏔️ Continue à explorer la géographie !",
    "🌎 Tes compétences géographiques sont impressionnantes !",
    "🎯 Tu deviens un expert en géographie !",
    "🌟 Tu progresses comme un pro !",
  ];

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions?category=geography`);
        if (response.ok) {
          const data = await response.json();
          setExercises(data.questions);
        } else {
          toast.error("Erreur lors du chargement des exercices");
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des exercices");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Gestion du minuteur et des messages d'encouragement
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let encouragementTimer: NodeJS.Timeout;

    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      encouragementTimer = setInterval(() => {
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        setEmoji(`Page ${currentPage} : ${randomMessage}`);
        setTimeout(() => setEmoji(""), 5000);
      }, 900000); // 15 minutes
    }

    return () => {
      clearInterval(timer);
      clearInterval(encouragementTimer);
    };
  }, [timeLeft, currentPage]);

  const handleSubmit = (id: string, correctAnswer: string) => {
    if (!canAttempt(id)) {
      toast.error("Tu as déjà utilisé tes deux tentatives pour cette question ! 🌍");
      return;
    }

    const userAnswer = userAnswers[id];
    const isCorrect = userAnswer?.toLowerCase().trim() === correctAnswer.toLowerCase();
    const exerciseIndex = exercises.findIndex((ex: Exercise) => ex._id === id);
    
    if (exerciseIndex !== -1) {
      const newResults = [...results];
      newResults[exerciseIndex] = { isCorrect, answer: userAnswer || '' };
      setResults(newResults);
      
      if (isCorrect) {
        correctSound?.play();
        setCompletedExercises((prev: number) => prev + 1);
        setTotalPoints((prev: number) => prev + 10);
        setCurrentStreak((prev: number) => prev + 1);

        // Messages d'encouragement pour les bonnes réponses
        if (currentStreak >= 3) {
          toast.success(`Excellent ! Tu es en série de ${currentStreak + 1} bonnes réponses ! 🌍`);
        } else if (currentStreak >= 5) {
          toast.success(`Impressionnant ! ${currentStreak + 1} bonnes réponses d'affilée ! 🗺️`);
        } else {
          toast.success("Bonne réponse ! Continue à explorer la géographie ! 🌎");
        }
      } else {
        setCurrentStreak(0);
        // Messages d'encouragement pour les mauvaises réponses
        toast.error("Ce n'est pas la bonne réponse, mais la géographie s'apprend en explorant ! Essaie encore ! 🏔️");
        const question = exercises.find((q: Exercise) => q._id === id);
        if (question) {
          addError({
            _id: `${id}-${Date.now()}`,
            questionId: id,
            questionText: question.question,
            selectedAnswer: userAnswer,
            correctAnswer: correctAnswer,
            category: "geographie",
            date: new Date().toISOString(),
            attempts: 1
          });
        }
      }
      addAttempt(id);
    }
  };

  const handleRating = (questionId: string, value: number) => {
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

  if (exercises.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md">
          <CardBody>
            <p className="text-center">Aucune question disponible pour le moment.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const filteredExercises = selectedCategory === "Tout"
    ? exercises
    : exercises.filter(q => q.category === selectedCategory);

  const totalPages = Math.ceil(filteredExercises.length / questionsPerPage);
  const paginatedExercises = filteredExercises.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const categories = ["Tout", ...Array.from(new Set(exercises.map(q => q.category)))];

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
            Géographie
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
                  toast.success("Félicitations ! Vous avez terminé tous les exercices !");
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
            className="w-full sm:w-auto p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Liste des questions */}
        <div className="grid grid-cols-1 gap-6">
          {paginatedExercises.map((question) => (
            <GeographyQuestion
              key={question._id}
              questionId={question._id}
              title={question.title}
              content={question.content}
              question={question.question}
              options={question.options}
              image={question.image}
              answer={question.answer}
              onAnswer={handleSubmit}
              onRating={handleRating}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <Button
            className="w-full sm:w-auto py-3"
            disabled={currentPage === 1}
            size="lg"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Précédent
          </Button>
          <span className="flex items-center px-4 text-base">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            className="w-full sm:w-auto py-3"
            disabled={currentPage >= totalPages}
            size="lg"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeographiePage; 
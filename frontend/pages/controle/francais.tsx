"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useRevision } from "@/app/RevisionContext";
import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import { ProgressBar } from "@/components/progress/ProgressBar";
import AIAssistant from "@/components/AIAssistant";
import { FrenchQuestion } from "@/components/questions/FrenchQuestion";

interface Question {
  _id: string;
  title: string;
  content: string;
  question: string;
  options?: string[];
  image?: string;
  answer: string;
  category: string;
}

const FrancaisPage: React.FC = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 20;
  const [emoji, setEmoji] = useState<string>("");
  const { addError } = useRevision();

  // Messages d'encouragement
  const encouragementMessages = [
    "📚 Tu es un excellent francophone !",
    "🎯 Ta maîtrise du français s'améliore !",
    "✍️ Continue à perfectionner ton français !",
    "📝 Tes compétences linguistiques sont impressionnantes !",
    "🎨 Tu deviens un expert en français !",
    "🌟 Tu progresses comme un pro !",
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions?category=french`);
        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions);
        } else {
          toast.error("Erreur lors du chargement des questions");
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
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

  const handleAnswer = (questionId: string, selectedAnswer: string, isCorrect: boolean) => {
    if (isCorrect) {
      toast.success("Bonne réponse !");
      setCompletedQuestions(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);

      if (currentStreak >= 3) {
        toast.success(`Super ! Tu es en série de ${currentStreak + 1} bonnes réponses ! 📚`);
      } else if (currentStreak >= 5) {
        toast.success(`Incroyable ! ${currentStreak + 1} bonnes réponses d'affilée ! ✍️`);
      }
    } else {
      toast.error("Mauvaise réponse. Essayez encore !");
      setCurrentStreak(0);
      const question = questions.find(q => q._id === questionId);
      if (question) {
        addError({
          _id: `${questionId}-${Date.now()}`,
          questionId,
          questionText: question.question,
          selectedAnswer,
          correctAnswer: question.answer,
          category: "french",
          date: new Date().toISOString(),
          attempts: 1
        });
      }
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

  if (questions.length === 0) {
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

  const filteredQuestions = selectedCategory === "Tout"
    ? questions
    : questions.filter(q => q.category === selectedCategory);

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const categories = ["Tout", ...Array.from(new Set(questions.map(q => q.category)))];

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
            Français
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
              totalQuestions={questions.length}
              correctAnswers={completedQuestions}
              onProgressComplete={() => {
                if (completedQuestions === questions.length) {
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
          {paginatedQuestions.map((question) => (
            <FrenchQuestion
              key={question._id}
              questionId={question._id}
              title={question.title}
              content={question.content}
              question={question.question}
              options={question.options}
              image={question.image}
              answer={question.answer}
              onAnswer={handleAnswer}
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

export default FrancaisPage; 
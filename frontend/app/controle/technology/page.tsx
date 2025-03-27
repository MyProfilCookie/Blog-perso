/* eslint-disable react/jsx-sort-props */
/* eslint-disable no-console */
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
import { useRouter } from "next/navigation";

// Interface pour les exercices de technologie
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

const TechnologyPage: React.FC = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [finalScore, setFinalScore] = useState<number>(0);
  const [emoji, setEmoji] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [completedExercises, setCompletedExercises] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  const [showTips, setShowTips] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  // Messages d'encouragement
  const encouragementMessages = [
    "💻 Tu es un vrai geek !",
    "🔧 Excellent esprit technique !",
    "🌐 Continue d'explorer la technologie !",
    "⚡ Tes connaissances techniques s'améliorent !",
    "🤖 Tu deviens un expert en tech !",
    "🚀 Tu progresses comme un pro !"
  ];

  // Données statiques pour les exercices de technologie
  const mockExercises: Exercise[] = [
    {
      id: 1,
      title: "Informatique",
      content: "Les composants d'un ordinateur",
      question: "Quel composant est le 'cerveau' de l'ordinateur ?",
      options: ["Le processeur", "La carte mère", "La mémoire RAM", "Le disque dur"],
      answer: "Le processeur",
      difficulty: "Facile",
      category: "Hardware"
    },
    // Ajoutez plus d'exercices ici...
  ];

  useEffect(() => {
    setExercises(mockExercises);
    setLoading(false);
  }, []);

  const handleAnswer = (answer: string) => {
    if (!exercises.length) return;
    
    setUserAnswers({ ...userAnswers, [currentExercise]: answer });
    if (answer === exercises[currentExercise].answer) {
      setResults({ ...results, [currentExercise]: true });
      setFinalScore(prev => prev + 1);
    } else {
      setResults({ ...results, [currentExercise]: false });
    }
    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  const calculatePercentage = () => {
    return Math.round((finalScore / exercises.length) * 100);
  };

  const getFeedback = () => {
    const percentage = calculatePercentage();
    if (percentage >= 80) return "🌟 Excellent ! Tu es un expert en technologie !";
    if (percentage >= 60) return "💻 Très bien ! Continue comme ça !";
    if (percentage >= 40) return "🔧 Pas mal ! Tu peux encore progresser !";
    return "⚡ Continue d'apprendre, tu vas y arriver !";
  };

  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Résultats</h2>
          <p className="text-xl mb-2">
            Score : {finalScore} sur {exercises.length}
          </p>
          <p className="text-xl mb-4">{getFeedback()}</p>
          <Button
            color="primary"
            onClick={() => router.push("/controle")}
            className="mt-4"
          >
            Retour au menu
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex-1 w-full max-w-7xl mx-auto">
        <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6 relative">
            <div className="absolute top-0 left-0 z-10">
              <BackButton />
            </div>
            <motion.div 
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 sm:mb-6"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                Technologie
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices de technologie
              </p>
            </motion.div>
            <div className="flex justify-end items-center mb-4">
              <Timer timeLeft={timeLeft} />
            </div>
          </div>
        </section>
      </div>

      <motion.div
        key={currentExercise}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex-1 flex flex-col items-center justify-center"
      >
        <Card className="w-full max-w-2xl">
          <CardBody className="text-center">
            <h2 className="text-xl font-bold mb-4">
              Question {currentExercise + 1} sur {exercises.length}
            </h2>
            <p className="text-lg mb-6">{exercises[currentExercise].question}</p>
            <div className="grid grid-cols-2 gap-4">
              {exercises[currentExercise].options?.map((option, index) => (
                <Button
                  key={index}
                  color={
                    userAnswers[currentExercise] === option
                      ? results[currentExercise]
                        ? "success"
                        : "danger"
                      : "primary"
                  }
                  onClick={() => handleAnswer(option)}
                  isDisabled={userAnswers[currentExercise] !== undefined}
                  className="h-12"
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default TechnologyPage;
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

// Interface pour les exercices d'art
interface Exercise {
  id: number;
  question: string;
  options: string[];
  answer: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  category: string;
}

const exercises: Exercise[] = [
  {
    id: 1,
    question: "Quelle est la couleur du soleil ?",
    options: ["Rouge", "Bleu", "Jaune", "Vert"],
    answer: "Jaune",
    difficulty: "Facile",
    category: "Couleurs"
  },
  {
    id: 2,
    question: "Quelle est la forme d'un cercle ?",
    options: ["Carrée", "Ronde", "Triangle", "Rectangle"],
    answer: "Ronde",
    difficulty: "Facile",
    category: "Formes"
  },
  {
    id: 3,
    question: "Quelle est la couleur de l'herbe ?",
    options: ["Rouge", "Bleue", "Verte", "Jaune"],
    answer: "Verte",
    difficulty: "Facile",
    category: "Couleurs"
  },
  {
    id: 4,
    question: "Quelle est la forme d'un carré ?",
    options: ["Ronde", "Carrée", "Triangle", "Rectangle"],
    answer: "Carrée",
    difficulty: "Facile",
    category: "Formes"
  },
  {
    id: 5,
    question: "Quelle est la couleur du ciel ?",
    options: ["Rouge", "Bleue", "Verte", "Jaune"],
    answer: "Bleue",
    difficulty: "Facile",
    category: "Couleurs"
  },
  {
    id: 6,
    question: "Quelle est la forme d'un triangle ?",
    options: ["Ronde", "Carrée", "Triangle", "Rectangle"],
    answer: "Triangle",
    difficulty: "Moyen",
    category: "Formes"
  },
  {
    id: 7,
    question: "Quelle est la couleur de la neige ?",
    options: ["Rouge", "Bleue", "Verte", "Blanche"],
    answer: "Blanche",
    difficulty: "Moyen",
    category: "Couleurs"
  },
  {
    id: 8,
    question: "Quelle est la forme d'un rectangle ?",
    options: ["Ronde", "Carrée", "Triangle", "Rectangle"],
    answer: "Rectangle",
    difficulty: "Moyen",
    category: "Formes"
  },
  {
    id: 9,
    question: "Quelle est la couleur de la lune ?",
    options: ["Rouge", "Bleue", "Verte", "Blanche"],
    answer: "Blanche",
    difficulty: "Moyen",
    category: "Couleurs"
  },
  {
    id: 10,
    question: "Quelle est la forme d'une étoile ?",
    options: ["Ronde", "Carrée", "Triangle", "Étoile"],
    answer: "Étoile",
    difficulty: "Moyen",
    category: "Formes"
  },
  {
    id: 11,
    question: "Quelle est la couleur de l'arc-en-ciel ?",
    options: ["Rouge", "Bleue", "Verte", "Multicolore"],
    answer: "Multicolore",
    difficulty: "Difficile",
    category: "Couleurs"
  },
  {
    id: 12,
    question: "Quelle est la forme d'un cœur ?",
    options: ["Ronde", "Carrée", "Triangle", "Cœur"],
    answer: "Cœur",
    difficulty: "Difficile",
    category: "Formes"
  },
  {
    id: 13,
    question: "Quelle est la couleur de l'orange ?",
    options: ["Rouge", "Bleue", "Verte", "Orange"],
    answer: "Orange",
    difficulty: "Difficile",
    category: "Couleurs"
  },
  {
    id: 14,
    question: "Quelle est la forme d'un diamant ?",
    options: ["Ronde", "Carrée", "Triangle", "Diamant"],
    answer: "Diamant",
    difficulty: "Difficile",
    category: "Formes"
  },
  {
    id: 15,
    question: "Quelle est la couleur de la nuit ?",
    options: ["Rouge", "Bleue", "Verte", "Noire"],
    answer: "Noire",
    difficulty: "Difficile",
    category: "Couleurs"
  }
];

const ArtPage: React.FC = () => {
  const router = useRouter();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsFinished(true);
      setShowResult(true);
    }
  }, [timeLeft, isFinished]);

  const handleAnswer = (answer: string) => {
    setUserAnswer(answer);
    if (answer === exercises[currentExercise].answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setUserAnswer(null);
        setCompletedExercises(completedExercises + 1);
      } else {
        setShowResult(true);
        setIsFinished(true);
      }
    }, 1000);
  };

  const calculatePercentage = () => {
    return Math.round((score / exercises.length) * 100);
  };

  const getFeedback = () => {
    const percentage = calculatePercentage();
    if (percentage >= 80) return "🌟 Excellent ! Tu es un vrai artiste !";
    if (percentage >= 60) return "🎨 Très bien ! Continue comme ça !";
    if (percentage >= 40) return "🎭 Pas mal ! Tu peux encore progresser !";
    return "🎪 Continue d'apprendre, tu vas y arriver !";
  };

  const calculateFinalScore = () => {
    // Implementation of calculateFinalScore
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Résultats</h2>
          <p className="text-xl mb-2">
            Score : {score} sur {exercises.length}
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
              {exercises[currentExercise].options.map((option, index) => (
                <Button
                  key={index}
                  color={
                    userAnswer === option
                      ? option === exercises[currentExercise].answer
                        ? "success"
                        : "danger"
                      : "primary"
                  }
                  onClick={() => handleAnswer(option)}
                  isDisabled={userAnswer !== null}
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

export default ArtPage;

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
  title: string;
  content: string;
  question: string;
  options: string[];
  answer: string;
  subject: string;
}

const mockExercises: Exercise[] = [
  {
    id: 1,
    title: "Les couleurs",
    content: "Reconnais les couleurs",
    question: "Quelle est la couleur du soleil ?",
    options: ["Jaune", "Bleu", "Vert", "Rouge"],
    answer: "Jaune",
    subject: "Art"
  },
  {
    id: 2,
    title: "Les formes",
    content: "Les formes simples",
    question: "Quelle forme a une pizza ?",
    options: ["Ronde", "Carrée", "Triangle", "Rectangle"],
    answer: "Ronde",
    subject: "Art"
  },
  {
    id: 3,
    title: "Les couleurs",
    content: "Les couleurs de la nature",
    question: "Quelle est la couleur de l'herbe ?",
    options: ["Verte", "Bleue", "Rouge", "Jaune"],
    answer: "Verte",
    subject: "Art"
  },
  {
    id: 4,
    title: "Les formes",
    content: "Les formes dans la maison",
    question: "Quelle forme a une fenêtre ?",
    options: ["Rectangle", "Rond", "Triangle", "Carré"],
    answer: "Rectangle",
    subject: "Art"
  },
  {
    id: 5,
    title: "Les couleurs",
    content: "Les couleurs des fruits",
    question: "Quelle est la couleur d'une pomme ?",
    options: ["Rouge", "Bleue", "Verte", "Jaune"],
    answer: "Rouge",
    subject: "Art"
  },
  {
    id: 6,
    title: "Les formes",
    content: "Les formes des objets",
    question: "Quelle forme a un livre ?",
    options: ["Rectangle", "Rond", "Triangle", "Carré"],
    answer: "Rectangle",
    subject: "Art"
  },
  {
    id: 7,
    title: "Les couleurs",
    content: "Les couleurs du ciel",
    question: "Quelle est la couleur du ciel en été ?",
    options: ["Bleue", "Rouge", "Verte", "Jaune"],
    answer: "Bleue",
    subject: "Art"
  },
  {
    id: 8,
    title: "Les formes",
    content: "Les formes des animaux",
    question: "Quelle forme a un œuf ?",
    options: ["Ovale", "Carré", "Triangle", "Rectangle"],
    answer: "Ovale",
    subject: "Art"
  },
  {
    id: 9,
    title: "Les couleurs",
    content: "Les couleurs des vêtements",
    question: "Quelle est la couleur d'un jean ?",
    options: ["Bleue", "Rouge", "Verte", "Jaune"],
    answer: "Bleue",
    subject: "Art"
  },
  {
    id: 10,
    title: "Les formes",
    content: "Les formes des jouets",
    question: "Quelle forme a un ballon ?",
    options: ["Ronde", "Carrée", "Triangle", "Rectangle"],
    answer: "Ronde",
    subject: "Art"
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
    if (answer === mockExercises[currentExercise].answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentExercise < mockExercises.length - 1) {
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
    return Math.round((score / mockExercises.length) * 100);
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
            Score : {score} sur {mockExercises.length}
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
          totalQuestions={mockExercises.length} 
          correctAnswers={completedExercises}
          onProgressComplete={() => {
            if (completedExercises === mockExercises.length) {
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
              Question {currentExercise + 1} sur {mockExercises.length}
            </h2>
            <p className="text-lg mb-6">{mockExercises[currentExercise].question}</p>
            <div className="grid grid-cols-2 gap-4">
              {mockExercises[currentExercise].options.map((option, index) => (
                <Button
                  key={index}
                  color={
                    userAnswer === option
                      ? option === mockExercises[currentExercise].answer
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

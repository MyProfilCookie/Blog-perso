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
  options: string[];
  answer: string;
  subject: string;
}

const mockExercises: Exercise[] = [
  {
    id: 1,
    title: "Les appareils",
    content: "Reconnais les appareils",
    question: "Quel appareil utilise-t-on pour parler avec quelqu'un qui est loin ?",
    options: ["Le téléphone", "Le livre", "La table", "La chaise"],
    answer: "Le téléphone",
    subject: "Technologie"
  },
  {
    id: 2,
    title: "Les écrans",
    content: "Les différents écrans",
    question: "Sur quel écran regarde-t-on des dessins animés ?",
    options: ["La télévision", "Le livre", "Le tableau", "Le mur"],
    answer: "La télévision",
    subject: "Technologie"
  },
  {
    id: 3,
    title: "Les boutons",
    content: "Les boutons simples",
    question: "Quel bouton appuie-t-on pour allumer la télévision ?",
    options: ["Le bouton rouge", "Le bouton bleu", "Le bouton vert", "Le bouton jaune"],
    answer: "Le bouton rouge",
    subject: "Technologie"
  },
  {
    id: 4,
    title: "Les appareils",
    content: "Les appareils de la maison",
    question: "Quel appareil utilise-t-on pour garder la nourriture froide ?",
    options: ["Le frigo", "Le four", "Le micro-ondes", "Le lave-vaisselle"],
    answer: "Le frigo",
    subject: "Technologie"
  },
  {
    id: 5,
    title: "Les écrans",
    content: "Les écrans tactiles",
    question: "Sur quel écran peut-on toucher pour jouer ?",
    options: ["La tablette", "La télévision", "Le tableau", "Le mur"],
    answer: "La tablette",
    subject: "Technologie"
  },
  {
    id: 6,
    title: "Les boutons",
    content: "Les boutons de la maison",
    question: "Quel bouton appuie-t-on pour allumer la lumière ?",
    options: ["L'interrupteur", "La poignée", "La clé", "Le cadenas"],
    answer: "L'interrupteur",
    subject: "Technologie"
  },
  {
    id: 7,
    title: "Les appareils",
    content: "Les appareils de cuisine",
    question: "Quel appareil utilise-t-on pour réchauffer la nourriture ?",
    options: ["Le micro-ondes", "Le frigo", "Le lave-vaisselle", "Le lave-linge"],
    answer: "Le micro-ondes",
    subject: "Technologie"
  },
  {
    id: 8,
    title: "Les écrans",
    content: "Les écrans pour jouer",
    question: "Sur quel écran peut-on jouer à des jeux vidéo ?",
    options: ["La console de jeu", "Le tableau", "Le mur", "Le livre"],
    answer: "La console de jeu",
    subject: "Technologie"
  },
  {
    id: 9,
    title: "Les boutons",
    content: "Les boutons de la voiture",
    question: "Quel bouton appuie-t-on pour allumer la radio dans la voiture ?",
    options: ["Le bouton radio", "Le volant", "La pédale", "La clé"],
    answer: "Le bouton radio",
    subject: "Technologie"
  },
  {
    id: 10,
    title: "Les appareils",
    content: "Les appareils pour laver",
    question: "Quel appareil utilise-t-on pour laver les vêtements ?",
    options: ["Le lave-linge", "Le frigo", "Le four", "Le micro-ondes"],
    answer: "Le lave-linge",
    subject: "Technologie"
  }
];

const TechnologyPage: React.FC = () => {
  const router = useRouter();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isFinished, setIsFinished] = useState(false);

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
    if (percentage >= 80) return "🌟 Excellent ! Tu es un expert en technologie !";
    if (percentage >= 60) return "💻 Très bien ! Continue comme ça !";
    if (percentage >= 40) return "🔧 Pas mal ! Tu peux encore progresser !";
    return "⚡ Continue d'apprendre, tu vas y arriver !";
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
              {mockExercises[currentExercise].options?.map((option, index) => (
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

export default TechnologyPage;
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";

interface Exercise {
  id: number;
  question: string;
  options: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

const exercises: Exercise[] = [
  {
    id: 1,
    question: "Quel est le son le plus grave parmi ces instruments ?",
    options: ["Flûte", "Trompette", "Tuba", "Clarinette"],
    answer: "Tuba",
    difficulty: "easy",
    category: "Instruments"
  },
  {
    id: 2,
    question: "Combien y a-t-il de notes dans une octave ?",
    options: ["6", "7", "8", "9"],
    answer: "8",
    difficulty: "easy",
    category: "Théorie"
  },
  {
    id: 3,
    question: "Quel est le rythme le plus lent ?",
    options: ["Noire", "Blanche", "Ronde", "Croche"],
    answer: "Ronde",
    difficulty: "easy",
    category: "Rythme"
  },
  {
    id: 4,
    question: "Quel instrument fait partie de la famille des cordes ?",
    options: ["Trompette", "Violon", "Flûte", "Timbale"],
    answer: "Violon",
    difficulty: "easy",
    category: "Instruments"
  },
  {
    id: 5,
    question: "Quelle est la note la plus aiguë ?",
    options: ["Do", "Mi", "Sol", "Si"],
    answer: "Si",
    difficulty: "easy",
    category: "Notes"
  },
  {
    id: 6,
    question: "Quel est le tempo le plus rapide ?",
    options: ["Largo", "Andante", "Allegro", "Presto"],
    answer: "Presto",
    difficulty: "medium",
    category: "Tempo"
  },
  {
    id: 7,
    question: "Quelle est la durée d'une blanche pointée ?",
    options: ["2 temps", "3 temps", "4 temps", "6 temps"],
    answer: "3 temps",
    difficulty: "medium",
    category: "Rythme"
  },
  {
    id: 8,
    question: "Quel est le signe qui indique un silence ?",
    options: ["Point", "Tiret", "Croix", "Cercle"],
    answer: "Cercle",
    difficulty: "medium",
    category: "Notation"
  },
  {
    id: 9,
    question: "Quelle est la famille d'instruments la plus nombreuse ?",
    options: ["Cordes", "Vents", "Percussions", "Claviers"],
    answer: "Percussions",
    difficulty: "medium",
    category: "Instruments"
  },
  {
    id: 10,
    question: "Quel est le symbole qui indique un dièse ?",
    options: ["#", "b", "♮", "♭"],
    answer: "#",
    difficulty: "medium",
    category: "Notation"
  },
  {
    id: 11,
    question: "Quelle est la note qui suit Mi dans la gamme de Do ?",
    options: ["Fa", "Sol", "La", "Si"],
    answer: "Fa",
    difficulty: "hard",
    category: "Notes"
  },
  {
    id: 12,
    question: "Quel est le nombre de temps dans une mesure à 3/4 ?",
    options: ["2", "3", "4", "6"],
    answer: "3",
    difficulty: "hard",
    category: "Mesure"
  },
  {
    id: 13,
    question: "Quelle est la durée d'une ronde ?",
    options: ["1 temps", "2 temps", "3 temps", "4 temps"],
    answer: "4 temps",
    difficulty: "hard",
    category: "Rythme"
  },
  {
    id: 14,
    question: "Quel est le signe qui indique un bémol ?",
    options: ["#", "b", "♮", "♭"],
    answer: "♭",
    difficulty: "hard",
    category: "Notation"
  },
  {
    id: 15,
    question: "Quelle est la note la plus grave de la gamme de Do ?",
    options: ["Do", "Ré", "Mi", "Fa"],
    answer: "Do",
    difficulty: "hard",
    category: "Notes"
  }
];

export default function MusicPage() {
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
    if (percentage >= 80) return "🌟 Excellent ! Tu es un vrai musicien !";
    if (percentage >= 60) return "🎵 Très bien ! Continue comme ça !";
    if (percentage >= 40) return "🎼 Pas mal ! Tu peux encore progresser !";
    return "🎸 Continue d'apprendre, tu vas y arriver !";
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
} 
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
    title: "Les instruments",
    content: "Reconnais les instruments de musique",
    question: "Quel instrument fait 'boum boum' quand on tape dessus ?",
    options: ["Le tambour", "La flûte", "Le piano", "La guitare"],
    answer: "Le tambour",
    subject: "Musique"
  },
  {
    id: 2,
    title: "Les sons",
    content: "Les différents sons",
    question: "Quel animal fait 'miaou' ?",
    options: ["Le chat", "Le chien", "L'oiseau", "Le poisson"],
    answer: "Le chat",
    subject: "Musique"
  },
  {
    id: 3,
    title: "Les rythmes",
    content: "Les rythmes simples",
    question: "Quand on marche, quel rythme fait nos pas ?",
    options: ["1-2, 1-2", "1-2-3, 1-2-3", "1-2-3-4, 1-2-3-4", "1-2-3-4-5"],
    answer: "1-2, 1-2",
    subject: "Musique"
  },
  {
    id: 4,
    title: "Les instruments",
    content: "Les instruments à vent",
    question: "Quel instrument fait 'souffle' quand on joue ?",
    options: ["La flûte", "Le tambour", "Le piano", "La guitare"],
    answer: "La flûte",
    subject: "Musique"
  },
  {
    id: 5,
    title: "Les sons",
    content: "Les sons de la nature",
    question: "Quel son fait la pluie quand elle tombe ?",
    options: ["Plic plic", "Boum boum", "Ding dong", "Vroum vroum"],
    answer: "Plic plic",
    subject: "Musique"
  },
  {
    id: 6,
    title: "Les instruments",
    content: "Les instruments à cordes",
    question: "Quel instrument a des cordes qu'on gratte ?",
    options: ["La guitare", "Le tambour", "La flûte", "Le piano"],
    answer: "La guitare",
    subject: "Musique"
  },
  {
    id: 7,
    title: "Les rythmes",
    content: "Les rythmes de la vie",
    question: "Quel rythme fait notre cœur quand on court ?",
    options: ["Boum-boum", "Tic-tac", "Ding-dong", "Vroum-vroum"],
    answer: "Boum-boum",
    subject: "Musique"
  },
  {
    id: 8,
    title: "Les instruments",
    content: "Les instruments à percussion",
    question: "Quel instrument fait 'ding ding' ?",
    options: ["Les cymbales", "Le tambour", "La flûte", "La guitare"],
    answer: "Les cymbales",
    subject: "Musique"
  },
  {
    id: 9,
    title: "Les sons",
    content: "Les sons de la maison",
    question: "Quel son fait le réveil le matin ?",
    options: ["Ding ding ding", "Boum boum", "Plic plic", "Vroum vroum"],
    answer: "Ding ding ding",
    subject: "Musique"
  },
  {
    id: 10,
    title: "Les instruments",
    content: "Les instruments à touches",
    question: "Quel instrument a des touches blanches et noires ?",
    options: ["Le piano", "La guitare", "Le tambour", "La flûte"],
    answer: "Le piano",
    subject: "Musique"
  },
  {
    id: 11,
    title: "Les instruments",
    content: "Les instruments à vent",
    question: "Quel instrument fait 'tut tut' ?",
    options: ["La trompette", "Le piano", "La guitare", "Le tambour"],
    answer: "La trompette",
    subject: "Musique"
  },
  {
    id: 12,
    title: "Les sons",
    content: "Les sons des animaux",
    question: "Quel animal fait 'coin coin' ?",
    options: ["Le canard", "Le chat", "Le chien", "L'oiseau"],
    answer: "Le canard",
    subject: "Musique"
  },
  {
    id: 13,
    title: "Les rythmes",
    content: "Les rythmes de la danse",
    question: "Quel rythme fait-on quand on saute ?",
    options: ["1-2-3, 1-2-3", "1-2, 1-2", "1-2-3-4, 1-2-3-4", "1-2-3-4-5"],
    answer: "1-2-3, 1-2-3",
    subject: "Musique"
  },
  {
    id: 14,
    title: "Les instruments",
    content: "Les instruments à cordes",
    question: "Quel instrument a des cordes qu'on frotte ?",
    options: ["Le violon", "La guitare", "Le piano", "Le tambour"],
    answer: "Le violon",
    subject: "Musique"
  },
  {
    id: 15,
    title: "Les sons",
    content: "Les sons de la ville",
    question: "Quel son fait la sirène de police ?",
    options: ["Pin pon pin pon", "Ding ding", "Boum boum", "Plic plic"],
    answer: "Pin pon pin pon",
    subject: "Musique"
  },
  {
    id: 16,
    title: "Les instruments",
    content: "Les instruments à percussion",
    question: "Quel instrument fait 'tam tam' ?",
    options: ["Le tam-tam", "Le tambour", "Les cymbales", "La flûte"],
    answer: "Le tam-tam",
    subject: "Musique"
  },
  {
    id: 17,
    title: "Les rythmes",
    content: "Les rythmes de la nature",
    question: "Quel rythme fait le vent dans les arbres ?",
    options: ["Chhhhh", "Boum boum", "Ding ding", "Vroum vroum"],
    answer: "Chhhhh",
    subject: "Musique"
  },
  {
    id: 18,
    title: "Les instruments",
    content: "Les instruments à vent",
    question: "Quel instrument fait 'souffle' comme le vent ?",
    options: ["L'harmonica", "Le piano", "La guitare", "Le tambour"],
    answer: "L'harmonica",
    subject: "Musique"
  },
  {
    id: 19,
    title: "Les sons",
    content: "Les sons de la cuisine",
    question: "Quel son fait la bouilloire ?",
    options: ["Sifflement", "Boum boum", "Ding ding", "Plic plic"],
    answer: "Sifflement",
    subject: "Musique"
  },
  {
    id: 20,
    title: "Les instruments",
    content: "Les instruments à cordes",
    question: "Quel instrument a des cordes qu'on pince ?",
    options: ["La harpe", "Le violon", "Le piano", "Le tambour"],
    answer: "La harpe",
    subject: "Musique"
  },
  {
    id: 21,
    title: "Les rythmes",
    content: "Les rythmes du corps",
    question: "Quel rythme fait-on quand on tape des mains ?",
    options: ["1-2-3-4, 1-2-3-4", "1-2, 1-2", "1-2-3, 1-2-3", "1-2-3-4-5"],
    answer: "1-2-3-4, 1-2-3-4",
    subject: "Musique"
  },
  {
    id: 22,
    title: "Les instruments",
    content: "Les instruments à percussion",
    question: "Quel instrument fait 'clac clac' ?",
    options: ["Les castagnettes", "Le tambour", "Les cymbales", "La flûte"],
    answer: "Les castagnettes",
    subject: "Musique"
  },
  {
    id: 23,
    title: "Les sons",
    content: "Les sons de la ferme",
    question: "Quel animal fait 'cocorico' ?",
    options: ["Le coq", "La poule", "Le chat", "Le chien"],
    answer: "Le coq",
    subject: "Musique"
  },
  {
    id: 24,
    title: "Les instruments",
    content: "Les instruments à vent",
    question: "Quel instrument fait 'souffle' comme une flûte ?",
    options: ["La clarinette", "Le piano", "La guitare", "Le tambour"],
    answer: "La clarinette",
    subject: "Musique"
  },
  {
    id: 25,
    title: "Les rythmes",
    content: "Les rythmes de la musique",
    question: "Quel rythme fait-on quand on tape du pied ?",
    options: ["1-2, 1-2", "1-2-3, 1-2-3", "1-2-3-4, 1-2-3-4", "1-2-3-4-5"],
    answer: "1-2, 1-2",
    subject: "Musique"
  },
  {
    id: 26,
    title: "Les instruments",
    content: "Les instruments à cordes",
    question: "Quel instrument a des cordes qu'on tape ?",
    options: ["Le xylophone", "Le violon", "Le piano", "Le tambour"],
    answer: "Le xylophone",
    subject: "Musique"
  },
  {
    id: 27,
    title: "Les sons",
    content: "Les sons de la forêt",
    question: "Quel son fait le hibou ?",
    options: ["Hou hou", "Boum boum", "Ding ding", "Plic plic"],
    answer: "Hou hou",
    subject: "Musique"
  },
  {
    id: 28,
    title: "Les instruments",
    content: "Les instruments à percussion",
    question: "Quel instrument fait 'tam tam' comme un tambour ?",
    options: ["Le bongo", "Le tambour", "Les cymbales", "La flûte"],
    answer: "Le bongo",
    subject: "Musique"
  },
  {
    id: 29,
    title: "Les rythmes",
    content: "Les rythmes de la vie",
    question: "Quel rythme fait-on quand on nage ?",
    options: ["1-2-3-4, 1-2-3-4", "1-2, 1-2", "1-2-3, 1-2-3", "1-2-3-4-5"],
    answer: "1-2-3-4, 1-2-3-4",
    subject: "Musique"
  },
  {
    id: 30,
    title: "Les instruments",
    content: "Les instruments à vent",
    question: "Quel instrument fait 'souffle' comme une trompette ?",
    options: ["Le trombone", "Le piano", "La guitare", "Le tambour"],
    answer: "Le trombone",
    subject: "Musique"
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
} 
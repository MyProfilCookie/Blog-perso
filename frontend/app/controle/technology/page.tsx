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
  },
  {
    id: 11,
    title: "Les appareils",
    content: "Les appareils pour cuisiner",
    question: "Quel appareil utilise-t-on pour faire cuire un gâteau ?",
    options: ["Le four", "Le frigo", "Le lave-vaisselle", "Le lave-linge"],
    answer: "Le four",
    subject: "Technologie"
  },
  {
    id: 12,
    title: "Les écrans",
    content: "Les écrans pour travailler",
    question: "Sur quel écran travaille-t-on sur un ordinateur ?",
    options: ["L'écran d'ordinateur", "La télévision", "Le tableau", "Le mur"],
    answer: "L'écran d'ordinateur",
    subject: "Technologie"
  },
  {
    id: 13,
    title: "Les boutons",
    content: "Les boutons de l'ordinateur",
    question: "Quel bouton appuie-t-on pour allumer l'ordinateur ?",
    options: ["Le bouton power", "Le clavier", "La souris", "L'écran"],
    answer: "Le bouton power",
    subject: "Technologie"
  },
  {
    id: 14,
    title: "Les appareils",
    content: "Les appareils pour nettoyer",
    question: "Quel appareil utilise-t-on pour aspirer la poussière ?",
    options: ["L'aspirateur", "Le balai", "La serpillière", "Le torchon"],
    answer: "L'aspirateur",
    subject: "Technologie"
  },
  {
    id: 15,
    title: "Les écrans",
    content: "Les écrans pour lire",
    question: "Sur quel écran peut-on lire des livres numériques ?",
    options: ["La liseuse", "La télévision", "Le tableau", "Le mur"],
    answer: "La liseuse",
    subject: "Technologie"
  },
  {
    id: 16,
    title: "Les boutons",
    content: "Les boutons de la machine à café",
    question: "Quel bouton appuie-t-on pour faire un café ?",
    options: ["Le bouton café", "Le bouton eau", "Le bouton lait", "Le bouton sucre"],
    answer: "Le bouton café",
    subject: "Technologie"
  },
  {
    id: 17,
    title: "Les appareils",
    content: "Les appareils pour laver",
    question: "Quel appareil utilise-t-on pour laver la vaisselle ?",
    options: ["Le lave-vaisselle", "Le lave-linge", "Le frigo", "Le four"],
    answer: "Le lave-vaisselle",
    subject: "Technologie"
  },
  {
    id: 18,
    title: "Les écrans",
    content: "Les écrans pour la sécurité",
    question: "Sur quel écran voit-on les images de la caméra de surveillance ?",
    options: ["L'écran de surveillance", "La télévision", "Le tableau", "Le mur"],
    answer: "L'écran de surveillance",
    subject: "Technologie"
  },
  {
    id: 19,
    title: "Les boutons",
    content: "Les boutons de la télécommande",
    question: "Quel bouton appuie-t-on pour changer de chaîne ?",
    options: ["Les boutons numériques", "Le bouton menu", "Le bouton retour", "Le bouton ok"],
    answer: "Les boutons numériques",
    subject: "Technologie"
  },
  {
    id: 20,
    title: "Les appareils",
    content: "Les appareils pour la musique",
    question: "Quel appareil utilise-t-on pour écouter de la musique ?",
    options: ["La chaîne hi-fi", "Le frigo", "Le four", "Le lave-linge"],
    answer: "La chaîne hi-fi",
    subject: "Technologie"
  },
  {
    id: 21,
    title: "Les écrans",
    content: "Les écrans pour la navigation",
    question: "Sur quel écran voit-on le trajet en voiture ?",
    options: ["Le GPS", "La télévision", "Le tableau", "Le mur"],
    answer: "Le GPS",
    subject: "Technologie"
  },
  {
    id: 22,
    title: "Les boutons",
    content: "Les boutons de la machine à laver",
    question: "Quel bouton appuie-t-on pour lancer le programme de lavage ?",
    options: ["Le bouton start", "Le bouton pause", "Le bouton stop", "Le bouton reset"],
    answer: "Le bouton start",
    subject: "Technologie"
  },
  {
    id: 23,
    title: "Les appareils",
    content: "Les appareils pour le jardin",
    question: "Quel appareil utilise-t-on pour tondre la pelouse ?",
    options: ["La tondeuse", "Le râteau", "La pelle", "Le sécateur"],
    answer: "La tondeuse",
    subject: "Technologie"
  },
  {
    id: 24,
    title: "Les écrans",
    content: "Les écrans pour la photo",
    question: "Sur quel écran voit-on les photos prises avec l'appareil photo ?",
    options: ["L'écran de l'appareil photo", "La télévision", "Le tableau", "Le mur"],
    answer: "L'écran de l'appareil photo",
    subject: "Technologie"
  },
  {
    id: 25,
    title: "Les boutons",
    content: "Les boutons de l'ascenseur",
    question: "Quel bouton appuie-t-on pour monter à l'étage ?",
    options: ["Le bouton haut", "Le bouton bas", "Le bouton stop", "Le bouton alarme"],
    answer: "Le bouton haut",
    subject: "Technologie"
  },
  {
    id: 26,
    title: "Les appareils",
    content: "Les appareils pour le bricolage",
    question: "Quel appareil utilise-t-on pour percer un trou ?",
    options: ["La perceuse", "Le marteau", "Le tournevis", "La scie"],
    answer: "La perceuse",
    subject: "Technologie"
  },
  {
    id: 27,
    title: "Les écrans",
    content: "Les écrans pour le sport",
    question: "Sur quel écran voit-on son rythme cardiaque pendant le sport ?",
    options: ["Le cardiofréquencemètre", "La télévision", "Le tableau", "Le mur"],
    answer: "Le cardiofréquencemètre",
    subject: "Technologie"
  },
  {
    id: 28,
    title: "Les boutons",
    content: "Les boutons de la cafetière",
    question: "Quel bouton appuie-t-on pour faire chauffer l'eau ?",
    options: ["Le bouton chauffe-eau", "Le bouton café", "Le bouton lait", "Le bouton sucre"],
    answer: "Le bouton chauffe-eau",
    subject: "Technologie"
  },
  {
    id: 29,
    title: "Les appareils",
    content: "Les appareils pour le repassage",
    question: "Quel appareil utilise-t-on pour repasser les vêtements ?",
    options: ["Le fer à repasser", "Le lave-linge", "Le sèche-linge", "Le lave-vaisselle"],
    answer: "Le fer à repasser",
    subject: "Technologie"
  },
  {
    id: 30,
    title: "Les écrans",
    content: "Les écrans pour la météo",
    question: "Sur quel écran voit-on la température extérieure ?",
    options: ["La station météo", "La télévision", "Le tableau", "Le mur"],
    answer: "La station météo",
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
      <div className="flex-1 w-full max-w-7xl mx-auto">
        <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6 relative">
            <div className="absolute left-0 top-0">
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
          </div>
        </section>
      </div>

      <div className="flex justify-end items-center mb-4">
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
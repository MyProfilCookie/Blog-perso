/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";

import BackButton from "@/components/back";

// Interface pour les exercices d'art
interface Exercise {
  id: number;
  title: string;
  content: string;
  image?: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

const ArtPage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [emoji, setEmoji] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    fetch("/dataart.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.art_exercises) {
          setExercises(data.art_exercises);
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = (id: number, correctAnswer: string) => {
    const userAnswer = userAnswers[id];
    const isCorrect = userAnswer?.toString().trim() === correctAnswer.trim();
    setResults({ ...results, [id]: isCorrect });
  };

  const calculateFinalScore = () => {
    const total = exercises.length;
    const correct = Object.values(results).filter(Boolean).length;
    const score = (correct / total) * 100;

    setFinalScore(score);
    setShowResults(true);

    if (score === 100) {
      setEmoji("🌟");
    } else if (score >= 80) {
      setEmoji("😊");
    } else if (score >= 50) {
      setEmoji("😐");
    } else {
      setEmoji("😢");
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-spin text-4xl">🔄</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-screen gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-2xl text-red-600">⚠️</div>
        <p className="text-lg text-gray-600">Erreur: {error}</p>
      </motion.div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
      {/* En-tête avec titre et navigation */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6">
        <motion.div 
          className="text-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
            Exercices d&apos;Art
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Découvrez et pratiquez l&apos;art à travers des exercices interactifs
          </p>
        </motion.div>

        {/* Barre de navigation supérieure */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200">
          <BackButton />
        </div>
      </div>

      {/* Contenu principal */}
      <motion.div
        className="w-full max-w-7xl mx-auto px-2 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="w-full bg-white dark:bg-gray-800 border border-violet-200">
                <CardBody className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-violet-600 dark:text-violet-400 mb-3">
                    {exercise.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {exercise.content}
                  </p>

                  {exercise.image && (
                    <div className="relative h-48 sm:h-64 mb-4 rounded-lg overflow-hidden">
                      <Image
                        alt={exercise.title}
                        src={`/assets/art/${exercise.image}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {exercise.questions.map((q, questionIndex) => (
                    <div key={questionIndex} className="space-y-3">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        {q.question}
                      </p>
                      
                      <div className="flex flex-col gap-2">
                        <input
                          className="w-full px-3 py-2 rounded-lg border-2 border-violet-200 focus:border-violet-500 focus:outline-none text-sm"
                          placeholder="Votre réponse..."
                          type="text"
                          value={userAnswers[exercise.id] || ""}
                          onChange={(e) => handleChange(e, exercise.id)}
                        />
                        
                        <Button
                          className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                          onClick={() => handleSubmit(exercise.id, q.answer)}
                        >
                          Vérifier
                        </Button>
                      </div>

                      {results[exercise.id] !== undefined && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-3 rounded-lg ${
                            results[exercise.id]
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {results[exercise.id] ? "✨ Bonne réponse !" : "❌ Mauvaise réponse, réessayez."}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Score final */}
        {showResults && finalScore !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <div className="bg-violet-50 dark:bg-violet-900/30 p-6 rounded-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                Votre score final
              </h2>
              <p className="text-4xl sm:text-5xl font-bold mb-2">
                {finalScore.toFixed(0)}% {emoji}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {finalScore === 100
                  ? "Parfait ! Vous êtes un expert en art !"
                  : finalScore >= 80
                  ? "Excellent travail !"
                  : finalScore >= 50
                  ? "Continuez vos efforts !"
                  : "Ne vous découragez pas, continuez à pratiquer !"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Bouton pour calculer le score */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <Button
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl text-lg"
              onClick={calculateFinalScore}
            >
              Voir mon score final
            </Button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ArtPage;

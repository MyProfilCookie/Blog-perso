/* eslint-disable prettier/prettier */
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Image, Spacer } from "@nextui-org/react";
import { motion } from "framer-motion";

import BackButton from "@/components/back";
import LoadingAnimation from "@/components/loading";

interface Exercise {
  id: string;
  title: string;
  content: string;
  image: string;
  question: string;
  options?: string[];
  answer: string;
}

interface Results {
  [key: string]: boolean;
}

interface UserAnswers {
  [key: string]: string;
}

const ExercisesPage = () => {
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', title: 'Exercice 1', content: 'Contenu de l\'exercice 1', image: 'image1.jpg', question: 'Quelle est la capitale de la France?', options: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'], answer: 'Paris' },
    { id: '2', title: 'Exercice 2', content: 'Contenu de l\'exercice 2', image: 'image2.jpg', question: 'Quelle est la capitale de l\'Espagne?', options: ['Madrid', 'Barcelone', 'Valence', 'Séville'], answer: 'Madrid' },
    { id: '3', title: 'Exercice 3', content: 'Contenu de l\'exercice 3', image: 'image3.jpg', question: 'Quelle est la capitale de l\'Italie?', options: ['Rome', 'Milan', 'Venise', 'Naples'], answer: 'Rome' },
  ]);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [results, setResults] = useState<Results>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [encouragementMessage, setEncouragementMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, id: string) => {
    const { value } = e.target;
    setUserAnswers({ ...userAnswers, [id]: value });
  };

  const handleSubmit = (id: string, correctAnswer: string) => {
    const isCorrect = userAnswers[id] === correctAnswer;
    setResults({ ...results, [id]: isCorrect });
  };

  const calculateFinalScore = () => {
    let score = 0;
    let totalQuestions = 0;
    let encouragement = '';

    for (const exercise of exercises) {
      if (results[exercise.id] !== undefined) {
        if (results[exercise.id]) {
          score++;
        }
        totalQuestions++;
      }
    }

    if (totalQuestions > 0) {
      const percentage = (score / totalQuestions) * 100;
      setFinalScore(percentage);
      
      if (percentage === 100) {
        setEmoji('🌟');
        encouragement = '🌟 Excellent travail ! Tu as tout réussi ! 🌟';
      } else if (percentage >= 80) {
        setEmoji('😊');
        encouragement = '🌟 Très bien ! Continue comme ça ! 🌟';
      } else if (percentage >= 50) {
        setEmoji('😐');
        encouragement = '💪 Tu es sur la bonne voie ! Continue tes efforts !';
      } else {
        setEmoji('🤗');
        encouragement = '💝 N\'abandonne pas ! Chaque erreur nous fait progresser !';
      }
    }

    setEncouragementMessage(encouragement);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-violet-50 dark:from-gray-900 dark:to-violet-900">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        {/* En-tête */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Image
            alt="Header Image"
            className="object-contain mx-auto rounded-2xl shadow-lg"
            height={250}
            src="/assets/entete.webp"
            width={800}
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mt-8 mb-4">
            🌟 Exercices d&apos;Anglais 🌟
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Découvre et pratique l&apos;anglais de façon amusante !
          </p>
        </motion.div>

        {/* Grille d'exercices */}
        {loading ? (
          <LoadingAnimation />
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {exercises?.map((exercise: Exercise, index: number) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border-2 border-violet-200 dark:border-violet-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <CardBody className="p-6">
                    {/* Titre de l'exercice */}
                    <div className="bg-gradient-to-r from-violet-500 to-blue-500 -mx-6 -mt-6 p-4 mb-6">
                      <h3 className="text-xl font-bold text-white text-center">
                        {exercise.title}
                      </h3>
                    </div>

                    {/* Contenu de l'exercice */}
                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300 text-center">
                        {exercise.content}
                      </p>
                      
                      {exercise.image && (
                        <div className="flex justify-center my-4">
                          <Image
                            alt={exercise.title}
                            className="rounded-lg shadow-md"
                            height={200}
                            src={`/assets/english/${exercise.image}`}
                            width={200}
                          />
                        </div>
                      )}

                      <div className="bg-violet-50 dark:bg-violet-900/30 p-4 rounded-lg">
                        <p className="text-violet-700 dark:text-violet-300 font-medium">
                          {exercise.question}
                        </p>
                      </div>

                      {/* Zone de réponse */}
                      <div className="flex flex-col items-center gap-3">
                        {exercise.options ? (
                          <select
                            className="w-full px-4 py-2 rounded-lg border-2 border-violet-200 dark:border-violet-700 
                                    focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:bg-gray-800"
                            disabled={results[exercise.id] !== undefined}
                            value={userAnswers[exercise.id] || ""}
                            onChange={(e) => handleChange(e, exercise.id)}
                          >
                            <option value="">Choisis ta réponse...</option>
                            {exercise.options.map((option: string, index: number) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="w-full px-4 py-2 rounded-lg border-2 border-violet-200 dark:border-violet-700 
                                    focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:bg-gray-800"
                            disabled={results[exercise.id] !== undefined}
                            placeholder="Écris ta réponse ici..."
                            type="text"
                            value={userAnswers[exercise.id] || ""}
                            onChange={(e) => handleChange(e, exercise.id)}
                          />
                        )}

                        <button
                          className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 
                                  ${results[exercise.id] !== undefined 
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white'}`}
                          disabled={results[exercise.id] !== undefined}
                          onClick={() => handleSubmit(exercise.id, exercise.answer)}
                        >
                          Valider ma réponse
                        </button>

                        {/* Message de résultat */}
                        {results[exercise.id] !== undefined && (
                          <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className={`w-full p-4 rounded-lg text-center font-medium
                                    ${results[exercise.id] 
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
                                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}
                            initial={{ opacity: 0, y: 10 }}
                          >
                            {results[exercise.id]
                              ? "🎉 Bravo ! C'est la bonne réponse !"
                              : "💪 Pas tout à fait, mais continue d'essayer !"}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Section du score final */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t-2 border-violet-200 
                   dark:border-violet-700 p-6"
          style={{ 
            transform: `translateY(${finalScore !== null ? '0' : '100%'})`,
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <div className="container mx-auto max-w-4xl flex flex-col items-center gap-4">
            {finalScore !== null && (
              <>
                <h2 className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                  Ton score final: {finalScore.toFixed(2)}% {emoji}
                </h2>
                
                {encouragementMessage && (
                  <motion.p
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xl text-center text-gray-700 dark:text-gray-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    {encouragementMessage}
                  </motion.p>
                )}
              </>
            )}
            
            <button
              className="px-8 py-3 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 
                       hover:to-blue-600 text-white font-medium rounded-full shadow-lg 
                       transform hover:scale-105 transition-all duration-300"
              onClick={calculateFinalScore}
            >
              Calculer mon score final
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExercisesPage; 
"use client";
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Button } from '@nextui-org/react';
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { useRevision } from "@/app/RevisionContext";

// Interface pour les exercices de musique
interface Exercise {
  _id: string;
  title: string;
  content: string;
  question: string;
  options?: string[];
  image?: string;
  answer: string;
  difficulty?: string;
  category: string;
}

interface Result {
  isCorrect: boolean;
  answer: string;
}

const MusicPage: React.FC = () => {
  const router = useRouter();
  const { addError } = useRevision();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<Result[]>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [emoji, setEmoji] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [completedExercises, setCompletedExercises] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  const [showTips, setShowTips] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [isFinished, setIsFinished] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 20;
  const correctSound =
    typeof Audio !== "undefined" ? new Audio("/sounds/correct.mp3") : null;
  const [timeSpent, setTimeSpent] = useState(0);
  const [rating, setRating] = useState<number | null>(null);

  // Statistiques et badges
  const [badges, setBadges] = useState<{
    perfectScore: boolean;
    streakMaster: boolean;
    musicExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    musicExpert: false,
    quickLearner: false,
  });

  // Messages d'encouragement
  const encouragementMessages = [
    "🎵 Tu es un excellent musicien !",
    "🎼 Ta compréhension musicale est impressionnante !",
    "🎹 Continue à explorer la musique !",
    "🎸 Tes compétences musicales s'améliorent !",
    "🎺 Tu deviens un expert en musique !",
    "🎻 Tu progresses comme un pro !",
  ];

  const getEmojiForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case "theorie":
        return "🎼";
      case "histoire":
        return "📚";
      case "instruments":
        return "🎸";
      case "compositeurs":
        return "👨‍🎨";
      case "genres":
        return "🎵";
      case "rythme":
        return "🥁";
      case "solfège":
        return "🎹";
      default:
        return "🎵";
    }
  };

  // Ajouter un log pour vérifier l'initialisation
  console.log("RevisionContext initialisé avec addError:", !!addError);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/music`
        );

        setExercises(response.data.questions);
        setLoading(false);

        // On garde uniquement la logique de récupération/sauvegarde dans le localStorage
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des exercices");
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Gestion du minuteur et des messages d'encouragement
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let encouragementTimer: NodeJS.Timeout;

    if (timeLeft > 0 && !isFinished) {
      // Minuteur principal
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            calculateFinalScore();

            return 0;
          }

          return prev - 1;
        });
      }, 1000);

      // Messages d'encouragement toutes les 15 minutes
      encouragementTimer = setInterval(() => {
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

        setEmoji(`Page ${currentPage} : ${randomMessage}`);
        setTimeout(() => setEmoji(""), 5000); // Le message disparaît après 5 secondes
      }, 900000); // 900000ms = 15 minutes
    } else if (timeLeft === 0) {
      setIsFinished(true);
      calculateFinalScore();
    }

    return () => {
      clearInterval(timer);
      clearInterval(encouragementTimer);
    };
  }, [timeLeft, isFinished, currentPage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    id: string,
  ) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = async (id: string, correctAnswer: string) => {
    const userAnswer = userAnswers[id];
    const isCorrect = userAnswer?.toLowerCase().trim() === correctAnswer.toLowerCase();
    const exerciseIndex = exercises.findIndex(ex => ex._id === id);
    
    if (exerciseIndex !== -1) {
      const newResults = [...results];

      newResults[exerciseIndex] = { isCorrect, answer: userAnswer || '' };
      setResults(newResults);
      
      // Sauvegarder dans le localStorage
      const updatedUserAnswers = { ...userAnswers, [id]: userAnswer };
      const updatedResults = [...newResults];

      localStorage.setItem('music_userAnswers', JSON.stringify(updatedUserAnswers));
      localStorage.setItem('music_results', JSON.stringify(updatedResults));
      
      // Sauvegarder l'état de validation
      const validatedExercises = JSON.parse(localStorage.getItem('music_validatedExercises') || '{}');

      validatedExercises[id] = true;
      localStorage.setItem('music_validatedExercises', JSON.stringify(validatedExercises));
      
      // Sauvegarder l'erreur dans la base de données (revision-errors)
      let erreurEnregistreeServeur = false;

      try {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("userToken");
        
        if (user && token) {
          const userId = JSON.parse(user)._id;

          // On n'enregistre que si la réponse est incorrecte
          if (!isCorrect) {
            const exercise = exercises[exerciseIndex];

            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/revision-errors`,
              {
                userId,
                questionId: id,
                questionText: exercise.question,
                selectedAnswer: userAnswer || '',
                correctAnswer: correctAnswer,
                category: exercise.category
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            erreurEnregistreeServeur = true;
          }
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'erreur de révision:", error);
        toast.error("Erreur lors de la sauvegarde de l'erreur de révision");
      }
      
      // Enregistrement local UNIQUEMENT si la sauvegarde serveur a échoué
      if (!isCorrect && !erreurEnregistreeServeur) {
        const exercise = exercises[exerciseIndex];
        const errorData = {
          _id: id,
          questionId: id,
          questionText: exercise.question,
          selectedAnswer: userAnswer || '',
          correctAnswer: correctAnswer,
          category: exercise.category,
          date: new Date().toISOString(),
          attempts: 1
        };

        try {
          if (typeof addError === 'function') {
            addError(errorData);
          }
        } catch (error) {
          console.error("Erreur lors de l'enregistrement dans le RevisionContext:", error);
        }
      }
      
      if (isCorrect) {
        correctSound?.play();
        setCompletedExercises(prev => prev + 1);
        setTotalPoints(prev => prev + 10);
        setCurrentStreak(prev => prev + 1);

        // Messages d'encouragement pour les bonnes réponses
        if (currentStreak >= 3) {
          toast.success(`Super ! Tu es en série de ${currentStreak + 1} bonnes réponses ! 🎵`);
        } else if (currentStreak >= 5) {
          toast.success(`Incroyable ! ${currentStreak + 1} bonnes réponses d'affilée ! 🎼`);
        } else {
          toast.success("Bonne réponse ! Continue à explorer la musique ! 🎹");
        }
      } else {
        setCurrentStreak(0);
        // Messages d'encouragement pour les mauvaises réponses
        toast.error("Ce n'est pas la bonne réponse, mais la musique s'apprend en écoutant ! Essaie encore ! 🎸");
      }
    }
  };

  const calculateFinalScore = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      if (!userId || !token) {
        console.error("Utilisateur non connecté");
        toast.error("Vous devez être connecté pour sauvegarder votre score");

        return;
      }

      const correctAnswers = results.filter((r: Result) => r.isCorrect).length;
      const scorePercentage = (correctAnswers / exercises.length) * 100;

      // Messages de fin basés sur le score
      if (scorePercentage >= 90) {
        toast.success("Excellent travail ! Tu es un véritable musicien ! 🎵");
      } else if (scorePercentage >= 70) {
        toast.success("Très bon travail ! Ta compréhension musicale est impressionnante ! 🎼");
      } else if (scorePercentage >= 50) {
        toast.success("Bon travail ! Continue à explorer la musique ! 🎹");
      } else {
        toast.info("Ne te décourage pas ! La musique est un art magnifique à découvrir ! 🎸");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/scores`,
        {
          userId,
          token,
          pageId: "music",
          score: finalScore,
          timeSpent,
          correctAnswers: results.filter((r: Result) => r.isCorrect).length,
          totalQuestions: exercises.length
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status !== 200) {
        throw new Error("Erreur lors de la sauvegarde de la note");
      }

      // Rediriger vers le profil de l'élève
      router.push(`/eleve/${userId}`);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue lors de la sauvegarde de ton score");
    }
  };

  const isAnswerSubmitted = (exerciseId: string) => {
    const validatedExercises = JSON.parse(localStorage.getItem('music_validatedExercises') || '{}');

    return validatedExercises[exerciseId] === true;
  };

  const isAnswerCorrect = (exerciseId: string) => {
    const exerciseIndex = exercises.findIndex(ex => ex._id === exerciseId);

    return exerciseIndex !== -1 && results[exerciseIndex]?.isCorrect;
  };

  const filteredAllExercises =
    selectedCategory === "Tout"
      ? exercises
      : exercises.filter((ex) => ex.category === selectedCategory);

  const totalPages = Math.ceil(filteredAllExercises.length / questionsPerPage);
  const paginatedExercises = filteredAllExercises.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage,
  );

  // Extraction des catégories uniques
  const uniqueCategories = Array.from(
    new Set(exercises.map((ex) => ex.category)),
  );
  const categories = ["Tout", ...uniqueCategories];

  const handleRating = (exerciseId: string, value: number) => {
    setRating(value);
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
            Musique {getEmojiForCategory(selectedCategory)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Exercices interactifs
          </p>
        </motion.div>

        {/* Timer et Progression */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
          <div className="w-full sm:w-auto">
            <Timer timeLeft={timeLeft} />
          </div>
          <div className="w-full sm:w-auto flex-1">
            <ProgressBar 
              correctAnswers={completedExercises}
              totalQuestions={exercises.length}
              onProgressComplete={() => {
                if (completedExercises === exercises.length) {
                  calculateFinalScore();
                }
              }}
            />
          </div>
        </div>

        {/* Message d'encouragement */}
        {emoji && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-lg font-medium text-primary mb-4"
            initial={{ opacity: 0, y: -20 }}
          >
            {emoji}
          </motion.div>
        )}

        {/* Filtres et catégories */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            className="w-full sm:w-auto p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Tout">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Liste des exercices */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {exercises
              .filter(
                (exercise) =>
                  selectedCategory === "Tout" ||
                  exercise.category === selectedCategory
              )
              .slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage)
              .map((exercise) => (
                <Card
                  key={exercise._id}
                  className="w-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardBody className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      {/* Titre et catégorie */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {getEmojiForCategory(exercise.category)} {exercise.title}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {exercise.category}
                        </span>
                      </div>

                      {/* Image si présente */}
                      {exercise.image && (
                        <div className="relative w-full h-48 sm:h-64">
                          <Image
                            alt={exercise.title}
                            className="rounded-lg"
                            layout="fill"
                            objectFit="cover"
                            src={exercise.image}
                          />
                        </div>
                      )}

                      {/* Contenu et question */}
                      <div className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300">{exercise.content}</p>
                        <p className="font-medium">{exercise.question}</p>
                      </div>

                      {/* Options ou champ de réponse */}
                      <div className="space-y-4">
                        {exercise.options ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {exercise.options.map((option, index) => (
                              <label
                                key={index}
                                className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                              >
                                <input
                                  className="form-radio"
                                  disabled={isAnswerSubmitted(exercise._id)}
                                  name={exercise._id}
                                  type="radio"
                                  value={option}
                                  onChange={(e) => handleChange(e, exercise._id)}
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600"
                            disabled={isAnswerSubmitted(exercise._id)}
                            placeholder="Votre réponse"
                            type="text"
                            onChange={(e) => handleChange(e, exercise._id)}
                          />
                        )}
                      </div>

                      {/* Bouton de soumission et résultat */}
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <Button
                          className="w-full sm:w-auto"
                          color={isAnswerSubmitted(exercise._id) ? (isAnswerCorrect(exercise._id) ? "success" : "danger") : "primary"}
                          disabled={!userAnswers[exercise._id] || isAnswerSubmitted(exercise._id)}
                          onClick={() => handleSubmit(exercise._id, exercise.answer)}
                        >
                          {isAnswerSubmitted(exercise._id) ? (isAnswerCorrect(exercise._id) ? "Correct ✓" : "Incorrect ✗") : "Valider"}
                        </Button>

                        {isAnswerSubmitted(exercise._id) && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Noter la difficulté de cet exercice :</p>
                            <div className="grid grid-cols-5 gap-2">
                              <Button
                                className="w-full h-12 sm:h-10 flex items-center justify-center text-lg"
                                color="default"
                                size="lg"
                                variant="flat"
                                onClick={() => handleRating(exercise._id, 1)}
                              >
                                1
                              </Button>
                              <Button
                                className="w-full h-12 sm:h-10 flex items-center justify-center text-lg"
                                color="default"
                                size="lg"
                                variant="flat"
                                onClick={() => handleRating(exercise._id, 2)}
                              >
                                2
                              </Button>
                              <Button
                                className="w-full h-12 sm:h-10 flex items-center justify-center text-lg"
                                color="default"
                                size="lg"
                                variant="flat"
                                onClick={() => handleRating(exercise._id, 3)}
                              >
                                3
                              </Button>
                              <Button
                                className="w-full h-12 sm:h-10 flex items-center justify-center text-lg"
                                color="default"
                                size="lg"
                                variant="flat"
                                onClick={() => handleRating(exercise._id, 4)}
                              >
                                4
                              </Button>
                              <Button
                                className="w-full h-12 sm:h-10 flex items-center justify-center text-lg"
                                color="default"
                                size="lg"
                                variant="flat"
                                onClick={() => handleRating(exercise._id, 5)}
                              >
                                5
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <Button
            className="w-auto"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Précédent
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage} sur {Math.ceil(exercises.length / questionsPerPage)}
          </span>
          <Button
            className="w-auto"
            disabled={currentPage >= Math.ceil(exercises.length / questionsPerPage)}
            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(exercises.length / questionsPerPage), prev + 1))}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
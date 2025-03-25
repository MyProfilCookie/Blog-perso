/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";

import BackButton from "@/components/back";

// Interface pour les exercices de mathématiques
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

const MathPage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [emoji, setEmoji] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [completedExercises, setCompletedExercises] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  const [showTips, setShowTips] = useState<boolean>(true);

  // Statistiques et badges
  const [badges, setBadges] = useState<{
    perfectScore: boolean;
    streakMaster: boolean;
    mathExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    mathExpert: false,
    quickLearner: false,
  });

  // Nouvel état pour le minuteur (1 heure = 3600 secondes)
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  // Messages d'encouragement
  const encouragementMessages = [
    "🌟 Tu t'en sors très bien !",
    "💪 Continue comme ça, tu es sur la bonne voie !",
    "🎯 Reste concentré, tu fais du bon travail !",
    "✨ Tu es capable de réussir !",
    "🌈 N'hésite pas à prendre ton temps !",
    "🚀 Tu progresses bien !"
  ];

  // Gestion du minuteur et des messages d'encouragement
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let encouragementTimer: NodeJS.Timeout;

    if (isStarted && timeLeft > 0) {
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

      // Messages d'encouragement toutes les 10 minutes
      encouragementTimer = setInterval(() => {
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        setEmoji(randomMessage);
        setTimeout(() => setEmoji(""), 5000); // Le message disparaît après 5 secondes
      }, 600000); // 600000ms = 10 minutes
    }

    return () => {
      clearInterval(timer);
      clearInterval(encouragementTimer);
    };
  }, [isStarted, timeLeft]);

  // Fonction pour formater le temps restant
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const mockExercises: Exercise[] = [
      {
        id: 1,
        title: "Opérations",
        content: "Les additions simples",
        question: "Combien font 5 + 3 ?",
        options: ["8", "7", "9", "6"],
        answer: "8",
        category: "Opérations",
        difficulty: "Facile" as const
      },
      {
        id: 2,
        title: "Opérations",
        content: "Les soustractions simples",
        question: "Combien font 10 - 4 ?",
        options: ["6", "5", "7", "4"],
        answer: "6",
        category: "Opérations",
        difficulty: "Facile" as const
      },
      {
        id: 3,
        title: "Opérations",
        content: "Les multiplications simples",
        question: "Combien font 4 × 3 ?",
        options: ["12", "10", "14", "8"],
        answer: "12",
        category: "Opérations",
        difficulty: "Facile" as const
      },
      {
        id: 4,
        title: "Opérations",
        content: "Les divisions simples",
        question: "Combien font 15 ÷ 3 ?",
        options: ["5", "4", "6", "3"],
        answer: "5",
        category: "Opérations",
        difficulty: "Facile" as const
      },
      {
        id: 5,
        title: "Fractions",
        content: "Les fractions simples",
        question: "Quelle est la moitié de 10 ?",
        options: ["5", "4", "6", "3"],
        answer: "5",
        category: "Fractions",
        difficulty: "Facile" as const
      },
      {
        id: 6,
        title: "Géométrie",
        content: "Les formes simples",
        question: "Combien de côtés a un carré ?",
        options: ["4", "3", "5", "6"],
        answer: "4",
        category: "Géométrie",
        difficulty: "Facile" as const
      },
      {
        id: 7,
        title: "Mesures",
        content: "Les unités de mesure",
        question: "Combien de centimètres dans un mètre ?",
        options: ["100", "50", "200", "150"],
        answer: "100",
        category: "Mesures",
        difficulty: "Facile" as const
      },
      {
        id: 8,
        title: "Nombres",
        content: "Les nombres pairs et impairs",
        question: "Quel est le plus petit nombre pair ?",
        options: ["2", "1", "3", "4"],
        answer: "2",
        category: "Nombres",
        difficulty: "Facile" as const
      },
      {
        id: 9,
        title: "Problèmes",
        content: "Les problèmes simples",
        question: "Si j'ai 3 pommes et j'en mange 1, combien m'en reste-t-il ?",
        options: ["2", "1", "3", "4"],
        answer: "2",
        category: "Problèmes",
        difficulty: "Facile" as const
      },
      {
        id: 10,
        title: "Calcul mental",
        content: "Les calculs rapides",
        question: "Combien font 20 + 30 ?",
        options: ["50", "40", "60", "45"],
        answer: "50",
        category: "Calcul mental",
        difficulty: "Facile" as const
      },
      {
        id: 11,
        title: "Opérations",
        content: "Les additions avec retenue",
        question: "Combien font 25 + 37 ?",
        options: ["62", "61", "63", "60"],
        answer: "62",
        category: "Opérations",
        difficulty: "Moyen" as const
      },
      {
        id: 12,
        title: "Opérations",
        content: "Les soustractions avec retenue",
        question: "Combien font 45 - 28 ?",
        options: ["17", "16", "18", "15"],
        answer: "17",
        category: "Opérations",
        difficulty: "Moyen" as const
      },
      {
        id: 13,
        title: "Opérations",
        content: "Les multiplications à un chiffre",
        question: "Combien font 7 × 6 ?",
        options: ["42", "41", "43", "40"],
        answer: "42",
        category: "Opérations",
        difficulty: "Moyen" as const
      },
      {
        id: 14,
        title: "Opérations",
        content: "Les divisions avec reste",
        question: "Combien font 25 ÷ 4 ?",
        options: ["6 reste 1", "5 reste 5", "7 reste 3", "4 reste 9"],
        answer: "6 reste 1",
        category: "Opérations",
        difficulty: "Moyen" as const
      },
      {
        id: 15,
        title: "Fractions",
        content: "Les fractions équivalentes",
        question: "Quelle fraction est égale à 1/2 ?",
        options: ["2/4", "1/3", "3/6", "4/8"],
        answer: "2/4",
        category: "Fractions",
        difficulty: "Moyen" as const
      },
      {
        id: 16,
        title: "Géométrie",
        content: "Les angles",
        question: "Quel est l'angle d'un carré ?",
        options: ["90 degrés", "45 degrés", "180 degrés", "360 degrés"],
        answer: "90 degrés",
        category: "Géométrie",
        difficulty: "Moyen" as const
      },
      {
        id: 17,
        title: "Mesures",
        content: "Les conversions",
        question: "Combien de mètres dans 2 kilomètres ?",
        options: ["2000", "1000", "3000", "1500"],
        answer: "2000",
        category: "Mesures",
        difficulty: "Moyen" as const
      },
      {
        id: 18,
        title: "Nombres",
        content: "Les nombres décimaux",
        question: "Quel est le nombre décimal pour 1/2 ?",
        options: ["0,5", "0,2", "0,8", "0,3"],
        answer: "0,5",
        category: "Nombres",
        difficulty: "Moyen" as const
      },
      {
        id: 19,
        title: "Problèmes",
        content: "Les problèmes à étapes",
        question: "Si j'ai 5 bonbons et j'en donne 2 à mon ami, combien m'en reste-t-il ?",
        options: ["3", "2", "4", "1"],
        answer: "3",
        category: "Problèmes",
        difficulty: "Moyen" as const
      },
      {
        id: 20,
        title: "Calcul mental",
        content: "Les calculs rapides",
        question: "Combien font 100 - 25 ?",
        options: ["75", "70", "80", "65"],
        answer: "75",
        category: "Calcul mental",
        difficulty: "Moyen" as const
      },
      {
        id: 21,
        title: "Opérations",
        content: "Les additions de grands nombres",
        question: "Combien font 234 + 567 ?",
        options: ["801", "800", "802", "799"],
        answer: "801",
        category: "Opérations",
        difficulty: "Difficile" as const
      },
      {
        id: 22,
        title: "Opérations",
        content: "Les soustractions de grands nombres",
        question: "Combien font 789 - 456 ?",
        options: ["333", "332", "334", "331"],
        answer: "333",
        category: "Opérations",
        difficulty: "Difficile" as const
      },
      {
        id: 23,
        title: "Opérations",
        content: "Les multiplications à deux chiffres",
        question: "Combien font 12 × 11 ?",
        options: ["132", "131", "133", "130"],
        answer: "132",
        category: "Opérations",
        difficulty: "Difficile" as const
      },
      {
        id: 24,
        title: "Opérations",
        content: "Les divisions à deux chiffres",
        question: "Combien font 144 ÷ 12 ?",
        options: ["12", "11", "13", "10"],
        answer: "12",
        category: "Opérations",
        difficulty: "Difficile" as const
      },
      {
        id: 25,
        title: "Fractions",
        content: "Les fractions complexes",
        question: "Quelle fraction est égale à 3/4 ?",
        options: ["6/8", "4/6", "8/10", "5/7"],
        answer: "6/8",
        category: "Fractions",
        difficulty: "Difficile" as const
      },
      {
        id: 26,
        title: "Géométrie",
        content: "Les périmètres",
        question: "Quel est le périmètre d'un carré de 5 cm de côté ?",
        options: ["20 cm", "15 cm", "25 cm", "10 cm"],
        answer: "20 cm",
        category: "Géométrie",
        difficulty: "Difficile" as const
      },
      {
        id: 27,
        title: "Mesures",
        content: "Les conversions complexes",
        question: "Combien de centimètres dans 2,5 mètres ?",
        options: ["250", "200", "300", "150"],
        answer: "250",
        category: "Mesures",
        difficulty: "Difficile" as const
      },
      {
        id: 28,
        title: "Nombres",
        content: "Les nombres négatifs",
        question: "Quel est le résultat de -5 + 3 ?",
        options: ["-2", "-1", "-3", "-4"],
        answer: "-2",
        category: "Nombres",
        difficulty: "Difficile" as const
      },
      {
        id: 29,
        title: "Problèmes",
        content: "Les problèmes complexes",
        question: "Si j'ai 20 bonbons et j'en donne 3 à chaque ami, combien d'amis peuvent en avoir ?",
        options: ["6", "5", "7", "4"],
        answer: "6",
        category: "Problèmes",
        difficulty: "Difficile" as const
      },
      {
        id: 30,
        title: "Calcul mental",
        content: "Les calculs rapides complexes",
        question: "Combien font 1000 - 333 ?",
        options: ["667", "666", "668", "665"],
        answer: "667",
        category: "Calcul mental",
        difficulty: "Difficile" as const
      }
    ];
    setExercises(mockExercises);
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = (id: number, correctAnswer: string) => {
    const userAnswer = userAnswers[id];
    const isCorrect = userAnswer?.toString().trim().toLowerCase() === correctAnswer.toLowerCase();

    setResults({ ...results, [id]: isCorrect });
    
    if (isCorrect) {
      setCompletedExercises(prev => prev + 1);
      setTotalPoints(prev => prev + 10);
      setCurrentStreak(prev => prev + 1);
    } else {
      setCurrentStreak(0);
    }
  };

  const calculateFinalScore = () => {
    const total = exercises.length;
    const correct = Object.values(results).filter(Boolean).length;
    const score = (correct / total) * 100;

    setFinalScore(score);
    setShowResults(true);

    // Mise à jour des badges
    setBadges(prev => ({
      ...prev,
      perfectScore: score === 100,
      streakMaster: currentStreak >= 5,
      mathExpert: completedExercises >= 10,
      quickLearner: score >= 80 && completedExercises >= 5,
    }));

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

  const filteredExercises = selectedCategory === "Tout" 
    ? exercises 
    : exercises.filter(ex => ex.category && ex.category === selectedCategory);

  // Extraction des catégories uniques
  const uniqueCategories = exercises
    .map(ex => ex.category)
    .filter((category): category is string => Boolean(category));
  const categories = ["Tout", ...Array.from(new Set(uniqueCategories))];

  if (loading) {
    return (
      <motion.div 
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-spin text-4xl">🔄</div>
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
    <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6 relative">
        <div className="absolute left-4 top-0 z-10">
      <BackButton />
        </div>
        <motion.div 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
            Mathématiques
        </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Exercices de mathématiques
          </p>
        </motion.div>
      </div>

      {/* Minuteur et bouton de démarrage */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-violet-200">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-violet-600 dark:text-violet-400">
              Temps restant : {formatTime(timeLeft)}
            </div>
            {!isStarted && (
              <Button
                className="bg-violet-500 text-white hover:bg-violet-600"
                onClick={() => setIsStarted(true)}
              >
                Commencer
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Message d'encouragement */}
      {emoji && (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-violet-200"
          initial={{ opacity: 0, y: -20 }}
        >
          <p className="text-lg">{emoji}</p>
        </motion.div>
      )}

      {/* Statistiques rapides */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200"
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📚</span>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Exercices complétés</p>
                <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">{completedExercises}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200"
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🔥</span>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Série actuelle</p>
                <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">{currentStreak}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200"
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🎯</span>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Points gagnés</p>
                <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">{totalPoints}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200"
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">⭐</span>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Badges débloqués</p>
                <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">
                  {Object.values(badges).filter(Boolean).length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filtres et conseils */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtre par catégorie */}
          <div className="flex-1">
            <select
              className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg border border-violet-200"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton pour afficher/masquer les conseils */}
          <Button
            className="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
            onClick={() => setShowTips(!showTips)}
          >
            {showTips ? "Masquer les conseils" : "Afficher les conseils"}
          </Button>
        </div>

        {/* Section des conseils */}
        {showTips && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-bold text-violet-600 dark:text-violet-400 mb-2">Conseils pour réussir :</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Lisez attentivement les énoncés</li>
              <li>Utilisez du papier brouillon pour vos calculs</li>
              <li>Vérifiez vos résultats avant de les soumettre</li>
              <li>Maintenez une série de bonnes réponses pour gagner plus de points</li>
            </ul>
          </motion.div>
        )}
      </div>

      {/* Grille d'exercices */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6">
        <motion.div
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
          {filteredExercises.map((exercise, index) => (
            <motion.div
            key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="w-full h-full bg-white dark:bg-gray-800 shadow-lg border border-violet-200">
                <CardBody className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                {exercise.title}
              </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{exercise.content}</p>
                  <p className="font-medium mb-4">{exercise.question}</p>

              {exercise.image && (
                    <div className="mb-4">
                <Image
                  alt={exercise.title}
                        className="rounded-lg object-cover w-full h-48"
                        height={200}
                  src={`/assets/math/${exercise.image}`}
                        width={300}
                      />
                    </div>
                  )}

                  {exercise.options ? (
                    <select
                      className="w-full p-2 mb-4 bg-white dark:bg-gray-700 rounded-lg border border-violet-200"
                      disabled={results[exercise.id] !== undefined}
                      value={userAnswers[exercise.id] || ""}
                      onChange={(e) => handleChange(e, exercise.id)}
                    >
                      <option value="">Sélectionnez une option</option>
                      {exercise.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
              <input
                      className="w-full p-2 mb-4 bg-white dark:bg-gray-700 rounded-lg border border-violet-200"
                disabled={results[exercise.id] !== undefined}
                placeholder="Votre réponse"
                type="text"
                value={userAnswers[exercise.id] || ""}
                onChange={(e) => handleChange(e, exercise.id)}
              />
                  )}

                  <Button
                    className="w-full bg-violet-500 text-white hover:bg-violet-600"
                disabled={results[exercise.id] !== undefined}
                onClick={() => handleSubmit(exercise.id, exercise.answer)}
              >
                Soumettre
                  </Button>

              {results[exercise.id] !== undefined && (
                    <motion.p
                      animate={{ opacity: 1 }}
                      className={`mt-2 text-center ${
                        results[exercise.id] ? "text-green-500" : "text-red-500"
                      }`}
                      initial={{ opacity: 0 }}
                    >
                      {results[exercise.id] ? "Bonne réponse !" : "Mauvaise réponse, réessayez."}
                    </motion.p>
              )}
            </CardBody>
          </Card>
            </motion.div>
        ))}
      </motion.div>
      </div>

      {/* Section des résultats */}
      {showResults && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          initial={{ opacity: 0, y: 20 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-violet-600 dark:text-violet-400 mb-4">
              Résultats {emoji}
          </h2>
            <p className="text-center text-xl mb-6">
              Score final : {finalScore?.toFixed(1)}%
            </p>
            <div className="space-y-4">
              {badges.perfectScore && (
                <div className="flex items-center gap-2 text-yellow-500">
                  <span>🌟</span>
                  <p>Score parfait !</p>
                </div>
              )}
              {badges.streakMaster && (
                <div className="flex items-center gap-2 text-orange-500">
                  <span>🔥</span>
                  <p>Maître des séries !</p>
                </div>
              )}
              {badges.mathExpert && (
                <div className="flex items-center gap-2 text-blue-500">
                  <span>🎓</span>
                  <p>Expert en mathématiques !</p>
                </div>
              )}
              {badges.quickLearner && (
                <div className="flex items-center gap-2 text-green-500">
                  <span>⚡</span>
                  <p>Apprenant rapide !</p>
                </div>
              )}
            </div>
            <Button
              className="w-full mt-6 bg-violet-500 text-white hover:bg-violet-600"
              onClick={() => setShowResults(false)}
            >
              Fermer
            </Button>
        </div>
        </motion.div>
      )}

      {/* Bouton de calcul du score final */}
      <div className="mt-8">
        <Button
          className="bg-violet-500 text-white hover:bg-violet-600"
          onClick={calculateFinalScore}
        >
          Calculer le score final
        </Button>
      </div>
    </section>
  );
};

export default MathPage;

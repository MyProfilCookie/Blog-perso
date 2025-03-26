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

// Interface pour les exercices de langues
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

const LanguagePage: React.FC = () => {
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
    languageExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    languageExpert: false,
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

  // Données statiques pour les exercices de langues
  const mockExercises: Exercise[] = [
    {
      id: 1,
      title: "Vocabulaire Anglais",
      content: "Apprenez des mots courants en anglais",
      question: "Comment dit-on 'Bonjour' en anglais ?",
      options: ["Hello", "Goodbye", "Thank you", "Please"],
      answer: "Hello",
      difficulty: "Facile" as const,
      category: "Anglais"
    },
    {
      id: 2,
      title: "Grammaire Espagnole",
      content: "Exercices de conjugaison en espagnol",
      question: "Comment conjugue-t-on 'ser' (être) à la première personne du singulier ?",
      options: ["soy", "eres", "es", "somos"],
      answer: "soy",
      difficulty: "Moyen" as const,
      category: "Espagnol"
    },
    {
      id: 3,
      title: "Expressions Allemandes",
      content: "Expressions courantes en allemand",
      question: "Que signifie 'Guten Morgen' ?",
      options: ["Bonjour", "Au revoir", "Merci", "S'il vous plaît"],
      answer: "Bonjour",
      difficulty: "Facile" as const,
      category: "Allemand"
    },
    {
      id: 4,
      title: "Prononciation Italienne",
      content: "Exercices de prononciation en italien",
      question: "Comment se prononce 'Ciao' ?",
      options: ["Tchao", "Siao", "Kiao", "Chao"],
      answer: "Tchao",
      difficulty: "Facile" as const,
      category: "Italien"
    },
    {
      id: 5,
      title: "Vocabulaire Anglais",
      content: "Apprenez des mots courants en anglais",
      question: "Comment dit-on 'Au revoir' en anglais ?",
      options: ["Goodbye", "Hello", "Thank you", "Please"],
      answer: "Goodbye",
      difficulty: "Facile" as const,
      category: "Anglais"
    },
    {
      id: 6,
      title: "Grammaire Espagnole",
      content: "Exercices de conjugaison en espagnol",
      question: "Comment conjugue-t-on 'ser' (être) à la deuxième personne du singulier ?",
      options: ["soy", "eres", "es", "somos"],
      answer: "eres",
      difficulty: "Moyen" as const,
      category: "Espagnol"
    },
    {
      id: 7,
      title: "Expressions Allemandes",
      content: "Expressions courantes en allemand",
      question: "Que signifie 'Auf Wiedersehen' ?",
      options: ["Bonjour", "Au revoir", "Merci", "S'il vous plaît"],
      answer: "Au revoir",
      difficulty: "Facile" as const,
      category: "Allemand"
    },
    {
      id: 8,
      title: "Prononciation Italienne",
      content: "Exercices de prononciation en italien",
      question: "Comment se prononce 'Grazie' ?",
      options: ["Gratzié", "Gratzi", "Gratziéé", "Gratziééé"],
      answer: "Gratzié",
      difficulty: "Facile" as const,
      category: "Italien"
    },
    {
      id: 9,
      title: "Vocabulaire Anglais",
      content: "Apprenez des mots courants en anglais",
      question: "Comment dit-on 'Merci' en anglais ?",
      options: ["Thank you", "Hello", "Goodbye", "Please"],
      answer: "Thank you",
      difficulty: "Facile" as const,
      category: "Anglais"
    },
    {
      id: 10,
      title: "Grammaire Espagnole",
      content: "Exercices de conjugaison en espagnol",
      question: "Comment conjugue-t-on 'ser' (être) à la troisième personne du singulier ?",
      options: ["soy", "eres", "es", "somos"],
      answer: "es",
      difficulty: "Moyen" as const,
      category: "Espagnol"
    },
    {
      id: 11,
      title: "Expressions Allemandes",
      content: "Expressions courantes en allemand",
      question: "Que signifie 'Danke' ?",
      options: ["Bonjour", "Au revoir", "Merci", "S'il vous plaît"],
      answer: "Merci",
      difficulty: "Facile" as const,
      category: "Allemand"
    },
    {
      id: 12,
      title: "Prononciation Italienne",
      content: "Exercices de prononciation en italien",
      question: "Comment se prononce 'Prego' ?",
      options: ["Prégo", "Préégo", "Prééégo", "Préééégo"],
      answer: "Prégo",
      difficulty: "Facile" as const,
      category: "Italien"
    },
    {
      id: 13,
      title: "Vocabulaire Anglais",
      content: "Apprenez des mots courants en anglais",
      question: "Comment dit-on 'S'il vous plaît' en anglais ?",
      options: ["Please", "Hello", "Goodbye", "Thank you"],
      answer: "Please",
      difficulty: "Facile" as const,
      category: "Anglais"
    },
    {
      id: 14,
      title: "Grammaire Espagnole",
      content: "Exercices de conjugaison en espagnol",
      question: "Comment conjugue-t-on 'ser' (être) à la première personne du pluriel ?",
      options: ["soy", "eres", "es", "somos"],
      answer: "somos",
      difficulty: "Moyen" as const,
      category: "Espagnol"
    },
    {
      id: 15,
      title: "Expressions Allemandes",
      content: "Expressions courantes en allemand",
      question: "Que signifie 'Bitte' ?",
      options: ["Bonjour", "Au revoir", "Merci", "S'il vous plaît"],
      answer: "S'il vous plaît",
      difficulty: "Facile" as const,
      category: "Allemand"
    },
    {
      id: 16,
      title: "Vocabulaire Anglais",
      content: "Apprenez des mots courants en anglais",
      question: "Comment dit-on 'Comment allez-vous ?' en anglais ?",
      options: ["How are you?", "Hello", "Goodbye", "Thank you"],
      answer: "How are you?",
      difficulty: "Moyen" as const,
      category: "Anglais"
    },
    {
      id: 17,
      title: "Grammaire Espagnole",
      content: "Exercices de conjugaison en espagnol",
      question: "Comment conjugue-t-on 'estar' (être) à la première personne du singulier ?",
      options: ["estoy", "estás", "está", "estamos"],
      answer: "estoy",
      difficulty: "Moyen" as const,
      category: "Espagnol"
    },
    {
      id: 18,
      title: "Expressions Allemandes",
      content: "Expressions courantes en allemand",
      question: "Que signifie 'Wie geht es Ihnen?' ?",
      options: ["Bonjour", "Comment allez-vous?", "Merci", "S'il vous plaît"],
      answer: "Comment allez-vous?",
      difficulty: "Moyen" as const,
      category: "Allemand"
    },
    {
      id: 19,
      title: "Vocabulaire Anglais",
      content: "Apprenez des mots courants en anglais",
      question: "Comment dit-on 'Je m'appelle' en anglais ?",
      options: ["My name is", "Hello", "Goodbye", "Thank you"],
      answer: "My name is",
      difficulty: "Moyen" as const,
      category: "Anglais"
    },
    {
      id: 20,
      title: "Grammaire Espagnole",
      content: "Exercices de conjugaison en espagnol",
      question: "Comment conjugue-t-on 'estar' (être) à la deuxième personne du singulier ?",
      options: ["estoy", "estás", "está", "estamos"],
      answer: "estás",
      difficulty: "Moyen" as const,
      category: "Espagnol"
    },
    {
      id: 21,
      title: "Expressions Allemandes",
      content: "Expressions courantes en allemand",
      question: "Que signifie 'Ich heiße' ?",
      options: ["Bonjour", "Je m'appelle", "Merci", "S'il vous plaît"],
      answer: "Je m'appelle",
      difficulty: "Moyen" as const,
      category: "Allemand"
    },
    {
      id: 22,
      title: "Vocabulaire Anglais",
      content: "Apprenez des mots courants en anglais",
      question: "Comment dit-on 'Enchanté' en anglais ?",
      options: ["Nice to meet you", "Hello", "Goodbye", "Thank you"],
      answer: "Nice to meet you",
      difficulty: "Moyen" as const,
      category: "Anglais"
    },
    {
      id: 23,
      title: "Grammaire Espagnole",
      content: "Exercices de conjugaison en espagnol",
      question: "Comment conjugue-t-on 'estar' (être) à la troisième personne du singulier ?",
      options: ["estoy", "estás", "está", "estamos"],
      answer: "está",
      difficulty: "Moyen" as const,
      category: "Espagnol"
    },
    {
      id: 24,
      title: "Expressions Allemandes",
      content: "Expressions courantes en allemand",
      question: "Que signifie 'Freut mich' ?",
      options: ["Bonjour", "Enchanté", "Merci", "S'il vous plaît"],
      answer: "Enchanté",
      difficulty: "Moyen" as const,
      category: "Allemand"
    },
    {
      id: 25,
      title: "Vocabulaire Anglais",
      content: "Apprenez des mots courants en anglais",
      question: "Comment dit-on 'À bientôt' en anglais ?",
      options: ["See you soon", "Hello", "Goodbye", "Thank you"],
      answer: "See you soon",
      difficulty: "Moyen" as const,
      category: "Anglais"
    },
    {
      id: 26,
      title: "Grammaire Espagnole",
      content: "Exercices de conjugaison en espagnol",
      question: "Comment conjugue-t-on 'estar' (être) à la première personne du pluriel ?",
      options: ["estoy", "estás", "está", "estamos"],
      answer: "estamos",
      difficulty: "Moyen" as const,
      category: "Espagnol"
    },
    {
      id: 27,
      title: "Expressions Allemandes",
      content: "Expressions courantes en allemand",
      question: "Que signifie 'Bis bald' ?",
      options: ["Bonjour", "À bientôt", "Merci", "S'il vous plaît"],
      answer: "À bientôt",
      difficulty: "Moyen" as const,
      category: "Allemand"
    },
    {
      id: 28,
      title: "Vocabulaire Anglais",
      content: "Apprenez des mots courants en anglais",
      question: "Comment dit-on 'Bonne nuit' en anglais ?",
      options: ["Good night", "Hello", "Goodbye", "Thank you"],
      answer: "Good night",
      difficulty: "Facile" as const,
      category: "Anglais"
    },
    {
      id: 29,
      title: "Grammaire Espagnole",
      content: "Exercices de conjugaison en espagnol",
      question: "Comment conjugue-t-on 'tener' (avoir) à la première personne du singulier ?",
      options: ["tengo", "tienes", "tiene", "tenemos"],
      answer: "tengo",
      difficulty: "Difficile" as const,
      category: "Espagnol"
    },
    {
      id: 30,
      title: "Expressions Allemandes",
      content: "Expressions courantes en allemand",
      question: "Que signifie 'Gute Nacht' ?",
      options: ["Bonjour", "Bonne nuit", "Merci", "S'il vous plaît"],
      answer: "Bonne nuit",
      difficulty: "Facile" as const,
      category: "Allemand"
    }
  ];

  useEffect(() => {
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
      languageExpert: completedExercises >= 10,
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
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex-1 w-full max-w-7xl mx-auto">
        <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6 relative">
            <motion.div 
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 sm:mb-6"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                Langues
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices de langues
              </p>
            </motion.div>
            <div className="flex justify-center mb-4">
              <BackButton />
            </div>
            <div className="w-full max-w-3xl mx-auto">
              <ProgressBar 
                initialProgress={0}
                onProgressComplete={() => {
                  // Vous pouvez ajouter une action lorsque la progression est terminée
                  console.log("Progression terminée !");
                }}
              />
            </div>
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
                  <li>Lisez attentivement les questions et les textes</li>
                  <li>Faites attention à la grammaire et au vocabulaire</li>
                  <li>Utilisez le contexte pour comprendre le sens</li>
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
                            src={`/assets/language/${exercise.image}`}
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
                  {badges.languageExpert && (
                    <div className="flex items-center gap-2 text-blue-500">
                      <span>🎓</span>
                      <p>Expert en langues !</p>
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
      </div>

      <Timer />
    </div>
  );
};

export default LanguagePage;

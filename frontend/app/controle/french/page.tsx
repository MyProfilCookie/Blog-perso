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

// Interface pour les exercices de français
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

const FrenchPage: React.FC = () => {
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
    frenchExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    frenchExpert: false,
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
        title: "Grammaire",
        content: "Les articles simples",
        question: "Quel article utilise-t-on devant 'chat' ?",
        options: ["un", "une", "des", "le"],
        answer: "un",
        category: "Grammaire",
        difficulty: "Facile" as const
      },
      {
        id: 2,
        title: "Grammaire",
        content: "Les articles simples",
        question: "Quel article utilise-t-on devant 'table' ?",
        options: ["une", "un", "des", "la"],
        answer: "une",
        category: "Grammaire",
        difficulty: "Facile" as const
      },
      {
        id: 3,
        title: "Conjugaison",
        content: "Le présent simple",
        question: "Comment conjugue-t-on 'être' à la première personne ?",
        options: ["je suis", "je es", "je être", "je est"],
        answer: "je suis",
        category: "Conjugaison",
        difficulty: "Facile" as const
      },
      {
        id: 4,
        title: "Conjugaison",
        content: "Le présent simple",
        question: "Comment conjugue-t-on 'avoir' à la première personne ?",
        options: ["j'ai", "je ai", "je a", "j'as"],
        answer: "j'ai",
        category: "Conjugaison",
        difficulty: "Facile" as const
      },
      {
        id: 5,
        title: "Orthographe",
        content: "Les mots simples",
        question: "Comment écrit-on le mot 'chat' au pluriel ?",
        options: ["chats", "chats", "chats", "chats"],
        answer: "chats",
        category: "Orthographe",
        difficulty: "Facile" as const
      },
      {
        id: 6,
        title: "Orthographe",
        content: "Les mots simples",
        question: "Comment écrit-on le mot 'table' au pluriel ?",
        options: ["tables", "tables", "tables", "tables"],
        answer: "tables",
        category: "Orthographe",
        difficulty: "Facile" as const
      },
      {
        id: 7,
        title: "Vocabulaire",
        content: "Les mots du quotidien",
        question: "Quel mot désigne un animal qui miaule ?",
        options: ["chat", "chien", "oiseau", "lapin"],
        answer: "chat",
        category: "Vocabulaire",
        difficulty: "Facile" as const
      },
      {
        id: 8,
        title: "Vocabulaire",
        content: "Les mots du quotidien",
        question: "Quel mot désigne un objet sur lequel on mange ?",
        options: ["table", "chaise", "lit", "armoire"],
        answer: "table",
        category: "Vocabulaire",
        difficulty: "Facile" as const
      },
      {
        id: 9,
        title: "Grammaire",
        content: "Les adjectifs simples",
        question: "Quel adjectif utilise-t-on pour décrire un chat ?",
        options: ["petit", "grand", "gros", "mince"],
        answer: "petit",
        category: "Grammaire",
        difficulty: "Facile" as const
      },
      {
        id: 10,
        title: "Grammaire",
        content: "Les adjectifs simples",
        question: "Quel adjectif utilise-t-on pour décrire une table ?",
        options: ["grande", "petite", "grosse", "mince"],
        answer: "grande",
        category: "Grammaire",
        difficulty: "Facile" as const
      },
      {
        id: 11,
        title: "Conjugaison",
        content: "Le présent des verbes simples",
        question: "Comment conjugue-t-on 'manger' à la première personne ?",
        options: ["je mange", "je manges", "je mangé", "je mangés"],
        answer: "je mange",
        category: "Conjugaison",
        difficulty: "Moyen" as const
      },
      {
        id: 12,
        title: "Conjugaison",
        content: "Le présent des verbes simples",
        question: "Comment conjugue-t-on 'boire' à la première personne ?",
        options: ["je bois", "je boit", "je boire", "je boires"],
        answer: "je bois",
        category: "Conjugaison",
        difficulty: "Moyen" as const
      },
      {
        id: 13,
        title: "Orthographe",
        content: "Les accords simples",
        question: "Comment écrit-on 'un petit chat' au pluriel ?",
        options: ["des petits chats", "des petit chats", "des petits chat", "des petit chat"],
        answer: "des petits chats",
        category: "Orthographe",
        difficulty: "Moyen" as const
      },
      {
        id: 14,
        title: "Orthographe",
        content: "Les accords simples",
        question: "Comment écrit-on 'une grande table' au pluriel ?",
        options: ["des grandes tables", "des grande tables", "des grandes table", "des grande table"],
        answer: "des grandes tables",
        category: "Orthographe",
        difficulty: "Moyen" as const
      },
      {
        id: 15,
        title: "Vocabulaire",
        content: "Les expressions simples",
        question: "Quelle expression utilise-t-on pour dire 'bonjour' ?",
        options: ["bonjour", "au revoir", "merci", "s'il vous plaît"],
        answer: "bonjour",
        category: "Vocabulaire",
        difficulty: "Moyen" as const
      },
      {
        id: 16,
        title: "Vocabulaire",
        content: "Les expressions simples",
        question: "Quelle expression utilise-t-on pour dire 'merci' ?",
        options: ["merci", "bonjour", "au revoir", "s'il vous plaît"],
        answer: "merci",
        category: "Vocabulaire",
        difficulty: "Moyen" as const
      },
      {
        id: 17,
        title: "Grammaire",
        content: "Les pronoms simples",
        question: "Quel pronom utilise-t-on pour parler de soi ?",
        options: ["je", "tu", "il", "elle"],
        answer: "je",
        category: "Grammaire",
        difficulty: "Moyen" as const
      },
      {
        id: 18,
        title: "Grammaire",
        content: "Les pronoms simples",
        question: "Quel pronom utilise-t-on pour parler à quelqu'un ?",
        options: ["tu", "je", "il", "elle"],
        answer: "tu",
        category: "Grammaire",
        difficulty: "Moyen" as const
      },
      {
        id: 19,
        title: "Conjugaison",
        content: "Le présent des verbes irréguliers",
        question: "Comment conjugue-t-on 'aller' à la première personne ?",
        options: ["je vais", "je va", "je aller", "je allés"],
        answer: "je vais",
        category: "Conjugaison",
        difficulty: "Moyen" as const
      },
      {
        id: 20,
        title: "Conjugaison",
        content: "Le présent des verbes irréguliers",
        question: "Comment conjugue-t-on 'faire' à la première personne ?",
        options: ["je fais", "je fait", "je faire", "je faits"],
        answer: "je fais",
        category: "Conjugaison",
        difficulty: "Moyen" as const
      },
      {
        id: 21,
        title: "Orthographe",
        content: "Les accords complexes",
        question: "Comment écrit-on 'un chat noir et blanc' au pluriel ?",
        options: ["des chats noirs et blancs", "des chat noirs et blancs", "des chats noir et blanc", "des chat noir et blanc"],
        answer: "des chats noirs et blancs",
        category: "Orthographe",
        difficulty: "Difficile" as const
      },
      {
        id: 22,
        title: "Orthographe",
        content: "Les accords complexes",
        question: "Comment écrit-on 'une table en bois' au pluriel ?",
        options: ["des tables en bois", "des table en bois", "des tables en bois", "des table en bois"],
        answer: "des tables en bois",
        category: "Orthographe",
        difficulty: "Difficile" as const
      },
      {
        id: 23,
        title: "Vocabulaire",
        content: "Les expressions complexes",
        question: "Quelle expression utilise-t-on pour dire 'au revoir' ?",
        options: ["au revoir", "bonjour", "merci", "s'il vous plaît"],
        answer: "au revoir",
        category: "Vocabulaire",
        difficulty: "Difficile" as const
      },
      {
        id: 24,
        title: "Vocabulaire",
        content: "Les expressions complexes",
        question: "Quelle expression utilise-t-on pour dire 's'il vous plaît' ?",
        options: ["s'il vous plaît", "bonjour", "merci", "au revoir"],
        answer: "s'il vous plaît",
        category: "Vocabulaire",
        difficulty: "Difficile" as const
      },
      {
        id: 25,
        title: "Grammaire",
        content: "Les temps simples",
        question: "Comment conjugue-t-on 'être' au futur simple ?",
        options: ["je serai", "je suis", "je étais", "je suis"],
        answer: "je serai",
        category: "Grammaire",
        difficulty: "Difficile" as const
      },
      {
        id: 26,
        title: "Grammaire",
        content: "Les temps simples",
        question: "Comment conjugue-t-on 'avoir' au futur simple ?",
        options: ["j'aurai", "j'ai", "j'avais", "j'ai"],
        answer: "j'aurai",
        category: "Grammaire",
        difficulty: "Difficile" as const
      },
      {
        id: 27,
        title: "Conjugaison",
        content: "Le passé composé",
        question: "Comment conjugue-t-on 'manger' au passé composé ?",
        options: ["j'ai mangé", "je mange", "je mangé", "j'ai mange"],
        answer: "j'ai mangé",
        category: "Conjugaison",
        difficulty: "Difficile" as const
      },
      {
        id: 28,
        title: "Conjugaison",
        content: "Le passé composé",
        question: "Comment conjugue-t-on 'boire' au passé composé ?",
        options: ["j'ai bu", "je bois", "je bu", "j'ai bois"],
        answer: "j'ai bu",
        category: "Conjugaison",
        difficulty: "Difficile" as const
      },
      {
        id: 29,
        title: "Orthographe",
        content: "Les accords particuliers",
        question: "Comment écrit-on 'un chat qui mange' ?",
        options: ["un chat qui mange", "un chat qui mangent", "un chat qui mangé", "un chat qui mangés"],
        answer: "un chat qui mange",
        category: "Orthographe",
        difficulty: "Difficile" as const
      },
      {
        id: 30,
        title: "Orthographe",
        content: "Les accords particuliers",
        question: "Comment écrit-on 'une table qui brille' ?",
        options: ["une table qui brille", "une table qui brillent", "une table qui brillé", "une table qui brillés"],
        answer: "une table qui brille",
        category: "Orthographe",
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
      frenchExpert: completedExercises >= 10,
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
                Français
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices de français
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
                  <li>Lisez attentivement chaque question</li>
                  <li>Prenez votre temps pour réfléchir</li>
                  <li>Vérifiez vos réponses avant de soumettre</li>
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
                  src={`/assets/french/${exercise.image}`}
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
                  {badges.frenchExpert && (
                    <div className="flex items-center gap-2 text-blue-500">
                      <span>🎓</span>
                      <p>Expert en français !</p>
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

export default FrenchPage;

/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { useRouter } from "next/navigation";

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
  category: string;
}

const FrenchPage: React.FC = () => {
  const router = useRouter();
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
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isFinished, setIsFinished] = useState(false);

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

  // Messages d'encouragement
  const encouragementMessages = [
    "📚 Excellent travail en français !",
    "✍️ Ta maîtrise de la langue s'améliore !",
    "🎯 Continue sur cette lancée !",
    "💫 Tu progresses très bien !",
    "🌟 Ta grammaire est de plus en plus précise !",
    "🚀 Tu es sur la bonne voie !"
  ];

  useEffect(() => {
    const loadExercises = () => {
      try {
        // Données statiques pour les exercices de français
        const mockExercises: Exercise[] = [
          {
            id: 1,
            title: "Conjugaison",
            content: "Les verbes du premier groupe",
            question: "Comment conjugue-t-on le verbe 'chanter' au présent à la première personne du singulier ?",
            options: ["je chante", "je chantes", "je chantent", "je chantons"],
            answer: "je chante",
            difficulty: "Facile",
            category: "Conjugaison"
          },
          {
            id: 2,
            title: "Vocabulaire",
            content: "Les couleurs",
            question: "Quelle est la couleur du ciel ?",
            options: ["Bleu", "Rouge", "Vert", "Jaune"],
            answer: "Bleu",
            category: "Vocabulaire",
            difficulty: "Facile" as const
          },
          {
            id: 3,
            title: "Vocabulaire",
            content: "Les objets",
            question: "Sur quoi s'assoit-on ?",
            options: ["La chaise", "La table", "Le lit", "L'armoire"],
            answer: "La chaise",
            category: "Vocabulaire",
            difficulty: "Facile" as const
          },
          {
            id: 4,
            title: "Vocabulaire",
            content: "Les aliments",
            question: "Quel fruit est rouge ?",
            options: ["La pomme", "La banane", "L'orange", "Le citron"],
            answer: "La pomme",
            category: "Vocabulaire",
            difficulty: "Facile" as const
          },
          {
            id: 5,
            title: "Vocabulaire",
            content: "Les vêtements",
            question: "Que met-on sur la tête ?",
            options: ["Le chapeau", "Les chaussures", "Le pantalon", "La chemise"],
            answer: "Le chapeau",
            category: "Vocabulaire",
            difficulty: "Facile" as const
          },
          {
            id: 6,
            title: "Vocabulaire",
            content: "Les émotions",
            question: "Quand on est content, on est...",
            options: ["Heureux", "Triste", "En colère", "Fatigué"],
            answer: "Heureux",
            category: "Vocabulaire",
            difficulty: "Facile" as const
          },
          {
            id: 7,
            title: "Vocabulaire",
            content: "Les actions",
            question: "Que fait-on quand on a soif ?",
            options: ["On boit", "On mange", "On dort", "On marche"],
            answer: "On boit",
            category: "Vocabulaire",
            difficulty: "Facile" as const
          },
          {
            id: 8,
            title: "Vocabulaire",
            content: "Les lieux",
            question: "Où va-t-on pour manger ?",
            options: ["La cuisine", "La salle de bain", "Le garage", "Le jardin"],
            answer: "La cuisine",
            category: "Vocabulaire",
            difficulty: "Facile" as const
          },
          {
            id: 9,
            title: "Vocabulaire",
            content: "Les saisons",
            question: "Quelle saison est la plus chaude ?",
            options: ["L'été", "L'hiver", "Le printemps", "L'automne"],
            answer: "L'été",
            category: "Vocabulaire",
            difficulty: "Facile" as const
          },
          {
            id: 10,
            title: "Vocabulaire",
            content: "Les jours",
            question: "Quel jour vient après lundi ?",
            options: ["Mardi", "Mercredi", "Jeudi", "Vendredi"],
            answer: "Mardi",
            category: "Vocabulaire",
            difficulty: "Facile" as const
          },
          {
            id: 11,
            title: "Grammaire",
            content: "Les articles",
            question: "Quel article utilise-t-on devant 'chat' ?",
            options: ["Le", "La", "Les", "L'"],
            answer: "Le",
            category: "Grammaire",
            difficulty: "Facile" as const
          },
          {
            id: 12,
            title: "Grammaire",
            content: "Les articles",
            question: "Quel article utilise-t-on devant 'école' ?",
            options: ["L'", "Le", "La", "Les"],
            answer: "L'",
            category: "Grammaire",
            difficulty: "Facile" as const
          },
          {
            id: 13,
            title: "Grammaire",
            content: "Les verbes",
            question: "Comment conjugue-t-on 'être' à la première personne ?",
            options: ["Je suis", "Je es", "Je être", "Je suis"],
            answer: "Je suis",
            category: "Grammaire",
            difficulty: "Moyen" as const
          },
          {
            id: 14,
            title: "Grammaire",
            content: "Les verbes",
            question: "Comment conjugue-t-on 'avoir' à la première personne ?",
            options: ["J'ai", "Je as", "Je avoir", "Je a"],
            answer: "J'ai",
            category: "Grammaire",
            difficulty: "Moyen" as const
          },
          {
            id: 15,
            title: "Grammaire",
            content: "Les adjectifs",
            question: "Quel est le féminin de 'grand' ?",
            options: ["Grande", "Grands", "Grandes", "Grand"],
            answer: "Grande",
            category: "Grammaire",
            difficulty: "Moyen" as const
          },
          {
            id: 16,
            title: "Grammaire",
            content: "Les adjectifs",
            question: "Quel est le pluriel de 'beau' ?",
            options: ["Beaux", "Beau", "Beaus", "Beaux"],
            answer: "Beaux",
            category: "Grammaire",
            difficulty: "Moyen" as const
          },
          {
            id: 17,
            title: "Conjugaison",
            content: "Les temps",
            question: "Quel temps utilise-t-on pour parler du présent ?",
            options: ["Le présent", "Le passé", "Le futur", "L'imparfait"],
            answer: "Le présent",
            category: "Conjugaison",
            difficulty: "Moyen" as const
          },
          {
            id: 18,
            title: "Conjugaison",
            content: "Les temps",
            question: "Quel temps utilise-t-on pour parler du passé ?",
            options: ["Le passé composé", "Le présent", "Le futur", "Le conditionnel"],
            answer: "Le passé composé",
            category: "Conjugaison",
            difficulty: "Moyen" as const
          },
          {
            id: 19,
            title: "Conjugaison",
            content: "Les verbes",
            question: "Comment conjugue-t-on 'aller' à la première personne ?",
            options: ["Je vais", "Je va", "Je aller", "Je vas"],
            answer: "Je vais",
            category: "Conjugaison",
            difficulty: "Difficile" as const
          },
          {
            id: 20,
            title: "Conjugaison",
            content: "Les verbes",
            question: "Comment conjugue-t-on 'faire' à la première personne ?",
            options: ["Je fais", "Je fait", "Je faire", "Je fais"],
            answer: "Je fais",
            category: "Conjugaison",
            difficulty: "Difficile" as const
          },
          {
            id: 21,
            title: "Orthographe",
            content: "Les accents",
            question: "Quel accent met-on sur le 'e' dans 'école' ?",
            options: ["L'accent aigu", "L'accent grave", "L'accent circonflexe", "Pas d'accent"],
            answer: "L'accent aigu",
            category: "Orthographe",
            difficulty: "Difficile" as const
          },
          {
            id: 22,
            title: "Orthographe",
            content: "Les accents",
            question: "Quel accent met-on sur le 'a' dans 'là' ?",
            options: ["L'accent grave", "L'accent aigu", "L'accent circonflexe", "Pas d'accent"],
            answer: "L'accent grave",
            category: "Orthographe",
            difficulty: "Difficile" as const
          },
          {
            id: 23,
            title: "Orthographe",
            content: "Les lettres muettes",
            question: "Quelle lettre est muette dans 'chat' ?",
            options: ["Le 't'", "Le 'h'", "Le 'c'", "Le 'a'"],
            answer: "Le 't'",
            category: "Orthographe",
            difficulty: "Difficile" as const
          },
          {
            id: 24,
            title: "Orthographe",
            content: "Les lettres muettes",
            question: "Quelle lettre est muette dans 'oiseau' ?",
            options: ["Le 'u'", "Le 'o'", "Le 'i'", "Le 'e'"],
            answer: "Le 'u'",
            category: "Orthographe",
            difficulty: "Difficile" as const
          },
          {
            id: 25,
            title: "Lecture",
            content: "La compréhension",
            question: "Quel est le personnage principal de l'histoire ?",
            options: ["Le chat", "Le chien", "L'oiseau", "Le lapin"],
            answer: "Le chat",
            category: "Lecture",
            difficulty: "Facile" as const
          },
          {
            id: 26,
            title: "Lecture",
            content: "La compréhension",
            question: "Où se passe l'histoire ?",
            options: ["Dans la maison", "Dans le jardin", "Dans la rue", "À l'école"],
            answer: "Dans la maison",
            category: "Lecture",
            difficulty: "Facile" as const
          },
          {
            id: 27,
            title: "Lecture",
            content: "La compréhension",
            question: "Quel est le problème dans l'histoire ?",
            options: ["Le chat a faim", "Le chat est fatigué", "Le chat est malade", "Le chat est triste"],
            answer: "Le chat a faim",
            category: "Lecture",
            difficulty: "Moyen" as const
          },
          {
            id: 28,
            title: "Lecture",
            content: "La compréhension",
            question: "Comment se termine l'histoire ?",
            options: ["Le chat mange", "Le chat dort", "Le chat part", "Le chat joue"],
            answer: "Le chat mange",
            category: "Lecture",
            difficulty: "Moyen" as const
          },
          {
            id: 29,
            title: "Expression",
            content: "Les phrases",
            question: "Comment commence une phrase ?",
            options: ["Avec une majuscule", "Avec une minuscule", "Avec un point", "Avec une virgule"],
            answer: "Avec une majuscule",
            category: "Expression",
            difficulty: "Facile" as const
          },
          {
            id: 30,
            title: "Expression",
            content: "Les phrases",
            question: "Comment termine-t-on une phrase ?",
            options: ["Avec un point", "Avec une virgule", "Avec un point d'interrogation", "Avec un point d'exclamation"],
            answer: "Avec un point",
            category: "Expression",
            difficulty: "Facile" as const
          }
        ];

        setExercises(mockExercises);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des exercices");
        setLoading(false);
      }
    };

    loadExercises();
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

      // Messages d'encouragement toutes les 10 minutes
      encouragementTimer = setInterval(() => {
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        // Utiliser l'état emoji existant pour afficher temporairement le message
        setEmoji(randomMessage);
        setTimeout(() => setEmoji(""), 5000); // Le message disparaît après 5 secondes
      }, 600000); // 600000ms = 10 minutes
    } else if (timeLeft === 0) {
      setIsFinished(true);
      setShowResult(true);
    }

    return () => {
      clearInterval(timer);
      clearInterval(encouragementTimer);
    };
  }, [timeLeft, isFinished]);

  // Fonction pour formater le temps restant
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

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
            <div className="w-full max-w-3xl mx-auto">
              <ProgressBar 
                totalQuestions={exercises.length}
                correctAnswers={score}
                onProgressComplete={() => {
                  setShowResult(true);
                  setIsFinished(true);
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
                  <li>Lis bien chaque question attentivement</li>
                  <li>N'oublie pas les règles de grammaire</li>
                  <li>Réfléchis à la formation des mots</li>
                  <li>Fais attention aux accents et à l'orthographe</li>
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
                      <span>📚</span>
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
    </div>
  );
};

export default FrenchPage;
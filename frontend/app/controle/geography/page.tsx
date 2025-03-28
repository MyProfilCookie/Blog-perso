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

// Interface pour les exercices de géographie
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

const GeographyPage: React.FC = () => {
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
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [isFinished, setIsFinished] = useState(false);

  // Statistiques et Badges
  const [badges, setBadges] = useState<{
    perfectScore: boolean;
    streakMaster: boolean;
    geographyExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    geographyExpert: false,
    quickLearner: false,
  });

  // Messages d'encouragement
  const encouragementMessages = [
    "🌍 Tu deviens un vrai géographe !",
    "🗺️ Excellent travail de cartographie !",
    "🌎 Continue d'explorer le monde !",
    "🧭 Tu t'orientes très bien !",
    "🌏 Ta connaissance du monde s'améliore !",
    "🚀 Tu voyages comme un pro !"
  ];

  useEffect(() => {
    const loadExercises = () => {
      try {
        // Données statiques pour les exercices de géographie
        const mockExercises: Exercise[] = [
          {
            id: 1,
            title: "Capitales du Monde",
            content: "Les capitales européennes",
            question: "Quelle est la capitale de la France ?",
            options: ["Paris", "Londres", "Berlin", "Madrid"],
            answer: "Paris",
            difficulty: "Facile",
            category: "Capitales"
          },
          {
            id: 2,
            title: "Nature",
            content: "Les montagnes",
            question: "Quelle est la plus haute montagne de France ?",
            options: ["Le Mont Blanc", "Le Mont Fuji", "Le Kilimandjaro", "L'Everest"],
            answer: "Le Mont Blanc",
            category: "Nature",
            difficulty: "Facile" as const
          },
          {
            id: 3,
            title: "Nature",
            content: "Les mers",
            question: "Quelle mer borde la France au sud ?",
            options: ["La Méditerranée", "La mer du Nord", "La Manche", "L'océan Atlantique"],
            answer: "La Méditerranée",
            category: "Nature",
            difficulty: "Facile" as const
          },
          {
            id: 4,
            title: "Climat",
            content: "Le temps qu'il fait",
            question: "Quel temps fait-il en été ?",
            options: ["Il fait chaud", "Il fait froid", "Il pleut", "Il neige"],
            answer: "Il fait chaud",
            category: "Climat",
            difficulty: "Facile" as const
          },
          {
            id: 5,
            title: "Nature",
            content: "Les rivières",
            question: "Quel fleuve traverse Paris ?",
            options: ["La Seine", "Le Rhône", "La Loire", "La Garonne"],
            answer: "La Seine",
            category: "Nature",
            difficulty: "Facile" as const
          },
          {
            id: 6,
            title: "Pays et villes",
            content: "Les pays voisins",
            question: "Quel pays est au nord de la France ?",
            options: ["La Belgique", "L'Espagne", "L'Italie", "L'Allemagne"],
            answer: "La Belgique",
            category: "Pays et villes",
            difficulty: "Facile" as const
          },
          {
            id: 7,
            title: "Nature",
            content: "Les îles",
            question: "Quelle est la plus grande île de France ?",
            options: ["La Corse", "La Martinique", "La Guadeloupe", "La Réunion"],
            answer: "La Corse",
            category: "Nature",
            difficulty: "Facile" as const
          },
          {
            id: 8,
            title: "Climat",
            content: "Les saisons",
            question: "Quelle saison est la plus froide ?",
            options: ["L'hiver", "L'été", "Le printemps", "L'automne"],
            answer: "L'hiver",
            category: "Climat",
            difficulty: "Facile" as const
          },
          {
            id: 9,
            title: "Nature",
            content: "Les forêts",
            question: "Quelle est la plus grande forêt de France ?",
            options: ["La forêt de Fontainebleau", "La forêt des Landes", "La forêt de Compiègne", "La forêt d'Orléans"],
            answer: "La forêt des Landes",
            category: "Nature",
            difficulty: "Facile" as const
          },
          {
            id: 10,
            title: "Pays et villes",
            content: "Les régions",
            question: "Quelle région est connue pour ses vignes ?",
            options: ["La Bourgogne", "La Bretagne", "La Normandie", "La Provence"],
            answer: "La Bourgogne",
            category: "Pays et villes",
            difficulty: "Facile" as const
          },
          {
            id: 11,
            title: "Pays et capitales",
            content: "Les capitales asiatiques",
            question: "Quelle est la capitale du Japon ?",
            options: ["Tokyo", "Séoul", "Pékin", "Bangkok"],
            answer: "Tokyo",
            category: "Pays et capitales",
            difficulty: "Moyen" as const
          },
          {
            id: 12,
            title: "Relief",
            content: "Les chaînes de montagnes",
            question: "Quelle est la plus longue chaîne de montagnes du monde ?",
            options: ["Les Andes", "L'Himalaya", "Les Rocheuses", "Les Alpes"],
            answer: "Les Andes",
            category: "Relief",
            difficulty: "Moyen" as const
          },
          {
            id: 13,
            title: "Océans",
            content: "Les profondeurs océaniques",
            question: "Quelle est la fosse océanique la plus profonde ?",
            options: ["La fosse des Mariannes", "La fosse de Porto Rico", "La fosse du Japon", "La fosse des Philippines"],
            answer: "La fosse des Mariannes",
            category: "Océans",
            difficulty: "Moyen" as const
          },
          {
            id: 14,
            title: "Climat",
            content: "Les phénomènes climatiques",
            question: "Quel est le phénomène climatique qui affecte le Pacifique ?",
            options: ["El Niño", "La mousson", "Le jet stream", "Les alizés"],
            answer: "El Niño",
            category: "Climat",
            difficulty: "Moyen" as const
          },
          {
            id: 15,
            title: "Pays et capitales",
            content: "Les capitales européennes",
            question: "Quelle est la capitale de l'Allemagne ?",
            options: ["Berlin", "Paris", "Londres", "Madrid"],
            answer: "Berlin",
            category: "Pays et capitales",
            difficulty: "Moyen" as const
          },
          {
            id: 16,
            title: "Nature",
            content: "Les déserts",
            question: "Quel est le plus grand désert du monde ?",
            options: ["Le Sahara", "Le désert de Gobi", "Le désert d'Atacama", "Le désert d'Arabie"],
            answer: "Le Sahara",
            category: "Nature",
            difficulty: "Moyen" as const
          },
          {
            id: 17,
            title: "Nature",
            content: "Les lacs",
            question: "Quel est le plus grand lac d'Afrique ?",
            options: ["Le lac Victoria", "Le lac Tanganyika", "Le lac Malawi", "Le lac Chad"],
            answer: "Le lac Victoria",
            category: "Nature",
            difficulty: "Moyen" as const
          },
          {
            id: 18,
            title: "Climat",
            content: "Les zones climatiques",
            question: "Quelle zone climatique est la plus chaude ?",
            options: ["La zone équatoriale", "La zone tempérée", "La zone polaire", "La zone tropicale"],
            answer: "La zone équatoriale",
            category: "Climat",
            difficulty: "Moyen" as const
          },
          {
            id: 19,
            title: "Pays et capitales",
            content: "Les capitales africaines",
            question: "Quelle est la capitale de l'Égypte ?",
            options: ["Le Caire", "Alexandrie", "Louxor", "Assouan"],
            answer: "Le Caire",
            category: "Pays et capitales",
            difficulty: "Difficile" as const
          },
          {
            id: 20,
            title: "Relief",
            content: "Les volcans",
            question: "Quel est le plus grand volcan actif du monde ?",
            options: ["Le Mauna Loa", "Le Vésuve", "Le Fuji", "Le Kilimandjaro"],
            answer: "Le Mauna Loa",
            category: "Relief",
            difficulty: "Difficile" as const
          },
          {
            id: 21,
            title: "Océans",
            content: "Les courants marins",
            question: "Quel est le plus grand courant marin du monde ?",
            options: ["Le Gulf Stream", "Le courant de Humboldt", "Le courant de Benguela", "Le courant des Canaries"],
            answer: "Le Gulf Stream",
            category: "Océans",
            difficulty: "Difficile" as const
          },
          {
            id: 22,
            title: "Climat",
            content: "Les changements climatiques",
            question: "Quel est le principal gaz à effet de serre ?",
            options: ["Le dioxyde de carbone", "L'oxygène", "L'azote", "L'hydrogène"],
            answer: "Le dioxyde de carbone",
            category: "Climat",
            difficulty: "Difficile" as const
          },
          {
            id: 23,
            title: "Pays et capitales",
            content: "Les capitales américaines",
            question: "Quelle est la capitale du Brésil ?",
            options: ["Brasilia", "Rio de Janeiro", "São Paulo", "Salvador"],
            answer: "Brasilia",
            category: "Pays et capitales",
            difficulty: "Difficile" as const
          },
          {
            id: 24,
            title: "Nature",
            content: "Les forêts tropicales",
            question: "Quelle est la plus grande forêt tropicale du monde ?",
            options: ["L'Amazonie", "La forêt du Congo", "La forêt de Bornéo", "La forêt de Madagascar"],
            answer: "L'Amazonie",
            category: "Nature",
            difficulty: "Difficile" as const
          },
          {
            id: 25,
            title: "Relief",
            content: "Les plateaux",
            question: "Quel est le plus grand plateau du monde ?",
            options: ["Le plateau tibétain", "Le plateau de Bolivie", "Le plateau d'Éthiopie", "Le plateau du Colorado"],
            answer: "Le plateau tibétain",
            category: "Relief",
            difficulty: "Difficile" as const
          },
          {
            id: 26,
            title: "Océans",
            content: "Les marées",
            question: "Quelle est la cause principale des marées ?",
            options: ["La Lune", "Le Soleil", "Les étoiles", "Les planètes"],
            answer: "La Lune",
            category: "Océans",
            difficulty: "Difficile" as const
          },
          {
            id: 27,
            title: "Climat",
            content: "Les cyclones",
            question: "Quelle est la vitesse minimale d'un cyclone ?",
            options: ["119 km/h", "100 km/h", "150 km/h", "200 km/h"],
            answer: "119 km/h",
            category: "Climat",
            difficulty: "Difficile" as const
          },
          {
            id: 28,
            title: "Pays et capitales",
            content: "Les capitales océaniennes",
            question: "Quelle est la capitale de l'Australie ?",
            options: ["Canberra", "Sydney", "Melbourne", "Brisbane"],
            answer: "Canberra",
            category: "Pays et capitales",
            difficulty: "Difficile" as const
          },
          {
            id: 29,
            title: "Nature",
            content: "Les récifs coralliens",
            question: "Quel est le plus grand récif corallien du monde ?",
            options: ["La Grande Barrière de corail", "Le récif de Belize", "Le récif de Nouvelle-Calédonie", "Le récif des Maldives"],
            answer: "La Grande Barrière de corail",
            category: "Nature",
            difficulty: "Difficile" as const
          },
          {
            id: 30,
            title: "Relief",
            content: "Les glaciers",
            question: "Quel est le plus grand glacier du monde ?",
            options: ["Le glacier Lambert", "Le glacier Perito Moreno", "Le glacier Vatnajökull", "Le glacier Aletsch"],
            answer: "Le glacier Lambert",
            category: "Relief",
            difficulty: "Difficile" as const
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
      }, 900000); // 900000ms = 15 minutes
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
      geographyExpert: completedExercises >= 10,
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
                Géographie
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices de géographie
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
                  <span className="text-xl sm:text-2xl">🌍</span>
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
                  <li>Associe les pays avec leurs capitales</li>
                  <li>Mémorise les principales caractéristiques géographiques</li>
                  <li>Visualise la carte du monde dans ta tête</li>
                  <li>Pense aux zones climatiques et leurs caractéristiques</li>
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
                            src={`/assets/geography/${exercise.image}`}
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
                  {badges.geographyExpert && (
                    <div className="flex items-center gap-2 text-blue-500">
                      <span>🌍</span>
                      <p>Expert en géographie !</p>
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

export default GeographyPage;

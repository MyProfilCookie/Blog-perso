/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";

import BackButton from "@/components/back";
import Timer from "@/components/Timer";

// Interface pour les exercices de sciences
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

const SciencesPage: React.FC = () => {
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
    scienceExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    scienceExpert: false,
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

  useEffect(() => {
    const loadExercises = () => {
      try {
        // Données statiques pour les exercices de sciences
        const mockExercises: Exercise[] = [
          {
            id: 1,
            title: "Le corps humain",
            content: "Les cinq sens",
            question: "Avec quel sens peut-on sentir les odeurs ?",
            options: ["L'odorat", "Le goût", "La vue", "Le toucher"],
            answer: "L'odorat",
            category: "Corps humain",
            difficulty: "Facile" as const
          },
          {
            id: 2,
            title: "Les animaux",
            content: "Classification des animaux",
            question: "Le chien est un...",
            options: ["Mammifère", "Reptile", "Oiseau", "Poisson"],
            answer: "Mammifère",
            category: "Animaux",
            difficulty: "Facile" as const
          },
          {
            id: 3,
            title: "L'alimentation",
            content: "Les groupes d'aliments",
            question: "Dans quel groupe se trouve la pomme ?",
            options: ["Fruits", "Légumes", "Viandes", "Céréales"],
            answer: "Fruits",
            category: "Alimentation",
            difficulty: "Facile" as const
          },
          {
            id: 4,
            title: "La météo",
            content: "Les phénomènes météorologiques",
            question: "Que se passe-t-il quand l'eau se transforme en glace ?",
            options: ["Elle gèle", "Elle bout", "Elle s'évapore", "Elle fond"],
            answer: "Elle gèle",
            category: "Météo",
            difficulty: "Facile" as const
          },
          {
            id: 5,
            title: "Les saisons",
            content: "Les changements de saisons",
            question: "En quelle saison les feuilles tombent-elles des arbres ?",
            options: ["Automne", "Hiver", "Printemps", "Été"],
            answer: "Automne",
            category: "Nature",
            difficulty: "Facile" as const
          },
          {
            id: 6,
            title: "Les plantes",
            content: "La croissance des plantes",
            question: "De quoi une plante a-t-elle besoin pour pousser ?",
            options: ["De l'eau", "Du chocolat", "Du sel", "Du sucre"],
            answer: "De l'eau",
            category: "Nature",
            difficulty: "Facile" as const
          },
          {
            id: 7,
            title: "Le jour et la nuit",
            content: "Cycle jour/nuit",
            question: "Qu'est-ce qui nous donne la lumière pendant la journée ?",
            options: ["Le Soleil", "La Lune", "Les étoiles", "Les nuages"],
            answer: "Le Soleil",
            category: "Astronomie",
            difficulty: "Facile" as const
          },
          {
            id: 8,
            title: "Les dents",
            content: "Hygiène dentaire",
            question: "Combien de fois par jour faut-il se brosser les dents ?",
            options: ["2 fois", "1 fois", "3 fois", "4 fois"],
            answer: "2 fois",
            category: "Corps humain",
            difficulty: "Facile" as const
          },
          {
            id: 9,
            title: "Les matériaux",
            content: "Propriétés des matériaux",
            question: "Quel matériau est attiré par un aimant ?",
            options: ["Le fer", "Le bois", "Le plastique", "Le papier"],
            answer: "Le fer",
            category: "Matière",
            difficulty: "Facile" as const
          },
          {
            id: 10,
            title: "L'eau",
            content: "Les états de l'eau",
            question: "Comment s'appelle l'eau quand elle est dans les nuages ?",
            options: ["Vapeur d'eau", "Glace", "Neige", "Pluie"],
            answer: "Vapeur d'eau",
            category: "Météo",
            difficulty: "Facile" as const
          },
          {
            id: 11,
            title: "Le système digestif",
            content: "La digestion",
            question: "Quel organe transforme les aliments en nutriments ?",
            options: ["L'estomac", "Le cœur", "Les poumons", "Le cerveau"],
            answer: "L'estomac",
            category: "Corps humain",
            difficulty: "Moyen" as const
          },
          {
            id: 12,
            title: "Les insectes",
            content: "Classification des insectes",
            question: "Combien de pattes a une araignée ?",
            options: ["8 pattes", "6 pattes", "4 pattes", "10 pattes"],
            answer: "8 pattes",
            category: "Animaux",
            difficulty: "Moyen" as const
          },
          {
            id: 13,
            title: "Les vitamines",
            content: "Les nutriments essentiels",
            question: "Quelle vitamine trouve-t-on dans les oranges ?",
            options: ["Vitamine C", "Vitamine A", "Vitamine B", "Vitamine D"],
            answer: "Vitamine C",
            category: "Alimentation",
            difficulty: "Moyen" as const
          },
          {
            id: 14,
            title: "Les nuages",
            content: "Formation des nuages",
            question: "Quel type de nuage apporte la pluie ?",
            options: ["Le cumulonimbus", "Le cirrus", "Le stratus", "Le cumulus"],
            answer: "Le cumulonimbus",
            category: "Météo",
            difficulty: "Moyen" as const
          },
          {
            id: 15,
            title: "Les arbres",
            content: "La vie des arbres",
            question: "Quelle partie de l'arbre produit l'oxygène ?",
            options: ["Les feuilles", "Les racines", "Le tronc", "Les branches"],
            answer: "Les feuilles",
            category: "Nature",
            difficulty: "Moyen" as const
          },
          {
            id: 16,
            title: "Les planètes",
            content: "Le système solaire",
            question: "Quelle est la planète la plus proche du Soleil ?",
            options: ["Mercure", "Vénus", "Mars", "Terre"],
            answer: "Mercure",
            category: "Astronomie",
            difficulty: "Moyen" as const
          },
          {
            id: 17,
            title: "Le squelette",
            content: "Les os du corps",
            question: "Quel est l'os le plus long du corps humain ?",
            options: ["Le fémur", "Le tibia", "Le radius", "L'humérus"],
            answer: "Le fémur",
            category: "Corps humain",
            difficulty: "Moyen" as const
          },
          {
            id: 18,
            title: "Les états de la matière",
            content: "Propriétés de la matière",
            question: "Quel est l'état de l'eau à 100°C ?",
            options: ["Vapeur", "Liquide", "Glace", "Pluie"],
            answer: "Vapeur",
            category: "Matière",
            difficulty: "Moyen" as const
          },
          {
            id: 19,
            title: "Le système respiratoire",
            content: "La respiration",
            question: "Quel organe permet d'absorber l'oxygène ?",
            options: ["Les poumons", "Le cœur", "Le foie", "Les reins"],
            answer: "Les poumons",
            category: "Corps humain",
            difficulty: "Difficile" as const
          },
          {
            id: 20,
            title: "Les écosystèmes",
            content: "Les milieux naturels",
            question: "Quel animal est au sommet de la chaîne alimentaire dans la savane ?",
            options: ["Le lion", "La girafe", "Le zèbre", "L'éléphant"],
            answer: "Le lion",
            category: "Animaux",
            difficulty: "Difficile" as const
          },
          {
            id: 21,
            title: "Les minéraux",
            content: "Les nutriments essentiels",
            question: "Quel minéral est important pour les os ?",
            options: ["Le calcium", "Le fer", "Le zinc", "Le cuivre"],
            answer: "Le calcium",
            category: "Alimentation",
            difficulty: "Difficile" as const
          },
          {
            id: 22,
            title: "Les phénomènes météorologiques",
            content: "La météo",
            question: "Qu'est-ce qui cause les éclairs ?",
            options: ["L'électricité statique", "Le vent", "La pluie", "Les nuages"],
            answer: "L'électricité statique",
            category: "Météo",
            difficulty: "Difficile" as const
          },
          {
            id: 23,
            title: "La photosynthèse",
            content: "La vie des plantes",
            question: "Quel gaz les plantes absorbent-elles ?",
            options: ["Le dioxyde de carbone", "L'oxygène", "L'azote", "L'hydrogène"],
            answer: "Le dioxyde de carbone",
            category: "Nature",
            difficulty: "Difficile" as const
          },
          {
            id: 24,
            title: "Les étoiles",
            content: "L'astronomie",
            question: "Quelle étoile est la plus proche de la Terre ?",
            options: ["Le Soleil", "Proxima Centauri", "Sirius", "Alpha Centauri"],
            answer: "Le Soleil",
            category: "Astronomie",
            difficulty: "Difficile" as const
          },
          {
            id: 25,
            title: "Le système nerveux",
            content: "Le cerveau et les nerfs",
            question: "Quel organe contrôle tout le corps ?",
            options: ["Le cerveau", "Le cœur", "Les poumons", "Le foie"],
            answer: "Le cerveau",
            category: "Corps humain",
            difficulty: "Difficile" as const
          },
          {
            id: 26,
            title: "Les réactions chimiques",
            content: "La chimie",
            question: "Qu'est-ce qui se produit quand on mélange du vinaigre et du bicarbonate de soude ?",
            options: ["Une effervescence", "Une explosion", "Une solidification", "Une évaporation"],
            answer: "Une effervescence",
            category: "Matière",
            difficulty: "Difficile" as const
          },
          {
            id: 27,
            title: "Les cellules",
            content: "La biologie",
            question: "Quelle est l'unité de base de la vie ?",
            options: ["La cellule", "L'atome", "La molécule", "Le tissu"],
            answer: "La cellule",
            category: "Corps humain",
            difficulty: "Difficile" as const
          },
          {
            id: 28,
            title: "Les écosystèmes marins",
            content: "La vie marine",
            question: "Quel est le plus grand animal marin ?",
            options: ["La baleine bleue", "Le requin", "Le calmar", "Le dauphin"],
            answer: "La baleine bleue",
            category: "Animaux",
            difficulty: "Difficile" as const
          },
          {
            id: 29,
            title: "Les protéines",
            content: "Les nutriments",
            question: "Dans quel groupe d'aliments trouve-t-on les protéines ?",
            options: ["Les viandes", "Les fruits", "Les légumes", "Les céréales"],
            answer: "Les viandes",
            category: "Alimentation",
            difficulty: "Difficile" as const
          },
          {
            id: 30,
            title: "Les forces",
            content: "La physique",
            question: "Quelle force attire les objets vers le centre de la Terre ?",
            options: ["La gravité", "Le magnétisme", "L'électricité", "Le vent"],
            answer: "La gravité",
            category: "Matière",
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
        // Utiliser l'état emoji existant pour afficher temporairement le message
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
      scienceExpert: completedExercises >= 10,
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
      <div className="w-full max-w-7xl mx-auto mb-6">
        <BackButton />
      </div>
      
      <div className="flex-1 w-full max-w-7xl mx-auto">
        <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
          {/* En-tête avec titre et navigation */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6">
            <motion.div 
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 sm:mb-6"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
              Exercices de Sciences
            </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Explorez le monde des sciences à travers des exercices interactifs
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
                  <li>Observez attentivement les phénomènes scientifiques</li>
                  <li>Utilisez vos connaissances pour faire des déductions</li>
                  <li>Pensez aux causes et aux effets</li>
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
                            src={`/assets/sciences/${exercise.image}`}
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
                  {badges.scienceExpert && (
                    <div className="flex items-center gap-2 text-blue-500">
                      <span>🎓</span>
                      <p>Expert en sciences !</p>
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

export default SciencesPage;

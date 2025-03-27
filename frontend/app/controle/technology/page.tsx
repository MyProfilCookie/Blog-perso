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
import { ProgressBar } from "@/components/progress/ProgressBar";
import { useRouter } from "next/navigation";

// Interface pour les exercices de technologie
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

const TechnologyPage: React.FC = () => {
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

  // Statistiques et badges
  const [badges, setBadges] = useState<{
    perfectScore: boolean;
    streakMaster: boolean;
    techExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    techExpert: false,
    quickLearner: false,
  });

  // Messages d'encouragement
  const encouragementMessages = [
    "💻 Tu es un vrai geek !",
    "🔧 Excellent esprit technique !",
    "🌐 Continue d'explorer la technologie !",
    "⚡ Tes connaissances techniques s'améliorent !",
    "🤖 Tu deviens un expert en tech !",
    "🚀 Tu progresses comme un pro !"
  ];

  useEffect(() => {
    const loadExercises = () => {
      try {
        // Données statiques pour les exercices de technologie
        const mockExercises: Exercise[] = [
          {
            id: 1,
            title: "Informatique",
            content: "Les composants d'un ordinateur",
            question: "Quel composant est le 'cerveau' de l'ordinateur ?",
            options: ["Le processeur", "La carte mère", "La mémoire RAM", "Le disque dur"],
            answer: "Le processeur",
            difficulty: "Facile",
            category: "Hardware"
          },
          {
            id: 2,
            title: "Périphériques",
            content: "Les périphériques d'entrée",
            question: "Quel périphérique permet de saisir du texte ?",
            options: ["Le clavier", "L'écran", "L'imprimante", "Les haut-parleurs"],
            answer: "Le clavier",
            category: "Hardware",
            difficulty: "Facile" as const
          },
          {
            id: 3,
            title: "Périphériques",
            content: "Les périphériques de sortie",
            question: "Quel périphérique permet de voir les informations ?",
            options: ["L'écran", "La souris", "Le clavier", "Le microphone"],
            answer: "L'écran",
            category: "Hardware",
            difficulty: "Facile" as const
          },
          {
            id: 4,
            title: "Logiciels",
            content: "Les types de logiciels",
            question: "Comment s'appelle un logiciel qui permet de naviguer sur internet ?",
            options: ["Un navigateur", "Un système d'exploitation", "Un antivirus", "Un traitement de texte"],
            answer: "Un navigateur",
            category: "Software",
            difficulty: "Facile" as const
          },
          {
            id: 5,
            title: "Logiciels",
            content: "Les systèmes d'exploitation",
            question: "Quel est le système d'exploitation le plus utilisé sur les ordinateurs ?",
            options: ["Windows", "macOS", "Linux", "Android"],
            answer: "Windows",
            category: "Software",
            difficulty: "Facile" as const
          },
          {
            id: 6,
            title: "Internet",
            content: "Les sites web",
            question: "Comment s'appelle un site web qui permet de faire des recherches ?",
            options: ["Un moteur de recherche", "Un réseau social", "Un blog", "Un forum"],
            answer: "Un moteur de recherche",
            category: "Internet",
            difficulty: "Facile" as const
          },
          {
            id: 7,
            title: "Internet",
            content: "Les réseaux sociaux",
            question: "Quel est l'âge minimum pour créer un compte sur la plupart des réseaux sociaux ?",
            options: ["13 ans", "10 ans", "16 ans", "18 ans"],
            answer: "13 ans",
            category: "Internet",
            difficulty: "Facile" as const
          },
          {
            id: 8,
            title: "Technologie mobile",
            content: "Les smartphones",
            question: "Quel composant permet de prendre des photos avec un smartphone ?",
            options: ["L'appareil photo", "Le microphone", "Le haut-parleur", "L'écran tactile"],
            answer: "L'appareil photo",
            category: "Mobile",
            difficulty: "Facile" as const
          },
          {
            id: 9,
            title: "Technologie mobile",
            content: "Les applications",
            question: "Comment s'appelle l'endroit où l'on télécharge des applications sur un smartphone ?",
            options: ["La boutique d'applications", "La bibliothèque", "Le magasin", "Le supermarché"],
            answer: "La boutique d'applications",
            category: "Mobile",
            difficulty: "Facile" as const
          },
          {
            id: 10,
            title: "Sécurité informatique",
            content: "Protection des données",
            question: "Qu'est-ce qui protège un compte contre les hackers ?",
            options: ["Un mot de passe fort", "Un nom d'utilisateur", "Une adresse email", "Une photo de profil"],
            answer: "Un mot de passe fort",
            category: "Sécurité",
            difficulty: "Facile" as const
          },
          {
            id: 11,
            title: "Hardware avancé",
            content: "Les composants internes",
            question: "Quelle est la fonction de la mémoire RAM ?",
            options: ["Stocker les données temporaires", "Stocker les données permanentes", "Afficher les images", "Imprimer les documents"],
            answer: "Stocker les données temporaires",
            category: "Hardware",
            difficulty: "Moyen" as const
          },
          {
            id: 12,
            title: "Hardware avancé",
            content: "Les cartes graphiques",
            question: "À quoi sert principalement une carte graphique ?",
            options: ["Traiter les images et vidéos", "Stocker des fichiers", "Connecter à Internet", "Faire fonctionner le clavier"],
            answer: "Traiter les images et vidéos",
            category: "Hardware",
            difficulty: "Moyen" as const
          },
          {
            id: 13,
            title: "Software avancé",
            content: "Les langages de programmation",
            question: "Quel langage est souvent utilisé pour créer des sites web ?",
            options: ["HTML", "Word", "Excel", "PowerPoint"],
            answer: "HTML",
            category: "Programming",
            difficulty: "Moyen" as const
          },
          {
            id: 14,
            title: "Software avancé",
            content: "Les bases de données",
            question: "Qu'est-ce qu'une base de données ?",
            options: ["Un ensemble organisé d'informations", "Un jeu vidéo", "Un logiciel de dessin", "Un type d'écran"],
            answer: "Un ensemble organisé d'informations",
            category: "Software",
            difficulty: "Moyen" as const
          },
          {
            id: 15,
            title: "Internet avancé",
            content: "Le fonctionnement d'Internet",
            question: "Que signifie l'acronyme 'URL' ?",
            options: ["Uniform Resource Locator", "Universal Remote Link", "User Reference List", "Ultimate Resource Library"],
            answer: "Uniform Resource Locator",
            category: "Internet",
            difficulty: "Moyen" as const
          },
          {
            id: 16,
            title: "Internet avancé",
            content: "Les protocoles",
            question: "Quel protocole est utilisé pour sécuriser les connexions web ?",
            options: ["HTTPS", "HTML", "FTP", "SMTP"],
            answer: "HTTPS",
            category: "Internet",
            difficulty: "Moyen" as const
          },
          {
            id: 17,
            title: "Mobile avancé",
            content: "Les systèmes d'exploitation mobiles",
            question: "Quel système d'exploitation est développé par Apple pour ses iPhones ?",
            options: ["iOS", "Android", "Windows Mobile", "Blackberry OS"],
            answer: "iOS",
            category: "Mobile",
            difficulty: "Moyen" as const
          },
          {
            id: 18,
            title: "Mobile avancé",
            content: "La connectivité",
            question: "Quelle technologie permet de connecter un smartphone à une enceinte sans fil ?",
            options: ["Bluetooth", "WiFi", "4G", "NFC"],
            answer: "Bluetooth",
            category: "Mobile",
            difficulty: "Moyen" as const
          },
          {
            id: 19,
            title: "Sécurité avancée",
            content: "Les menaces informatiques",
            question: "Comment s'appelle un programme malveillant qui bloque l'accès à un ordinateur et demande de l'argent ?",
            options: ["Un ransomware", "Un virus", "Un spam", "Un cookie"],
            answer: "Un ransomware",
            category: "Sécurité",
            difficulty: "Moyen" as const
          },
          {
            id: 20,
            title: "Sécurité avancée",
            content: "La protection des données",
            question: "Quelle est la meilleure façon de protéger ses données importantes ?",
            options: ["Faire des sauvegardes régulières", "Utiliser un mot de passe simple", "Partager ses informations", "Ne jamais éteindre son ordinateur"],
            answer: "Faire des sauvegardes régulières",
            category: "Sécurité",
            difficulty: "Moyen" as const
          },
          {
            id: 21,
            title: "Hardware expert",
            content: "Les processeurs",
            question: "Quelle unité mesure la fréquence d'un processeur ?",
            options: ["Le gigahertz (GHz)", "Le gigaoctet (Go)", "Le mégapixel (MP)", "Le décibel (dB)"],
            answer: "Le gigahertz (GHz)",
            category: "Hardware",
            difficulty: "Difficile" as const
          },
          {
            id: 22,
            title: "Hardware expert",
            content: "Le stockage",
            question: "Quelle technologie de stockage est la plus rapide ?",
            options: ["SSD (Solid State Drive)", "HDD (Hard Disk Drive)", "DVD", "Disquette"],
            answer: "SSD (Solid State Drive)",
            category: "Hardware",
            difficulty: "Difficile" as const
          },
          {
            id: 23,
            title: "Programming",
            content: "Les algorithmes",
            question: "Qu'est-ce qu'un algorithme en informatique ?",
            options: ["Une série d'instructions pour résoudre un problème", "Un type de virus", "Un composant matériel", "Un logiciel de dessin"],
            answer: "Une série d'instructions pour résoudre un problème",
            category: "Programming",
            difficulty: "Difficile" as const
          },
          {
            id: 24,
            title: "Programming",
            content: "Les bases de la programmation",
            question: "Qu'est-ce qu'une variable en programmation ?",
            options: ["Un emplacement mémoire pour stocker des données", "Un câble d'ordinateur", "Un type d'écran", "Un logiciel antivirus"],
            answer: "Un emplacement mémoire pour stocker des données",
            category: "Programming",
            difficulty: "Difficile" as const
          },
          {
            id: 25,
            title: "Internet expert",
            content: "L'infrastructure d'Internet",
            question: "Qu'est-ce qu'un serveur web ?",
            options: ["Un ordinateur qui héberge des sites web", "Un moteur de recherche", "Un câble sous-marin", "Un fournisseur d'accès Internet"],
            answer: "Un ordinateur qui héberge des sites web",
            category: "Internet",
            difficulty: "Difficile" as const
          },
          {
            id: 26,
            title: "Internet expert",
            content: "Le cloud computing",
            question: "Qu'est-ce que le 'cloud computing' ?",
            options: ["L'utilisation de serveurs distants pour stocker des données", "La météo sur Internet", "Un type de connexion sans fil", "Un logiciel de dessin dans le nuage"],
            answer: "L'utilisation de serveurs distants pour stocker des données",
            category: "Internet",
            difficulty: "Difficile" as const
          },
          {
            id: 27,
            title: "Mobile expert",
            content: "Les technologies mobiles avancées",
            question: "Que signifie l'acronyme 'NFC' sur un smartphone ?",
            options: ["Near Field Communication", "New Function Control", "Network Frequency Controller", "Next Feature Coming"],
            answer: "Near Field Communication",
            category: "Mobile",
            difficulty: "Difficile" as const
          },
          {
            id: 28,
            title: "Mobile expert",
            content: "Les réseaux mobiles",
            question: "Quelle génération de réseau mobile offre les débits les plus rapides actuellement ?",
            options: ["5G", "4G", "3G", "2G"],
            answer: "5G",
            category: "Mobile",
            difficulty: "Difficile" as const
          },
          {
            id: 29,
            title: "Sécurité expert",
            content: "La cryptographie",
            question: "Qu'est-ce que le chiffrement en informatique ?",
            options: ["La transformation de données pour les rendre illisibles sans clé", "La compression de fichiers", "La suppression de virus", "La création de mots de passe"],
            answer: "La transformation de données pour les rendre illisibles sans clé",
            category: "Sécurité",
            difficulty: "Difficile" as const
          },
          {
            id: 30,
            title: "Tendances technologiques",
            content: "Les technologies émergentes",
            question: "Quelle technologie permet aux machines d'apprendre à partir de données ?",
            options: ["L'intelligence artificielle", "La réalité virtuelle", "La blockchain", "Le réseau 5G"],
            answer: "L'intelligence artificielle",
            category: "Innovation",
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
      techExpert: completedExercises >= 10,
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
                Technologie
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices de technologie
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
                  <span className="text-xl sm:text-2xl">💻</span>
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
                  <li>Observe bien les termes techniques et leur signification</li>
                  <li>Associe les composants informatiques à leur fonction</li>
                  <li>Réfléchis à ce que tu utilises quotidiennement en informatique</li>
                  <li>Souviens-toi des précautions à prendre sur Internet</li>
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
                            src={`/assets/technology/${exercise.image}`}
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
                  {badges.techExpert && (
                    <div className="flex items-center gap-2 text-blue-500">
                      <span>💻</span>
                      <p>Expert en technologie !</p>
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

export default TechnologyPage;
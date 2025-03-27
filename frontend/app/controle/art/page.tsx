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

// Interface pour les exercices d'art
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

const ArtPage: React.FC = () => {
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
    artExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    artExpert: false,
    quickLearner: false,
  });

  // Messages d'encouragement
  const encouragementMessages = [
    "🎨 Tu as un vrai talent artistique !",
    "🖼️ Continue comme ça, tu as l'œil !",
    "🎭 Ta créativité est impressionnante !",
    "✨ Tu as une excellente perception artistique !",
    "🌈 Laisse libre cours à ton imagination !",
    "🚀 Tu progresses comme un vrai artiste !"
  ];

  useEffect(() => {
    const loadExercises = () => {
      try {
        // Données statiques pour les exercices d'art
        const mockExercises: Exercise[] = [
          {
            id: 1,
            title: "Histoire de l'Art",
            content: "Découvrez les grands mouvements artistiques",
            question: "Quel artiste est connu pour 'La Nuit étoilée' ?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet", "Salvador Dalí"],
            answer: "Vincent van Gogh",
            difficulty: "Facile",
            category: "Peinture"
          },
          {
            id: 2,
            title: "Couleurs",
            content: "Les couleurs primaires",
            question: "Quelles sont les 3 couleurs primaires en peinture ?",
            options: ["Rouge, bleu et jaune", "Rouge, vert et bleu", "Cyan, magenta et jaune", "Orange, vert et violet"],
            answer: "Rouge, bleu et jaune",
            category: "Techniques",
            difficulty: "Facile" as const
          },
          {
            id: 3,
            title: "Formes",
            content: "Les formes en art",
            question: "Quelle forme a un carré ?",
            options: ["4 côtés égaux", "3 côtés égaux", "Forme ronde", "5 côtés égaux"],
            answer: "4 côtés égaux",
            category: "Dessin",
            difficulty: "Facile" as const
          },
          {
            id: 4,
            title: "Matériaux",
            content: "Les matériaux artistiques",
            question: "Avec quoi dessine-t-on habituellement ?",
            options: ["Crayon", "Marteau", "Couteau", "Fourchette"],
            answer: "Crayon",
            category: "Dessin",
            difficulty: "Facile" as const
          },
          {
            id: 5,
            title: "Art Célèbre",
            content: "Œuvres d'art connues",
            question: "Quelle œuvre célèbre montre une femme souriante ?",
            options: ["La Joconde", "La Nuit étoilée", "Le Cri", "Les Tournesols"],
            answer: "La Joconde",
            category: "Peinture",
            difficulty: "Facile" as const
          },
          {
            id: 6,
            title: "Types d'Art",
            content: "Différentes formes d'art",
            question: "Que fait-on avec de l'argile ?",
            options: ["De la sculpture", "De la peinture", "Du dessin", "De la photographie"],
            answer: "De la sculpture",
            category: "Sculpture",
            difficulty: "Facile" as const
          },
          {
            id: 7,
            title: "Émotions",
            content: "Exprimer des émotions",
            question: "Quelle couleur représente souvent la tristesse ?",
            options: ["Bleu", "Jaune", "Rouge", "Vert"],
            answer: "Bleu",
            category: "Couleurs",
            difficulty: "Facile" as const
          },
          {
            id: 8,
            title: "Textures",
            content: "Les différentes textures",
            question: "Comment appelle-t-on une surface douce et lisse ?",
            options: ["Lisse", "Rugueuse", "Bosselée", "Pointue"],
            answer: "Lisse",
            category: "Techniques",
            difficulty: "Facile" as const
          },
          {
            id: 9,
            title: "Lignes",
            content: "Types de lignes",
            question: "Comment s'appelle une ligne qui n'est pas droite ?",
            options: ["Courbe", "Angle", "Triangle", "Carré"],
            answer: "Courbe",
            category: "Dessin",
            difficulty: "Facile" as const
          },
          {
            id: 10,
            title: "Musées",
            content: "Les grands musées",
            question: "Dans quel musée se trouve la Joconde ?",
            options: ["Le Louvre", "Le MoMA", "Le Prado", "Le British Museum"],
            answer: "Le Louvre",
            category: "Histoire de l'Art",
            difficulty: "Facile" as const
          },
          {
            id: 11,
            title: "Mélange de Couleurs",
            content: "Créer de nouvelles couleurs",
            question: "Quelle couleur obtient-on en mélangeant du bleu et du jaune ?",
            options: ["Vert", "Orange", "Violet", "Marron"],
            answer: "Vert",
            category: "Couleurs",
            difficulty: "Moyen" as const
          },
          {
            id: 12,
            title: "Artistes",
            content: "Grands artistes",
            question: "Qui a peint la 'Guernica' ?",
            options: ["Pablo Picasso", "Salvador Dalí", "Vincent van Gogh", "Claude Monet"],
            answer: "Pablo Picasso",
            category: "Artistes",
            difficulty: "Moyen" as const
          },
          {
            id: 13,
            title: "Perspective",
            content: "Création de profondeur",
            question: "Comment montrer qu'un objet est plus éloigné dans un dessin ?",
            options: ["En le faisant plus petit", "En le faisant plus grand", "En le faisant plus coloré", "En le dessinant plus épais"],
            answer: "En le faisant plus petit",
            category: "Techniques",
            difficulty: "Moyen" as const
          },
          {
            id: 14,
            title: "Sculpture",
            content: "L'art en 3D",
            question: "Quel artiste a créé la statue 'Le Penseur' ?",
            options: ["Auguste Rodin", "Michel-Ange", "Leonardo da Vinci", "Claude Monet"],
            answer: "Auguste Rodin",
            category: "Sculpture",
            difficulty: "Moyen" as const
          },
          {
            id: 15,
            title: "Mouvements Artistiques",
            content: "Styles d'art",
            question: "Quel mouvement artistique est connu pour ses formes géométriques ?",
            options: ["Cubisme", "Impressionnisme", "Réalisme", "Romantisme"],
            answer: "Cubisme",
            category: "Mouvements",
            difficulty: "Moyen" as const
          },
          {
            id: 16,
            title: "Outils Artistiques",
            content: "Instruments d'artiste",
            question: "Qu'utilise-t-on pour mélanger de la peinture ?",
            options: ["Palette", "Chevalet", "Toile", "Cadre"],
            answer: "Palette",
            category: "Techniques",
            difficulty: "Moyen" as const
          },
          {
            id: 17,
            title: "Portraits",
            content: "L'art de représenter les personnes",
            question: "Quelle partie du corps est essentielle dans un portrait ?",
            options: ["Le visage", "Les mains", "Les pieds", "Les genoux"],
            answer: "Le visage",
            category: "Peinture",
            difficulty: "Moyen" as const
          },
          {
            id: 18,
            title: "Art Moderne",
            content: "L'art du 20e siècle",
            question: "Qui a peint 'La Persistance de la mémoire' avec des montres molles ?",
            options: ["Salvador Dalí", "Pablo Picasso", "Andy Warhol", "Vincent van Gogh"],
            answer: "Salvador Dalí",
            category: "Artistes",
            difficulty: "Moyen" as const
          },
          {
            id: 19,
            title: "Composition",
            content: "Organisation d'une œuvre",
            question: "Comment s'appelle la ligne imaginaire qui divise une œuvre en deux parties égales ?",
            options: ["Ligne médiane", "Horizon", "Diagonale", "Verticale"],
            answer: "Ligne médiane",
            category: "Techniques",
            difficulty: "Moyen" as const
          },
          {
            id: 20,
            title: "Art Numérique",
            content: "Création avec la technologie",
            question: "Quel appareil est souvent utilisé pour l'art numérique ?",
            options: ["Ordinateur", "Four", "Réfrigérateur", "Tondeuse à gazon"],
            answer: "Ordinateur",
            category: "Techniques Modernes",
            difficulty: "Moyen" as const
          },
          {
            id: 21,
            title: "Couleurs Complémentaires",
            content: "Paires de couleurs opposées",
            question: "Quelle est la couleur complémentaire du rouge ?",
            options: ["Vert", "Bleu", "Jaune", "Orange"],
            answer: "Vert",
            category: "Couleurs",
            difficulty: "Difficile" as const
          },
          {
            id: 22,
            title: "Renaissance",
            content: "L'art du 15e et 16e siècle",
            question: "Qui a peint le plafond de la Chapelle Sixtine ?",
            options: ["Michel-Ange", "Leonardo da Vinci", "Raphaël", "Botticelli"],
            answer: "Michel-Ange",
            category: "Histoire de l'Art",
            difficulty: "Difficile" as const
          },
          {
            id: 23,
            title: "Techniques Mixtes",
            content: "Combiner différentes méthodes",
            question: "Qu'est-ce qu'un collage ?",
            options: ["Une œuvre créée en collant différents matériaux", "Une peinture à l'huile", "Un dessin au crayon", "Une sculpture en argile"],
            answer: "Une œuvre créée en collant différents matériaux",
            category: "Techniques",
            difficulty: "Difficile" as const
          },
          {
            id: 24,
            title: "Impressionnisme",
            content: "Capturer la lumière et le mouvement",
            question: "Quel artiste est célèbre pour ses peintures de nénuphars ?",
            options: ["Claude Monet", "Edgar Degas", "Pierre-Auguste Renoir", "Paul Cézanne"],
            answer: "Claude Monet",
            category: "Mouvements",
            difficulty: "Difficile" as const
          },
          {
            id: 25,
            title: "Symbolisme",
            content: "Utiliser des symboles",
            question: "Quel animal symbolise souvent la sagesse dans l'art ?",
            options: ["Hibou", "Lion", "Serpent", "Cheval"],
            answer: "Hibou",
            category: "Symbolisme",
            difficulty: "Difficile" as const
          },
          {
            id: 26,
            title: "Architecture",
            content: "L'art de concevoir des bâtiments",
            question: "Quel style architectural utilise des arcs-boutants et des vitraux colorés ?",
            options: ["Gothique", "Moderne", "Art déco", "Baroque"],
            answer: "Gothique",
            category: "Architecture",
            difficulty: "Difficile" as const
          },
          {
            id: 27,
            title: "Gravure",
            content: "Art d'imprimer des images",
            question: "Quelle technique consiste à graver sur une plaque de métal ?",
            options: ["Eau-forte", "Aquarelle", "Pastel", "Gouache"],
            answer: "Eau-forte",
            category: "Techniques",
            difficulty: "Difficile" as const
          },
          {
            id: 28,
            title: "Art Abstrait",
            content: "Art non représentatif",
            question: "Quel artiste est connu pour ses peintures de couleurs et formes abstraites ?",
            options: ["Wassily Kandinsky", "Leonardo da Vinci", "Auguste Renoir", "Claude Monet"],
            answer: "Wassily Kandinsky",
            category: "Mouvements",
            difficulty: "Difficile" as const
          },
          {
            id: 29,
            title: "Pop Art",
            content: "Art inspiré de la culture populaire",
            question: "Quel artiste a créé des sérigraphies de Marilyn Monroe ?",
            options: ["Andy Warhol", "Roy Lichtenstein", "Keith Haring", "Jean-Michel Basquiat"],
            answer: "Andy Warhol",
            category: "Mouvements",
            difficulty: "Difficile" as const
          },
          {
            id: 30,
            title: "Art Contemporain",
            content: "L'art d'aujourd'hui",
            question: "Quel artiste britannique est connu pour ses œuvres sur le street art ?",
            options: ["Banksy", "Damien Hirst", "Tracey Emin", "Anish Kapoor"],
            answer: "Banksy",
            category: "Art Contemporain",
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
      artExpert: completedExercises >= 10,
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
                Art
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices d'art et culture artistique
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
                  <span className="text-xl sm:text-2xl">🎨</span>
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
                  <li>Observe attentivement les œuvres d'art et leurs détails</li>
                  <li>Souviens-toi des différentes techniques et styles artistiques</li>
                  <li>Reconnais les couleurs et leurs associations</li>
                  <li>Associe les artistes à leurs œuvres célèbres</li>
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
                            src={`/assets/art/${exercise.image}`}
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
                  {badges.artExpert && (
                    <div className="flex items-center gap-2 text-blue-500">
                      <span>🎨</span>
                      <p>Expert en art !</p>
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

export default ArtPage;
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

// Interface pour les exercices de musique
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

const MusicPage: React.FC = () => {
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
    "🎵 Tu as l'oreille musicale !",
    "🎼 Excellent sens du rythme !",
    "🎹 Continue d'explorer la musique !",
    "🎸 Tes connaissances musicales s'améliorent !",
    "🎺 Tu deviens un vrai musicien !",
    "🚀 Tu progresses en harmonie !"
  ];

  useEffect(() => {
    const loadExercises = () => {
      try {
        // Données statiques pour les exercices de musique
        const mockExercises: Exercise[] = [
          {
            id: 1,
            title: "Notes de Musique",
            content: "Les notes sur la portée",
            question: "Quelle est la première note de la gamme de Do majeur ?",
            options: ["Do", "Ré", "Mi", "Fa"],
            answer: "Do",
            difficulty: "Facile",
            category: "Théorie Musicale"
          },
          {
            id: 2,
            title: "Instruments",
            content: "Familles d'instruments",
            question: "À quelle famille appartient le violon ?",
            options: ["Cordes", "Vents", "Percussions", "Cuivres"],
            answer: "Cordes",
            category: "Instruments",
            difficulty: "Facile" as const
          },
          {
            id: 3,
            title: "Rythme",
            content: "Les valeurs rythmiques",
            question: "Combien de temps dure une noire par rapport à une blanche ?",
            options: ["Deux fois moins", "Deux fois plus", "Même durée", "Quatre fois moins"],
            answer: "Deux fois moins",
            category: "Rythme",
            difficulty: "Facile" as const
          },
          {
            id: 4,
            title: "Genres Musicaux",
            content: "Différents genres de musique",
            question: "Quel genre musical est associé à Elvis Presley ?",
            options: ["Rock'n'roll", "Classique", "Jazz", "Rap"],
            answer: "Rock'n'roll",
            category: "Genres",
            difficulty: "Facile" as const
          },
          {
            id: 5,
            title: "Symboles Musicaux",
            content: "Comprendre les symboles",
            question: "Quel symbole indique que la note doit être jouée plus fort ?",
            options: ["Forte (f)", "Piano (p)", "Crescendo (<)", "Legato"],
            answer: "Forte (f)",
            category: "Théorie Musicale",
            difficulty: "Facile" as const
          },
          {
            id: 6,
            title: "Emotions en Musique",
            content: "Ressentir la musique",
            question: "Quel type de musique exprime généralement la joie ?",
            options: ["Musique en mode majeur", "Musique en mode mineur", "Musique lente", "Musique sans mélodie"],
            answer: "Musique en mode majeur",
            category: "Emotions",
            difficulty: "Facile" as const
          },
          {
            id: 7,
            title: "Compositeurs",
            content: "Grands compositeurs",
            question: "Qui a composé 'Les Quatre Saisons' ?",
            options: ["Vivaldi", "Mozart", "Bach", "Beethoven"],
            answer: "Vivaldi",
            category: "Compositeurs",
            difficulty: "Facile" as const
          },
          {
            id: 8,
            title: "Instruments à Clavier",
            content: "Types de claviers",
            question: "Quel instrument a des touches noires et blanches ?",
            options: ["Piano", "Batterie", "Guitare", "Flûte"],
            answer: "Piano",
            category: "Instruments",
            difficulty: "Facile" as const
          },
          {
            id: 9,
            title: "Écoute Musicale",
            content: "Sons d'instruments",
            question: "Quel instrument produit le son le plus grave ?",
            options: ["Contrebasse", "Violon", "Flûte", "Trompette"],
            answer: "Contrebasse",
            category: "Instruments",
            difficulty: "Facile" as const
          },
          {
            id: 10,
            title: "Notations Musicales",
            content: "Lire la musique",
            question: "Combien de lignes compte une portée standard ?",
            options: ["5", "4", "6", "3"],
            answer: "5",
            category: "Théorie Musicale",
            difficulty: "Facile" as const
          },
          {
            id: 11,
            title: "Clés Musicales",
            content: "Comprendre les clés",
            question: "Quelle est la clé la plus couramment utilisée ?",
            options: ["Clé de Sol", "Clé de Fa", "Clé d'Ut", "Clé de Do"],
            answer: "Clé de Sol",
            category: "Théorie Musicale",
            difficulty: "Moyen" as const
          },
          {
            id: 12,
            title: "Instruments à Vent",
            content: "Types d'instruments à vent",
            question: "Lequel de ces instruments est un cuivre ?",
            options: ["Trompette", "Flûte", "Clarinette", "Hautbois"],
            answer: "Trompette",
            category: "Instruments",
            difficulty: "Moyen" as const
          },
          {
            id: 13,
            title: "Tempo",
            content: "Vitesse de la musique",
            question: "Comment appelle-t-on un tempo très lent ?",
            options: ["Largo", "Allegro", "Presto", "Moderato"],
            answer: "Largo",
            category: "Rythme",
            difficulty: "Moyen" as const
          },
          {
            id: 14,
            title: "Musique du Monde",
            content: "Traditions musicales",
            question: "De quel pays est originaire le djembé ?",
            options: ["Afrique de l'Ouest", "Japon", "Brésil", "Inde"],
            answer: "Afrique de l'Ouest",
            category: "Genres",
            difficulty: "Moyen" as const
          },
          {
            id: 15,
            title: "Accords",
            content: "Construction d'accords",
            question: "Combien de notes contient un accord majeur ?",
            options: ["3", "2", "4", "5"],
            answer: "3",
            category: "Théorie Musicale",
            difficulty: "Moyen" as const
          },
          {
            id: 16,
            title: "Musique et Films",
            content: "Bandes sonores",
            question: "Quel compositeur a écrit la musique de 'Star Wars' ?",
            options: ["John Williams", "Hans Zimmer", "Ennio Morricone", "Howard Shore"],
            answer: "John Williams",
            category: "Compositeurs",
            difficulty: "Moyen" as const
          },
          {
            id: 17,
            title: "Percussions",
            content: "Instruments à percussion",
            question: "Quel instrument de percussion est fait de deux disques métalliques ?",
            options: ["Cymbales", "Tambour", "Triangle", "Xylophone"],
            answer: "Cymbales",
            category: "Instruments",
            difficulty: "Moyen" as const
          },
          {
            id: 18,
            title: "Voix",
            content: "Types de voix",
            question: "Comment appelle-t-on une voix féminine aiguë ?",
            options: ["Soprano", "Alto", "Ténor", "Basse"],
            answer: "Soprano",
            category: "Voix",
            difficulty: "Moyen" as const
          },
          {
            id: 19,
            title: "Orchestres",
            content: "Types d'ensembles",
            question: "Comment s'appelle un petit ensemble de musique de chambre ?",
            options: ["Quatuor", "Symphonie", "Soliste", "Chorale"],
            answer: "Quatuor",
            category: "Ensembles",
            difficulty: "Moyen" as const
          },
          {
            id: 20,
            title: "Musique Électronique",
            content: "Sons synthétiques",
            question: "Quel appareil est essentiel à la musique électronique ?",
            options: ["Synthétiseur", "Violon", "Harpe", "Trompette"],
            answer: "Synthétiseur",
            category: "Instruments",
            difficulty: "Moyen" as const
          },
          {
            id: 21,
            title: "Gammes",
            content: "Types de gammes",
            question: "Combien de notes distinctes compte une gamme majeure ?",
            options: ["7", "5", "8", "12"],
            answer: "7",
            category: "Théorie Musicale",
            difficulty: "Difficile" as const
          },
          {
            id: 22,
            title: "Intervalles",
            content: "Distances entre les notes",
            question: "Quel intervalle y a-t-il entre Do et Sol ?",
            options: ["Quinte", "Tierce", "Quarte", "Octave"],
            answer: "Quinte",
            category: "Théorie Musicale",
            difficulty: "Difficile" as const
          },
          {
            id: 23,
            title: "Périodes Musicales",
            content: "Histoire de la musique",
            question: "À quelle période appartient la musique de Bach ?",
            options: ["Baroque", "Classique", "Romantique", "Moderne"],
            answer: "Baroque",
            category: "Histoire",
            difficulty: "Difficile" as const
          },
          {
            id: 24,
            title: "Instruments Rares",
            content: "Instruments inhabituels",
            question: "Quel est cet instrument à cordes pincées proche de la harpe ?",
            options: ["Luth", "Banjo", "Mandoline", "Balalaïka"],
            answer: "Luth",
            category: "Instruments",
            difficulty: "Difficile" as const
          },
          {
            id: 25,
            title: "Techniques Vocales",
            content: "Manières de chanter",
            question: "Comment appelle-t-on la technique de chant qui alterne rapidement entre la voix normale et la voix de tête ?",
            options: ["Yodel", "Vibrato", "Scat", "Falsetto"],
            answer: "Yodel",
            category: "Voix",
            difficulty: "Difficile" as const
          },
          {
            id: 26,
            title: "Mesures Musicales",
            content: "Division du temps",
            question: "Quelle mesure est souvent utilisée pour la valse ?",
            options: ["3/4", "4/4", "2/4", "6/8"],
            answer: "3/4",
            category: "Rythme",
            difficulty: "Difficile" as const
          },
          {
            id: 27,
            title: "Formes Musicales",
            content: "Structures de composition",
            question: "Quelle forme musicale se caractérise par un thème qui revient entre plusieurs sections ?",
            options: ["Rondo", "Sonate", "Fugue", "Canon"],
            answer: "Rondo",
            category: "Théorie Musicale",
            difficulty: "Difficile" as const
          },
          {
            id: 28,
            title: "Musique et Technologie",
            content: "Évolution technique",
            question: "Quel format numérique est couramment utilisé pour les fichiers audio ?",
            options: ["MP3", "JPEG", "DOC", "EXE"],
            answer: "MP3",
            category: "Technologie",
            difficulty: "Difficile" as const
          },
          {
            id: 29,
            title: "Instruments Anciens",
            content: "Instruments historiques",
            question: "Quel instrument à clavier a précédé le piano ?",
            options: ["Clavecin", "Orgue", "Accordéon", "Harmonica"],
            answer: "Clavecin",
            category: "Histoire",
            difficulty: "Difficile" as const
          },
          {
            id: 30,
            title: "Improvisation",
            content: "Créer spontanément",
            question: "Quel style musical est particulièrement connu pour l'improvisation ?",
            options: ["Jazz", "Classique", "Électronique", "Pop"],
            answer: "Jazz",
            category: "Genres",
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
      musicExpert: completedExercises >= 10,
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
                Musique
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices de musique
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
                  <span className="text-xl sm:text-2xl">🎵</span>
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
                  <li>La musique est un langage, prends le temps de comprendre ses symboles</li>
                  <li>Écoute attentivement les différents sons des instruments</li>
                  <li>Essaie de reconnaître les sons graves et aigus</li>
                  <li>N'hésite pas à faire des associations avec des émotions ou des images</li>
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
                            src={`/assets/music/${exercise.image}`}
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
                  {badges.musicExpert && (
                    <div className="flex items-center gap-2 text-blue-500">
                      <span>🎵</span>
                      <p>Expert en musique !</p>
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

export default MusicPage;
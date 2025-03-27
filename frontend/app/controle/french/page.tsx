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
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [isStarted, setIsStarted] = useState<boolean>(false);

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

  // Gestion du minuteur et des messages d'encouragement
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let encouragementTimer: NodeJS.Timeout;

    if (timeLeft > 0) {
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
  }, [timeLeft]);

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

  const handleRating = (rating: "Facile" | "Moyen" | "Difficile") => {
    // Ici, vous pouvez ajouter la logique pour sauvegarder la progression
    console.log(`Progression en français : ${rating}`);
  };

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
            <div className="absolute top-0 left-0 z-10">
              <BackButton />
            </div>
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
            <div className="flex justify-end items-center mb-4">
              <Timer timeLeft={timeLeft} />
            </div>
          </div>
        </section>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map(ex => (
          <Card key={ex.id} className="w-full h-full">
            <CardBody className="p-4">
              <h2 className="text-xl font-bold mb-2">{ex.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{ex.content}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FrenchPage;

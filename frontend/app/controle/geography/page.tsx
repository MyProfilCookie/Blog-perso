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
  category?: string;
}

const GeographyPage: React.FC = () => {
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
    geographyExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    geographyExpert: false,
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
        title: "Pays et capitales",
        content: "Les capitales d'Europe",
        question: "Quelle est la capitale de la France ?",
        options: ["Paris", "Londres", "Berlin", "Madrid"],
        answer: "Paris",
        category: "Pays et capitales",
        difficulty: "Facile" as const
      },
      {
        id: 2,
        title: "Relief",
        content: "Les montagnes",
        question: "Quelle est la plus haute montagne du monde ?",
        options: ["L'Everest", "Le Mont Blanc", "Le Kilimandjaro", "Le Mont Fuji"],
        answer: "L'Everest",
        category: "Relief",
        difficulty: "Facile" as const
      },
      {
        id: 3,
        title: "Océans",
        content: "Les océans du monde",
        question: "Quel est le plus grand océan du monde ?",
        options: ["L'océan Pacifique", "L'océan Atlantique", "L'océan Indien", "L'océan Arctique"],
        answer: "L'océan Pacifique",
        category: "Océans",
        difficulty: "Facile" as const
      },
      {
        id: 4,
        title: "Climat",
        content: "Les zones climatiques",
        question: "Quel temps fait-il à l'équateur ?",
        options: ["Très chaud", "Très froid", "Tempéré", "Variable"],
        answer: "Très chaud",
        category: "Climat",
        difficulty: "Facile" as const
      },
      {
        id: 5,
        title: "Rivières",
        content: "Les grands fleuves",
        question: "Quel est le plus long fleuve du monde ?",
        options: ["Le Nil", "La Seine", "Le Rhône", "La Loire"],
        answer: "Le Nil",
        category: "Rivières",
        difficulty: "Facile" as const
      },
      {
        id: 6,
        title: "Déserts",
        content: "Les grands déserts",
        question: "Quel est le plus grand désert du monde ?",
        options: ["Le Sahara", "Le désert de Gobi", "Le désert d'Atacama", "Le désert d'Arabie"],
        answer: "Le Sahara",
        category: "Déserts",
        difficulty: "Facile" as const
      },
      {
        id: 7,
        title: "Îles",
        content: "Les grandes îles",
        question: "Quelle est la plus grande île du monde ?",
        options: ["Le Groenland", "Madagascar", "La Corse", "La Sicile"],
        answer: "Le Groenland",
        category: "Îles",
        difficulty: "Facile" as const
      },
      {
        id: 8,
        title: "Volcans",
        content: "Les volcans actifs",
        question: "Quel est le plus grand volcan actif d'Europe ?",
        options: ["L'Etna", "Le Vésuve", "Le Stromboli", "Le Puy de Dôme"],
        answer: "L'Etna",
        category: "Volcans",
        difficulty: "Facile" as const
      },
      {
        id: 9,
        title: "Forêts",
        content: "Les grandes forêts",
        question: "Quelle est la plus grande forêt tropicale du monde ?",
        options: ["L'Amazonie", "La forêt du Congo", "La forêt d'Indonésie", "La forêt d'Amérique centrale"],
        answer: "L'Amazonie",
        category: "Forêts",
        difficulty: "Facile" as const
      },
      {
        id: 10,
        title: "Lacs",
        content: "Les grands lacs",
        question: "Quel est le plus grand lac d'eau douce du monde ?",
        options: ["Le lac Supérieur", "Le lac Victoria", "Le lac Baïkal", "Le lac Michigan"],
        answer: "Le lac Supérieur",
        category: "Lacs",
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
        title: "Rivières",
        content: "Les bassins fluviaux",
        question: "Quel est le plus grand bassin fluvial du monde ?",
        options: ["Le bassin amazonien", "Le bassin du Congo", "Le bassin du Mississippi", "Le bassin du Nil"],
        answer: "Le bassin amazonien",
        category: "Rivières",
        difficulty: "Moyen" as const
      },
      {
        id: 16,
        title: "Déserts",
        content: "Les déserts froids",
        question: "Quel est le plus grand désert froid du monde ?",
        options: ["L'Antarctique", "Le désert de Gobi", "Le désert de Patagonie", "Le désert du Grand Bassin"],
        answer: "L'Antarctique",
        category: "Déserts",
        difficulty: "Moyen" as const
      },
      {
        id: 17,
        title: "Îles",
        content: "Les archipels",
        question: "Quel est le plus grand archipel du monde ?",
        options: ["L'Indonésie", "Le Japon", "Les Philippines", "Les Maldives"],
        answer: "L'Indonésie",
        category: "Îles",
        difficulty: "Moyen" as const
      },
      {
        id: 18,
        title: "Volcans",
        content: "Les types de volcans",
        question: "Quel type de volcan est le plus explosif ?",
        options: ["Le volcan gris", "Le volcan rouge", "Le volcan sous-marin", "Le volcan éteint"],
        answer: "Le volcan gris",
        category: "Volcans",
        difficulty: "Moyen" as const
      },
      {
        id: 19,
        title: "Forêts",
        content: "Les écosystèmes forestiers",
        question: "Quelle est la plus grande forêt boréale du monde ?",
        options: ["La taïga sibérienne", "La forêt canadienne", "La forêt scandinave", "La forêt russe"],
        answer: "La taïga sibérienne",
        category: "Forêts",
        difficulty: "Moyen" as const
      },
      {
        id: 20,
        title: "Lacs",
        content: "Les lacs salés",
        question: "Quel est le plus grand lac salé du monde ?",
        options: ["La mer Caspienne", "La mer Morte", "Le lac Tchad", "Le lac Eyre"],
        answer: "La mer Caspienne",
        category: "Lacs",
        difficulty: "Moyen" as const
      },
      {
        id: 21,
        title: "Pays et capitales",
        content: "Les capitales africaines",
        question: "Quelle est la capitale de l'Afrique du Sud ?",
        options: ["Pretoria", "Le Cap", "Johannesburg", "Durban"],
        answer: "Pretoria",
        category: "Pays et capitales",
        difficulty: "Difficile" as const
      },
      {
        id: 22,
        title: "Relief",
        content: "Les formations géologiques",
        question: "Quelle est la plus ancienne chaîne de montagnes du monde ?",
        options: ["Les Appalaches", "Les Alpes", "L'Himalaya", "Les Andes"],
        answer: "Les Appalaches",
        category: "Relief",
        difficulty: "Difficile" as const
      },
      {
        id: 23,
        title: "Océans",
        content: "Les courants marins",
        question: "Quel est le plus puissant courant marin du monde ?",
        options: ["Le Gulf Stream", "Le courant circumpolaire", "Le courant de Benguela", "Le courant de Kuroshio"],
        answer: "Le Gulf Stream",
        category: "Océans",
        difficulty: "Difficile" as const
      },
      {
        id: 24,
        title: "Climat",
        content: "Les changements climatiques",
        question: "Quel est le principal gaz à effet de serre ?",
        options: ["Le dioxyde de carbone", "Le méthane", "Le protoxyde d'azote", "Les CFC"],
        answer: "Le dioxyde de carbone",
        category: "Climat",
        difficulty: "Difficile" as const
      },
      {
        id: 25,
        title: "Rivières",
        content: "Les deltas",
        question: "Quel est le plus grand delta du monde ?",
        options: ["Le delta du Gange-Brahmapoutre", "Le delta du Mississippi", "Le delta du Nil", "Le delta du Mékong"],
        answer: "Le delta du Gange-Brahmapoutre",
        category: "Rivières",
        difficulty: "Difficile" as const
      },
      {
        id: 26,
        title: "Déserts",
        content: "Les oasis",
        question: "Quelle est la plus grande oasis du monde ?",
        options: ["L'oasis de Siwa", "L'oasis de Al-Ahsa", "L'oasis de Timimoun", "L'oasis de Tozeur"],
        answer: "L'oasis de Al-Ahsa",
        category: "Déserts",
        difficulty: "Difficile" as const
      },
      {
        id: 27,
        title: "Îles",
        content: "Les atolls",
        question: "Quel est le plus grand atoll du monde ?",
        options: ["Kiritimati", "Aldabra", "Rangiroa", "Bikini"],
        answer: "Kiritimati",
        category: "Îles",
        difficulty: "Difficile" as const
      },
      {
        id: 28,
        title: "Volcans",
        content: "Les points chauds",
        question: "Où se trouve le point chaud le plus actif du monde ?",
        options: ["Hawaï", "L'Islande", "La Réunion", "Les Galápagos"],
        answer: "Hawaï",
        category: "Volcans",
        difficulty: "Difficile" as const
      },
      {
        id: 29,
        title: "Forêts",
        content: "La biodiversité",
        question: "Quelle région abrite la plus grande biodiversité du monde ?",
        options: ["L'Amazonie", "Le bassin du Congo", "L'Asie du Sud-Est", "L'Amérique centrale"],
        answer: "L'Amazonie",
        category: "Forêts",
        difficulty: "Difficile" as const
      },
      {
        id: 30,
        title: "Lacs",
        content: "Les lacs glaciaires",
        question: "Quel est le plus grand lac glaciaire du monde ?",
        options: ["Le lac Michigan", "Le lac Huron", "Le lac Ontario", "Le lac Érié"],
        answer: "Le lac Michigan",
        category: "Lacs",
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

  const handleRating = (rating: "Facile" | "Moyen" | "Difficile") => {
    // Ici, vous pouvez ajouter la logique pour sauvegarder la progression
    console.log(`Progression en géographie : ${rating}`);
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
            <div className="flex justify-center mb-4">
              <BackButton />
            </div>
          </div>
        </section>
      </div>

      <Timer />
    </div>
  );
};

export default GeographyPage;

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
import { useRouter } from "next/navigation";

// Interface pour les exercices d'histoire
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

const HistoryPage: React.FC = () => {
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
    historyExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    historyExpert: false,
    quickLearner: false,
  });

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

  useEffect(() => {
    const mockExercises: Exercise[] = [
      {
        id: 1,
        title: "Préhistoire",
        content: "Les hommes préhistoriques",
        question: "Quel outil les hommes préhistoriques utilisaient-ils pour chasser ?",
        options: ["la lance", "le téléphone", "l'ordinateur", "la voiture"],
        answer: "la lance",
        category: "Préhistoire",
        difficulty: "Facile" as const
      },
      {
        id: 2,
        title: "Préhistoire",
        content: "Les hommes préhistoriques",
        question: "Où vivaient les hommes préhistoriques ?",
        options: ["dans des grottes", "dans des maisons", "dans des appartements", "dans des châteaux"],
        answer: "dans des grottes",
        category: "Préhistoire",
        difficulty: "Facile" as const
      },
      {
        id: 3,
        title: "Antiquité",
        content: "Les Égyptiens",
        question: "Qui était le roi des Égyptiens ?",
        options: ["le pharaon", "le président", "le maire", "le roi"],
        answer: "le pharaon",
        category: "Antiquité",
        difficulty: "Facile" as const
      },
      {
        id: 4,
        title: "Antiquité",
        content: "Les Égyptiens",
        question: "Quelle construction célèbre ont bâtie les Égyptiens ?",
        options: ["les pyramides", "les gratte-ciel", "les ponts", "les routes"],
        answer: "les pyramides",
        category: "Antiquité",
        difficulty: "Facile" as const
      },
      {
        id: 5,
        title: "Moyen Âge",
        content: "Les chevaliers",
        question: "Quel objet les chevaliers portaient-ils pour se protéger ?",
        options: ["l'armure", "le t-shirt", "le manteau", "le chapeau"],
        answer: "l'armure",
        category: "Moyen Âge",
        difficulty: "Facile" as const
      },
      {
        id: 6,
        title: "Moyen Âge",
        content: "Les châteaux",
        question: "Où vivaient les rois au Moyen Âge ?",
        options: ["dans les châteaux", "dans les appartements", "dans les maisons", "dans les tentes"],
        answer: "dans les châteaux",
        category: "Moyen Âge",
        difficulty: "Facile" as const
      },
      {
        id: 7,
        title: "Renaissance",
        content: "Les artistes",
        question: "Quel objet les artistes utilisaient-ils pour peindre ?",
        options: ["le pinceau", "le crayon", "le stylo", "le téléphone"],
        answer: "le pinceau",
        category: "Renaissance",
        difficulty: "Facile" as const
      },
      {
        id: 8,
        title: "Renaissance",
        content: "Les artistes",
        question: "Quel objet les artistes utilisaient-ils pour dessiner ?",
        options: ["le crayon", "le téléphone", "l'ordinateur", "la voiture"],
        answer: "le crayon",
        category: "Renaissance",
        difficulty: "Facile" as const
      },
      {
        id: 9,
        title: "Temps modernes",
        content: "Les explorateurs",
        question: "Quel objet les explorateurs utilisaient-ils pour naviguer ?",
        options: ["la boussole", "le téléphone", "l'ordinateur", "la voiture"],
        answer: "la boussole",
        category: "Temps modernes",
        difficulty: "Facile" as const
      },
      {
        id: 10,
        title: "Temps modernes",
        content: "Les explorateurs",
        question: "Quel objet les explorateurs utilisaient-ils pour voyager ?",
        options: ["le bateau", "l'avion", "la voiture", "le train"],
        answer: "le bateau",
        category: "Temps modernes",
        difficulty: "Facile" as const
      },
      {
        id: 11,
        title: "Révolution française",
        content: "Les événements",
        question: "Quelle prison a été prise d'assaut en 1789 ?",
        options: ["la Bastille", "la Tour Eiffel", "le Louvre", "Versailles"],
        answer: "la Bastille",
        category: "Révolution française",
        difficulty: "Moyen" as const
      },
      {
        id: 12,
        title: "Révolution française",
        content: "Les événements",
        question: "Quel roi a été guillotiné pendant la Révolution ?",
        options: ["Louis XVI", "Napoléon", "Henri IV", "François Ier"],
        answer: "Louis XVI",
        category: "Révolution française",
        difficulty: "Moyen" as const
      },
      {
        id: 13,
        title: "Empire",
        content: "Napoléon",
        question: "Quel objet Napoléon portait-il sur sa tête ?",
        options: ["un chapeau", "une couronne", "un casque", "un bonnet"],
        answer: "un chapeau",
        category: "Empire",
        difficulty: "Moyen" as const
      },
      {
        id: 14,
        title: "Empire",
        content: "Napoléon",
        question: "Quel objet Napoléon portait-il sur son corps ?",
        options: ["un uniforme", "un t-shirt", "un manteau", "un pyjama"],
        answer: "un uniforme",
        category: "Empire",
        difficulty: "Moyen" as const
      },
      {
        id: 15,
        title: "XIXe siècle",
        content: "L'industrialisation",
        question: "Quel objet a été inventé pendant l'industrialisation ?",
        options: ["la machine à vapeur", "le téléphone", "l'ordinateur", "la voiture"],
        answer: "la machine à vapeur",
        category: "XIXe siècle",
        difficulty: "Moyen" as const
      },
      {
        id: 16,
        title: "XIXe siècle",
        content: "L'industrialisation",
        question: "Quel objet a été inventé pendant l'industrialisation ?",
        options: ["le train", "l'avion", "la voiture", "le bateau"],
        answer: "le train",
        category: "XIXe siècle",
        difficulty: "Moyen" as const
      },
      {
        id: 17,
        title: "Première Guerre mondiale",
        content: "Les soldats",
        question: "Quel objet les soldats portaient-ils sur leur tête ?",
        options: ["le casque", "le chapeau", "le bonnet", "la couronne"],
        answer: "le casque",
        category: "Première Guerre mondiale",
        difficulty: "Moyen" as const
      },
      {
        id: 18,
        title: "Première Guerre mondiale",
        content: "Les soldats",
        question: "Quel objet les soldats utilisaient-ils pour se battre ?",
        options: ["le fusil", "le téléphone", "l'ordinateur", "la voiture"],
        answer: "le fusil",
        category: "Première Guerre mondiale",
        difficulty: "Moyen" as const
      },
      {
        id: 19,
        title: "Entre-deux-guerres",
        content: "Les inventions",
        question: "Quel objet a été inventé pendant l'entre-deux-guerres ?",
        options: ["la radio", "le téléphone", "l'ordinateur", "la voiture"],
        answer: "la radio",
        category: "Entre-deux-guerres",
        difficulty: "Moyen" as const
      },
      {
        id: 20,
        title: "Entre-deux-guerres",
        content: "Les inventions",
        question: "Quel objet a été inventé pendant l'entre-deux-guerres ?",
        options: ["la télévision", "l'ordinateur", "le téléphone", "la voiture"],
        answer: "la télévision",
        category: "Entre-deux-guerres",
        difficulty: "Moyen" as const
      },
      {
        id: 21,
        title: "Seconde Guerre mondiale",
        content: "Les événements",
        question: "Quel pays a été attaqué en premier pendant la guerre ?",
        options: ["la Pologne", "la France", "l'Allemagne", "l'Angleterre"],
        answer: "la Pologne",
        category: "Seconde Guerre mondiale",
        difficulty: "Difficile" as const
      },
      {
        id: 22,
        title: "Seconde Guerre mondiale",
        content: "Les événements",
        question: "Quel pays a gagné la guerre ?",
        options: ["les Alliés", "l'Allemagne", "le Japon", "l'Italie"],
        answer: "les Alliés",
        category: "Seconde Guerre mondiale",
        difficulty: "Difficile" as const
      },
      {
        id: 23,
        title: "Guerre froide",
        content: "Les pays",
        question: "Quels étaient les deux pays principaux de la guerre froide ?",
        options: ["les États-Unis et l'URSS", "la France et l'Allemagne", "l'Angleterre et la Chine", "le Japon et l'Italie"],
        answer: "les États-Unis et l'URSS",
        category: "Guerre froide",
        difficulty: "Difficile" as const
      },
      {
        id: 24,
        title: "Guerre froide",
        content: "Les événements",
        question: "Quel mur a été construit pendant la guerre froide ?",
        options: ["le mur de Berlin", "le mur de Chine", "le mur de Paris", "le mur de Londres"],
        answer: "le mur de Berlin",
        category: "Guerre froide",
        difficulty: "Difficile" as const
      },
      {
        id: 25,
        title: "XXIe siècle",
        content: "Les inventions",
        question: "Quel objet a été inventé au XXIe siècle ?",
        options: ["le smartphone", "la radio", "la télévision", "le téléphone"],
        answer: "le smartphone",
        category: "XXIe siècle",
        difficulty: "Difficile" as const
      },
      {
        id: 26,
        title: "XXIe siècle",
        content: "Les inventions",
        question: "Quel objet a été inventé au XXIe siècle ?",
        options: ["l'ordinateur portable", "la radio", "la télévision", "le téléphone"],
        answer: "l'ordinateur portable",
        category: "XXIe siècle",
        difficulty: "Difficile" as const
      },
      {
        id: 27,
        title: "Histoire récente",
        content: "Les événements",
        question: "Quel événement a eu lieu en 2001 ?",
        options: ["les attentats du 11 septembre", "la guerre mondiale", "la révolution", "l'invention de l'ordinateur"],
        answer: "les attentats du 11 septembre",
        category: "Histoire récente",
        difficulty: "Difficile" as const
      },
      {
        id: 28,
        title: "Histoire récente",
        content: "Les événements",
        question: "Quel événement a eu lieu en 2020 ?",
        options: ["la pandémie de Covid-19", "la guerre mondiale", "la révolution", "l'invention de l'ordinateur"],
        answer: "la pandémie de Covid-19",
        category: "Histoire récente",
        difficulty: "Difficile" as const
      },
      {
        id: 29,
        title: "Histoire locale",
        content: "Les monuments",
        question: "Quel monument célèbre se trouve à Paris ?",
        options: ["la Tour Eiffel", "le Big Ben", "la Statue de la Liberté", "le Taj Mahal"],
        answer: "la Tour Eiffel",
        category: "Histoire locale",
        difficulty: "Difficile" as const
      },
      {
        id: 30,
        title: "Histoire locale",
        content: "Les monuments",
        question: "Quel monument célèbre se trouve à Paris ?",
        options: ["l'Arc de Triomphe", "le Big Ben", "la Statue de la Liberté", "le Taj Mahal"],
        answer: "l'Arc de Triomphe",
        category: "Histoire locale",
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
      historyExpert: completedExercises >= 10,
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
    console.log(`Progression en histoire : ${rating}`);
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
                Histoire
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices d'histoire
              </p>
            </motion.div>
          </div>
          {/* Rest of the component content */}
        </section>
      </div>
    </div>
  );
};

export default HistoryPage;

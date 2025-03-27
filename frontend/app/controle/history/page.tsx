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
    "📚 Tu maîtrises l'histoire !",
    "⌛ Excellent voyage dans le temps !",
    "🏰 Continue d'explorer le passé !",
    "📜 Tes connaissances historiques s'améliorent !",
    "🗿 Tu deviens un vrai historien !",
    "🚀 Tu voyages dans le temps comme un pro !"
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
        title: "La vie d'autrefois",
        content: "Comment vivaient les hommes préhistoriques",
        question: "Où dormaient les hommes préhistoriques ?",
        options: ["Dans une grotte", "Dans un lit", "Dans un canapé", "Dans un hamac"],
        answer: "Dans une grotte",
        category: "Préhistoire",
        difficulty: "Facile" as const
      },
      {
        id: 2,
        title: "La vie d'autrefois",
        content: "Comment vivaient les hommes préhistoriques",
        question: "Que mangeaient les hommes préhistoriques ?",
        options: ["De la viande", "Des hamburgers", "Des pizzas", "Des glaces"],
        answer: "De la viande",
        category: "Préhistoire",
        difficulty: "Facile" as const
      },
      {
        id: 3,
        title: "Les Égyptiens",
        content: "La vie en Égypte",
        question: "Qui était le roi des Égyptiens ?",
        options: ["Le pharaon", "Le président", "Le maire", "Le roi"],
        answer: "Le pharaon",
        category: "Antiquité",
        difficulty: "Facile" as const
      },
      {
        id: 4,
        title: "Les Égyptiens",
        content: "La vie en Égypte",
        question: "Quelle construction célèbre ont bâtie les Égyptiens ?",
        options: ["Les pyramides", "Les gratte-ciel", "Les ponts", "Les routes"],
        answer: "Les pyramides",
        category: "Antiquité",
        difficulty: "Facile" as const
      },
      {
        id: 5,
        title: "Les chevaliers",
        content: "La vie des chevaliers",
        question: "Quel objet les chevaliers portaient-ils pour se protéger ?",
        options: ["L'armure", "Le t-shirt", "Le manteau", "Le chapeau"],
        answer: "L'armure",
        category: "Moyen Âge",
        difficulty: "Facile" as const
      },
      {
        id: 6,
        title: "Les chevaliers",
        content: "La vie des chevaliers",
        question: "Où vivaient les chevaliers ?",
        options: ["Dans un château", "Dans un appartement", "Dans une maison", "Dans une tente"],
        answer: "Dans un château",
        category: "Moyen Âge",
        difficulty: "Facile" as const
      },
      {
        id: 7,
        title: "Les artistes",
        content: "La vie des artistes",
        question: "Quel objet les artistes utilisaient-ils pour peindre ?",
        options: ["Le pinceau", "Le crayon", "Le stylo", "Le téléphone"],
        answer: "Le pinceau",
        category: "Renaissance",
        difficulty: "Facile" as const
      },
      {
        id: 8,
        title: "Les artistes",
        content: "La vie des artistes",
        question: "Quel objet les artistes utilisaient-ils pour dessiner ?",
        options: ["Le crayon", "Le téléphone", "L'ordinateur", "La voiture"],
        answer: "Le crayon",
        category: "Renaissance",
        difficulty: "Facile" as const
      },
      {
        id: 9,
        title: "Les explorateurs",
        content: "La vie des explorateurs",
        question: "Quel objet les explorateurs utilisaient-ils pour naviguer ?",
        options: ["La boussole", "Le téléphone", "L'ordinateur", "La voiture"],
        answer: "La boussole",
        category: "Temps modernes",
        difficulty: "Facile" as const
      },
      {
        id: 10,
        title: "Les explorateurs",
        content: "La vie des explorateurs",
        question: "Quel objet les explorateurs utilisaient-ils pour voyager ?",
        options: ["Le bateau", "L'avion", "La voiture", "Le train"],
        answer: "Le bateau",
        category: "Temps modernes",
        difficulty: "Facile" as const
      },
      {
        id: 11,
        title: "La Révolution",
        content: "La Révolution française",
        question: "Quelle prison a été prise d'assaut en 1789 ?",
        options: ["La Bastille", "La Tour Eiffel", "Le Louvre", "Versailles"],
        answer: "La Bastille",
        category: "Révolution française",
        difficulty: "Moyen" as const
      },
      {
        id: 12,
        title: "La Révolution",
        content: "La Révolution française",
        question: "Quel roi a été guillotiné pendant la Révolution ?",
        options: ["Louis XVI", "Napoléon", "Henri IV", "François Ier"],
        answer: "Louis XVI",
        category: "Révolution française",
        difficulty: "Moyen" as const
      },
      {
        id: 13,
        title: "Napoléon",
        content: "La vie de Napoléon",
        question: "Quel objet Napoléon portait-il sur sa tête ?",
        options: ["Un chapeau", "Une couronne", "Un casque", "Un bonnet"],
        answer: "Un chapeau",
        category: "Empire",
        difficulty: "Moyen" as const
      },
      {
        id: 14,
        title: "Napoléon",
        content: "La vie de Napoléon",
        question: "Quel objet Napoléon portait-il sur son corps ?",
        options: ["Un uniforme", "Un t-shirt", "Un manteau", "Un pyjama"],
        answer: "Un uniforme",
        category: "Empire",
        difficulty: "Moyen" as const
      },
      {
        id: 15,
        title: "L'industrialisation",
        content: "Les inventions",
        question: "Quel objet a été inventé pendant l'industrialisation ?",
        options: ["La machine à vapeur", "Le téléphone", "L'ordinateur", "La voiture"],
        answer: "La machine à vapeur",
        category: "XIXe siècle",
        difficulty: "Moyen" as const
      },
      {
        id: 16,
        title: "L'industrialisation",
        content: "Les inventions",
        question: "Quel objet a été inventé pendant l'industrialisation ?",
        options: ["Le train", "L'avion", "La voiture", "Le bateau"],
        answer: "Le train",
        category: "XIXe siècle",
        difficulty: "Moyen" as const
      },
      {
        id: 17,
        title: "La guerre",
        content: "La Première Guerre mondiale",
        question: "Quel objet les soldats portaient-ils sur leur tête ?",
        options: ["Le casque", "Le chapeau", "Le bonnet", "La couronne"],
        answer: "Le casque",
        category: "Première Guerre mondiale",
        difficulty: "Moyen" as const
      },
      {
        id: 18,
        title: "La guerre",
        content: "La Première Guerre mondiale",
        question: "Quel objet les soldats utilisaient-ils pour se battre ?",
        options: ["Le fusil", "Le téléphone", "L'ordinateur", "La voiture"],
        answer: "Le fusil",
        category: "Première Guerre mondiale",
        difficulty: "Moyen" as const
      },
      {
        id: 19,
        title: "Les inventions",
        content: "Les inventions modernes",
        question: "Quel objet a été inventé pendant l'entre-deux-guerres ?",
        options: ["La radio", "Le téléphone", "L'ordinateur", "La voiture"],
        answer: "La radio",
        category: "Entre-deux-guerres",
        difficulty: "Moyen" as const
      },
      {
        id: 20,
        title: "Les inventions",
        content: "Les inventions modernes",
        question: "Quel objet a été inventé pendant l'entre-deux-guerres ?",
        options: ["La télévision", "L'ordinateur", "Le téléphone", "La voiture"],
        answer: "La télévision",
        category: "Entre-deux-guerres",
        difficulty: "Moyen" as const
      },
      {
        id: 21,
        title: "La guerre",
        content: "La Seconde Guerre mondiale",
        question: "Quel pays a été attaqué en premier pendant la guerre ?",
        options: ["La Pologne", "La France", "L'Allemagne", "L'Angleterre"],
        answer: "La Pologne",
        category: "Seconde Guerre mondiale",
        difficulty: "Difficile" as const
      },
      {
        id: 22,
        title: "La guerre",
        content: "La Seconde Guerre mondiale",
        question: "Quel pays a gagné la guerre ?",
        options: ["Les Alliés", "L'Allemagne", "Le Japon", "L'Italie"],
        answer: "Les Alliés",
        category: "Seconde Guerre mondiale",
        difficulty: "Difficile" as const
      },
      {
        id: 23,
        title: "La guerre froide",
        content: "La guerre froide",
        question: "Quels étaient les deux pays principaux de la guerre froide ?",
        options: ["Les États-Unis et l'URSS", "La France et l'Allemagne", "L'Angleterre et la Chine", "Le Japon et l'Italie"],
        answer: "Les États-Unis et l'URSS",
        category: "Guerre froide",
        difficulty: "Difficile" as const
      },
      {
        id: 24,
        title: "La guerre froide",
        content: "La guerre froide",
        question: "Quel mur a été construit pendant la guerre froide ?",
        options: ["Le mur de Berlin", "Le mur de Chine", "Le mur de Paris", "Le mur de Londres"],
        answer: "Le mur de Berlin",
        category: "Guerre froide",
        difficulty: "Difficile" as const
      },
      {
        id: 25,
        title: "Les inventions modernes",
        content: "Les inventions du XXIe siècle",
        question: "Quel objet a été inventé au XXIe siècle ?",
        options: ["Le smartphone", "La radio", "La télévision", "Le téléphone"],
        answer: "Le smartphone",
        category: "XXIe siècle",
        difficulty: "Difficile" as const
      },
      {
        id: 26,
        title: "Les inventions modernes",
        content: "Les inventions du XXIe siècle",
        question: "Quel objet a été inventé au XXIe siècle ?",
        options: ["L'ordinateur portable", "La radio", "La télévision", "Le téléphone"],
        answer: "L'ordinateur portable",
        category: "XXIe siècle",
        difficulty: "Difficile" as const
      },
      {
        id: 27,
        title: "L'histoire récente",
        content: "Les événements récents",
        question: "Quel événement a eu lieu en 2001 ?",
        options: ["Les attentats du 11 septembre", "La guerre mondiale", "La révolution", "L'invention de l'ordinateur"],
        answer: "Les attentats du 11 septembre",
        category: "Histoire récente",
        difficulty: "Difficile" as const
      },
      {
        id: 28,
        title: "L'histoire récente",
        content: "Les événements récents",
        question: "Quel événement a eu lieu en 2020 ?",
        options: ["La pandémie de Covid-19", "La guerre mondiale", "La révolution", "L'invention de l'ordinateur"],
        answer: "La pandémie de Covid-19",
        category: "Histoire récente",
        difficulty: "Difficile" as const
      },
      {
        id: 29,
        title: "Les monuments",
        content: "Les monuments célèbres",
        question: "Quel monument célèbre se trouve à Paris ?",
        options: ["La Tour Eiffel", "Le Big Ben", "La Statue de la Liberté", "Le Taj Mahal"],
        answer: "La Tour Eiffel",
        category: "Histoire locale",
        difficulty: "Difficile" as const
      },
      {
        id: 30,
        title: "Les monuments",
        content: "Les monuments célèbres",
        question: "Quel monument célèbre se trouve à Paris ?",
        options: ["L'Arc de Triomphe", "Le Big Ben", "La Statue de la Liberté", "Le Taj Mahal"],
        answer: "L'Arc de Triomphe",
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
                Histoire
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices d'histoire
              </p>
            </motion.div>
            <div className="flex justify-end items-center mb-4">
              <Timer timeLeft={timeLeft} />
            </div>
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
          {/* Rest of the component content */}
        </section>
      </div>
    </div>
  );
};

export default HistoryPage;

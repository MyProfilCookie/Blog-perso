"use client";
import dynamic from 'next/dynamic';
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */

import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Button } from '@nextui-org/react';
const motion = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion })), { ssr: false });
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/fr"; // 📅 Locale française
import { useTheme } from "next-themes";

import Image from "next/image";

import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import { withPremiumGuard } from "@/components/premium-guard";
import AIAssistant from "@/components/AIAssistant";
// Configuration de la locale française
dayjs.locale("fr");

type Lesson = {
  subject: string;
  lesson: {
    [x: string]: any;
    activities?: { title: string; duration: string; steps: string[] }[];
    questions?: any;
    title: string;
    description: string;
    objectives?: string[];
    resources?: { title: string; link: string; type: string }[];
    estimatedTime?: string;
    difficulty?: string;
    prerequisites?: string[];
  };
};

type LessonData = {
  date: string;
  lessons: Lesson[];
};

const LessonsPage: React.FC = (): JSX.Element => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const today = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(today);
  const [lessonOfTheDay, setLessonOfTheDay] = useState<LessonData | null>(null);
  const [, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const router = useRouter();
  const [showResources, setShowResources] = useState<boolean>(false);
  const [showPrerequisites, setShowPrerequisites] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [score, setScore] = useState(0);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});

  // Charger les notes du localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(`lessons_notes_${selectedDate}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [selectedDate]);

  // Charger les notes du localStorage
  useEffect(() => {
    const savedRatings = localStorage.getItem(`lessons_ratings_${selectedDate}`);
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    }
  }, [selectedDate]);

  // Sauvegarder les notes dans le localStorage
  useEffect(() => {
    if (notes) {
      localStorage.setItem(`lessons_notes_${selectedDate}`, notes);
    }
  }, [notes, selectedDate]);

  // Sauvegarder les notes dans le localStorage
  useEffect(() => {
    if (Object.keys(ratings).length > 0) {
      localStorage.setItem(`lessons_ratings_${selectedDate}`, JSON.stringify(ratings));
    }
  }, [ratings, selectedDate]);

  // Sauvegarder la progression dans le localStorage
  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      localStorage.setItem(`lessons_progress_${selectedDate}`, JSON.stringify(progress));
    }
  }, [progress, selectedDate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userFirstName");
    setIsLoggedIn(false);
    setTimeout(() => router.push("/users/login"), 300);
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      handleLogout();

      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        handleLogout();

        return;
      }

      if (!res.ok)
        throw new Error("Erreur lors de la récupération de l'utilisateur.");

      const userData = await res.json();

      setUserName(userData?.user?.prenom || "Utilisateur inconnu");
    } catch (error) {
      handleLogout();
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchUserData();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchLessonOfTheDay = async (date: string) => {
    if (!isLoggedIn) return;

    try {
      const formattedDateForAPI = dayjs(date).format("YYYY-MM-DD");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/lesson-of-the-day?date=${formattedDateForAPI}`,
      );

      if (!res.ok)
        throw new Error("Erreur lors de la récupération des leçons.");

      const lesson: LessonData = await res.json();

      setLessonOfTheDay(lesson);
    } catch (error) {
      setError(`Erreur : ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchLessonOfTheDay(selectedDate);
  }, [selectedDate, isLoggedIn]);

  const [encouragementMessage, setEncouragementMessage] = useState<string>("");

  const handleLessonRating = (rating: "Facile" | "Moyen" | "Difficile") => {
    setRatings((prevRatings) => {
      const newRatings = {
        ...prevRatings,
        [rating]: prevRatings[rating] + 1,
      };
      
      // Sauvegarder dans le localStorage
      localStorage.setItem(`lessons_ratings_${selectedDate}`, JSON.stringify(newRatings));
      
      return newRatings;
    });

    if (rating === "Facile") {
      setCorrectAnswers(prev => prev + 1);
      setTotalQuestions(prev => prev + 1);
    } else {
      setTotalQuestions(prev => prev + 1);
    }

    // Messages d'encouragement personnalisés selon la difficulté
    const messages = {
      Facile: [
        "🌟 Bravo ! Tu as très bien réussi cette leçon ! Continue comme ça !",
        "✨ Excellent travail ! Tu peux être fier(e) de toi !",
        "🎉 Super ! Tu as tout compris ! Tu es sur la bonne voie !"
      ],
      Moyen: [
        "💪 Tu as fait de beaux efforts ! Chaque pas compte !",
        "🌈 Continue d'essayer, tu progresses très bien !",
        "⭐ Tu t'améliores chaque jour, c'est super !"
      ],
      Difficile: [
        "🤗 N'abandonne pas ! Tu es courageux(se) d'avoir essayé !",
        "🌱 Chaque difficulté te rend plus fort(e) ! On continue ensemble !",
        "💝 Tu as osé essayer, c'est déjà une belle victoire !"
      ]
    };

    // Sélection aléatoire d'un message d'encouragement
    const randomMessage = messages[rating][Math.floor(Math.random() * messages[rating].length)];
    setEncouragementMessage(randomMessage);

    // Sauvegarder la progression
    const newProgress = progress + 1;
    setProgress(newProgress);
    localStorage.setItem(`lessons_progress_${selectedDate}`, JSON.stringify(newProgress));
  };

  const calculateFinalScore = () => {
    const total = totalQuestions;
    const correct = correctAnswers;
    const score = (correct / total) * 100;

    setScore(score);
    setShowResult(true);
    setIsFinished(true);
  };

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsFinished(true);
      setShowResult(true);
    }
  }, [timeLeft, isFinished]);

  if (!isLoggedIn) {
    return (
      <motion.section
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-6 py-8 md:py-10"
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl font-bold text-red-600">⚠️ Session expirée</h1>
        <Button
          className="bg-blue-600 text-white px-6 py-2 rounded-md mt-4"
          onClick={handleLogout}
        >
          🔑 Se reconnecter
        </Button>
      </motion.section>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <BackButton />
        <Timer timeLeft={timeLeft} />
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
                Leçons
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices de leçons
              </p>
            </motion.div>
          </div>

          {/* Statistiques rapides */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200 dark:border-violet-700"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📚</span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Leçons complétées</p>
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">12</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200 dark:border-violet-700"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">⏱️</span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Temps d&apos;étude</p>
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">2h 30</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200 dark:border-violet-700"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🎯</span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Objectifs atteints</p>
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">8/10</p>
                  </div>
                </div>
              </motion.div>
              <AIAssistant />

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200 dark:border-violet-700"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🌟</span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Points gagnés</p>
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">450</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-7xl mx-auto px-0 sm:px-4"
          >
            {/* En-tête avec les informations de l'utilisateur */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-none sm:rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8 text-white shadow-xl">
              <motion.h1 
                className="text-2xl sm:text-4xl font-extrabold text-center mb-2 sm:mb-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                ✨ Bienvenue sur votre espace d&apos;apprentissage, <span className="text-yellow-300">{userName}</span> ! ✨
              </motion.h1>
              <p className="text-center text-sm sm:text-lg opacity-90">Découvrez votre programme personnalisé du jour</p>
            </div>

            {/* Sélecteur de date et statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8 px-2 sm:px-4">
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 shadow-lg border border-violet-200 dark:border-violet-700"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg sm:text-2xl font-bold text-violet-700 dark:text-violet-400 mb-2 sm:mb-4">📅 Sélection de la date</h2>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                  <input
                    className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-violet-200 focus:border-violet-500 focus:outline-none w-full sm:flex-grow text-sm sm:text-base"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  <Button
                    className="bg-violet-600 hover:bg-violet-700 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
                    onClick={() => fetchLessonOfTheDay(selectedDate)}
                  >
                    <span>🔄</span> Actualiser
                  </Button>
                </div>
                <p className="mt-2 sm:mt-4 text-xs sm:text-base text-gray-600 dark:text-gray-300">
                  Nous sommes le {dayjs().format("dddd DD MMMM YYYY")}
                </p>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-violet-200 dark:border-violet-700"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-violet-700 dark:text-violet-400 mb-3 sm:mb-4">📊 Votre progression</h2>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">😊</p>
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">Facile</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <p className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">😐</p>
                    <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">Moyen</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">😓</p>
                    <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">Difficile</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contenu des leçons */}
            {lessonOfTheDay ? (
              <motion.div 
                className="space-y-4 sm:space-y-8 px-0 sm:px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {lessonOfTheDay.lessons.map((lesson, lessonIndex) => (
                  <Card
                    key={lessonIndex}
                    className="w-full overflow-hidden bg-white dark:bg-gray-800 border-0 sm:border-2 border-violet-200 dark:border-violet-700 rounded-none sm:rounded-xl shadow-xl"
                  >
                    <CardBody className="p-2 sm:p-6">
                      <div className="flex flex-col md:flex-row gap-2 sm:gap-6">
                        <div className="w-full md:w-1/3">
                          <motion.div 
                            className="relative h-48 sm:h-60 rounded-none sm:rounded-xl overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Image
                              alt={`Leçon ${lesson.lesson.title}`}
                              src={`/assets/${lesson.subject.toLowerCase()}.jpg`}
                              className="object-cover"
                              fill
                              onError={(e) => (e.currentTarget.src = "/assets/lessons.webp")}
                            />
                          </motion.div>
                        </div>
                        
                        <div className="w-full md:w-2/3">
                          <h3 className="text-xl sm:text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2 sm:mb-4">
                            {lesson.subject}: {lesson.lesson.title}
                          </h3>
                          
                          <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-6">
                            {lesson.lesson.description}
                          </p>

                          {/* Informations supplémentaires */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                            <div className="bg-violet-50 dark:bg-violet-900/30 p-3 rounded-lg">
                              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">⏱️ Durée estimée</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{lesson.lesson.estimatedTime || "30 min"}</p>
                            </div>
                            <div className="bg-violet-50 dark:bg-violet-900/30 p-3 rounded-lg">
                              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">📊 Difficulté</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{lesson.lesson.difficulty || "Moyenne"}</p>
                            </div>
                            <div className="bg-violet-50 dark:bg-violet-900/30 p-3 rounded-lg">
                              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">🎯 Objectifs</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{lesson.lesson.objectives?.length || 0} objectifs</p>
                            </div>
                          </div>

                          {/* Prerequisites */}
                          {lesson.lesson.prerequisites && lesson.lesson.prerequisites.length > 0 && (
                            <div className="mb-4">
                              <Button
                                className="w-full bg-violet-50 hover:bg-violet-100 text-violet-700 mb-2"
                                onClick={() => setShowPrerequisites(!showPrerequisites)}
                              >
                                <span className="mr-2">📚</span> Prérequis
                              </Button>
                              {showPrerequisites && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="bg-violet-50 dark:bg-violet-900/30 p-4 rounded-lg"
                                >
                                  <ul className="space-y-2">
                                    {lesson.lesson.prerequisites.map((prereq, i) => (
                                      <li key={i} className="flex items-center gap-2 text-sm">
                                        <span className="text-violet-500">•</span> {prereq}
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </div>
                          )}

                          {lesson.lesson.objectives && lesson.lesson.objectives.length > 0 && (
                            <div className="mb-3 sm:mb-6">
                              <h4 className="text-base sm:text-xl font-semibold text-violet-600 dark:text-violet-400 mb-2 sm:mb-3 flex items-center gap-2">
                                <span>🎯</span> Objectifs
                              </h4>
                              <ul className="space-y-1 sm:space-y-2">
                                {lesson.lesson.objectives.map((objective, i) => (
                                  <li key={i} className="flex items-center gap-2 text-xs sm:text-base text-gray-700 dark:text-gray-300">
                                    <span className="text-violet-500">•</span> {objective}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {lesson.lesson.steps && lesson.lesson.steps.length > 0 && (
                            <div className="mb-4 sm:mb-6">
                              <h4 className="text-lg sm:text-xl font-semibold text-violet-600 dark:text-violet-400 mb-2 sm:mb-3 flex items-center gap-2">
                                <span>📝</span> Étapes
                              </h4>
                              <ul className="space-y-1 sm:space-y-2">
                                {lesson.lesson.steps.map((step: string, i: number) => (
                                  <li key={i} className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                    <span className="text-violet-500">{i + 1}.</span> {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {lesson.lesson.activities && lesson.lesson.activities.length > 0 && (
                            <div className="mb-4 sm:mb-6">
                              <h4 className="text-lg sm:text-xl font-semibold text-violet-600 dark:text-violet-400 mb-2 sm:mb-3 flex items-center gap-2">
                                <span>🎮</span> Activités
                              </h4>
                              <div className="space-y-3 sm:space-y-4">
                                {lesson.lesson.activities.map((activity, i) => (
                                  <div key={i} className="bg-violet-50 dark:bg-violet-900/30 p-3 sm:p-4 rounded-lg">
                                    <h5 className="font-semibold text-sm sm:text-base text-violet-700 dark:text-violet-300 mb-2">{activity.title}</h5>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">⏱️ Durée: {activity.duration}</p>
                                    <ul className="mt-2 space-y-1">
                                      {activity.steps.map((step, j) => (
                                        <li key={j} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">• {step}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Resources */}
                          {lesson.lesson.resources && lesson.lesson.resources.length > 0 && (
                            <div className="mb-4">
                              <Button
                                className="w-full bg-violet-50 hover:bg-violet-100 text-violet-700 mb-2"
                                onClick={() => setShowResources(!showResources)}
                              >
                                <span className="mr-2">📖</span> Ressources complémentaires
                              </Button>
                              {showResources && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="bg-violet-50 dark:bg-violet-900/30 p-4 rounded-lg"
                                >
                                  <div className="space-y-3">
                                    {lesson.lesson.resources.map((resource, i) => (
                                      <a
                                        key={i}
                                        href={resource.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800"
                                      >
                                        <span className="text-violet-500">•</span> {resource.title}
                                        <span className="text-xs bg-violet-100 px-2 py-1 rounded-full">{resource.type}</span>
                                      </a>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )}

                          {/* Notes personnelles */}
                          <div className="mb-4">
                            <h4 className="text-base font-semibold text-violet-600 dark:text-violet-400 mb-2">📝 Mes notes</h4>
                            <textarea
                              className="w-full p-3 rounded-lg border-2 border-violet-200 focus:border-violet-500 focus:outline-none text-sm"
                              rows={4}
                              placeholder="Prenez des notes pendant la leçon..."
                              value={notes}
                              onChange={(e) => {
                                setNotes(e.target.value);
                                localStorage.setItem(`lessons_notes_${selectedDate}`, e.target.value);
                              }}
                            />
                          </div>

                          {/* Évaluation de la leçon */}
                          <div className="mt-4 sm:mt-8 border-t pt-3 sm:pt-6 border-violet-200">
                            <h4 className="text-base sm:text-xl font-semibold text-violet-600 dark:text-violet-400 mb-2 sm:mb-4">Comment as-tu trouvé cette leçon ?</h4>
                            <div className="flex flex-wrap gap-2 sm:gap-4">
                              <Button
                                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 sm:px-6 py-1.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-base transition-all duration-200"
                                onClick={() => handleLessonRating("Facile")}
                              >
                                <span>😊</span> Facile
                              </Button>
                              <Button
                                className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 sm:px-6 py-1.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-base transition-all duration-200"
                                onClick={() => handleLessonRating("Moyen")}
                              >
                                <span>😐</span> Moyen
                              </Button>
                              <Button
                                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-2 sm:px-6 py-1.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-base transition-all duration-200"
                                onClick={() => handleLessonRating("Difficile")}
                              >
                                <span>😓</span> Difficile
                              </Button>
                            </div>
                            
                            {/* Message d'encouragement */}
                            {encouragementMessage && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-violet-50 dark:bg-violet-900/30 rounded-xl text-center"
                              >
                                <p className="text-sm sm:text-base font-medium text-violet-700 dark:text-violet-300">
                                  {encouragementMessage}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-8 sm:py-12 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="animate-spin text-3xl sm:text-4xl mb-3 sm:mb-4">🔄</div>
                <h3 className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">Chargement de votre leçon...</h3>
              </motion.div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default withPremiumGuard(LessonsPage);

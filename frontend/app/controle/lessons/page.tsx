/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
"use client";

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
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/fr"; // 📅 Locale française

import Image from "next/image";

import BackButton from "@/components/back";

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
  };
};

type LessonData = {
  date: string;
  lessons: Lesson[];
};

export default function LessonOfTheDay() {
  const today = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(today);
  const [lessonOfTheDay, setLessonOfTheDay] = useState<LessonData | null>(null);
  const [, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const router = useRouter();

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

  const [, setRatings] = useState<{
    Facile: number;
    Moyen: number;
    Difficile: number;
  }>({
    Facile: 0,
    Moyen: 0,
    Difficile: 0,
  });

  const handleLessonRating = (rating: "Facile" | "Moyen" | "Difficile") => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [rating]: prevRatings[rating] + 1,
    }));
  };

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
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
      <BackButton />
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto px-4"
      >
        {/* En-tête avec les informations de l'utilisateur */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <motion.h1 
            className="text-4xl font-extrabold text-center mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            ✨ Bienvenue sur votre espace d&apos;apprentissage, <span className="text-yellow-300">{userName}</span> ! ✨
          </motion.h1>
          <p className="text-center text-lg opacity-90">Découvrez votre programme personnalisé du jour</p>
        </div>

        {/* Sélecteur de date et statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-violet-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-4">📅 Sélection de la date</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                className="px-4 py-2 rounded-lg border-2 border-violet-200 focus:border-violet-500 focus:outline-none flex-grow"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <Button
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                onClick={() => fetchLessonOfTheDay(selectedDate)}
              >
                <span>🔄</span> Actualiser
              </Button>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Nous sommes le {dayjs().format("dddd DD MMMM YYYY")}
            </p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-violet-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-4">📊 Votre progression</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">😊</p>
                <p className="text-sm text-green-700 dark:text-green-300">Facile</p>
              </div>
              <div className="text-center p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">😐</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Moyen</p>
              </div>
              <div className="text-center p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">😓</p>
                <p className="text-sm text-red-700 dark:text-red-300">Difficile</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contenu des leçons */}
        {lessonOfTheDay ? (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {lessonOfTheDay.lessons.map((lesson, lessonIndex) => (
              <Card
                key={lessonIndex}
                className="w-full overflow-hidden bg-white dark:bg-gray-800 border-2 border-violet-200 rounded-xl shadow-xl"
              >
                <CardBody className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <motion.div 
                        className="relative h-60 rounded-xl overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          alt={`Leçon ${lesson.lesson.title}`}
                          src={`/assets/${lesson.subject.toLowerCase()}.jpg`}
                          className="object-cover"
                          fill
                          onError={(e) => (e.currentTarget.src = "/assets/lessons.jpg")}
                        />
                      </motion.div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <h3 className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-4">
                        {lesson.subject}: {lesson.lesson.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {lesson.lesson.description}
                      </p>

                      {lesson.lesson.objectives && lesson.lesson.objectives.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-xl font-semibold text-violet-600 dark:text-violet-400 mb-3 flex items-center gap-2">
                            <span>🎯</span> Objectifs
                          </h4>
                          <ul className="space-y-2">
                            {lesson.lesson.objectives.map((objective, i) => (
                              <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <span className="text-violet-500">•</span> {objective}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {lesson.lesson.steps && lesson.lesson.steps.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-xl font-semibold text-violet-600 dark:text-violet-400 mb-3 flex items-center gap-2">
                            <span>📝</span> Étapes
                          </h4>
                          <ul className="space-y-2">
                            {lesson.lesson.steps.map((step: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <span className="text-violet-500">{i + 1}.</span> {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {lesson.lesson.activities && lesson.lesson.activities.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-xl font-semibold text-violet-600 dark:text-violet-400 mb-3 flex items-center gap-2">
                            <span>🎮</span> Activités
                          </h4>
                          <div className="space-y-4">
                            {lesson.lesson.activities.map((activity, i) => (
                              <div key={i} className="bg-violet-50 dark:bg-violet-900/30 p-4 rounded-lg">
                                <h5 className="font-semibold text-violet-700 dark:text-violet-300 mb-2">{activity.title}</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">⏱️ Durée: {activity.duration}</p>
                                <ul className="mt-2 space-y-1">
                                  {activity.steps.map((step, j) => (
                                    <li key={j} className="text-gray-700 dark:text-gray-300 text-sm">• {step}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Évaluation de la leçon */}
                      <div className="mt-8 border-t pt-6 border-violet-200">
                        <h4 className="text-xl font-semibold text-violet-600 dark:text-violet-400 mb-4">Comment avez-vous trouvé cette leçon ?</h4>
                        <div className="flex flex-wrap gap-4">
                          <Button
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200"
                            onClick={() => handleLessonRating("Facile")}
                          >
                            <span>😊</span> Facile
                          </Button>
                          <Button
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200"
                            onClick={() => handleLessonRating("Moyen")}
                          >
                            <span>😐</span> Moyen
                          </Button>
                          <Button
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200"
                            onClick={() => handleLessonRating("Difficile")}
                          >
                            <span>😓</span> Difficile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin text-4xl mb-4">🔄</div>
            <h3 className="text-xl text-gray-600 dark:text-gray-400">Chargement de votre leçon...</h3>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

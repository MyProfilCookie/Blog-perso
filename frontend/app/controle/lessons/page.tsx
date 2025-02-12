/* eslint-disable padding-line-between-statements */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line react-hooks/rules-of-hooks
"use client";

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

// en français
import "dayjs/locale/fr"; // 📅 Importer la locale française
dayjs.locale("fr"); // 📌 Définir la locale en français


import BackButton from "@/components/back";

// Définition des types
type Lesson = {
  subject: string;
  lesson: {
    activities: any;
    questions: any;
    title: string;
    description: string;
    objectives: string[];
  };
};

type LessonData = {
  date: string;
  lessons: Lesson[];
};


export default function LessonOfTheDay() {
  const today = dayjs().format("YYYY-MM-DD"); // 📅 Format d'affichage correct
  const [selectedDate, setSelectedDate] = useState(today);
  const [lessonOfTheDay, setLessonOfTheDay] = useState<LessonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>(""); // 🏷️ Stocke le prénom de l'utilisateur
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const router = useRouter();

  // 🔄 Récupération du prénom de l'utilisateur depuis l'API
   // 🔄 Récupération du prénom de l'utilisateur depuis l'API
   const fetchUserData = async () => {
    const token = localStorage.getItem("userToken");
    
    if (!token) {
      console.warn("⚠️ Aucun token trouvé, l'utilisateur doit se reconnecter.");
      setIsLoggedIn(false);
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

      if (!res.ok) {
        throw new Error("❌ Erreur de récupération des données utilisateur.");
      }

      const userData = await res.json();
      console.log("✅ Données utilisateur récupérées :", userData);

      if (userData.user && userData.user.prenom) {
        setUserName(userData.user.prenom);
        localStorage.setItem("userFirstName", userData.user.prenom);
      } else {
        setUserName("Utilisateur inconnu");
      }
    } catch (error) {
      console.error("⚠️ Erreur lors de la récupération du prénom :", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const cachedName = localStorage.getItem("userFirstName");
    if (cachedName) {
      setUserName(cachedName);
    } else {
      fetchUserData();
    }
  }, []);
  // 🔄 Récupération de la leçon du jour
  const fetchLessonOfTheDay = async (date: string) => {
    try {
      const formattedDateForAPI = dayjs(date, "DD-MM-YYYY").format(
        "YYYY-MM-DD",
      ); // Convertir pour l'API
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
    fetchUserData(); // 🔥 Charge le prénom au montage
    fetchLessonOfTheDay(selectedDate);
  }, [selectedDate]);

  if (!isLoggedIn) {
    return (
      <motion.section 
        className="flex flex-col items-center justify-center gap-6 py-8 md:py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl font-bold text-red-600">⚠️ Session expirée</h1>
        <p className="text-lg text-gray-700">Votre session a expiré. Veuillez vous reconnecter pour accéder à votre leçon du jour.</p>
        <Button className="bg-blue-600 text-white px-6 py-2 rounded-md" onClick={() => router.push("/users/login")}>
          🔑 Se reconnecter
        </Button>
      </motion.section>
    );
}


// eslint-disable-next-line react-hooks/rules-of-hooks
const [ratings, setRatings] = useState<{ Facile: number; Moyen: number; Difficile: number }>({
  Facile: 0,
  Moyen: 0,
  Difficile: 0,
});

const handleLessonRating = (lessonIndex: number, rating: "Facile" | "Moyen" | "Difficile") => {
  setRatings((prevRatings) => ({
    ...prevRatings,
    [rating]: prevRatings[rating] + 1,
  }));
};

const getOverallFeedback = () => {
  const maxRating = Math.max(ratings.Facile, ratings.Moyen, ratings.Difficile);
  if (maxRating === ratings.Facile) return "😊 Majorité : Facile";
  if (maxRating === ratings.Moyen) return "😐 Majorité : Moyen";
  return "😟 Majorité : Difficile";
};

return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
      <BackButton />
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-violet-600 text-center"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        🌟 Bonjour, <span className="text-indigo-500">{userName}</span> ! 🌟
      </motion.h1>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border bg-violet-100 border-violet-300 rounded-lg shadow-md text-center w-full md:w-3/4"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-violet-700">📚 Leçon du jour</h2>
        <p className="mt-2 text-lg font-semibold text-gray-700">
          Nous sommes le {dayjs().locale("fr").format("dddd DD MMMM YYYY")}. Prêt(e) pour une nouvelle leçon ?
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <input
            className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Button
            className="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700"
            onClick={() => fetchLessonOfTheDay(selectedDate)}
          >
            🔄 Changer la date
          </Button>
        </div>
      </motion.div>

      {lessonOfTheDay ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full md:w-3/4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          {lessonOfTheDay.lessons.map((lesson, lessonIndex) => (
            <motion.div key={lessonIndex} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="w-full p-4 mt-6 rounded-md shadow-md bg-white border border-gray-200">
                <CardBody>
                  <h3 className="text-3xl font-bold text-violet-600">
                    {lesson.subject}: {lesson.lesson.title}
                  </h3>

                  <motion.div
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center my-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    <img
                      alt={`Leçon ${lesson.lesson.title}`}
                      className="object-cover rounded-md shadow-md w-80 h-60"
                      src={`/assets/${lesson.subject.toLowerCase()}.jpg`}
                    />
                  </motion.div>

                  <p className="mt-4 text-gray-600 text-md">{lesson.lesson.description}</p>

                  <h4 className="mt-4 text-lg font-semibold text-violet-600">🎯 Objectifs</h4>
                  <ul className="mt-2 text-gray-700 list-disc list-inside">
                    {lesson.lesson.objectives.map((objective, i) => (
                      <li key={i}>{objective}</li>
                    ))}
                  </ul>

                  {lesson.lesson.activities && (
                    <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold text-violet-700">🎨 Activités</h3>
                      {lesson.lesson.activities.map((activity: { title: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; duration: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; steps: any[]; }, activityIndex: Key | null | undefined) => (
                        <div key={activityIndex} className="mt-4">
                          <h4 className="text-lg font-semibold">{activity.title}</h4>
                          <p className="text-sm text-gray-600">⏳ Durée: {activity.duration}</p>
                          <ul className="mt-2 text-gray-700 list-disc list-inside">
                            {activity.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notation de la leçon */}
                  <div className="mt-6 bg-blue-100 p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-violet-700">📊 Noter cette leçon</h3>
                    <div className="flex justify-center gap-4 mt-2">
                      <Button className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600" onClick={() => handleLessonRating(lessonIndex, "Facile")}>😊 Facile</Button>
                      <Button className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600" onClick={() => handleLessonRating(lessonIndex, "Moyen")}>😐 Moyen</Button>
                      <Button className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600" onClick={() => handleLessonRating(lessonIndex, "Difficile")}>😟 Difficile</Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
          {/* Affichage des résultats */}
          <motion.div className="mt-8 p-6 bg-gray-100 shadow-md rounded-lg text-center">
            <h3 className="text-xl font-bold text-violet-700">📊 Résumé des évaluations du jour</h3>
            <p className="mt-2 text-lg text-gray-700">Facile: {ratings.Facile} | Moyen: {ratings.Moyen} | Difficile: {ratings.Difficile}</p>
            <p className="mt-2 text-2xl font-bold">{getOverallFeedback()}</p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div animate={{ opacity: 1 }} className="mt-8 text-center" initial={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          {error ? <h3 className="text-lg text-red-600">{error}</h3> : <h3 className="text-lg text-gray-600">Chargement de la leçon...</h3>}
        </motion.div>
      )}
    </section>
  );
}
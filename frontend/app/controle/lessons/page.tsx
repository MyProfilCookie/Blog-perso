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
      <motion.h1 className="text-4xl font-extrabold text-violet-600 text-center">
        ✨ Bonjour, <span className="text-indigo-500">{userName}</span> ! ✨
      </motion.h1>

      <motion.div className="p-6 border bg-violet-100 border-violet-300 rounded-lg shadow-md text-center w-full md:w-3/4">
        <h2 className="text-3xl font-bold text-violet-700">📚 Leçon du jour</h2>
        <p className="mt-2 text-lg font-semibold text-gray-700">
          Nous sommes le {dayjs().format("dddd DD MMMM YYYY")}
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <input
            className="px-4 py-2 rounded-md border border-gray-200"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Button
            className="px-4 py-2 rounded-md bg-violet-600 text-white"
            onClick={() => fetchLessonOfTheDay(selectedDate)}
          >
            🔄 Changer la date
          </Button>
        </div>
      </motion.div>

      {lessonOfTheDay ? (
        <motion.div className="w-full md:w-3/4">
          {lessonOfTheDay.lessons.map((lesson, lessonIndex) => (
            <Card
              key={lessonIndex}
              className="w-full p-4 mt-6 rounded-md shadow-md bg-cream border border-gray-200"
            >
              <CardBody>
                <h3 className="text-3xl font-bold text-violet-600">
                  {lesson.subject}: {lesson.lesson.title}
                </h3>

                <motion.div className="flex justify-center my-4">
                  <Image
                    alt={`Leçon ${lesson.lesson.title}`}
                    className="object-cover rounded-md shadow-md w-80 h-60"
                    src={`/assets/${lesson.subject.toLowerCase()}.jpg`}
                    onError={(e) =>
                      (e.currentTarget.src = "/assets/lessons.jpg")
                    }
                  />
                </motion.div>

                <p className="mt-4 text-gray-600">
                  {lesson.lesson.description}
                </p>

                {lesson.lesson.objectives &&
                  lesson.lesson.objectives.length > 0 && (
                    <>
                      <h4 className="mt-4 text-lg font-semibold text-violet-600">
                        🌟 Objectifs
                      </h4>
                      <ul className="mt-2 text-gray-700 list-disc list-inside">
                        {lesson.lesson.objectives.map((objective, i) => (
                          <li key={i}>{objective}</li>
                        ))}
                      </ul>
                    </>
                  )}

                {/* Step */}
                {lesson.lesson.steps && lesson.lesson.steps.length > 0 && (
                  <>
                    <h4 className="mt-4 text-lg font-semibold text-violet-600">
                      🌟 Étapes
                    </h4>
                    <ul className="mt-2 text-gray-700 list-disc list-inside">
                      {lesson.lesson.steps.map(
                        (
                          step:
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | Promise<AwaitedReactNode>
                            | null
                            | undefined,
                          i: Key | null | undefined,
                        ) => (
                          <li key={i}>{step}</li>
                        ),
                      )}
                    </ul>
                  </>
                )}

                {/* Activités */}
                {lesson.lesson.activities &&
                  lesson.lesson.activities.length > 0 && (
                    <>
                      <h4 className="mt-4 text-lg font-semibold text-violet-600">
                        🌟 Activités
                      </h4>
                    </>
                  )}
                {/* Explications */}
                {lesson.lesson.explanation &&
                  lesson.lesson.explanation.length > 0 && (
                    <>
                      <h4 className="mt-4 text-lg font-semibold text-violet-600">
                        🌟 Explications
                      </h4>
                    </>
                  )}
                {/* Final activity */}
                {lesson.lesson.final_activity &&
                  lesson.lesson.final_activity.length > 0 && (
                    <>
                      <h4 className="mt-4 text-lg font-semibold text-violet-600">
                        🌟 Activité finale
                      </h4>
                    </>
                  )}
                {/* Conclusion */}
                {lesson.lesson.conclusion &&
                  lesson.lesson.conclusion.length > 0 && (
                    <>
                      <h4 className="mt-4 text-lg font-semibold text-violet-600">
                        🌟 Conclusion
                      </h4>
                    </>
                  )}
                <div className="mt-6 flex justify-center gap-4">
                  <Button onClick={() => handleLessonRating("Facile")}>
                    😊 Facile
                  </Button>
                  <Button onClick={() => handleLessonRating("Moyen")}>
                    😐 Moyen
                  </Button>
                  <Button onClick={() => handleLessonRating("Difficile")}>
                    😓 Difficile
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </motion.div>
      ) : (
        <h3 className="text-lg text-gray-600">Chargement de la leçon...</h3>
      )}
    </section>
  );
}

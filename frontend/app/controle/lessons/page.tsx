"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Radio, RadioGroup, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";

// Définir les types
type Lesson = {
  subject: string;
  lesson: {
    title: string;
    description: string;
    objectives: string[];
    introduction: {
      duration: string;
      description: string;
      steps?: string[];
    };
    activities: Array<{
      title: string;
      duration: string;
      steps: string[];
    }>;
    final_activity?: {
      title: string;
      duration: string;
      description: string;
    };
    conclusion: {
      steps: string[];
    };
  };
};

type LessonData = {
  date: string;
  lessons: Lesson[];
};

export default function LessonOfTheDay() {
  const [lessonOfTheDay, setLessonOfTheDay] = useState<LessonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<{
    [key: number]: string;
  }>({});
  const [globalAppreciations, setGlobalAppreciations] = useState<{
    [key: number]: string;
  }>({});
  const [comments, setComments] = useState<{ [key: number]: string }>({});

  // Fonction pour charger les leçons du jour depuis l'API
  const fetchLessonOfTheDay = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/lesson-of-the-day`,
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
    fetchLessonOfTheDay();
  }, []);

  // Gérer la sélection de l'état de la leçon
  const handleLessonCompletion = (lessonIndex: number, value: string) => {
    setCompletedLessons((prevState) => ({
      ...prevState,
      [lessonIndex]: value,
    }));
  };

  // Gérer l'appréciation globale
  const handleGlobalAppreciation = (lessonIndex: number, value: string) => {
    setGlobalAppreciations((prevState) => ({
      ...prevState,
      [lessonIndex]: value,
    }));
  };

  // Gérer les commentaires du professeur
  const handleCommentChange = (lessonIndex: number, comment: string) => {
    setComments((prevState) => ({ ...prevState, [lessonIndex]: comment }));
  };

  // Renvoyer un emoji basé sur l'état de la leçon
  const getEmojiForCompletion = (status: string) => {
    switch (status) {
      case "success":
        return <span className="emoji-green">😊</span>; // Leçon réussie
      case "partial":
        return <span className="emoji-yellow">😐</span>; // En cours d'acquisition
      case "review":
        return <span className="emoji-red">😟</span>; // Non acquise
      default:
        return "";
    }
  };

  const getBackgroundColorForSubject = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "sciences":
        return "bg-green-100";
      case "mathématiques":
        return "bg-blue-100";
      case "français":
        return "bg-yellow-100";
      case "arts plastiques":
        return "bg-pink-100";
      case "langues":
        return "bg-purple-100";
      case "histoire":
        return "bg-orange-100";
      case "géographie":
        return "bg-teal-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
      <div className="w-full text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border bg-violet-100 border-violet-300"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="mb-4 text-5xl font-extrabold text-violet-600">
            Leçon du jour
          </h1>
          <h2 className="mb-2 text-xl text-violet-700">
            Découvrez la leçon adaptée pour aujourd&rsquo;hui.
          </h2>
          <p className="text-lg font-semibold text-gray-700">
            Bienvenue ! Nous sommes le{" "}
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            . Prêt(e) pour une nouvelle leçon ?
          </p>
        </motion.div>
      </div>

      {lessonOfTheDay ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          {lessonOfTheDay.lessons.map((lesson, index) => (
            <Card
              key={index}
              className={`w-full p-4 mt-6 rounded-md shadow-sm ${getBackgroundColorForSubject(
                lesson.subject,
              )}`}
            >
              <CardBody>
                <h4 className="text-3xl font-bold text-violet-600">
                  {lesson.subject}: {lesson.lesson.title}
                </h4>

                <div className="flex justify-center my-4">
                  <img
                    alt={`Leçon ${lesson.lesson.title}`}
                    className="object-cover rounded-md shadow-md w-80 h-60"
                    src={`/assets/${lesson.subject.toLowerCase()}.jpg`}
                  />
                </div>

                <p className="mt-4 text-gray-600 text-md">
                  {lesson.lesson.description}
                </p>

                <div className="mt-4">
                  <h5 className="text-lg font-semibold text-violet-600">
                    Objectifs
                  </h5>
                  <ul className="mt-2 text-gray-700 list-disc list-inside">
                    {lesson.lesson.objectives.map((objective, i) => (
                      <li key={i}>{objective}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h5 className="text-lg font-semibold text-violet-600">
                    Introduction ({lesson.lesson.introduction.duration})
                  </h5>
                  <p>{lesson.lesson.introduction.description}</p>
                </div>

                <div className="mt-4">
                  <h5 className="text-lg font-semibold text-violet-600">
                    Activités
                  </h5>
                  {lesson.lesson.activities.map((activity, i) => (
                    <div key={i} className="mt-4">
                      <h6 className="font-bold text-gray-800 text-md">
                        {activity.title} ({activity.duration})
                      </h6>
                      <ul className="mt-2 text-gray-700 list-disc list-inside">
                        {activity.steps.map((step, j) => (
                          <li key={j}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h5 className="text-lg font-semibold text-violet-600">
                    Leçon terminée ?
                  </h5>
                  <RadioGroup
                    value={completedLessons[index] || ""}
                    onChange={(event) =>
                      handleLessonCompletion(index, event.target.value)
                    }
                  >
                    <Radio value="success">
                      <span className="text-green-600">
                        Réussi avec succès {getEmojiForCompletion("success")}
                      </span>
                    </Radio>
                    <Radio value="partial">
                      <span className="text-yellow-600">
                        Réussi partiellement {getEmojiForCompletion("partial")}
                      </span>
                    </Radio>
                    <Radio value="review">
                      <span className="text-red-600">
                        À revoir {getEmojiForCompletion("review")}
                      </span>
                    </Radio>
                  </RadioGroup>
                </div>

                {/* Appréciation globale */}
                <div className="mt-6">
                  <h5 className="text-lg font-semibold text-violet-600">
                    Appréciation globale
                  </h5>
                  <RadioGroup
                    value={globalAppreciations[index] || ""}
                    onChange={(event) =>
                      handleGlobalAppreciation(index, event.target.value)
                    }
                  >
                    <Radio value="très bien">
                      <span className="text-green-600">Très bien</span>
                    </Radio>
                    <Radio value="bien">
                      <span className="text-blue-600">Bien</span>
                    </Radio>
                    <Radio value="moyen">
                      <span className="text-yellow-600">Moyen</span>
                    </Radio>
                    <Radio value="à améliorer">
                      <span className="text-red-600">À améliorer</span>
                    </Radio>
                  </RadioGroup>
                </div>

                {/* Commentaires */}
                <div className="mt-6">
                  <h5 className="text-lg font-semibold text-violet-600">
                    Commentaire du professeur
                  </h5>
                  <Textarea
                    placeholder="Ajouter un commentaire ici"
                    rows={4}
                    value={comments[index] || ""}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                  />
                </div>
              </CardBody>
            </Card>
          ))}
        </motion.div>
      ) : (
        <div className="mt-8 text-center">
          {error ? (
            <h3 className="text-lg text-red-600">{error}</h3>
          ) : (
            <h3 className="text-lg text-gray-600">Chargement de la leçon...</h3>
          )}
        </div>
      )}

      <footer className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          © 2024 AutiStudy - Tous droits réservés. Créé par la famille Ayivor.
        </p>
      </footer>
    </section>
  );
}

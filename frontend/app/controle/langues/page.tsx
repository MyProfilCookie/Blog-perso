/* eslint-disable prettier/prettier */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Image, Spacer } from "@nextui-org/react";
import { motion } from "framer-motion";

import BackButton from "@/components/back";
import LoadingAnimation from "@/components/loading";

// Interface pour les exercices d'anglais
interface Exercise {
  id: number;
  title: string;
  content: string;
  question: string;
  options?: string[]; // Options pour les questions à choix multiples
  image?: string;
  answer: string;
}

// Couleurs de fond pour les cartes d'exercices
const lessonBackgroundColors = [
  "#f0f8ff", // AliceBlue
  "#e6f7ff", // LightSkyBlue
  "#f0fff0", // HoneyDew
  "#fffaf0", // FloralWhite
  "#ffebcd", // BlanchedAlmond
  "#f5f5dc", // Beige
  "#fafad2", // LightGoldenRodYellow
  "#e0ffff", // LightCyan
  "#ffefd5", // PapayaWhip
  "#ffe4e1", // MistyRose
];

const EnglishPage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [emoji, setEmoji] = useState<string>("");
  const [encouragementMessage, setEncouragementMessage] = useState<string>("");

  useEffect(() => {
    // Récupération des données du fichier JSON
    fetch("/dataenglish.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load JSON file");
        }

        return response.json();
      })
      .then((data) => {
        setExercises(data.english_exercises);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    id: number,
  ) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = (id: number, correctAnswer: string) => {
    const userAnswer = userAnswers[id];

    if (!userAnswer) return;

    const isCorrect =
      userAnswer.toString().trim().toLowerCase() ===
      correctAnswer.toLowerCase();

    setResults({ ...results, [id]: isCorrect });
  };

  const getEncouragementMessage = (score: number) => {
    const messages = {
      perfect: [
        "🌟 Incroyable ! Tu as tout réussi ! Tu es vraiment doué(e) en anglais !",
        "✨ Parfait ! Quel talent ! Continue comme ça, tu es extraordinaire !",
        "🎉 100% ! Tu peux être très fier(e) de toi, c'est excellent !"
      ],
      excellent: [
        "🌈 Quel beau travail ! Tu as presque tout réussi !",
        "⭐ Super score ! Tu progresses vraiment bien en anglais !",
        "💫 Bravo ! Tu as fait un travail remarquable !"
      ],
      good: [
        "💪 Tu es sur la bonne voie ! Continue tes efforts !",
        "�� Chaque exercice te fait progresser, continue ainsi !",
        "🎈 Tu t'améliores à chaque fois, c'est super !"
      ],
      needsWork: [
        "🤗 N'abandonne pas ! L'anglais demande de la pratique !",
        "💝 Tu as osé essayer, c'est déjà une belle victoire !",
        "🌟 Chaque erreur est une chance d'apprendre, continue d'essayer !"
      ]
    };

    const getRandomMessage = (messageArray: string[]) => {
      return messageArray[Math.floor(Math.random() * messageArray.length)];
    };

    if (score === 100) {
      return getRandomMessage(messages.perfect);
    } else if (score >= 80) {
      return getRandomMessage(messages.excellent);
    } else if (score >= 50) {
      return getRandomMessage(messages.good);
    } else {
      return getRandomMessage(messages.needsWork);
    }
  };

  const calculateFinalScore = () => {
    if (!exercises) return;
    const total = exercises.length;
    const correct = Object.values(results).filter(Boolean).length;
    const score = (correct / total) * 100;

    setFinalScore(score);
    setEncouragementMessage(getEncouragementMessage(score));

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

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!exercises) {
    return <div>Aucun exercice disponible.</div>;
  }

  return (
    <section className="flex flex-col items-center justify-center w-full gap-4 py-8 md:py-10">
      <BackButton />
      <div className="w-full px-4 text-center">
        <Image
          alt="Header Image"
          className="object-contain mx-auto"
          height="200px"
          src="/assets/entete.webp"
          width="100%"
        />
        <Spacer y={2} />
        <h1 className="text-3xl font-bold text-blue-600">
          Exercices d&apos;Anglais
        </h1>
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid w-full grid-cols-1 gap-4 px-4 mt-8 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {exercises.map((exercise, index) => (
          <Card
            key={exercise.id}
            className="w-full py-4"
            style={{
              backgroundColor:
                lessonBackgroundColors[index % lessonBackgroundColors.length],
              borderRadius: "12px",
            }}
          >
            <CardBody className="flex flex-col items-center">
              <h3 className="font-bold text-blue-800 text-large">
                {exercise.title}
              </h3>
              <p className="mb-4 text-center">{exercise.content}</p>
              <p>{exercise.question}</p>
              {exercise.image && (
                <Image
                  alt={exercise.title}
                  className="object-contain w-48 h-48 mt-2"
                  src={`/assets/english/${exercise.image}`}
                />
              )}

              {exercise.options ? (
                <select
                  className="px-2 py-1 mt-2 border rounded"
                  disabled={results[exercise.id] !== undefined}
                  value={userAnswers[exercise.id] || ""}
                  onChange={(e) => handleChange(e, exercise.id)}
                >
                  <option value="">Sélectionnez une option</option>
                  {exercise.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="px-2 py-1 mt-2 border rounded"
                  disabled={results[exercise.id] !== undefined}
                  placeholder="Votre réponse"
                  type="text"
                  value={userAnswers[exercise.id] || ""}
                  onChange={(e) => handleChange(e, exercise.id)}
                />
              )}

              <button
                className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                disabled={results[exercise.id] !== undefined}
                onClick={() => handleSubmit(exercise.id, exercise.answer)}
              >
                Soumettre
              </button>
              {results[exercise.id] !== undefined && (
                <p
                  className={`mt-2 ${results[exercise.id] ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {results[exercise.id]
                    ? "Bonne réponse !"
                    : "Mauvaise réponse, réessayez."}
                </p>
              )}
            </CardBody>
          </Card>
        ))}
      </motion.div>

      {finalScore !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-center space-y-4"
        >
          <h2 className="text-2xl font-bold">
            Ton score final: {finalScore.toFixed(2)}% {emoji}
          </h2>
          {encouragementMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-4 bg-violet-50 dark:bg-violet-900/30 rounded-xl"
            >
              <p className="text-lg font-medium text-violet-700 dark:text-violet-300">
                {encouragementMessage}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      <div className="mt-4">
        <button
          className="px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-700"
          onClick={calculateFinalScore}
        >
          Calculer le score final
        </button>
      </div>
    </section>
  );
};

export default EnglishPage;

"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Image, Spacer } from "@nextui-org/react";
import { motion } from "framer-motion";

interface Exercise {
  id: number;
  title: string;
  content: string;
  image?: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

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

const SciencePage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [emoji, setEmoji] = useState<string>("");

  useEffect(() => {
    fetch("/datascience.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        return response.json();
      })
      .then((data) => {
        if (data && data.science_exercises) {
          setExercises(data.science_exercises);
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = (id: number, correctAnswer: string) => {
    const userAnswer = userAnswers[id];
    const isCorrect = userAnswer?.toString().trim() === correctAnswer.trim();

    setResults({ ...results, [id]: isCorrect });
  };

  const calculateFinalScore = () => {
    const total = exercises.length;
    const correct = Object.values(results).filter(Boolean).length;
    const score = (correct / total) * 100;

    setFinalScore(score);

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="flex flex-col items-center justify-center w-full gap-4 py-8 md:py-10">
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
          Exercices de Sciences
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
              <p className="text-gray-700">{exercise.content}</p>

              {/* Display the image for each exercise if available */}
              {exercise.image && (
                <Image
                  alt={exercise.title}
                  className="object-contain w-48 h-48 mt-2"
                  src={`/assets/science/${exercise.image}`}
                />
              )}

              {exercise.questions.map((q, questionIndex) => (
                <div key={questionIndex} className="w-full mt-2">
                  <p>{q.question}</p>
                  <input
                    className="px-2 py-2 mt-2 text-gray-800 placeholder-blue-500 bg-blue-100 border rounded"
                    placeholder="Votre réponse"
                    type="text"
                    value={userAnswers[exercise.id] || ""}
                    onChange={(e) => handleChange(e, exercise.id)}
                  />

                  <button
                    className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                    onClick={() => handleSubmit(exercise.id, q.answer)}
                  >
                    Soumettre
                  </button>
                  {results[exercise.id] !== undefined && (
                    <p
                      className={`mt-2 ${
                        results[exercise.id] ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {results[exercise.id]
                        ? "Bonne réponse !"
                        : "Mauvaise réponse, réessayez."}
                    </p>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </motion.div>

      {finalScore !== null && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold">
            Votre score final: {finalScore.toFixed(2)}% {emoji}
          </h2>
        </div>
      )}

      <div className="mt-4">
        <button
          className="px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-700"
          onClick={calculateFinalScore}
        >
          Calculer le score final
        </button>
      </div>

      <footer className="w-full mt-8 text-center">
        <p className="text-sm text-gray-500">
          © 2024 AutiStudy - Tous droits réservés. Créé par la famille Ayivor.
        </p>
      </footer>
    </section>
  );
};

export default SciencePage;

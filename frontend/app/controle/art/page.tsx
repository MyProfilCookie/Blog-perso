/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Card, CardBody, Image, Spacer } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Exercise {
  content: ReactNode;
  id: number;
  title: string;
  description?: string;
  question: string;
  image?: string;
  answer: number | string;
}

const ArtPage: React.FC = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [emoji, setEmoji] = useState<string>("");

  useEffect(() => {
    // Fetch the data from the dataart.json file
    fetch("/dataart.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        return response.json();
      })
      .then((data) => {
        if (data && data.art_exercises) {
          setExercises(data.art_exercises);
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

  const handleSubmit = (id: number, correctAnswer: string | number) => {
    const userAnswer = userAnswers[id];
    const isCorrect =
      userAnswer?.toString().trim() === correctAnswer.toString().trim();

    setResults({ ...results, [id]: isCorrect });
  };

  const calculateFinalScore = () => {
    const total = exercises.length;
    const correct = Object.values(results).filter(Boolean).length;
    const score = (correct / total) * 100;

    setFinalScore(score);

    if (score === 100) {
      setEmoji("🌟"); // Étoile pour un score parfait
    } else if (score >= 80) {
      setEmoji("😊"); // Sourire pour un bon score
    } else if (score >= 50) {
      setEmoji("😐"); // Neutre pour un score moyen
    } else {
      setEmoji("😢"); // Triste pour un mauvais score
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
        <h1 className="text-3xl font-bold text-blue-600">Exercices d'Art</h1>
      </div>

      {/* Grid of Art Exercises */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid w-full grid-cols-1 gap-4 px-4 mt-8 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="w-full py-4">
            <CardBody className="flex flex-col items-center">
              <h3 className="font-bold text-large">{exercise.title}</h3>
              <p>{exercise.content}</p>
              <p>{exercise.question}</p>
              {exercise.image && (
                <img
                  alt={exercise.title}
                  className="object-contain w-48 h-48 mt-2"
                  src={`/assets/art/${exercise.image}`}
                />
              )}
              <input
                className="px-2 py-1 mt-2 border rounded"
                placeholder="Votre réponse"
                type="text"
                value={userAnswers[exercise.id] || ""}
                onChange={(e) => handleChange(e, exercise.id)}
              />
              <button
                className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                onClick={() => handleSubmit(exercise.id, exercise.answer)}
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
            </CardBody>
          </Card>
        ))}
      </motion.div>

      {/* Score Section */}
      {finalScore !== null && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold">
            Votre score final: {finalScore.toFixed(2)}% {emoji}
          </h2>
        </div>
      )}

      {/* Calculate Score Button */}
      <div className="mt-4">
        <button
          className="px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-700"
          onClick={calculateFinalScore}
        >
          Calculer le score final
        </button>
      </div>

      {/* Links and Snippet Section */}
      <div className="flex flex-col items-start w-full gap-4 px-4 mt-8 md:flex-row md:justify-around md:items-center">
        <div className="flex gap-3">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-700"
            onClick={() => router.push("/controle")}
          >
            Retour aux Cours
          </button>
          <button
            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white"
            onClick={() => router.push("/articles")}
          >
            Articles
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full mt-8 text-center">
        <p style={{ fontSize: "1em", color: "#888" }}>
          © 2024 Cours pour Enfants Autistes
        </p>
      </footer>
    </section>
  );
};

export default ArtPage;

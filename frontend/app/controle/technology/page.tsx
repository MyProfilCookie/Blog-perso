/* eslint-disable react/jsx-sort-props */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Image, Spacer } from "@nextui-org/react";
import { motion } from "framer-motion";

import BackButton from "@/components/back";
import LoadingAnimation from "@/components/loading";

// Interface pour les exercices de technologie
interface Exercise {
  id: number;
  title: string;
  content: string;
  question: string;
  options?: string[]; // Options pour les questions à choix multiples
  image?: string;
  answer: string;
  codeSnippet?: string; // Pour afficher des exemples de code
  framework?: string; // Framework ou technologie liée à l'exercice
}

// Couleurs de fond pour les cartes d'exercices
const lessonBackgroundColors = [
  "#f0f8ff", // AliceBlue
  "#e0f7fa", // LightCyan
  "#e8f5e9", // LightGreen
  "#fff3e0", // LightOrange
  "#ede7f6", // LightPurple
  "#ffebee", // LightRed
  "#fce4ec", // LightPink
  "#f3e5f5", // LightPurple
  "#e8eaf6", // LightIndigo
  "#e1f5fe", // LightBlue
];

const TechPage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [emoji, setEmoji] = useState<string>("");
  const [showHints, setShowHints] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    // Récupérer les données depuis le fichier JSON
    fetch("/datatech.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load JSON file");
        }

        return response.json();
      })
      .then((data) => {
        setExercises(data.tech_exercises);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des données:", error);
        setLoading(false);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    id: number,
  ) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = (id: number, correctAnswer: string) => {
    const userAnswer = userAnswers[id];

    if (!userAnswer) return; // Empêcher la soumission si aucune réponse n'est donnée

    const isCorrect =
      userAnswer.toString().trim().toLowerCase() ===
      correctAnswer.toLowerCase();

    setResults({ ...results, [id]: isCorrect });
  };

  const toggleHint = (id: number) => {
    setShowHints({ ...showHints, [id]: !showHints[id] });
  };

  const calculateFinalScore = () => {
    if (!exercises) return; // Empêcher le calcul si les exercices ne sont pas chargés
    const total = exercises.length;
    const correct = Object.values(results).filter(Boolean).length;
    const score = (correct / total) * 100;

    setFinalScore(score);

    if (score === 100) {
      setEmoji("🚀"); // Fusée pour un score parfait
    } else if (score >= 80) {
      setEmoji("💻"); // Ordinateur pour un bon score
    } else if (score >= 50) {
      setEmoji("🔧"); // Outil pour un score moyen
    } else {
      setEmoji("⚠️"); // Avertissement pour un score faible
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
          src="/assets/tech_header.webp"
          width="100%"
        />
        <Spacer y={2} />
        <h1 className="text-3xl font-bold text-indigo-600">
          Exercices de Technologie Web
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
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardBody className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold text-indigo-800 text-large">
                  {exercise.title}
                </h3>
                {exercise.framework && (
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-indigo-500 rounded-full">
                    {exercise.framework}
                  </span>
                )}
              </div>
              <p className="mb-4 text-center">{exercise.content}</p>
              <p className="font-medium">{exercise.question}</p>

              {/* Afficher l'image de l'exercice si disponible */}
              {exercise.image && (
                <Image
                  alt={exercise.title}
                  className="object-contain w-48 h-48 mt-2"
                  src={`/assets/tech/${exercise.image}`}
                />
              )}

              {/* Afficher le snippet de code si disponible */}
              {exercise.codeSnippet && (
                <div className="w-full p-3 mt-2 overflow-auto text-sm font-mono bg-gray-800 text-gray-100 rounded-md max-h-40">
                  <pre>{exercise.codeSnippet}</pre>
                </div>
              )}

              {/* Pour les questions à choix multiples */}
              {exercise.options ? (
                <select
                  className="w-full px-3 py-2 mt-4 border rounded bg-cream"
                  disabled={results[exercise.id] !== undefined} // Désactiver si réponse envoyée
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
                <textarea
                  className="w-full px-3 py-2 mt-4 border rounded"
                  disabled={results[exercise.id] !== undefined} // Désactiver si réponse envoyée
                  placeholder="Votre réponse"
                  rows={3}
                  value={userAnswers[exercise.id] || ""}
                  onChange={(e) => handleChange(e, exercise.id)}
                />
              )}

              <div className="flex flex-wrap justify-center w-full mt-4 gap-2">
                <button
                  className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-700 transition"
                  disabled={results[exercise.id] !== undefined} // Désactiver bouton si réponse envoyée
                  onClick={() => handleSubmit(exercise.id, exercise.answer)}
                >
                  Soumettre
                </button>
                <button
                  className="px-4 py-2 text-indigo-700 bg-indigo-100 rounded hover:bg-indigo-200 transition"
                  onClick={() => toggleHint(exercise.id)}
                >
                  {showHints[exercise.id] ? "Masquer l'indice" : "Afficher un indice"}
                </button>
              </div>

              {showHints[exercise.id] && (
                <div className="p-2 mt-2 text-sm bg-yellow-50 border border-yellow-200 rounded">
                  <p className="font-medium text-yellow-700">Indice: Pensez à explorer la documentation de {exercise.framework || "cette technologie"}.</p>
                </div>
              )}

              {results[exercise.id] !== undefined && (
                <div className={`mt-4 p-3 rounded ${results[exercise.id] ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <p className={`font-medium ${results[exercise.id] ? "text-green-600" : "text-red-600"}`}>
                    {results[exercise.id]
                      ? "Correct ! Bonne compréhension du concept."
                      : `Incorrect. La bonne réponse est: ${exercise.answer}`}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </motion.div>

      {finalScore !== null && (
        <motion.div
          className="p-6 mt-8 text-center bg-cream rounded-lg shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-indigo-700">
            Résultat: {finalScore.toFixed(1)}% {emoji}
          </h2>
          <p className="mt-2 text-gray-600">
            {finalScore === 100 ? "Parfait ! Vous maîtrisez ces concepts technologiques." :
              finalScore >= 80 ? "Excellent travail ! Vous avez une bonne compréhension des concepts." :
                finalScore >= 50 ? "Bon effort. Continuez à pratiquer pour améliorer vos compétences." :
                  "N'abandonnez pas ! Revoyez les concepts et réessayez."}
          </p>
        </motion.div>
      )}

      <div className="mt-6 mb-8">
        <button
          className="px-6 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full hover:from-indigo-600 hover:to-purple-700 transition shadow-md"
          onClick={calculateFinalScore}
        >
          Calculer mon score
        </button>
      </div>
    </section>
  );
};

export default TechPage;
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";

interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: string;
}

const Trimestres = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [index: number]: string }>({});
  const [results, setResults] = useState<{ [index: number]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/trimestres`,
        );
        const data = await res.json();
        if (Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          console.warn("Aucune question trouvée pour le sujet trimestres.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des questions :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    setAnswers({ ...answers, [index]: e.target.value });
  };

  const handleSubmit = (index: number, correct: string) => {
    setResults({
      ...results,
      [index]: answers[index]?.toLowerCase().trim() === correct.toLowerCase(),
    });
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-violet-600">
        Questions du contrôle trimestriel
      </h1>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div
            key={q._id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
          >
            <h3 className="text-lg font-semibold mb-2">{q.question}</h3>
            <select
              className="w-full border rounded px-3 py-2 mb-2"
              disabled={results[index] !== undefined}
              value={answers[index] || ""}
              onChange={(e) => handleChange(e, index)}
            >
              <option value="">-- Choisissez une réponse --</option>
              {q.options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <Button
              className="bg-violet-500 text-white"
              disabled={results[index] !== undefined}
              size="sm"
              onClick={() => handleSubmit(index, q.answer)}
            >
              Valider
            </Button>
            {results[index] !== undefined && (
              <p
                className={`mt-2 ${
                  results[index] ? "text-green-500" : "text-red-500"
                }`}
              >
                {results[index]
                  ? "Bonne réponse !"
                  : `Mauvaise réponse. Réponse correcte : ${q.answer}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trimestres;

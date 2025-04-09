"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";

interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: string;
}

interface Subject {
  _id: string;
  name: string;
  icon: string;
  color: string;
  questions: Question[];
}

interface TrimestreData {
  _id: string;
  numero: number;
  subjects: Subject[];
}

const Trimestres = () => {
  const [trimestre, setTrimestre] = useState<TrimestreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [results, setResults] = useState<{ [questionId: string]: boolean }>({});
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trimestres/${id}`);
        const data = await res.json();
        if (data && data.subjects) {
          setTrimestre(data);
        } else {
          console.warn("Données du trimestre non trouvées.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du trimestre :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    questionId: string
  ) => {
    setAnswers({ ...answers, [questionId]: e.target.value });
  };

  const handleSubmit = (questionId: string, correct: string) => {
    const userAnswer = answers[questionId]?.toLowerCase().trim();
    const correctAnswer = correct.toLowerCase();
    setResults({ ...results, [questionId]: userAnswer === correctAnswer });
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-violet-600">
        Contrôle du trimestre {trimestre?.numero}
      </h1>

      {trimestre?.subjects.map((subject) => (
        <div key={subject._id} className="mb-10">
          <h2
            className="text-2xl font-semibold mb-4 px-3 py-2 rounded text-white"
            style={{ background: subject.color }}
          >
            {subject.icon} {subject.name}
          </h2>

          <div className="space-y-4">
            {subject.questions.map((q) => (
              <div
                key={q._id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
              >
                <h3 className="text-lg font-medium mb-2">{q.question}</h3>
                <select
                  className="w-full border rounded px-3 py-2 mb-2"
                  disabled={results[q._id] !== undefined}
                  value={answers[q._id] || ""}
                  onChange={(e) => handleChange(e, q._id)}
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
                  disabled={results[q._id] !== undefined}
                  size="sm"
                  onClick={() => handleSubmit(q._id, q.answer)}
                >
                  Valider
                </Button>
                {results[q._id] !== undefined && (
                  <p
                    className={`mt-2 ${
                      results[q._id] ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {results[q._id]
                      ? "Bonne réponse !"
                      : `Mauvaise réponse. Réponse correcte : ${q.answer}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Trimestres;

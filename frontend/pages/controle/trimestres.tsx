"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";

interface Question {
  question: string;
  options: string[];
  answer: string;
  subject: string;
}

interface TrimestreData {
  trimestre: number;
  questions: Question[];
}

const Trimestres = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("Tout");
  const [answers, setAnswers] = useState<{ [index: number]: string }>({});
  const [results, setResults] = useState<{ [index: number]: boolean }>({});

  const subjectLabels: { [key: string]: string } = {
    math: "Mathématiques",
    french: "Français",
    hist: "Histoire",
    geo: "Géographie",
    sci: "Sciences",
    lang: "Langues",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/trimestres`,
        );
        const data: TrimestreData[] = await res.json();
        const trimestre1 = data.find((t) => t.trimestre === 1);

        if (trimestre1) {
          setQuestions(trimestre1.questions);
        }
        setLoading(false);
      } catch (error) {
        console.error("Erreur chargement:", error);
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

  const filteredQuestions =
    selectedSubject === "Tout"
      ? questions
      : questions.filter((q) => q.subject === selectedSubject);

  const uniqueSubjects = Array.from(new Set(questions.map((q) => q.subject)));

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-violet-600">
        Contrôle trimestriel
      </h1>

      <div className="mb-6">
        <select
          className="w-full border border-gray-300 rounded px-4 py-2"
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="Tout">🎯 Toutes les matières</option>
          {uniqueSubjects.map((subj) => (
            <option key={subj} value={subj}>
              {subjectLabels[subj] || subj}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {filteredQuestions.map((q, index) => (
          <div
            key={index}
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
                className={`mt-2 ${results[index] ? "text-green-500" : "text-red-500"}`}
              >
                {results[index]
                  ? "Bonne réponse !"
                  : `Mauvaise réponse. Réponse : ${q.answer}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trimestres;

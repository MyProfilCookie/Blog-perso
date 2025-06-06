import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useRevision } from "@/app/RevisionContext";
import { toast } from "sonner";
import axios from "axios";

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

const TrimestrePage = () => {
  const [trimestre, setTrimestre] = useState<TrimestreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [results, setResults] = useState<{ [questionId: string]: boolean }>({});
  const router = useRouter();
  const { id } = router.query;
  const { addError } = useRevision();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/trimestres/${id}`,
        );
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
    questionId: string,
  ) => {
    setAnswers({ ...answers, [questionId]: e.target.value });
  };

  const handleSubmit = async (questionId: string, correct: string) => {
    const userAnswer = answers[questionId]?.toLowerCase().trim();
    const correctAnswer = correct.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    setResults({ ...results, [questionId]: isCorrect });

    // Sauvegarder l'erreur dans la base de données (revision-errors)
    let erreurEnregistreeServeur = false;
    if (!isCorrect) {
      try {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("userToken");
        if (user && token) {
          const userId = JSON.parse(user)._id;
          const question = trimestre?.subjects
            .flatMap(subject => subject.questions)
            .find(q => q._id === questionId);

          if (question) {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/revision-errors`,
              {
                userId,
                questionId: questionId,
                questionText: question.question,
                selectedAnswer: userAnswer || '',
                correctAnswer: correctAnswer,
                category: trimestre?.subjects.find(s => 
                  s.questions.some(q => q._id === questionId)
                )?.name || 'Trimestre'
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            erreurEnregistreeServeur = true;
          }
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'erreur de révision:", error);
        toast.error("Erreur lors de la sauvegarde de l'erreur de révision");
      }

      // Enregistrement local UNIQUEMENT si la sauvegarde serveur a échoué
      if (!erreurEnregistreeServeur) {
        const question = trimestre?.subjects
          .flatMap(subject => subject.questions)
          .find(q => q._id === questionId);

        if (question) {
          const errorData = {
            _id: questionId,
            questionId: questionId,
            questionText: question.question,
            selectedAnswer: userAnswer || '',
            correctAnswer: correctAnswer,
            category: trimestre?.subjects.find(s => 
              s.questions.some(q => q._id === questionId)
            )?.name || 'Trimestre',
            date: new Date().toISOString(),
            attempts: 1
          };
          try {
            if (typeof addError === 'function') {
              addError(errorData);
            }
          } catch (error) {
            console.error("Erreur lors de l'enregistrement dans le RevisionContext:", error);
          }
        }
      }
    }

    // Afficher un message de feedback
    if (isCorrect) {
      toast.success("Bonne réponse !");
    } else {
      toast.error(`Mauvaise réponse. Réponse correcte : ${correct}`);
    }
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
            style={{ backgroundColor: subject.color }}
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

export default TrimestrePage;

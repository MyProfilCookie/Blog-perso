import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Question {
  question: string;
  options: string[];
  answer: string;
  difficulty: string;
}

interface Subject {
  name: string;
  icon: string;
  color: string;
  questions: Question[];
}

interface TrimestreData {
  numero: number;
  subjects: Subject[];
}

export default function TrimestreDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<TrimestreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTrimestre = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trimestres/${id}`);
        setData(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des données du trimestre.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrimestre();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Trimestre {data?.numero}</h1>
      {data?.subjects.map((subject) => (
        <div key={subject.name} className="mb-6 p-4 rounded-lg" style={{ backgroundColor: subject.color }}>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
            <span>{subject.icon}</span> {subject.name}
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {subject.questions.map((q, index) => (
              <li key={index}>
                <strong>{q.question}</strong>
                <ul className="list-inside list-decimal pl-5">
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: string;
}

interface Subject {
  _id: string;
  name: string;
  icon: string;
  color: string;
  questions: Question[];
}

interface Trimestre {
  _id: string;
  numero: number;
  subjects: Subject[];
}

export default function TrimestresPage() {
  const [trimestres, setTrimestres] = useState<Trimestre[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrimestres = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/trimestres`,
        );

        setTrimestres(response.data);
        console.log(response.data);
      } catch (err: any) {
        setError("Erreur lors du chargement des trimestres");
        console.error(err);
      }
    };

    fetchTrimestres();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des trimestres</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {trimestres.map((trimestre) => (
          <Link
            key={trimestre._id}
            className="border p-4 rounded-md shadow hover:bg-gray-50 transition"
            href={`/controle/trimestres/${trimestre._id}`}
          >
            <h2 className="text-xl font-semibold mb-2">
              Trimestre {trimestre.numero}
            </h2>
            <p>{trimestre.subjects.length} matières</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

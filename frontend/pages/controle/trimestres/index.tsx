import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Card, CardBody, Progress } from "@nextui-org/react";
import { motion } from "framer-motion";

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

const subjectColors = {
  Mathématiques: { bg: "#60A5FA", icon: "🔢" },
  Français: { bg: "#F87171", icon: "📚" },
  Histoire: { bg: "#34D399", icon: "⏳" },
  Géographie: { bg: "#A78BFA", icon: "🌍" },
  Sciences: { bg: "#FBBF24", icon: "🔬" },
  Arts: { bg: "#EC4899", icon: "🎨" },
  Musique: { bg: "#8B5CF6", icon: "🎵" },
  default: { bg: "#6B7280", icon: "📖" },
};

export default function TrimestresPage() {
  const [trimestres, setTrimestres] = useState<Trimestre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrimestres = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/trimestres`,
        );

        setTrimestres(response.data);
      } catch (err: any) {
        setError("Erreur lors du chargement des trimestres");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrimestres();
  }, []);

  const getTrimestreProgress = (trimestre: Trimestre) => {
    let totalQuestions = 0;

    trimestre.subjects.forEach((subject) => {
      totalQuestions += subject.questions.length;
    });

    return totalQuestions;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="bg-danger-50">
          <CardBody>
            <p className="text-danger">{error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Contrôle des Connaissances
      </h1>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trimestres.map((trimestre) => (
            <motion.div
              key={trimestre._id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/controle/trimestres/${trimestre.numero}`}>
                <Card
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Trimestre {trimestre.numero}
                      </h2>
                      <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">
                        📚
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-gray-600">
                        <span>{trimestre.subjects.length} matières</span>
                        <span>{getTrimestreProgress(trimestre)} questions</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {trimestre.subjects.map((subject) => {
                          const subjectStyle =
                            subjectColors[
                              subject.name as keyof typeof subjectColors
                            ] || subjectColors.default;

                          return (
                            <div
                              key={subject._id}
                              className="px-3 py-1 rounded-full text-sm text-white flex items-center gap-1"
                              style={{ backgroundColor: subjectStyle.bg }}
                            >
                              <span>{subjectStyle.icon}</span>
                              <span>{subject.name}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4">
                        <Progress className="h-2" color="primary" value={100} />
                        <p className="text-sm text-gray-500 mt-2">
                          Cliquez pour commencer
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

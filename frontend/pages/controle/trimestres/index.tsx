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
  Mathématiques: { bg: "rgba(96, 165, 250, 0.8)", icon: "🔢" },
  Français: { bg: "rgba(248, 113, 113, 0.8)", icon: "📚" },
  Histoire: { bg: "rgba(52, 211, 153, 0.8)", icon: "⏳" },
  Géographie: { bg: "rgba(167, 139, 250, 0.8)", icon: "🌍" },
  Sciences: { bg: "rgba(251, 191, 36, 0.8)", icon: "🔬" },
  Arts: { bg: "rgba(236, 72, 153, 0.8)", icon: "🎨" },
  Musique: { bg: "rgba(139, 92, 246, 0.8)", icon: "🎵" },
  default: { bg: "rgba(107, 114, 128, 0.8)", icon: "📖" },
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Contrôle des Connaissances
      </h1>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trimestres.map((trimestre) => (
            <motion.div
              key={trimestre._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/controle/trimestres/${trimestre.numero}`}>
                <Card 
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-700"
                  style={{
                    background: "rgba(24, 24, 27, 0.8)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-white">
                        Trimestre {trimestre.numero}
                      </h2>
                      <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">
                        📚
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-gray-300">
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
                              className="px-3 py-1 rounded-full text-sm text-white flex items-center gap-1 backdrop-blur-sm"
                              style={{ 
                                backgroundColor: subjectStyle.bg,
                                boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                              }}
                            >
                              <span>{subjectStyle.icon}</span>
                              <span>{subject.name}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4">
                        <Progress 
                          className="h-2" 
                          color="primary" 
                          value={100}
                        />
                        <p className="text-sm text-gray-400 mt-2">
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

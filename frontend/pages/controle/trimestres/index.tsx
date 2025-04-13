/* eslint-disable no-console */
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { withPremiumGuard } from "@/components/premium-guard";

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
  Art: { bg: "rgba(236, 72, 153, 0.8)", icon: "🎨" },
  Musique: { bg: "rgba(139, 92, 246, 0.8)", icon: "🎵" },
  Langues: { bg: "rgba(2, 193, 7, 0.8)", icon: "🇫🇷" },
  Technologie: { bg: "rgba(123, 189, 189, 0.8)", icon: "💻" },
  default: { bg: "rgba(107, 114, 128, 0.8)", icon: "📖" },
};

const TrimestresPage = () => {
  const router = useRouter();
  const [trimestres, setTrimestres] = useState<Trimestre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [encouragementMessage, setEncouragementMessage] = useState("");
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    age: "",
  });

  const encouragementMessages = [
    "Continue comme ça, tu es sur la bonne voie ! 🌟",
    "Tu as le potentiel pour réussir ! 💪",
    "Chaque effort te rapproche du succès ! 🎯",
    "Tu es capable de grandes choses ! 🌈",
    "Garde ta motivation, tu fais du bon travail ! 🚀",
    "Ton travail acharné finira par payer ! ⭐",
    "N'oublie pas que chaque progrès compte ! 🌱",
    "Tu deviens plus fort(e) à chaque défi ! 💫",
    "Ta persévérance est admirable ! 🏆",
    "Continue d'apprendre et de grandir ! 📚",
  ];

  useEffect(() => {
    // Changer le message toutes les 15 minutes
    const updateMessage = () => {
      const randomIndex = Math.floor(
        Math.random() * encouragementMessages.length,
      );

      setEncouragementMessage(encouragementMessages[randomIndex]);
    };

    updateMessage(); // Message initial
    const interval = setInterval(updateMessage, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo");

    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
      setShowForm(false);
    }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setShowForm(false);
  };

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

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-600 via-indigo-600 to-blue-700 flex items-center justify-center p-4">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="backdrop-blur-lg bg-cream shadow-xl border-none">
            <CardBody className="p-8">
              <h2 className="text-2xl font-bold text-dark mb-2 text-center">
                Confirmation d&apos;identité
              </h2>
              <p className="text-gray-600 mb-6 text-center text-sm">
                Veuillez confirmer votre identité pour accéder au contrôle des
                connaissances. Un compte-rendu sera disponible à la fin de
                chaque trimestre.
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  required
                  classNames={{
                    label: "text-gray-700 font-medium",
                    input: "bg-gray-50 border-gray-200 focus:border-violet-500",
                    inputWrapper: "shadow-sm",
                  }}
                  label="Prénom"
                  placeholder="Entrez votre prénom"
                  value={userInfo.firstName}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, firstName: e.target.value })
                  }
                />
                <Input
                  required
                  classNames={{
                    label: "text-gray-700 font-medium",
                    input: "bg-gray-50 border-gray-200 focus:border-violet-500",
                    inputWrapper: "shadow-sm",
                  }}
                  label="Nom"
                  placeholder="Entrez votre nom"
                  value={userInfo.lastName}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, lastName: e.target.value })
                  }
                />
                <Input
                  required
                  classNames={{
                    label: "text-gray-700 font-medium",
                    input: "bg-gray-50 border-gray-200 focus:border-violet-500",
                    inputWrapper: "shadow-sm",
                  }}
                  label="Âge"
                  max="100"
                  min="0"
                  placeholder="Entrez votre âge"
                  type="number"
                  value={userInfo.age}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, age: e.target.value })
                  }
                />
                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md"
                  type="submit"
                >
                  Confirmer et commencer
                </Button>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">
            Bienvenue {userInfo.firstName} 👋
          </h1>
          <p className="text-xl text-dark mb-4">Contrôle des Connaissances</p>
          <div className="bg-cream dark:bg-gray-800 rounded-lg p-4 shadow-lg max-w-2xl mx-auto">
            <p className="text-gray-800 dark:text-gray-200 text-lg italic">
              {encouragementMessage}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trimestres.map((trimestre) => (
            <motion.div
              key={trimestre._id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border-none bg-cream dark:bg-gray-800"
                style={{
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              >
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-violet-500 transition-colors duration-300">
                      Trimestre {trimestre.numero}
                    </h2>
                    <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">
                      📚
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-gray-600 font-medium">
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
                            className="px-3 py-1 rounded-full text-sm text-white flex items-center gap-1.5 shadow-sm hover:shadow-md transition-shadow"
                            style={{
                              backgroundColor: subjectStyle.bg,
                              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            }}
                          >
                            <span>{subjectStyle.icon}</span>
                            <span className="font-medium">{subject.name}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4">
                      <div className="h-2 bg-cream rounded-full overflow-hidden dark:bg-gray-700">
                        <div
                          className="h-full bg-red-400 rounded-full"
                          style={{ width: "100%" }}
                        />
                      </div>
                      <button
                        className="w-full mt-4 px-6 py-3 bg-red-400 text-dark rounded-lg font-medium transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:from-rose-500 hover:to-pink-400 flex items-center justify-center gap-2 text-base"
                        onClick={() => {
                          router.push(
                            `/controle/trimestres/${trimestre.numero}`,
                          );
                        }}
                      >
                        <span>Commencer le trimestre</span>
                        <span className="text-xl">→</span>
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withPremiumGuard(TrimestresPage);

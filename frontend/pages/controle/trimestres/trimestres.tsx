import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRevision } from "@/app/RevisionContext";
import { toast } from "sonner";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
} from "lucide-react";

// Import shadcn components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const subjectColors = {
  Mathématiques: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    border: "border-yellow-500",
    icon: "🔢",
  },
  Sciences: {
    bg: "bg-green-100",
    text: "text-green-600",
    border: "border-green-500",
    icon: "🧪",
  },
  Français: {
    bg: "bg-red-100",
    text: "text-red-600",
    border: "border-red-500",
    icon: "📚",
  },
  Histoire: {
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    border: "border-indigo-500",
    icon: "🏛️",
  },
  Géographie: {
    bg: "bg-teal-100",
    text: "text-teal-600",
    border: "border-teal-500",
    icon: "🌍",
  },
  Langues: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    border: "border-pink-500",
    icon: "🗣️",
  },
  "Arts Plastiques": {
    bg: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-500",
    icon: "🎨",
  },
  default: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-500",
    icon: "📖",
  },
};

const TrimestrePage = () => {
  const [trimestre, setTrimestre] = useState<TrimestreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [results, setResults] = useState<{ [questionId: string]: boolean }>({});
  const [userInfo, setUserInfo] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
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
          // console.warn("Données du trimestre non trouvées.");
        }
      } catch (error) {
        // console.error("Erreur lors du chargement du trimestre :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
  }, []);



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
        // console.error("Erreur lors de la sauvegarde de l'erreur de révision:", error);
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
            // console.error("Erreur lors de l'enregistrement dans le RevisionContext:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Chargement du trimestre...
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Préparation de vos exercices
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!trimestre) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Trimestre non trouvé
            </h2>
            <p className="text-red-500 dark:text-red-300">
              Impossible de charger les données du trimestre.
            </p>
            <Button
              onClick={() => router.back()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative w-full px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Contrôle Trimestre {trimestre.numero}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
                Bonjour {userInfo?.firstName || "Élève"} ! 👋
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Testez vos connaissances dans toutes les matières
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        {trimestre.subjects.map((subject, subjectIndex) => {
          const subjectStyle = subjectColors[subject.name as keyof typeof subjectColors] || subjectColors.default;
          const completedQuestions = subject.questions.filter(q => results[q._id] !== undefined).length;
          const totalQuestions = subject.questions.length;
          const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

          return (
            <motion.div
              key={subject._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: subjectIndex * 0.1 }}
              className="mb-12"
            >
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 ${subjectStyle.bg} rounded-full flex items-center justify-center text-2xl`}>
                      {subjectStyle.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {subject.name}
                      </h2>
                      <div className="flex items-center gap-4">
                        <Badge className={`${subjectStyle.bg} ${subjectStyle.text} border-0`}>
                          {totalQuestions} questions
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {completedQuestions} complétées
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Progression
                      </span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-2 rounded-full ${subjectStyle.bg.replace('bg-', 'bg-').replace('/30', '')}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {subject.questions.map((question, questionIndex) => {
                      const isAnswered = results[question._id] !== undefined;
                      const isCorrect = results[question._id];

                      return (
                        <motion.div
                          key={question._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: questionIndex * 0.05 }}
                        >
                          <Card className={`border transition-all duration-300 ${
                            isAnswered 
                              ? isCorrect 
                                ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20" 
                                : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                          }`}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 mr-4">
                                  {question.question}
                                </h3>
                                {isAnswered && (
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-700">
                                    {isCorrect ? (
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">✕</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="space-y-3">
                                <select
                                  className={`w-full border rounded-lg px-4 py-3 transition-all duration-300 ${
                                    isAnswered
                                      ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                                  }`}
                                  disabled={isAnswered}
                                  value={answers[question._id] || ""}
                                  onChange={(e) => handleChange(e, question._id)}
                                >
                                  <option value="">-- Choisissez une réponse --</option>
                                  {question.options.map((option, idx) => (
                                    <option key={idx} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>

                                <div className="flex items-center gap-3">
                                  <Button
                                    className={`${
                                      isAnswered
                                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                    } text-white`}
                                    disabled={isAnswered || !answers[question._id]}
                                    onClick={() => handleSubmit(question._id, question.answer)}
                                  >
                                    {isAnswered ? "Répondu" : "Valider"}
                                  </Button>

                                  {isAnswered && (
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                      isCorrect 
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" 
                                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                                    }`}>
                                      <span className="text-sm font-medium">
                                        {isCorrect ? "Bonne réponse !" : `Réponse correcte : ${question.answer}`}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TrimestrePage;
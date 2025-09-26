/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Target,
  BookOpen,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import shadcn components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Question {
  _id: string;
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
  completed?: boolean;
}

interface TrimestreData {
  _id: string;
  numero: number;
  subjects: Subject[];
}

interface Result {
  isCorrect: boolean;
  answer: string;
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

export default function TrimestreDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<TrimestreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState<number | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [validatedQuestions, setValidatedQuestions] = useState<
    Record<string, boolean>
  >({});
  const [completedSubjects, setCompletedSubjects] = useState<
    Record<number, boolean>
  >({});
  const [showSubjectSelector, setShowSubjectSelector] = useState(true);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10800); // 3h en secondes
  const [encouragementMessage, setEncouragementMessage] = useState("");
  const [userInfo, setUserInfo] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [results, setResults] = useState<Result[]>([]);

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

  const QUESTIONS_PER_PAGE = 4;

  useEffect(() => {
    if (!id) return;

    const fetchTrimestre = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/trimestres/${id}`,
        );
        setData(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des données du trimestre.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrimestre();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          calculateScore();
          setShowResults(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Charger la progression sauvegardée
  useEffect(() => {
    const savedProgress = localStorage.getItem(`trimestre-${id}-progress`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setSelectedAnswers(progress.selectedAnswers);
      setValidatedQuestions(progress.validatedQuestions);
      setCompletedSubjects(progress.completedSubjects || {});
      setTimeLeft(progress.timeLeft);
    }
  }, [id]);

  // Sauvegarder la progression
  useEffect(() => {
    if (
      id &&
      (Object.keys(selectedAnswers).length > 0 ||
        Object.keys(completedSubjects).length > 0)
    ) {
      const progress = {
        selectedAnswers,
        validatedQuestions,
        completedSubjects,
        timeLeft,
      };
      localStorage.setItem(
        `trimestre-${id}-progress`,
        JSON.stringify(progress),
      );
    }
  }, [id, selectedAnswers, validatedQuestions, completedSubjects, timeLeft]);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
  }, []);

  useEffect(() => {
    // Changer le message toutes les 20 minutes
    const updateMessage = () => {
      const randomIndex = Math.floor(
        Math.random() * encouragementMessages.length,
      );
      setEncouragementMessage(encouragementMessages[randomIndex]);
    };

    updateMessage(); // Message initial
    const interval = setInterval(updateMessage, 20 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);



  const getEncouragement = (isCorrect: boolean, streak: number) => {
    if (isCorrect) {
      if (streak >= 5) return "🌟 Extraordinaire ! Tu es inarrêtable !";
      if (streak >= 3) return "🎯 Excellent ! Continue comme ça !";
      return "✅ Bravo ! C'est la bonne réponse !";
    } else {
      if (streak > 2) return "😮 Dommage, mais tu étais sur une belle série !";
      return "❌ Ce n'est pas la bonne réponse, mais continue d'essayer !";
    }
  };

  const getCurrentQuestions = (): Question[] => {
    if (!data || currentSubjectIndex === null) return [];
    const currentSubject = data.subjects[currentSubjectIndex];
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    return currentSubject.questions.slice(
      startIndex,
      startIndex + QUESTIONS_PER_PAGE,
    );
  };

  const getTotalPages = (): number => {
    if (!data || currentSubjectIndex === null) return 0;
    const currentSubject = data.subjects[currentSubjectIndex];
    return Math.ceil(currentSubject.questions.length / QUESTIONS_PER_PAGE);
  };

  const handleAnswerSelect = async (questionIndex: number, answer: string) => {
    if (!data || currentSubjectIndex === null) return;

    const currentQuestions = getCurrentQuestions();
    const question = currentQuestions[questionIndex];
    
    const isCorrect = answer === question.answer;
    const newResults = [...results];
    newResults[questionIndex] = { isCorrect, answer };
    setResults(newResults);

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));

    setValidatedQuestions((prev) => ({
      ...prev,
      [questionIndex]: true,
    }));

    // Sauvegarder le score
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    if (userId && token) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/scores`,
          {
            userId,
            token,
            pageId: id,
            score: isCorrect ? 1 : 0,
            timeSpent,
            correctAnswers: isCorrect ? 1 : 0,
            totalQuestions: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        // console.error("Erreur lors de la sauvegarde du score:", error);
      }
    }

    // Mettre à jour le score total
    const newScore = calculateScore();
    setScore(newScore);

    // Vérifier si toutes les questions sont répondues
    if (areAllQuestionsAnswered(currentPage)) {
      setShowResults(true);
      setShowFeedback(true);
    }
  };

  const calculateScore = () => {
    if (!data || currentSubjectIndex === null) return 0;
    const currentQuestions = getCurrentQuestions();
    const correctAnswers = results.filter((r) => r.isCorrect).length;
    const totalQuestions = currentQuestions.length;
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    return finalScore;
  };

  const getCurrentProgress = (): number => {
    if (!data || currentSubjectIndex === null) return 0;
    let totalQuestions = 0;
    let currentQuestionNumber = 0;

    data.subjects.forEach((subject, subjectIndex) => {
      subject.questions.forEach((_, questionIndex) => {
        totalQuestions++;
        if (
          subjectIndex < currentSubjectIndex ||
          (subjectIndex === currentSubjectIndex &&
            questionIndex <= currentPage * QUESTIONS_PER_PAGE)
        ) {
          currentQuestionNumber++;
        }
      });
    });

    return (currentQuestionNumber / totalQuestions) * 100;
  };

  const areAllQuestionsAnswered = (pageIndex: number): boolean => {
    if (!data || currentSubjectIndex === null) return false;
    const startIndex = pageIndex * QUESTIONS_PER_PAGE;
    const endIndex = Math.min(
      startIndex + QUESTIONS_PER_PAGE,
      data.subjects[currentSubjectIndex].questions.length,
    );

    for (let i = startIndex; i < endIndex; i++) {
      const questionId = `${currentSubjectIndex}-${i}`;
      if (!validatedQuestions[questionId]) {
        return false;
      }
    }
    return true;
  };

  const isSubjectCompleted = (subjectIndex: number): boolean => {
    if (!data) return false;
    const subject = data.subjects[subjectIndex];
    return subject.questions.every((_: Question, questionIndex: number) => {
      const questionId = `${subjectIndex}-${questionIndex}`;
      return validatedQuestions[questionId];
    });
  };

  const handleSubjectSelect = (index: number) => {
    setCurrentSubjectIndex(index);
    setShowSubjectSelector(false);
  };

  const handleSubjectComplete = () => {
    if (currentSubjectIndex === null || !data) return;

    if (isSubjectCompleted(currentSubjectIndex)) {
      setCompletedSubjects((prev: Record<number, boolean>) => ({
        ...prev,
        [currentSubjectIndex]: true,
      }));

      toast.success(
        <div className="font-medium">
          Bravo ! Vous avez terminé la matière{" "}
          {data.subjects[currentSubjectIndex].name} ! 🎉
        </div>,
        {
          position: "bottom-right",
          autoClose: 3000,
        },
      );

      setShowSubjectSelector(true);
      setCurrentSubjectIndex(null);
    }
  };

  useEffect(() => {
    if (
      currentSubjectIndex !== null &&
      isSubjectCompleted(currentSubjectIndex)
    ) {
      handleSubjectComplete();
    }
  }, [validatedQuestions]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentSubjectIndex !== null && !showResults) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentSubjectIndex, showResults]);

  if (loading)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Chargement du trimestre...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    );

  if (!data) return null;

  if (showSubjectSelector) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
          <div className="relative w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <Button
                  className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
                  onClick={() => router.back()}
                  variant="outline"
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
                  Trimestre {data.numero}
            </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
                  Bonjour {userInfo?.firstName || "Élève"} ! 👋
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choisissez une matière pour commencer vos exercices
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Matières */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
            {data.subjects.map((subject: Subject, index: number) => {
              const isCompleted = completedSubjects[index];
              const subjectStyle =
                subjectColors[subject.name as keyof typeof subjectColors] ||
                subjectColors.default;

              return (
                  <motion.div
                  key={index}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 ${
                        isCompleted ? "opacity-75" : "cursor-pointer"
                      }`}
                  onClick={() => !isCompleted && handleSubjectSelect(index)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={`w-16 h-16 ${subjectStyle.bg} rounded-full flex items-center justify-center text-2xl`}
                          >
                            {subjectStyle.icon}
                    </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {subject.name}
                      </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subject.questions.length} questions
                      </p>
                    </div>
                        </div>
                        
                    {isCompleted ? (
                          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Terminé</span>
                      </div>
                    ) : (
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                            Commencer
                          </Button>
                    )}
                      </CardContent>
                    </Card>
                  </motion.div>
              );
            })}
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  if (currentSubjectIndex === null) return null;

  const currentSubject = data.subjects[currentSubjectIndex];
  const currentQuestions = getCurrentQuestions();
  const subjectStyle =
    subjectColors[currentSubject.name as keyof typeof subjectColors] ||
    subjectColors.default;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6">
          <div className="flex justify-between items-center mb-4">
            <Button
              className="bg-white/20 hover:bg-white/30 border-white/30 text-gray-700 dark:text-gray-300"
              onClick={() => setShowSubjectSelector(true)}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux matières
            </Button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className={`w-12 h-12 ${subjectStyle.bg} rounded-full flex items-center justify-center text-xl`}
              >
                {subjectStyle.icon}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {currentSubject.name}
                </h1>
            </div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-4"
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-700 dark:text-gray-300 text-lg font-medium italic">
                {encouragementMessage}
              </p>
            </motion.div>

            {/* Timer et progression */}
            <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Math.floor(timeLeft / 3600)}h{" "}
                  {Math.floor((timeLeft % 3600) / 60)}m restantes
              </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {currentPage + 1}/{getTotalPages()}
                </span>
              </div>
              </div>
            </div>
          </div>
        </div>

      {/* Questions */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentQuestions.map((question: Question, index: number) => {
            const questionId = `${currentSubjectIndex}-${currentPage * QUESTIONS_PER_PAGE + index}`;

            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                key={questionId}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 mr-4">
                      {question.question}
                      </h3>
                    {validatedQuestions[questionId] && (
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                  </div>
                    
                    <div className="space-y-3">
                      {question.options.map((option: string, optIndex: number) => {
                        const isSelected =
                          selectedAnswers[questionId] === option;
                        const isValidated = validatedQuestions[questionId];

                        return (
                          <button
                            className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                              isSelected
                                ? `${subjectStyle.bg} ${subjectStyle.border} border-2 transform scale-[1.02]`
                                : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                            } ${
                              isValidated
                                ? "cursor-not-allowed opacity-75"
                                : "hover:shadow-md"
                            }`}
                            disabled={isValidated}
                            key={optIndex}
                            onClick={() => handleAnswerSelect(index, option)}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-sm font-medium ${
                                  isSelected
                                    ? subjectStyle.text
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              <span
                                className={`text-sm ${
                                  isSelected
                                    ? "text-gray-900 dark:text-white font-medium"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {option}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-8">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <Button
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  variant="outline"
                >
                  ← Précédent
                </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: getTotalPages() }, (_, i) => (
              <button
                key={i}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentPage === i
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                } ${
                  !areAllQuestionsAnswered(i)
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                disabled={!areAllQuestionsAnswered(i)}
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

                <Button
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  disabled={
                    !areAllQuestionsAnswered(currentPage) ||
                    currentPage === getTotalPages() - 1
                  }
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  variant="outline"
                >
                  Suivant →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
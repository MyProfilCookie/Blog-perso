/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import BackButton from "@/components/back";

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
    bg: "bg-yellow-500",
    text: "text-yellow-600",
    border: "border-yellow-500",
  },
  Sciences: {
    bg: "bg-green-500",
    text: "text-green-600",
    border: "border-green-500",
  },
  Français: {
    bg: "bg-red-500",
    text: "text-red-600",
    border: "border-red-500",
  },
  Histoire: {
    bg: "bg-indigo-500",
    text: "text-indigo-600",
    border: "border-indigo-500",
  },
  Géographie: {
    bg: "bg-teal-500",
    text: "text-teal-600",
    border: "border-teal-500",
  },
  Langues: {
    bg: "bg-pink-500",
    text: "text-pink-600",
    border: "border-pink-500",
  },
  "Arts Plastiques": {
    bg: "bg-purple-500",
    text: "text-purple-600",
    border: "border-purple-500",
  },
  default: {
    bg: "bg-gray-500",
    text: "text-gray-600",
    border: "border-gray-500",
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
          }
        );
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du score:", error);
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
    const correctAnswers = results.filter(r => r.isCorrect).length;
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
        setTimeSpent(prev => prev + 1);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex justify-center items-center">
        <Card className="bg-danger-50">
          <CardBody>
            <p className="text-danger">{error}</p>
          </CardBody>
        </Card>
      </div>
    );

  if (!data) return null;

  if (showSubjectSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Choisissez une matière
            </h1>
            <p className="text-gray-600">
              Sélectionnez la matière par laquelle vous souhaitez commencer
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.subjects.map((subject: Subject, index: number) => {
              const isCompleted = completedSubjects[index];
              const subjectStyle =
                subjectColors[subject.name as keyof typeof subjectColors] ||
                subjectColors.default;

              return (
                <motion.button
                  key={index}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                    isCompleted
                      ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                      : "bg-white hover:shadow-lg border-yellow-200 hover:border-yellow-300 cursor-pointer"
                  }`}
                  disabled={isCompleted}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => !isCompleted && handleSubjectSelect(index)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 ${subjectStyle.bg} bg-opacity-20 rounded-full flex items-center justify-center text-2xl`}
                    >
                      {subject.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {subject.questions.length} questions
                      </p>
                    </div>
                    {isCompleted ? (
                      <div className="flex items-center text-green-500">
                        <span className="mr-2">Terminé</span>
                        <span>✓</span>
                      </div>
                    ) : (
                      <span className="text-yellow-500">→</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (currentSubjectIndex === null) return null;

  const currentSubject = data.subjects[currentSubjectIndex];
  const currentQuestions = getCurrentQuestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <BackButton />
            <span className="text-[13px] sm:text-[15px] text-yellow-600">
              Retour
            </span>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                  {userInfo?.firstName
                    ? `Courage ${userInfo.firstName} !`
                    : "Courage !"}
                </h1>
                <h2 className="text-2xl sm:text-3xl text-black font-bold dark:text-white text-center">
                  Bonjour {userInfo?.firstName}, es-tu prêt(e) pour le trimestre
                  {data?.numero} ?
                </h2>
                <span className="text-2xl sm:text-3xl animate-bounce">💪</span>
              </motion.div>
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="text-xl sm:text-2xl font-bold text-yellow-800"
                initial={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                Trimestre {data?.numero}
              </motion.div>
            </div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream backdrop-blur-sm rounded-xl p-4 shadow-lg border border-yellow-500"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-gray-700 text-xl font-medium text-center italic">
                {encouragementMessage}
              </p>
            </motion.div>

            <div className="flex items-center gap-2 bg-yellow-400/10 px-3 py-1 rounded-full">
              <motion.span
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                className="text-xl sm:text-2xl"
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentSubject.icon}
              </motion.span>
              <span className="text-lg sm:text-xl font-semibold text-yellow-700">
                {currentSubject.name}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="bg-yellow-100 h-2 w-full rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(timeLeft / 10800) * 100}%` }}
                className="bg-yellow-400 h-full rounded-full"
                initial={{ width: 0 }}
                transition={{ duration: 1 }}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="text-[12px] sm:text-[13px] text-yellow-700 font-medium">
                {Math.floor(timeLeft / 3600)}h{" "}
                {Math.floor((timeLeft % 3600) / 60)}m
              </div>
              <div className="text-[12px] sm:text-[13px] text-yellow-700 font-medium">
                Page {currentPage + 1}/{getTotalPages()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {currentQuestions.map((question: Question, index: number) => {
            const questionId = `${currentSubjectIndex}-${currentPage * QUESTIONS_PER_PAGE + index}`;
            const subjectStyle =
              subjectColors[
                currentSubject.name as keyof typeof subjectColors
              ] || subjectColors.default;

            return (
              <motion.div
                key={questionId}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${subjectStyle.border} transform hover:-translate-y-1 hover:scale-[1.02] group`}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-3">
                    <p
                      className={`text-[14px] sm:text-[15px] font-medium text-gray-900 ${subjectStyle.bg} bg-opacity-20 rounded-lg p-3 border border-opacity-10 ${subjectStyle.border} group-hover:bg-opacity-30 transition-all duration-300 flex-1 mr-2`}
                    >
                      {question.question}
                    </p>
                    {validatedQuestions[questionId] && (
                      <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {question.options.map(
                      (option: string, optIndex: number) => {
                        const isSelected =
                          selectedAnswers[questionId] === option;
                        const isValidated = validatedQuestions[questionId];

                        return (
                          <button
                            key={optIndex}
                            className={`w-full text-left py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border transition-all duration-300 ${
                              isSelected
                                ? `${subjectStyle.bg} bg-opacity-20 ${subjectStyle.border} transform scale-[1.02]`
                                : "bg-white/100 hover:bg-yellow-50 border-gray-100 hover:border-yellow-200 hover:scale-[1.01]"
                            } ${
                              isValidated
                                ? "bg-gray-100 cursor-not-allowed"
                                : "hover:shadow-md"
                            }`}
                            disabled={isValidated}
                            onClick={() => handleAnswerSelect(index, option)}
                          >
                            <div className="flex items-center gap-2.5 sm:gap-3">
                              <span
                                className={`text-[13px] sm:text-[15px] ${
                                  isSelected
                                    ? subjectStyle.text
                                    : "text-yellow-600"
                                } font-medium`}
                              >
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              <span
                                className={`text-[13px] sm:text-[15px] ${
                                  isSelected ? "text-gray-900" : "text-gray-700"
                                }`}
                              >
                                {option}
                              </span>
                            </div>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center bg-cream backdrop-blur-sm rounded-xl p-4 shadow-lg border border-yellow-500">
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              currentPage === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ← Précédent
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: getTotalPages() }, (_, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentPage === i
                    ? "bg-yellow-500 text-white"
                    : "bg-white text-gray-600 hover:bg-yellow-100"
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

          <button
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              !areAllQuestionsAnswered(currentPage) ||
              currentPage === getTotalPages() - 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
            disabled={
              !areAllQuestionsAnswered(currentPage) ||
              currentPage === getTotalPages() - 1
            }
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}

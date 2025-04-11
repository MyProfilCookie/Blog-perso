/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody } from "@nextui-org/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import BackButton from "@/components/back";

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
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [validatedQuestions, setValidatedQuestions] = useState<{
    [key: string]: boolean;
  }>({});
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
      setCurrentSubjectIndex(progress.currentSubjectIndex);
      setCurrentPage(progress.currentPage);
      setScore(progress.score);
      setTimeLeft(progress.timeLeft);
    }
  }, [id]);

  // Sauvegarder la progression
  useEffect(() => {
    if (id && Object.keys(selectedAnswers).length > 0) {
      const progress = {
        selectedAnswers,
        validatedQuestions,
        currentSubjectIndex,
        currentPage,
        score,
        timeLeft,
      };

      localStorage.setItem(
        `trimestre-${id}-progress`,
        JSON.stringify(progress),
      );
    }
  }, [
    id,
    selectedAnswers,
    validatedQuestions,
    currentSubjectIndex,
    currentPage,
    score,
    timeLeft,
  ]);

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

  const getCurrentQuestions = () => {
    if (!data) return [];
    const currentSubject = data.subjects[currentSubjectIndex];
    const startIndex = currentPage * QUESTIONS_PER_PAGE;

    return currentSubject.questions.slice(
      startIndex,
      startIndex + QUESTIONS_PER_PAGE,
    );
  };

  const getTotalPages = () => {
    if (!data) return 0;
    const currentSubject = data.subjects[currentSubjectIndex];

    return Math.ceil(currentSubject.questions.length / QUESTIONS_PER_PAGE);
  };

  const handleAnswerSelect = async (questionIndex: number, answer: string) => {
    if (!data) return;

    const currentSubject = data.subjects[currentSubjectIndex];
    const absoluteQuestionIndex =
      currentPage * QUESTIONS_PER_PAGE + questionIndex;
    const questionId = `${currentSubjectIndex}-${absoluteQuestionIndex}`;

    // Vérifier si la question a déjà été validée
    if (validatedQuestions[questionId]) {
      toast.info("Cette question a déjà été validée !");

      return;
    }

    const currentQuestion = currentSubject.questions[absoluteQuestionIndex];
    const subjectStyle =
      subjectColors[currentSubject.name as keyof typeof subjectColors] ||
      subjectColors.default;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    const correct = answer === currentQuestion.answer;

    // Marquer la question comme validée
    setValidatedQuestions((prev) => ({
      ...prev,
      [questionId]: true,
    }));

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setStreak((prev) => prev + 1);
      toast.success(
        <div className={`${subjectStyle.text} font-medium`}>
          {getEncouragement(true, streak)}
        </div>,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: `${subjectStyle.bg} bg-opacity-10 border ${subjectStyle.border} border-opacity-20`,
        },
      );
    } else {
      setStreak(0);
      toast.error(
        <div className="text-red-600 font-medium">
          <p>{getEncouragement(false, 0)}</p>
          <p className="text-sm mt-1 opacity-90">
            La bonne réponse était :{" "}
            <span className="font-medium">{currentQuestion.answer}</span>
          </p>
        </div>,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "bg-red-50 border border-red-200",
        },
      );
    }

    // Vérifier si toutes les questions de la page sont validées
    const currentPageQuestions = getCurrentQuestions();
    const allAnswered = currentPageQuestions.every((_, idx) => {
      const qId = `${currentSubjectIndex}-${currentPage * QUESTIONS_PER_PAGE + idx}`;

      return validatedQuestions[qId];
    });

    if (allAnswered) {
      // Passer à la page suivante ou au sujet suivant
      const totalPages = getTotalPages();

      if (currentPage < totalPages - 1) {
        setTimeout(() => setCurrentPage((prev) => prev + 1), 1500);
      } else if (currentSubjectIndex < data.subjects.length - 1) {
        setTimeout(() => {
          setCurrentSubjectIndex((prev) => prev + 1);
          setCurrentPage(0);
        }, 1500);
      } else {
        setTimeout(() => {
          calculateScore();
          setShowResults(true);
        }, 1500);
      }
    }
  };

  const calculateScore = () => {
    if (!data) return;

    let correctAnswers = 0;
    let totalQuestions = 0;

    data.subjects.forEach((subject, subjectIndex) => {
      subject.questions.forEach((question, questionIndex) => {
        const questionId = `${subjectIndex}-${questionIndex}`;

        if (selectedAnswers[questionId] === question.answer) {
          correctAnswers++;
        }
        totalQuestions++;
      });
    });

    const finalScore = (correctAnswers / totalQuestions) * 100;

    setScore(finalScore);

    // Afficher un message final selon le score
    let message = "";
    let icon = "success";

    if (finalScore >= 80) {
      message = "🌟 Félicitations ! Tu as excellé dans ce trimestre !";
    } else if (finalScore >= 60) {
      message = "👏 Bien joué ! Continue tes efforts !";
      icon = "success";
    } else if (finalScore >= 40) {
      message = "💪 Tu peux faire mieux ! Continue de pratiquer !";
      icon = "warning";
    } else {
      message = "📚 Il faut revoir ces notions. Ne te décourage pas !";
      icon = "error";
    }

    Swal.fire({
      title: message,
      icon: icon as any,
      confirmButtonText: "Voir mes résultats",
    });
  };

  const getCurrentProgress = () => {
    if (!data) return 0;

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

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-cream rounded-xl p-6 max-w-lg w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Résultats du Trimestre {data.numero}
          </h2>
          <div className="mb-6">
            <div className="bg-gray-200 h-2 w-full rounded-full mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  score >= 70
                    ? "bg-green-400"
                    : score >= 50
                      ? "bg-yellow-400"
                      : "bg-red-400"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-base sm:text-lg font-semibold">
              Score final : {score.toFixed(1)}%
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => {
                // Générer et télécharger le compte-rendu
                const userInfo = JSON.parse(
                  localStorage.getItem("userInfo") || "{}",
                );
                const report = {
                  nom: userInfo.lastName,
                  prenom: userInfo.firstName,
                  age: userInfo.age,
                  trimestre: data.numero,
                  score: score.toFixed(1),
                  date: new Date().toLocaleDateString(),
                  matieres: data.subjects.map((subject) => ({
                    nom: subject.name,
                    questions: subject.questions.length,
                  })),
                };

                const blob = new Blob([JSON.stringify(report, null, 2)], {
                  type: "application/json",
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");

                a.href = url;
                a.download = `compte-rendu-trimestre-${data.numero}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }}
            >
              Télécharger le compte-rendu
            </button>
            <button
              className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => {
                setShowResults(false);
                setCurrentSubjectIndex(0);
                setCurrentPage(0);
                setSelectedAnswers({});
                setStreak(0);
              }}
            >
              Recommencer
            </button>
            <button
              className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => router.push("/controle/trimestres")}
            >
              Retour aux trimestres
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <h2 className="text-2xl sm:text-3xl text-yellow-800 font-bold dark:text-yellow-600">
                  {userInfo?.lastName}
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
              className="bg-cream backdrop-blur-sm rounded-xl p-4 shadow-lg border border-yellow-200"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-gray-700 text-lg font-medium text-center italic">
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
          {currentQuestions.map((question, index) => {
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
                  <p
                    className={`text-[14px] sm:text-[15px] font-medium text-gray-900 mb-3 sm:mb-4 ${subjectStyle.bg} bg-opacity-20 rounded-lg p-3 border border-opacity-10 ${subjectStyle.border} group-hover:bg-opacity-30 transition-all duration-300`}
                  >
                    {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => {
                      const isSelected = selectedAnswers[questionId] === option;
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
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

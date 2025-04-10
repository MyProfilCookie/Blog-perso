import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Button, Progress } from "@nextui-org/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

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
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);

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
    const currentQuestion = currentSubject.questions[absoluteQuestionIndex];
    const questionId = `${currentSubjectIndex}-${absoluteQuestionIndex}`;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    const correct = answer === currentQuestion.answer;

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setStreak((prev) => prev + 1);
      await Swal.fire({
        title: getEncouragement(true, streak),
        icon: "success",
        timer: 1500,
        position: 'bottom-end',
        showConfirmButton: false,
        background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
        color: "#fff",
        width: 300,
        toast: true,
        customClass: {
          popup: "rounded-xl border border-white/20",
          title: "text-base font-medium",
        },
        showClass: {
          popup: "animate__animated animate__fadeInRight",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutRight",
        }
      });
    } else {
      setStreak(0);
      await Swal.fire({
        title: getEncouragement(false, 0),
        html: `<p class="text-sm">${getEncouragement(false, 0)}</p><p class="text-xs mt-1 opacity-90">La bonne réponse était : <span class="font-medium">${currentQuestion.answer}</span></p>`,
        icon: "error",
        timer: 2000,
        position: 'bottom-end',
        showConfirmButton: false,
        background: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
        color: "#fff",
        width: 300,
        toast: true,
        customClass: {
          popup: "rounded-xl border border-white/20",
          title: "text-base font-medium",
        },
        showClass: {
          popup: "animate__animated animate__fadeInRight",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutRight",
        }
      });
    }

    // Vérifier si toutes les questions de la page sont répondues
    const currentPageQuestions = getCurrentQuestions();
    const allAnswered = currentPageQuestions.every((_, idx) => {
      const qId = `${currentSubjectIndex}-${currentPage * QUESTIONS_PER_PAGE + idx}`;

      return selectedAnswers[qId] || questionId === qId;
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
      <div className="p-6 max-w-4xl mx-auto">
        <BackButton />
        <Card className="mt-4">
          <CardBody>
            <h2 className="text-2xl font-bold mb-4">
              Résultats du Trimestre {data.numero}
            </h2>
            <div className="mb-6">
              <Progress
                className="w-full h-4"
                color={
                  score >= 70 ? "success" : score >= 50 ? "warning" : "danger"
                }
                value={score}
              />
              <p className="mt-2 text-lg font-semibold">
                Score final : {score.toFixed(1)}%
              </p>
              <p className="mt-2 text-gray-600">
                {score >= 80
                  ? "🌟 Excellent travail !"
                  : score >= 60
                    ? "👏 Bon travail !"
                    : score >= 40
                      ? "💪 Continue tes efforts !"
                      : "📚 N'hésite pas à revoir les leçons"}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                color="primary"
                onClick={() => {
                  setShowResults(false);
                  setCurrentSubjectIndex(0);
                  setCurrentPage(0);
                  setSelectedAnswers({});
                  setStreak(0);
                }}
              >
                Recommencer
              </Button>
              <Button
                color="secondary"
                onClick={() => router.push("/controle/trimestres")}
              >
                Retour aux trimestres
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const currentSubject = data.subjects[currentSubjectIndex];
  const currentQuestions = getCurrentQuestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white mb-2">
              Trimestre {data.numero}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-4xl">{currentSubject.icon}</span>
              <h2 className="text-xl font-bold text-white">
                {currentSubject.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 bg-white/5 p-3 rounded-xl backdrop-blur-sm">
            <Progress
              className="flex-1 h-3"
              color="success"
              value={getCurrentProgress()}
            />
            <span className="text-sm font-medium text-white">
              Page {currentPage + 1}/{getTotalPages()}
            </span>
          </div>

          {streak >= 3 && (
            <div className="mt-3 text-emerald-400 flex items-center gap-2 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <span className="animate-bounce">🔥</span>
              <span className="font-medium">
                Série de {streak} bonnes réponses !
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentQuestions.map((question, index) => {
            const questionId = `${currentSubjectIndex}-${currentPage * QUESTIONS_PER_PAGE + index}`;

            return (
              <motion.div
                key={questionId}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className="shadow-2xl border border-white/10"
                  style={{
                    background: "rgba(30, 41, 59, 0.9)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <CardBody className="p-6">
                    <p className="text-lg font-medium text-white mb-4 bg-white/5 p-3 rounded-lg">
                      {question.question}
                    </p>
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => (
                        <Button
                          key={optIndex}
                          className={`w-full text-left justify-start h-auto py-3 px-4 text-base transition-all duration-300 hover:scale-102 hover:bg-white/10 ${
                            selectedAnswers[questionId] === option
                              ? "bg-blue-500/20 border-blue-500"
                              : "bg-white/5 hover:border-white/40"
                          }`}
                          color={
                            selectedAnswers[questionId] === option
                              ? "primary"
                              : "default"
                          }
                          disabled={showFeedback}
                          variant={
                            selectedAnswers[questionId] === option
                              ? "solid"
                              : "bordered"
                          }
                          onClick={() => handleAnswerSelect(index, option)}
                        >
                          <span className="mr-3 text-blue-300">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span className="text-white">{option}</span>
                        </Button>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Button, Progress } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);

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

  const handleAnswerSelect = async (answer: string) => {
    if (!data) return;

    const currentSubject = data.subjects[currentSubjectIndex];
    const currentQuestion = currentSubject.questions[currentQuestionIndex];
    const questionId = `${currentSubjectIndex}-${currentQuestionIndex}`;

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
        showConfirmButton: false,
        background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
        color: "#fff",
        customClass: {
          popup: "rounded-xl border-4 border-white/20",
          title: "text-2xl font-bold",
        },
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    } else {
      setStreak(0);
      await Swal.fire({
        title: getEncouragement(false, 0),
        html: `<p class="text-lg mb-2">${getEncouragement(false, 0)}</p><p class="text-sm font-medium">La bonne réponse était : <span class="font-bold">${currentQuestion.answer}</span></p>`,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
        color: "#fff",
        customClass: {
          popup: "rounded-xl border-4 border-white/20",
          title: "text-2xl font-bold",
        },
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    }

    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (!data) return;

    const currentSubject = data.subjects[currentSubjectIndex];

    setShowFeedback(false);

    if (currentQuestionIndex < currentSubject.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSubjectIndex < data.subjects.length - 1) {
      setCurrentSubjectIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      calculateScore();
      setShowResults(true);
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
            questionIndex <= currentQuestionIndex)
        ) {
          currentQuestionNumber++;
        }
      });
    });

    return (currentQuestionNumber / totalQuestions) * 100;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
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
                  setCurrentQuestionIndex(0);
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
  const currentQuestion = currentSubject.questions[currentQuestionIndex];
  const questionId = `${currentSubjectIndex}-${currentQuestionIndex}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Trimestre {data.numero}
          </h1>
          <div className="flex items-center gap-2 mt-4 bg-white/5 p-3 rounded-xl backdrop-blur-sm">
            <Progress
              className="flex-1 h-3"
              color="success"
              value={getCurrentProgress()}
            />
            <span className="text-sm font-medium text-white">
              {Math.round(getCurrentProgress())}%
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

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSubjectIndex}-${currentQuestionIndex}`}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card
              className="shadow-2xl border border-white/10"
              style={{
                background: "rgba(30, 41, 59, 0.9)",
                backdropFilter: "blur(16px)",
              }}
            >
              <CardBody className="p-8">
                <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-xl">
                  <span className="text-4xl">{currentSubject.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {currentSubject.name}
                    </h2>
                    <p className="text-sm text-blue-200">
                      Question {currentQuestionIndex + 1}/
                      {currentSubject.questions.length}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-xl mb-6 font-medium text-white bg-white/5 p-4 rounded-xl">
                    {currentQuestion.question}
                  </p>
                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        className={`w-full text-left justify-start h-auto py-4 px-6 text-lg transition-all duration-300 hover:scale-102 hover:bg-white/10 ${
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
                        onClick={() => handleAnswerSelect(option)}
                      >
                        <span className="mr-3 text-blue-300">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="text-white">{option}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

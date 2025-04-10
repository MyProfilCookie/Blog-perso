import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchTrimestre = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trimestres/${id}`);
        setData(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des données du trimestre.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrimestre();
  }, [id]);

  const handleAnswerSelect = (answer: string) => {
    if (!data) return;
    
    const currentSubject = data.subjects[currentSubjectIndex];
    const currentQuestion = currentSubject.questions[currentQuestionIndex];
    const questionId = `${currentSubjectIndex}-${currentQuestionIndex}`;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (!data) return;

    const currentSubject = data.subjects[currentSubjectIndex];
    
    if (currentQuestionIndex < currentSubject.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentSubjectIndex < data.subjects.length - 1) {
      setCurrentSubjectIndex(prev => prev + 1);
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

    setScore((correctAnswers / totalQuestions) * 100);
  };

  const getCurrentProgress = () => {
    if (!data) return 0;
    
    let totalQuestions = 0;
    let currentQuestionNumber = 0;

    data.subjects.forEach((subject, subjectIndex) => {
      subject.questions.forEach((_, questionIndex) => {
        totalQuestions++;
        if (subjectIndex < currentSubjectIndex || 
            (subjectIndex === currentSubjectIndex && questionIndex <= currentQuestionIndex)) {
          currentQuestionNumber++;
        }
      });
    });

    return (currentQuestionNumber / totalQuestions) * 100;
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!data) return null;

  if (showResults) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <BackButton />
        <Card className="mt-4">
          <CardBody>
            <h2 className="text-2xl font-bold mb-4">Résultats</h2>
            <div className="mb-4">
              <Progress
                value={score}
                color={score >= 70 ? "success" : score >= 50 ? "warning" : "danger"}
                className="w-full"
              />
              <p className="mt-2 text-lg">Score final : {score.toFixed(1)}%</p>
            </div>
            <Button
              color="primary"
              onClick={() => {
                setShowResults(false);
                setCurrentSubjectIndex(0);
                setCurrentQuestionIndex(0);
                setSelectedAnswers({});
              }}
            >
              Recommencer
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const currentSubject = data.subjects[currentSubjectIndex];
  const currentQuestion = currentSubject.questions[currentQuestionIndex];
  const questionId = `${currentSubjectIndex}-${currentQuestionIndex}`;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Trimestre {data.numero}</h1>
        <Progress value={getCurrentProgress()} className="mt-4" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{currentSubject.icon}</span>
              <h2 className="text-xl font-semibold">{currentSubject.name}</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-lg mb-4">{currentQuestion.question}</p>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    className="w-full text-left justify-start"
                    color={selectedAnswers[questionId] === option ? "primary" : "default"}
                    variant={selectedAnswers[questionId] === option ? "solid" : "bordered"}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                color="primary"
                isDisabled={!selectedAnswers[questionId]}
                onClick={handleNextQuestion}
              >
                {currentSubjectIndex === data.subjects.length - 1 && 
                 currentQuestionIndex === currentSubject.questions.length - 1 
                  ? "Terminer"
                  : "Question suivante"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

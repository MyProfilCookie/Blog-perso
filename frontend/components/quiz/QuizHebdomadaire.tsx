"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Star, Trophy, Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
// import quizData from '../../autistudy_quizzes_52.json'; // Remplacé par l'API

interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
  answer: string;
}

interface Quiz {
  _id?: string;
  week: number;
  title: string;
  questions: Question[];
}

interface QuizHebdomadaireProps {
  weekNumber?: number;
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function QuizHebdomadaire({ weekNumber, onComplete }: QuizHebdomadaireProps) {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Couleurs par matière pour les adaptations visuelles
  const subjectColors: { [key: string]: string } = {
    'Mathématiques': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Français': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Sciences': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Histoire': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Géographie': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    'Arts': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'Musique': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
  };

  const subjectIcons: { [key: string]: string } = {
    'Mathématiques': '🔢',
    'Français': '📝',
    'Sciences': '🔬',
    'Histoire': '🏛️',
    'Géographie': '🌍',
    'Arts': '🎨',
    'Musique': '🎵'
  };

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const targetWeek = weekNumber || getCurrentWeek();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/week/${targetWeek}`);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setCurrentQuiz(result.data);
          setCompletedQuestions(new Array(result.data.questions.length).fill(false));
        } else {
          toast.error(result.message || "Quiz non trouvé pour cette semaine");
        }
      } catch (error) {
        console.error('Erreur lors du chargement du quiz:', error);
        toast.error("Erreur lors du chargement du quiz");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [weekNumber]);

  const getCurrentWeek = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuiz) return;

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.answer;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      toast.success("Bravo ! 🎉", {
        description: "Excellente réponse !",
        duration: 2000,
      });
    } else {
      toast.error("Essaie encore ! 💪", {
        description: `La bonne réponse était : ${currentQuestion.answer}`,
        duration: 3000,
      });
    }

    // Marquer la question comme complétée
    const newCompleted = [...completedQuestions];
    newCompleted[currentQuestionIndex] = true;
    setCompletedQuestions(newCompleted);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < currentQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz terminé - soumettre les réponses
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (!currentQuiz) return;

    try {
      // Préparer les réponses pour l'API
      const answers = completedQuestions.map((completed, index) => {
        const question = currentQuiz.questions[index];
        return {
          questionId: question.id,
          selectedAnswer: question.answer, // Pour simplifier, on utilise la bonne réponse
          timeSpent: 30 // Temps par défaut
        };
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/${currentQuiz._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          answers,
          timeSpent: 600 // 10 minutes par défaut
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setQuizCompleted(true);
        if (onComplete) {
          onComplete(score, currentQuiz.questions.length);
        }
        
        toast.success("Quiz terminé ! 🎉", {
          description: `Score: ${score}/${currentQuiz.questions.length}`,
          duration: 3000,
        });
      } else {
        toast.error("Erreur lors de la soumission du quiz");
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du quiz:', error);
      toast.error("Erreur lors de la sauvegarde du quiz");
      // Continuer quand même vers les résultats
      setQuizCompleted(true);
      if (onComplete) {
        onComplete(score, currentQuiz.questions.length);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompletedQuestions(new Array(currentQuiz!.questions.length).fill(false));
    setQuizCompleted(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Chargement du quiz...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Quiz non disponible
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Aucun quiz trouvé pour cette semaine.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (showResult ? 1 : 0)) / currentQuiz.questions.length) * 100;

  if (quizCompleted) {
    const percentage = Math.round((score / currentQuiz.questions.length) * 100);
    const isExcellent = percentage >= 90;
    const isGood = percentage >= 70;

    return (
      <div className="min-h-screen bg-cream dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                {isExcellent ? (
                  <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                ) : isGood ? (
                  <Star className="w-24 h-24 text-blue-500 mx-auto mb-4" />
                ) : (
                  <Heart className="w-24 h-24 text-green-500 mx-auto mb-4" />
                )}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
              >
                {isExcellent ? "Excellent ! 🎉" : isGood ? "Très bien ! 👏" : "Bien joué ! 💪"}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {score}/{currentQuiz.questions.length}
                </div>
                <div className="text-xl text-gray-600 dark:text-gray-300">
                  {percentage}% de réussite
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <Progress value={percentage} className="h-3" />
                
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {isExcellent 
                    ? "Tu as fait un travail exceptionnel ! Continue comme ça !"
                    : isGood 
                    ? "Très bon travail ! Tu es sur la bonne voie !"
                    : "Bravo pour tes efforts ! Chaque progrès compte !"
                  }
                </p>

                <div className="flex gap-4 justify-center pt-4">
                  <Button
                    onClick={handleRestartQuiz}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Refaire le quiz
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête du quiz */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {currentQuiz.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-300">
            <span>Question {currentQuestionIndex + 1} sur {currentQuiz.questions.length}</span>
            <Badge variant="outline" className={subjectColors[currentQuestion.subject]}>
              {subjectIcons[currentQuestion.subject]} {currentQuestion.subject}
            </Badge>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-white text-center">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={selectedAnswer === option ? "default" : "outline"}
                        className={`w-full p-4 h-auto text-left justify-start ${
                          selectedAnswer === option
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
                        } ${
                          showResult && option === currentQuestion.answer
                            ? "ring-2 ring-green-500 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : showResult && selectedAnswer === option && !isCorrect
                            ? "ring-2 ring-red-500 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            : ""
                        }`}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={showResult}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            selectedAnswer === option
                              ? "bg-white text-blue-600"
                              : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-lg">{option}</span>
                          {showResult && option === currentQuestion.answer && (
                            <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                          )}
                          {showResult && selectedAnswer === option && !isCorrect && (
                            <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {!showResult && selectedAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center"
                  >
                    <Button
                      onClick={handleSubmitAnswer}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                    >
                      Valider ma réponse
                    </Button>
                  </motion.div>
                )}

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center space-y-4"
                  >
                    <div className={`p-4 rounded-lg ${
                      isCorrect 
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`}>
                      <p className="text-lg font-semibold">
                        {isCorrect ? "Bravo ! 🎉" : "Essaie encore ! 💪"}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm mt-1">
                          La bonne réponse était : <strong>{currentQuestion.answer}</strong>
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleNextQuestion}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                      {currentQuestionIndex < currentQuiz.questions.length - 1 ? "Question suivante" : "Voir les résultats"}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Score actuel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-800 dark:text-white font-semibold">
              Score : {score}/{currentQuestionIndex + (showResult ? 1 : 0)}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

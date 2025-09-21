import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Star, Trophy, Target, Users } from 'lucide-react';
import QuizHebdomadaire from '@/components/quiz/QuizHebdomadaire';
// import quizData from '../../autistudy_quizzes_52.json'; // Remplacé par l'API

export default function QuizHebdomadairePage() {
  const router = useRouter();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [quizScores, setQuizScores] = useState<{ [week: number]: number }>({});
  const [quizStarted, setQuizStarted] = useState<{ [week: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  // Vérifier si une semaine est spécifiée dans l'URL
  useEffect(() => {
    if (router.query.week) {
      const weekNumber = parseInt(router.query.week as string);
      if (!isNaN(weekNumber) && weekNumber >= 1 && weekNumber <= 52) {
        setSelectedWeek(weekNumber);
      }
    }
  }, [router.query.week]);

  useEffect(() => {
    const loadQuizzesAndScores = async () => {
      try {
        // Charger les quiz depuis l'API
        const response = await fetch(`/api/quiz`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setQuizzes(result.data);
          }
        }

        // Charger les scores de l'utilisateur depuis l'API
        const token = localStorage.getItem('token');
        if (token) {
          const userResponse = await fetch(`/api/quiz/results/user/${JSON.parse(localStorage.getItem('user') || '{}')._id}/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (userResponse.ok) {
            const userResult = await userResponse.json();
            if (userResult.success) {
              // Transformer les données pour correspondre au format attendu
              const scores: { [week: number]: number } = {};
              // Ici on pourrait charger les scores par semaine si l'API le permet
              setQuizScores(scores);
            }
          }
        }

        // Charger les scores sauvegardés localement en fallback
        const savedScores = localStorage.getItem('quizScores');
        if (savedScores) {
          setQuizScores(JSON.parse(savedScores));
        }

        // Charger les quiz commencés depuis localStorage
        const savedStarted = localStorage.getItem('quizStarted');
        if (savedStarted) {
          setQuizStarted(JSON.parse(savedStarted));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des quiz:', error);
        // Fallback vers les scores locaux
        const savedScores = localStorage.getItem('quizScores');
        if (savedScores) {
          setQuizScores(JSON.parse(savedScores));
        }
      } finally {
        setLoading(false);
      }
    };

    loadQuizzesAndScores();
  }, []);

  const getCurrentWeek = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const handleQuizComplete = (week: number, score: number, totalQuestions: number) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const newScores = { ...quizScores, [week]: percentage };
    setQuizScores(newScores);
    localStorage.setItem('quizScores', JSON.stringify(newScores));
  };

  const handleQuizStart = (week: number) => {
    const newStarted = { ...quizStarted, [week]: true };
    setQuizStarted(newStarted);
    localStorage.setItem('quizStarted', JSON.stringify(newStarted));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 70) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Trophy className="w-4 h-4" />;
    if (score >= 70) return <Star className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return 'Excellent !';
    if (score >= 70) return 'Très bien !';
    if (score >= 50) return 'Bien !';
    return 'Continue !';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
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
            Chargement des quiz...
          </p>
        </motion.div>
      </div>
    );
  }

  if (selectedWeek) {
    return (
      <QuizHebdomadaire
        weekNumber={selectedWeek}
        onComplete={(score, total) => handleQuizComplete(selectedWeek, score, total)}
      />
    );
  }

  const currentWeek = getCurrentWeek();
  const availableWeeks = quizzes.map(quiz => quiz.week);
  const totalWeeks = availableWeeks.length > 0 ? Math.max(...availableWeeks) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => router.push('/controle')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au contrôle
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Quiz Hebdomadaires AutiStudy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Des quiz adaptés spécialement pour les enfants autistes de 6 à 18 ans
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-800 dark:text-blue-200 font-semibold">
                  Semaine {currentWeek}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-800 dark:text-green-200 font-semibold">
                  Adapté 6-18 ans
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-800 dark:text-purple-200 font-semibold">
                  10 questions
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description des adaptations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="text-xl text-blue-800 dark:text-blue-200 text-center">
                🧩 Adaptations spéciales pour l'autisme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="p-3">
                  <div className="text-2xl mb-2">📝</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Questions claires</strong><br />
                    Phrases courtes et simples
                  </p>
                </div>
                <div className="p-3">
                  <div className="text-2xl mb-2">🎨</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Repères visuels</strong><br />
                    Couleurs et icônes par matière
                  </p>
                </div>
                <div className="p-3">
                  <div className="text-2xl mb-2">💪</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Feedback positif</strong><br />
                    Encouragements constants
                  </p>
                </div>
                <div className="p-3">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Progression douce</strong><br />
                    Une difficulté à la fois
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Liste des quiz */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Choisissez votre quiz
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {quizzes.map((quiz) => {
              const week = quiz.week;
              const score = quizScores[week];
              const isCurrentWeek = week === currentWeek;
              const isCompleted = score !== undefined;
              const isStarted = quizStarted[week] || false;

              return (
                <motion.div
                  key={week}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      isCurrentWeek 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:shadow-lg'
                    } ${
                      isCompleted 
                        ? 'border-green-200 dark:border-green-700' 
                        : isStarted
                        ? 'border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => {
                      if (!isStarted) {
                        handleQuizStart(week);
                      }
                      setSelectedWeek(week);
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Semaine {week}
                        </CardTitle>
                        <div className="flex gap-2">
                          {isCurrentWeek && (
                            <Badge className="bg-blue-600 text-white">
                              Actuelle
                            </Badge>
                          )}
                          {isStarted && !isCompleted && (
                            <Badge className="bg-orange-500 text-white">
                              Commencé
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge className="bg-green-600 text-white">
                              Terminé
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {quiz.title}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Target className="w-4 h-4" />
                          <span>{quiz.questions.length} questions</span>
                        </div>

                        {isCompleted ? (
                          <div className="flex items-center justify-between">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(score)}`}>
                              {getScoreIcon(score)}
                              {score}%
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {getScoreText(score)}
                            </span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Button
                              variant={isCurrentWeek ? "default" : isStarted ? "secondary" : "outline"}
                              size="sm"
                              className={`w-full ${
                                isStarted 
                                  ? "bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-orange-900 dark:hover:bg-orange-800 dark:text-orange-200"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isStarted) {
                                  handleQuizStart(week);
                                }
                                setSelectedWeek(week);
                              }}
                            >
                              {isStarted ? "Continuer" : isCurrentWeek ? "Commencer" : "Réviser"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Statistiques */}
        {(Object.keys(quizScores).length > 0 || Object.keys(quizStarted).length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700">
              <CardHeader>
                <CardTitle className="text-xl text-green-800 dark:text-green-200 text-center">
                  📊 Vos statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {Object.keys(quizScores).length}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Quiz complétés
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                      {Object.keys(quizStarted).filter(week => !quizScores[parseInt(week)]).length}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Quiz commencés
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {Object.keys(quizScores).length > 0 ? Math.round(Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.values(quizScores).length) : 0}%
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Moyenne générale
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {Object.values(quizScores).filter(s => s >= 90).length}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Excellents résultats
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

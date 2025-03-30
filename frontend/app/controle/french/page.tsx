"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Pagination } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { useRouter } from "next/navigation";
import axios from "axios";

// Interface pour les exercices de français
interface Exercise {
  id: string;
  title: string;
  content: string;
  question: string;
  options?: string[];
  image?: string;
  answer: string;
  difficulty?: "Facile" | "Moyen" | "Difficile";
  estimatedTime?: string;
  category: string;
}

// Interface pour la question de l'API
interface Question {
  _id: string;
  title: string;
  content: string;
  question: string;
  options?: string[];
  answer: string;
  difficulty?: "Facile" | "Moyen" | "Difficile";
  category: string;
}

// Interface pour le sujet
interface Subject {
  _id: string;
  name: string;
  description?: string;
  active: boolean;
  icon?: string;
  questions: Question[];
}

// Type pour les résultats par page
interface PageResults {
  [pageNumber: number]: {
    score: number;
    completed: boolean;
    correctAnswers: number;
    totalQuestions: number;
  };
}

const FrenchPage: React.FC = () => {
  const router = useRouter();
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(20);
  const [pageResults, setPageResults] = useState<PageResults>({});
  
  // Navigation state
  const [totalPages, setTotalPages] = useState(0);
  
  // User answers and results per page
  const [pageUserAnswers, setPageUserAnswers] = useState<{[page: number]: {[key: string]: string}}>({});
  const [pageResultsDetails, setPageResultsDetails] = useState<{[page: number]: {[key: string]: boolean}}>({});
  
  // Current page state
  const [currentPageStreak, setCurrentPageStreak] = useState(0);
  const [currentPageCompleted, setCurrentPageCompleted] = useState(0);
  const [currentPagePoints, setCurrentPagePoints] = useState(0);
  
  // UI states
  const [emoji, setEmoji] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [currentPageScore, setCurrentPageScore] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  const [showTips, setShowTips] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [isFinished, setIsFinished] = useState(false);
  const [showOverallResults, setShowOverallResults] = useState(false);

  // Statistiques et badges (global)
  const [badges, setBadges] = useState<{
    perfectScore: boolean;
    streakMaster: boolean;
    frenchExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    frenchExpert: false,
    quickLearner: false,
  });

  // Messages d'encouragement
  const encouragementMessages = [
    "📚 Excellent travail en français !",
    "✍️ Ta maîtrise de la langue s'améliore !",
    "🎯 Continue sur cette lancée !",
    "💫 Tu progresses très bien !",
    "🌟 Ta grammaire est de plus en plus précise !",
    "🚀 Tu es sur la bonne voie !"
  ];

  // Helper pour obtenir les questions de la page actuelle
  const getCurrentPageExercises = (): Exercise[] => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return allExercises.slice(startIndex, endIndex);
  };

  // Obtenir les réponses utilisateur pour la page actuelle
  const getCurrentPageUserAnswers = (): {[key: string]: string} => {
    return pageUserAnswers[currentPage] || {};
  };

  // Obtenir les résultats pour la page actuelle
  const getCurrentPageResultDetails = (): {[key: string]: boolean} => {
    return pageResultsDetails[currentPage] || {};
  };

// Calculer le nombre total de réponses correctes sur toutes les pages
const getTotalCorrectAnswers = (): number => {
  // Calcul des bonnes réponses des pages déjà évaluées
  const savedPagesCorrect = Object.values(pageResults).reduce((total, result) => {
    return total + result.correctAnswers;
  }, 0);
  
  // Si la page actuelle n'a pas encore été "calculée" officiellement
  // mais que l'utilisateur a déjà donné des réponses correctes
  const currentPageExists = pageResults[currentPage];
  let currentPageCorrect = 0;
  
  if (!currentPageExists && pageResultsDetails[currentPage]) {
    // Compter les réponses correctes de la page actuelle
    currentPageCorrect = Object.values(pageResultsDetails[currentPage])
      .filter(result => result === true).length;
  }
  
  // Retourner le total des réponses correctes des pages calculées + page actuelle
  return savedPagesCorrect + currentPageCorrect;
};

  // Calculer le nombre total de questions tentées sur toutes les pages
  const getTotalQuestionsAttempted = (): number => {
    return Object.values(pageResults).reduce((total, result) => {
      return total + result.totalQuestions;
    }, 0);
  };

  // Calculer le score global
  const calculateGlobalScore = (): number => {
    const totalCorrect = getTotalCorrectAnswers();
    const totalAttempted = getTotalQuestionsAttempted();
    
    if (totalAttempted === 0) return 0;
    return (totalCorrect / totalAttempted) * 100;
  };

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        
        // Obtenez l'URL de base, qui peut se terminer par "api" ou non
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://blog-perso.onrender.com';
        
        // Construisez l'URL correcte pour obtenir toutes les matières
        const allSubjectsUrl = baseUrl.endsWith('/api') 
          ? `${baseUrl}/subjects` 
          : `${baseUrl}/api/subjects`;
        
        console.log('📡 Appel API getAllSubjects:', allSubjectsUrl);
        const allSubjectsResponse = await axios.get(allSubjectsUrl);
        
        // Trouver la matière "french" dans la liste
        const frenchSubject = allSubjectsResponse.data.find((s: any) => s.name === "french");
        
        if (!frenchSubject) {
          throw new Error('Matière french non trouvée dans la liste');
        }
        
        // Obtenir les détails complets de la matière en utilisant le nom "french"
        // et non l'ID, car votre route backend utilise le nom comme paramètre
        const frenchDetailsUrl = baseUrl.endsWith('/api') 
          ? `${baseUrl}/subjects/french` 
          : `${baseUrl}/api/subjects/french`;
        
        console.log('📡 Appel API getSubjectDetails par nom:', frenchDetailsUrl);
        const detailsResponse = await axios.get(frenchDetailsUrl);
        const data = detailsResponse.data;
        
        if (!data || !data.questions) {
          throw new Error('Aucune donnée reçue ou format invalide');
        }
        
        // Transformer toutes les questions en exercices
        const fetchedExercises: Exercise[] = data.questions.map((question: Question) => ({
          id: question._id,
          title: question.title || question.category || "Français",
          content: question.content || "Exercice",
          question: question.question,
          options: question.options,
          answer: question.answer,
          difficulty: question.difficulty || "Moyen",
          category: question.category || "Français"
        }));
        
        console.log(`✅ ${fetchedExercises.length} exercices chargés avec succès`);
        setAllExercises(fetchedExercises);
        
        // Calculer le nombre total de pages
        setTotalPages(Math.ceil(fetchedExercises.length / questionsPerPage));
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setError("Erreur lors du chargement des exercices");
        setLoading(false);
      }
    };

    loadExercises();
  }, [questionsPerPage]);

  // Réinitialiser les états de la page courante quand on change de page
  useEffect(() => {
    // Si cette page a déjà des résultats, chargez-les
    if (pageResults[currentPage]) {
      const pageResult = pageResults[currentPage];
      setCurrentPageCompleted(pageResult.correctAnswers);
      setCurrentPagePoints(pageResult.correctAnswers * 10);
    } else {
      // Sinon, initialisez avec des valeurs par défaut
      setCurrentPageCompleted(0);
      setCurrentPagePoints(0);
      setCurrentPageStreak(0);
    }
  }, [currentPage, pageResults]);

  // Gestion du minuteur et des messages d'encouragement
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let encouragementTimer: NodeJS.Timeout;

    if (timeLeft > 0 && !isFinished) {
      // Minuteur principal
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            calculateCurrentPageScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Messages d'encouragement toutes les 15 minutes
      encouragementTimer = setInterval(() => {
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        setEmoji(randomMessage);
        setTimeout(() => setEmoji(""), 5000); // Le message disparaît après 5 secondes
      }, 900000); // 900000ms = 15 minutes
    } else if (timeLeft === 0) {
      setIsFinished(true);
      calculateCurrentPageScore();
    }

    return () => {
      clearInterval(timer);
      clearInterval(encouragementTimer);
    };
  }, [timeLeft, isFinished]);

  // Fonction pour formater le temps restant
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: string) => {
    const updatedAnswers = {
      ...pageUserAnswers,
      [currentPage]: {
        ...(pageUserAnswers[currentPage] || {}),
        [id]: e.target.value
      }
    };
    setPageUserAnswers(updatedAnswers);
  };

  const handleSubmit = (id: string, correctAnswer: string) => {
    const userAnswer = pageUserAnswers[currentPage]?.[id];
    const isCorrect = userAnswer?.toString().trim().toLowerCase() === correctAnswer.toLowerCase();

    // Mettre à jour les résultats détaillés pour cette page
    const updatedResultsDetails = {
      ...pageResultsDetails,
      [currentPage]: {
        ...(pageResultsDetails[currentPage] || {}),
        [id]: isCorrect
      }
    };
    setPageResultsDetails(updatedResultsDetails);
    
    if (isCorrect) {
      setCurrentPageCompleted(prev => prev + 1);
      setCurrentPagePoints(prev => prev + 10);
      setCurrentPageStreak(prev => prev + 1);
    } else {
      setCurrentPageStreak(0);
    }
  };

  const calculateCurrentPageScore = () => {
    const pageExercises = getCurrentPageExercises();
    const pageAnswersResults = getCurrentPageResultDetails();
    
    // Compter les réponses correctes
    const correctAnswers = Object.values(pageAnswersResults).filter(Boolean).length;
    // Total des questions répondues
    const answeredQuestions = Object.keys(pageAnswersResults).length;
    
    // Calculer le score pour cette page
    const score = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
    
    // Mettre à jour les résultats de la page
    const updatedPageResults = {
      ...pageResults,
      [currentPage]: {
        score,
        completed: answeredQuestions === pageExercises.length,
        correctAnswers,
        totalQuestions: answeredQuestions
      }
    };
    setPageResults(updatedPageResults);
    setCurrentPageScore(score);
    setShowResults(true);

    // Mise à jour des badges basés sur toutes les pages complétées
    updateGlobalBadges(updatedPageResults);
    
    // Ajouter emoji basé sur le score de cette page
    if (score === 100) {
      setEmoji("🌟");
    } else if (score >= 80) {
      setEmoji("😊");
    } else if (score >= 50) {
      setEmoji("😐");
    } else {
      setEmoji("😢");
    }
  };

  const updateGlobalBadges = (results: PageResults) => {
    // Calculer les métriques globales
    const totalCorrect = Object.values(results).reduce((sum, page) => sum + page.correctAnswers, 0);
    const totalAttempted = Object.values(results).reduce((sum, page) => sum + page.totalQuestions, 0);
    const globalScore = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
    const maxStreak = 5; // Seuil pour le badge de série
    
    // Mise à jour des badges
    setBadges({
      perfectScore: globalScore === 100 && totalAttempted >= 20,
      streakMaster: currentPageStreak >= maxStreak,
      frenchExpert: totalCorrect >= 30,
      quickLearner: globalScore >= 80 && totalAttempted >= 15,
    });
  };

  const showGlobalResults = () => {
    setShowOverallResults(true);
  };

  const handlePageChange = (page: number) => {
    // Calculer automatiquement le score de la page actuelle avant de changer
    if (Object.keys(pageUserAnswers[currentPage] || {}).length > 0) {
      calculateCurrentPageScore();
    }
    
    setCurrentPage(page);
  };

  const filteredExercises = selectedCategory === "Tout" 
    ? getCurrentPageExercises()
    : getCurrentPageExercises().filter(ex => ex.category && ex.category === selectedCategory);

  // Extraction des catégories uniques de la page courante
  const uniqueCategories = getCurrentPageExercises()
    .map(ex => ex.category)
    .filter((category): category is string => Boolean(category));
  const categories = ["Tout", ...Array.from(new Set(uniqueCategories))];

  if (loading) {
    return (
      <motion.div 
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-spin text-4xl">🔄</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen gap-4"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-2xl text-red-600">⚠️</div>
        <p className="text-lg text-gray-600">Erreur: {error}</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <BackButton />
        <Timer timeLeft={timeLeft} />
      </div>

      <div className="mb-6">
        <ProgressBar 
          totalQuestions={getCurrentPageExercises().length} 
          correctAnswers={currentPageCompleted}
          onProgressComplete={() => {
            if (currentPageCompleted === getCurrentPageExercises().length) {
              calculateCurrentPageScore();
            }
          }}
        />
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto">
        <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6 relative">
            <motion.div 
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 sm:mb-6"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                Français
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Page {currentPage} sur {totalPages} ({getCurrentPageExercises().length} questions)
              </p>
            </motion.div>
          </div>

          {/* Pagination controls */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4">
            <div className="flex justify-center items-center">
              <Pagination
                total={totalPages}
                initialPage={1}
                page={currentPage}
                onChange={handlePageChange}
                showControls
                showShadow
                color="secondary"
                className="mt-2"
              />
            </div>
          </div>

          {/* Minuteur et bouton de démarrage */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-violet-200">
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-violet-600 dark:text-violet-400">
                  Temps restant : {formatTime(timeLeft)}
                </div>
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={showGlobalResults}
                >
                  Voir les résultats globaux
                </Button>
              </div>
            </div>
          </div>

          {/* Message d'encouragement */}
          {emoji && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-violet-200 z-50"
              initial={{ opacity: 0, y: -20 }}
            >
              <p className="text-lg">{emoji}</p>
            </motion.div>
          )}

          {/* Statistiques rapides */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200"
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📚</span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Page actuelle</p>
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">{currentPageCompleted} / {getCurrentPageExercises().length}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200"
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🔥</span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Série actuelle</p>
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">{currentPageStreak}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200"
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🎯</span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Points (page)</p>
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">{currentPagePoints}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200"
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">⭐</span>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total correct</p>
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">
                      {getTotalCorrectAnswers()}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Filtres et conseils */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filtre par catégorie */}
              <div className="flex-1">
                <select
                  className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg border border-violet-200"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bouton pour afficher/masquer les conseils */}
              <Button
                className="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                onClick={() => setShowTips(!showTips)}
              >
                {showTips ? "Masquer les conseils" : "Afficher les conseils"}
              </Button>
            </div>

            {/* Section des conseils */}
            {showTips && (
              <motion.div
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-bold text-violet-600 dark:text-violet-400 mb-2">Conseils pour réussir :</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>Lis bien chaque question attentivement</li>
                  <li>N&apos;oublie pas les règles de grammaire</li>
                  <li>Réfléchis à la formation des mots</li>
                  <li>Fais attention aux accents et à l&apos;orthographe</li>
                </ul>
              </motion.div>
            )}
          </div>

          {/* Grille d'exercices */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6">
            <motion.div
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {filteredExercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="w-full h-full bg-white dark:bg-gray-800 shadow-lg border border-violet-200">
                    <CardBody className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                        {exercise.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{exercise.content}</p>
                      <p className="font-medium mb-4">{exercise.question}</p>

                      {exercise.image && (
                        <div className="mb-4">
                          <Image
                            alt={exercise.title}
                            className="rounded-lg object-cover w-full h-48"
                            height={200}
                            src={`/assets/french/${exercise.image}`}
                            width={300}
                          />
                        </div>
                      )}

                      {exercise.options ? (
                        <select
                          className="w-full p-2 mb-4 bg-white dark:bg-gray-700 rounded-lg border border-violet-200"
                          disabled={pageResultsDetails[currentPage]?.[exercise.id] !== undefined}
                          value={pageUserAnswers[currentPage]?.[exercise.id] || ""}
                          onChange={(e) => handleChange(e, exercise.id)}
                        >
                          <option value="">Sélectionnez une option</option>
                          {exercise.options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="w-full p-2 mb-4 bg-white dark:bg-gray-700 rounded-lg border border-violet-200"
                          disabled={pageResultsDetails[currentPage]?.[exercise.id] !== undefined}
                          placeholder="Votre réponse"
                          type="text"
                          value={pageUserAnswers[currentPage]?.[exercise.id] || ""}
                          onChange={(e) => handleChange(e, exercise.id)}
                        />
                      )}

                      <Button
                        className="w-full bg-violet-500 text-white hover:bg-violet-600"
                        disabled={!pageUserAnswers[currentPage]?.[exercise.id] || pageResultsDetails[currentPage]?.[exercise.id] !== undefined}
                        onClick={() => handleSubmit(exercise.id, exercise.answer)}
                      >
                        Soumettre
                      </Button>

                      {pageResultsDetails[currentPage]?.[exercise.id] !== undefined && (
                        <motion.p
                          animate={{ opacity: 1 }}
                          className={`mt-2 text-center ${
                            pageResultsDetails[currentPage][exercise.id] ? "text-green-500" : "text-red-500"
                          }`}
                          initial={{ opacity: 0 }}
                        >
                          {pageResultsDetails[currentPage][exercise.id] ? "Bonne réponse !" : "Mauvaise réponse, réessayez."}
                        </motion.p>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Section des résultats de la page courante */}
          {showResults && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0, y: 20 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-violet-600 dark:text-violet-400 mb-4">
                  Résultats Page {currentPage} {emoji}
                </h2>
                <p className="text-center text-xl mb-6">
                  Score: {currentPageScore?.toFixed(1)}%
                </p>
                <p className="text-center mb-6">
                  {currentPageCompleted} réponse(s) correcte(s) sur {Object.keys(pageResultsDetails[currentPage] || {}).length} question(s) tentée(s)
                </p>
                <div className="flex justify-between mt-6">
                  <Button
                    className="bg-gray-500 text-white hover:bg-gray-600"
                    onClick={() => setShowResults(false)}
                  >
                    Fermer
                  </Button>
                  {currentPage < totalPages && (
                    <Button
                      className="bg-violet-500 text-white hover:bg-violet-600"
                      onClick={() => {
                        setShowResults(false);
                        handlePageChange(currentPage + 1);
                      }}
                    >
                      Page suivante
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Section des résultats globaux */}
          {showOverallResults && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0, y: 20 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-violet-600 dark:text-violet-400 mb-4">
                  Résultats Globaux
                </h2>
                <p className="text-center text-xl mb-6">
                  Score total: {calculateGlobalScore().toFixed(1)}%
                </p>
                
                <div className="mb-6">
                  <h3 className="font-bold mb-2">Résultats par page:</h3>
                  <div className="max-h-40 overflow-y-auto">
                    {Object.entries(pageResults).map(([pageNum, result]) => (
                      <div key={pageNum} className="flex justify-between items-center mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span>Page {pageNum}:</span>
                        <span>{result.score.toFixed(1)}% ({result.correctAnswers}/{result.totalQuestions})</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <h3 className="font-bold mb-2">Badges obtenus:</h3>
                  {badges.perfectScore && (
                    <div className="flex items-center gap-2 text-yellow-500">
                      <span>🌟</span>
                      <p>Score parfait!</p>
                    </div>
                  )}
                  {badges.streakMaster && (
                    <div className="flex items-center gap-2 text-orange-500">
                      <span>🔥</span>
                      <p>Maître des séries!</p>
                    </div>
                  )}
                  {badges.frenchExpert && (
                    <div className="flex items-center gap-2 text-blue-500">
                      <span>📚</span>
                      <p>Expert en français!</p>
                    </div>
                  )}
                  {badges.quickLearner && (
                    <div className="flex items-center gap-2 text-green-500">
                      <span>⚡</span>
                      <p>Apprenant rapide!</p>
                    </div>
                  )}
                  {Object.values(badges).filter(Boolean).length === 0 && (
                    <p className="text-gray-500">Continuez à travailler pour débloquer des badges!</p>
                  )}
                </div>
                
                <Button
                  className="w-full bg-violet-500 text-white hover:bg-violet-600"
                  onClick={() => setShowOverallResults(false)}
                >
                  Fermer
                </Button>
              </div>
            </motion.div>
          )}

          {/* Bouton de calcul du score de la page */}
          <div className="mt-8 flex justify-center gap-4">
            <Button
              className="bg-violet-500 text-white hover:bg-violet-600"
              onClick={calculateCurrentPageScore}
            >
              Calculer le score de la page
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FrenchPage;
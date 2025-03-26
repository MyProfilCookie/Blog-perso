/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import BackButton from "@/components/back";
import Timer from "@/components/Timer";

// Interface pour les exercices d'art
interface Exercise {
  id: number;
  title: string;
  content: string;
  image?: string;
  questions: {
    question: string;
    answer: string;
  }[];
  difficulty?: "Facile" | "Moyen" | "Difficile";
  estimatedTime?: string;
  category?: string;
}

const ArtPage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [emoji, setEmoji] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [completedExercises, setCompletedExercises] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  const [showTips, setShowTips] = useState<boolean>(true);

  // Statistiques et badges
  const [badges, setBadges] = useState<{
    perfectScore: boolean;
    streakMaster: boolean;
    artExpert: boolean;
    quickLearner: boolean;
  }>({
    perfectScore: false,
    streakMaster: false,
    artExpert: false,
    quickLearner: false,
  });

  useEffect(() => {
    fetch("/dataart.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        return response.json();
      })
      .then((data) => {
        if (data && data.art_exercises) {
          setExercises(data.art_exercises);
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = (id: number, correctAnswer: string) => {
    const userAnswer = userAnswers[id];
    const isCorrect = userAnswer?.toString().trim() === correctAnswer.trim();

    setResults({ ...results, [id]: isCorrect });
    
    if (isCorrect) {
      setCompletedExercises(prev => prev + 1);
      setTotalPoints(prev => prev + 10);
      setCurrentStreak(prev => prev + 1);
    } else {
      setCurrentStreak(0);
    }
  };

  const calculateFinalScore = () => {
    const total = exercises.length;
    const correct = Object.values(results).filter(Boolean).length;
    const score = (correct / total) * 100;

    setFinalScore(score);
    setShowResults(true);

    // Mise à jour des badges
    setBadges(prev => ({
      ...prev,
      perfectScore: score === 100,
      streakMaster: currentStreak >= 5,
      artExpert: completedExercises >= 10,
      quickLearner: score >= 80 && completedExercises >= 5,
    }));

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

  const filteredExercises = selectedCategory === "Tout" 
    ? exercises 
    : exercises.filter(ex => ex.category && ex.category === selectedCategory);

  // Extraction des catégories uniques
  const uniqueCategories = exercises
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
                Arts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Exercices d'arts
              </p>
            </motion.div>
            <div className="flex justify-center mb-4">
              <BackButton />
            </div>
          </div>

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
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Exercices complétés</p>
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">{completedExercises}</p>
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
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">{currentStreak}</p>
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
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Points gagnés</p>
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">{totalPoints}</p>
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
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Badges débloqués</p>
                    <p className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">
                      {Object.values(badges).filter(Boolean).length}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Filtres et conseils */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <select
                  className="w-full px-3 py-2 rounded-lg border-2 border-violet-200 focus:border-violet-500 focus:outline-none text-sm bg-white dark:bg-gray-800"
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
              
              {showTips && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-violet-50 dark:bg-violet-900/30 p-4 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-violet-600 dark:text-violet-400 mb-2">💡 Conseils</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Prenez votre temps pour observer les œuvres</li>
                        <li>• Notez les détails importants</li>
                        <li>• Utilisez le mode plein écran pour les images</li>
                        <li>• Vérifiez vos réponses avant de soumettre</li>
                      </ul>
                    </div>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setShowTips(false)}
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Contenu principal */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-7xl mx-auto px-2 sm:px-6"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredExercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="w-full bg-white dark:bg-gray-800 border border-violet-200">
                    <CardBody className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-violet-600 dark:text-violet-400">
                          {exercise.title}
                        </h3>
                        {exercise.difficulty && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            exercise.difficulty === "Facile" ? "bg-green-100 text-green-700" :
                            exercise.difficulty === "Moyen" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {exercise.difficulty}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {exercise.content}
                      </p>

                      {exercise.image && (
                        <div className="relative h-48 sm:h-64 mb-4 rounded-lg overflow-hidden">
                          <Image
                            fill
                            alt={exercise.title}
                            className="object-cover"
                            src={`/assets/art/${exercise.image}`}
                          />
                        </div>
                      )}

                      {exercise.questions.map((q, questionIndex) => (
                        <div key={questionIndex} className="space-y-3">
                          <p className="text-gray-700 dark:text-gray-300 font-medium">
                            {q.question}
                          </p>
                          
                          <div className="flex flex-col gap-2">
                            <input
                              className="w-full px-3 py-2 rounded-lg border-2 border-violet-200 focus:border-violet-500 focus:outline-none text-sm"
                              placeholder="Votre réponse..."
                              type="text"
                              value={userAnswers[exercise.id] || ""}
                              onChange={(e) => handleChange(e, exercise.id)}
                            />
                            
                            <Button
                              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                              onClick={() => handleSubmit(exercise.id, q.answer)}
                            >
                              Vérifier
                            </Button>
                          </div>

                          {results[exercise.id] !== undefined && (
                            <motion.div
                              animate={{ opacity: 1 }}
                              className={`p-3 rounded-lg ${
                                results[exercise.id]
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                              }`}
                              initial={{ opacity: 0 }}
                            >
                              {results[exercise.id] ? "✨ Bonne réponse !" : "❌ Mauvaise réponse, réessayez."}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Score final */}
            {showResults && finalScore !== null && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
              >
                <div className="bg-violet-50 dark:bg-violet-900/30 p-6 rounded-xl">
                  <h2 className="text-2xl sm:text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                    Votre score final
                  </h2>
                  <p className="text-4xl sm:text-5xl font-bold mb-2">
                    {finalScore.toFixed(0)}% {emoji}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {finalScore === 100
                      ? "Parfait ! Vous êtes un expert en art !"
                      : finalScore >= 80
                      ? "Excellent travail !"
                      : finalScore >= 50
                      ? "Continuez vos efforts !"
                      : "Ne vous découragez pas, continuez à pratiquer !"}
                  </p>

                  {/* Badges débloqués */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className={`p-3 rounded-lg ${badges.perfectScore ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                      <p className="text-2xl mb-1">{badges.perfectScore ? "🏆" : "🔒"}</p>
                      <p className="text-sm font-medium">Score parfait</p>
                    </div>
                    <div className={`p-3 rounded-lg ${badges.streakMaster ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                      <p className="text-2xl mb-1">{badges.streakMaster ? "🔥" : "🔒"}</p>
                      <p className="text-sm font-medium">Maître de la série</p>
                    </div>
                    <div className={`p-3 rounded-lg ${badges.artExpert ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                      <p className="text-2xl mb-1">{badges.artExpert ? "🎨" : "🔒"}</p>
                      <p className="text-sm font-medium">Expert en art</p>
                    </div>
                    <div className={`p-3 rounded-lg ${badges.quickLearner ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                      <p className="text-2xl mb-1">{badges.quickLearner ? "⚡" : "🔒"}</p>
                      <p className="text-sm font-medium">Apprenant rapide</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bouton pour calculer le score */}
            {!showResults && (
              <motion.div
                animate={{ opacity: 1 }}
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
              >
                <Button
                  className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl text-lg"
                  onClick={calculateFinalScore}
                >
                  Voir mon score final
                </Button>
              </motion.div>
            )}
          </motion.div>
        </section>
      </div>

      <Timer />
    </div>
  );
};

export default ArtPage;

/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import BackButton from "@/components/back";

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  studentInfo: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  question: {
    marginBottom: 10,
  },
  answer: {
    marginBottom: 15,
  },
});

// Interface pour les exercices
interface Exercise {
  id: number;
  title: string;
  content: string;
  question: string;
  options?: string[];
  image?: string;
  answer: string;
  difficulty?: "Facile" | "Moyen" | "Difficile";
  estimatedTime?: string;
  category?: string;
  subject: string;
}

// Interface pour les messages d'encouragement
interface EncouragementMessage {
  id: number;
  message: string;
  condition: string;
  emoji: string;
}

const TrimestrePage: React.FC = () => {
  // États pour les données
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<number>(7200); // 2 heures en secondes
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // États pour les réponses et résultats
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  // États pour les statistiques
  const [completedExercises, setCompletedExercises] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<string>("Tout");

  // Messages d'encouragement
  const encouragementMessages: EncouragementMessage[] = [
    { id: 1, message: "Excellent travail ! Continue comme ça !", condition: "high_score", emoji: "🌟" },
    { id: 2, message: "Tu es sur la bonne voie !", condition: "medium_score", emoji: "👍" },
    { id: 3, message: "Ne lâche pas, tu peux le faire !", condition: "low_score", emoji: "💪" },
    { id: 4, message: "Super progression !", condition: "improvement", emoji: "📈" },
    { id: 5, message: "Tu es un champion !", condition: "perfect_score", emoji: "🏆" },
  ];

  // Chargement des exercices
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const [frenchData, mathData, historyData, geographyData, sciencesData, languageData] = await Promise.all([
          fetch("/datafrench.json").then(res => res.json()),
          fetch("/datamath.json").then(res => res.json()),
          fetch("/datahistory.json").then(res => res.json()),
          fetch("/datageography.json").then(res => res.json()),
          fetch("/datasciences.json").then(res => res.json()),
          fetch("/datalanguage.json").then(res => res.json()),
        ]);

        const allExercises = [
          ...frenchData.french_exercises.map((ex: Exercise) => ({ ...ex, subject: "Français" })),
          ...mathData.math_exercises.map((ex: Exercise) => ({ ...ex, subject: "Mathématiques" })),
          ...historyData.history_exercises.map((ex: Exercise) => ({ ...ex, subject: "Histoire" })),
          ...geographyData.geography_exercises.map((ex: Exercise) => ({ ...ex, subject: "Géographie" })),
          ...sciencesData.sciences_exercises.map((ex: Exercise) => ({ ...ex, subject: "Sciences" })),
          ...languageData.language_exercises.map((ex: Exercise) => ({ ...ex, subject: "Langues" })),
        ];

        setExercises(allExercises);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des exercices");
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Gestion du timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isFinished && currentTime > 0) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            calculateFinalScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, currentTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number) => {
    setUserAnswers({ ...userAnswers, [id]: e.target.value });
  };

  const handleSubmit = (id: number, correctAnswer: string): void => {
    const userAnswer = userAnswers[id];
    const isCorrect = userAnswer?.toString().trim().toLowerCase() === correctAnswer.toLowerCase();

    setResults({ ...results, [id]: isCorrect });
    
    if (isCorrect) {
      setCompletedExercises(prev => prev + 1);
      setTotalPoints(prev => prev + 10);
      setCurrentStreak(prev => prev + 1);
      
      // Message d'encouragement aléatoire
      const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
      setCurrentMessage(`${randomMessage.emoji} ${randomMessage.message}`);
      setTimeout(() => setCurrentMessage(""), 3000);
    } else {
      setCurrentStreak(0);
      setCurrentMessage("💪 Ne lâche pas, tu peux le faire !");
      setTimeout(() => setCurrentMessage(""), 3000);
    }
  };

  const calculateFinalScore = () => {
    const total = exercises.length;
    const correct = Object.values(results).filter(Boolean).length;
    const score = (correct / total) * 100;

    setFinalScore(score);
    setShowResults(true);
  };

  const filteredExercises = selectedSubject === "Tout" 
    ? exercises 
    : exercises.filter(ex => ex.subject === selectedSubject);

  // Extraction des matières uniques
  const uniqueSubjects = Array.from(new Set(exercises.map(ex => ex.subject)));
  const subjects = ["Tout", ...uniqueSubjects];

  // Formatage du temps restant
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

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
    <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
      {/* En-tête avec titre et navigation */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6">
        <motion.div 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
            Contrôle Trimestriel
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Testez vos connaissances dans toutes les matières
          </p>
        </motion.div>

        {/* Barre de navigation supérieure */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200">
          <BackButton />
        </div>
      </div>

      {/* Formulaire de démarrage */}
      {!isStarted && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
        >
          <h2 className="text-xl font-bold text-violet-600 dark:text-violet-400 mb-4">
            Commencer le contrôle
          </h2>
          <div className="space-y-4">
            <Input
              label="Nom de l'élève"
              placeholder="Entrez votre nom"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>• Le contrôle dure 2 heures</p>
              <p>• Vous pouvez naviguer entre les exercices</p>
              <p>• Les réponses sont enregistrées automatiquement</p>
              <p>• Vous pouvez télécharger votre copie à la fin</p>
            </div>
            <Button
              className="w-full bg-violet-500 text-white hover:bg-violet-600"
              onClick={() => setIsStarted(true)}
              isDisabled={!studentName.trim()}
            >
              Commencer le contrôle
            </Button>
          </div>
        </motion.div>
      )}

      {/* Interface principale du contrôle */}
      {isStarted && !isFinished && (
        <>
          {/* Barre d'état */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-violet-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xl font-bold text-violet-600 dark:text-violet-400">
                  Temps restant : {formatTime(currentTime)}
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Exercices complétés</p>
                    <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{completedExercises}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
                    <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{totalPoints}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages d'encouragement */}
          {currentMessage && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-violet-200"
              initial={{ opacity: 0, y: -20 }}
            >
              <p className="text-lg">{currentMessage}</p>
            </motion.div>
          )}

          {/* Filtre par matière */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4">
            <select
              className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg border border-violet-200"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Grille d'exercices */}
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6">
            <motion.div
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
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
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400">
                          {exercise.title}
                        </h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {exercise.subject}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{exercise.content}</p>
                      <p className="font-medium mb-4">{exercise.question}</p>

                      {exercise.image && (
                        <div className="mb-4">
                          <Image
                            alt={exercise.title}
                            className="rounded-lg object-cover w-full h-48"
                            height={200}
                            src={`/assets/${exercise.subject.toLowerCase()}/${exercise.image}`}
                            width={300}
                          />
                        </div>
                      )}

                      {exercise.options ? (
                        <select
                          className="w-full p-2 mb-4 bg-white dark:bg-gray-700 rounded-lg border border-violet-200"
                          disabled={results[exercise.id] !== undefined}
                          value={userAnswers[exercise.id] || ""}
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
                          disabled={results[exercise.id] !== undefined}
                          placeholder="Votre réponse"
                          type="text"
                          value={userAnswers[exercise.id] || ""}
                          onChange={(e) => handleChange(e, exercise.id)}
                        />
                      )}

                      <Button
                        className="w-full bg-violet-500 text-white hover:bg-violet-600"
                        disabled={results[exercise.id] !== undefined}
                        onClick={() => handleSubmit(exercise.id, exercise.answer)}
                      >
                        Soumettre
                      </Button>

                      {results[exercise.id] !== undefined && (
                        <motion.p
                          animate={{ opacity: 1 }}
                          className={`mt-2 text-center ${
                            results[exercise.id] ? "text-green-500" : "text-red-500"
                          }`}
                          initial={{ opacity: 0 }}
                        >
                          {results[exercise.id] ? "Bonne réponse !" : "Mauvaise réponse, réessayez."}
                        </motion.p>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </>
      )}

      {/* Modal des résultats */}
      <Modal isOpen={showResults} onClose={() => setShowResults(false)} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              Résultats du contrôle
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {studentName}
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-violet-600 dark:text-violet-400">
                  {finalScore?.toFixed(1)}%
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Score final
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                    {completedExercises}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Exercices complétés
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                    {totalPoints}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Points gagnés
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex gap-4">
              <Button
                className="bg-violet-500 text-white hover:bg-violet-600"
                onClick={() => setShowResults(false)}
              >
                Fermer
              </Button>
              <PDFDownloadLink
                document={
                  <Document>
                    <Page size="A4" style={styles.page}>
                      <Text style={styles.header}>Contrôle Trimestriel</Text>
                      <View style={styles.studentInfo}>
                        <Text>Élève : {studentName}</Text>
                        <Text>Score : {finalScore?.toFixed(1)}%</Text>
                        <Text>Date : {new Date().toLocaleDateString()}</Text>
                      </View>
                      {exercises.map((exercise) => (
                        <View key={exercise.id} style={styles.section}>
                          <Text style={styles.question}>
                            {exercise.subject} - {exercise.title}
                          </Text>
                          <Text style={styles.answer}>
                            Réponse : {userAnswers[exercise.id] || "Non répondue"}
                          </Text>
                          <Text>
                            {results[exercise.id] ? "✅ Correcte" : "❌ Incorrecte"}
                          </Text>
                        </View>
                      ))}
                    </Page>
                  </Document>
                }
                fileName={`controle_${studentName}_${new Date().toISOString().split("T")[0]}.pdf`}
                className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg"
              >
                {({ loading }) => (
                  <span>
                    {loading ? "Génération du PDF..." : "Télécharger le PDF"}
                  </span>
                )}
              </PDFDownloadLink>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default TrimestrePage;

/* eslint-disable no-console */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";

import BackButton from "@/components/back";
import Timer from "@/components/Timer";

// Interface pour les questions basée sur la réponse de Postman
interface Question {
  _id: string;
  options: string[];
  // Ces champs seront ajoutés pour les questions fictives
  text?: string;
  category?: string;
}

// Interface pour le modèle de rapport
interface ReportModel {
  _id: string;
  name: string;
  __v: number;
  active: boolean;
  createdAt: string;
  description: string;
  displayName: string;
  icon: string;
  questions: Question[];
  updatedAt: string;
}

// Interface pour les éléments du rapport
interface ReportItem {
  subject: string;
  activity: string;
  hours: string;
  progress: "completed" | "in-progress" | "not-acquired" | "not-started";
}

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
}

interface WeeklyReportData {
  _id?: string;
  userId: string;
  weekNumber: string;
  items: ReportItem[];
  questionAnswers?: Record<string, string>; // Réponses aux questions
  createdAt?: string;
  updatedAt?: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const subjectList: Subject[] = [
  {
    id: "math",
    name: "Mathématiques",
    color: "from-red-400 to-red-300",
    icon: "🔢",
  },
  {
    id: "sciences",
    name: "Sciences",
    color: "from-green-400 to-green-300",
    icon: "🔬",
  },
  {
    id: "french",
    name: "Français",
    color: "from-blue-400 to-blue-300",
    icon: "📚",
  },
  {
    id: "history",
    name: "Histoire",
    color: "from-yellow-400 to-yellow-300",
    icon: "⏳",
  },
  {
    id: "geography",
    name: "Géographie",
    color: "from-purple-400 to-purple-300",
    icon: "🌍",
  },
  {
    id: "language",
    name: "Langues",
    color: "from-pink-400 to-pink-300",
    icon: "🗣️",
  },
  {
    id: "art",
    name: "Arts Plastiques",
    color: "from-indigo-400 to-indigo-300",
    icon: "🎨",
  },
  {
    id: "rapportHebdo",
    name: "Leçons du jour",
    color: "from-teal-400 to-teal-300",
    icon: "📖",
  },
];

// Méthode pour obtenir le numéro de la semaine actuelle
declare global {
  interface Date {
    getWeekNumber(): number;
  }
}

Date.prototype.getWeekNumber = function () {
  const startOfYear = new Date(this.getFullYear(), 0, 1);
  const pastDaysOfYear = (this.getTime() - startOfYear.getTime()) / 86400000;

  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

// Fonction pour générer les semaines de l'année
const generateWeeksOfYear = () => {
  const weeks = [];
  const currentWeek = new Date().getWeekNumber();
  const totalWeeks = 52; // Nombre de semaines dans l'année

  for (let i = currentWeek; i <= totalWeeks; i++) {
    weeks.push(`Semaine ${i}`);
  }

  return weeks;
};

// Fonction pour vérifier si le token est expiré
const isTokenExpired = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    const { exp } = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);

    return exp < currentTime;
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);

    return true; // En cas d'erreur, on considère le token comme expiré
  }
};

// Fonction pour construire l'URL de base correcte
const getBaseUrl = () => {
  // Utiliser l'URL spécifiée dans la capture d'écran
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
};

const WeeklyReport: React.FC = () => {
  const router = useRouter();
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [reportId, setReportId] = useState<string | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [isFinished, setIsFinished] = useState(false);
  const [showWeeks, setShowWeeks] = useState(false);
  const [weeks] = useState(generateWeeksOfYear);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  // Stocker le modèle de rapport avec ses questions
  const [reportModel, setReportModel] = useState<ReportModel | null>(null);

  // Références pour éviter les appels multiples
  const modelLoaded = useRef(false);

  // Vérification de l'authentification et chargement des données utilisateur
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("userToken");
          const userDataStr = localStorage.getItem("user");

          if (!token || !userDataStr) {
            console.log("Informations de connexion manquantes, redirection...");
            router.push("/users/login");

            return;
          }

          // Vérifier si le token est expiré
          if (isTokenExpired(token)) {
            console.log("Token expiré, redirection vers la connexion...");
            localStorage.removeItem("userToken");
            router.push("/users/login");

            return;
          }

          try {
            const userData: User = JSON.parse(userDataStr);

            if (userData) {
              setUserName(userData.prenom || userData.nom.split(" ")[0]);
              setUserId(userData._id);

              // Définir la semaine actuelle par défaut si aucune n'est sélectionnée
              if (!selectedWeek) {
                const currentWeek = `Semaine ${new Date().getWeekNumber()}`;

                setSelectedWeek(currentWeek);
              }
            }
          } catch (error) {
            console.error(
              "Erreur lors de la lecture des données utilisateur:",
              error,
            );
            setError("Erreur de lecture des données utilisateur");
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error,
        );
        setError("Erreur d'authentification");
      }
    };

    checkAuth();
  }, [router]);

const fetchReportModel = async () => {
  try {
    const token = localStorage.getItem("userToken");
 
    if (!token || isTokenExpired(token)) {
      router.push("/users/login");
      return null;
    }
 
    const baseUrl = getBaseUrl();
    const match = selectedWeek.match(/\d+/);
    const weekNumber = match ? parseInt(match[0], 10) : null;

    if (!weekNumber || isNaN(weekNumber)) {
      console.warn("❌ selectedWeek est invalide :", selectedWeek);
      return null;
    }
    const url = `${baseUrl}/subjects/rapportHebdo?week=${weekNumber}`;
 
    console.log("📡 Récupération du modèle de rapport pour la semaine :", weekNumber);
 
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
 
    const selectedWeekData = response.data;
 
    if (!selectedWeekData || !selectedWeekData.subjects) {
      console.warn("⚠️ Aucune donnée pour cette semaine.");
      return null;
    }
 
    const questions: Question[] = [];
 
    selectedWeekData.subjects.forEach((subject: any) => {
      subject.questions.forEach((q: any, index: number) => {
        questions.push({
          _id: `${subject.name}-${index}`,
          text: q.question,
          options: q.options,
          category: subject.name,
        });
      });
    });
 
    const model: ReportModel = {
      _id: `rapportHebdo-${weekNumber}`,
      name: "rapportHebdo",
      description: `Questions pour la semaine ${weekNumber}`,
      displayName: `Rapport semaine ${weekNumber}`,
      icon: "📝",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
      questions,
    };
 
    return model;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des questions :", error);
    return null;
  }
};

  // Charger le modèle de rapport une seule fois
  useEffect(() => {
    const loadReportModel = async () => {
      if (selectedWeek) {
        console.log("🔍 selectedWeek au moment du chargement du modèle :", selectedWeek);
        const model = await fetchReportModel();

        if (model) {
          setReportModel(model);
          modelLoaded.current = true;
          console.log("Modèle de rapport chargé avec", model.questions.length, "questions");
        } else {
          modelLoaded.current = false;
          console.error("Impossible de charger le modèle de rapport");
        }
      }
    };

    loadReportModel();
  }, [selectedWeek]);

  // Fonction pour créer un rapport vide
  const createEmptyReport = () => {
    const defaultItems: ReportItem[] = subjectList.map((subject) => ({
      subject: subject.name,
      activity: "",
      hours: "",
      progress: "not-started",
    }));

    setReportItems(defaultItems);
    setReportId(undefined);
    setSelectedAnswers({});
    console.log("Rapport vide créé");
  };

  // Récupérer un rapport d'un utilisateur pour une semaine spécifique
  const getUserWeeklyReport = async (
    userId: string,
    weekNumber: string,
    token: string,
  ): Promise<WeeklyReportData | null> => {
    try {
      // Récupérer tous les rapports de l'utilisateur
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/reports/user/${userId}`;

      console.log("📡 Récupération de tous les rapports:", url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Chercher le rapport pour la semaine spécifiée
      const reports = response.data;

      if (!Array.isArray(reports)) {
        console.log("Format de réponse inattendu:", reports);

        return null;
      }

      const weeklyReport = reports.find(
        (report) => report.weekNumber === weekNumber,
      );

      console.log(
        `Rapport pour ${weekNumber} trouvé:`,
        weeklyReport ? "Oui" : "Non",
      );

      // Si le rapport contient des réponses aux questions, les charger
      if (weeklyReport && weeklyReport.questionAnswers) {
        setSelectedAnswers(weeklyReport.questionAnswers);
      }

      return weeklyReport || null;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des rapports:`, error);

      return null;
    }
  };

  // Sauvegarder ou mettre à jour un rapport
  const saveWeeklyReport = async (
    reportData: WeeklyReportData,
    token: string,
  ): Promise<WeeklyReportData> => {
    try {
      const baseUrl = getBaseUrl();
      let response;

      if (reportData._id) {
        // Mise à jour d'un rapport existant
        const url = `${baseUrl}/reports/${reportData._id}`;

        console.log("📡 Mise à jour du rapport:", url);

        response = await axios.put(url, reportData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Création d'un nouveau rapport
        const url = `${baseUrl}/reports`;

        console.log("📡 Création d'un nouveau rapport:", url);

        response = await axios.post(url, reportData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde du rapport:", error);

      // En cas d'erreur, retourner les données d'origine
      return {
        ...reportData,
        _id: reportData._id || "local-draft",
      };
    }
  };

  // Chargement du rapport pour la semaine sélectionnée
  useEffect(() => {
    const loadWeeklyReport = async () => {
      if (!userId || !selectedWeek) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        if (!token || isTokenExpired(token)) {
          router.push("/users/login");

          return;
        }

        try {
          // Tentative de récupération du rapport depuis l'API
          const report = await getUserWeeklyReport(userId, selectedWeek, token);

          if (report && report.items && report.items.length > 0) {
            console.log("Rapport chargé depuis l'API");
            setReportItems(report.items);
            setReportId(report._id);

            // Charger les réponses aux questions
            if (report.questionAnswers) {
              setSelectedAnswers(report.questionAnswers);
            }
          } else {
            // Création d'un nouveau rapport local
            console.log("Création d'un rapport vide local");
            createEmptyReport();
          }
        } catch (apiError) {
          // En cas d'erreur API, créer un rapport vide local
          console.log(
            "Erreur API, création d'un rapport vide local:",
            apiError,
          );
          createEmptyReport();
        }

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du rapport:", err);
        createEmptyReport();
        setError(null);
        setLoading(false);
      }
    };

    loadWeeklyReport();
  }, [userId, selectedWeek, router]);

  // Gestion du timer
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [timeLeft, isFinished]);

  // Gestion des changements d'entrée pour les matières
  const handleInputChange = (
    index: number,
    field: keyof ReportItem,
    value: string,
  ) => {
    const updatedReport = [...reportItems];

    updatedReport[index] = {
      ...updatedReport[index],
      [field]: value,
    };
    setReportItems(updatedReport);
  };

  // Gestion des réponses aux questions
  const handleAnswerSelection = (questionId: string, answer: string) => {
    console.log(
      `Réponse sélectionnée: question ${questionId}, réponse ${answer}`,
    );
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const getProgressEmoji = (progress: string) => {
    switch (progress) {
      case "completed":
        return "🌟";
      case "in-progress":
        return "💪";
      case "not-acquired":
        return "📚";
      default:
        return "⭐";
    }
  };

  const saveReport = async () => {
    if (!isReportComplete()) {
      Swal.fire({
        icon: "warning",
        title: "Oups ! Il manque des informations",
        text: "N'oublie pas de remplir toutes les activités pour chaque matière !",
        confirmButtonText: "Je complète !",
        background: "#fff",
        confirmButtonColor: "#6366f1",
      });

      return;
    }

    try {
      const token = localStorage.getItem("userToken");

      if (!token || isTokenExpired(token)) {
        router.push("/users/login");

        return;
      }

      // Préparer les données du rapport avec les réponses aux questions
      const reportData = {
        _id: reportId,
        userId: userId,
        weekNumber: selectedWeek,
        items: reportItems,
        questionAnswers: selectedAnswers, // Inclure les réponses aux questions
      };

      // Sauvegarder le rapport via l'API
      const savedReport = await saveWeeklyReport(reportData, token);

      // Mettre à jour l'ID du rapport si c'est un nouveau rapport
      if (savedReport && savedReport._id && savedReport._id !== "local-draft") {
        setReportId(savedReport._id);
      }

      Swal.fire({
        icon: "success",
        title: "Bravo ! 🎉",
        text: `Tu as bien sauvegardé ton rapport pour ${selectedWeek} !`,
        confirmButtonText: "Super !",
        background: "#fff",
        confirmButtonColor: "#6366f1",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du rapport:", error);

      // Même en cas d'erreur, permettre à l'utilisateur de télécharger son rapport
      Swal.fire({
        icon: "warning",
        title: "Problème de sauvegarde",
        text: "Impossible de sauvegarder en ligne. Vous pouvez télécharger votre rapport.",
        confirmButtonText: "Télécharger",
        background: "#fff",
        confirmButtonColor: "#6366f1",
      }).then((result) => {
        if (result.isConfirmed) {
          downloadReport();
        }
      });
    }
  };

  const downloadReport = () => {
    if (!isReportComplete()) {
      Swal.fire({
        icon: "warning",
        title: "Rapport incomplet",
        text: "Le rapport est incomplet. Veuillez remplir toutes les informations avant de le télécharger.",
        confirmButtonText: "Ok",
      });

      return;
    }

    const reportData = {
      weekNumber: selectedWeek,
      userName: userName,
      date: new Date().toLocaleDateString(),
      items: reportItems,
      questionAnswers: selectedAnswers, // Inclure les réponses aux questions
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${selectedWeek.replace(/\s+/g, "-").toLowerCase()}-rapport.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isReportComplete = () => {
    for (let item of reportItems) {
      if (!item.activity || !item.hours || !item.progress) {
        return false;
      }
    }

    return true;
  };

  // Affichage pendant le chargement
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

  // Affichage en cas d'erreur
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
                Rapport Hebdomadaire
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Suivez votre progression
              </p>
            </motion.div>
          </div>
          <div className="container mx-auto px-6 py-8 flex-grow">
            {/* En-tête */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-4">
                📝 Mon Rapport de la Semaine
              </h1>

              <motion.h2
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-6"
                initial={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {userName ? (
                  <>
                    Salut {userName} ! 👋 Prêt(e) à noter tes progrès de la
                    semaine ?
                  </>
                ) : (
                  <>Chargement de ton profil...</>
                )}
              </motion.h2>

              {/* Sélecteur de semaine */}
              <div className="relative inline-block">
                <Button
                  className="px-6 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-full
                            hover:from-violet-600 hover:to-blue-600 transition-all duration-300"
                  onClick={() => setShowWeeks(!showWeeks)}
                >
                  {selectedWeek || "Sélectionner une semaine"} 📅
                </Button>

                {showWeeks && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-50 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl
                              border-2 border-violet-200 dark:border-violet-700 max-h-60 overflow-y-auto"
                    initial={{ opacity: 0, y: 10 }}
                  >
                    {weeks.map((week) => (
                      <button
                        key={week}
                        className="w-full text-left px-4 py-2 cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-900/30
                                  text-gray-700 dark:text-gray-300"
                        onClick={() => {
                          setSelectedWeek(week);
                          setShowWeeks(false);
                        }}
                      >
                        {week}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Grille des matières */}
            <div
              className="grid grid-cols-1 gap-4 sm:gap-6 max-w-[1400px] mx-auto mb-8 px-0 sm:px-4"
              role="grid"
            >
              {reportItems.map((item, index) => (
                <motion.div
                  key={`${item.subject}-${index}`}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="w-full border-2 border-violet-200 dark:border-violet-700 overflow-hidden hover:shadow-xl transition-all duration-300 rounded-none sm:rounded-lg">
                    <CardBody className="p-4 sm:p-6">
                      {/* En-tête de la matière */}
                      <div
                        className={`bg-gradient-to-r ${
                          subjectList[index % subjectList.length].color
                        } -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 p-3 sm:p-4 mb-4 sm:mb-6`}
                      >
                        <h3 className="text-lg sm:text-xl font-bold text-white text-center flex items-center justify-center gap-2">
                          {subjectList[index % subjectList.length].icon}{" "}
                          {item.subject}
                        </h3>
                      </div>

                      {/* Contenu principal */}
                      <div className="space-y-4">
                        <div>
                          <label
                            className="text-sm text-gray-600 dark:text-gray-400 mb-1 block"
                            htmlFor={`activity-${index}`}
                          >
                            Qu&apos;as-tu fait aujourd&apos;hui ?
                          </label>
                          <Input
                            className="w-full text-sm sm:text-base"
                            id={`activity-${index}`}
                            placeholder="Décris ton activité..."
                            value={item.activity}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "activity",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div>
                          <label
                            className="text-sm text-gray-600 dark:text-gray-400 mb-1 block"
                            htmlFor={`hours-${index}`}
                          >
                            Combien de temps y as-tu passé ?
                          </label>
                          <Input
                            className="w-full text-sm sm:text-base"
                            id={`hours-${index}`}
                            placeholder="Temps en heures"
                            type="number"
                            value={item.hours}
                            onChange={(e) =>
                              handleInputChange(index, "hours", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <label
                            className="text-sm text-gray-600 dark:text-gray-400 mb-1 block"
                            htmlFor={`progress-${index}`}
                          >
                            Comment ça s&apos;est passé ?
                          </label>
                          <div
                            aria-label="Progression"
                            className="grid grid-cols-1 gap-2 sm:gap-3 mt-2"
                            id={`progress-${index}`}
                            role="group"
                          >
                            <Button
                              key="in-progress"
                              className={`w-full p-2 sm:p-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                                item.progress === "in-progress"
                                  ? "bg-violet-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30"
                              }`}
                              onClick={() =>
                                handleInputChange(
                                  index,
                                  "progress",
                                  "in-progress",
                                )
                              }
                            >
                              Je progresse {getProgressEmoji("in-progress")}
                            </Button>
                            <Button
                              key="completed"
                              className={`w-full p-2 sm:p-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                                item.progress === "completed"
                                  ? "bg-violet-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30"
                              }`}
                              onClick={() =>
                                handleInputChange(
                                  index,
                                  "progress",
                                  "completed",
                                )
                              }
                            >
                              J&apos;ai réussi ! {getProgressEmoji("completed")}
                            </Button>
                            <Button
                              key="not-acquired"
                              className={`w-full p-2 sm:p-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                                item.progress === "not-acquired"
                                  ? "bg-violet-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30"
                              }`}
                              onClick={() =>
                                handleInputChange(
                                  index,
                                  "progress",
                                  "not-acquired",
                                )
                              }
                            >
                              Besoin d&apos;aide{" "}
                              {getProgressEmoji("not-acquired")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Section des questions */}
            {reportModel &&
              reportModel.questions &&
              reportModel.questions.length > 0 && (
                <div className="mt-12 mb-8">
                  <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    📋 Questions Complémentaires
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1400px] mx-auto">
                    {reportModel.questions.map((question, index) => (
                      <Card
                        key={question._id}
                        className="border-2 border-violet-200 dark:border-violet-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <CardBody className="p-5">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            {question.text || `Question ${index + 1}`}
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {question.options && question.options.length > 0
                              ? question.options.map((option, optIdx) => (
                                  <Button
                                    key={optIdx}
                                    className={`p-2 text-xs sm:text-sm rounded ${
                                      selectedAnswers[question._id] === option
                                        ? "bg-violet-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                                    onClick={() =>
                                      handleAnswerSelection(
                                        question._id,
                                        option,
                                      )
                                    }
                                  >
                                    {option}
                                  </Button>
                                ))
                              : // Fallback pour les options vides
                                ["Oui", "Non", "Peut-être"].map(
                                  (option, optIdx) => (
                                    <Button
                                      key={optIdx}
                                      className={`p-2 text-xs sm:text-sm rounded ${
                                        selectedAnswers[question._id] === option
                                          ? "bg-violet-500 text-white"
                                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                      }`}
                                      onClick={() =>
                                        handleAnswerSelection(
                                          question._id,
                                          option,
                                        )
                                      }
                                    >
                                      {option}
                                    </Button>
                                  ),
                                )}
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 py-6 mt-8 px-4">
              <Button
                className="w-full sm:w-auto bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-300"
                onClick={saveReport}
              >
                Sauvegarder mon rapport 📝
              </Button>
              <Button
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-300"
                onClick={downloadReport}
              >
                Télécharger mon rapport 💾
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WeeklyReport;

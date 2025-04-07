import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";

import ReportHeader from "@/components/rapport/ReportHeader";
import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";

// Interface pour les exercices
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

// Interface pour les questions basée sur la réponse de Postman
interface Question {
  _id: string;
  options: string[];
  answer?: string;
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

// Type pour les résultats par page
interface PageResults {
  [pageNumber: number]: {
    score: number;
    completed: boolean;
    correctAnswers: number;
    totalQuestions: number;
  };
}

// Interface pour l'utilisateur
interface User {
  _id: string;
  pseudo: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  image?: string;
  prenom?: string;
  nom?: string;
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

// Fonction pour obtenir l'URL de base de l'API
const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (apiUrl?.endsWith("/api")) {
    return apiUrl;
  } else if (apiUrl) {
    return `${apiUrl}/api`;
  }

  return "https://blog-perso.onrender.com/api";
};

const subjectEmojis: Record<string, string> = {
  Mathématiques: "🔢",
  Sciences: "🔬",
  Français: "📚",
  Histoire: "⏳",
  Géographie: "🌍",
  Langues: "🗣️",
  "Arts Plastiques": "🎨",
  "Leçons du jour": "📖",
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
  const [answerAttempts, setAnswerAttempts] = useState<Record<string, number>>(
    {},
  );
  const [errorCount, setErrorCount] = useState(0);

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
              const firstName =
                userData.prenom ||
                (userData.nom ? userData.nom.split(" ")[0] : "") ||
                "";

              setUserName(firstName);
              setUserId(userData._id);
              if (firstName) {
                Swal.fire({
                  title: `Bienvenue ${firstName} 😊`,
                  text: "Es-tu prêt(e) à commencer ton rapport de la semaine ?",
                  confirmButtonText: "Oui, allons-y !",
                  background: "#f0f4ff",
                  confirmButtonColor: "#6366f1",
                });
              }
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
      const weekNumber =
        match && !isNaN(parseInt(match[0], 10))
          ? parseInt(match[0], 10)
          : new Date().getWeekNumber();
      const url = `${baseUrl}/reports/rapportHebdo?week=${weekNumber}`;

      console.log(
        "📡 Récupération du modèle de rapport pour la semaine :",
        weekNumber,
      );

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
            answer: q.answer, // Ajout de la réponse pour vérification
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
      if (axios.isAxiosError(error)) {
        console.error(
          "❌ Erreur Axios:",
          error.response?.status,
          error.response?.data,
        );
      } else {
        console.error("❌ Erreur inconnue:", error);
      }

      return null;
    }
  };

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
        if ((3600 - timeLeft) % 900 === 0 && timeLeft !== 3600) {
          Swal.fire({
            icon: "info",
            title: "👏 Bravo !",
            text: "Continue comme ça, tu fais de ton mieux !",
            timer: 4000,
            showConfirmButton: false,
            background: "#f0f4ff",
          });
        }
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
    if (answerAttempts[questionId] === 3 || errorCount >= 20) {
      Swal.fire({
        icon: "info",
        title: "Limite atteinte",
        text: "Tu ne peux plus répondre à cette question ou tu as atteint la limite d'erreurs.",
        background: "#f0f4ff",
      });

      return;
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    setAnswerAttempts((prev) => ({
      ...prev,
      [questionId]: (prev[questionId] || 0) + 1,
    }));

    if (reportModel) {
      const question = reportModel.questions.find((q) => q._id === questionId);

      if (question && question.options && question.answer) {
        const currentAttempts = (answerAttempts[questionId] || 0) + 1;
        const isCorrect = question.answer === answer && currentAttempts <= 2;

        if (!isCorrect) {
          setErrorCount((prev) => prev + 1);

          if (currentAttempts === 3 && userId) {
            fetch(`${getBaseUrl()}/revision-errors`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              },
              body: JSON.stringify({
                userId,
                questionId: question._id,
                questionText: question.text,
                selectedAnswer: answer,
                correctAnswer: question.answer,
                category: question.category,
              }),
            }).catch((err) =>
              console.error(
                "Erreur lors de l'enregistrement de l'erreur :",
                err,
              ),
            );
          }
        }

        let feedbackHtml = "";

        if (isCorrect) {
          feedbackHtml = "<strong>Tu as bien répondu 👏</strong>";
        } else if (currentAttempts === 2) {
          feedbackHtml = `<p>Essaie encore une fois ! 💪</p>`;
        } else if (currentAttempts === 3) {
          feedbackHtml = `<p>❌ Mauvaise réponse.<br/>✅ La bonne réponse était : <strong>${question.answer}</strong></p>`;
        } else {
          feedbackHtml = `<p>Ne t'inquiète pas, tu feras mieux la prochaine fois 💪</p>`;
        }

        Swal.fire({
          icon: isCorrect ? "success" : "error",
          title: isCorrect ? "✅ Bravo !" : "❌ Mauvaise réponse",
          html: feedbackHtml,
          timer: 4000,
          showConfirmButton: false,
          background: "#f0f4ff",
        });
      }
    }
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

  // Fonction pour vérifier si le rapport est complet
  const isReportComplete = () => {
    return reportItems.every(
      (item) =>
        item.activity.trim() !== "" &&
        item.hours.trim() !== "" &&
        item.progress !== "not-started",
    );
  };

  // Fonction pour générer le contenu du rapport
  const generateReportContent = () => {
    let content = `Rapport Hebdomadaire - Semaine ${selectedWeek}\n`;

    content += `Date: ${new Date().toLocaleDateString()}\n`;
    content += `Élève: ${userName}\n\n`;

    content += "Activités et Progression:\n";
    reportItems.forEach((item) => {
      content += `\nMatière: ${item.subject}\n`;
      content += `Activité: ${item.activity}\n`;
      content += `Temps consacré: ${item.hours}\n`;
      content += `Progression: ${item.progress}\n`;
      content += "-------------------\n";
    });

    return content;
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
    const content = generateReportContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `rapport-hebdomadaire-semaine-${selectedWeek}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Composant de chargement
  const LoadingPlaceholder = () => {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen gap-4"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-3xl animate-spin">🔄</div>
        <p className="text-lg text-gray-600">Chargement en cours...</p>
      </motion.div>
    );
  };

  // Affichage pendant le chargement
  if (loading) {
    return <LoadingPlaceholder />;
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
    <motion.div className="flex flex-col min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <BackButton />
        <Timer timeLeft={timeLeft} />
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <ProgressBar
            correctAnswers={
              reportItems.filter((item) => item.progress === "completed").length
            }
            totalQuestions={reportItems.length}
          />
        </motion.div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto">
        <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
          {/* <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6 relative">
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
          </div> */}
          {/* Error Progress Bar */}
          <div className="w-full max-w-4xl mx-auto mb-6">
            <div className="mb-2 text-sm text-center text-gray-700 dark:text-gray-300">
              Erreurs : {errorCount} / 20
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
              <div
                className="h-3 rounded-full bg-red-500 transition-all duration-300"
                style={{ width: `${(errorCount / 20) * 100}%` }}
              />
            </div>
          </div>
          <div className="container mx-auto px-6 py-8 flex-grow">
            <ReportHeader
              selectedWeek={selectedWeek}
              showWeeks={showWeeks}
              toggleWeekList={() => setShowWeeks(!showWeeks)}
              userName={userName}
              weeks={weeks}
              onWeekSelect={(week) => {
                setSelectedWeek(week);
                setShowWeeks(false);
              }}
            />

            {/* Grille des matières */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-[1400px] mx-auto mb-8 px-4"
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
                      {(() => {
                        const subjectData = subjectList.find(
                          (s) => s.name === item.subject,
                        );
                        const gradient =
                          subjectData?.color || "from-gray-400 to-gray-300";

                        return (
                          <div
                            className={`bg-gradient-to-r ${gradient} -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 p-3 sm:p-4 mb-4 sm:mb-6`}
                          >
                            <h3 className="text-lg sm:text-xl font-bold text-white text-center flex items-center justify-center gap-2">
                              {subjectData?.icon || "📘"} {item.subject}
                            </h3>
                          </div>
                        );
                      })()}

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-[1400px] mx-auto mb-12 px-4">
              {reportModel?.questions.map((question, idx) => (
                <motion.div
                  key={question._id}
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <CardBody className="p-4 space-y-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white text-base">
                        {question.text}
                      </h4>
                      <div className="space-y-2">
                        {question.options.map((option, i) => {
                          const isSelected =
                            selectedAnswers[question._id] === option;

                          return (
                            <Button
                              key={i}
                              className={`w-full text-left text-sm p-2 ${
                                isSelected
                                  ? "bg-violet-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30"
                              }`}
                              onClick={() =>
                                handleAnswerSelection(question._id, option)
                              }
                            >
                              {option}
                            </Button>
                          );
                        })}
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>

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
    </motion.div>
  );
};

export default WeeklyReport;

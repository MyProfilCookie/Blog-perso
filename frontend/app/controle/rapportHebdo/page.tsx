/* eslint-disable no-console */
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import BackButton from "@/components/back";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";
import { getUserWeeklyReport, saveWeeklyReport, ReportItem } from "@/services/reportService";

const subjects = [
  { name: "Mathématiques", color: "from-red-400 to-red-300", icon: "🔢" },
  { name: "Sciences", color: "from-green-400 to-green-300", icon: "🔬" },
  { name: "Français", color: "from-blue-400 to-blue-300", icon: "📚" },
  { name: "Histoire", color: "from-yellow-400 to-yellow-300", icon: "⏳" },
  { name: "Géographie", color: "from-purple-400 to-purple-300", icon: "🌍" },
  { name: "Langues", color: "from-pink-400 to-pink-300", icon: "🗣️" },
  {
    name: "Arts Plastiques",
    color: "from-indigo-400 to-indigo-300",
    icon: "🎨",
  },
  { name: "Leçons du jour", color: "from-teal-400 to-teal-300", icon: "📖" },
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

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
}

const WeeklyReport = () => {
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
            console.error("Erreur lors de la lecture des données utilisateur:", error);
            setError("Erreur de lecture des données utilisateur");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setError("Erreur d'authentification");
      }
    };

    checkAuth();
  }, [router]);

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
        
        // Récupérer le rapport depuis l'API
        const report = await getUserWeeklyReport(userId, selectedWeek, token);
        
        if (report && report.items && report.items.length > 0) {
          setReportItems(report.items);
          setReportId(report._id);
        } else {
          // Créer un nouveau rapport vide si aucun n'existe
          const defaultItems: ReportItem[] = subjects.map((subject) => ({
            subject: subject.name,
            activity: "",
            hours: "",
            progress: "not-started",
          }));
          
          setReportItems(defaultItems);
          setReportId(undefined);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du rapport:", err);
        setError("Erreur lors du chargement du rapport");
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

  const handleInputChange = (
    index: number,
    field: keyof ReportItem,
    value: string,
  ) => {
    const updatedReport = [...reportItems];
    updatedReport[index] = { 
      ...updatedReport[index], 
      [field]: value 
    };
    setReportItems(updatedReport);
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
      
      // Préparer les données du rapport
      const reportData = {
        _id: reportId,
        userId: userId,
        weekNumber: selectedWeek,
        items: reportItems
      };
      
      // Sauvegarder le rapport via l'API
      const savedReport = await saveWeeklyReport(reportData, token);
      
      // Mettre à jour l'ID du rapport si c'est un nouveau rapport
      if (savedReport && !reportId) {
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
      
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la sauvegarde de ton rapport.",
        confirmButtonText: "D'accord",
        background: "#fff",
        confirmButtonColor: "#6366f1",
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
      items: reportItems
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
                    Salut {userName} ! 👋 Prêt(e) à noter tes progrès de la semaine
                    ?
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
            <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-[1400px] mx-auto mb-8 px-0 sm:px-4">
              {reportItems.map((item, index) => (
                <motion.div
                  key={`${item.subject}-${index}`}
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="w-full"
                >
                  <Card className="w-full border-2 border-violet-200 dark:border-violet-700 overflow-hidden hover:shadow-xl transition-all duration-300 rounded-none sm:rounded-lg">
                    <CardBody className="p-4 sm:p-6">
                      {/* En-tête de la matière */}
                      <div
                        className={`bg-gradient-to-r ${
                          subjects[index % subjects.length].color
                        } -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 p-3 sm:p-4 mb-4 sm:mb-6`}
                      >
                        <h3 className="text-lg sm:text-xl font-bold text-white text-center flex items-center justify-center gap-2">
                          {subjects[index % subjects.length].icon} {item.subject}
                        </h3>
                      </div>

                      {/* Contenu */}
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
                              handleInputChange(index, "activity", e.target.value)
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
                                handleInputChange(index, "progress", "in-progress")
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
                                handleInputChange(index, "progress", "completed")
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
                                handleInputChange(index, "progress", "not-acquired")
                              }
                            >
                              Besoin d&apos;aide {getProgressEmoji("not-acquired")}
                            </Button>
                          </div>
                        </div>
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
    </div>
  );
};

export default WeeklyReport;

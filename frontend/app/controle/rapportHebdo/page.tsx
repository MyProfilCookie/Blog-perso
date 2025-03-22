/* eslint-disable no-console */
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

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

interface ReportItem {
  subject: string;
  activity: string;
  hours: string;
  progress: "not-started" | "in-progress" | "completed" | "not-acquired";
}

type ReportList = ReportItem[];

const WeeklyReport = () => {
  const router = useRouter();
  const [selectedWeek, setSelectedWeek] = useState<string>(
    `Semaine ${new Date().getWeekNumber()}`,
  );
  const [weeks] = useState(generateWeeksOfYear);
  const [showWeeks, setShowWeeks] = useState(false);
  const [userName, setUserName] = useState("");
  const [report, setReport] = useState<ReportList>(
    subjects.map((subject) => ({
      subject: subject.name,
      activity: "",
      hours: "",
      progress: "not-started",
    })),
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier si nous sommes sur le client
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");

          if (!token) {
            console.log(
              "Pas de token trouvé, redirection vers la connexion...",
            );
            router.push("/users/login");

            return;
          }

          const apiUrl = process.env.NEXT_PUBLIC_API_URL;

          console.log("URL de l'API:", apiUrl); // Pour déboguer

          const response = await fetch(`${apiUrl}/users/me`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();

            console.log("Données utilisateur reçues:", userData);

            if (userData.data) {
              // Si les données sont dans data.user
              if (userData.data.user) {
                setUserName(
                  userData.data.user.firstName ||
                    userData.data.user.name?.split(" ")[0] ||
                    "",
                );
              }
              // Si les données sont directement dans data
              else {
                setUserName(
                  userData.data.firstName ||
                    userData.data.name?.split(" ")[0] ||
                    "",
                );
              }
            } else {
              // Si les données sont à la racine
              setUserName(
                userData.firstName || userData.name?.split(" ")[0] || "",
              );
            }
          } else if (response.status === 401 || response.status === 403) {
            console.log(
              "Session expirée ou invalide, redirection vers la connexion...",
            );
            localStorage.removeItem("token");
            router.push("/users/login");
          } else {
            console.error("Erreur de réponse API:", response.status);
            const errorData = await response.text();

            console.error("Détails de l'erreur:", errorData);

            // En cas d'erreur 404, vérifier si c'est un problème de chemin d'API
            if (response.status === 404) {
              console.error(
                "L'endpoint de l'API n'a pas été trouvé. Vérifiez le chemin de l'API.",
              );
            }
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error,
        );
        router.push("/users/login"); // Utilisation du chemin cohérent
      }
    };

    checkAuth();

    // Chargement du rapport sauvegardé seulement si nous avons un token
    if (localStorage.getItem("token")) {
      const savedReport = JSON.parse(
        localStorage.getItem(selectedWeek) || "[]",
      );

      if (savedReport.length) {
        setReport(savedReport);
      } else {
        setReport(
          subjects.map((subject) => ({
            subject: subject.name,
            activity: "",
            hours: "",
            progress: "not-started",
          })),
        );
      }
    }
  }, [selectedWeek, router]);

  const handleInputChange = (
    index: number,
    field: keyof ReportItem,
    value: string,
  ) => {
    const updatedReport = [...report];

    updatedReport[index] = { ...updatedReport[index], [field]: value };
    setReport(updatedReport);
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

  const saveReport = () => {
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

    localStorage.setItem(selectedWeek, JSON.stringify(report));
    Swal.fire({
      icon: "success",
      title: "Bravo ! 🎉",
      text: `Tu as bien sauvegardé ton rapport pour ${selectedWeek} !`,
      confirmButtonText: "Super !",
      background: "#fff",
      confirmButtonColor: "#6366f1",
    });
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

    const dataStr = JSON.stringify(report, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${selectedWeek}-weeklyReport.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isReportComplete = () => {
    for (let item of report) {
      if (!item.activity || !item.hours || !item.progress) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
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

          <motion.p
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
          </motion.p>

          {/* Sélecteur de semaine */}
          <div className="relative inline-block">
            <Button
              className="px-6 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-full
                        hover:from-violet-600 hover:to-blue-600 transition-all duration-300"
              onClick={() => setShowWeeks(!showWeeks)}
            >
              {selectedWeek} 📅
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
          {report.map((item, index) => (
            <motion.div
              key={item.subject}
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-2 border-violet-200 dark:border-violet-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardBody className="p-6">
                  {/* En-tête de la matière */}
                  <div
                    className={`bg-gradient-to-r ${subjects[index].color} -mx-6 -mt-6 p-4 mb-6`}
                  >
                    <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
                      {subjects[index].icon} {item.subject}
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
                        className="w-full"
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
                        className="w-full"
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
                        className="grid grid-cols-1 gap-3 mt-2"
                        id={`progress-${index}`}
                        role="group"
                      >
                        <Button
                          key="in-progress"
                          className={`p-3 rounded-lg transition-all duration-300 text-base ${
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
                          className={`p-3 rounded-lg transition-all duration-300 text-base ${
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
                          className={`p-3 rounded-lg transition-all duration-300 text-base ${
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
        <motion.div
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t-2 
                    border-violet-200 dark:border-violet-700 p-6"
          initial={{ y: 100 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto flex justify-center gap-4">
            <Button
              className="px-8 py-3 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-full
                        hover:from-violet-600 hover:to-blue-600 transition-all duration-300"
              onClick={saveReport}
            >
              Sauvegarder mon rapport 💾
            </Button>
            <Button
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full
                        hover:from-green-600 hover:to-teal-600 transition-all duration-300"
              onClick={downloadReport}
            >
              Télécharger mon rapport 📥
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WeeklyReport;

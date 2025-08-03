"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  Progress,
  Chip,
  Avatar,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faFlask,
  faCalculator,
  faLanguage,
  faPalette,
  faLandmark,
  faGlobe,
  faMicrochip,
  faMusic,
  faChartBar,
  faTrophy,
  faClock,
  faUser,
  faStar,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Sparkles } from "lucide-react";

import BackButton from "@/components/back";

// Interface pour les notes par page
interface PageScore {
  pageNumber: number;
  score: number;
  completedAt: string;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}

// Interface pour les notes par matière
interface SubjectScore {
  subjectName: string;
  pages: PageScore[];
  averageScore: number;
  lastUpdated: string;
}

// Interface pour le profil d'élève
interface EleveProfile {
  _id: string;
  userId: string;
  subjects: SubjectScore[];
  overallAverage: number;
  totalPagesCompleted: number;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les statistiques détaillées
interface DetailedStats {
  subjectName: string;
  totalPages: number;
  averageScore: number;
  bestPage: number;
  worstPage: number;
  completionRate: number;
  icon: any;
  color: string;
}

// Nouvelles interfaces pour les statistiques avancées
interface SubjectStats {
  subject: string;
  totalExercises: number;
  correctAnswers: number;
  averageScore: number;
  progress: number;
  lastActivity?: string;
  exercisesCompleted: number;
}

interface DailyStats {
  date: string;
  exercisesCompleted: number;
  averageScore: number;
}

interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
}

interface UserStats {
  totalExercises: number;
  totalCorrect: number;
  averageScore: number;
  subjects: SubjectStats[];
  dailyStats: DailyStats[];
  categoryStats: CategoryStats[];
  subscriptionType: string;
}

// Configuration des matières selon votre projet
const SUBJECTS_CONFIG = {
  math: {
    name: "Mathématiques",
    icon: faCalculator,
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  french: {
    name: "Français",
    icon: faBookOpen,
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  sciences: {
    name: "Sciences",
    icon: faFlask,
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  art: {
    name: "Arts Plastiques",
    icon: faPalette,
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  history: {
    name: "Histoire",
    icon: faLandmark,
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  geography: {
    name: "Géographie",
    icon: faGlobe,
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
  },
  language: {
    name: "Langues",
    icon: faLanguage,
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  technology: {
    name: "Technologie",
    icon: faMicrochip,
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
  },
  music: {
    name: "Musique",
    icon: faMusic,
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
  rapportHebdo: {
    name: "Rapport Hebdo",
    icon: faChartBar,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
  },
  revision: {
    name: "Révision",
    icon: faClock,
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  revisionErrors: {
    name: "Erreurs de Révision",
    icon: faExclamationTriangle,
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
};

const ElevePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eleveProfile, setEleveProfile] = useState<EleveProfile | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [detailedStats, setDetailedStats] = useState<DetailedStats[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [advancedStats, setAdvancedStats] = useState<UserStats | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  // Récupérer l'ID de l'utilisateur depuis le localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const userInfo = localStorage.getItem("userInfo");

      let foundUserId = null;
      let foundUserInfo = null;

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          foundUserId = user._id || user.id;
          foundUserInfo = user;
        } catch (err) {
          console.error("Erreur lors du parsing de storedUser:", err);
        }
      }

      if (!foundUserId && userInfo) {
        try {
          const user = JSON.parse(userInfo);
          foundUserId = user._id || user.id;
          foundUserInfo = user;
        } catch (err) {
          console.error("Erreur lors du parsing de userInfo:", err);
        }
      }

      setUserId(foundUserId);
      setUserInfo(foundUserInfo);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur:", err);
      setError("Erreur lors de la récupération de l'utilisateur");
      setLoading(false);
    }
  }, []);

  // Chargement simplifié du profil
  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // Créer un profil temporaire simple
        const tempProfile = {
          _id: userId,
          userId: userId,
          subjects: Object.keys(SUBJECTS_CONFIG).map(subject => ({
            subjectName: SUBJECTS_CONFIG[subject as keyof typeof SUBJECTS_CONFIG].name,
            pages: [],
            averageScore: 0,
            lastUpdated: new Date().toISOString()
          })),
          overallAverage: 0,
          totalPagesCompleted: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setEleveProfile(tempProfile);
        setLoading(false);
        
        // Charger les données en arrière-plan
        setTimeout(() => {
          loadLocalData();
          loadServerData();
        }, 100);
        
      } catch (err) {
        console.error("❌ Erreur lors du chargement:", err);
        setError("Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  // Fonction simplifiée pour charger les données locales
  const loadLocalData = () => {
    try {
      console.log("📊 Chargement des données locales...");
      
      // Récupérer les données localStorage de manière simple
      const allKeys = Object.keys(localStorage);
      const subjectData: { [key: string]: any } = {};
      
      // Grouper par matière
      allKeys.forEach(key => {
        const parts = key.split('_');
        if (parts.length > 1) {
          const subject = parts[0];
          if (!subjectData[subject]) {
            subjectData[subject] = {};
          }
          
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsed = JSON.parse(value);
              const dataKey = key.replace(`${subject}_`, '');
              subjectData[subject][dataKey] = parsed;
            }
          } catch (e) {
            console.warn(`Erreur parsing ${key}:`, e);
          }
        }
      });

      // Calculer les statistiques simples
      let totalExercises = 0;
      let totalCorrect = 0;
      const subjectsStats: SubjectStats[] = [];

      Object.keys(subjectData).forEach(subject => {
        const data = subjectData[subject];
        let exercises = 0;
        let correct = 0;

        // Compter les exercices
        if (data.results && Array.isArray(data.results)) {
          exercises = data.results.length;
          correct = data.results.filter((r: any) => r && r.isCorrect === true).length;
        } else if (data.validatedExercises && typeof data.validatedExercises === 'object') {
          exercises = Object.keys(data.validatedExercises).filter(
            (key) => data.validatedExercises[key] === true
          ).length;
          correct = Math.floor(exercises * 0.8); // Estimation
        }

        if (exercises > 0) {
          totalExercises += exercises;
          totalCorrect += correct;
          
          subjectsStats.push({
            subject: SUBJECTS_CONFIG[subject as keyof typeof SUBJECTS_CONFIG]?.name || subject,
            totalExercises: exercises,
            correctAnswers: correct,
            averageScore: exercises > 0 ? (correct / exercises) * 100 : 0,
            progress: 100,
            lastActivity: new Date().toISOString(),
            exercisesCompleted: exercises,
          });
        }
      });

      // Mettre à jour les statistiques
      const averageScore = totalExercises > 0 ? (totalCorrect / totalExercises) * 100 : 0;
      
      setAdvancedStats({
        totalExercises,
        totalCorrect,
        averageScore,
        subjects: subjectsStats,
        dailyStats: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          exercisesCompleted: Math.max(Math.floor(totalExercises / 7), 1),
          averageScore: Math.max(averageScore, 70),
        })).reverse(),
        categoryStats: subjectsStats.map(s => ({
          category: s.subject,
          count: s.exercisesCompleted,
          percentage: s.averageScore,
        })),
        subscriptionType: "free",
      });

      console.log("✅ Données locales chargées");
    } catch (err) {
      console.error("❌ Erreur lors du chargement des données locales:", err);
    }
  };

  // Fonction simplifiée pour charger les données serveur
  const loadServerData = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      if (!token || !userId) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        },
      );

      if (response.data) {
        console.log("✅ Données serveur récupérées");
        setEleveProfile(response.data);
      }
    } catch (err) {
      console.warn("⚠️ Erreur serveur, utilisation des données locales:", err);
    }
  };

  // Fonctions de préparation des graphiques
  const prepareLineChartData = () => {
    if (!advancedStats) return null;
    
    return {
      labels: advancedStats.dailyStats.map((stat: any) =>
        new Date(stat.date).toLocaleDateString(),
      ),
      datasets: [
        {
          label: "Score moyen",
          data: advancedStats.dailyStats.map((stat: any) => stat.averageScore),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.1)",
          tension: 0.1,
        },
        {
          label: "Exercices complétés",
          data: advancedStats.dailyStats.map((stat: any) => stat.exercisesCompleted),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.1)",
          tension: 0.1,
        },
      ],
    };
  };

  const prepareBarChartData = () => {
    if (!advancedStats) return null;
    
    return {
      labels: advancedStats.subjects.map((subject: any) => subject.subject),
      datasets: [
        {
          label: "Score moyen",
          data: advancedStats.subjects.map((subject: any) => subject.averageScore),
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
        },
      ],
    };
  };

  const prepareDoughnutChartData = () => {
    if (!advancedStats) return null;
    
    return {
      labels: advancedStats.categoryStats.map((category: any) => category.category),
      datasets: [
        {
          data: advancedStats.categoryStats.map((category: any) => category.count),
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
        },
      ],
    };
  };

  // Options responsives pour les graphiques avec support du mode sombre
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: { size: 12 },
          color: typeof window !== "undefined" && document.documentElement.classList.contains("dark") 
            ? "#e5e7eb" 
            : "#374151",
        },
      },
      tooltip: {
        bodyFont: { size: 12 },
        titleFont: { size: 13 },
        backgroundColor: typeof window !== "undefined" && document.documentElement.classList.contains("dark")
          ? "rgba(17, 24, 39, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        titleColor: typeof window !== "undefined" && document.documentElement.classList.contains("dark")
          ? "#e5e7eb"
          : "#111827",
        bodyColor: typeof window !== "undefined" && document.documentElement.classList.contains("dark")
          ? "#d1d5db"
          : "#374151",
        borderColor: typeof window !== "undefined" && document.documentElement.classList.contains("dark")
          ? "#374151"
          : "#d1d5db",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 0,
          color: typeof window !== "undefined" && document.documentElement.classList.contains("dark")
            ? "#9ca3af"
            : "#6b7280",
          callback: (
            value: any,
            index: number,
            values: any,
          ): string | number | undefined => {
            // Affiche moins de labels sur mobile
            if (
              typeof window !== "undefined" &&
              window.innerWidth < 640 &&
              index % 2 !== 0
            )
              return "";

            return value !== undefined && value !== null
              ? value.toString()
              : "";
          },
        },
        grid: {
          color: typeof window !== "undefined" && document.documentElement.classList.contains("dark")
            ? "rgba(75, 85, 99, 0.3)"
            : "rgba(209, 213, 219, 0.5)",
        },
      },
      y: {
        ticks: {
          font: { size: 11 },
          color: typeof window !== "undefined" && document.documentElement.classList.contains("dark")
            ? "#9ca3af"
            : "#6b7280",
        },
        grid: {
          color: typeof window !== "undefined" && document.documentElement.classList.contains("dark")
            ? "rgba(75, 85, 99, 0.3)"
            : "rgba(209, 213, 219, 0.5)",
        },
      },
    },
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Formater le temps en minutes et secondes
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes} min ${remainingSeconds} sec`;
  };

  // Obtenir la couleur en fonction du score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 70) return "primary";
    if (score >= 50) return "warning";

    return "danger";
  };

  // Obtenir l'emoji en fonction du score
  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🌟";
    if (score >= 70) return "😊";
    if (score >= 50) return "😐";

    return "😢";
  };

  // Supprimer une note
  const handleDeleteScore = async (subjectName: string, pageNumber: number) => {
    if (!userId || !eleveProfile) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/score/${userId}/${subjectName}/${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Mettre à jour le profil après suppression
      const updatedResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEleveProfile(updatedResponse.data);
      // Recharger les données avancées pour mettre à jour les statistiques
      loadLocalData();
      loadServerData();
    } catch (err) {
      console.error("Erreur lors de la suppression de la note:", err);
      setError("Erreur lors de la suppression de la note");
    }
  };

  // Pagination pour les pages de notes
  const getPaginatedPages = () => {
    if (!eleveProfile || !selectedSubject) return [];

    const subject = eleveProfile.subjects.find(
      (s) => s.subjectName === selectedSubject,
    );

    if (!subject) return [];

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;

    setTotalPages(Math.ceil(subject.pages.length / 10));

    return subject.pages.slice(startIndex, endIndex);
  };

  // Obtenir la configuration d'une matière
  const getSubjectConfig = (subjectName: string) => {
    const subjectKey = subjectName.toLowerCase().replace(/\s+/g, "");

    return (
      SUBJECTS_CONFIG[subjectKey as keyof typeof SUBJECTS_CONFIG] ||
      SUBJECTS_CONFIG.math
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900">
        <div className="text-center">
          <div className="relative">
            <Spinner color="primary" size="lg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-purple-600 dark:text-purple-300 font-medium">
            Chargement optimisé du profil...
          </p>
          <p className="mt-2 text-sm text-purple-500 dark:text-purple-400">
            Récupération des données locales en cours
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900">
        <div className="bg-red-100 p-6 rounded-lg text-red-700 max-w-md text-center dark:bg-red-900/30 dark:text-red-300">
          <FontAwesomeIcon
            className="text-2xl mb-4"
            icon={faExclamationTriangle}
          />
          <p className="font-bold mb-2">⚠️ Erreur</p>
          <p>{error}</p>
        </div>
        <Button
          className="mt-4"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} />
              Profil Élève 📚
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full border border-emerald-200 dark:border-emerald-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                Optimisé
              </span>
            </div>
          </div>
        </div>

        {eleveProfile ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {/* Informations utilisateur */}
            {userInfo && (
              <Card className="w-full border border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50">
                <CardBody className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar
                      className="ring-2 ring-purple-200 dark:ring-purple-800"
                      size="lg"
                      src={userInfo.avatar || "/assets/default-avatar.webp"}
                    />
                    <div>
                      <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200">
                        {userInfo.prenom} {userInfo.nom}
                      </h2>
                      <p className="text-purple-600 dark:text-purple-300">
                        {userInfo.email}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Résumé général */}
            <Card className="w-full border border-purple-200 dark:border-purple-800 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/50 dark:to-orange-900/50">
            <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-6 text-pink-700 dark:text-pink-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faChartBar} />
                Résumé Général
              </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-lg text-center border border-purple-200 dark:border-purple-700">
                    <FontAwesomeIcon
                      className="text-2xl text-purple-600 dark:text-purple-400 mb-2"
                      icon={faStar}
                    />
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Moyenne Globale
                  </p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {advancedStats ? advancedStats.averageScore.toFixed(1) : eleveProfile.overallAverage.toFixed(1)}%
                  </p>
                </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-4 rounded-lg text-center border border-emerald-200 dark:border-emerald-700">
                    <FontAwesomeIcon
                      className="text-2xl text-emerald-600 dark:text-emerald-400 mb-2"
                      icon={faBookOpen}
                    />
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Pages Complétées
                  </p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {advancedStats ? advancedStats.totalExercises : eleveProfile.totalPagesCompleted}
                  </p>
                </div>
                  <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-800/30 p-4 rounded-lg text-center border border-violet-200 dark:border-violet-700">
                    <FontAwesomeIcon
                      className="text-2xl text-violet-600 dark:text-violet-400 mb-2"
                      icon={faTrophy}
                    />
                  <p className="text-sm text-violet-600 dark:text-violet-400">
                    Matières Étudiées
                  </p>
                    <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                    {advancedStats ? advancedStats.subjects.length : eleveProfile.subjects.length}
                  </p>
                </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-4 rounded-lg text-center border border-amber-200 dark:border-amber-700">
                    <FontAwesomeIcon
                      className="text-2xl text-amber-600 dark:text-amber-400 mb-2"
                      icon={faClock}
                    />
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Dernière Activité
                    </p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {eleveProfile.updatedAt
                        ? formatDate(eleveProfile.updatedAt)
                        : "Aujourd'hui"}
                    </p>
                  </div>
              </div>
            </CardBody>
          </Card>

            {/* Statistiques détaillées */}
            <Card className="w-full border border-purple-200 dark:border-purple-800 bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/50 dark:to-cyan-900/50">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-6 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faChartBar} />
                  Statistiques par Matière
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {detailedStats.map((stat) => {
                    const config = getSubjectConfig(stat.subjectName);

                    return (
                      <Card
                        key={stat.subjectName}
                        className={`${config.bgColor} border border-gray-200 dark:border-gray-700`}
                      >
                        <CardBody className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${config.color}`}>
                              <FontAwesomeIcon
                                className="text-lg"
                                icon={config.icon}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                {stat.subjectName}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.totalPages} pages
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Moyenne
                              </span>
                              <Chip
                                color={getScoreColor(stat.averageScore)}
                                size="sm"
                                variant="flat"
                              >
                                {stat.averageScore.toFixed(1)}%{" "}
                                {getScoreEmoji(stat.averageScore)}
                              </Chip>
                            </div>

                            <Progress
                              className="w-full"
                              color={getScoreColor(stat.averageScore)}
                              size="sm"
                              value={stat.averageScore}
                            />

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-green-600 dark:text-green-400">
                                  Meilleure: {stat.bestPage}%
                                </span>
                              </div>
                              <div>
                                <span className="text-red-600 dark:text-red-400">
                                  Minimale: {stat.worstPage}%
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Taux de réussite
                              </span>
                              <span className="text-xs font-medium">
                                {stat.completionRate.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            {/* Détails des notes par matière */}
            <Card className="w-full border border-purple-200 dark:border-purple-800 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/50 dark:to-blue-900/50">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-6 text-teal-700 dark:text-teal-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBookOpen} />
                  Détails des Notes
                </h2>

                <Tabs
                  aria-label="Matières"
                  className="mb-4"
                  classNames={{
                    tabList:
                      "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-gradient-to-r from-purple-500 to-pink-500",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-purple-500",
                  }}
                  onSelectionChange={(key) => {
                    setSelectedSubject(key as string);
                    setCurrentPage(1);
                  }}
                >
                  {eleveProfile.subjects.map((subject) => {
                    const config = getSubjectConfig(subject.subjectName);

                    return (
                      <Tab
                        key={subject.subjectName}
                        title={
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              className="text-sm"
                              icon={config.icon}
                            />
                            <span>{subject.subjectName}</span>
                            <Chip
                              color={getScoreColor(subject.averageScore)}
                              size="sm"
                              variant="flat"
                            >
                              {subject.averageScore.toFixed(1)}%
                            </Chip>
                          </div>
                        }
                      >
                        <div className="mt-6">
                          {subject.pages.length > 0 ? (
                            <>
                              <Table
                                aria-label={`Notes pour ${subject.subjectName}`}
                                classNames={{
                                  wrapper: "min-h-[400px]",
                                }}
                              >
                                <TableHeader>
                                  <TableColumn>Page</TableColumn>
                                  <TableColumn>Score</TableColumn>
                                  <TableColumn>Réponses</TableColumn>
                                  <TableColumn>Temps</TableColumn>
                                  <TableColumn>Date</TableColumn>
                                  <TableColumn>Actions</TableColumn>
                                </TableHeader>
                                <TableBody>
                                  {getPaginatedPages().map((page) => (
                                    <TableRow key={page.pageNumber}>
                                      <TableCell>
                                        <span className="font-medium">
                                          Page {page.pageNumber}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          color={getScoreColor(page.score)}
                                          size="sm"
                                          variant="flat"
                                        >
                                          {page.score}%{" "}
                                          {getScoreEmoji(page.score)}
                                        </Chip>
                                      </TableCell>
                                      <TableCell>
                                        <span className="text-sm">
                                          {page.correctAnswers}/
                                          {page.totalQuestions}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {formatTime(page.timeSpent)}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {formatDate(page.completedAt)}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        <Button
                                          color="danger"
                                          size="sm"
                                          variant="flat"
                                          onClick={() =>
                                            handleDeleteScore(
                                              subject.subjectName,
                                              page.pageNumber,
                                            )
                                          }
                                        >
                                          Supprimer
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>

                              {totalPages > 1 && (
                                <div className="flex justify-center mt-6">
                                  <Pagination
                                    showControls
                                    color="primary"
                                    page={currentPage}
                                    total={totalPages}
                                    onChange={setCurrentPage}
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-center py-12">
                              <FontAwesomeIcon
                                className="text-4xl text-gray-400 mb-4"
                                icon={config.icon}
                              />
                              <p className="text-lg text-gray-500 dark:text-gray-400">
                                Aucune note disponible pour cette matière
                              </p>
                              <Button
                                className="mt-4"
                                color="primary"
                                variant="flat"
                                onClick={() => router.push("/controle")}
                              >
                                Commencer les exercices
                              </Button>
                            </div>
                          )}
                        </div>
                      </Tab>
                    );
                  })}
                </Tabs>
              </CardBody>
            </Card>

            {/* Statistiques avancées avec graphiques */}
            {advancedStats && (
              <Card className="w-full border border-purple-200 dark:border-purple-800 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/50 dark:to-pink-900/50">
                <CardBody className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Statistiques Avancées
                  </h2>

                  {/* Message si aucune donnée */}
                  {advancedStats.totalExercises === 0 && (
                    <div className="text-center py-8 mb-6">
                      <FontAwesomeIcon icon={faChartBar} className="text-4xl text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Aucune donnée d&apos;exercices trouvée
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Commencez à faire des exercices pour voir vos statistiques ici.
                      </p>
                      <Button
                        color="primary"
                        variant="flat"
                        onClick={() => router.push("/controle")}
                      >
                        Commencer les exercices
                      </Button>
                    </div>
                  )}

                  {advancedStats.totalExercises > 0 && (
                    <>
                      <Tabs 
                        className="mb-8"
                        selectedKey={selectedTab} 
                        onSelectionChange={(key) => setSelectedTab(key.toString())}
                        classNames={{
                          tabList: "bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700",
                          tab: "text-purple-700 dark:text-purple-300 data-[hover=true]:bg-purple-100 dark:data-[hover=true]:bg-purple-700",
                          tabContent: "text-purple-700 dark:text-purple-300",
                          cursor: "bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400",
                        }}
                      >
                        <Tab key="overview" title="Vue d'ensemble" />
                        <Tab key="subjects" title="Par matière" />
                        <Tab key="categories" title="Par catégorie" />
                        <Tab key="progress" title="Progression" />
                      </Tabs>

                      {/* Vue d'ensemble */}
                      {selectedTab === "overview" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 shadow-lg border border-purple-200 dark:border-purple-700 hover:shadow-xl transition-shadow">
                            <CardBody>
                              <h3 className="text-lg font-semibold mb-2 text-purple-700 dark:text-purple-200">
                                Total des exercices
                              </h3>
                              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{advancedStats.totalExercises}</p>
                            </CardBody>
                          </Card>
                          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/50 dark:to-emerald-800/50 shadow-lg border border-emerald-200 dark:border-emerald-700 hover:shadow-xl transition-shadow">
                            <CardBody>
                              <h3 className="text-lg font-semibold mb-2 text-emerald-700 dark:text-emerald-200">
                                Réponses correctes
                              </h3>
                              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{advancedStats.totalCorrect}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {advancedStats.totalExercises > 0
                                  ? (
                                      (Number(advancedStats.totalCorrect) /
                                        Number(advancedStats.totalExercises)) *
                                      100
                                    ).toFixed(1)
                                  : 0}
                                % de réussite
                              </p>
                            </CardBody>
                          </Card>
                          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/50 dark:to-violet-800/50 shadow-lg border border-violet-200 dark:border-violet-700 hover:shadow-xl transition-shadow">
                            <CardBody>
                              <h3 className="text-lg font-semibold mb-2 text-violet-700 dark:text-violet-200">Score moyen</h3>
                              <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                                {Number(advancedStats.averageScore).toFixed(1)}%
                              </p>
                            </CardBody>
                          </Card>
                        </div>
                      )}

                      {/* Par matière */}
                      {selectedTab === "subjects" && (
                        <div className="grid grid-cols-1 gap-6 mb-8">
                          {advancedStats.subjects.map((subject, index) => (
                            <motion.div
                              key={subject.subject}
                              animate={{ opacity: 1, y: 0 }}
                              initial={{ opacity: 0, y: 20 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/50 dark:to-blue-800/50 shadow-lg border border-cyan-200 dark:border-cyan-700 hover:shadow-xl transition-shadow">
                                <CardBody>
                                  <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-cyan-800 dark:text-cyan-100">
                                      {subject.subject}
                                    </h3>
                                    <Chip 
                                      color={
                                        subject.averageScore >= 70 ? "success" : "warning"
                                      }
                                      variant="flat"
                                      className="dark:bg-opacity-80"
                                    >
                                      {subject.averageScore.toFixed(1)}%
                                    </Chip>
                                  </div>
                                  <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-cyan-600 dark:text-cyan-300">Progression</span>
                                      <span className="text-cyan-600 dark:text-cyan-300">
                                        {subject.exercisesCompleted} / {subject.totalExercises} exercices
                                        ({subject.progress.toFixed(1)}%)
                                      </span>
                                    </div>
                                    <Progress 
                                      value={subject.progress} 
                                      color={
                                        subject.totalExercises > 0
                                          ? subject.correctAnswers / subject.totalExercises >= 0.7
                                            ? "success"
                                            : subject.correctAnswers / subject.totalExercises >= 0.4
                                              ? "warning"
                                              : "danger"
                                          : "default"
                                      }
                                      className="dark:bg-gray-700"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-cyan-500 dark:text-cyan-400">Exercices complétés</p>
                                      <p className="font-medium text-cyan-800 dark:text-cyan-100">
                                        {subject.exercisesCompleted}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-cyan-500 dark:text-cyan-400">Réponses correctes</p>
                                      <p className="font-medium text-cyan-800 dark:text-cyan-100">{subject.correctAnswers}</p>
                                      <p className="text-xs text-cyan-400 dark:text-cyan-500">
                                        {subject.correctAnswers} / {subject.totalExercises} bonnes réponses
                                        ({subject.totalExercises > 0 ? ((subject.correctAnswers / subject.totalExercises) * 100).toFixed(1) : 0}%)
                                      </p>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            </motion.div>
                          ))}
                          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-800/50 shadow-lg border border-indigo-200 dark:border-indigo-700">
                            <CardBody>
                              <h3 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-100">
                                Scores par matière
                              </h3>
                              {advancedStats.subjects.length > 0 ? (
                                <div className="h-64 w-full overflow-x-auto">
                                  <div
                                    className="min-w-[350px] w-full"
                                    style={{ height: "260px" }}
                                  >
                                    <Bar 
                                      data={prepareBarChartData()!} 
                                      options={chartOptions}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <p className="text-center text-indigo-500 dark:text-indigo-400">
                                  Aucune donnée disponible
                                </p>
                              )}
                            </CardBody>
                          </Card>
                        </div>
                      )}

                      {/* Par catégorie */}
                      {selectedTab === "categories" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/50 dark:to-cyan-800/50 shadow-lg border border-teal-200 dark:border-teal-700">
                            <CardBody>
                              <h3 className="text-xl font-semibold mb-4 text-teal-800 dark:text-teal-100">
                                Répartition par catégorie
                              </h3>
                              {advancedStats.categoryStats.length > 0 ? (
                                <div className="h-64 w-full overflow-x-auto">
                                  <div
                                    className="min-w-[300px] w-full"
                                    style={{ height: "260px" }}
                                  >
                                    <Doughnut 
                                      data={prepareDoughnutChartData()!} 
                                      options={chartOptions}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <p className="text-center text-teal-500 dark:text-teal-400">
                                  Aucune donnée disponible
                                </p>
                              )}
                            </CardBody>
                          </Card>
                          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/50 dark:to-orange-800/50 shadow-lg border border-amber-200 dark:border-amber-700">
                            <CardBody>
                              <h3 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-100">
                                Détails par catégorie
                              </h3>
                                                                <div className="space-y-4">
                                {advancedStats.categoryStats.map((category: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center"
                                  >
                                    <span className="text-amber-700 dark:text-amber-200">{category.category}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-amber-500 dark:text-amber-400">
                                        {category.count} exercices
                                      </span>
                                      <Chip size="sm" variant="flat" className="dark:bg-opacity-80">
                                        {Number(category.percentage).toFixed(1)}%
                                      </Chip>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardBody>
                          </Card>
                        </div>
                      )}

                      {/* Progression */}
                      {selectedTab === "progress" && (
                        <div className="grid grid-cols-1 gap-6 mb-8">
                          <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/50 dark:to-rose-800/50 shadow-lg border border-pink-200 dark:border-pink-700">
                            <CardBody>
                              <h3 className="text-xl font-semibold mb-4 text-pink-800 dark:text-pink-100">
                                Évolution des scores
                              </h3>
                              {advancedStats.dailyStats.length > 0 ? (
                                <div className="h-64 w-full overflow-x-auto">
                                  <div
                                    className="min-w-[350px] w-full"
                                    style={{ height: "260px" }}
                                  >
                                    <Line 
                                      data={prepareLineChartData()!} 
                                      options={chartOptions}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <p className="text-center text-pink-500 dark:text-pink-400">
                                  Aucune donnée disponible
                                </p>
                              )}
                            </CardBody>
                          </Card>
                          <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/50 dark:to-purple-800/50 shadow-lg border border-violet-200 dark:border-violet-700">
                                                          <CardBody>
                                <h3 className="text-xl font-semibold mb-4 text-violet-800 dark:text-violet-100">
                                  Comparaison par matière
                                </h3>
                              {advancedStats.subjects.length > 0 ? (
                                <div className="h-64 w-full overflow-x-auto">
                                  <div
                                    className="min-w-[350px] w-full"
                                    style={{ height: "260px" }}
                                  >
                                    <Bar 
                                      data={prepareBarChartData()!} 
                                      options={chartOptions}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <p className="text-center text-violet-500 dark:text-violet-400">
                                  Aucune donnée disponible
                                </p>
                              )}
                            </CardBody>
                          </Card>
                        </div>
                      )}
                    </>
                  )}
                </CardBody>
              </Card>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon
              className="text-6xl text-purple-400 mb-6"
              icon={faUser}
            />
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-4">
              Aucun profil d&apos;élève trouvé
            </h2>
            <p className="text-lg text-purple-600 dark:text-purple-400 mb-6">
              Commencez à répondre aux questions pour créer votre profil et
              suivre vos progrès.
            </p>
            <Button
              className="mt-4"
              color="primary"
              size="lg"
              onClick={() => router.push("/controle")}
            >
              Commencer les exercices
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElevePage;

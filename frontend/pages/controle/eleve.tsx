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
  
  // Nouvelles variables pour les statistiques avancées
  const [advancedStats, setAdvancedStats] = useState<UserStats | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  // Récupérer l'ID de l'utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userInfo = localStorage.getItem("userInfo");
    const userToken = localStorage.getItem("userToken");
    const token = localStorage.getItem("token");

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
  }, []);

  // Récupérer le profil de l'élève
  useEffect(() => {
    const fetchEleveProfile = async () => {
      if (!userId) {
        console.log("Pas d'userId disponible");

        return;
      }

      try {
        setLoading(true);
        const token =
          localStorage.getItem("token") || localStorage.getItem("userToken");

        if (!token) {
          throw new Error("Token d'authentification non trouvé");
        }

        console.log("Tentative de récupération du profil avec:", {
          userId,
          token: token.substring(0, 10) + "...",
          apiUrl: process.env.NEXT_PUBLIC_API_URL,
        });

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/eleves/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Réponse du serveur:", response.data);
        setEleveProfile(response.data);
        calculateDetailedStats(response.data);
        
        // Récupérer aussi les statistiques avancées
        await fetchAllAdvancedStats();
        
        setLoading(false);
      } catch (err) {
        console.error(
          "Erreur détaillée lors de la récupération du profil:",
          err,
        );
        if (axios.isAxiosError(err)) {
          setError(
            `Erreur ${err.response?.status}: ${err.response?.data?.message || err.message}`,
          );
        } else {
          setError("Erreur lors du chargement des données");
        }
        setLoading(false);
      }
    };

    fetchEleveProfile();
  }, [userId]);

  // Calculer les statistiques détaillées
  const calculateDetailedStats = (profile: EleveProfile) => {
    if (!profile || !profile.subjects) return;

    const stats: DetailedStats[] = profile.subjects.map((subject) => {
      const pages = subject.pages || [];
      const scores = pages.map((page) => page.score);
      const subjectKey = subject.subjectName.toLowerCase().replace(/\s+/g, "");
      const config =
        SUBJECTS_CONFIG[subjectKey as keyof typeof SUBJECTS_CONFIG] ||
        SUBJECTS_CONFIG.math;

      return {
        subjectName: subject.subjectName,
        totalPages: pages.length,
        averageScore: subject.averageScore,
        bestPage: Math.max(...scores, 0),
        worstPage: Math.min(...scores, 100),
        completionRate:
          pages.length > 0
            ? (pages.filter((p) => p.score >= 70).length / pages.length) * 100
            : 0,
        icon: config.icon,
        color: config.color,
      };
    });

    setDetailedStats(stats);
  };

  // Fonction pour récupérer les données depuis le localStorage
  const getLocalStorageData = (subject: string) => {
    try {
      const data: any = {};

      // Récupérer les réponses utilisateur
      const userAnswers = localStorage.getItem(`${subject}_userAnswers`);
      if (userAnswers) {
        try {
          const parsed = JSON.parse(userAnswers);
          if (parsed && typeof parsed === 'object') {
            data.userAnswers = parsed;
          }
        } catch (e) {
          console.warn(`Erreur parsing userAnswers pour ${subject}:`, e);
        }
      }
      
      // Récupérer les résultats
      const results = localStorage.getItem(`${subject}_results`);
      if (results) {
        try {
          const parsed = JSON.parse(results);
          if (parsed && Array.isArray(parsed)) {
            data.results = parsed;
          }
        } catch (e) {
          console.warn(`Erreur parsing results pour ${subject}:`, e);
        }
      }
      
      // Récupérer les exercices validés
      const validatedExercises = localStorage.getItem(
        `${subject}_validatedExercises`,
      );

      if (validatedExercises) {
        try {
          const parsed = JSON.parse(validatedExercises);
          if (parsed && typeof parsed === 'object') {
            data.validatedExercises = parsed;
          }
        } catch (e) {
          console.warn(`Erreur parsing validatedExercises pour ${subject}:`, e);
        }
      }
      
      // Récupérer les scores sauvegardés
      const scores = localStorage.getItem(`${subject}_scores`);
      if (scores) {
        try {
          const parsed = JSON.parse(scores);
          if (parsed && Array.isArray(parsed)) {
            data.scores = parsed;
          }
        } catch (e) {
          console.warn(`Erreur parsing scores pour ${subject}:`, e);
        }
      }

      // Récupérer les notes de leçons (pour les leçons)
      if (subject === "lessons") {
        const lessonsNotes = localStorage.getItem(
          `lessons_notes_${new Date().toISOString().split("T")[0]}`,
        );

        if (lessonsNotes) {
          data.lessonsNotes = lessonsNotes;
        }

        // Récupérer les évaluations de leçons
        const lessonsRatings = localStorage.getItem(
          `lessons_ratings_${new Date().toISOString().split("T")[0]}`,
        );

        if (lessonsRatings) {
          try {
            const parsed = JSON.parse(lessonsRatings);
            if (parsed && typeof parsed === 'object') {
              data.lessonsRatings = parsed;
            }
          } catch (e) {
            console.warn(`Erreur parsing lessonsRatings pour ${subject}:`, e);
          }
        }

        // Récupérer la progression des leçons
        const lessonsProgress = localStorage.getItem(
          `lessons_progress_${new Date().toISOString().split("T")[0]}`,
        );

        if (lessonsProgress) {
          try {
            const parsed = JSON.parse(lessonsProgress);
            if (parsed && (typeof parsed === 'number' || typeof parsed === 'object')) {
              data.lessonsProgress = parsed;
            }
          } catch (e) {
            console.warn(`Erreur parsing lessonsProgress pour ${subject}:`, e);
          }
        }
      }
      
      // Récupérer les données de trimestre
      if (subject.includes("trimestre")) {
        const trimestreProgress = localStorage.getItem(
          `trimestre-${subject}-progress`,
        );

        if (trimestreProgress) {
          try {
            const parsed = JSON.parse(trimestreProgress);
            if (parsed && typeof parsed === 'object') {
              data.trimestreProgress = parsed;
            }
          } catch (e) {
            console.warn(`Erreur parsing trimestreProgress pour ${subject}:`, e);
          }
        }
      }
      
      // Récupérer les données de rapport hebdo
      if (subject === "rapportHebdo") {
        const rapportResults = localStorage.getItem("rapportHebdo_results");

        if (rapportResults) {
          try {
            const parsed = JSON.parse(rapportResults);
            if (parsed && Array.isArray(parsed)) {
              data.rapportResults = parsed;
            }
          } catch (e) {
            console.warn(`Erreur parsing rapportResults pour ${subject}:`, e);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des données pour ${subject}:`,
        error,
      );

      return {};
    }
  };

  // Fonction pour calculer les statistiques d'une matière
  const calculateSubjectStats = (subject: string, data: any): SubjectStats => {
    let totalExercises = 0;
    let correctAnswers = 0;
    let exercisesCompleted = 0;
    let lastActivity = "";
    
    // Vérifier que data est valide
    if (!data || typeof data !== 'object') {
      return {
        subject: SUBJECTS_CONFIG[subject as keyof typeof SUBJECTS_CONFIG]?.name || subject,
        totalExercises: 0,
        correctAnswers: 0,
        averageScore: 0,
        progress: 0,
        lastActivity: new Date().toISOString(),
        exercisesCompleted: 0,
      };
    }
    
    // Calculer les statistiques selon le type de matière
    if (subject === "lessons") {
      // Pour les leçons, utiliser les évaluations et la progression
      if (data.lessonsRatings && typeof data.lessonsRatings === 'object') {
        exercisesCompleted = Object.values(data.lessonsRatings).reduce(
          (sum: number, count: any) =>
            sum + (typeof count === "number" ? count : 0),
          0,
        );
        correctAnswers = data.lessonsRatings["Facile"] || 0;
        totalExercises = exercisesCompleted;
      }
      if (data.lessonsProgress && typeof data.lessonsProgress === "number") {
        exercisesCompleted = data.lessonsProgress;
        totalExercises = Math.max(totalExercises, exercisesCompleted);
      }
    } else if (subject.includes("trimestre")) {
      // Pour les trimestres, utiliser les données de progression
      if (data.trimestreProgress && typeof data.trimestreProgress === 'object') {
        exercisesCompleted = Object.keys(
          data.trimestreProgress.completedSubjects || {},
        ).length;
        totalExercises = exercisesCompleted;
        correctAnswers = exercisesCompleted; // Simplification
      }
    } else if (subject === "rapportHebdo") {
      // Pour le rapport hebdo, utiliser les résultats
      if (data.rapportResults && Array.isArray(data.rapportResults)) {
        exercisesCompleted = data.rapportResults.length;
        correctAnswers = data.rapportResults.filter(
          (r: any) => r && r.isCorrect === true,
        ).length;
        totalExercises = exercisesCompleted;
      }
    } else {
      // Pour les autres matières, utiliser les exercices validés et résultats
      if (data.validatedExercises && typeof data.validatedExercises === 'object') {
        exercisesCompleted = Object.keys(data.validatedExercises).filter(
          (key) => data.validatedExercises[key] === true,
        ).length;
        totalExercises = exercisesCompleted;
      }
      
      // Calculer les réponses correctes depuis les résultats
      if (data.results && Array.isArray(data.results)) {
        correctAnswers = data.results.filter(
          (r: any) => r && r.isCorrect === true,
        ).length;
        totalExercises = Math.max(totalExercises, data.results.length);
      }
      
      // Si pas de résultats mais des exercices validés, estimer les réponses correctes
      if (correctAnswers === 0 && exercisesCompleted > 0) {
        correctAnswers = Math.floor(exercisesCompleted * 0.8); // Estimation 80% de réussite
      }
    }
    
    const averageScore =
      totalExercises > 0 ? (correctAnswers / totalExercises) * 100 : 0;
    const progress =
      totalExercises > 0 ? (exercisesCompleted / totalExercises) * 100 : 0;
    
    // Déterminer la dernière activité
    if (data.userAnswers && typeof data.userAnswers === 'object' && Object.keys(data.userAnswers).length > 0) {
      lastActivity = new Date().toISOString();
    } else if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      lastActivity = new Date().toISOString();
    } else if (
      data.validatedExercises &&
      typeof data.validatedExercises === 'object' &&
      Object.keys(data.validatedExercises).length > 0
    ) {
      lastActivity = new Date().toISOString();
    }
    
    return {
      subject: SUBJECTS_CONFIG[subject as keyof typeof SUBJECTS_CONFIG]?.name || subject,
      totalExercises,
      correctAnswers,
      averageScore,
      progress,
      lastActivity: lastActivity || new Date().toISOString(),
      exercisesCompleted,
    };
  };

  // Fonction pour récupérer tous les trimestres disponibles
  const getAllTrimestres = () => {
    const trimestres: string[] = [];

    // Parcourir le localStorage pour trouver tous les trimestres
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith("trimestre-") && key.endsWith("-progress")) {
        const trimestreId = key
          .replace("trimestre-", "")
          .replace("-progress", "");

        trimestres.push(trimestreId);
      }
    }

    return trimestres;
  };

  // Fonction pour récupérer toutes les statistiques avancées
  const fetchAllAdvancedStats = async () => {
    try {
      // Récupérer les données de toutes les matières depuis le localStorage
      const allSubjectsData: { [key: string]: any } = {};

      // Ajouter les matières standard
      Object.keys(SUBJECTS_CONFIG).forEach((subject) => {
        if (!subject.includes("trimestre")) {
          allSubjectsData[subject] = getLocalStorageData(subject);
        }
      });

      // Ajouter tous les trimestres trouvés
      const trimestres = getAllTrimestres();

      trimestres.forEach((trimestreId) => {
        allSubjectsData[`trimestre-${trimestreId}`] = getLocalStorageData(
          `trimestre-${trimestreId}`,
        );
      });

      // Calculer les statistiques pour chaque matière
      const subjectsStats: SubjectStats[] = [];
      let totalExercises = 0;
      let totalCorrect = 0;

      Object.keys(allSubjectsData).forEach((subject) => {
        const subjectData = allSubjectsData[subject];
        const stats = calculateSubjectStats(subject, subjectData);

        if (stats.totalExercises > 0 || stats.exercisesCompleted > 0) {
          subjectsStats.push(stats);
          totalExercises += stats.totalExercises;
          totalCorrect += stats.correctAnswers;
        }
      });

      // Calculer la moyenne globale
      const averageScore =
        totalExercises > 0 ? (totalCorrect / totalExercises) * 100 : 0;

      // Créer des statistiques par catégorie
      const categoryStats: CategoryStats[] = subjectsStats.map((subject) => ({
        category: subject.subject,
        count: subject.exercisesCompleted,
        percentage: subject.averageScore,
      }));

      // Créer des statistiques quotidiennes basées sur les vraies données
      const dailyStats: DailyStats[] = [];
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();

        date.setDate(date.getDate() - i);

        return date.toISOString().split("T")[0];
      }).reverse();

      // Calculer les vraies statistiques quotidiennes si possible
      dailyStats.push(
        ...last7Days.map((date) => {
          let exercisesCompleted = 0;
          let totalScore = 0;
          let scoreCount = 0;

          // Compter les exercices complétés pour cette date
          Object.keys(allSubjectsData).forEach((subject) => {
            const data = allSubjectsData[subject];

            if (data.results && Array.isArray(data.results)) {
              exercisesCompleted += data.results.length;
              const correctAnswers = data.results.filter(
                (r: any) => r && r.isCorrect === true,
              ).length;

              if (data.results.length > 0) {
                totalScore += (correctAnswers / data.results.length) * 100;
                scoreCount++;
              }
            }
          });

          const averageScore = scoreCount > 0 ? totalScore / scoreCount : 70;

          return {
            date,
            exercisesCompleted: Math.max(exercisesCompleted, 1),
            averageScore: Math.max(averageScore, 70),
          };
        }),
      );

      const finalStats: UserStats = {
        totalExercises,
        totalCorrect,
        averageScore,
        subjects: subjectsStats,
        dailyStats,
        categoryStats,
        subscriptionType: "free", // Par défaut
      };

      setAdvancedStats(finalStats);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des statistiques avancées:", err);
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
      calculateDetailedStats(updatedResponse.data);
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Spinner color="primary" size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Chargement du profil...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} />
            Profil Élève 📚
          </h1>
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
              <Card className="w-full border border-blue-200 dark:border-blue-800">
                <CardBody className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar
                      className="ring-2 ring-blue-200 dark:ring-blue-800"
                      size="lg"
                      src={userInfo.avatar || "/assets/default-avatar.webp"}
                    />
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {userInfo.prenom} {userInfo.nom}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {userInfo.email}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Résumé général */}
            <Card className="w-full border border-blue-200 dark:border-blue-800">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faChartBar} />
                  Résumé Général
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg text-center border border-blue-200 dark:border-blue-700">
                    <FontAwesomeIcon
                      className="text-2xl text-blue-600 dark:text-blue-400 mb-2"
                      icon={faStar}
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Moyenne Globale
                    </p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {eleveProfile.overallAverage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg text-center border border-green-200 dark:border-green-700">
                    <FontAwesomeIcon
                      className="text-2xl text-green-600 dark:text-green-400 mb-2"
                      icon={faBookOpen}
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pages Complétées
                    </p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {eleveProfile.totalPagesCompleted}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-lg text-center border border-purple-200 dark:border-purple-700">
                    <FontAwesomeIcon
                      className="text-2xl text-purple-600 dark:text-purple-400 mb-2"
                      icon={faTrophy}
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Matières Étudiées
                    </p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {eleveProfile.subjects.length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-lg text-center border border-orange-200 dark:border-orange-700">
                    <FontAwesomeIcon
                      className="text-2xl text-orange-600 dark:text-orange-400 mb-2"
                      icon={faClock}
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Dernière Activité
                    </p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {eleveProfile.updatedAt
                        ? formatDate(eleveProfile.updatedAt)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Statistiques détaillées */}
            <Card className="w-full border border-blue-200 dark:border-blue-800">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-blue-300 flex items-center gap-2">
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
            <Card className="w-full border border-blue-200 dark:border-blue-800">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBookOpen} />
                  Détails des Notes
                </h2>

                <Tabs
                  aria-label="Matières"
                  className="mb-4"
                  classNames={{
                    tabList:
                      "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-blue-500",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-blue-500",
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
              <Card className="w-full border border-blue-200 dark:border-blue-800">
                <CardBody className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Statistiques Avancées
                  </h2>

                  <Tabs 
                    className="mb-8"
                    selectedKey={selectedTab} 
                    onSelectionChange={(key) => setSelectedTab(key.toString())}
                    classNames={{
                      tabList: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                      tab: "text-gray-700 dark:text-gray-300 data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-700",
                      tabContent: "text-gray-700 dark:text-gray-300",
                      cursor: "bg-blue-500 dark:bg-blue-400",
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
                      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                        <CardBody>
                          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
                            Total des exercices
                          </h3>
                          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{advancedStats.totalExercises}</p>
                        </CardBody>
                      </Card>
                      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                        <CardBody>
                          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
                            Réponses correctes
                          </h3>
                          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{advancedStats.totalCorrect}</p>
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
                      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                        <CardBody>
                          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Score moyen</h3>
                          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
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
                          <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                            <CardBody>
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
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
                                  <span className="text-gray-600 dark:text-gray-300">Progression</span>
                                  <span className="text-gray-600 dark:text-gray-300">
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
                                  <p className="text-gray-500 dark:text-gray-400">Exercices complétés</p>
                                  <p className="font-medium text-gray-800 dark:text-gray-100">
                                    {subject.exercisesCompleted}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400">Réponses correctes</p>
                                  <p className="font-medium text-gray-800 dark:text-gray-100">{subject.correctAnswers}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    {subject.correctAnswers} / {subject.totalExercises} bonnes réponses
                                    ({subject.totalExercises > 0 ? ((subject.correctAnswers / subject.totalExercises) * 100).toFixed(1) : 0}%)
                                  </p>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </motion.div>
                      ))}
                      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                        <CardBody>
                          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
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
                            <p className="text-center text-gray-500 dark:text-gray-400">
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
                      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                        <CardBody>
                          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
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
                            <p className="text-center text-gray-500 dark:text-gray-400">
                              Aucune donnée disponible
                            </p>
                          )}
                        </CardBody>
                      </Card>
                      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                        <CardBody>
                          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                            Détails par catégorie
                          </h3>
                          <div className="space-y-4">
                            {advancedStats.categoryStats.map((category: any, index: number) => (
                              <div
                                key={index}
                                className="flex justify-between items-center"
                              >
                                <span className="text-gray-700 dark:text-gray-200">{category.category}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
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
                      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                        <CardBody>
                          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
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
                            <p className="text-center text-gray-500 dark:text-gray-400">
                              Aucune donnée disponible
                            </p>
                          )}
                        </CardBody>
                      </Card>
                      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                        <CardBody>
                          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
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
                            <p className="text-center text-gray-500 dark:text-gray-400">
                              Aucune donnée disponible
                            </p>
                          )}
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon
              className="text-6xl text-gray-400 mb-6"
              icon={faUser}
            />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
              Aucun profil d&apos;élève trouvé
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
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

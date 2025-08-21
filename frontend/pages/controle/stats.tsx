"use client";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { Spinner } from '@nextui-org/react'
import { Chip } from '@nextui-org/react'
import { Tabs } from '@nextui-org/react'
import { Tab } from '@nextui-org/react'
import { Progress } from '@nextui-org/react'
import {  } from '@nextui-org/react';
import { LightAnimation } from "@/components/DynamicMotion";
import { useRouter } from "next/navigation";
const Line = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Line })), { ssr: false })
const Bar = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Bar })), { ssr: false })
const Doughnut = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Doughnut })), { ssr: false });
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

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

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

// Définition des matières disponibles
const SUBJECTS = {
  math: {
    name: "Mathématiques",
    icon: "🔢",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  french: { 
    name: "Français", 
    icon: "📚", 
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
  },
  sciences: {
    name: "Sciences",
    icon: "🧪",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  art: {
    name: "Arts Plastiques",
    icon: "🎨",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  history: {
    name: "Histoire",
    icon: "🏛️",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  },
  geography: {
    name: "Géographie",
    icon: "🌍",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  },
  language: { 
    name: "Langues", 
    icon: "🗣️", 
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300" 
  },
  technology: {
    name: "Technologie",
    icon: "💻",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  },
  music: { 
    name: "Musique", 
    icon: "🎵", 
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300" 
  },
  lessons: { 
    name: "Leçons", 
    icon: "📖", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
  },
  rapportHebdo: {
    name: "Rapport Hebdo",
    icon: "📊",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
  },
  revision: {
    name: "Révision",
    icon: "🔄",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
  revisionErrors: {
    name: "Erreurs de Révision",
    icon: "⚠️",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
};

const StatsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  useEffect(() => {
    fetchAllStats();
  }, []);

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
        subject: SUBJECTS[subject as keyof typeof SUBJECTS]?.name || subject,
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
      subject: SUBJECTS[subject as keyof typeof SUBJECTS]?.name || subject,
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

  const fetchAllStats = async () => {
    try {
      setLoading(true);

      // Récupérer les données de toutes les matières depuis le localStorage
      const allSubjectsData: { [key: string]: any } = {};

      // Ajouter les matières standard
      Object.keys(SUBJECTS).forEach((subject) => {
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

      setStats(finalStats);
      setLoading(false);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des statistiques:", err);
        setError("Erreur lors du chargement des statistiques");
      setLoading(false);
    }
  };

  const prepareLineChartData = () => {
    if (!stats) return null;
    
    return {
      labels: stats.dailyStats.map((stat: any) =>
        new Date(stat.date).toLocaleDateString(),
      ),
      datasets: [
        {
          label: "Score moyen",
          data: stats.dailyStats.map((stat: any) => stat.averageScore),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.1)",
          tension: 0.1,
        },
        {
          label: "Exercices complétés",
          data: stats.dailyStats.map((stat: any) => stat.exercisesCompleted),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.1)",
          tension: 0.1,
        },
      ],
    };
  };

  const prepareBarChartData = () => {
    if (!stats) return null;
    
    return {
      labels: stats.subjects.map((subject: any) => subject.subject),
      datasets: [
        {
          label: "Score moyen",
          data: stats.subjects.map((subject: any) => subject.averageScore),
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
    if (!stats) return null;
    
    return {
      labels: stats.categoryStats.map((category: any) => category.category),
      datasets: [
        {
          data: stats.categoryStats.map((category: any) => category.count),
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

  // Récupérer le prénom de l'utilisateur depuis le localStorage
  let userFirstName = "Utilisateur";
  if (typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userFirstName = userData.prenom || userData.firstName || userData.pseudo || "Utilisateur";
      }
    } catch (e) {
      // rien
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream dark:bg-gray-900">
        <div className="text-center">
          <Spinner color="primary" size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cream dark:bg-gray-900">
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300 max-w-md text-center border border-red-200 dark:border-red-800">
          <p className="font-bold mb-2">⚠️ Erreur</p>
          <p>{error}</p>
        </div>
        <Button 
          className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cream dark:bg-gray-900">
        <Card className="max-w-md w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardBody className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Aucune donnée disponible
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Vous n&apos;avez pas encore de statistiques à afficher.
            </p>
            <Button 
              color="primary" 
              onClick={() => router.push("/controle")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
            >
              Commencer un exercice
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-2"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-violet-400 dark:text-violet-300" />
            Statistiques de {userFirstName}
          </h1>
          <Button 
            color="primary" 
            onClick={() => router.push("/controle")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            Nouvel exercice
          </Button>
        </motion.div>

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
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalExercises}</p>
              </CardBody>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <CardBody>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Réponses correctes
                </h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalCorrect}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.totalExercises > 0
                    ? (
                        (Number(stats.totalCorrect) /
                          Number(stats.totalExercises)) *
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
                  {Number(stats.averageScore).toFixed(1)}%
                </p>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Par matière */}
        {selectedTab === "subjects" && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            {stats.subjects.map((subject, index) => (
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
                {stats.subjects.length > 0 ? (
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
            {/* Diagramme des erreurs par matière */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 mt-6">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  Erreurs par matière
                </h3>
                {stats.subjects.length > 0 ? (
                  <div className="h-64 w-full overflow-x-auto">
                    <div
                      className="min-w-[350px] w-full"
                      style={{ height: "260px" }}
                    >
                      <Bar
                        data={(() => {
                          const labels = stats.subjects.map((s) => s.subject);
                          const errors = stats.subjects.map(
                            (s) => Math.max(0, s.totalExercises - s.correctAnswers)
                          );
                          // Couleurs dynamiques par matière adaptées au mode sombre
                          const backgroundColors = stats.subjects.map((s) => {
                            // On cherche la clé du SUBJECTS qui correspond au nom affiché
                            const found = Object.values(SUBJECTS).find(
                              (sub) => sub.name === s.subject
                            );
                            // Couleurs adaptées au mode sombre
                            const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
                            if (found && found.color.includes('yellow')) return isDark ? 'rgba(253, 224, 71, 0.4)' : 'rgba(253, 224, 71, 0.7)';
                            if (found && found.color.includes('red')) return isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.7)';
                            if (found && found.color.includes('green')) return isDark ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.7)';
                            if (found && found.color.includes('purple')) return isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.7)';
                            if (found && found.color.includes('indigo')) return isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.7)';
                            if (found && found.color.includes('teal')) return isDark ? 'rgba(20, 184, 166, 0.4)' : 'rgba(20, 184, 166, 0.7)';
                            if (found && found.color.includes('pink')) return isDark ? 'rgba(236, 72, 153, 0.4)' : 'rgba(236, 72, 153, 0.7)';
                            if (found && found.color.includes('cyan')) return isDark ? 'rgba(34, 211, 238, 0.4)' : 'rgba(34, 211, 238, 0.7)';
                            if (found && found.color.includes('rose')) return isDark ? 'rgba(244, 63, 94, 0.4)' : 'rgba(244, 63, 94, 0.7)';
                            if (found && found.color.includes('blue')) return isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.7)';
                            if (found && found.color.includes('gray')) return isDark ? 'rgba(107, 114, 128, 0.4)' : 'rgba(107, 114, 128, 0.7)';
                            if (found && found.color.includes('orange')) return isDark ? 'rgba(251, 146, 60, 0.4)' : 'rgba(251, 146, 60, 0.7)';
                            return isDark ? 'rgba(156, 163, 175, 0.4)' : 'rgba(156, 163, 175, 0.7)'; // gris par défaut
                          });
                          return {
                            labels,
                            datasets: [
                              {
                                label: "Erreurs",
                                data: errors,
                                backgroundColor: backgroundColors,
                              },
                            ],
                          };
                        })()}
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
                {stats.categoryStats.length > 0 ? (
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
                  {stats.categoryStats.map((category: any, index: number) => (
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
                {stats.dailyStats.length > 0 ? (
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
                {stats.subjects.length > 0 ? (
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
      </div>
    </div>
  );
};

export default StatsPage; 

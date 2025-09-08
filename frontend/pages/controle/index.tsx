"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Beaker,
  Calculator,
  Languages,
  Palette,
  Landmark,
  Globe,
  Trophy,
  ClipboardList,
  Microchip,
  Star,
  Clock,
  Users,
  BarChart3,
  Music,
  AlertTriangle,
  User,
  CreditCard,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import Link from "next/link";

const courseThemes = [
  {
    id: 1,
    title: "Français",
    description: "Grammaire, conjugaison et vocabulaire",
    route: "/controle/french",
    icon: BookOpen,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    id: 2,
    title: "Sciences",
    description: "Expériences et découvertes",
    route: "/controle/sciences",
    icon: Beaker,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    id: 3,
    title: "Mathématiques",
    description: "Calculs, logique et raisonnement",
    route: "/controle/math",
    icon: Calculator,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  {
    id: 4,
    title: "Langues",
    description: "Compréhension et vocabulaire",
    route: "/controle/language",
    icon: Languages,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
  {
    id: 5,
    title: "Arts Plastiques",
    description: "Exercices créatifs et artistiques",
    route: "/controle/art",
    icon: Palette,
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    id: 6,
    title: "Histoire",
    description: "Repères historiques essentiels",
    route: "/controle/history",
    icon: Landmark,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  {
    id: 7,
    title: "Géographie",
    description: "Découverte du monde",
    route: "/controle/geography",
    icon: Globe,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    borderColor: "border-teal-200 dark:border-teal-800",
  },
  {
    id: 8,
    title: "Technologie",
    description: "Informatique et programmation",
    route: "/controle/technology",
    icon: Microchip,
    color: "from-gray-500 to-slate-500",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    borderColor: "border-gray-200 dark:border-gray-800",
  },
  {
    id: 9,
    title: "Musique",
    description: "Rythmes et mélodies",
    route: "/controle/music",
    icon: Music,
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
];

export default function ControleIndex() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [stats, setStats] = useState({
    totalEleves: 0,
    averageScore: "0",
    progression: "0",
    eleve: {
      nom: "",
      prenom: "",
      modificationsCount: 0,
      lastModificationDate: "",
    },
  });

  // Check for dark mode preference
  useEffect(() => {
    const darkMode =
      localStorage.getItem("darkMode") === "true" ||
      (!localStorage.getItem("darkMode") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(darkMode);

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("userToken");
        const userId =
          localStorage.getItem("userId") ||
          JSON.parse(localStorage.getItem("user") || "{}")._id;

        if (!token || !userId) throw new Error("Utilisateur non authentifié");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/eleves/stats/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setStats({
          totalEleves: response.data.totalEleves || 0,
          averageScore: response.data.averageScore || "0",
          progression: response.data.progression || "0",
          eleve: response.data.eleve || {
            nom: "",
            prenom: "",
            modificationsCount: 0,
            lastModificationDate: "",
          },
        });
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
      }
    };

    const checkAuth = () => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      const userInfo = localStorage.getItem("userInfo");
      const user = localStorage.getItem("user");

      let isAuthenticated = false;
      let userData = null;

      if (token && userId) {
        isAuthenticated = true;
      }

      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          if (parsedUserInfo && parsedUserInfo._id) {
            isAuthenticated = true;
            userData = parsedUserInfo;
          }
        } catch (e) {
          console.error("Erreur parsing userInfo:", e);
        }
      }

      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          if (parsedUser && (parsedUser._id || parsedUser.id)) {
            isAuthenticated = true;
            userData = parsedUser;
          }
        } catch (e) {
          console.error("Erreur parsing user:", e);
        }
      }

      if (!isAuthenticated) {
        router.push("/users/login");
        return;
      }

      if (userData) {
        setStats(prevStats => ({
          ...prevStats,
          eleve: {
            ...prevStats.eleve,
            prenom: userData.prenom || userData.firstName || userData.pseudo || "Élève",
            nom: userData.nom || userData.lastName || "",
          },
        }));
      }

      fetchStats();
    };

    checkAuth();
    setLoading(false);
  }, [router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Chargement de votre espace d&apos;apprentissage...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-red-700 dark:text-red-300 max-w-md text-center border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p className="font-bold mb-2">⚠️ Erreur</p>
          <p>{error}</p>
        </div>
        <Button
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  const statsCards = [
    {
      icon: Star,
      label: "Moyenne Générale",
      value: `${stats.averageScore || "0"}/20`,
      color: "text-yellow-500 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: Clock,
      label: "Temps d'étude",
      value: "2h/jour",
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Users,
      label: "Élèves actifs",
      value: (stats.totalEleves || 0).toString(),
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: BarChart3,
      label: "Progression",
      value: `${stats.progression || "0"}%`,
      color: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative w-full px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l&apos;accueil
              </Button>
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                Bonjour {(() => {
                  if (stats.eleve?.prenom) {
                    return stats.eleve.prenom;
                  }
                  
                  try {
                    const storedUser = localStorage.getItem("user");
                    if (storedUser) {
                      const userData = JSON.parse(storedUser);
                      return userData.prenom || userData.firstName || userData.pseudo || "Élève";
                    }
                  } catch (e) {
                    console.error("Erreur lors de la récupération du prénom depuis localStorage:", e);
                  }
                  
                  return "Élève";
                })()} ! 🌟
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Bienvenue dans ton espace d&apos;apprentissage magique ! ✨
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {statsCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </p>
                        <p className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Matières */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choisis ta matière
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore les différentes matières et progresse à ton rythme
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courseThemes.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="group"
              >
                <Link href={theme.route}>
                  <Card className={`cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${theme.bgColor} border-2 ${theme.borderColor} hover:border-opacity-100`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 rounded-full bg-gradient-to-r ${theme.color} shadow-lg`}>
                          <theme.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 mb-2">
                            {theme.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {theme.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
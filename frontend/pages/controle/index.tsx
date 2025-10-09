import { useRouter } from "next/navigation";
import { useEffect, useState, memo, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useTheme } from "next-themes";
import {
  BookOpen,
  Beaker,
  Calculator,
  Languages,
  Palette,
  Landmark,
  Globe,
  Cpu,
  Star,
  Clock,
  Users,
  BarChart3,
  Music,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Crown,
  Target,
  Moon,
  Sun,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { handleAuthError } from "@/utils/errorHandler";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { useStatsCache } from "@/hooks/useStatsCache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type StatsState = {
  totalEleves: number;
  averageScore: string;
  progression: string;
  eleve: {
    nom: string;
    prenom: string;
    modificationsCount: number;
    lastModificationDate: string;
  };
};

const DEFAULT_STATS: StatsState = {
  totalEleves: 0,
  averageScore: "0",
  progression: "0",
  eleve: {
    nom: "",
    prenom: "",
    modificationsCount: 0,
    lastModificationDate: "",
  },
};

// Lazy load des composants lourds avec prefetch
const StatsSync = dynamic(() => import("@/components/StatsSync"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-32 rounded"></div>
  ),
});

const LoginButton = dynamic(() => import("@/components/LoginButton"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-24 rounded"></div>
  ),
});

// Lazy load des icônes non critiques
const AnimatePresenceLazy = dynamic(
  () => import("framer-motion").then((mod) => ({ default: mod.AnimatePresence })),
  { ssr: false }
);

// Import direct de Framer Motion (plus simple pour les performances)

const courseThemes = [
  {
    id: 1,
    title: "Français",
    description: "Grammaire, conjugaison et vocabulaire",
    route: "/controle/french",
    icon: BookOpen,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-700",
    textColor: "text-red-700 dark:text-red-300",
  },
  {
    id: 2,
    title: "Sciences",
    description: "Expériences et découvertes",
    route: "/controle/sciences",
    icon: Beaker,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-700",
    textColor: "text-green-700 dark:text-green-300",
  },
  {
    id: 3,
    title: "Mathématiques",
    description: "Calculs, logique et raisonnement",
    route: "/controle/math",
    icon: Calculator,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-700",
    textColor: "text-yellow-700 dark:text-yellow-300",
  },
  {
    id: 4,
    title: "Langues",
    description: "Compréhension et vocabulaire",
    route: "/controle/language",
    icon: Languages,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    borderColor: "border-pink-200 dark:border-pink-700",
    textColor: "text-pink-700 dark:text-pink-300",
  },
  {
    id: 5,
    title: "Arts Plastiques",
    description: "Exercices créatifs et artistiques",
    route: "/controle/art",
    icon: Palette,
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  {
    id: 6,
    title: "Histoire",
    description: "Repères historiques essentiels",
    route: "/controle/history",
    icon: Landmark,
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-700",
    textColor: "text-indigo-700 dark:text-indigo-300",
  },
  {
    id: 7,
    title: "Géographie",
    description: "Découverte du monde",
    route: "/controle/geography",
    icon: Globe,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    borderColor: "border-teal-200 dark:border-teal-700",
    textColor: "text-teal-700 dark:text-teal-300",
  },
  {
    id: 8,
    title: "Technologie",
    description: "Informatique et programmation",
    route: "/controle/technology",
    icon: Cpu,
    color: "from-gray-500 to-slate-500",
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
    borderColor: "border-gray-200 dark:border-gray-600",
    textColor: "text-gray-700 dark:text-gray-300",
  },
  {
    id: 9,
    title: "Musique",
    description: "Rythmes et mélodies",
    route: "/controle/music",
    icon: Music,
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-700",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  {
    id: 10,
    title: "Révisions",
    description: "Consolidation des acquis",
    route: "/controle/revision",
    icon: RefreshCw,
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    borderColor: "border-cyan-200 dark:border-cyan-700",
    textColor: "text-cyan-700 dark:text-cyan-300",
  },
  {
    id: 11,
    title: "Quiz Hebdomadaires",
    description: "Quiz adaptés pour l'autisme",
    route: "/controle/quiz-hebdomadaire",
    icon: Target,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  {
    id: 12,
    title: "Premium",
    description: "Contenu exclusif et avancé",
    route: "/controle/subscription",
    icon: Crown,
    color: "from-yellow-400 via-yellow-500 to-yellow-600",
    bgColor:
      "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
    borderColor: "border-yellow-300 dark:border-yellow-600",
    textColor: "text-yellow-800 dark:text-yellow-200",
  },
];

export default function ControleIndex() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isServer = typeof window === "undefined";
  const [mounted, setMounted] = useState(isServer);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  // Utiliser le hook de cache pour les stats
  const { stats: cachedStats, loading, fetchStats, refetch } = useStatsCache(userId);
  const stats = cachedStats || DEFAULT_STATS;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isDarkMode = theme === "dark";

  // Calculer les valeurs des cartes de manière stable (AVANT toute logique conditionnelle)
  const averageScoreValue = useMemo(() => {
    const score = parseFloat(stats.averageScore || "0");
    if (score > 20) {
      return (score / 5).toFixed(1);
    }
    return score.toFixed(1);
  }, [stats.averageScore]);

  const progressionValue = useMemo(() => {
    const totalExercises = stats.totalEleves || 0;
    const maxExercises = 450;
    const progression = totalExercises > 0 ? Math.min((totalExercises / maxExercises) * 100, 100) : 0;
    return Math.round(progression);
  }, [stats.totalEleves]);

  const statusChipBase =
    "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/60 border text-sm shadow-sm transition-colors duration-300";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const handleFetchStats = useCallback(async () => {
    setIsRefreshing(true);
    const result = await fetchStats();
    if (result) {
      setLastUpdate(new Date());
    }
    setIsRefreshing(false);
  }, [fetchStats]);

  useEffect(() => {
    setHasPlayedIntro(true);
    setMounted(true);

    // Initialiser l'userId
    const initializeUser = () => {
      console.log("🔍 Initialisation de l'utilisateur...");

      // Essayer de récupérer l'userId depuis différentes sources
      let userIdFromStorage = null;

      // Méthode 1: depuis localStorage "user"
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          userIdFromStorage = parsedUser._id;
          console.log(
            '✅ UserId trouvé dans localStorage "user":',
            userIdFromStorage,
          );
        } catch (e) {
          console.warn("❌ Erreur parsing userData:", e);
        }
      }

      // Méthode 2: depuis localStorage "userId"
      if (!userIdFromStorage) {
        userIdFromStorage = localStorage.getItem("userId");
        if (userIdFromStorage) {
          console.log(
            '✅ UserId trouvé dans localStorage "userId":',
            userIdFromStorage,
          );
        }
      }

      // Méthode 3: depuis localStorage "userToken" (décoder le JWT)
      if (!userIdFromStorage) {
        const token =
          localStorage.getItem("userToken") || localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            userIdFromStorage = payload.userId || payload.id;
            if (userIdFromStorage) {
              console.log("✅ UserId trouvé dans le token:", userIdFromStorage);
            }
          } catch (e) {
            console.warn("❌ Erreur décodage token:", e);
          }
        }
      }

      if (userIdFromStorage) {
        setUserId(userIdFromStorage);
        console.log("🎯 UserId final défini:", userIdFromStorage);
      } else {
        console.log("❌ Aucun userId trouvé");
      }
    };

    initializeUser();

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

      // Permettre un aperçu même sans connexion
      // if (!isAuthenticated) {
      //   router.push("/users/login");
      //   return;
      // }

      if (userId) {
        handleFetchStats();
      }
    };

    checkAuth();
  }, [router, handleFetchStats, setTheme, userId]);

  // Rafraîchissement automatique des statistiques toutes les 30 secondes
  const { forceRefresh } = useAutoRefresh({
    interval: 30000, // 30 secondes
    enabled: mounted && userId !== null, // Seulement si la page est montée et qu'un utilisateur est connecté
    onRefresh: async () => {
      setIsRefreshing(true);
      await refetch();
      setLastUpdate(new Date());
      setIsRefreshing(false);
    },
    onError: (error) => {
      console.error("Erreur lors du rafraîchissement automatique:", error);
    },
  });

  if ((!mounted && !isServer) || loading) {
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

  // Composant optimisé pour les cartes de statistiques
  const StatCard = memo(
    ({
      icon: Icon,
      label,
      value,
      color,
      bgColor,
      borderColor,
    }: {
      icon: any;
      label: string;
      value: string;
      color: string;
      bgColor: string;
      borderColor: string;
    }) => (
      <Card
        className={`${bgColor} ${borderColor} border-2 transition-all duration-300 hover:shadow-lg hover:scale-105`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {label}
              </p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
        </CardContent>
      </Card>
    ),
  );

  StatCard.displayName = "StatCard";

  // Composant optimisé pour les cartes de cours - animations simplifiées
  const CourseCard = ({ theme, index }: { theme: any; index: number }) => (
    <div className={hasPlayedIntro ? '' : 'animate-fadeInUp'} style={hasPlayedIntro ? {} : { animationDelay: `${index * 50}ms` }}>
      <Link href={theme.route}>
        <Card
          className={`${theme.bgColor} ${theme.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div
                className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${theme.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
              >
                <theme.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  className={`text-sm sm:text-base font-bold ${theme.textColor} mb-1 truncate`}
                >
                  {theme.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {theme.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );

  const statsCards = [
    {
      icon: Star,
      label: "Moyenne Générale",
      value: `${averageScoreValue}/20`,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor:
        "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-700",
    },
    {
      icon: Clock,
      label: "Temps d'étude",
      value: "2h/jour",
      color: "text-blue-600 dark:text-blue-400",
      bgColor:
        "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
    },
    {
      icon: Users,
      label: "Élèves actifs",
      value: (stats.totalEleves || 0).toString(),
      color: "text-green-600 dark:text-green-400",
      bgColor:
        "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      borderColor: "border-green-200 dark:border-green-700",
    },
    {
      icon: BarChart3,
      label: "Progression",
      value: `${progressionValue}%`,
      color: "text-purple-600 dark:text-purple-400",
      bgColor:
        "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
      borderColor: "border-purple-200 dark:border-purple-700",
    },
  ];

  return (
    <>
      <Head>
        <title>Espace d'apprentissage - AutiStudy</title>
        <meta name="description" content="Ton espace d'apprentissage personnalisé avec des quiz adaptés et des matières variées" />
        
        {/* Preconnect vers l'API backend pour réduire le TTFB */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || 'https://blog-perso.onrender.com'} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL || 'https://blog-perso.onrender.com'} />
        
        {/* Preconnect vers les CDN utilisés */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Viewport optimisé pour mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>
      
      <div className="w-full">
        {/* Hero Section - Style Posts */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-white" />
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                  Espace de Contrôle
                </h1>
              </div>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto">
                Suivez votre progression et accédez à tous vos cours et exercices
              </p>
            </motion.div>
          </div>
        </div>

        {/* Message de bienvenue personnalisé */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Bonjour{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {(() => {
                    if (stats.eleve?.prenom) {
                      return stats.eleve.prenom;
                    }

                    try {
                      const storedUser =
                        typeof window !== "undefined"
                          ? localStorage.getItem("user")
                          : null;
                      if (storedUser) {
                        const userData = JSON.parse(storedUser);
                        return (
                          userData.prenom ||
                          userData.firstName ||
                          userData.pseudo ||
                          "Champion"
                        );
                      }
                    } catch (e) {
                      console.error(
                        "Erreur parsing userData for firstName:",
                        e,
                      );
                    }

                    // Prénom AutiStudy si non connecté
                    return "Explorateur";
                  })()}
                </span>
                {" 👋"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {typeof window !== "undefined" && localStorage.getItem("user")
                  ? "Prêt à continuer ton aventure d'apprentissage aujourd'hui ? ✨"
                  : "Bienvenue dans ton espace d'apprentissage magique ! 🌟"}
              </p>
            </motion.div>
          </div>
        </div>

        <section className="relative py-8 sm:py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"></div>
        <div className="relative w-full px-3 sm:px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
              <Button
                className="bg-white/90 hover:bg-white border-gray-300 text-gray-900 hover:text-gray-700 dark:bg-gray-800/90 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-gray-200 w-full sm:w-auto backdrop-blur-sm"
                onClick={() => router.push("/")}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l&apos;accueil
              </Button>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  className="bg-white/90 hover:bg-white border-gray-300 text-gray-900 hover:text-gray-700 dark:bg-gray-800/90 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-gray-200 backdrop-blur-sm"
                  onClick={toggleTheme}
                  size="sm"
                  variant="outline"
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
                <LoginButton
                  className="bg-white/90 hover:bg-white border-gray-300 text-gray-900 hover:text-gray-700 dark:bg-gray-800/90 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-gray-200 w-full sm:w-auto backdrop-blur-sm"
                  size="sm"
                  variant="outline"
                />
              </div>
            </div>

            {typeof window !== "undefined" &&
              !localStorage.getItem("user") && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-800 dark:text-blue-200 text-sm text-center">
                      💡 <strong>Mode aperçu :</strong> Connectez-vous pour accéder à vos statistiques personnalisées et sauvegarder votre progression.
                    </p>
                  </div>
                </motion.div>
              )}
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 lg:px-12">
          {/* En-tête des statistiques façon AutiStudy */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-blue-200/60 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/20 p-6 sm:p-8 shadow-xl">
              <div className="absolute -top-24 -right-16 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Ton tableau magique
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        Garde un œil sur tes progrès, ton temps d&apos;apprentissage et tes missions hebdo ✨
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300 min-h-[40px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={lastUpdate ? (isRefreshing ? "refreshing" : "last-update") : "first-time"}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${statusChipBase} ${lastUpdate ? "border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-200" : "border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-200"} min-w-[12rem]`}
                        exit={{ opacity: 0, y: -6 }}
                        initial={{ opacity: 0, y: 6 }}
                      >
                        {lastUpdate ? (
                          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-500" : "text-blue-600"}`} />
                        ) : (
                          <Sparkles className="w-4 h-4 text-blue-500" />
                        )}
                        {lastUpdate ? (
                          <span className="flex items-center gap-1">
                            Mise à jour :
                            <strong>
                              {lastUpdate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </strong>
                          </span>
                        ) : (
                          <span>Première mise en lumière !</span>
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="min-w-[160px] border border-purple-200 text-purple-600 dark:text-purple-300 dark:border-purple-700 bg-white/80 dark:bg-slate-900/60"
                    onClick={forceRefresh}
                    variant="outline"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Boost magique
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {statsCards.map((stat, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                key={index}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
          </motion.div>

          {/* Synchronisation des statistiques */}
          {(() => {
            const userData = localStorage.getItem("user");
            const userId = userData ? JSON.parse(userData)._id : null;
            return userId;
          })() && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 sm:mt-8"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 sm:p-6 border border-violet-200 dark:border-violet-700 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2">
                        🔄 Synchronisation des statistiques
                      </h3>
                      <p className="text-xs sm:text-sm text-violet-600 dark:text-violet-400 break-words">
                        Synchronisez vos exercices locaux avec le serveur pour
                        mettre à jour vos statistiques
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <StatsSync
                        onSyncComplete={(newStats) => {
                          console.log(
                            "📈 Nouvelles statistiques reçues:",
                            newStats,
                          );
                          // Rafraîchir les stats depuis le serveur après la synchronisation
                          handleFetchStats();
                        }}
                        userId={userId || ""}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
        </div>
      </section>

      {/* Quiz Hebdomadaires - Section Spéciale */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 lg:px-12">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
              Quiz Hebdomadaires 🧩
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Des quiz adaptés spécialement pour les enfants autistes de 6 à 18
              ans. Questions simples, feedback positif et progression douce !
            </p>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {/* Adaptations spéciales */}
            <Card className="bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <span className="text-2xl">📝</span>
                  Questions Claires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Phrases courtes et simples, une difficulté à la fois pour
                  éviter la surcharge cognitive.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <span className="text-2xl">🎨</span>
                  Repères Visuels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Couleurs et icônes par matière, animations douces pour une
                  expérience apaisante.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <span className="text-2xl">💪</span>
                  Feedback Positif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Encouragements constants, progression visible et célébration
                  des réussites.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Carte principale du quiz */}
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto px-3 sm:px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 shadow-2xl overflow-hidden backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="text-center text-white">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 backdrop-blur-sm">
                    <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 px-2">
                    Commencer un Quiz
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 opacity-90 px-4">
                    52 quiz disponibles, adaptés pour chaque semaine de l'année
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
                    <Button
                      className="border border-white/70 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base shadow-lg shadow-purple-500/20 backdrop-blur-lg transition-all"
                      onClick={() => router.push("/controle/quiz-hebdomadaire")}
                      size="lg"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 inline-flex items-center justify-center rounded-full bg-white/40 text-purple-600">
                          <Target className="w-3 h-3" />
                        </span>
                        <span className="text-white">Choisir un Quiz</span>
                      </span>
                    </Button>
                    <Button
                      className="border border-white/70 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base shadow-lg shadow-purple-500/20 backdrop-blur-lg transition-all"
                      onClick={() => {
                        const currentWeek = Math.ceil(
                          (new Date().getTime() -
                            new Date(
                              new Date().getFullYear(),
                              0,
                              1,
                            ).getTime()) /
                          (86400000 * 7),
                        );
                        router.push(
                          `/controle/quiz-hebdomadaire?week=${currentWeek}`,
                        );
                      }}
                      size="lg"
                      variant="outline"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 inline-flex items-center justify-center rounded-full border border-white/40 bg-transparent text-white/90">
                          <Sparkles className="w-3 h-3" />
                        </span>
                        <span className="text-white">Quiz de cette Semaine</span>
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Matières */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 lg:px-12">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
              Choisis ta matière
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 px-4">
              Explore les différentes matières et progresse à ton rythme
            </p>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {courseThemes.map((theme, index) => (
              <CourseCard index={index} key={theme.id} theme={theme} />
            ))}
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Sun, Moon, Star, BookOpen, Clock, TrendingUp } from "lucide-react";
import axios from "axios";

// Import shadcn components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Loading from "@/components/loading";
import StatsSync from "@/components/StatsSync";

// Configuration des matières avec icônes et couleurs
const SUBJECTS_CONFIG = {
  math: { title: "Mathématiques", icon: "🔢", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  french: { title: "Français", icon: "📚", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  sciences: { title: "Sciences", icon: "🧪", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  art: { title: "Arts Plastiques", icon: "🎨", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  history: { title: "Histoire", icon: "🏛️", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  geography: { title: "Géographie", icon: "🌍", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  language: { title: "Langues", icon: "🗣️", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  technology: { title: "Technologie", icon: "💻", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300" },
  music: { title: "Musique", icon: "🎵", color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300" },
};

// Function to retrieve user data stored in localStorage
const fetchUserData = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }
  return null;
};

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Fonction pour récupérer les statistiques
  const fetchStats = async (userId: string) => {
    try {
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      if (!token) {
        console.warn("Token d'authentification manquant");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/stats/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStats(response.data);
      console.log("📊 Statistiques récupérées:", response.data);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Retrieve user data from localStorage
    const fetchedUser = fetchUserData();

    if (fetchedUser) {
      setUser(fetchedUser);
      const formattedCreatedAt = fetchedUser.createdAt
        ? dayjs(fetchedUser.createdAt).format("DD/MM/YYYY")
        : "Non disponible";

      setCreatedAt(formattedCreatedAt);
      
      // Récupérer les statistiques
      fetchStats(fetchedUser._id);
    } else {
      router.push("/users/login"); // Redirect to login page if user is not logged in
    }

    // Check for dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true' || 
                     (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(darkMode);
    
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    // Clean up interval to avoid memory leaks
    return () => clearInterval(interval);
  }, [router]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!user || loading) {
    return <Loading />; // Wait for user and stats to load
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative w-full px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-end mb-4">
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white button-cls-optimized button-cls-optimized button-cls-optimized"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Bonjour {user.pseudo} ! 👋
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
              Bienvenue sur votre tableau de bord AutiStudy
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Heure actuelle : {currentTime} | Membre depuis le {createdAt}
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="container px-4 mx-auto py-8">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Exercices complétés</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {stats?.totalExercises || 0}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Moyenne générale</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {(() => {
                      const score = parseFloat(stats?.averageScore || "0");
                      if (score > 20) {
                        return (score / 5).toFixed(1);
                      }
                      return score.toFixed(1);
                    })()}/20
                  </p>
                </div>
                <Star className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Progression</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {(() => {
                      const totalExercises = stats?.totalExercises || 0;
                      const maxExercises = 450;
                      const progression = totalExercises > 0 ? Math.min((totalExercises / maxExercises) * 100, 100) : 0;
                      return Math.round(progression);
                    })()}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Temps d'étude</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {Math.round((stats?.globalStats?.totalTimeSpent || 0) / 60)}min
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Synchronisation des statistiques */}
        {user && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2">
                      🔄 Synchronisation des statistiques
                    </h3>
                    <p className="text-sm text-violet-600 dark:text-violet-400">
                      Synchronisez vos exercices locaux avec le serveur pour mettre à jour vos statistiques
                    </p>
                  </div>
                  <StatsSync 
                    userId={user._id} 
                    onSyncComplete={(newStats) => {
                      console.log('📈 Nouvelles statistiques reçues:', newStats);
                      setStats(newStats);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 grid-cls-optimized grid-cls-optimized grid-cls-optimized">
          {/* Matières */}
          <Card className="overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="bg-blue-600 dark:bg-blue-700 p-4">
              <CardTitle className="text-lg text-center text-white md:text-xl">
                📚 Mes Matières
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white dark:bg-gray-800">
              {stats?.subjects?.length > 0 ? (
                stats.subjects.map((subject: any, index: number) => {
                  const subjectConfig = SUBJECTS_CONFIG[subject.subject as keyof typeof SUBJECTS_CONFIG] || 
                    { title: subject.subject, icon: "📚", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" };
                  
                  return (
                    <div key={index} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{subjectConfig.icon}</span>
                        <p className="font-medium text-gray-900 dark:text-white">{subjectConfig.title}</p>
                      </div>
                      <Progress
                        aria-label={`Progression en ${subjectConfig.title}`}
                        className="h-2 mb-2"
                        value={Math.min(subject.progress || 0, 100)}
                      />
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Score: {Math.round(subject.averageScore || 0)}%</span>
                        <span>Exercices: {subject.totalExercises || 0}</span>
                      </div>
                      <Button
                        aria-label={`Continuer ${subjectConfig.title}`}
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white button-cls-optimized button-cls-optimized button-cls-optimized"
                        size="sm"
                        onClick={() => router.push(`/controle?subject=${subject.subject}`)}
                      >
                        Continuer
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucune matière disponible pour le moment
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                    onClick={() => router.push("/controle")}
                  >
                    Commencer les exercices
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exercices Réalisés */}
          <Card className="overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="bg-green-600 dark:bg-green-700 p-4">
              <CardTitle className="text-lg text-center text-white md:text-xl">
                ✅ Exercices Réalisés
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white dark:bg-gray-800">
              {stats?.subjects?.length > 0 ? (
                stats.subjects.slice(0, 3).map((subject: any, index: number) => {
                  const subjectConfig = SUBJECTS_CONFIG[subject.subject as keyof typeof SUBJECTS_CONFIG] || 
                    { title: subject.subject, icon: "📚" };
                  
                  return (
                    <div key={index} className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{subjectConfig.icon}</span>
                          <p className="font-medium text-gray-900 dark:text-white">{subjectConfig.title}</p>
                        </div>
                        <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                          {Math.round(subject.averageScore || 0)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Exercices: {subject.totalExercises || 0}</span>
                        <span>Réponses: {subject.correctAnswers || 0}</span>
                      </div>
                      <Button
                        aria-label={`Voir les détails de ${subjectConfig.title}`}
                        className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white button-cls-optimized button-cls-optimized button-cls-optimized"
                        size="sm"
                        onClick={() => router.push(`/controle?subject=${subject.subject}`)}
                      >
                        Voir les détails
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucun exercice complété pour le moment
                  </p>
                  <Button
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                    onClick={() => router.push("/controle")}
                  >
                    Commencer les exercices
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progression Quotidienne */}
          <Card className="overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="bg-purple-600 dark:bg-purple-700 p-4">
              <CardTitle className="text-lg text-center text-white md:text-xl">
                📈 Progression Quotidienne
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white dark:bg-gray-800">
              {stats?.dailyStats?.length > 0 ? (
                stats.dailyStats.slice(0, 3).map((day: any, index: number) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {dayjs(day.date).format("DD/MM/YYYY")}
                      </p>
                      <span className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                        {day.exercisesCompleted} exercices
                      </span>
                    </div>
                    <Progress
                      aria-label={`Progression du ${dayjs(day.date).format("DD/MM/YYYY")}`}
                      className="h-2 mb-2"
                      value={Math.min((day.exercisesCompleted / 10) * 100, 100)}
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Score: {Math.round(day.averageScore || 0)}%</span>
                      <span>Temps: {Math.round((day.timeSpent || 0) / 60)}min</span>
                    </div>
                    <Button
                      aria-label={`Voir les détails du ${dayjs(day.date).format("DD/MM/YYYY")}`}
                      className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white button-cls-optimized button-cls-optimized button-cls-optimized"
                      size="sm"
                      onClick={() => router.push("/controle")}
                    >
                      Voir les détails
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucune activité récente
                  </p>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white"
                    onClick={() => router.push("/controle")}
                  >
                    Commencer aujourd'hui
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Graphique de Progression */}
        <Card className="mt-8 overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="bg-blue-600 dark:bg-blue-700 p-4">
            <CardTitle className="text-lg text-center text-white md:text-xl">
              📊 Progression AutiStudy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-white dark:bg-gray-800">
            <div className="w-full" style={{ height: "300px" }}>
              <ResponsiveContainer height="100%" width="100%">
                {stats?.subjects?.length > 0 ? (
                  <BarChart
                    data={stats.subjects.map((subject: any) => ({
                      name: SUBJECTS_CONFIG[subject.subject as keyof typeof SUBJECTS_CONFIG]?.title || subject.subject,
                      progress: Math.round(subject.progress || 0),
                      score: Math.round(subject.averageScore || 0),
                      exercises: subject.totalExercises || 0
                    }))}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} tickSize={8} />
                    <YAxis tick={{ fontSize: 12 }} tickSize={8} />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value}${name === 'progress' ? '%' : name === 'score' ? '%' : ''}`,
                        name === 'progress' ? 'Progression' : name === 'score' ? 'Score' : 'Exercices'
                      ]}
                    />
                    <Bar dataKey="progress" fill="#3b82f6" />
                    <Bar dataKey="score" fill="#10b981" />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Aucune donnée disponible pour le graphique
                      </p>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                        onClick={() => router.push("/controle")}
                      >
                        Commencer les exercices
                      </Button>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
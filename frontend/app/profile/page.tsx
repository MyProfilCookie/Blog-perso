"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Sun, Moon, User, Mail, Calendar, Award, BookOpen, Target, TrendingUp } from "lucide-react";

// Import shadcn components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/loading";

// Configuration des matières avec icônes et couleurs
const SUBJECTS_CONFIG = {
  math: { name: "Mathématiques", icon: "🔢", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  french: { name: "Français", icon: "📚", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  sciences: { name: "Sciences", icon: "🧪", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  art: { name: "Arts Plastiques", icon: "🎨", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  history: { name: "Histoire", icon: "🏛️", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" },
  geography: { name: "Géographie", icon: "🌍", color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300" },
  language: { name: "Langues", icon: "🗣️", color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300" },
  technology: { name: "Technologie", icon: "💻", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300" },
  music: { name: "Musique", icon: "🎵", color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300" },
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
  const [activeTab, setActiveTab] = useState<"overview" | "progress" | "achievements">("overview");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve user data from localStorage
      const fetchedUser = fetchUserData();

      if (fetchedUser) {
        setUser(fetchedUser);
        const formattedCreatedAt = fetchedUser.createdAt
          ? dayjs(fetchedUser.createdAt).format("DD/MM/YYYY")
          : "Non disponible";

        setCreatedAt(formattedCreatedAt);

        // Fetch real statistics
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/eleves/complete-stats/${fetchedUser._id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const statsData = await response.json();
            setStats(statsData);
          } else {
            console.error('Erreur lors de la récupération des statistiques');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des statistiques:', error);
        }
      } else {
        router.push("/users/login");
      }

      setLoading(false);
    };

    fetchData();

    // Check for dark mode preference
    const darkMode = localStorage.getItem("darkMode") === "true" || 
                     (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(darkMode);
    
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

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

  if (!user || loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative w-full px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end mb-4">
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Profil AutiStudy
            </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
                Bonjour {user.pseudo} ! 👋
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Heure actuelle : {currentTime} | Membre depuis le {createdAt}
            </p>
          </div>
        </div>
      </div>
      </section>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Vue d'ensemble", icon: Target },
              { id: "progress", label: "Progression", icon: TrendingUp },
              { id: "achievements", label: "Réussites", icon: Award },
            ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
            </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Matières</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.subjects?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Exercices</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats?.totalExercises || 0}
                      </p>
                    </div>
          </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progression</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.round(stats?.averageScore || 0)}%
                      </p>
                    </div>
            </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Réussites</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats?.totalExercises > 0 ? Math.floor(stats.totalExercises / 5) : 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>

            {/* Recent Activities */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Activités Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.scores?.slice(0, 5).map((score: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <span className="text-lg">📝</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Exercice {score.subjectName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {SUBJECTS_CONFIG[score.subjectName as keyof typeof SUBJECTS_CONFIG]?.name || score.subjectName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {Math.round(score.score || 0)}%
                        </Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {dayjs(score.createdAt).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>Aucune activité récente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
        </div>
      )}

        {activeTab === "progress" && (
          <div className="space-y-8">
            {/* Matières Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats?.subjects?.map((subject: any, index: number) => {
                const subjectConfig = SUBJECTS_CONFIG[subject.subject as keyof typeof SUBJECTS_CONFIG];
                return (
                  <Card key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{subjectConfig?.icon || "📚"}</span>
                        <div>
                          <CardTitle className="text-lg text-gray-900 dark:text-white">
                            {subjectConfig?.name || subject.subject}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {subject.totalExercises} exercices
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={Math.round(subject.averageScore || 0)} className="mb-4" />
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Score moyen: {Math.round(subject.averageScore || 0)}%</span>
                        <span>Exercices: {subject.totalExercises}</span>
                      </div>
                      <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                        Continuer
                      </Button>
                    </CardContent>
                  </Card>
                );
              }) || (
                <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Aucune donnée de progression disponible</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  title: "Premier exercice", 
                  description: "Premier exercice complété", 
                  icon: "🎯", 
                  unlocked: (stats?.totalExercises || 0) >= 1 
                },
                { 
                  title: "Élève assidu", 
                  description: "5 exercices complétés", 
                  icon: "📚", 
                  unlocked: (stats?.totalExercises || 0) >= 5 
                },
                { 
                  title: "Excellent élève", 
                  description: "10 exercices complétés", 
                  icon: "⭐", 
                  unlocked: (stats?.totalExercises || 0) >= 10 
                },
                { 
                  title: "Champion", 
                  description: "25 exercices complétés", 
                  icon: "🏆", 
                  unlocked: (stats?.totalExercises || 0) >= 25 
                },
                { 
                  title: "Mathématicien", 
                  description: "Score moyen > 80%", 
                  icon: "🔢", 
                  unlocked: (stats?.averageScore || 0) >= 80 
                },
                { 
                  title: "Perfectionniste", 
                  description: "Score moyen > 90%", 
                  icon: "💯", 
                  unlocked: (stats?.averageScore || 0) >= 90 
                },
                { 
                  title: "Polyvalent", 
                  description: "3 matières différentes", 
                  icon: "🎨", 
                  unlocked: (stats?.subjects?.length || 0) >= 3 
                },
                { 
                  title: "Expert", 
                  description: "5 matières différentes", 
                  icon: "🎓", 
                  unlocked: (stats?.subjects?.length || 0) >= 5 
                },
              ].map((achievement, index) => (
                <Card key={index} className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${
                  !achievement.unlocked ? "opacity-50" : ""
                }`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                    {achievement.unlocked && (
                      <Badge className="mt-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Débloqué
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

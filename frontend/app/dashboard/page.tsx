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
} from "recharts";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Sun, Moon } from "lucide-react";

// Import shadcn components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Loading from "@/components/loading";

// Données adaptées au projet AutiStudy
const mockData = {
  matieres: [
    { 
      title: "Mathématiques", 
      progress: 80, 
      lastViewed: "2024-09-20",
      icon: "🔢",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
    },
    { 
      title: "Français", 
      progress: 65, 
      lastViewed: "2024-09-21",
      icon: "📚",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    },
    { 
      title: "Sciences", 
      progress: 45, 
      lastViewed: "2024-09-19",
      icon: "🧪",
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    },
    { 
      title: "Arts Plastiques", 
      progress: 70, 
      lastViewed: "2024-09-18",
      icon: "🎨",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
    },
  ],
  exercices: [
    { title: "Exercice de calcul mental", score: 85, date: "2024-09-15", matiere: "Mathématiques" },
    { title: "Lecture et compréhension", score: 92, date: "2024-09-17", matiere: "Français" },
    { title: "Découverte des couleurs", score: 78, date: "2024-09-16", matiere: "Arts" },
  ],
  lecons: [
    { title: "Apprentissage des formes", progress: 60, lastViewed: "2024-09-19", matiere: "Mathématiques" },
    { title: "Vocabulaire sensoriel", progress: 40, lastViewed: "2024-09-18", matiere: "Français" },
    { title: "Découverte des sons", progress: 55, lastViewed: "2024-09-17", matiere: "Sciences" },
  ],
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
  const router = useRouter();

  useEffect(() => {
    // Retrieve user data from localStorage
    const fetchedUser = fetchUserData();

    if (fetchedUser) {
      setUser(fetchedUser);
      const formattedCreatedAt = fetchedUser.createdAt
        ? dayjs(fetchedUser.createdAt).format("DD/MM/YYYY")
        : "Non disponible";

      setCreatedAt(formattedCreatedAt);
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

  if (!user) {
    return <Loading />; // Wait for user to load
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
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Matières */}
          <Card className="overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="bg-blue-600 dark:bg-blue-700 p-4">
              <CardTitle className="text-lg text-center text-white md:text-xl">
                📚 Mes Matières
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white dark:bg-gray-800">
              {mockData.matieres.map((matiere, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{matiere.icon}</span>
                    <p className="font-medium text-gray-900 dark:text-white">{matiere.title}</p>
                  </div>
                  <Progress
                    aria-label={`Progression en ${matiere.title}`}
                    className="h-2 mb-2"
                    value={matiere.progress}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Dernière activité : {matiere.lastViewed}
                  </p>
                  <Button
                    aria-label={`Continuer ${matiere.title}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                    size="sm"
                  >
                    Continuer
                  </Button>
                </div>
              ))}
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
              {mockData.exercices.map((exercice, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900 dark:text-white">{exercice.title}</p>
                    <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      {exercice.score}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Matière : {exercice.matiere}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Date : {exercice.date}
                  </p>
                  <Button
                    aria-label={`Voir l'exercice ${exercice.title}`}
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                    size="sm"
                  >
                    Voir les détails
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leçons en Cours */}
          <Card className="overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="bg-purple-600 dark:bg-purple-700 p-4">
              <CardTitle className="text-lg text-center text-white md:text-xl">
                📖 Leçons en Cours
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white dark:bg-gray-800">
              {mockData.lecons.map((lecon, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium text-gray-900 dark:text-white">{lecon.title}</p>
                  </div>
                  <Progress
                    aria-label={`Progression de la leçon ${lecon.title}`}
                    className="h-2 mb-2"
                    value={lecon.progress}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Matière : {lecon.matiere}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Dernière activité : {lecon.lastViewed}
                  </p>
                  <Button
                    aria-label={`Reprendre ${lecon.title}`}
                    className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white"
                    size="sm"
                  >
                    Reprendre
                  </Button>
                </div>
              ))}
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
                <LineChart
                  data={[
                    { name: "Mathématiques", progress: 80 },
                    { name: "Français", progress: 65 },
                    { name: "Sciences", progress: 45 },
                    { name: "Arts", progress: 70 },
                    { name: "Exercices", progress: 85 },
                    { name: "Leçons", progress: 55 },
                  ]}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickSize={8} />
                  <YAxis tick={{ fontSize: 12 }} tickSize={8} />
                  <Tooltip />
                  <Line
                    dataKey="progress"
                    stroke="#2563eb"
                    strokeWidth={2}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
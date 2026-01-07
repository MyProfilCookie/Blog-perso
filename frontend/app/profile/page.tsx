"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Sun, Moon, Star, BookOpen, Clock, TrendingUp, User, Award, Target, Edit3, Save, X, Heart, Image as ImageIcon, Upload } from "lucide-react";
import { apiGet, apiPut, apiPost } from "@/utils/axiosConfig";
import Swal from "sweetalert2";
import { useTheme } from "next-themes";

// Import shadcn components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loading";
import StatsSync from "@/components/StatsSync";
import { normalizeAvatarUrl } from "@/utils/normalizeAvatarUrl";
import { UserContext } from "@/context/UserContext";

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
  const [activeTab, setActiveTab] = useState<"dashboard" | "progress" | "achievements" | "edit">("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editForm, setEditForm] = useState({
    phone: "",
    deliveryAddress: {
      street: "",
      city: "",
      postalCode: "",
      country: ""
    }
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("/assets/default-avatar.webp");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previousAvatarObjectUrl = useRef<string | null>(null);
  const router = useRouter();
  const userContext = useContext(UserContext) as any;
  const contextLoginUser = userContext?.loginUser;
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isThemeReady, setIsThemeReady] = useState(false);
  const currentTheme = (resolvedTheme ?? theme) ?? "light";
  const isDarkMode = currentTheme === "dark";

  useEffect(() => {
    setIsThemeReady(true);
  }, []);

  const updateLocalUser = useCallback((userData: any) => {
    if (!userData) {
      return null;
    }

    if (previousAvatarObjectUrl.current) {
      URL.revokeObjectURL(previousAvatarObjectUrl.current);
      previousAvatarObjectUrl.current = null;
    }

    const rawAvatar = userData.avatar || userData.image;
    let normalizedAvatar = normalizeAvatarUrl(rawAvatar);
    
    // Add timestamp to force image refresh if it's an uploaded image (not default)
    if (normalizedAvatar && !normalizedAvatar.includes('default-avatar') && !normalizedAvatar.startsWith('data:')) {
      const separator = normalizedAvatar.includes('?') ? '&' : '?';
      normalizedAvatar = `${normalizedAvatar}${separator}t=${new Date().getTime()}`;
    }

    const normalizedUser = {
      ...userData,
      avatar: normalizedAvatar,
      image: normalizedAvatar,
    };

    setUser(normalizedUser);
    setAvatarPreview(normalizedAvatar || "/assets/default-avatar.webp");

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      window.dispatchEvent(new CustomEvent("userUpdate", { detail: normalizedUser }));
    }
    contextLoginUser?.(normalizedUser);

    return normalizedUser;
  }, [setUser, setAvatarPreview, previousAvatarObjectUrl, contextLoginUser]);

  useEffect(() => {
    return () => {
      if (previousAvatarObjectUrl.current) {
        URL.revokeObjectURL(previousAvatarObjectUrl.current);
        previousAvatarObjectUrl.current = null;
      }
    };
  }, []);

  // Fonction pour récupérer les statistiques
  const fetchStats = async (userId: string) => {
    try {
      const response = await apiGet(`/eleves/stats/${userId}`);
      setStats(response.data);
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
        const normalizedUser = updateLocalUser(fetchedUser);
        const formattedCreatedAt = normalizedUser?.createdAt
          ? dayjs(normalizedUser.createdAt).format("DD/MM/YYYY")
          : "Non disponible";

        setCreatedAt(formattedCreatedAt);

        // Initialize edit form with current user data
        setEditForm({
          phone: normalizedUser?.phone || "",
          deliveryAddress: {
            street: normalizedUser?.deliveryAddress?.street || "",
            city: normalizedUser?.deliveryAddress?.city || "",
            postalCode: normalizedUser?.deliveryAddress?.postalCode || "",
            country: normalizedUser?.deliveryAddress?.country || ""
          }
        });

      // Récupérer les statistiques
      fetchStats(normalizedUser?._id || normalizedUser?.id);
    } else {
      router.push("/users/login"); // Redirect to login page if user is not logged in
    }

    // Update current time every minute instead of every second to reduce re-renders
    const updateTime = () => {
      setCurrentTime(dayjs().format("HH:mm"));
    };
    
    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 60000); // Update every minute

    // Clean up interval to avoid memory leaks
    return () => clearInterval(interval);
  }, [router, updateLocalUser]);

  const handleThemeToggle = () => {
    const nextTheme = isDarkMode ? "light" : "dark";
    setTheme(nextTheme);
  };

  const handleEditFormChange = (field: string, value: string) => {
    if (field.startsWith('deliveryAddress.')) {
      const addressField = field.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [addressField]: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!user) {
        return;
      }

      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      
      if (!token) {
        Swal.fire({
          title: "Erreur",
          text: "Votre session a expiré. Veuillez vous reconnecter.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
      if (!apiBase) {
        Swal.fire({
          title: "Configuration manquante",
          text: "L'URL de l'API n'est pas configurée.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      const response = await apiPut(`/users/${user._id}`, {
        phone: editForm.phone,
        deliveryAddress: editForm.deliveryAddress,
      });

      updateLocalUser(response.data.user);

      Swal.fire({
        title: "Succès",
        text: "Votre profil a été mis à jour avec succès !",
        icon: "success",
        confirmButtonText: "OK",
      });

    } catch (error: any) {
      console.error("❌ Erreur lors de la mise à jour du profil:", error);
      Swal.fire({
        title: "Erreur",
        text: error?.message || `Une erreur est survenue lors de la mise à jour de votre profil`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original user data
    setEditForm({
      phone: user?.phone || "",
      deliveryAddress: {
        street: user?.deliveryAddress?.street || "",
        city: user?.deliveryAddress?.city || "",
        postalCode: user?.deliveryAddress?.postalCode || "",
        country: user?.deliveryAddress?.country || ""
      }
    });
  };

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        title: "Format invalide",
        text: "Veuillez sélectionner une image (PNG, JPG, WEBP...).",
        icon: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "Fichier trop volumineux",
        text: "La taille maximale autorisée est de 5 Mo.",
        icon: "error",
      });
      return;
    }

    if (previousAvatarObjectUrl.current) {
      URL.revokeObjectURL(previousAvatarObjectUrl.current);
      previousAvatarObjectUrl.current = null;
    }

    const objectUrl = URL.createObjectURL(file);
    previousAvatarObjectUrl.current = objectUrl;
    setAvatarPreview(objectUrl);
    setAvatarFile(file);
  };

  const resetAvatarSelection = () => {
    if (previousAvatarObjectUrl.current) {
      URL.revokeObjectURL(previousAvatarObjectUrl.current);
      previousAvatarObjectUrl.current = null;
    }
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setAvatarPreview(normalizeAvatarUrl(user?.avatar || user?.image));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) {
      return;
    }

    const token = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Authentification requise",
        text: "Veuillez vous reconnecter pour modifier votre photo.",
        icon: "warning",
      });
      return;
    }

    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    if (!apiBase) {
      Swal.fire({
        title: "Configuration manquante",
        text: "L'URL de l'API n'est pas configurée.",
        icon: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    setUploadingAvatar(true);
    try {
      const response = await apiPost(`/users/${user._id}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const normalized = updateLocalUser(response.data.user);
      if (normalized) {
        setAvatarFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setAvatarPreview(normalizeAvatarUrl(normalized.avatar || normalized.image));
      }

      Swal.fire({
        title: "Photo mise à jour",
        text: "Votre photo de profil a bien été enregistrée.",
        icon: "success",
      });
    } catch (error: any) {
      console.error("❌ Erreur lors de l'upload avatar:", error);
      Swal.fire({
        title: "Erreur",
        text: error?.message || "Impossible de mettre à jour votre photo.",
        icon: "error",
      });
      resetAvatarSelection();
    } finally {
      setUploadingAvatar(false);
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
                onClick={handleThemeToggle}
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
                disabled={!isThemeReady}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6">
                <img
                  src={avatarPreview || "/assets/default-avatar.webp"}
                  alt={user.pseudo ? `Avatar de ${user.pseudo}` : "Avatar utilisateur"}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl dark:border-gray-800"
                  loading="lazy"
                />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Bonjour {user.pseudo} ! 👋
            </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
              Bienvenue sur votre profil AutiStudy
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Heure actuelle : {currentTime} | Membre depuis le {createdAt}
              </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex justify-start gap-2 sm:gap-4 md:gap-8 overflow-x-auto">
            {[
              { id: "dashboard", label: "Tableau de bord", icon: Target },
              { id: "progress", label: "Progression", icon: TrendingUp },
              { id: "achievements", label: "Réussites", icon: Award },
              { id: "edit", label: "Édition", icon: Edit3 },
            ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-1 sm:px-2 border-b-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden">{tab.label.split(' ')[0]}</span>
            </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12 py-4 sm:py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
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

              {/* Contenus Aimés */}
              <Card
                className="bg-gradient-to-r from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-800/20 border-pink-200 dark:border-pink-700 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => router.push('/profile/liked')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Contenus aimés</p>
                      <p className="text-lg font-semibold text-pink-900 dark:text-pink-100">
                        Voir ma collection
                      </p>
                    </div>
                    <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400 fill-current" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Synchronisation des statistiques */}
            {user && (
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
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
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
                            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
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
                          className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white"
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
            <Card className="overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
                            {subjectConfig?.title || subject.subject}
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
                      <Button 
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                        onClick={() => router.push(`/controle?subject=${subject.subject}`)}
                      >
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

        {activeTab === "edit" && (
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader className="px-3 sm:px-4 md:px-6">
                <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Édition du profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-6">
                {/* Avatar */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Photo de profil</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28">
                      <img
                        src={avatarPreview || "/assets/default-avatar.webp"}
                        alt="Aperçu avatar"
                        className="w-full h-full rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-lg"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarFileChange}
                      />
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="w-4 h-4" />
                        Choisir une image
                      </Button>
                      {avatarFile && (
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            className="flex items-center gap-2"
                            disabled={uploadingAvatar}
                            onClick={handleAvatarUpload}
                          >
                            <Upload className="w-4 h-4" />
                            {uploadingAvatar ? "Enregistrement..." : "Enregistrer"}
                          </Button>
                          <Button variant="ghost" onClick={resetAvatarSelection}>
                            Annuler
                          </Button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Formats acceptés : JPG, PNG, WEBP. Taille maximale 5 Mo.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Informations de contact */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Informations de contact</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Numéro de téléphone *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => handleEditFormChange("phone", e.target.value)}
                        placeholder="Ex: +33 6 12 34 56 78"
                        className="mt-1 w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Adresse de livraison</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="street" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Adresse *
                      </Label>
                      <Input
                        id="street"
                        type="text"
                        value={editForm.deliveryAddress.street}
                        onChange={(e) => handleEditFormChange("deliveryAddress.street", e.target.value)}
                        placeholder="Ex: 123 Rue de la Paix"
                        className="mt-1 w-full"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Ville *
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          value={editForm.deliveryAddress.city}
                          onChange={(e) => handleEditFormChange("deliveryAddress.city", e.target.value)}
                          placeholder="Ex: Paris"
                          className="mt-1 w-full"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Code postal *
                        </Label>
                        <Input
                          id="postalCode"
                          type="text"
                          value={editForm.deliveryAddress.postalCode}
                          onChange={(e) => handleEditFormChange("deliveryAddress.postalCode", e.target.value)}
                          placeholder="Ex: 75001"
                          className="mt-1 w-full"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pays *
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        value={editForm.deliveryAddress.country}
                        onChange={(e) => handleEditFormChange("deliveryAddress.country", e.target.value)}
                        placeholder="Ex: France"
                        className="mt-1 w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    disabled={!editForm.phone || !editForm.deliveryAddress.street || !editForm.deliveryAddress.city || !editForm.deliveryAddress.postalCode || !editForm.deliveryAddress.country}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 w-full sm:w-auto"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </div>

                {/* Informations sur les champs obligatoires */}
                <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note :</strong> Les champs marqués d'un astérisque (*) sont obligatoires pour passer des commandes.
                    Assurez-vous de remplir tous les champs requis avant de procéder au paiement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

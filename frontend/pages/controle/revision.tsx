/* eslint-disable no-console */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  BookOpen,
  RefreshCw,
  Trash2,
  RotateCcw,
  ArrowLeft,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  Brain,
  Lightbulb,
  Moon,
  Sun,
} from "lucide-react";
import axios from "axios";
import { handleAuthError } from "@/utils/errorHandler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LightAnimation } from "@/components/DynamicMotion";

interface RevisionError {
  _id: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  category: string;
  date: string;
  questionId?: string;
}

const RevisionPage: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<RevisionError[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchErrors();
    }
  }, [mounted, currentPage, selectedCategory]);

  const fetchErrors = async () => {
    try {
      setIsRefreshing(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      // Récupérer l'ID utilisateur depuis l'objet user stocké
      const userData = localStorage.getItem("user");
      let userId = null;
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user._id;
        } catch (e) {
          console.error("Erreur lors du parsing de l'utilisateur:", e);
        }
      }

      if (!userId) {
        throw new Error("ID utilisateur non trouvé");
      }
      
      console.log("🔍 ID utilisateur trouvé:", userId);

      const url =
        selectedCategory === "all"
          ? `${process.env.NEXT_PUBLIC_API_URL}/revision-errors?userId=${userId}&page=${currentPage}&limit=10`
          : `${process.env.NEXT_PUBLIC_API_URL}/revision-errors?userId=${userId}&category=${selectedCategory}&page=${currentPage}&limit=10`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setErrors(response.data.errors || []);
      setTotalPages(response.data.totalPages || 1);

      // Extraire les catégories uniques
      if (response.data.categories) {
        setCategories(["all", ...response.data.categories]);
      }

      setLastUpdate(new Date());
      console.log("📚 Erreurs de révision mises à jour:", new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error("Erreur lors de la récupération des erreurs:", err);
      
      // Gérer l'erreur 401 (Token expiré)
      if (handleAuthError(err)) {
        return;
      }
      
      setError("Erreur lors du chargement des erreurs de révision");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDeleteError = async (errorId: string) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/revision-errors/${errorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Rafraîchir la liste
      fetchErrors();
    } catch (err) {
      console.error("Erreur lors de la suppression de l&apos;erreur:", err);
      setError("Erreur lors de la suppression de l&apos;erreur");
    }
  };

  const handleRetryQuestion = async (questionId: string) => {
    if (!questionId) return;

    try {
      router.push(`/controle/exercices/${questionId}`);
    } catch (err) {
      console.error("Erreur lors de la redirection:", err);
      setError("Erreur lors de la redirection vers l&apos;exercice");
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Chargement des erreurs de révision...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-xl text-red-700 dark:text-red-300 max-w-md text-center shadow-lg">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="font-bold text-lg mb-2">⚠️ Erreur</p>
          <p className="mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header avec navigation et thème */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                📚 Révision des erreurs
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchErrors}
                disabled={isRefreshing}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques et filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Erreurs à réviser
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                {isRefreshing ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    <span>Mise à jour en cours...</span>
                  </div>
                ) : lastUpdate ? (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span>Dernière mise à jour: {lastUpdate.toLocaleTimeString()}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Chargement...</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              onClick={() => router.push("/controle/exercices")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Nouvel exercice</span>
            </Button>
          </div>

          {/* Filtres par catégorie */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-sm font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  {category === "all" ? "Toutes" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Liste des erreurs */}
        {errors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🎉 Aucune erreur à réviser !
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Félicitations ! Vous n'avez pas d'erreurs à réviser pour le moment.
              </p>
              <Button
                onClick={() => router.push("/controle/exercices")}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Faire un exercice
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {errors.map((error, index) => (
              <LightAnimation key={error._id} animation="slideUp">
                <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Question
                          </h3>
                          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                            {error.category}
                          </Badge>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                          {error.questionText}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <h4 className="font-semibold text-red-700 dark:text-red-300">
                            Votre réponse
                          </h4>
                        </div>
                        <p className="text-red-600 dark:text-red-400 font-medium">
                          {error.selectedAnswer}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <h4 className="font-semibold text-green-700 dark:text-green-300">
                            Réponse correcte
                          </h4>
                        </div>
                        <p className="text-green-600 dark:text-green-400 font-medium">
                          {error.correctAnswer}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(error.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                      
                      <div className="flex space-x-3">
                        {error.questionId && (
                          <Button
                            onClick={() => handleRetryQuestion(error.questionId!)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Réessayer</span>
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteError(error._id)}
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Supprimer</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </LightAnimation>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center mt-8"
              >
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="px-4 py-2"
                  >
                    Précédent
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          className={`px-3 py-2 ${
                            currentPage === page
                              ? "bg-blue-500 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="px-4 py-2"
                  >
                    Suivant
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default RevisionPage;

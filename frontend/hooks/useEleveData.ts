import { useState, useEffect, useCallback, useMemo } from 'react';
import { useEleveStats } from './useEleveStats';
import { 
  SubjectStats, 
  DailyStats, 
  CategoryStats, 
  UserStats,
  safeNumber,
  formatScore
} from '../types/eleve';

const SUBJECTS_CONFIG = {
  math: {
    name: "Mathématiques",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  french: {
    name: "Français",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  sciences: {
    name: "Sciences",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  art: {
    name: "Arts Plastiques",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  history: {
    name: "Histoire",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  },
  geography: {
    name: "Géographie",
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  },
};

export const useEleveData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [advancedStats, setAdvancedStats] = useState<UserStats | null>(null);

  const {
    eleveStats,
    loading: statsLoading,
    error: statsError,
    loadWithSync,
    clearError,
  } = useEleveStats();

  // Les fonctions utilitaires sont maintenant importées depuis les types partagés

  // Récupération de l'utilisateur depuis localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
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
      }
    };

    getUserFromStorage();
  }, []);

  // Fonction pour récupérer les données localStorage d'une matière
  const getLocalStorageData = useCallback((subject: string) => {
    try {
      const data: any = {};

      // Récupérer les réponses utilisateur
      const userAnswers = localStorage.getItem(`${subject}_userAnswers`);
      if (userAnswers) {
        try {
          const parsed = JSON.parse(userAnswers);
          if (parsed && typeof parsed === "object") {
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
      const validatedExercises = localStorage.getItem(`${subject}_validatedExercises`);
      if (validatedExercises) {
        try {
          const parsed = JSON.parse(validatedExercises);
          if (parsed && typeof parsed === "object") {
            data.validatedExercises = parsed;
          }
        } catch (e) {
          console.warn(`Erreur parsing validatedExercises pour ${subject}:`, e);
        }
      }

      return data;
    } catch (error) {
      console.error(`Erreur getLocalStorageData pour ${subject}:`, error);
      return {};
    }
  }, []);

  // Fonction pour calculer les statistiques d'une matière
  const calculateSubjectStats = useCallback((subject: string, data: any): SubjectStats => {
    let totalExercises = 0;
    let correctAnswers = 0;
    let lastActivity = "";

    // Analyser les réponses utilisateur
    if (data.userAnswers && typeof data.userAnswers === "object") {
      const answers = Object.values(data.userAnswers);
      totalExercises += answers.length;
      correctAnswers += answers.filter((answer: any) => answer === true || answer === "correct").length;
      lastActivity = new Date().toISOString();
    }

    // Analyser les résultats
    if (data.results && Array.isArray(data.results)) {
      data.results.forEach((result: any) => {
        totalExercises++;
        if (result.score && safeNumber(result.score) > 70) {
          correctAnswers++;
        }
        lastActivity = new Date().toISOString();
      });
    }

    // Analyser les exercices validés
    if (data.validatedExercises && typeof data.validatedExercises === "object") {
      const validatedCount = Object.values(data.validatedExercises).filter(Boolean).length;
      totalExercises += validatedCount;
      correctAnswers += validatedCount;
      lastActivity = new Date().toISOString();
    }

    const averageScore = totalExercises > 0 ? safeNumber((correctAnswers / totalExercises) * 100) : 0;
    const progress = totalExercises > 0 ? safeNumber((correctAnswers / totalExercises) * 100) : 0;

    return {
      subject: SUBJECTS_CONFIG[subject as keyof typeof SUBJECTS_CONFIG]?.name || subject,
      totalExercises: safeNumber(totalExercises),
      correctAnswers: safeNumber(correctAnswers),
      averageScore,
      progress,
      lastActivity: lastActivity || new Date().toISOString(),
      exercisesCompleted: safeNumber(correctAnswers),
    };
  }, [safeNumber]);

  // Chargement des données localStorage
  const loadLocalData = useCallback(() => {
    try {
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
        setTimeout(() => loadLocalData(), 100);
        return;
      }

      const allSubjectsData: { [key: string]: any } = {};

      // Récupérer les données de toutes les matières
      Object.keys(SUBJECTS_CONFIG).forEach((subject) => {
        const data = getLocalStorageData(subject);
        if (Object.keys(data).length > 0) {
          allSubjectsData[subject] = data;
        }
      });

      // Calculer les statistiques
      const subjectsStats: SubjectStats[] = [];
      let totalExercises = 0;
      let totalCorrect = 0;

      Object.keys(allSubjectsData).forEach((subject) => {
        const stats = calculateSubjectStats(subject, allSubjectsData[subject]);
        if (stats.totalExercises > 0) {
          subjectsStats.push(stats);
          totalExercises += stats.totalExercises;
          totalCorrect += stats.correctAnswers;
        }
      });

      const averageScore = totalExercises > 0 ? (totalCorrect / totalExercises) * 100 : 0;

      // Créer des données de démonstration pour les graphiques
      const dailyStats: DailyStats[] = [
        { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), exercisesCompleted: 3, averageScore: 75 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), exercisesCompleted: 5, averageScore: 82 },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), exercisesCompleted: 2, averageScore: 68 },
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), exercisesCompleted: 4, averageScore: 79 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), exercisesCompleted: 6, averageScore: 85 },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), exercisesCompleted: 3, averageScore: 77 },
        { date: new Date().toISOString(), exercisesCompleted: totalCorrect, averageScore },
      ];

      const categoryStats: CategoryStats[] = subjectsStats.map((subject, index) => ({
        category: subject.subject,
        count: subject.totalExercises,
        percentage: totalExercises > 0 ? (subject.totalExercises / totalExercises) * 100 : 0,
      }));

      const userStats: UserStats = {
        totalExercises,
        totalCorrect,
        averageScore,
        subjects: subjectsStats,
        dailyStats,
        categoryStats,
        subscriptionType: userInfo?.subscriptionType || "Standard",
      };

      setAdvancedStats(userStats);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des données locales:", error);
      setError("Erreur lors du chargement des données");
      setLoading(false);
    }
  }, [getLocalStorageData, calculateSubjectStats, userInfo]);

  // Chargement principal des données
  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        clearError();

        // Charger d'abord les données localStorage (rapide)
        loadLocalData();

        // Essayer l'API en arrière-plan
        try {
          const stats = await loadWithSync();
          if (stats && stats.totalExercises > 0) {
            setAdvancedStats(stats);
          }
        } catch (err) {
          console.warn('API échouée, localStorage conservé:', err);
        }
      } catch (err) {
        console.error("Erreur chargement profil:", err);
        setError("Erreur lors du chargement");
        loadLocalData(); // Fallback sur localStorage
      }
    };

    loadProfile();
  }, [userId, loadWithSync, clearError, loadLocalData]);

  // Valeurs memoizées pour éviter les re-renders
  const memoizedValues = useMemo(() => ({
    loading,
    error,
    userId,
    userInfo,
    advancedStats,
    formatScore,
    safeNumber,
  }), [loading, error, userId, userInfo, advancedStats, formatScore, safeNumber]);

  return memoizedValues;
};
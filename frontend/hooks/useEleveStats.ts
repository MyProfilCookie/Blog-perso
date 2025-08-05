import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface EleveStatsData {
  userId: string;
  userInfo?: {
    prenom: string;
    nom: string;
    email: string;
  };
  totalExercises: number;
  totalCorrect: number;
  averageScore: number;
  subjects: Array<{
    subject: string;
    totalExercises: number;
    correctAnswers: number;
    averageScore: number;
    exercisesCompleted: number;
    progress: number;
    lastActivity: string;
    timeSpent?: number;
  }>;
  dailyStats: Array<{
    date: string;
    exercisesCompleted: number;
    averageScore: number;
    timeSpent: number;
  }>;
  categoryStats: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  globalStats: {
    totalExercises: number;
    totalCorrect: number;
    averageScore: number;
    totalTimeSpent: number;
    streak: number;
  };
  subscriptionType: string;
}

export const useEleveStats = () => {
  const [eleveStats, setEleveStats] = useState<EleveStatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserInfo = useCallback(() => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      const storedUser = localStorage.getItem('user') || localStorage.getItem('userInfo');
      
      if (!token || !storedUser) {
        console.warn('⚠️ Token ou utilisateur non trouvé dans localStorage');
        return null;
      }

      const user = JSON.parse(storedUser);
      const userId = user._id || user.id;

      if (!userId) {
        console.warn('⚠️ UserId non trouvé dans les données utilisateur');
        return null;
      }

      return { userId, token };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des infos utilisateur:', error);
      return null;
    }
  }, []);

  // Charger les statistiques complètes depuis votre API
  const loadCompleteStats = useCallback(async () => {
    const userInfo = getUserInfo();
    if (!userInfo) return null;

    try {
      setLoading(true);
      setError(null);

      console.log(`📊 Chargement des statistiques pour l'utilisateur ${userInfo.userId}`);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/stats/${userInfo.userId}`,
        {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // Augmenter à 30 secondes
        }
      );

      const serverStats = response.data;
      console.log('✅ Stats serveur récupérées:', serverStats);

      // Transformation des données si nécessaire
      const transformedStats = {
        ...serverStats,
        averageScore: serverStats.averageScore?.toFixed(1),
        subjects: serverStats.subjects?.map((subject: any) => ({
          ...subject,
          averageScore: subject.averageScore?.toFixed(1),
        })),
        dailyStats: serverStats.dailyStats?.map((stat: any) => ({
          ...stat,
          averageScore: stat.averageScore?.toFixed(1),
        })),
      };

      setEleveStats(transformedStats);
      return transformedStats;
    } catch (error: any) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
      
      if (error.code === 'ECONNABORTED') {
        console.log('⏱️ Timeout détecté, utilisation de localStorage');
        setError('Connexion lente, utilisation des données locales');
      } else if (error.response?.status === 404) {
        console.log('⚠️ Route non trouvée, utilisation des données localStorage uniquement');
        setError('Serveur indisponible, utilisation des données locales');
      } else {
        setError('Erreur de connexion, utilisation des données locales');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [getUserInfo]);

  // Synchroniser localStorage avec votre API
  const syncLocalStorageData = useCallback(async () => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      console.warn('⚠️ Impossible de synchroniser : utilisateur non connecté');
      return false;
    }

    try {
      console.log('🔄 Synchronisation localStorage avec votre API...');

      // Récupérer les données localStorage
      const allSubjectsData: { [key: string]: any } = {};
      const subjects = [
        'math', 'french', 'sciences', 'art', 'history', 'geography',
        'Mathématiques', 'Français', 'Sciences', 'Arts Plastiques', 'Histoire', 'Géographie'
      ];

      subjects.forEach(subject => {
        const data: any = {};

        const keys = [
          `${subject}_userAnswers`,
          `${subject}_results`, 
          `${subject}_validatedExercises`,
          `${subject}_scores`
        ];

        keys.forEach(key => {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              const parsed = JSON.parse(value);
              if (parsed && (Array.isArray(parsed) || Object.keys(parsed).length > 0)) {
                data[key.replace(`${subject}_`, '')] = parsed;
              }
            } catch (e) {
              console.warn(`⚠️ Erreur parsing ${key}:`, e);
            }
          }
        });

        if (Object.keys(data).length > 0) {
          allSubjectsData[subject] = data;
          console.log(`📚 Données trouvées pour ${subject}:`, Object.keys(data));
        }
      });

      if (Object.keys(allSubjectsData).length === 0) {
        console.log('⚠️ Aucune donnée localStorage à synchroniser');
        return false;
      }

      console.log(`🔄 Synchronisation de ${Object.keys(allSubjectsData).length} matières...`);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/sync-localStorage/${userInfo.userId}`,
        { allSubjectsData },
        {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 secondes pour la synchronisation
        }
      );

      if (response.data.success) {
        console.log('✅ Synchronisation réussie:', response.data.stats);
        console.log('📊 Détails sync:', response.data.syncResults);
        return true;
      } else {
        console.warn('⚠️ Synchronisation échouée:', response.data);
        return false;
      }

    } catch (error: any) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      
      if (error.response) {
        setError(error.response.data?.message || 'Erreur lors de la synchronisation');
      } else if (error.request) {
        setError('Erreur de connexion lors de la synchronisation');
      } else {
        setError('Erreur lors de la synchronisation des données');
      }
      
      return false;
    }
  }, [getUserInfo]);

  // Sauvegarder des données d'exercice spécifiques
  const saveExerciseData = useCallback(async (subject: string, exerciseData: any) => {
    const userInfo = getUserInfo();
    if (!userInfo) return false;

    try {
      console.log(`💾 Sauvegarde données pour ${subject}`);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/save-exercise-data/${userInfo.userId}`,
        { subject, exerciseData },
        {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log(`✅ Données sauvegardées pour ${subject}`);
        // Recharger les stats après sauvegarde
        await loadCompleteStats();
        return true;
      }

      return false;
    } catch (error: any) {
      console.error(`❌ Erreur sauvegarde ${subject}:`, error);
      setError(error.response?.data?.message || 'Erreur lors de la sauvegarde');
      return false;
    }
  }, [getUserInfo, loadCompleteStats]);

  // Charger avec synchronisation automatique
  const loadWithSync = useCallback(async () => {
    try {
      console.log('🚀 Chargement avec fallback rapide...');
      
      // Promise race : soit l'API répond rapidement, soit on passe au localStorage
      const apiPromise = loadCompleteStats();
      const timeoutPromise = new Promise(resolve => 
        setTimeout(() => resolve(null), 5000) // 5 secondes max
      );

      const stats = await Promise.race([apiPromise, timeoutPromise]);
      
      if (stats && stats.totalExercises > 0) {
        console.log('✅ Données API chargées rapidement');
        return stats;
      } else {
        console.log('⚠️ API lente ou pas de données, utilisation localStorage');
        return null;
      }
      
    } catch (error) {
      console.error('❌ Erreur loadWithSync:', error);
      return null;
    }
  }, [loadCompleteStats]);

  // Supprimer toutes les données utilisateur
  const deleteAllUserData = useCallback(async () => {
    const userInfo = getUserInfo();
    if (!userInfo) return false;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/delete-all-data/${userInfo.userId}`,
        {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        }
      );

      if (response.data.success) {
        setEleveStats(null);
        console.log('🗑️ Toutes les données utilisateur supprimées');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('❌ Erreur suppression données:', error);
      setError(error.response?.data?.message || 'Erreur lors de la suppression');
      return false;
    }
  }, [getUserInfo]);

  // Auto-sync périodique (optionnel)
  useEffect(() => {
    const userInfo = getUserInfo();
    if (!userInfo) return;

    // Synchroniser toutes les 5 minutes si l'utilisateur est actif
    const syncInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Synchronisation automatique périodique...');
        syncLocalStorageData().catch(console.warn);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(syncInterval);
  }, [syncLocalStorageData, getUserInfo]);

  return {
    // États
    eleveStats,
    loading,
    error,
    
    // Méthodes principales
    loadCompleteStats,
    syncLocalStorageData,
    loadWithSync,
    
    // Méthodes utilitaires
    saveExerciseData,
    deleteAllUserData,
    clearError: () => setError(null),
    
    // Info utilisateur
    userInfo: getUserInfo()
  };
};

export default useEleveStats;
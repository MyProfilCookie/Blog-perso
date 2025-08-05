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
    if (!userInfo) {
      console.warn('⚠️ Impossible de charger les stats : utilisateur non connecté');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`📊 Chargement des statistiques pour l'utilisateur ${userInfo.userId}`);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/complete-stats/${userInfo.userId}`,
        {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 secondes de timeout
        }
      );

      const stats = response.data;
      setEleveStats(stats);
      
      console.log('✅ Statistiques chargées depuis votre API:', {
        totalExercises: stats.totalExercises,
        averageScore: stats.averageScore?.toFixed(1),
        subjectsCount: stats.subjects?.length || 0
      });

      return stats;
    } catch (error: any) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
      
      if (error.response) {
        // Erreur du serveur
        setError(error.response.data?.message || 'Erreur serveur');
      } else if (error.request) {
        // Erreur réseau
        setError('Erreur de connexion au serveur');
      } else {
        // Autre erreur
        setError('Erreur lors du chargement des données');
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
      console.log('🚀 Chargement avec synchronisation automatique...');
      
      // 1. Charger les stats existantes depuis l'API
      const stats = await loadCompleteStats();
      
      // 2. Si pas de données ou peu de données, synchroniser localStorage
      if (!stats || stats.totalExercises === 0) {
        console.log('📊 Pas de données serveur détectées, tentative de synchronisation localStorage...');
        
        const syncSuccess = await syncLocalStorageData();
        
        if (syncSuccess) {
          console.log('🔄 Synchronisation réussie, rechargement des statistiques...');
          // 3. Recharger après synchronisation
          return await loadCompleteStats();
        } else {
          console.log('⚠️ Synchronisation échouée, retour des stats vides');
        }
      } else {
        console.log('✅ Données serveur trouvées, pas besoin de synchronisation');
      }
      
      return stats;
    } catch (error) {
      console.error('❌ Erreur lors du chargement avec sync:', error);
      setError('Erreur lors du chargement des données');
      return null;
    }
  }, [loadCompleteStats, syncLocalStorageData]);

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
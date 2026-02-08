import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface StatsData {
  totalEleves: number;
  averageScore: string;
  progression: string;
  eleve: {
    nom: string;
    prenom: string;
    modificationsCount: number;
    lastModificationDate: string;
  };
}

interface CacheEntry {
  data: StatsData;
  timestamp: number;
}

const CACHE_KEY = 'stats_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useStatsCache(userId: string | null) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true); // Commence à true pour éviter le blocage initial
  const [error, setError] = useState<Error | null>(null);

  const getCachedStats = useCallback((): StatsData | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`);
      if (!cached) return null;

      const entry: CacheEntry = JSON.parse(cached);
      const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;

      if (isExpired) {
        localStorage.removeItem(`${CACHE_KEY}_${userId}`);
        return null;
      }

      return entry.data;
    } catch (err) {
      return null;
    }
  }, [userId]);

  const setCachedStats = useCallback((data: StatsData) => {
    if (typeof window === 'undefined' || !userId) return;

    try {
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(entry));
    } catch (err) {
      console.error('Error caching stats:', err);
    }
  }, [userId]);

  const fetchStats = useCallback(async (forceRefresh = false) => {
    if (!userId) {
      setLoading(false);
      return null;
    }

    // Try cache first unless force refresh
    if (!forceRefresh) {
      const cached = getCachedStats();
      if (cached) {
        setStats(cached);
        setLoading(false);
        return cached;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      
      if (!token) {
        console.warn('⚠️ Pas de token trouvé, affichage en mode aperçu');
        setLoading(false);
        return null;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/stats/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          // Add axios cache config and timeout
          adapter: 'fetch' as any,
          timeout: 10000, // 10 secondes max
        }
      );

      // Calculer la progression si non fournie par le backend
      const totalExercises = response.data.totalEleves || response.data.totalExercises || 0;
      const maxExercises = 450;
      const calculatedProgression = totalExercises > 0 ? ((totalExercises / maxExercises) * 100).toFixed(2) : '0';

      const statsData: StatsData = {
        totalEleves: totalExercises,
        averageScore: response.data.averageScore || '0',
        progression: response.data.progression || calculatedProgression,
        eleve: response.data.eleve || {
          nom: '',
          prenom: '',
          modificationsCount: 0,
          lastModificationDate: '',
        },
      };

      setStats(statsData);
      setCachedStats(statsData);
      return statsData;
    } catch (err: any) {
      console.error('❌ Erreur lors du chargement des stats:', err);
      setError(err);
      // Try to use stale cache on error
      const cached = getCachedStats();
      if (cached) {
        console.log('✅ Utilisation du cache en cas d\'erreur');
        setStats(cached);
      }
      // Ne pas bloquer l'affichage même en cas d'erreur
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, getCachedStats, setCachedStats]);

  const invalidateCache = useCallback(() => {
    if (typeof window !== 'undefined' && userId) {
      localStorage.removeItem(`${CACHE_KEY}_${userId}`);
    }
  }, [userId]);

  // Charger automatiquement les stats quand userId change
  useEffect(() => {
    if (userId) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [userId, fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    invalidateCache,
    refetch: () => fetchStats(true),
  };
}


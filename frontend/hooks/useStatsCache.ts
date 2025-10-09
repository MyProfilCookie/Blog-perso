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
  const [loading, setLoading] = useState(false);
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
    if (!userId) return;

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
        setLoading(false);
        return null;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/stats/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          // Add axios cache config
          adapter: 'fetch' as any,
        }
      );

      const statsData: StatsData = {
        totalEleves: response.data.totalEleves || 0,
        averageScore: response.data.averageScore || '0',
        progression: '0',
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
      setError(err);
      // Try to use stale cache on error
      const cached = getCachedStats();
      if (cached) {
        setStats(cached);
      }
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

  return {
    stats,
    loading,
    error,
    fetchStats,
    invalidateCache,
    refetch: () => fetchStats(true),
  };
}


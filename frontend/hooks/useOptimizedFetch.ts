import { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface UseOptimizedFetchOptions extends AxiosRequestConfig {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

interface UseOptimizedFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const cache = new Map<string, { data: any; timestamp: number; staleTime: number }>();

export function useOptimizedFetch<T>(
  url: string,
  options: UseOptimizedFetchOptions = {}
): UseOptimizedFetchResult<T> {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes par défaut
    cacheTime = 10 * 60 * 1000, // 10 minutes par défaut
    ...axiosOptions
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Vérifier le cache
    const cacheKey = `${url}_${JSON.stringify(axiosOptions)}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < cachedData.staleTime) {
      setData(cachedData.data);
      return;
    }

    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        url,
        signal: abortControllerRef.current.signal,
        timeout: 10000, // 10 secondes de timeout
        ...axiosOptions,
      });

      const responseData = response.data;
      setData(responseData);

      // Mettre en cache
      cache.set(cacheKey, {
        data: responseData,
        timestamp: Date.now(),
        staleTime,
      });

      // Nettoyer le cache après cacheTime
      setTimeout(() => {
        cache.delete(cacheKey);
      }, cacheTime);

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  }, [url, enabled, staleTime, cacheTime, axiosOptions]);

  const refetch = useCallback(() => {
    const cacheKey = `${url}_${JSON.stringify(axiosOptions)}`;
    cache.delete(cacheKey); // Supprimer du cache pour forcer le refetch
    fetchData();
  }, [fetchData, url, axiosOptions]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, loading, error, refetch };
}
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { PERFORMANCE_CONFIG } from '@/lib/performance';

interface UseOptimizedDataLoadingOptions<T> {
  loadFunction: () => Promise<T>;
  cacheKey?: string;
  cacheTTL?: number;
  priority?: 'high' | 'medium' | 'low';
  dependencies?: any[];
  immediate?: boolean;
}

interface UseOptimizedDataLoadingReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export const useOptimizedDataLoading = <T = any>(
  options: UseOptimizedDataLoadingOptions<T>
): UseOptimizedDataLoadingReturn<T> => {
  const {
    loadFunction,
    cacheKey,
    cacheTTL = PERFORMANCE_CONFIG.CACHE.LOCAL_STORAGE_TTL,
    priority = 'medium',
    dependencies = [],
    immediate = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const getCachedData = useCallback((key: string): T | null => {
    if (!cacheKey) return null;
    
    const cached = cacheRef.current.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > cacheTTL;
    if (isExpired) {
      cacheRef.current.delete(key);
      return null;
    }
    
    return cached.data;
  }, [cacheKey, cacheTTL]);

  const setCachedData = useCallback((key: string, data: T) => {
    if (!cacheKey) return;
    cacheRef.current.set(key, { data, timestamp: Date.now() });
  }, [cacheKey]);

  const clearCache = useCallback(() => {
    if (!cacheKey) return;
    cacheRef.current.delete(cacheKey);
  }, [cacheKey]);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Annuler la requête précédente si elle existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Créer un nouveau contrôleur d'annulation
      abortControllerRef.current = new AbortController();

      // Vérifier le cache en premier
      const cachedData = getCachedData(cacheKey || 'default');
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // Charger les données avec priorité
      const timeout = priority === 'high' ? 3000 : priority === 'medium' ? 5000 : 10000;
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), timeout);
      });

      const dataPromise = loadFunction();
      
      const result = await Promise.race([dataPromise, timeoutPromise]);
      
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      setData(result);
      setCachedData(cacheKey || 'default', result);
      
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [loadFunction, cacheKey, getCachedData, setCachedData, priority]);

  const refetch = useCallback(async (): Promise<void> => {
    clearCache();
    await loadData();
  }, [clearCache, loadData]);

  useEffect(() => {
    if (immediate) {
      // Délai basé sur la priorité pour éviter le chargement simultané
      const delay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 300;
      
      const timer = setTimeout(() => {
        loadData();
      }, delay);

      return () => {
        clearTimeout(timer);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }
  }, [immediate, loadData, priority, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
};

"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { PERFORMANCE_CONFIG, retryRequest, optimizeLocalStorage } from '@/lib/performance';

interface UseOptimizedApiOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  cacheKey?: string;
  cacheTTL?: number;
  retry?: boolean;
  dependencies?: any[];
  immediate?: boolean;
}

interface UseOptimizedApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (config?: Partial<UseOptimizedApiOptions>) => Promise<T | null>;
  refetch: () => Promise<T | null>;
  clearCache: () => void;
}

export const useOptimizedApi = <T = any>(options: UseOptimizedApiOptions): UseOptimizedApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    url,
    method = 'GET',
    data: requestData,
    headers = {},
    timeout = PERFORMANCE_CONFIG.API_TIMEOUTS.NORMAL,
    cacheKey,
    cacheTTL = PERFORMANCE_CONFIG.CACHE.API_CACHE_TTL,
    retry = true,
    dependencies = [],
    immediate = true,
  } = options;

  // Fonction pour vérifier le cache
  const getCachedData = useCallback((key: string): T | null => {
    if (!cacheKey) return null;
    
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTTL) {
      return cached.data;
    }
    
    // Essayer localStorage comme fallback
    const localCached = optimizeLocalStorage.get(key);
    if (localCached && Date.now() - localCached.timestamp < cacheTTL) {
      return localCached.data;
    }
    
    return null;
  }, [cacheKey, cacheTTL]);

  // Fonction pour mettre en cache
  const setCachedData = useCallback((key: string, data: T) => {
    if (!cacheKey) return;
    
    const cacheEntry = { data, timestamp: Date.now() };
    cacheRef.current.set(key, cacheEntry);
    optimizeLocalStorage.set(key, cacheEntry);
  }, [cacheKey]);

  // Fonction pour nettoyer le cache
  const clearCache = useCallback(() => {
    if (cacheKey) {
      cacheRef.current.delete(cacheKey);
      optimizeLocalStorage.remove(cacheKey);
    }
  }, [cacheKey]);

  // Fonction principale d'exécution
  const execute = useCallback(async (config?: Partial<UseOptimizedApiOptions>): Promise<T | null> => {
    const finalConfig = { ...options, ...config };
    const finalUrl = finalConfig.url;
    const finalCacheKey = finalConfig.cacheKey || finalUrl;

    try {
      setLoading(true);
      setError(null);

      // Vérifier le cache en premier
      const cachedData = getCachedData(finalCacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return cachedData;
      }

      // Annuler la requête précédente si elle existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Créer un nouveau contrôleur d'annulation
      abortControllerRef.current = new AbortController();

      const axiosConfig: AxiosRequestConfig = {
        method: finalConfig.method,
        url: finalUrl,
        data: finalConfig.data,
        headers: {
          'Content-Type': 'application/json',
          ...finalConfig.headers,
        },
        timeout: finalConfig.timeout,
        signal: abortControllerRef.current.signal,
      };

      // Ajouter le token d'authentification si disponible
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      if (token) {
        axiosConfig.headers = {
          ...axiosConfig.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const makeRequest = async (): Promise<AxiosResponse<T>> => {
        return axios(axiosConfig);
      };

      const response = finalConfig.retry 
        ? await retryRequest(makeRequest)
        : await makeRequest();

      const responseData = response.data;

      // Mettre en cache la réponse
      setCachedData(finalCacheKey, responseData);
      setData(responseData);
      
      return responseData;

    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Requête annulée, ne pas afficher d'erreur
        return null;
      }

      const errorMessage = err.response?.data?.message || err.message || 'Erreur de requête';
      setError(errorMessage);
      
      console.error('❌ Erreur API:', {
        url: finalUrl,
        method: finalConfig.method,
        error: errorMessage,
        status: err.response?.status,
      });

      return null;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [options, getCachedData, setCachedData]);

  // Fonction de refetch
  const refetch = useCallback(async (): Promise<T | null> => {
    clearCache();
    return execute();
  }, [clearCache, execute]);

  // Exécution automatique
  useEffect(() => {
    if (immediate) {
      execute();
    }

    // Cleanup lors du démontage
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
    clearCache,
  };
};

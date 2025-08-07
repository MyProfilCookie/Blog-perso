import { useMemo, useCallback, useState, useEffect } from 'react';

// Hook personnalisé pour mémoriser les calculs coûteux
export const useMemoizedCalculation = <T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T => {
  return useMemo(calculation, dependencies);
};

// Hook pour mémoriser les fonctions de callback
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T => {
  return useCallback(callback, dependencies) as T;
};

// Fonction pour créer des clés de cache stables
export const createCacheKey = (...args: any[]): string => {
  return JSON.stringify(args);
};

// Cache simple pour les données
class SimpleCache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000; // Convertir en millisecondes
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Vérifier si l'élément a expiré
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Instance globale du cache pour les données d'élève
export const eleveDataCache = new SimpleCache(10); // 10 minutes TTL

// Hook pour utiliser le cache avec React
export const useCachedData = <T>(
  key: string,
  fetchFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
) => {
  return useMemo(() => {
    const cachedData = eleveDataCache.get(key);
    if (cachedData) {
      return Promise.resolve(cachedData);
    }

    return fetchFunction().then((data) => {
      eleveDataCache.set(key, data);
      return data;
    });
  }, [key, ...dependencies]);
};

// Fonction pour optimiser les objets de style
export const memoizeStyles = <T extends Record<string, any>>(
  styles: T
): T => {
  return useMemo(() => styles, [JSON.stringify(styles)]);
};

// Fonction pour débouncer les appels de fonction
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Hook pour débouncer une valeur
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
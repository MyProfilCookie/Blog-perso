// Configuration des optimisations de performance

export const PERFORMANCE_CONFIG = {
  // Timeouts pour les requêtes API
  API_TIMEOUTS: {
    FAST: 3000,    // 3 secondes pour les requêtes critiques
    NORMAL: 5000,  // 5 secondes pour les requêtes normales
    SLOW: 10000,   // 10 secondes pour les requêtes lentes
  },

  // Configuration du cache
  CACHE: {
    LOCAL_STORAGE_TTL: 24 * 60 * 60 * 1000, // 24 heures
    MEMORY_CACHE_TTL: 5 * 60 * 1000,        // 5 minutes
    API_CACHE_TTL: 10 * 60 * 1000,          // 10 minutes
  },

  // Configuration des images
  IMAGES: {
    QUALITY: 85,
    FORMATS: ['webp', 'avif'],
    SIZES: {
      THUMBNAIL: 150,
      SMALL: 300,
      MEDIUM: 600,
      LARGE: 1200,
    },
  },

  // Configuration du lazy loading
  LAZY_LOADING: {
    THRESHOLD: 0.1,
    ROOT_MARGIN: '50px',
  },

  // Configuration des animations
  ANIMATIONS: {
    DURATION: {
      FAST: 200,
      NORMAL: 300,
      SLOW: 500,
    },
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Fonction pour optimiser les données
export const optimizeData = (data: any) => {
  if (!data) return null;
  
  // Supprimer les propriétés inutiles
  const { __v, _id, ...optimizedData } = data;
  
  return optimizedData;
};

// Fonction pour débouncer les appels API
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Fonction pour throttler les appels API
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Fonction pour précharger les ressources
export const preloadResource = (href: string, as: string) => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Fonction pour mesurer les performances
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window === 'undefined') {
    fn();
    return;
  }
  
  const start = performance.now();
  fn();
  const end = performance.now();
  
  console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
};

// Fonction pour optimiser les requêtes localStorage
export const optimizeLocalStorage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Erreur lors de la lecture de ${key}:`, error);
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Erreur lors de l'écriture de ${key}:`, error);
      return false;
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Erreur lors de la suppression de ${key}:`, error);
      return false;
    }
  },
};

// Configuration des retry pour les requêtes API
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  BACKOFF_MULTIPLIER: 2,
};

// Fonction pour retry les requêtes API
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  config = RETRY_CONFIG
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= config.MAX_RETRIES; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === config.MAX_RETRIES) {
        throw lastError;
      }
      
      // Attendre avant de réessayer avec backoff exponentiel
      const delay = config.RETRY_DELAY * Math.pow(config.BACKOFF_MULTIPLIER, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

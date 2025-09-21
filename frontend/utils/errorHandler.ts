import { AxiosError } from 'axios';

export interface ErrorHandlerOptions {
  maxRetries?: number;
  retryDelay?: number;
  fallbackValue?: any;
  onError?: (error: Error) => void;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

export class ApiError extends Error {
  public status?: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

export const isTimeoutError = (error: any): boolean => {
  return error.code === 'ECONNABORTED' || error.message?.includes('timeout');
};

export const isServerError = (error: any): boolean => {
  return error.response?.status >= 500;
};

export const shouldRetryRequest = (error: any, attempt: number): boolean => {
  if (attempt >= 3) return false;
  
  return (
    isNetworkError(error) ||
    isTimeoutError(error) ||
    isServerError(error)
  );
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    fallbackValue,
    onError,
    shouldRetry = shouldRetryRequest
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (onError) {
        onError(lastError);
      }

      // Si c'est la dernière tentative ou si on ne doit pas réessayer
      if (attempt === maxRetries || !shouldRetry(lastError, attempt)) {
        break;
      }

      // Attendre avant de réessayer avec backoff exponentiel
      const delayMs = retryDelay * Math.pow(2, attempt - 1);
      await delay(delayMs);
    }
  }

  // Si on a une valeur de fallback, la retourner
  if (fallbackValue !== undefined) {
    console.warn('Using fallback value after all retries failed:', lastError);
    return fallbackValue;
  }

  // Sinon, lancer l'erreur
  throw lastError || new Error('Unknown error occurred');
};

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Erreur de réponse du serveur
    const { status, data } = error.response;
    const message = data?.message || data?.error || 'Une erreur est survenue';
    return new ApiError(message, status, data?.code, data);
  } else if (error.request) {
    // Erreur de réseau
    return new ApiError(
      'Problème de connexion. Vérifiez votre connexion internet.',
      0,
      'NETWORK_ERROR'
    );
  } else {
    // Autre erreur
    return new ApiError(error.message || 'Une erreur inattendue est survenue');
  }
};

export const createErrorHandler = (options: ErrorHandlerOptions = {}) => {
  return (error: any) => {
    const apiError = handleApiError(error);
    
    if (options.onError) {
      options.onError(apiError);
    }

    // Log l'erreur pour le debugging
    console.error('API Error:', {
      message: apiError.message,
      status: apiError.status,
      code: apiError.code,
      details: apiError.details,
      timestamp: new Date().toISOString()
    });

    return apiError;
  };
};

export const withErrorBoundary = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: ErrorHandlerOptions = {}
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await withRetry(() => fn(...args), options);
    } catch (error) {
      const handler = createErrorHandler(options);
      throw handler(error);
    }
  };
};

// Utilitaires pour les hooks
export const useErrorHandler = () => {
  const handleError = (error: any, context?: string) => {
    const apiError = handleApiError(error);
    
    console.error(`Error in ${context || 'unknown context'}:`, apiError);
    
    // Ici, on pourrait intégrer avec un système de notification
    // toast.error(apiError.message);
    
    return apiError;
  };

  const withErrorHandling = <T>(
    promise: Promise<T>,
    context?: string,
    fallback?: T
  ): Promise<T> => {
    return promise.catch(error => {
      handleError(error, context);
      if (fallback !== undefined) {
        return fallback;
      }
      throw error;
    });
  };

  return { handleError, withErrorHandling };
};

// Types pour TypeScript
export type ErrorHandler = (error: any) => ApiError;
export type RetryFunction<T> = () => Promise<T>;
export type ErrorBoundaryFunction<T extends any[], R> = (...args: T) => Promise<R>;
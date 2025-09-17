"use client";

import { useEffect, useState } from 'react';

interface ChunkErrorFallbackProps {
  onRetry?: () => void;
}

export default function ChunkErrorFallback({ onRetry }: ChunkErrorFallbackProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      // Nettoyer le cache du navigateur
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      // Nettoyer le localStorage des chunks (seulement côté client)
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('chunk') || key.includes('webpack')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Attendre un peu avant de recharger
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Recharger la page (seulement côté client)
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors du retry:', error);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    // Auto-retry après 3 secondes si pas d'action utilisateur
    const timer = setTimeout(() => {
      if (retryCount === 0) {
        handleRetry();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [retryCount]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg 
            className="mx-auto h-12 w-12 text-orange-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Mise à jour de l'application
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Une nouvelle version de l'application est disponible. 
          Nous mettons à jour automatiquement...
        </p>
        
        {isRetrying ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-600">Mise à jour en cours...</span>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Mettre à jour maintenant
            </button>
            
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        )}
        
        {retryCount > 0 && (
          <p className="mt-4 text-sm text-gray-500">
            Tentative {retryCount} de mise à jour
          </p>
        )}
      </div>
    </div>
  );
}

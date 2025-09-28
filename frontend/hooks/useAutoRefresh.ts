import { useEffect, useRef, useCallback } from 'react';

interface UseAutoRefreshOptions {
  interval?: number; // Intervalle en millisecondes (défaut: 30000 = 30s)
  enabled?: boolean; // Activer/désactiver le rafraîchissement automatique
  onRefresh: () => void | Promise<void>; // Fonction à exécuter
  onError?: (error: Error) => void; // Gestionnaire d'erreur
}

export const useAutoRefresh = ({
  interval = 30000, // 30 secondes par défaut
  enabled = true,
  onRefresh,
  onError
}: UseAutoRefreshOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) {
      return; // Éviter les rafraîchissements simultanés
    }

    try {
      isRefreshingRef.current = true;
      await onRefresh();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement automatique:', error);
      if (onError) {
        onError(error as Error);
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [onRefresh, onError]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Rafraîchissement initial
    refresh();

    // Configurer l'intervalle
    intervalRef.current = setInterval(refresh, interval);

    // Nettoyage
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, refresh]);

  // Fonction pour forcer un rafraîchissement manuel
  const forceRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  // Fonction pour arrêter le rafraîchissement automatique
  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Fonction pour redémarrer le rafraîchissement automatique
  const startAutoRefresh = useCallback(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(refresh, interval);
    }
  }, [interval, refresh]);

  return {
    forceRefresh,
    stopAutoRefresh,
    startAutoRefresh,
    isRefreshing: isRefreshingRef.current
  };
};

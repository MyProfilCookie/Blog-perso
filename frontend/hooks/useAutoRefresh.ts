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
  const onRefreshRef = useRef(onRefresh); // Stocker onRefresh dans un ref
  const onErrorRef = useRef(onError); // Stocker onError dans un ref
  const hasInitializedRef = useRef(false); // Flag pour éviter le rafraîchissement initial multiple

  // Mettre à jour les refs quand les fonctions changent
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) {
      console.log('⏸️ Rafraîchissement déjà en cours, skip');
      return; // Éviter les rafraîchissements simultanés
    }

    try {
      isRefreshingRef.current = true;
      await onRefreshRef.current(); // Utiliser la ref au lieu de la dépendance
    } catch (error) {
      console.error('Erreur lors du rafraîchissement automatique:', error);
      if (onErrorRef.current) {
        onErrorRef.current(error as Error);
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, []); // Pas de dépendances - utilise des refs

  useEffect(() => {
    if (!enabled) {
      hasInitializedRef.current = false;
      return;
    }

    // Éviter le rafraîchissement initial multiple
    if (!hasInitializedRef.current) {
      console.log('🔄 Initialisation du rafraîchissement automatique');
      // Rafraîchissement initial
      refresh();
      hasInitializedRef.current = true;
    }

    // Configurer l'intervalle
    intervalRef.current = setInterval(refresh, interval);

    // Nettoyage
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, refresh]); // refresh est stable maintenant

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

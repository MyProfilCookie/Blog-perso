/**
 * Hook personnalisé pour la gestion des tokens
 * Utilise le TokenManager centralisé avec des callbacks React
 */

import { useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import tokenManager from '@/utils/tokenManager';

export const useTokenManager = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);

  // Callback appelé quand le token expire
  const handleTokenExpired = useCallback(() => {
    console.log('🔄 Token expiré - Mise à jour du contexte utilisateur');
    if (userContext?.logoutUser) {
      userContext.logoutUser();
    }
  }, [userContext]);

  // Callback appelé quand le token est rafraîchi
  const handleTokenRefreshed = useCallback((newToken) => {
    console.log('✅ Token rafraîchi - Mise à jour du contexte utilisateur');
    // Le contexte utilisateur sera mis à jour automatiquement via les événements
  }, []);

  // Initialiser le gestionnaire de tokens
  useEffect(() => {
    tokenManager.init(router, handleTokenExpired, handleTokenRefreshed);
  }, [router, handleTokenExpired, handleTokenRefreshed]);

  // Fonctions exposées
  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem('userToken');
    return tokenManager.isTokenExpired(token);
  }, []);

  const refreshToken = useCallback(async (showNotifications = true) => {
    return await tokenManager.attemptTokenRefresh(showNotifications);
  }, []);

  const handleExpiredToken = useCallback(async (showNotification = true) => {
    return await tokenManager.handleTokenExpiration(showNotification);
  }, []);

  const clearTokens = useCallback(() => {
    tokenManager.clearTokens();
  }, []);

  return {
    checkTokenExpiration,
    refreshToken,
    handleExpiredToken,
    clearTokens,
    isTokenExpired: tokenManager.isTokenExpired.bind(tokenManager)
  };
};

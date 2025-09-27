/**
 * Composant pour gérer les notifications d'expiration de tokens
 * Utilise le TokenManager centralisé
 */

"use client";

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import tokenManager from '@/utils/tokenManager';

interface TokenExpirationHandlerProps {
  children: React.ReactNode;
}

export const TokenExpirationHandler: React.FC<TokenExpirationHandlerProps> = ({ children }) => {
  const router = useRouter();
  const userContext = useContext(UserContext);

  useEffect(() => {
    // Initialiser le gestionnaire de tokens
    tokenManager.init(
      router,
      // Callback quand le token expire
      () => {
        console.log('🔄 Token expiré - Mise à jour du contexte utilisateur');
        if (userContext?.logoutUser) {
          userContext.logoutUser();
        }
      },
      // Callback quand le token est rafraîchi
      (newToken) => {
        console.log('✅ Token rafraîchi - Mise à jour du contexte utilisateur');
        // Le contexte utilisateur sera mis à jour automatiquement via les événements
      }
    );

    // Vérifier l'expiration du token au chargement
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('userToken');
      if (token && tokenManager.isTokenExpired(token)) {
        console.log('🚨 Token expiré détecté au chargement');
        tokenManager.handleTokenExpiration(true);
      }
    };

    // Vérifier immédiatement
    checkTokenExpiration();

    // Vérifier périodiquement (toutes les 5 minutes)
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [router, userContext]);

  return <>{children}</>;
};

export default TokenExpirationHandler;

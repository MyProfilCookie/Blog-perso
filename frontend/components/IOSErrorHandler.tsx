"use client";

import { useEffect } from 'react';

export default function IOSErrorHandler() {
  useEffect(() => {
    // Détecter iOS/Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS || isSafari) {
      // Gérer les erreurs spécifiques à iOS
      const handleError = (event: ErrorEvent) => {
        console.error('Erreur iOS/Safari:', event.error);
        
        // Gérer les erreurs de mémoire
        if (event.error?.message?.includes('memory') || 
            event.error?.message?.includes('quota')) {
          console.warn('Erreur de mémoire détectée, nettoyage en cours...');
          
          // Nettoyer le cache localStorage
          try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
              if (key.startsWith('cache-') || key.startsWith('temp-')) {
                localStorage.removeItem(key);
              }
            });
          } catch (e) {
            console.warn('Impossible de nettoyer le localStorage:', e);
          }
        }
        
        // Gérer les erreurs de réseau
        if (event.error?.message?.includes('network') || 
            event.error?.message?.includes('fetch')) {
          console.warn('Erreur de réseau détectée');
          
          // Retry automatique après 2 secondes
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      };
      
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        console.error('Promesse rejetée non gérée:', event.reason);
        
        // Gérer les erreurs de chargement de modules
        if (event.reason?.message?.includes('Loading chunk') ||
            event.reason?.message?.includes('ChunkLoadError')) {
          console.warn('Erreur de chargement de chunk détectée, rechargement...');
          
          // Forcer le rechargement pour résoudre les chunks corrompus
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      };
      
      // Ajouter les listeners d'erreur
      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      
      // Nettoyage
      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);
  
  return null;
}


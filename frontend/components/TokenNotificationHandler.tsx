/**
 * Composant simple pour gérer les notifications d'expiration de tokens
 * Utilise les intercepteurs Axios existants
 */

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const TokenNotificationHandler = () => {
  const router = useRouter();

  useEffect(() => {
    // Écouter les événements de déconnexion pour afficher des notifications
    const handleTokenExpiration = () => {
      // Vérifier si on est sur la page de login avec le paramètre expired
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('expired') === 'true') {
          // Importer dynamiquement SweetAlert2
          import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
              title: '🔐 Session expirée',
              html: `
                <div class="text-center">
                  <p class="mb-4">Votre session a expiré pour des raisons de sécurité.</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Veuillez vous reconnecter pour continuer à utiliser l'application.
                  </p>
                </div>
              `,
              icon: 'warning',
              confirmButtonText: 'Se reconnecter',
              confirmButtonColor: '#4ECDC4',
              allowOutsideClick: false,
              allowEscapeKey: false,
              customClass: {
                popup: 'dark:bg-gray-800 dark:text-white',
                title: 'dark:text-white',
                confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg'
              }
            });
          });
        }
      }
    };

    // Vérifier au chargement de la page
    handleTokenExpiration();

    // Écouter les changements d'URL
    const handleUrlChange = () => {
      handleTokenExpiration();
    };

    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [router]);

  return null; // Ce composant n'affiche rien
};

export default TokenNotificationHandler;

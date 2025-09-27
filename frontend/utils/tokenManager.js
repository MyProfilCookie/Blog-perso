/**
 * Gestionnaire centralisé des tokens avec notifications utilisateur
 * Gère l'expiration, le rafraîchissement et la déconnexion automatique
 */

import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

class TokenManager {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
    this.router = null;
    this.onTokenExpired = null;
    this.onTokenRefreshed = null;
  }

  /**
   * Initialise le gestionnaire de tokens
   * @param {object} router - Router Next.js
   * @param {function} onTokenExpired - Callback appelé quand le token expire
   * @param {function} onTokenRefreshed - Callback appelé quand le token est rafraîchi
   */
  init(router, onTokenExpired = null, onTokenRefreshed = null) {
    this.router = router;
    this.onTokenExpired = onTokenExpired;
    this.onTokenRefreshed = onTokenRefreshed;
  }

  /**
   * Vérifie si un token est expiré
   * @param {string} token - Token à vérifier
   * @returns {boolean} - True si le token est expiré
   */
  isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return true;
    }
  }

  /**
   * Rafraîchit le token d'accès
   * @returns {Promise<string|null>} - Nouveau token ou null si échec
   */
  async refreshToken() {
    if (this.isRefreshing) {
      // Si un refresh est déjà en cours, attendre
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.processQueue(new Error('Aucun refresh token disponible'), null);
      return null;
    }

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
      
      const response = await fetch(`${apiUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Échec du rafraîchissement du token');
      }

      const data = await response.json();
      
      if (data.accessToken) {
        // Sauvegarder les nouveaux tokens
        localStorage.setItem('userToken', data.accessToken);
        localStorage.setItem('accessToken', data.accessToken);
        
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        console.log('✅ Token rafraîchi avec succès');
        
        // Notifier le callback
        if (this.onTokenRefreshed) {
          this.onTokenRefreshed(data.accessToken);
        }

        this.processQueue(null, data.accessToken);
        return data.accessToken;
      } else {
        throw new Error('Token manquant dans la réponse');
      }
    } catch (error) {
      console.error('❌ Échec du rafraîchissement du token:', error);
      this.processQueue(error, null);
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Traite la file d'attente des requêtes en attente
   * @param {Error|null} error - Erreur ou null
   * @param {string|null} token - Token ou null
   */
  processQueue(error, token) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  /**
   * Nettoie tous les tokens et données utilisateur
   */
  clearTokens() {
    const keysToRemove = [
      'userToken',
      'accessToken', 
      'refreshToken',
      'user',
      'userId',
      'userInfo',
      'userRole'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('🧹 Tokens et données utilisateur supprimés');
  }

  /**
   * Affiche une notification d'expiration de session
   * @param {boolean} showReconnectButton - Afficher le bouton de reconnexion
   */
  async showSessionExpiredNotification(showReconnectButton = true) {
    const result = await Swal.fire({
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
      showCancelButton: showReconnectButton,
      confirmButtonText: showReconnectButton ? 'Se reconnecter' : 'OK',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#4ECDC4',
      cancelButtonColor: '#FF6B6B',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'dark:bg-gray-800 dark:text-white',
        title: 'dark:text-white',
        content: 'dark:text-gray-300',
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg'
      }
    });

    if (result.isConfirmed && showReconnectButton) {
      this.redirectToLogin();
    } else if (!showReconnectButton) {
      this.redirectToLogin();
    }
  }

  /**
   * Affiche une notification de reconnexion automatique
   */
  async showReconnectionNotification() {
    await Swal.fire({
      title: '🔄 Reconnexion automatique',
      text: 'Tentative de reconnexion en cours...',
      icon: 'info',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        popup: 'dark:bg-gray-800 dark:text-white',
        title: 'dark:text-white',
        content: 'dark:text-gray-300'
      }
    });
  }

  /**
   * Affiche une notification de succès de reconnexion
   */
  async showReconnectionSuccessNotification() {
    await Swal.fire({
      title: '✅ Reconnexion réussie',
      text: 'Vous êtes maintenant reconnecté(e) !',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      customClass: {
        popup: 'dark:bg-gray-800 dark:text-white',
        title: 'dark:text-white',
        content: 'dark:text-gray-300'
      }
    });
  }

  /**
   * Redirige vers la page de connexion
   */
  redirectToLogin() {
    if (this.router) {
      this.router.push('/users/login?expired=true');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/users/login?expired=true';
    }
  }

  /**
   * Gère l'expiration du token avec notifications
   * @param {boolean} showNotification - Afficher la notification
   * @returns {Promise<boolean>} - True si l'utilisateur a été déconnecté
   */
  async handleTokenExpiration(showNotification = true) {
    console.log('🚨 Token expiré détecté');
    
    // Nettoyer les tokens
    this.clearTokens();
    
    // Notifier le callback
    if (this.onTokenExpired) {
      this.onTokenExpired();
    }

    if (showNotification) {
      await this.showSessionExpiredNotification();
    } else {
      this.redirectToLogin();
    }

    return true;
  }

  /**
   * Tente de rafraîchir le token avec gestion d'erreurs
   * @param {boolean} showNotifications - Afficher les notifications
   * @returns {Promise<boolean>} - True si le refresh a réussi
   */
  async attemptTokenRefresh(showNotifications = true) {
    if (showNotifications) {
      await this.showReconnectionNotification();
    }

    const newToken = await this.refreshToken();
    
    if (newToken) {
      if (showNotifications) {
        await this.showReconnectionSuccessNotification();
      }
      return true;
    } else {
      await this.handleTokenExpiration(showNotifications);
      return false;
    }
  }
}

// Instance singleton
const tokenManager = new TokenManager();

export default tokenManager;

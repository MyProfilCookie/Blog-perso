/* eslint-disable no-console */
import axios from 'axios';

// Configuration de base pour Axios
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Variable pour éviter les boucles infinies de refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Intercepteur pour ajouter automatiquement le token aux requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses d'erreur avec reconnexion automatique
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre la requête en file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('Refresh token non disponible');
        }

        console.log('🔄 Tentative de rafraîchissement du token...');

        // Utiliser une instance axios séparée pour éviter l'interception
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/refresh-token`,
          { refreshToken }
        );

        if (refreshResponse.data?.accessToken) {
          const newAccessToken = refreshResponse.data.accessToken;

          // Sauvegarder les nouveaux tokens
          localStorage.setItem('userToken', newAccessToken);
          localStorage.setItem('accessToken', newAccessToken);

          if (refreshResponse.data.refreshToken) {
            localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
          }

          // Mettre à jour l'en-tête de la requête originale
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          console.log('✅ Token rafraîchi avec succès');

          // Traiter la file d'attente
          processQueue(null, newAccessToken);

          // Relancer la requête originale
          return apiClient(originalRequest);
        } else {
          throw new Error('Réponse de refresh invalide');
        }
      } catch (refreshError) {
        console.error('❌ Échec du rafraîchissement du token:', refreshError);

        // Traiter la file d'attente avec l'erreur
        processQueue(refreshError, null);

        // Nettoyer les tokens
        localStorage.removeItem('userToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userRole');

        // Afficher une notification d'expiration de session
        if (typeof window !== 'undefined') {
          // Importer dynamiquement SweetAlert2 pour éviter les problèmes SSR
          const Swal = (await import('sweetalert2')).default;
          
          await Swal.fire({
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
              content: 'dark:text-gray-300',
              confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg'
            }
          }).then(() => {
            window.location.href = '/users/login?expired=true';
          });
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Si ce n'est pas une erreur 401 ou si le refresh a échoué, rejeter l'erreur
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Fonctions utilitaires pour les appels API
 */
export const apiGet = (url, config = {}) => apiClient.get(url, config);
export const apiPost = (url, data = {}, config = {}) => apiClient.post(url, data, config);
export const apiPut = (url, data = {}, config = {}) => apiClient.put(url, data, config);
export const apiDelete = (url, config = {}) => apiClient.delete(url, config);

/**
 * Fonction pour vérifier si l'utilisateur est authentifié
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('accessToken');
  return !!token;
};

/**
 * Fonction pour obtenir le token actuel
 */
export const getCurrentToken = () => {
  return localStorage.getItem('userToken') || localStorage.getItem('accessToken');
};

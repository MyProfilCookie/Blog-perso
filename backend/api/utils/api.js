// utils/api.js
// Service API avec gestion des tokens d'authentification

import axios from 'axios';
import Swal from 'sweetalert2';

/**
 * Crée une instance Axios avec authentification
 * @returns {object} - Instance Axios configurée
 */
export const createAuthApi = () => {
  // Créer une instance Axios
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
  
  // Intercepteur pour ajouter le token à chaque requête
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  return instance;
};

/**
 * Hook personnalisé pour utiliser l'API avec authentification
 * @param {object} router - L'objet router de Next.js
 * @returns {object} - Instance Axios avec gestion d'authentification
 */
export const useAuthApi = (router) => {
  const authApi = createAuthApi();
  
  // Intercepteur pour gérer les réponses d'erreur 401
  authApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Supprimer les données d'authentification
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Afficher un message d'expiration de session
        Swal.fire({
          title: 'Session expirée',
          text: 'Votre session a expiré. Veuillez vous reconnecter.',
          icon: 'warning',
          confirmButtonText: 'Se reconnecter'
        }).then(() => {
          // Rediriger vers la page de connexion
          router.push('/login?expired=true');
        });
      }
      return Promise.reject(error);
    }
  );
  
  return authApi;
};
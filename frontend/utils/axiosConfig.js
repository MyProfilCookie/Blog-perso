import axios from 'axios';

// Configuration de base pour Axios
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Intercepteur pour ajouter automatiquement le token aux requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses d'erreur de manière intelligente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ne pas déconnecter automatiquement sur les erreurs 401
    // Laisser chaque composant gérer ses propres erreurs
    if (error.response && error.response.status === 401) {
      console.warn('Token invalide ou expiré pour cette requête:', error.config.url);
      // Ne pas supprimer automatiquement les données utilisateur
      // Chaque composant peut décider de la marche à suivre
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// utils/auth.js
// Fonctions pour gérer l'expiration des tokens JWT

/**
 * Vérifie si le token JWT est expiré
 * @param {string} token - Le token JWT à vérifier
 * @returns {boolean} - true si le token est expiré, false sinon
 */
export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      // Extraire la partie payload du token JWT
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Vérifier si le token a une date d'expiration
      if (!payload.exp) return false;
      
      // Comparer la date d'expiration avec la date actuelle
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Erreur lors de la vérification du token:", error);
      return true; // En cas d'erreur, considérer le token comme expiré
    }
  };
  
  /**
   * Vérifie l'authentification de l'utilisateur
   * @param {object} router - L'objet router de Next.js
   * @returns {boolean} - true si l'utilisateur est authentifié, false sinon
   */
  export const verifierAuthentification = (router) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('token');
    
    // Vérifier si le token existe et s'il n'est pas expiré
    if (!token || isTokenExpired(token)) {
      // Supprimer les données utilisateur
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Rediriger vers la page de connexion
      router.push('/login?expired=true');
      return false;
    }
    
    return true;
  };
  
  /**
   * Configure des intercepteurs Axios pour gérer les réponses 401
   * @param {object} router - L'objet router de Next.js
   */
  export const configurerIntercepteursAxios = (router) => {
    // Importer axios si ce n'est pas déjà fait
    const axios = require('axios');
    
    // Configurer l'intercepteur de réponse
    axios.interceptors.response.use(
      response => response,
      error => {
        // Vérifier si l'erreur est 401 (Non autorisé)
        if (error.response && error.response.status === 401) {
          // Supprimer les données d'authentification
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          
          // Rediriger vers la page de connexion avec message d'expiration
          router.push('/login?expired=true');
        }
        
        return Promise.reject(error);
      }
    );
  };
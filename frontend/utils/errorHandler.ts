/**
 * Utilitaire pour gérer les erreurs d'authentification de manière centralisée
 */

export const handleAuthError = (error: any): boolean => {
  // Vérifier si c'est une erreur 401 (Non autorisé)
  if (error.response?.status === 401) {
    console.log("🔐 Token expiré, nettoyage des données de session");

    // Nettoyer toutes les données de session
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");

    // Rediriger vers la page de connexion
    window.location.href = "/users/login";

    return true; // Indique que l'erreur a été gérée
  }

  return false; // L'erreur n'a pas été gérée
};

export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401;
};

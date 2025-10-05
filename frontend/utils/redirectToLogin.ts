/**
 * Redirige vers la page de connexion en ajoutant l'URL actuelle comme paramètre de retour
 * @param router - Le router Next.js
 * @param currentPath - Le chemin actuel (optionnel, sera détecté automatiquement si non fourni)
 */
export const redirectToLogin = (router: any, currentPath?: string) => {
  // Utiliser currentPath si fourni, sinon détecter automatiquement
  const returnUrl = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  router.push(`/users/login?returnUrl=${encodeURIComponent(returnUrl)}`);
};

/**
 * Obtient l'URL de connexion avec le returnUrl
 * @param currentPath - Le chemin actuel (optionnel)
 */
export const getLoginUrl = (currentPath?: string): string => {
  const returnUrl = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  return `/users/login?returnUrl=${encodeURIComponent(returnUrl)}`;
};


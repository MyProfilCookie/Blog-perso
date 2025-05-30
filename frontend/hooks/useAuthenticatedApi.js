/* eslint-disable no-console */
import { useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete, isAuthenticated } from "@/utils/axiosConfig";

/**
 * Hook personnalisé pour effectuer des appels API authentifiés
 * avec gestion automatique des erreurs de token et reconnexion
 */
export const useAuthenticatedApi = () => {
  /**
   * Effectue un appel API GET authentifié
   * @param {string} url - L'URL de l'API
   * @param {object} config - Configuration axios optionnelle
   * @returns {Promise} - Promesse de la réponse
   */
  const authenticatedGet = useCallback(async (url, config = {}) => {
    try {
      return await apiGet(url, config);
    } catch (error) {
      console.error("Erreur lors de l'appel API GET:", error);
      throw error;
    }
  }, []);

  /**
   * Effectue un appel API POST authentifié
   * @param {string} url - L'URL de l'API
   * @param {object} data - Données à envoyer
   * @param {object} config - Configuration axios optionnelle
   * @returns {Promise} - Promesse de la réponse
   */
  const authenticatedPost = useCallback(async (url, data = {}, config = {}) => {
    try {
      return await apiPost(url, data, config);
    } catch (error) {
      console.error("Erreur lors de l'appel API POST:", error);
      throw error;
    }
  }, []);

  /**
   * Effectue un appel API PUT authentifié
   * @param {string} url - L'URL de l'API
   * @param {object} data - Données à envoyer
   * @param {object} config - Configuration axios optionnelle
   * @returns {Promise} - Promesse de la réponse
   */
  const authenticatedPut = useCallback(async (url, data = {}, config = {}) => {
    try {
      return await apiPut(url, data, config);
    } catch (error) {
      console.error("Erreur lors de l'appel API PUT:", error);
      throw error;
    }
  }, []);

  /**
   * Effectue un appel API DELETE authentifié
   * @param {string} url - L'URL de l'API
   * @param {object} config - Configuration axios optionnelle
   * @returns {Promise} - Promesse de la réponse
   */
  const authenticatedDelete = useCallback(async (url, config = {}) => {
    try {
      return await apiDelete(url, config);
    } catch (error) {
      console.error("Erreur lors de l'appel API DELETE:", error);
      throw error;
    }
  }, []);

  return {
    authenticatedGet,
    authenticatedPost,
    authenticatedPut,
    authenticatedDelete,
    isAuthenticated,
  };
};

export default useAuthenticatedApi;

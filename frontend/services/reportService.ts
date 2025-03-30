// services/reportService.ts

import axios from 'axios';

// Types pour l'API
export interface ReportItem {
  subject: string;
  activity: string;
  hours: string;
  progress: "not-started" | "in-progress" | "completed" | "not-acquired";
}

export interface WeeklyReportData {
  _id?: string;
  userId: string;
  weekNumber: string;
  items: ReportItem[];
  createdAt?: string;
  updatedAt?: string;
}

// Fonction pour construire l'URL de base correcte
const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://blog-perso.onrender.com';
  
  // Si l'URL se termine déjà par /api, on ne l'ajoute pas à nouveau
  if (apiUrl.endsWith('/api')) {
    return apiUrl;
  } else {
    return `${apiUrl}/api`;
  }
};

/**
 * Récupère le rapport d'un utilisateur pour une semaine spécifique
 * @param userId ID de l'utilisateur
 * @param weekNumber Numéro de la semaine
 * @param token Token d'authentification
 */
export const getUserWeeklyReport = async (
  userId: string, 
  weekNumber: string, 
  token: string
): Promise<WeeklyReportData | null> => {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/reports/user/${userId}/week/${encodeURIComponent(weekNumber)}`;
    
    console.log('📡 Récupération du rapport:', url);
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération du rapport pour la semaine ${weekNumber}:`, error);
    // Si le rapport n'existe pas (404), on retourne null plutôt que de lancer une erreur
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Sauvegarde ou met à jour le rapport hebdomadaire d'un utilisateur
 * @param reportData Données du rapport
 * @param token Token d'authentification
 */
export const saveWeeklyReport = async (
  reportData: WeeklyReportData,
  token: string
): Promise<WeeklyReportData> => {
  try {
    const baseUrl = getBaseUrl();
    let response;
    
    if (reportData._id) {
      // Mise à jour d'un rapport existant
      const url = `${baseUrl}/reports/${reportData._id}`;
      console.log('📡 Mise à jour du rapport:', url);
      
      response = await axios.put(url, reportData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      // Création d'un nouveau rapport
      const url = `${baseUrl}/reports`;
      console.log('📡 Création d\'un nouveau rapport:', url);
      
      response = await axios.post(url, reportData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du rapport:', error);
    throw error;
  }
};

/**
 * Récupère tous les rapports d'un utilisateur
 * @param userId ID de l'utilisateur
 * @param token Token d'authentification
 */
export const getAllUserReports = async (
  userId: string,
  token: string
): Promise<WeeklyReportData[]> => {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/reports/user/${userId}`;
    
    console.log('📡 Récupération de tous les rapports:', url);
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des rapports:', error);
    return [];
  }
};

/**
 * Supprime un rapport hebdomadaire
 * @param reportId ID du rapport
 * @param token Token d'authentification
 */
export const deleteWeeklyReport = async (
  reportId: string,
  token: string
): Promise<{ message: string }> => {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/reports/${reportId}`;
    
    console.log('📡 Suppression du rapport:', url);
    
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la suppression du rapport ${reportId}:`, error);
    throw error;
  }
};
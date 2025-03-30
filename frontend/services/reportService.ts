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

// URL de base de l'API
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/reports`;

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
    const response = await axios.get(`${API_URL}/user/${userId}/week/${weekNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération du rapport pour la semaine ${weekNumber}:`, error);
    return null;
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
    let response;
    
    if (reportData._id) {
      // Mise à jour d'un rapport existant
      response = await axios.put(`${API_URL}/${reportData._id}`, reportData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      // Création d'un nouveau rapport
      response = await axios.post(API_URL, reportData, {
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
    const response = await axios.get(`${API_URL}/user/${userId}`, {
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
    const response = await axios.delete(`${API_URL}/${reportId}`, {
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
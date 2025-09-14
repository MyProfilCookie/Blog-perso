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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';
  
  // Si l'URL se termine déjà par /api, on ne l'ajoute pas à nouveau
  if (apiUrl.endsWith('/api')) {
    return apiUrl;
  } else {
    return `${apiUrl}/api`;
  }
};

/**
 * Récupère le rapport d'un utilisateur pour une semaine spécifique
 * OU retourne null si le rapport n'existe pas encore
 */
export const getUserWeeklyReport = async (
  userId: string, 
  weekNumber: string, 
  token: string
): Promise<WeeklyReportData | null> => {
  try {
    // Plutôt que d'essayer de récupérer un rapport par semaine (qui peut ne pas exister),
    // récupérons tous les rapports de l'utilisateur
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/reports/user/${userId}`;
    
    console.log('📡 Récupération de tous les rapports:', url);
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Chercher le rapport pour la semaine spécifiée
    const reports = response.data;
    const weeklyReport = Array.isArray(reports) 
      ? reports.find(report => report.weekNumber === weekNumber)
      : null;
    
    return weeklyReport || null;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des rapports:`, error);
    // Retourner null en cas d'erreur pour permettre la création d'un rapport local
    return null;
  }
};

/**
 * Sauvegarde ou met à jour le rapport hebdomadaire d'un utilisateur
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
      console.log("📡 Création d'un nouveau rapport:", url);
      
      response = await axios.post(url, reportData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du rapport:', error);
    
    // En cas d'erreur, retourner les données d'origine pour que l'utilisateur
    // ne perde pas son travail
    return {
      ...reportData,
      _id: reportData._id || 'local-draft'
    };
  }
};

/**
 * Récupère tous les rapports d'un utilisateur
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
    return { message: "Échec de la suppression du rapport" };
  }
};
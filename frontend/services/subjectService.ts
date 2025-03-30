// services/subjectService.ts

import axios from 'axios';

// Types pour l'API
export interface Question {
  _id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  category?: string;
  subcategory?: string;
  difficulty?: "Facile" | "Moyen" | "Difficile";
}

export interface Subject {
  _id: string;
  name: string;
  description?: string;
  active: boolean;
  icon?: string;
  questions: Question[];
}

// URL de base de l'API
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/subjects`;

/**
 * Récupère toutes les matières actives
 */
export const getAllSubjects = async (): Promise<Subject[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des matières:', error);
    throw error;
  }
};

/**
 * Récupère une matière spécifique par son nom
 * @param name Nom de la matière
 */
export const getSubjectByName = async (name: string): Promise<Subject> => {
  try {
    const response = await axios.get(`${API_URL}/${name}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération de la matière ${name}:`, error);
    throw error;
  }
};

/**
 * Crée une nouvelle matière (admin uniquement)
 * @param subject Données de la matière à créer
 * @param token Token d'authentification admin
 */
export const createSubject = async (subject: Partial<Subject>, token: string): Promise<Subject> => {
  try {
    const response = await axios.post(API_URL, subject, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création de la matière:', error);
    throw error;
  }
};

/**
 * Met à jour une matière existante (admin uniquement)
 * @param id ID de la matière
 * @param subject Données à mettre à jour
 * @param token Token d'authentification admin
 */
export const updateSubject = async (id: string, subject: Partial<Subject>, token: string): Promise<Subject> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, subject, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour de la matière ${id}:`, error);
    throw error;
  }
};

/**
 * Ajoute une question à une matière (admin uniquement)
 * @param subjectId ID de la matière
 * @param question Question à ajouter
 * @param token Token d'authentification admin
 */
export const addQuestionToSubject = async (subjectId: string, question: Partial<Question>, token: string): Promise<Subject> => {
  try {
    const response = await axios.post(`${API_URL}/${subjectId}/questions`, question, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de l'ajout d'une question à la matière ${subjectId}:`, error);
    throw error;
  }
};

/**
 * Supprime une matière (admin uniquement)
 * @param id ID de la matière
 * @param token Token d'authentification admin
 */
export const deleteSubject = async (id: string, token: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la suppression de la matière ${id}:`, error);
    throw error;
  }
};
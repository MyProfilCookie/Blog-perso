/**
 * Service de gestion des messages de contact
 * Gère la persistance dans localStorage et pourra être étendu pour utiliser une API
 */

import { ContactMessage, ContactFormData } from "@/types/contact";

const STORAGE_KEY = "contactMessages";
const MAX_HISTORY = 10;

/**
 * Sauvegarde un message de contact
 * @param data - Données du formulaire
 * @returns Promise résolue quand le message est sauvegardé
 */
export const saveContactMessage = async (
  data: ContactFormData
): Promise<void> => {
  const contactData: ContactMessage = {
    nom: data.nom.trim(),
    email: data.email.trim(),
    message: data.message.trim(),
    date: new Date().toISOString(),
  };

  // Simuler un appel API (à remplacer par un vrai appel plus tard)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // TODO: Remplacer par un vrai appel API
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(contactData)
  // });

  // Sauvegarder dans le localStorage
  const history = getContactHistory();
  const newHistory = [contactData, ...history].slice(0, MAX_HISTORY);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde dans localStorage:", error);
    throw new Error("Impossible de sauvegarder le message localement");
  }
};

/**
 * Récupère l'historique des messages de contact
 * @returns Liste des messages sauvegardés
 */
export const getContactHistory = (): ContactMessage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    return [];
  }
};

/**
 * Efface l'historique des messages
 */
export const clearContactHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'historique:", error);
  }
};

/**
 * Supprime un message spécifique de l'historique
 * @param index - Index du message à supprimer
 */
export const deleteContactMessage = (index: number): void => {
  try {
    const history = getContactHistory();
    const newHistory = history.filter((_, i) => i !== index);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Erreur lors de la suppression du message:", error);
  }
};

/**
 * Validateur pour le formulaire de contact
 */

import { ContactFormData, ValidationResult } from "@/types/contact";

/**
 * Valide les données du formulaire de contact
 * @param data - Données du formulaire à valider
 * @returns Résultat de la validation avec message d'erreur si invalide
 */
export const validateContactForm = (data: ContactFormData): ValidationResult => {
  // Vérification des champs vides
  if (!data.nom?.trim() || !data.email?.trim() || !data.message?.trim()) {
    return {
      isValid: false,
      error: "Veuillez remplir tous les champs obligatoires.",
    };
  }

  // Validation du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      isValid: false,
      error: "Veuillez saisir une adresse email valide.",
    };
  }

  // Validation de la longueur du message
  if (data.message.trim().length < 10) {
    return {
      isValid: false,
      error: "Le message doit contenir au moins 10 caractères.",
    };
  }

  return { isValid: true };
};

/**
 * Valide uniquement le format d'un email
 * @param email - Email à valider
 * @returns true si l'email est valide
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

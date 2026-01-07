/**
 * Types pour le module de contact
 */

export interface ContactMessage {
  nom: string;
  email: string;
  message: string;
  date: string;
}

export interface ContactFormData {
  nom: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

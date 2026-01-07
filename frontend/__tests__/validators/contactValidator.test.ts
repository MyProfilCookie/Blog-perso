/**
 * Tests unitaires pour le validateur de formulaire contact
 */

import { validateContactForm, isValidEmail } from '@/lib/validators/contactValidator';

describe('contactValidator', () => {
  describe('validateContactForm', () => {
    it('devrait valider un formulaire correct', () => {
      const result = validateContactForm({
        nom: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        message: 'Ceci est un message de test valide.',
      });

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('devrait rejeter un formulaire avec des champs vides', () => {
      const result = validateContactForm({
        nom: '',
        email: 'test@example.com',
        message: 'Message valide',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Veuillez remplir tous les champs obligatoires.');
    });

    it('devrait rejeter un email invalide', () => {
      const result = validateContactForm({
        nom: 'Jean Dupont',
        email: 'email-invalide',
        message: 'Message valide',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Veuillez saisir une adresse email valide.');
    });

    it('devrait rejeter un message trop court', () => {
      const result = validateContactForm({
        nom: 'Jean Dupont',
        email: 'jean@example.com',
        message: 'Court',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Le message doit contenir au moins 10 caractères.');
    });
  });

  describe('isValidEmail', () => {
    it('devrait valider un email correct', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('devrait rejeter un email invalide', () => {
      expect(isValidEmail('invalide')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
    });
  });
});

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../api/models/User');

// Mock de bcrypt
jest.mock('bcryptjs');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Schema Validation', () => {
    describe('pseudo field', () => {
      it('devrait accepter un pseudo valide', () => {
        const userData = {
          pseudo: 'testuser123',
          nom: 'Test',
          prenom: 'User',
          age: 25,
          email: 'test@example.com',
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeUndefined();
      });

      it('devrait rejeter un pseudo trop court', () => {
        const userData = {
          pseudo: 'test123', // 7 caractères, minimum 8 requis
          nom: 'Test',
          prenom: 'User',
          age: 25,
          email: 'test@example.com',
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeDefined();
        expect(error.errors.pseudo).toBeDefined();
        expect(error.errors.pseudo.message).toContain('minimum allowed length');
      });

      it('devrait rejeter un pseudo avec des caractères spéciaux', () => {
        const userData = {
          pseudo: 'test@user123', // Contient @
          nom: 'Test',
          prenom: 'User',
          age: 25,
          email: 'test@example.com',
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeDefined();
        expect(error.errors.pseudo).toBeDefined();
        expect(error.errors.pseudo.message).toContain('lettres et des chiffres');
      });

      it('devrait rejeter un pseudo manquant', () => {
        const userData = {
          nom: 'Test',
          prenom: 'User',
          age: 25,
          email: 'test@example.com',
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeDefined();
        expect(error.errors.pseudo).toBeDefined();
      });
    });

    describe('email field', () => {
      it('devrait accepter un email valide', () => {
        const userData = {
          pseudo: 'testuser123',
          nom: 'Test',
          prenom: 'User',
          age: 25,
          email: 'valid@example.com',
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeUndefined();
      });

      it('devrait rejeter un email invalide', () => {
        const userData = {
          pseudo: 'testuser123',
          nom: 'Test',
          prenom: 'User',
          age: 25,
          email: 'invalid-email',
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeDefined();
        expect(error.errors.email).toBeDefined();
        expect(error.errors.email.message).toBe('Email invalide.');
      });

      it('devrait rejeter un email manquant', () => {
        const userData = {
          pseudo: 'testuser123',
          nom: 'Test',
          prenom: 'User',
          age: 25,
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeDefined();
        expect(error.errors.email).toBeDefined();
      });
    });

    describe('password field', () => {
      it('devrait accepter un mot de passe valide', () => {
        const userData = {
          pseudo: 'testuser123',
          nom: 'Test',
          prenom: 'User',
          age: 25,
          email: 'test@example.com',
          password: 'validpassword123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeUndefined();
      });

      it('devrait rejeter un mot de passe trop court', () => {
        const userData = {
          pseudo: 'testuser123',
          nom: 'Test',
          prenom: 'User',
          age: 25,
          email: 'test@example.com',
          password: 'short' // 5 caractères, minimum 8 requis
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeDefined();
        expect(error.errors.password).toBeDefined();
        expect(error.errors.password.message).toContain('minimum allowed length');
      });
    });

    describe('age field', () => {
      it('devrait accepter un âge valide', () => {
        const userData = {
          pseudo: 'testuser123',
          nom: 'Test',
          prenom: 'User',
          age: 25,
          email: 'test@example.com',
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeUndefined();
      });

      it('devrait rejeter un âge négatif', () => {
        const userData = {
          pseudo: 'testuser123',
          nom: 'Test',
          prenom: 'User',
          age: -5,
          email: 'test@example.com',
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeDefined();
        expect(error.errors.age).toBeDefined();
      });

      it('devrait rejeter un âge de zéro', () => {
        const userData = {
          pseudo: 'testuser123',
          nom: 'Test',
          prenom: 'User',
          age: 0,
          email: 'test@example.com',
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeDefined();
        expect(error.errors.age).toBeDefined();
      });
    });

    describe('required fields', () => {
      it('devrait rejeter si nom est manquant', () => {
        const userData = {
          pseudo: 'testuser123',
          prenom: 'User',
          age: 25,
          email: 'test@example.com',
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeDefined();
        expect(error.errors.nom).toBeDefined();
      });

      it('devrait rejeter si prenom est manquant', () => {
        const userData = {
          pseudo: 'testuser123',
          nom: 'Test',
          age: 25,
          email: 'test@example.com',
          password: 'password123'
        };

        const user = new User(userData);
        const error = user.validateSync();

        expect(error).toBeDefined();
        expect(error.errors.prenom).toBeDefined();
      });
    });
  });

  describe('Default Values', () => {
    it('devrait définir isAdmin à false par défaut', () => {
      const userData = {
        pseudo: 'testuser123',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);

      expect(user.isAdmin).toBe(false);
    });

    it('devrait définir role à "user" par défaut', () => {
      const userData = {
        pseudo: 'testuser123',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);

      expect(user.role).toBe('user');
    });

    it('devrait définir une image par défaut', () => {
      const userData = {
        pseudo: 'testuser123',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);

      expect(user.image).toBe('/assets/default-avatar.webp');
    });

    it('devrait définir le pays par défaut à "France"', () => {
      const userData = {
        pseudo: 'testuser123',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123',
        deliveryAddress: {
          street: '123 Test St',
          city: 'Test City',
          postalCode: '12345'
        }
      };

      const user = new User(userData);

      expect(user.deliveryAddress.country).toBe('France');
    });
  });

  describe('Optional Fields', () => {
    it('devrait accepter des champs optionnels', () => {
      const userData = {
        pseudo: 'testuser123',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123',
        phone: '0123456789',
        ageEnfantOuAdulteAutiste: 10,
        followers: ['user1', 'user2'],
        following: ['user3', 'user4']
      };

      const user = new User(userData);
      const error = user.validateSync();

      expect(error).toBeUndefined();
      expect(user.phone).toBe('0123456789');
      expect(user.ageEnfantOuAdulteAutiste).toBe(10);
      expect(user.followers).toEqual(['user1', 'user2']);
      expect(user.following).toEqual(['user3', 'user4']);
    });

    it('devrait accepter une adresse de livraison complète', () => {
      const userData = {
        pseudo: 'testuser123',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123',
        deliveryAddress: {
          street: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Belgium'
        }
      };

      const user = new User(userData);
      const error = user.validateSync();

      expect(error).toBeUndefined();
      expect(user.deliveryAddress.street).toBe('123 Test Street');
      expect(user.deliveryAddress.city).toBe('Test City');
      expect(user.deliveryAddress.postalCode).toBe('12345');
      expect(user.deliveryAddress.country).toBe('Belgium');
    });
  });

  describe('Enum Validation', () => {
    it('devrait accepter un rôle valide', () => {
      const userData = {
        pseudo: 'testuser123',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      };

      const user = new User(userData);
      const error = user.validateSync();

      expect(error).toBeUndefined();
      expect(user.role).toBe('admin');
    });

    it('devrait rejeter un rôle invalide', () => {
      const userData = {
        pseudo: 'testuser123',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123',
        role: 'invalid_role'
      };

      const user = new User(userData);
      const error = user.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.role).toBeDefined();
    });
  });

  describe('Timestamps', () => {
    it('devrait avoir des timestamps automatiques', () => {
      const userData = {
        pseudo: 'testuser123',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);

      // Les timestamps sont ajoutés lors de la sauvegarde
      expect(user.schema.options.timestamps).toBe(true);
    });
  });

  describe('Field Length Validation', () => {
    it('devrait rejeter un nom trop long', () => {
      const userData = {
        pseudo: 'testuser123',
        nom: 'A'.repeat(101), // 101 caractères, maximum 100
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const error = user.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.nom).toBeDefined();
    });

    it('devrait rejeter un pseudo trop long', () => {
      const userData = {
        pseudo: 'A'.repeat(101), // 101 caractères, maximum 100
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const error = user.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.pseudo).toBeDefined();
    });

    it('devrait rejeter un email trop long', () => {
      const userData = {
        pseudo: 'testuser123',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: 'A'.repeat(190) + '@example.com', // > 200 caractères
        password: 'password123'
      };

      const user = new User(userData);
      const error = user.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });
  });

  describe('Trimming', () => {
    it('devrait supprimer les espaces en début et fin pour les champs avec trim', () => {
      const userData = {
        pseudo: '  testuser123  ',
        nom: 'Test',
        prenom: 'User',
        age: 25,
        email: '  test@example.com  ',
        password: '  password123  '
      };

      const user = new User(userData);

      expect(user.pseudo).toBe('testuser123');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('password123');
    });
  });
});
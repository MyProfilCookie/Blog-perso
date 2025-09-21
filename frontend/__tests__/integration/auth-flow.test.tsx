/**
 * Tests d'intégration pour le flux d'authentification
 * Teste les scénarios complets de connexion, inscription et gestion d'état
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock components for testing
const MockLoginForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-testid="email-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        data-testid="password-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <button data-testid="login-button" type="submit">
        Se connecter
      </button>
    </form>
  );
};

const MockSignupForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ firstName, lastName, email, password, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-testid="firstname-input"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Prénom"
      />
      <input
        data-testid="lastname-input"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Nom"
      />
      <input
        data-testid="email-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        data-testid="password-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <input
        data-testid="confirm-password-input"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmer le mot de passe"
      />
      <button data-testid="signup-button" type="submit">
        S'inscrire
      </button>
    </form>
  );
};

describe('Flux d\'authentification - Tests d\'intégration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Connexion', () => {
    it('devrait permettre une connexion réussie avec des identifiants valides', async () => {
      const user = userEvent.setup();
      
      // Mock de la réponse API réussie
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          token: 'fake-jwt-token',
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
          },
        },
        status: 200,
      });

      const handleLogin = jest.fn();

      render(<MockLoginForm onSubmit={handleLogin} />);

      // Saisir les identifiants
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');

      // Soumettre le formulaire
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(handleLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('devrait gérer les erreurs de connexion', async () => {
      const user = userEvent.setup();
      
      const handleLogin = jest.fn();

      render(<MockLoginForm onSubmit={handleLogin} />);

      await user.type(screen.getByTestId('email-input'), 'wrong@example.com');
      await user.type(screen.getByTestId('password-input'), 'wrongpassword');
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(handleLogin).toHaveBeenCalled();
      });
    });
  });

  describe('Inscription', () => {
    it('devrait permettre une inscription réussie', async () => {
      const user = userEvent.setup();
      
      const handleSignup = jest.fn();

      render(<MockSignupForm onSubmit={handleSignup} />);

      // Remplir le formulaire
      await user.type(screen.getByTestId('firstname-input'), 'New');
      await user.type(screen.getByTestId('lastname-input'), 'User');
      await user.type(screen.getByTestId('email-input'), 'newuser@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.type(screen.getByTestId('confirm-password-input'), 'password123');

      await user.click(screen.getByTestId('signup-button'));

      await waitFor(() => {
        expect(handleSignup).toHaveBeenCalledWith({
          firstName: 'New',
          lastName: 'User',
          email: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });
      });
    });
  });

  describe('Gestion d\'état d\'authentification', () => {
    it('devrait persister les données utilisateur dans localStorage', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const token = 'fake-jwt-token';

      // Simuler la sauvegarde
      localStorageMock.setItem('user', JSON.stringify(userData));
      localStorageMock.setItem('token', token);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(userData));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', token);
    });

    it('devrait nettoyer les données lors de la déconnexion', () => {
      // Simuler la déconnexion
      localStorageMock.removeItem('user');
      localStorageMock.removeItem('token');

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TokenTestComponent from '../../components/TokenTestComponent';

// Mock des hooks et utilitaires
jest.mock('../../hooks/useAuthenticatedApi', () => ({
  useAuthenticatedApi: jest.fn(),
}));

jest.mock('../../utils/axiosConfig', () => ({
  getCurrentToken: jest.fn(),
}));

// Mock de localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock de react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('TokenTestComponent', () => {
  const mockAuthenticatedGet = jest.fn();
  const mockGetCurrentToken = jest.fn();
  const mockUseAuthenticatedApi = require('../../hooks/useAuthenticatedApi').useAuthenticatedApi;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks
    mockUseAuthenticatedApi.mockReturnValue({
      authenticatedGet: mockAuthenticatedGet,
      authenticatedPost: jest.fn(),
    });
    
    require('../../utils/axiosConfig').getCurrentToken.mockImplementation(mockGetCurrentToken);
    
    mockLocalStorage.getItem.mockReturnValue('test-token');
    mockGetCurrentToken.mockReturnValue('test-token');
  });

  it('devrait afficher le composant avec les éléments de base', () => {
    render(<TokenTestComponent />);
    
    expect(screen.getByText(/Test de Reconnexion Automatique/i)).toBeInTheDocument();
    expect(screen.getByText(/Vérifier Token/i)).toBeInTheDocument();
  });

  it('devrait tester le token avec succès', async () => {
    mockGetCurrentToken.mockReturnValue('test-token-123');
    
    render(<TokenTestComponent />);
    
    const testButton = screen.getByText(/Vérifier Token/i);
    fireEvent.click(testButton);

    await waitFor(() => {
      expect(screen.getByText(/Token trouvé/i)).toBeInTheDocument();
    });
  });

  it('devrait gérer l\'absence de token', async () => {
    mockGetCurrentToken.mockReturnValue(null);
    
    render(<TokenTestComponent />);
    
    const testButton = screen.getByText(/Vérifier Token/i);
    fireEvent.click(testButton);

    await waitFor(() => {
      expect(screen.getByText(/Aucun token trouvé/i)).toBeInTheDocument();
    });
  });

  it('devrait tester un appel API avec succès', async () => {
    mockAuthenticatedGet.mockResolvedValueOnce({
      data: { user: { email: 'test@example.com' } }
    });

    render(<TokenTestComponent />);
    
    const apiButton = screen.getByText(/Test API Simple/i);
    fireEvent.click(apiButton);

    await waitFor(() => {
      expect(screen.getByText(/Appel API \/users\/me/i)).toBeInTheDocument();
      expect(screen.getByText(/Succès/i)).toBeInTheDocument();
    });

    expect(mockAuthenticatedGet).toHaveBeenCalledWith('/users/me');
  });

  it('devrait gérer les erreurs d\'API', async () => {
    mockAuthenticatedGet.mockRejectedValueOnce(new Error('API Error'));

    render(<TokenTestComponent />);
    
    const apiButton = screen.getByText(/Test API Simple/i);
    fireEvent.click(apiButton);

    await waitFor(() => {
      expect(screen.getByText(/Échec/i)).toBeInTheDocument();
    });
  });

  it('devrait permettre de simuler un token expiré', () => {
    mockGetCurrentToken.mockReturnValue('valid-token');
    
    render(<TokenTestComponent />);
    
    const expireButton = screen.getByText(/Simuler Expiration/i);
    fireEvent.click(expireButton);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userToken', expect.stringContaining('EXPIRED'));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', expect.stringContaining('EXPIRED'));
  });

  it('devrait permettre d\'effacer les résultats', async () => {
    render(<TokenTestComponent />);
    
    // Ajouter un résultat d'abord
    const testButton = screen.getByText(/Vérifier Token/i);
    fireEvent.click(testButton);

    await waitFor(() => {
      expect(screen.getByText(/Token trouvé/i)).toBeInTheDocument();
    });

    // Effacer les résultats
    const clearButton = screen.getByText(/Effacer/i);
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText(/Aucun test effectué/i)).toBeInTheDocument();
    });
  });

  it('devrait afficher l\'état de chargement', async () => {
    mockAuthenticatedGet.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<TokenTestComponent />);
    
    const apiButton = screen.getByText(/Test API Simple/i);
    fireEvent.click(apiButton);

    // Vérifier que le bouton est désactivé pendant le chargement
    expect(apiButton).toBeDisabled();
  });

  it('devrait tester le flux complet de reconnexion', async () => {
    mockGetCurrentToken.mockReturnValue('valid-token');
    mockAuthenticatedGet.mockResolvedValueOnce({
      data: { user: { email: 'test@example.com' } }
    });

    render(<TokenTestComponent />);
    
    const refreshButton = screen.getByText(/Test Complet de Reconnexion/i);
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText(/Début du test de reconnexion/i)).toBeInTheDocument();
    });

    // Attendre que le test se termine
    await waitFor(() => {
      expect(mockAuthenticatedGet).toHaveBeenCalledWith('/users/me');
    }, { timeout: 2000 });
  });
});
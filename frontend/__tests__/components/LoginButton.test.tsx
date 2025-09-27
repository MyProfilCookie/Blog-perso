import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginButton from '../../components/LoginButton';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock de framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

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

describe('LoginButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as any);
    
    // Par défaut, utilisateur non connecté
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('devrait afficher le bouton de connexion quand l\'utilisateur n\'est pas connecté', async () => {
    render(<LoginButton />);
    
    await waitFor(() => {
      expect(screen.getByText(/Se connecter|Connexion/i)).toBeInTheDocument();
    });
  });

  it('devrait afficher le bouton de déconnexion quand l\'utilisateur est connecté', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      token: 'test-token',
      user: { id: 'user1', pseudo: 'TestUser' }
    }));

    render(<LoginButton />);
    
    await waitFor(() => {
      expect(screen.getByText(/Déconnexion|TestUser/i)).toBeInTheDocument();
    });
  });

  it('devrait naviguer vers la page de connexion quand on clique sur connexion', async () => {
    render(<LoginButton />);
    
    await waitFor(() => {
      const loginButton = screen.getByText(/Se connecter|Connexion/i);
      fireEvent.click(loginButton);
    });
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('devrait gérer la déconnexion', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      token: 'test-token',
      user: { id: 'user1', pseudo: 'TestUser' }
    }));

    render(<LoginButton />);
    
    await waitFor(() => {
      const logoutButton = screen.getByText(/Déconnexion/i);
      fireEvent.click(logoutButton);
    });
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userData');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('devrait appliquer les bonnes classes CSS selon la variante', () => {
    const { rerender } = render(<LoginButton variant="outline" />);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('border');
    
    rerender(<LoginButton variant="ghost" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('devrait afficher l\'icône quand showIcon est true', async () => {
    render(<LoginButton showIcon={true} />);
    
    await waitFor(() => {
      const icon = document.querySelector('svg') || screen.getByTestId('login-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  it('devrait masquer l\'icône quand showIcon est false', async () => {
    render(<LoginButton showIcon={false} />);
    
    await waitFor(() => {
      const icon = document.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });
  });

  it('devrait être désactivé quand disabled est true', () => {
    render(<LoginButton disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('devrait afficher l\'état de chargement', () => {
    render(<LoginButton loading={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText(/Chargement|Loading/i) || button).toBeInTheDocument();
  });

  it('devrait appliquer la classe fullWidth', () => {
    render(<LoginButton fullWidth={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('devrait appeler la fonction onClick personnalisée', async () => {
    const mockOnClick = jest.fn();
    render(<LoginButton onClick={mockOnClick} />);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      fireEvent.click(button);
    });
    
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('devrait gérer les différentes tailles', () => {
    const { rerender } = render(<LoginButton size="sm" />);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('text-sm');
    
    rerender(<LoginButton size="lg" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-lg');
  });

  it('devrait écouter les changements de localStorage', async () => {
    render(<LoginButton />);
    
    // Simuler un changement dans localStorage
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      token: 'new-token',
      user: { id: 'user2', pseudo: 'NewUser' }
    }));
    
    // Déclencher l'événement storage
    fireEvent(window, new StorageEvent('storage', {
      key: 'userData',
      newValue: JSON.stringify({
        token: 'new-token',
        user: { id: 'user2', pseudo: 'NewUser' }
      })
    }));
    
    await waitFor(() => {
      expect(screen.getByText(/NewUser|Déconnexion/i)).toBeInTheDocument();
    });
  });

  it('devrait gérer les erreurs de parsing JSON', async () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json');
    
    render(<LoginButton />);
    
    await waitFor(() => {
      // Devrait afficher le bouton de connexion en cas d'erreur
      expect(screen.getByText(/Se connecter|Connexion/i)).toBeInTheDocument();
    });
  });

  it('devrait appliquer les classes CSS personnalisées', () => {
    render(<LoginButton className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('devrait gérer le mode icône uniquement', () => {
    render(<LoginButton variant="icon" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('p-2'); // Classe pour bouton icône
  });

  it('devrait naviguer vers le profil utilisateur quand connecté', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      token: 'test-token',
      user: { id: 'user1', pseudo: 'TestUser' }
    }));

    render(<LoginButton />);
    
    await waitFor(() => {
      const userButton = screen.getByText(/TestUser/i);
      fireEvent.click(userButton);
    });
    
    expect(mockPush).toHaveBeenCalledWith('/profile');
  });
});
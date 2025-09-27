import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SearchBar from '../../components/search';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('SearchBar', () => {
  const defaultProps = {
    searchQuery: '',
    setSearchQuery: jest.fn(),
  };

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
  });

  it('devrait afficher le champ de recherche', () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', expect.stringContaining('Rechercher'));
  });

  it('devrait afficher la valeur de recherche actuelle', () => {
    render(<SearchBar {...defaultProps} searchQuery="test query" />);
    
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveValue('test query');
  });

  it('devrait appeler setSearchQuery lors de la saisie', () => {
    const mockSetSearchQuery = jest.fn();
    render(<SearchBar {...defaultProps} setSearchQuery={mockSetSearchQuery} />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'nouvelle recherche' } });
    
    expect(mockSetSearchQuery).toHaveBeenCalledWith('nouvelle recherche');
  });

  it('devrait afficher les résultats de recherche filtrés', async () => {
    const mockSetSearchQuery = jest.fn();
    render(<SearchBar {...defaultProps} setSearchQuery={mockSetSearchQuery} />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'autiste' } });
    
    await waitFor(() => {
      expect(screen.getByText(/Comment aider un enfant autiste/i)).toBeInTheDocument();
      expect(screen.getByText(/Créer un environnement calme/i)).toBeInTheDocument();
    });
  });

  it('devrait masquer les résultats quand la recherche est vide', () => {
    render(<SearchBar {...defaultProps} searchQuery="" />);
    
    expect(screen.queryByText(/Comment aider un enfant autiste/i)).not.toBeInTheDocument();
  });

  it('devrait permettre de sélectionner un résultat', async () => {
    const mockSetSearchQuery = jest.fn();
    render(<SearchBar {...defaultProps} setSearchQuery={mockSetSearchQuery} />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'autiste' } });
    
    await waitFor(() => {
      const firstResult = screen.getByText(/Comment aider un enfant autiste/i);
      fireEvent.click(firstResult);
    });
    
    expect(mockSetSearchQuery).toHaveBeenCalledWith('Comment aider un enfant autiste à se concentrer');
  });

  it('devrait gérer la recherche avec Entrée', () => {
    const mockSetSearchQuery = jest.fn();
    render(<SearchBar {...defaultProps} setSearchQuery={mockSetSearchQuery} searchQuery="test" />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    // Vérifier que la recherche est déclenchée
    expect(mockSetSearchQuery).toHaveBeenCalled();
  });

  it('devrait afficher l\'icône de recherche', () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchIcon = screen.getByTestId('search-icon') || document.querySelector('[data-testid="search-icon"]');
    expect(searchIcon || screen.getByRole('textbox').parentElement?.querySelector('svg')).toBeInTheDocument();
  });

  it('devrait afficher le raccourci clavier', () => {
    render(<SearchBar {...defaultProps} />);
    
    // Vérifier la présence du raccourci Cmd+K ou Ctrl+K
    expect(screen.getByText(/⌘K|Ctrl\+K/i) || screen.getByText('K')).toBeInTheDocument();
  });

  it('devrait filtrer les résultats en fonction de la requête', async () => {
    const mockSetSearchQuery = jest.fn();
    render(<SearchBar {...defaultProps} setSearchQuery={mockSetSearchQuery} />);
    
    const searchInput = screen.getByRole('textbox');
    
    // Recherche spécifique
    fireEvent.change(searchInput, { target: { value: 'routine' } });
    
    await waitFor(() => {
      expect(screen.getByText(/Les bienfaits des routines/i)).toBeInTheDocument();
      expect(screen.queryByText(/Comment aider un enfant autiste à se concentrer/i)).not.toBeInTheDocument();
    });
  });

  it('devrait gérer les recherches sans résultats', async () => {
    const mockSetSearchQuery = jest.fn();
    render(<SearchBar {...defaultProps} setSearchQuery={mockSetSearchQuery} />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'xyz123nonexistent' } });
    
    await waitFor(() => {
      expect(screen.queryByText(/Comment aider/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Aucun résultat/i) || screen.queryByText(/No results/i)).toBeInTheDocument();
    });
  });

  it('devrait être accessible au clavier', () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchInput = screen.getByRole('textbox');
    
    // Vérifier que le champ peut recevoir le focus
    searchInput.focus();
    expect(document.activeElement).toBe(searchInput);
    
    // Vérifier les attributs d'accessibilité
    expect(searchInput).toHaveAttribute('type', 'text');
    expect(searchInput).toHaveAttribute('role', 'textbox');
  });

  it('devrait gérer les caractères spéciaux dans la recherche', async () => {
    const mockSetSearchQuery = jest.fn();
    render(<SearchBar {...defaultProps} setSearchQuery={mockSetSearchQuery} />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'enfant@#$%' } });
    
    expect(mockSetSearchQuery).toHaveBeenCalledWith('enfant@#$%');
  });
});
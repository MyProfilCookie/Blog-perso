import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { RevisionProvider, useRevision } from '../../contexts/RevisionContext';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Composant de test pour utiliser le contexte
const TestComponent = () => {
  const {
    errors,
    isLoading,
    isAuthenticated,
    errorMessage,
    addError,
    removeError,
    clearErrors,
    loadErrors,
  } = useRevision();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="error-message">{errorMessage || 'No Error'}</div>
      <div data-testid="errors-count">{errors.length}</div>
      
      <button
        onClick={() => addError({
          _id: 'test-error',
          questionText: 'Test question',
          selectedAnswer: 'Wrong answer',
          correctAnswer: 'Right answer',
          date: new Date().toISOString(),
          category: 'Test',
        })}
      >
        Add Error
      </button>
      
      <button onClick={() => removeError('test-error')}>
        Remove Error
      </button>
      
      <button onClick={clearErrors}>
        Clear Errors
      </button>
      
      <button onClick={loadErrors}>
        Load Errors
      </button>

      {errors.map(error => (
        <div key={error._id} data-testid={`error-${error._id}`}>
          {error.questionText}
        </div>
      ))}
    </div>
  );
};

describe('RevisionContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    
    // Mock user data in localStorage
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify({ _id: 'user123' });
      }
      if (key === 'userToken') {
        return 'mock-token';
      }
      return null;
    });
  });

  it('devrait initialiser avec les valeurs par défaut', () => {
    render(
      <RevisionProvider>
        <TestComponent />
      </RevisionProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('error-message')).toHaveTextContent('No Error');
    expect(screen.getByTestId('errors-count')).toHaveTextContent('0');
  });

  it('devrait charger les erreurs avec succès', async () => {
    const mockErrors = [
      {
        _id: 'error1',
        questionText: 'Question 1',
        selectedAnswer: 'Wrong',
        correctAnswer: 'Right',
        date: '2024-01-01',
        category: 'Math',
      },
      {
        _id: 'error2',
        questionText: 'Question 2',
        selectedAnswer: 'Wrong2',
        correctAnswer: 'Right2',
        date: '2024-01-02',
        category: 'Science',
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({
      data: { errors: mockErrors },
    });

    render(
      <RevisionProvider>
        <TestComponent />
      </RevisionProvider>
    );

    const loadButton = screen.getByText('Load Errors');
    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(screen.getByTestId('errors-count')).toHaveTextContent('2');
    });

    expect(screen.getByTestId('error-error1')).toHaveTextContent('Question 1');
    expect(screen.getByTestId('error-error2')).toHaveTextContent('Question 2');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
  });

  it('devrait gérer les erreurs de chargement', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <RevisionProvider>
        <TestComponent />
      </RevisionProvider>
    );

    const loadButton = screen.getByText('Load Errors');
    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    expect(screen.getByTestId('error-message')).toHaveTextContent('Erreur lors du chargement des erreurs');
    expect(screen.getByTestId('errors-count')).toHaveTextContent('0');
  });

  it('devrait ajouter une erreur', () => {
    render(
      <RevisionProvider>
        <TestComponent />
      </RevisionProvider>
    );

    const addButton = screen.getByText('Add Error');
    fireEvent.click(addButton);

    expect(screen.getByTestId('errors-count')).toHaveTextContent('1');
    expect(screen.getByTestId('error-test-error')).toHaveTextContent('Test question');
  });

  it('devrait supprimer une erreur', () => {
    render(
      <RevisionProvider>
        <TestComponent />
      </RevisionProvider>
    );

    // Ajouter une erreur
    const addButton = screen.getByText('Add Error');
    fireEvent.click(addButton);

    expect(screen.getByTestId('errors-count')).toHaveTextContent('1');

    // Supprimer l'erreur
    const removeButton = screen.getByText('Remove Error');
    fireEvent.click(removeButton);

    expect(screen.getByTestId('errors-count')).toHaveTextContent('0');
  });

  it('devrait vider toutes les erreurs', () => {
    render(
      <RevisionProvider>
        <TestComponent />
      </RevisionProvider>
    );

    // Ajouter une erreur
    const addButton = screen.getByText('Add Error');
    fireEvent.click(addButton);

    expect(screen.getByTestId('errors-count')).toHaveTextContent('1');

    // Vider toutes les erreurs
    const clearButton = screen.getByText('Clear Errors');
    fireEvent.click(clearButton);

    expect(screen.getByTestId('errors-count')).toHaveTextContent('0');
  });

  it('devrait gérer le cas où l\'utilisateur n\'est pas connecté', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <RevisionProvider>
        <TestComponent />
      </RevisionProvider>
    );

    const loadButton = screen.getByText('Load Errors');
    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('errors-count')).toHaveTextContent('0');
  });

  it('devrait sauvegarder une erreur sur le serveur', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true },
    });

    render(
      <RevisionProvider>
        <TestComponent />
      </RevisionProvider>
    );

    const addButton = screen.getByText('Add Error');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/revision-errors'),
        expect.objectContaining({
          questionText: 'Test question',
          selectedAnswer: 'Wrong answer',
          correctAnswer: 'Right answer',
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
    });
  });
});
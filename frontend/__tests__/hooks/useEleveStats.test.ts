import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useEleveStats } from '../../hooks/useEleveStats';

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

describe('useEleveStats Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    
    // Mock user data in localStorage
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token' || key === 'userToken') {
        return 'mock-token';
      }
      if (key === 'user' || key === 'userInfo') {
        return JSON.stringify({ _id: 'user123', nom: 'Test', prenom: 'User' });
      }
      return null;
    });
  });

  it('devrait initialiser avec un état correct', () => {
    const { result } = renderHook(() => useEleveStats());

    expect(result.current.loading).toBe(false);
    expect(result.current.eleveStats).toBeNull();
    expect(result.current.error).toBeNull();
    expect(typeof result.current.loadCompleteStats).toBe('function');
  });

  it('devrait charger les statistiques avec succès', async () => {
    const mockStats = {
      userId: 'user123',
      totalExercises: 50,
      totalCorrect: 30,
      averageScore: 75.5,
      subjects: [
        {
          subject: 'math',
          totalExercises: 20,
          correctAnswers: 15,
          averageScore: 75.0,
          exercisesCompleted: 20,
          progress: 75,
          lastActivity: '2024-01-15',
        }
      ],
      dailyStats: [],
      categoryStats: [],
      globalStats: {
        totalExercises: 50,
        totalCorrect: 30,
        averageScore: 75.5,
        totalTimeSpent: 120,
        streak: 5,
      },
      subscriptionType: 'free',
    };

    mockedAxios.get.mockResolvedValueOnce({
      data: mockStats,
    });

    const { result } = renderHook(() => useEleveStats());

    await result.current.loadCompleteStats();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eleveStats).toEqual(expect.objectContaining({
      userId: 'user123',
      totalExercises: 50,
      totalCorrect: 30,
    }));
    expect(result.current.error).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/eleves/stats/user123`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-token',
        }),
      })
    );
  });

  it('devrait gérer les erreurs de chargement', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useEleveStats());

    await result.current.loadCompleteStats();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eleveStats).toBeNull();
    expect(result.current.error).toContain('données locales');
  });

  it('devrait permettre de synchroniser les données localStorage', async () => {
    // Mock localStorage avec des données à synchroniser
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token' || key === 'userToken') {
        return 'mock-token';
      }
      if (key === 'user' || key === 'userInfo') {
        return JSON.stringify({ _id: 'user123', nom: 'Test', prenom: 'User' });
      }
      if (key === 'math_userAnswers') {
        return JSON.stringify({ q1: true, q2: false });
      }
      if (key === 'math_results') {
        return JSON.stringify([{ score: 80 }]);
      }
      return null;
    });

    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, stats: { synced: true } },
    });

    const { result } = renderHook(() => useEleveStats());

    const syncResult = await result.current.syncLocalStorageData();

    expect(syncResult).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/eleves/sync-localStorage/user123`,
      expect.any(Object),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-token',
        }),
      })
    );
  });

  it('devrait gérer le cas où l\'utilisateur n\'est pas connecté', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useEleveStats());

    expect(result.current.userInfo).toBeNull();
  });

  it('devrait permettre de supprimer toutes les données utilisateur', async () => {
    mockedAxios.delete.mockResolvedValueOnce({
      data: { success: true },
    });

    const { result } = renderHook(() => useEleveStats());

    const deleteResult = await result.current.deleteAllUserData();

    expect(deleteResult).toBe(true);
    expect(result.current.eleveStats).toBeNull();
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/eleves/delete-all-data/user123`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-token',
        }),
      })
    );
  });
});
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useEleveStats } from '../../hooks/useEleveStats';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useEleveStats Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });;

  it('devrait initialiser avec un état de chargement', () => {
    const { result } = renderHook(useEleveStats);

    expect(result.current.loading).toBe(true);
    expect(result.current.eleveStats).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('devrait charger les statistiques avec succès', async () => {
    const mockStats = {
      totalExercices: 50,
      exercicesCompletes: 30,
      tempsTotal: 120,
      progression: 60,
      derniereActivite: '2024-01-15',
    };

    mockedAxios.get.mockResolvedValueOnce({
      data: mockStats,
    });

    const { result } = renderHook(useEleveStats);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eleveStats).toEqual(mockStats);
    expect(result.current.error).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/stats/eleve/1');
  });

  it('devrait gérer les erreurs de chargement', async () => {
    const errorMessage = 'Erreur de réseau';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useEleveStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.eleveStats).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });

  it('devrait permettre de rafraîchir les données', async () => {
    const mockStats = {
      totalExercices: 50,
      exercicesCompletes: 30,
      tempsTotal: 120,
      progression: 60,
      derniereActivite: '2024-01-15',
    };

    mockedAxios.get.mockResolvedValue({
      data: mockStats,
    });

    const { result } = renderHook(useEleveStats);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Appeler refresh
result.current.loadCompleteStats();

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });
})
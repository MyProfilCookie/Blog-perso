import { renderHook, act } from '@testing-library/react';
import { useQuestionAttempts } from '../../hooks/useQuestionAttempts';

// Mock du RevisionContext
const mockAddAttempt = jest.fn();
const mockCanAttempt = jest.fn();
const mockGetAttempts = jest.fn();
const mockAddError = jest.fn();

jest.mock('@/app/RevisionContext', () => ({
  useRevision: () => ({
    addAttempt: mockAddAttempt,
    canAttempt: mockCanAttempt,
    getAttempts: mockGetAttempts,
    addError: mockAddError,
  }),
}));

describe('useQuestionAttempts', () => {
  const questionId = 'test-question-1';
  const mockOnMaxAttemptsReached = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAttempts.mockReturnValue(0);
    mockCanAttempt.mockReturnValue(true);
    mockAddAttempt.mockReturnValue(true);
  });

  it('devrait initialiser avec les bonnes valeurs par défaut', () => {
    const { result } = renderHook(() =>
      useQuestionAttempts({ questionId })
    );

    expect(result.current.attempts).toBe(0);
    expect(result.current.remainingAttempts).toBe(2);
    expect(result.current.canAttempt).toBe(true);
    expect(result.current.isAnswered).toBe(false);
  });

  it('devrait calculer correctement les tentatives restantes', () => {
    mockGetAttempts.mockReturnValue(1);

    const { result } = renderHook(() =>
      useQuestionAttempts({ questionId })
    );

    expect(result.current.attempts).toBe(1);
    expect(result.current.remainingAttempts).toBe(1);
  });

  it('devrait gérer une tentative correcte', () => {
    const { result } = renderHook(() =>
      useQuestionAttempts({ questionId })
    );

    act(() => {
      const hasMoreAttempts = result.current.handleAttempt(true);
      expect(hasMoreAttempts).toBe(true);
    });

    expect(mockAddAttempt).toHaveBeenCalledWith(questionId);
    expect(mockAddError).not.toHaveBeenCalled();
    expect(result.current.isAnswered).toBe(true);
  });

  it('devrait gérer une tentative incorrecte', () => {
    const { result } = renderHook(() =>
      useQuestionAttempts({ questionId })
    );

    act(() => {
      const hasMoreAttempts = result.current.handleAttempt(false);
      expect(hasMoreAttempts).toBe(true);
    });

    expect(mockAddAttempt).toHaveBeenCalledWith(questionId);
    expect(mockAddError).toHaveBeenCalledWith({
      _id: expect.stringContaining(questionId),
      questionId,
      questionText: "",
      selectedAnswer: "",
      correctAnswer: "",
      category: "",
      date: expect.any(String),
      attempts: 1,
    });
    expect(result.current.isAnswered).toBe(false);
  });

  it('devrait marquer comme répondu quand plus de tentatives disponibles', () => {
    mockAddAttempt.mockReturnValue(false); // Plus de tentatives

    const { result } = renderHook(() =>
      useQuestionAttempts({ questionId, onMaxAttemptsReached: mockOnMaxAttemptsReached })
    );

    act(() => {
      result.current.handleAttempt(false);
    });

    expect(result.current.isAnswered).toBe(true);
    expect(mockOnMaxAttemptsReached).toHaveBeenCalled();
  });

  it('devrait appeler onMaxAttemptsReached quand le maximum est atteint', () => {
    mockAddAttempt.mockReturnValue(false);

    const { result } = renderHook(() =>
      useQuestionAttempts({ questionId, onMaxAttemptsReached: mockOnMaxAttemptsReached })
    );

    act(() => {
      result.current.handleAttempt(false);
    });

    expect(mockOnMaxAttemptsReached).toHaveBeenCalled();
  });

  it('ne devrait pas permettre de tentative si canAttempt est false', () => {
    mockCanAttempt.mockReturnValue(false);

    const { result } = renderHook(() =>
      useQuestionAttempts({ questionId })
    );

    expect(result.current.canAttempt).toBe(false);

    act(() => {
      const hasMoreAttempts = result.current.handleAttempt(true);
      expect(hasMoreAttempts).toBe(false);
    });

    expect(mockAddAttempt).not.toHaveBeenCalled();
  });

  it('ne devrait pas permettre de tentative si déjà répondu', () => {
    const { result } = renderHook(() =>
      useQuestionAttempts({ questionId })
    );

    // Première tentative correcte
    act(() => {
      result.current.handleAttempt(true);
    });

    expect(result.current.isAnswered).toBe(true);

    // Deuxième tentative ne devrait pas être autorisée
    act(() => {
      const hasMoreAttempts = result.current.handleAttempt(false);
      expect(hasMoreAttempts).toBe(false);
    });

    expect(mockAddAttempt).toHaveBeenCalledTimes(1);
  });

  it('devrait créer une erreur avec les bonnes propriétés', () => {
    const { result } = renderHook(() =>
      useQuestionAttempts({ questionId })
    );

    act(() => {
      result.current.handleAttempt(false);
    });

    expect(mockAddError).toHaveBeenCalledWith({
      _id: expect.stringMatching(new RegExp(`${questionId}-\\d+`)),
      questionId,
      questionText: "",
      selectedAnswer: "",
      correctAnswer: "",
      category: "",
      date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      attempts: 1,
    });
  });
});
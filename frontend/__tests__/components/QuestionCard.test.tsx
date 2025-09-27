import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import { QuestionCard } from '../../components/questions/QuestionCard';
import { useQuestionAttempts } from '../../hooks/useQuestionAttempts';

// Mock des dépendances
jest.mock('react-hot-toast');
jest.mock('../../hooks/useQuestionAttempts');

const mockUseQuestionAttempts = useQuestionAttempts as jest.MockedFunction<typeof useQuestionAttempts>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('QuestionCard', () => {
  const defaultProps = {
    questionId: 'q1',
    question: 'Quelle est la capitale de la France ?',
    options: ['Paris', 'Lyon', 'Marseille', 'Toulouse'],
    correctAnswer: 'Paris',
    category: 'Géographie',
  };

  const mockQuestionAttempts = {
    canAttempt: true,
    attempts: 0,
    remainingAttempts: 2,
    handleAttempt: jest.fn(),
    isAnswered: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQuestionAttempts.mockReturnValue(mockQuestionAttempts);
  });

  it('devrait afficher la question et les options', () => {
    render(<QuestionCard {...defaultProps} />);

    expect(screen.getByText('Quelle est la capitale de la France ?')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Lyon')).toBeInTheDocument();
    expect(screen.getByText('Marseille')).toBeInTheDocument();
    expect(screen.getByText('Toulouse')).toBeInTheDocument();
  });

  it('devrait permettre de sélectionner une réponse', () => {
    render(<QuestionCard {...defaultProps} />);

    const parisOption = screen.getByText('Paris');
    fireEvent.click(parisOption);

    // Vérifier que l'option est sélectionnée visuellement
    expect(parisOption.closest('button')).toHaveClass('selected');
  });

  it('devrait appeler handleAttempt avec la bonne réponse', () => {
    const mockOnAnswer = jest.fn();
    mockQuestionAttempts.handleAttempt.mockReturnValue(true);

    render(<QuestionCard {...defaultProps} onAnswer={mockOnAnswer} />);

    const parisOption = screen.getByText('Paris');
    fireEvent.click(parisOption);

    const submitButton = screen.getByText('Valider');
    fireEvent.click(submitButton);

    expect(mockQuestionAttempts.handleAttempt).toHaveBeenCalledWith(true);
    expect(mockOnAnswer).toHaveBeenCalledWith(true);
  });

  it('devrait appeler handleAttempt avec une mauvaise réponse', () => {
    const mockOnAnswer = jest.fn();
    mockQuestionAttempts.handleAttempt.mockReturnValue(true);

    render(<QuestionCard {...defaultProps} onAnswer={mockOnAnswer} />);

    const lyonOption = screen.getByText('Lyon');
    fireEvent.click(lyonOption);

    const submitButton = screen.getByText('Valider');
    fireEvent.click(submitButton);

    expect(mockQuestionAttempts.handleAttempt).toHaveBeenCalledWith(false);
    expect(mockOnAnswer).toHaveBeenCalledWith(false);
  });

  it('devrait désactiver les options quand la question est répondue', () => {
    mockUseQuestionAttempts.mockReturnValue({
      ...mockQuestionAttempts,
      isAnswered: true,
      canAttempt: false,
    });

    render(<QuestionCard {...defaultProps} />);

    const options = screen.getAllByRole('button');
    options.forEach(option => {
      if (option.textContent !== 'Valider') {
        expect(option).toBeDisabled();
      }
    });
  });

  it('devrait afficher un toast quand le maximum de tentatives est atteint', () => {
    const mockOnMaxAttemptsReached = jest.fn();
    
    // Simuler que le hook appelle onMaxAttemptsReached
    mockUseQuestionAttempts.mockImplementation(({ onMaxAttemptsReached }) => {
      // Simuler l'appel du callback
      setTimeout(() => onMaxAttemptsReached?.(), 0);
      
      return {
        ...mockQuestionAttempts,
        canAttempt: false,
        attempts: 2,
        remainingAttempts: 0,
      };
    });

    render(<QuestionCard {...defaultProps} />);

    waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Vous avez atteint le nombre maximum de tentatives pour cette question.'
      );
    });
  });

  it('devrait afficher le nombre de tentatives restantes', () => {
    mockUseQuestionAttempts.mockReturnValue({
      ...mockQuestionAttempts,
      attempts: 1,
      remainingAttempts: 1,
    });

    render(<QuestionCard {...defaultProps} />);

    expect(screen.getByText(/tentatives restantes: 1/i)).toBeInTheDocument();
  });

  it('ne devrait pas permettre de valider sans sélection', () => {
    render(<QuestionCard {...defaultProps} />);

    const submitButton = screen.getByText('Valider');
    expect(submitButton).toBeDisabled();
  });

  it('devrait afficher la catégorie de la question', () => {
    render(<QuestionCard {...defaultProps} />);

    expect(screen.getByText('Géographie')).toBeInTheDocument();
  });
});
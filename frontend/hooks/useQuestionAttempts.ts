import { useState } from "react";

import { useRevision } from "@/app/RevisionContext";

interface UseQuestionAttemptsProps {
  questionId: string;
  onMaxAttemptsReached?: () => void;
}

interface UseQuestionAttemptsReturn {
  canAttempt: boolean;
  attempts: number;
  remainingAttempts: number;
  handleAttempt: (isCorrect: boolean) => boolean;
  isAnswered: boolean;
}

export const useQuestionAttempts = ({
  questionId,
  onMaxAttemptsReached,
}: UseQuestionAttemptsProps): UseQuestionAttemptsReturn => {
  const {
    addAttempt,
    canAttempt: canAttemptQuestion,
    getAttempts,
    addError,
  } = useRevision();
  const [isAnswered, setIsAnswered] = useState(false);

  const attempts = getAttempts(questionId);
  const remainingAttempts = 2 - attempts;
  const canAttempt = canAttemptQuestion(questionId) && !isAnswered;

  const handleAttempt = (isCorrect: boolean): boolean => {
    if (!canAttempt) return false;

    const hasMoreAttempts = addAttempt(questionId);

    if (!isCorrect) {
      addError({
        _id: `${questionId}-${Date.now()}`,
        questionId,
        questionText: "", // À remplir par le composant parent
        selectedAnswer: "", // À remplir par le composant parent
        correctAnswer: "", // À remplir par le composant parent
        category: "", // À remplir par le composant parent
        date: new Date().toISOString(),
        attempts: attempts + 1,
      });
    }

    if (!hasMoreAttempts || isCorrect) {
      setIsAnswered(true);
      if (onMaxAttemptsReached && !hasMoreAttempts) {
        onMaxAttemptsReached();
      }
    }

    return hasMoreAttempts;
  };

  return {
    canAttempt,
    attempts,
    remainingAttempts,
    handleAttempt,
    isAnswered,
  };
};

import React from "react";
import { toast } from "react-hot-toast";

import { useQuestionAttempts } from "@/hooks/useQuestionAttempts";

interface QuestionCardProps {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  onAnswer?: (isCorrect: boolean) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionId,
  question,
  options,
  correctAnswer,
  category,
  onAnswer,
}) => {
  const { canAttempt, attempts, remainingAttempts, handleAttempt, isAnswered } =
    useQuestionAttempts({
      questionId,
      onMaxAttemptsReached: () => {
        toast.error(
          "Vous avez atteint le nombre maximum de tentatives pour cette question.",
        );
      },
    });

  const handleAnswer = (selectedAnswer: string) => {
    if (!canAttempt) {
      toast.error(
        `Vous ne pouvez plus répondre à cette question. Il vous restait ${remainingAttempts} tentative(s).`,
      );

      return;
    }

    const isCorrect = selectedAnswer === correctAnswer;

    handleAttempt(isCorrect);

    if (isCorrect) {
      toast.success("Bonne réponse !");
    } else {
      toast.error("Mauvaise réponse. Essayez encore !");
    }

    onAnswer?.(isCorrect);
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md ${
        isAnswered ? "bg-green-50" : "bg-white"
      }`}
    >
      <h3 className="text-lg font-semibold mb-4">{question}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={`${questionId}-option-${index}`}
            className={`w-full p-3 text-left rounded-md transition-colors ${
              !canAttempt
                ? "bg-gray-100 cursor-not-allowed"
                : "hover:bg-blue-50"
            }`}
            disabled={!canAttempt}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {!canAttempt && (
        <p className="mt-2 text-sm text-gray-500">Tentatives : {attempts}/2</p>
      )}
    </div>
  );
};

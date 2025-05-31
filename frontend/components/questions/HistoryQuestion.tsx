import React from "react";
import { BaseQuestion } from "./BaseQuestion";

interface HistoryQuestionProps {
  questionId: string;
  title: string;
  content: string;
  question: string;
  options?: string[];
  image?: string;
  answer: string;
  onAnswer: (questionId: string, selectedAnswer: string, isCorrect: boolean) => void;
  onRating: (questionId: string, value: number) => void;
}

export const HistoryQuestion: React.FC<HistoryQuestionProps> = ({
  questionId,
  title,
  content,
  question,
  options,
  image,
  answer,
  onAnswer,
  onRating
}) => {
  const getEmojiForCategory = (category: string) => {
    switch (category) {
      case "antiquité":
        return "🏛️";
      case "moyen-âge":
        return "⚔️";
      case "moderne":
        return "🎭";
      case "contemporaine":
        return "🌍";
      default:
        return "📜";
    }
  };

  return (
    <BaseQuestion
      questionId={questionId}
      title={title}
      content={content}
      question={question}
      options={options}
      image={image}
      answer={answer}
      category="histoire"
      imagePath="/assets/history"
      onAnswer={onAnswer}
      getEmojiForCategory={getEmojiForCategory}
      onRating={onRating}
    />
  );
}; 
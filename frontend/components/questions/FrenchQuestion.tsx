import React from "react";
import { BaseQuestion } from "./BaseQuestion";

interface FrenchQuestionProps {
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

export const FrenchQuestion: React.FC<FrenchQuestionProps> = ({
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
      case "grammaire":
        return "📝";
      case "conjugaison":
        return "📚";
      case "orthographe":
        return "✍️";
      case "vocabulaire":
        return "📖";
      default:
        return "📚";
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
      category="français"
      imagePath="/assets/french"
      onAnswer={onAnswer}
      getEmojiForCategory={getEmojiForCategory}
      onRating={onRating}
    />
  );
}; 
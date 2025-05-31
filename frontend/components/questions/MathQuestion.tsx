import React from "react";

import { BaseQuestion } from "./BaseQuestion";

interface MathQuestionProps {
  questionId: string;
  title: string;
  content: string;
  question: string;
  options?: string[];
  image?: string;
  answer: string;
  onAnswer: (
    questionId: string,
    selectedAnswer: string,
    isCorrect: boolean,
  ) => void;
  onRating: (questionId: string, value: number) => void;
}

export const MathQuestion: React.FC<MathQuestionProps> = ({
  questionId,
  title,
  content,
  question,
  options,
  image,
  answer,
  onAnswer,
  onRating,
}) => {
  const getEmojiForCategory = (category: string) => {
    switch (category) {
      case "arithmétique":
        return "🔢";
      case "géométrie":
        return "📐";
      case "algèbre":
        return "📊";
      case "statistiques":
        return "📈";
      default:
        return "📝";
    }
  };

  return (
    <BaseQuestion
      answer={answer}
      category="mathématiques"
      content={content}
      getEmojiForCategory={getEmojiForCategory}
      image={image}
      imagePath="/assets/math"
      options={options}
      question={question}
      questionId={questionId}
      title={title}
      onAnswer={onAnswer}
      onRating={onRating}
    />
  );
};

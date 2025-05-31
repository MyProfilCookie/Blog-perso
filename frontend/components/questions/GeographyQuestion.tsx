import React from "react";
import { BaseQuestion } from "./BaseQuestion";

interface GeographyQuestionProps {
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

export const GeographyQuestion: React.FC<GeographyQuestionProps> = ({
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
      case "physique":
        return "🏔️";
      case "humaine":
        return "🌆";
      case "politique":
        return "🗺️";
      case "économique":
        return "💹";
      default:
        return "🌍";
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
      category="géographie"
      imagePath="/assets/geography"
      onAnswer={onAnswer}
      getEmojiForCategory={getEmojiForCategory}
      onRating={onRating}
    />
  );
}; 
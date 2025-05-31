import React from "react";
import { BaseQuestion } from "./BaseQuestion";

interface ArtQuestionProps {
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

export const ArtQuestion: React.FC<ArtQuestionProps> = ({
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
      case "peinture":
        return "🎨";
      case "sculpture":
        return "🗿";
      case "architecture":
        return "🏛️";
      case "musique":
        return "🎵";
      default:
        return "🎭";
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
      category="art"
      imagePath="/assets/art"
      onAnswer={onAnswer}
      getEmojiForCategory={getEmojiForCategory}
      onRating={onRating}
    />
  );
}; 
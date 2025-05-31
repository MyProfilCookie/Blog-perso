import React from "react";
import { BaseQuestion } from "./BaseQuestion";

interface MusicQuestionProps {
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

export const MusicQuestion: React.FC<MusicQuestionProps> = ({
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
      case "théorie":
        return "🎼";
      case "instruments":
        return "🎸";
      case "histoire":
        return "🎵";
      case "culture":
        return "🎶";
      default:
        return "🎹";
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
      category="musique"
      imagePath="/assets/music"
      onAnswer={onAnswer}
      getEmojiForCategory={getEmojiForCategory}
      onRating={onRating}
    />
  );
}; 
import React from "react";
import { BaseQuestion } from "./BaseQuestion";

interface TechnologyQuestionProps {
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

export const TechnologyQuestion: React.FC<TechnologyQuestionProps> = ({
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
      case "informatique":
        return "💻";
      case "robotique":
        return "🤖";
      case "électronique":
        return "🔌";
      case "programmation":
        return "👨‍💻";
      default:
        return "⚡";
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
      category="technologie"
      imagePath="/assets/technology"
      onAnswer={onAnswer}
      getEmojiForCategory={getEmojiForCategory}
      onRating={onRating}
    />
  );
}; 
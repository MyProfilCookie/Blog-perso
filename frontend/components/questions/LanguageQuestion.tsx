import React from "react";
import { BaseQuestion } from "./BaseQuestion";

interface LanguageQuestionProps {
  exercise: {
    _id: string;
    title: string;
    content: string;
    question: string;
    options?: string[];
    image?: string;
    answer: string;
    category: string;
  };
  onAnswer: (questionId: string, selectedAnswer: string, isCorrect: boolean) => void;
  getEmojiForCategory: (category: string) => string;
  onRating: (exerciseId: string, value: number) => void;
}

export const LanguageQuestion: React.FC<LanguageQuestionProps> = ({
  exercise,
  onAnswer,
  getEmojiForCategory,
  onRating
}) => {
  return (
    <BaseQuestion
      questionId={exercise._id}
      title={exercise.title}
      content={exercise.content}
      question={exercise.question}
      options={exercise.options}
      image={exercise.image}
      answer={exercise.answer}
      category={exercise.category}
      imagePath="/assets/language"
      onAnswer={onAnswer}
      getEmojiForCategory={getEmojiForCategory}
      onRating={onRating}
    />
  );
}; 
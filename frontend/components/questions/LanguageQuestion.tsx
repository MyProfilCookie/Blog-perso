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
  onAnswer: (
    questionId: string,
    selectedAnswer: string,
    isCorrect: boolean,
  ) => void;
  getEmojiForCategory: (category: string) => string;
  onRating: (exerciseId: string, value: number) => void;
}

export const LanguageQuestion: React.FC<LanguageQuestionProps> = ({
  exercise,
  onAnswer,
  getEmojiForCategory,
  onRating,
}) => {
  return (
    <BaseQuestion
      answer={exercise.answer}
      category={exercise.category}
      content={exercise.content}
      getEmojiForCategory={getEmojiForCategory}
      image={exercise.image}
      imagePath="/assets/language"
      options={exercise.options}
      question={exercise.question}
      questionId={exercise._id}
      title={exercise.title}
      onAnswer={onAnswer}
      onRating={onRating}
    />
  );
};

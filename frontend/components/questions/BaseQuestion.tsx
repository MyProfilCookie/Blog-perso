import React from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Button } from '@nextui-org/react';
import { useQuestionAttempts } from "@/hooks/useQuestionAttempts";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface BaseQuestionProps {
  questionId: string;
  title: string;
  content: string;
  question: string;
  options?: string[];
  image?: string;
  answer: string;
  category: string;
  imagePath?: string;
  onAnswer: (questionId: string, selectedAnswer: string, isCorrect: boolean) => void;
  getEmojiForCategory: (category: string) => string;
  onRating: (questionId: string, value: number) => void;
}

export const BaseQuestion: React.FC<BaseQuestionProps> = ({
  questionId,
  title,
  content,
  question,
  options,
  image,
  answer,
  category,
  imagePath = "/assets",
  onAnswer,
  getEmojiForCategory,
  onRating
}) => {
  const {
    canAttempt,
    attempts,
    remainingAttempts,
    handleAttempt,
    isAnswered
  } = useQuestionAttempts({
    questionId,
    onMaxAttemptsReached: () => {
      toast.error("Vous avez atteint le nombre maximum de tentatives pour cette question.");
    }
  });

  const handleAnswer = (selectedAnswer: string) => {
    if (!canAttempt) {
      toast.error(`Vous ne pouvez plus répondre à cette question. Il vous restait ${remainingAttempts} tentative(s).`);
      return;
    }

    const isCorrect = selectedAnswer === answer;
    const hasMoreAttempts = handleAttempt(isCorrect);

    if (!isCorrect) {
      // Enregistrer l'erreur dans le contexte de révision
      const error = {
        _id: `${questionId}-${Date.now()}`,
        questionId,
        questionText: question,
        selectedAnswer,
        correctAnswer: answer,
        category,
        date: new Date().toISOString(),
        attempts: attempts + 1
      };
      onAnswer(questionId, selectedAnswer, isCorrect);

      if (!hasMoreAttempts) {
        toast.error("Vous avez épuisé toutes vos tentatives. La bonne réponse était : " + answer);
      } else {
        toast.error("Mauvaise réponse. Il vous reste " + (remainingAttempts - 1) + " tentative(s).");
      }
    } else {
      toast.success("Bonne réponse !");
      onAnswer(questionId, selectedAnswer, isCorrect);
    }
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
      <CardBody className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="text-lg font-semibold">
              {getEmojiForCategory(category)} {title}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {category}
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">{content}</p>
            <p className="font-medium">{question}</p>
          </div>

          {image && (
            <div className="my-4">
              <Image
                src={`${imagePath}/${image}`}
                alt={title}
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-48"
              />
            </div>
          )}

          <div className="space-y-4">
            {options ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={questionId}
                      value={option}
                      onChange={() => handleAnswer(option)}
                      disabled={!canAttempt || isAnswered}
                      className="form-radio h-5 w-5"
                    />
                    <span className="text-base">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Votre réponse"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-base"
                onChange={(e) => handleAnswer(e.target.value)}
                disabled={!canAttempt || isAnswered}
              />
            )}
          </div>

          {!canAttempt && (
            <p className="mt-2 text-sm text-gray-500">
              Tentatives : {attempts}/2
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Button
              size="lg"
              color={isAnswered ? (answer === answer ? "success" : "danger") : "primary"}
              disabled={!canAttempt || isAnswered}
              className="w-full sm:w-auto py-3 px-6"
            >
              {isAnswered ? (answer === answer ? "Correct ✓" : "Incorrect ✗") : "Valider"}
            </Button>

            {isAnswered && (
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    size="lg"
                    color="default"
                    variant="flat"
                    onClick={() => onRating(questionId, value)}
                    className="w-full sm:w-auto py-3"
                  >
                    {value}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 
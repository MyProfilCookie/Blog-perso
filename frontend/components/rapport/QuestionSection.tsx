import React from "react";
import { Card, CardBody, Button } from "@nextui-org/react";

interface Question {
  _id: string;
  text?: string;
  options: string[];
  answer?: string;
  category?: string;
}

interface QuestionSectionProps {
  questions: Question[];
  selectedAnswers: Record<string, string>;
  onAnswerSelect: (questionId: string, answer: string) => void;
}

const subjectEmojis: Record<string, string> = {
  Mathématiques: "🔢",
  Sciences: "🔬",
  Français: "📚",
  Histoire: "⏳",
  Géographie: "🌍",
  Langues: "🗣️",
  "Arts Plastiques": "🎨",
  "Leçons du jour": "📖",
};

const QuestionSection: React.FC<QuestionSectionProps> = ({
  questions,
  selectedAnswers,
  onAnswerSelect,
}) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
        📋 Questions Complémentaires
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1400px] mx-auto">
        {questions.map((question, index) => (
          <Card
            key={question._id}
            className="border-2 border-violet-200 dark:border-violet-700 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <CardBody className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                {`${subjectEmojis[question.category || ""] || "❓"} ${question.text || `Question ${index + 1}`}`}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(question.options?.length
                  ? question.options
                  : ["Oui", "Non", "Peut-être"]
                ).map((option, optIdx) => (
                  <Button
                    key={optIdx}
                    className={`p-2 text-xs sm:text-sm rounded ${
                      selectedAnswers[question._id] === option
                        ? "bg-violet-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => onAnswerSelect(question._id, option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionSection;

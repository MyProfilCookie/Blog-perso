"use client";

import { useState } from "react";
import { Card, CardBody, Button, Progress } from "@nextui-org/react";
import { motion } from "framer-motion";

interface ProgressTrackerProps {
  subject: string;
  onRating: (rating: "Facile" | "Moyen" | "Difficile") => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  subject,
  onRating,
}) => {
  const [ratings, setRatings] = useState<{
    Facile: number;
    Moyen: number;
    Difficile: number;
  }>({
    Facile: 0,
    Moyen: 0,
    Difficile: 0,
  });

  const [encouragementMessage, setEncouragementMessage] = useState<string>("");

  const handleRating = (rating: "Facile" | "Moyen" | "Difficile") => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [rating]: prevRatings[rating] + 1,
    }));

    // Messages d'encouragement personnalisés selon la difficulté
    const messages = {
      Facile: [
        "🌟 Bravo ! Tu as très bien réussi cette leçon ! Continue comme ça !",
        "✨ Excellent travail ! Tu peux être fier(e) de toi !",
        "🎉 Super ! Tu as tout compris ! Tu es sur la bonne voie !"
      ],
      Moyen: [
        "💪 Tu as fait de beaux efforts ! Chaque pas compte !",
        "🌈 Continue d'essayer, tu progresses très bien !",
        "⭐ Tu t'améliores chaque jour, c'est super !"
      ],
      Difficile: [
        "🤗 N'abandonne pas ! Tu es courageux(se) d'avoir essayé !",
        "🌱 Chaque difficulté te rend plus fort(e) ! On continue ensemble !",
        "💝 Tu as osé essayer, c'est déjà une belle victoire !"
      ]
    };

    // Sélection aléatoire d'un message d'encouragement
    const randomMessage = messages[rating][Math.floor(Math.random() * messages[rating].length)];
    setEncouragementMessage(randomMessage);
    onRating(rating);
  };

  const totalRatings = Object.values(ratings).reduce((a, b) => a + b, 0);
  const progress = totalRatings > 0 ? (ratings.Facile / totalRatings) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardBody className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center">
            Progression en {subject}
          </h3>
          
          <Progress
            value={progress}
            color="success"
            className="mb-6"
            showValueLabel
          />

          <div className="flex flex-col gap-4">
            <Button
              color="success"
              variant="flat"
              onClick={() => handleRating("Facile")}
              className="w-full"
            >
              Facile
            </Button>
            <Button
              color="warning"
              variant="flat"
              onClick={() => handleRating("Moyen")}
              className="w-full"
            >
              Moyen
            </Button>
            <Button
              color="danger"
              variant="flat"
              onClick={() => handleRating("Difficile")}
              className="w-full"
            >
              Difficile
            </Button>
          </div>

          {encouragementMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center"
            >
              {encouragementMessage}
            </motion.div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}; 
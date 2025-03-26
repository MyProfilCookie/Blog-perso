"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const encouragementMessages = [
  "🌟 Bravo ! Tu as déjà fait 15 minutes d'exercices ! Continue comme ça !",
  "✨ Excellent travail ! Tu es à mi-parcours de ta session !",
  "💪 Tu es très concentré ! Encore 15 minutes et tu auras terminé !",
  "🌈 Tu progresses bien ! Garde ce rythme !",
  "🚀 Tu es sur la bonne voie ! Continue d'avancer !",
  "🎯 Tu t'améliores à chaque minute !",
  "⭐ Tu as tout pour réussir ! Encore un effort !",
  "🌱 Chaque minute d'étude te rapproche de ton objectif !",
  "💫 Tu es en train de créer ta réussite !",
  "🎨 Tu es capable de grandes choses ! Continue !"
];

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 heure en secondes
  const [showMessage, setShowMessage] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
      // Calcul de la progression
      setProgress((3600 - timeLeft) / 36); // 36 = 3600/100 pour avoir un pourcentage
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      if (timeLeft > 0) {
        setShowMessage(true);
        setMessageIndex((prev) => (prev + 1) % encouragementMessages.length);
        setTimeout(() => setShowMessage(false), 5000);
      }
    }, 900000); // Toutes les 15 minutes (15 * 60 * 1000)

    return () => clearInterval(messageInterval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div 
        className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-xl p-4 flex items-center gap-3"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-2xl">⏱️</span>
        <div className="flex flex-col">
          <span className="font-mono text-lg text-white">
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </span>
          <div className="w-full bg-white/20 rounded-full h-1 mt-1">
            <motion.div 
              className="bg-yellow-300 h-1 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-20 right-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-xl max-w-sm text-center"
          >
            <p className="text-sm sm:text-base font-medium">
              {encouragementMessages[messageIndex]}
            </p>
            <p className="text-xs mt-1 opacity-80">
              {Math.round(progress)}% de la session terminée
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
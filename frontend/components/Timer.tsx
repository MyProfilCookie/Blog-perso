"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

const encouragementMessages = [
  "Tu es sur la bonne voie ! Continue comme ça ! 🌟",
  "Excellent travail ! Tu progresses bien ! 🎯",
  "Bravo ! Tu es très concentré ! 💪",
  "Tu es capable de grandes choses ! 🌈",
  "Continue, tu es en train de réussir ! 🚀",
];

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 heure en secondes
  const [showMessage, setShowMessage] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faClock} className="text-primary-500" />
        <span className="font-mono text-lg">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {encouragementMessages[messageIndex]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AICharacterProps {
  isTyping?: boolean;
  isHappy?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}

const AICharacter: React.FC<AICharacterProps> = ({ 
  isTyping = false, 
  isHappy = false, 
  size = "medium",
  className = ""
}) => {
  const [currentEmotion, setCurrentEmotion] = useState<"neutral" | "happy" | "thinking">("neutral");
  const [isBlinking, setIsBlinking] = useState(false);

  // Gestion des émotions
  useEffect(() => {
    if (isHappy) {
      setCurrentEmotion("happy");
    } else if (isTyping) {
      setCurrentEmotion("thinking");
    } else {
      setCurrentEmotion("neutral");
    }
  }, [isHappy, isTyping]);

  // Animation de clignement des yeux
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Tailles
  const sizes = {
    small: { width: 80, height: 80 },
    medium: { width: 120, height: 120 },
    large: { width: 160, height: 160 }
  };

  const currentSize = sizes[size];

  return (
    <div className={`relative ${className}`}>
      {/* Personnage principal */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          duration: 0.8
        }}
        whileHover={{ scale: 1.05 }}
        className="relative"
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Corps de l'ours/lion */}
          <motion.ellipse
            cx="60"
            cy="85"
            rx="35"
            ry="25"
            fill="#FFB366"
            stroke="#E67E22"
            strokeWidth="2"
            animate={{
              scale: isHappy ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 0.6,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          
          {/* Tête */}
          <motion.circle
            cx="60"
            cy="50"
            r="28"
            fill="#FFB366"
            stroke="#E67E22"
            strokeWidth="2"
            animate={{
              y: isHappy ? [0, -2, 0] : 0,
            }}
            transition={{
              duration: 0.8,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />

          {/* Oreilles */}
          <motion.circle
            cx="45"
            cy="30"
            r="12"
            fill="#FFB366"
            stroke="#E67E22"
            strokeWidth="2"
            animate={{
              rotate: isHappy ? [0, 5, 0] : 0,
            }}
            transition={{
              duration: 0.4,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          <motion.circle
            cx="75"
            cy="30"
            r="12"
            fill="#FFB366"
            stroke="#E67E22"
            strokeWidth="2"
            animate={{
              rotate: isHappy ? [0, -5, 0] : 0,
            }}
            transition={{
              duration: 0.4,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />

          {/* Intérieur des oreilles */}
          <ellipse cx="45" cy="30" rx="6" ry="8" fill="#FFE0B3" />
          <ellipse cx="75" cy="30" rx="6" ry="8" fill="#FFE0B3" />

          {/* Yeux */}
          <motion.circle
            cx="52"
            cy="45"
            r="4"
            fill="white"
            animate={{
              scaleY: isBlinking ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />
          <motion.circle
            cx="68"
            cy="45"
            r="4"
            fill="white"
            animate={{
              scaleY: isBlinking ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Pupilles */}
          <motion.circle
            cx="52"
            cy="45"
            r="2"
            fill="#2C3E50"
            animate={{
              x: currentEmotion === "happy" ? [0, 1, 0] : 0,
              y: currentEmotion === "happy" ? [0, -1, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.circle
            cx="68"
            cy="45"
            r="2"
            fill="#2C3E50"
            animate={{
              x: currentEmotion === "happy" ? [0, -1, 0] : 0,
              y: currentEmotion === "happy" ? [0, -1, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Reflets dans les yeux */}
          <circle cx="53" cy="44" r="1" fill="white" opacity="0.8" />
          <circle cx="69" cy="44" r="1" fill="white" opacity="0.8" />

          {/* Nez */}
          <motion.ellipse
            cx="60"
            cy="55"
            rx="3"
            ry="2"
            fill="#2C3E50"
            animate={{
              scale: currentEmotion === "happy" ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Bouche */}
          <AnimatePresence>
            {currentEmotion === "happy" ? (
              <motion.path
                key="happy"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                d="M 50 65 Q 60 75 70 65"
                stroke="#2C3E50"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                transition={{ duration: 0.3 }}
              />
            ) : currentEmotion === "thinking" ? (
              <motion.ellipse
                key="thinking"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                cx="60"
                cy="65"
                rx="4"
                ry="2"
                fill="#2C3E50"
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.path
                key="neutral"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                d="M 52 65 L 68 65"
                stroke="#2C3E50"
                strokeWidth="2"
                strokeLinecap="round"
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Pattes */}
          <ellipse cx="45" cy="100" rx="8" ry="12" fill="#FFB366" stroke="#E67E22" strokeWidth="2" />
          <ellipse cx="75" cy="100" rx="8" ry="12" fill="#FFB366" stroke="#E67E22" strokeWidth="2" />

          {/* Pattes avant */}
          <ellipse cx="40" cy="90" rx="6" ry="10" fill="#FFB366" stroke="#E67E22" strokeWidth="2" />
          <ellipse cx="80" cy="90" rx="6" ry="10" fill="#FFB366" stroke="#E67E22" strokeWidth="2" />

          {/* Effet de brillance quand il est heureux */}
          <AnimatePresence>
            {isHappy && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
              >
                <circle cx="35" cy="25" r="2" fill="#FFD700" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="85" cy="20" r="1.5" fill="#FFD700" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="25" cy="40" r="1" fill="#FFD700" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.8s" repeatCount="indefinite" />
                </circle>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Effet de pensée quand il réfléchit */}
          <AnimatePresence>
            {isTyping && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <circle cx="90" cy="20" r="3" fill="#E8F4FD" stroke="#3498DB" strokeWidth="1" />
                <circle cx="95" cy="15" r="2" fill="#E8F4FD" stroke="#3498DB" strokeWidth="1" />
                <circle cx="100" cy="12" r="1.5" fill="#E8F4FD" stroke="#3498DB" strokeWidth="1" />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </motion.div>

      {/* Bulle de dialogue occasionnelle */}
      <AnimatePresence>
        {isHappy && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -10 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-lg border-2 border-yellow-300"
          >
            <div className="text-sm font-medium text-gray-800">
              🎉 Génial !
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-yellow-300"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AICharacter;

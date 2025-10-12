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
          {/* Corps du chaton */}
          <motion.ellipse
            cx="60"
            cy="85"
            rx="30"
            ry="22"
            fill="#FFB6C1"
            stroke="#FF69B4"
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
          
          {/* Tête du chaton */}
          <motion.circle
            cx="60"
            cy="50"
            r="26"
            fill="#FFB6C1"
            stroke="#FF69B4"
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

          {/* Oreilles pointues du chat */}
          <motion.polygon
            points="45,25 35,40 55,40"
            fill="#FFB6C1"
            stroke="#FF69B4"
            strokeWidth="2"
            animate={{
              rotate: isHappy ? [0, 3, 0] : 0,
            }}
            transition={{
              duration: 0.4,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          <motion.polygon
            points="75,25 85,40 65,40"
            fill="#FFB6C1"
            stroke="#FF69B4"
            strokeWidth="2"
            animate={{
              rotate: isHappy ? [0, -3, 0] : 0,
            }}
            transition={{
              duration: 0.4,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />

          {/* Intérieur des oreilles */}
          <polygon points="45,30 40,38 50,38" fill="#FFC0CB" />
          <polygon points="75,30 80,38 70,38" fill="#FFC0CB" />

          {/* Yeux du chaton (plus grands et expressifs) */}
          <motion.ellipse
            cx="52"
            cy="45"
            rx="5"
            ry="6"
            fill="white"
            animate={{
              scaleY: isBlinking ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />
          <motion.ellipse
            cx="68"
            cy="45"
            rx="5"
            ry="6"
            fill="white"
            animate={{
              scaleY: isBlinking ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Pupilles du chaton (verticales) */}
          <motion.ellipse
            cx="52"
            cy="45"
            rx="1.5"
            ry="4"
            fill="#2C3E50"
            animate={{
              x: currentEmotion === "happy" ? [0, 1, 0] : 0,
              y: currentEmotion === "happy" ? [0, -1, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.ellipse
            cx="68"
            cy="45"
            rx="1.5"
            ry="4"
            fill="#2C3E50"
            animate={{
              x: currentEmotion === "happy" ? [0, -1, 0] : 0,
              y: currentEmotion === "happy" ? [0, -1, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Reflets dans les yeux */}
          <ellipse cx="53" cy="43" rx="1" ry="2" fill="white" opacity="0.9" />
          <ellipse cx="69" cy="43" rx="1" ry="2" fill="white" opacity="0.9" />

          {/* Nez du chaton (triangle) */}
          <motion.polygon
            points="60,52 55,58 65,58"
            fill="#FF69B4"
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

          {/* Pattes du chaton */}
          <ellipse cx="45" cy="100" rx="7" ry="10" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />
          <ellipse cx="75" cy="100" rx="7" ry="10" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />

          {/* Pattes avant du chaton */}
          <ellipse cx="40" cy="90" rx="5" ry="8" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />
          <ellipse cx="80" cy="90" rx="5" ry="8" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />

          {/* Moustaches du chaton */}
          <line x1="35" y1="55" x2="25" y2="55" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="35" y1="58" x2="25" y2="58" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="85" y1="55" x2="95" y2="55" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="85" y1="58" x2="95" y2="58" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" />

          {/* Queue du chaton */}
          <motion.path
            d="M 30 85 Q 20 75 15 85 Q 20 95 30 85"
            fill="#FFB6C1"
            stroke="#FF69B4"
            strokeWidth="2"
            animate={{
              rotate: isHappy ? [0, 10, 0] : 0,
            }}
            transition={{
              duration: 1,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />

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
              🐱 Miaou !
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

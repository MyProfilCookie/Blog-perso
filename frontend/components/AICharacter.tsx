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
          {/* Corps du koala (plus doux) */}
          <motion.ellipse
            cx="60"
            cy="85"
            rx="28"
            ry="22"
            fill="#D3D3D3"
            stroke="#B8B8B8"
            strokeWidth="1.5"
            animate={{
              scale: isHappy ? [1, 1.03, 1] : 1,
            }}
            transition={{
              duration: 0.8,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          
          {/* Tête du koala (plus ronde et douce) */}
          <motion.circle
            cx="60"
            cy="50"
            r="25"
            fill="#E8E8E8"
            stroke="#B8B8B8"
            strokeWidth="1.5"
            animate={{
              y: isHappy ? [0, -1, 0] : 0,
            }}
            transition={{
              duration: 1,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />

          {/* Oreilles du koala (plus petites et douces) */}
          <motion.circle
            cx="45"
            cy="32"
            r="10"
            fill="#E8E8E8"
            stroke="#B8B8B8"
            strokeWidth="1.5"
            animate={{
              rotate: isHappy ? [0, 3, 0] : 0,
            }}
            transition={{
              duration: 0.6,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          <motion.circle
            cx="75"
            cy="32"
            r="10"
            fill="#E8E8E8"
            stroke="#B8B8B8"
            strokeWidth="1.5"
            animate={{
              rotate: isHappy ? [0, -3, 0] : 0,
            }}
            transition={{
              duration: 0.6,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />

          {/* Intérieur des oreilles (rose doux) */}
          <ellipse cx="45" cy="32" rx="5" ry="6" fill="#FFB6C1" opacity="0.7" />
          <ellipse cx="75" cy="32" rx="5" ry="6" fill="#FFB6C1" opacity="0.7" />

          {/* Yeux du koala (plus grands et expressifs) */}
          <motion.circle
            cx="52"
            cy="47"
            r="7"
            fill="white"
            animate={{
              scaleY: isBlinking ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />
          <motion.circle
            cx="68"
            cy="47"
            r="7"
            fill="white"
            animate={{
              scaleY: isBlinking ? 0.1 : 1,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Pupilles du koala (plus grandes et noires) */}
          <motion.circle
            cx="52"
            cy="47"
            r="4"
            fill="#2C2C2C"
            animate={{
              x: currentEmotion === "happy" ? [0, 1, 0] : 0,
              y: currentEmotion === "happy" ? [0, -1, 0] : 0,
            }}
            transition={{ duration: 0.4 }}
          />
          <motion.circle
            cx="68"
            cy="47"
            r="4"
            fill="#2C2C2C"
            animate={{
              x: currentEmotion === "happy" ? [0, -1, 0] : 0,
              y: currentEmotion === "happy" ? [0, -1, 0] : 0,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Reflets dans les yeux (plus grands) */}
          <circle cx="54" cy="45" r="2" fill="white" opacity="0.9" />
          <circle cx="70" cy="45" r="2" fill="white" opacity="0.9" />

          {/* Nez du koala (plus grand et noir) */}
          <motion.ellipse
            cx="60"
            cy="57"
            rx="5"
            ry="4"
            fill="#2C2C2C"
            animate={{
              scale: currentEmotion === "happy" ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
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

          {/* Pattes du koala (plus douces) */}
          <ellipse cx="45" cy="100" rx="7" ry="10" fill="#D3D3D3" stroke="#B8B8B8" strokeWidth="1.5" />
          <ellipse cx="75" cy="100" rx="7" ry="10" fill="#D3D3D3" stroke="#B8B8B8" strokeWidth="1.5" />

          {/* Pattes avant du koala */}
          <ellipse cx="40" cy="88" rx="5" ry="8" fill="#D3D3D3" stroke="#B8B8B8" strokeWidth="1.5" />
          <ellipse cx="80" cy="88" rx="5" ry="8" fill="#D3D3D3" stroke="#B8B8B8" strokeWidth="1.5" />

          {/* Coussinets des pattes (rose doux) */}
          <ellipse cx="42" cy="105" rx="3" ry="2" fill="#FFB6C1" opacity="0.8" />
          <ellipse cx="72" cy="105" rx="3" ry="2" fill="#FFB6C1" opacity="0.8" />

          {/* Queue courte du koala (plus douce) */}
          <motion.circle
            cx="25"
            cy="88"
            r="6"
            fill="#D3D3D3"
            stroke="#B8B8B8"
            strokeWidth="1.5"
            animate={{
              scale: isHappy ? [1, 1.05, 1] : 1,
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

    </div>
  );
};

export default AICharacter;

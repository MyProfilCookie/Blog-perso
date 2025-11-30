"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AICharacterProps {
  isTyping?: boolean;
  isHappy?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  ariaLabel?: string;
}

const AICharacter: React.FC<AICharacterProps> = ({ 
  isTyping = false, 
  isHappy = false, 
  size = "medium",
  className = "",
  primaryColor = "#5eb3d6",
  secondaryColor = "#1e3a5f",
  accentColor = "#e07856",
  ariaLabel
}) => {
  // Tailles
  const sizes = {
    small: { width: 80, height: 80 },
    medium: { width: 120, height: 120 },
    large: { width: 160, height: 160 }
  };

  const currentSize = sizes[size];

  // Définition du label pour l'accessibilité
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    if (isHappy) return "Assistant IA heureux";
    if (isTyping) return "Assistant IA en train de réfléchir";
    return "Assistant IA neutre";
  };

  return (
    <div 
      className={`relative ${className}`}
      role="img"
      aria-label={getAriaLabel()}
    >
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
          {/* Fond circulaire beige */}
          <motion.circle
            cx="60"
            cy="60"
            r="55"
            fill="#f5f1e6"
            animate={{
              scale: isHappy ? [1, 1.02, 1] : 1,
            }}
            transition={{
              duration: 0.8,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          
          {/* Pièce de puzzle (Corps) */}
          <motion.path
            d="M 30 25 L 45 25 C 45 20 50 20 50 25 C 50 20 55 20 55 25 L 70 25 C 75 25 75 30 75 35 L 75 50 C 80 50 80 55 75 60 C 80 60 80 65 75 65 L 75 80 C 75 85 70 85 65 85 L 50 85 C 50 90 50 95 45 95 C 40 95 40 90 40 85 L 25 85 C 20 85 20 80 20 75 L 20 60 C 15 60 15 55 20 55 C 15 55 15 50 20 50 L 20 35 C 20 30 25 25 30 25 Z"
            fill={primaryColor}
            stroke={secondaryColor}
            strokeWidth="2"
            animate={{
              scale: isHappy ? [1, 1.05, 1] : 1,
              rotate: isHappy ? [0, 2, 0] : 0,
            }}
            transition={{
              duration: 0.6,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          
          {/* Yeux (Points décoratifs) - Animation de clignement via scaleY */}
          <motion.g
             animate={{ 
               scaleY: [1, 1, 0.1, 1, 1, 1] 
             }}
             transition={{
               duration: 4,
               times: [0, 0.9, 0.95, 1, 1],
               repeat: Infinity,
               repeatDelay: Math.random() * 2
             }}
          >
            <circle
              cx="35"
              cy="50"
              r="3"
              fill={accentColor}
              opacity="0.7"
            />
            <circle
              cx="85"
              cy="50"
              r="4"
              fill={accentColor}
            />
          </motion.g>

          {/* Autres éléments décoratifs */}
          <motion.circle
            cx="50"
            cy="15"
            r="3"
            fill={accentColor}
            animate={{
              scale: isHappy ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              repeat: isHappy ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          <motion.circle
            cx="50"
            cy="85"
            r="3"
            fill={accentColor}
            opacity="0.7"
            animate={{
              scale: isHappy ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.6,
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
                <circle cx="25" cy="25" r="2" fill="#FFD700" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="95" cy="25" r="1.5" fill="#FFD700" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="25" cy="75" r="1" fill="#FFD700" opacity="0.7">
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
                <motion.circle 
                  cx="90" cy="20" r="3" 
                  fill="#E8F4FD" stroke="#3498DB" strokeWidth="1"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.circle 
                  cx="98" cy="12" r="2" 
                  fill="#E8F4FD" stroke="#3498DB" strokeWidth="1"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
                <motion.circle 
                  cx="106" cy="6" r="1.5" 
                  fill="#E8F4FD" stroke="#3498DB" strokeWidth="1"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </motion.div>

    </div>
  );
};

export default AICharacter;

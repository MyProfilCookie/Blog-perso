"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

interface QuizBackButtonProps {
  label?: string;
  onConfirm?: () => void;
  showWarning?: boolean;
  warningMessage?: string;
  className?: string;
}

export default function QuizBackButton({ 
  label = "Retour", 
  onConfirm,
  showWarning = true,
  warningMessage = "Êtes-vous sûr de vouloir quitter le quiz ? Votre progression sera sauvegardée.",
  className = ""
}: QuizBackButtonProps) {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showLyonImage, setShowLyonImage] = useState(false);

  const handleBackClick = () => {
    if (showWarning) {
      setShowConfirmation(true);
    } else {
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      // Afficher l'image de Lyon pendant 1 seconde
      setShowLyonImage(true);
      setTimeout(() => {
        setShowLyonImage(false);
        router.back();
      }, 1000);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Button
        variant="bordered"
        size="sm"
        onClick={handleBackClick}
        className={`flex items-center gap-2 ${className}`}
        startContent={<FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />}
      >
        {label}
      </Button>

      {/* Modal de confirmation */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon 
                    icon={faExclamationTriangle} 
                    className="w-8 h-8 text-yellow-600 dark:text-yellow-400" 
                  />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Confirmer la sortie
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {warningMessage}
                </p>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="light"
                    onClick={handleCancel}
                    className="px-6"
                  >
                    Annuler
                  </Button>
                  <Button
                    color="danger"
                    onClick={handleConfirm}
                    className="px-6"
                  >
                    Quitter le quiz
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image de Lyon pendant 1 seconde */}
      <AnimatePresence>
        {showLyonImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-96 h-64 rounded-xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/assets/geography.webp"
                alt="Lyon - Ville de France"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-4">
                <h2 className="text-white text-xl font-bold">
                  Lyon, France 🇫🇷
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

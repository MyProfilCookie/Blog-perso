"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

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
      router.back();
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

    </>
  );
}

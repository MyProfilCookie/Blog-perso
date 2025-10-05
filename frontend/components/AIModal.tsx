"use client";

import React from "react";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAI } from "@/app/contexts/AIContext";
import AIAssistantPremium from "./AIAssistantPremium";

const AIModal: React.FC = () => {
  const { isOpen, closeAI } = useAI();

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={closeAI}
          size="4xl"
          scrollBehavior="inside"
          classNames={{
            base: "bg-transparent shadow-none",
            backdrop: "bg-black/50 backdrop-blur-sm",
          }}
          motionProps={{
            variants: {
              enter: {
                scale: 1,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              },
              exit: {
                scale: 0.95,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              },
            },
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="p-0 overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="relative"
                  >
                    {/* Bouton de fermeture personnalisé */}
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-200 group"
                    >
                      <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
                    </button>

                    {/* Composant AI Assistant */}
                    <AIAssistantPremium />
                  </motion.div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default AIModal;


"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AIContextType {
  isOpen: boolean;
  openAI: () => void;
  closeAI: () => void;
  toggleAI: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openAI = () => setIsOpen(true);
  const closeAI = () => setIsOpen(false);
  const toggleAI = () => setIsOpen(!isOpen);

  return (
    <AIContext.Provider value={{ isOpen, openAI, closeAI, toggleAI }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};


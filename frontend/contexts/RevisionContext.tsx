"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface RevisionError {
  _id: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  date: string;
}

interface RevisionContextType {
  errors: RevisionError[];
  addError: (error: RevisionError) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
}

const RevisionContext = createContext<RevisionContextType | undefined>(undefined);

export const RevisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<RevisionError[]>([]);

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        
        if (!userId || !token) {
          console.error("Utilisateur non connecté");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/revision-errors/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setErrors(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des erreurs:", error);
      }
    };

    fetchErrors();
  }, []);

  const addError = (error: RevisionError) => {
    setErrors(prev => [...prev, error]);
  };

  const removeError = (id: string) => {
    setErrors(prev => prev.filter(error => error._id !== id));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <RevisionContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
    </RevisionContext.Provider>
  );
};

export const useRevision = () => {
  const context = useContext(RevisionContext);
  if (context === undefined) {
    throw new Error("useRevision doit être utilisé à l'intérieur d'un RevisionProvider");
  }
  return context;
}; 
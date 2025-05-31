"use client";
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";

interface RevisionError {
  _id: string;
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  category: string;
  date: string;
  attempts: number;
}

interface QuestionAttempt {
  questionId: string;
  attempts: number;
  lastAttempt: string;
}

interface RevisionContextType {
  errors: RevisionError[];
  questionAttempts: Record<string, QuestionAttempt>;
  addError: (error: RevisionError) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  addAttempt: (questionId: string) => boolean;
  canAttempt: (questionId: string) => boolean;
  getAttempts: (questionId: string) => number;
}

const RevisionContext = createContext<RevisionContextType | undefined>(undefined);

export const useRevision = () => {
  const context = useContext(RevisionContext);
  if (context === undefined) {
    throw new Error('useRevision must be used within a RevisionProvider');
  }
  return context;
};

interface RevisionProviderProps {
  children: ReactNode;
}

export const RevisionProvider: React.FC<RevisionProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<RevisionError[]>([]);
  const [questionAttempts, setQuestionAttempts] = useState<Record<string, QuestionAttempt>>({});

  const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://blog-perso.onrender.com";


  useEffect(() => {
    const fetchErrors = async () => {
      if (typeof window === 'undefined') return;

      const user = localStorage.getItem("user");
      const token = localStorage.getItem("userToken");

      if (!user || !token) return;

      try {
        const userId = JSON.parse(user)._id;

        const response = await fetch(`${baseUrl}/revision-errors?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setErrors(data.errors || []);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des erreurs:', error);
      }
    };

    fetchErrors();
  }, []);

  const addError = (error: RevisionError) => {
    setErrors(prev => [...prev, error]);

    // Sauvegarder l'erreur dans l'API
    const saveError = async () => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("userToken");

      if (!user || !token) return;

      try {
        const userId = JSON.parse(user)._id;
        await fetch(`${baseUrl}/revision-errors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...error,
            userId
          }),
        });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'erreur:', error);
      }
    };

    saveError();
  };

  const removeError = (id: string) => {
    setErrors(prev => prev.filter(error => error._id !== id));

    // Supprimer l'erreur de l'API
    const deleteError = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        await fetch(`${baseUrl}/revision-errors/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'erreur:', error);
      }
    };

    deleteError();
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const addAttempt = (questionId: string): boolean => {
    setQuestionAttempts(prev => {
      const currentAttempts = prev[questionId]?.attempts || 0;
      const newAttempts = currentAttempts + 1;
      
      if (newAttempts > 2) {
        return prev;
      }

      return {
        ...prev,
        [questionId]: {
          questionId,
          attempts: newAttempts,
          lastAttempt: new Date().toISOString()
        }
      };
    });

    return getAttempts(questionId) < 2;
  };

  const canAttempt = (questionId: string): boolean => {
    return getAttempts(questionId) < 2;
  };

  const getAttempts = (questionId: string): number => {
    return questionAttempts[questionId]?.attempts || 0;
  };

  return (
    <RevisionContext.Provider 
      value={{ 
        errors, 
        questionAttempts,
        addError, 
        removeError, 
        clearErrors,
        addAttempt,
        canAttempt,
        getAttempts
      }}
    >
      {children}
    </RevisionContext.Provider>
  );
};
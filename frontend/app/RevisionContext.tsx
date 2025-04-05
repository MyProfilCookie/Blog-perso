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
}

interface RevisionContextType {
  errors: RevisionError[];
  addError: (error: RevisionError) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
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

  useEffect(() => {
    const fetchErrors = async () => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("userToken");

      if (!user || !token) return;

      const userId = JSON.parse(user)._id;

      const response = await fetch(`/api/revision-errors?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setErrors(data.errors || []);
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
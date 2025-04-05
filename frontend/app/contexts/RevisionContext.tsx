"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface RevisionError {
  _id: string;
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  category: string;
  date: string;
}

export const RevisionContext = createContext<RevisionError[]>([]);

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

  return (
    <RevisionContext.Provider value={errors}>
      {children}
    </RevisionContext.Provider>
  );
};
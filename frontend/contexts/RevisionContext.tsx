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
  isLoading: boolean;
  isAuthenticated: boolean;
}

const RevisionContext = createContext<RevisionContextType | undefined>(undefined);

export const RevisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<RevisionError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        // Vérifier si nous sommes dans un environnement navigateur
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        // Vérifier si l'utilisateur est connecté en utilisant plusieurs méthodes
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const userToken = localStorage.getItem("userToken");
        const userInfo = localStorage.getItem("userInfo");
        
        // Si l'une de ces informations est présente, considérer l'utilisateur comme connecté
        const isUserLoggedIn = userId || token || userToken || userInfo;
        
        if (!isUserLoggedIn) {
          console.log("Utilisateur non connecté, affichage des données de démonstration");
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // L'utilisateur est connecté
        setIsAuthenticated(true);
        
        // Utiliser le token disponible
        const authToken = token || userToken;
        const userIdentifier = userId || (userInfo ? JSON.parse(userInfo).id : null);
        
        if (!authToken || !userIdentifier) {
          console.log("Informations d'authentification incomplètes");
          setIsLoading(false);
          return;
        }
        
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/revision-errors/${userIdentifier}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`
              }
            }
          );

          if (response.data && Array.isArray(response.data)) {
            setErrors(response.data);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des erreurs:", error);
          // En cas d'erreur, on garde un tableau vide mais on considère toujours l'utilisateur comme authentifié
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur lors de l'accès au localStorage:", error);
      } finally {
        setIsLoading(false);
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
    <RevisionContext.Provider value={{ 
      errors, 
      addError, 
      removeError, 
      clearErrors,
      isLoading,
      isAuthenticated
    }}>
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
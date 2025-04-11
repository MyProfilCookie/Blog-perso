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

        // Récupérer les informations d'authentification selon la structure de l'application
        const userToken = localStorage.getItem("userToken");
        const userInfo = localStorage.getItem("user");
        
        console.log("Informations d'authentification trouvées:", {
          userToken: userToken ? "présent" : "absent",
          userInfo: userInfo ? "présent" : "absent"
        });
        
        // Vérifier si l'utilisateur est connecté
        if (!userToken || !userInfo) {
          console.log("Utilisateur non connecté ou token manquant");
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // L'utilisateur est connecté
        setIsAuthenticated(true);
        
        // Récupérer l'ID utilisateur depuis les informations utilisateur
        let userId = null;
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          userId = parsedUserInfo._id || parsedUserInfo.id;
          console.log(`ID utilisateur trouvé: ${userId}`);
        } catch (e) {
          console.error("Erreur lors du parsing de userInfo:", e);
          setIsLoading(false);
          return;
        }
        
        if (!userId) {
          console.log("ID utilisateur non trouvé dans userInfo");
          setIsLoading(false);
          return;
        }
        
        console.log(`Tentative de récupération des erreurs pour l'utilisateur: ${userId}`);
        
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/revision-errors/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`
              }
            }
          );

          if (response.data && Array.isArray(response.data)) {
            setErrors(response.data);
            console.log(`${response.data.length} erreurs récupérées`);
          } else {
            console.log("Aucune donnée reçue de l'API");
            setErrors([]);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des erreurs:", error);
          setErrors([]);
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
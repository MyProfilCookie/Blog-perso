"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface RevisionError {
  _id: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  date: string;
  questionId?: string;
  category?: string;
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
          // Adapter la route pour correspondre au contrôleur backend
          // Le contrôleur attend un paramètre de requête userId, pas un paramètre d'URL
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/revision-errors`,
            {
              params: { userId },
              headers: {
                Authorization: `Bearer ${userToken}`
              }
            }
          );

          // Adapter le traitement de la réponse selon la structure du contrôleur
          if (response.data && response.data.success && Array.isArray(response.data.errors)) {
            setErrors(response.data.errors);
            console.log(`${response.data.errors.length} erreurs récupérées`);
          } else {
            console.log("Format de réponse inattendu:", response.data);
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

  const addError = async (error: RevisionError) => {
    try {
      // Récupérer les informations d'authentification
      const userToken = localStorage.getItem("userToken");
      const userInfo = localStorage.getItem("user");
      
      if (!userToken || !userInfo) {
        console.error("Impossible d'ajouter une erreur: utilisateur non connecté");
        return;
      }
      
      // Récupérer l'ID utilisateur
      let userId = null;
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        userId = parsedUserInfo._id || parsedUserInfo.id;
      } catch (e) {
        console.error("Erreur lors du parsing de userInfo:", e);
        return;
      }
      
      if (!userId) {
        console.error("ID utilisateur non trouvé dans userInfo");
        return;
      }
      
      // Ajouter l'erreur à l'API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/revision-errors`,
        {
          ...error,
          userId
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Ajouter l'erreur au state local
        setErrors(prev => [...prev, response.data.error]);
        console.log("Erreur ajoutée avec succès");
      } else {
        console.error("Erreur lors de l'ajout de l'erreur:", response.data);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'erreur:", error);
    }
  };

  const removeError = async (id: string) => {
    try {
      // Récupérer le token d'authentification
      const userToken = localStorage.getItem("userToken");
      
      if (!userToken) {
        console.error("Impossible de supprimer l'erreur: utilisateur non connecté");
        return;
      }
      
      // Supprimer l'erreur de l'API
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/revision-errors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Supprimer l'erreur du state local
        setErrors(prev => prev.filter(error => error._id !== id));
        console.log("Erreur supprimée avec succès");
      } else {
        console.error("Erreur lors de la suppression de l'erreur:", response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'erreur:", error);
    }
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
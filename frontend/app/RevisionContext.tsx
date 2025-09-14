/* eslint-disable no-console */
"use client";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

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
  getErrorsByCategory: () => Record<string, RevisionError[]>;
}

const RevisionContext = createContext<RevisionContextType | undefined>(
  undefined,
);

export const useRevision = () => {
  const context = useContext(RevisionContext);

  if (context === undefined) {
    throw new Error("useRevision must be used within a RevisionProvider");
  }

  return context;
};

interface RevisionProviderProps {
  children: ReactNode;
}

export const RevisionProvider: React.FC<RevisionProviderProps> = ({
  children,
}) => {
  const [errors, setErrors] = useState<RevisionError[]>([]);
  const [questionAttempts, setQuestionAttempts] = useState<
    Record<string, QuestionAttempt>
  >({});

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://blog-perso.onrender.com";

  useEffect(() => {
    const fetchErrors = async () => {
      if (typeof window === "undefined") return;

      const user = localStorage.getItem("user");
      const token = localStorage.getItem("userToken");

      if (!user || !token) return;

      try {
        const userId = JSON.parse(user)._id;

        const response = await fetch(
          `${baseUrl}/revision-errors?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();

          setErrors(data.errors || []);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des erreurs:", error);
      }
    };

    fetchErrors();
  }, []);

  const addError = (error: RevisionError) => {
    console.log("Début de l'ajout d'une erreur:", error);
    setErrors((prev) => {
      console.log("État précédent des erreurs:", prev);
      const newErrors = [...prev, error];
      console.log("Nouvel état des erreurs:", newErrors);
      return newErrors;
    });

    // Sauvegarder l'erreur dans l'API
    const saveError = async () => {
      console.log("Début de la sauvegarde de l'erreur dans l'API");
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("userToken");

      console.log("Données d'authentification:", { user, token });

      if (!user || !token) {
        console.error("Données d'authentification manquantes");
        return;
      }

      try {
        const userId = JSON.parse(user)._id;
        console.log("Tentative de sauvegarde de l'erreur pour l'utilisateur:", userId);

        const response = await fetch(`${baseUrl}/revision-errors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...error,
            userId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Erreur sauvegardée avec succès:", data);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'erreur:", error);
      }
    };

    saveError();
  };

  const removeError = (id: string) => {
    setErrors((prev) => prev.filter((error) => error._id !== id));

    // Supprimer l'erreur de l'API
    const deleteError = async () => {
      const token = localStorage.getItem("userToken");

      if (!token) return;

      try {
        await fetch(`${baseUrl}/revision-errors/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Erreur lors de la suppression de l'erreur:", error);
      }
    };

    deleteError();
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const addAttempt = (questionId: string): boolean => {
    setQuestionAttempts((prev) => {
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
          lastAttempt: new Date().toISOString(),
        },
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

  const getErrorsByCategory = () => {
    return errors.reduce((acc, error) => {
      const category = error.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(error);
      return acc;
    }, {} as Record<string, RevisionError[]>);
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
        getAttempts,
        getErrorsByCategory,
      }}
    >
      {children}
    </RevisionContext.Provider>
  );
};

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
  userId?: string;
}

interface RevisionContextType {
  errors: RevisionError[];
  addError: (error: RevisionError) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  errorMessage: string | null;
}

const RevisionContext = createContext<RevisionContextType | undefined>(
  undefined,
);

// Données de démonstration pour les tests
const DEMO_ERRORS: RevisionError[] = [
  {
    _id: "demo1",
    questionText: "Quelle est la capitale de la France ?",
    selectedAnswer: "Londres",
    correctAnswer: "Paris",
    date: new Date().toISOString(),
    category: "Géographie",
    userId: "66f43be41d9ee6af088ab2ca",
  },
  {
    _id: "demo2",
    questionText: "Quelle est la planète la plus proche du soleil ?",
    selectedAnswer: "Vénus",
    correctAnswer: "Mercure",
    date: new Date().toISOString(),
    category: "Astronomie",
    userId: "66f43be41d9ee6af088ab2ca",
  },
];

export const RevisionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [errors, setErrors] = useState<RevisionError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        setErrorMessage(null);
        // Vérifier si nous sommes dans un environnement navigateur
        if (typeof window === "undefined") {
          setIsLoading(false);

          return;
        }

        // Récupérer les informations d'authentification selon la structure de l'application
        const userToken = localStorage.getItem("userToken");
        const userInfo = localStorage.getItem("user");

        console.log("Informations d'authentification trouvées:", {
          userToken: userToken ? "présent" : "absent",
          userInfo: userInfo ? "présent" : "absent",
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
        let userId: string | null = null;

        try {
          const parsedUserInfo = JSON.parse(userInfo);

          userId = parsedUserInfo._id || parsedUserInfo.id;
          console.log(`ID utilisateur trouvé: ${userId}`);
        } catch (e) {
          console.error("Erreur lors du parsing de userInfo:", e);
          setErrorMessage(
            "Erreur lors de la récupération des informations utilisateur",
          );
          setIsLoading(false);

          return;
        }

        if (!userId) {
          console.log("ID utilisateur non trouvé dans userInfo");
          setErrorMessage("ID utilisateur non trouvé");
          setIsLoading(false);

          return;
        }

        console.log(
          `Tentative de récupération des erreurs pour l'utilisateur: ${userId}`,
        );

        try {
          // Utiliser la route /user/:userId pour récupérer les erreurs de l'utilisateur
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/revision-errors/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            },
          );

          // Traitement de la réponse selon la structure du contrôleur
          if (
            response.data &&
            response.data.success &&
            Array.isArray(response.data.errors)
          ) {
            // Vérifier que chaque erreur a un ID MongoDB valide
            const validErrors = response.data.errors.filter(
              (error: RevisionError) =>
                error._id && error._id.match(/^[0-9a-fA-F]{24}$/),
            );

            if (validErrors.length !== response.data.errors.length) {
              console.warn(
                `Certaines erreurs n'ont pas d'ID MongoDB valide: ${response.data.errors.length - validErrors.length} erreurs ignorées`,
              );
            }

            setErrors(validErrors);
            console.log(`${validErrors.length} erreurs récupérées`);
          } else {
            console.log("Format de réponse inattendu:", response.data);
            setErrors([]);
            if (response.data && response.data.message) {
              setErrorMessage(response.data.message);
            }
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des erreurs:", error);

          // En cas d'erreur, utiliser les données de démonstration
          console.log("Utilisation des données de démonstration");
          const demoErrors = DEMO_ERRORS.filter((err) => err.userId === userId);

          setErrors(demoErrors);

          if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage(
              "Erreur lors de la récupération des erreurs. Affichage des données de démonstration.",
            );
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'accès au localStorage:", error);
        setErrorMessage(
          "Erreur lors de l'accès aux informations d'authentification",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchErrors();
  }, []);

  const addError = async (error: RevisionError) => {
    try {
      setErrorMessage(null);
      // Récupérer les informations d'authentification
      const userToken = localStorage.getItem("userToken");
      const userInfo = localStorage.getItem("user");

      if (!userToken || !userInfo) {
        console.error(
          "Impossible d'ajouter une erreur: utilisateur non connecté",
        );
        setErrorMessage("Vous devez être connecté pour ajouter une erreur");

        return;
      }

      // Récupérer l'ID utilisateur
      let userId: string | null = null;

      try {
        const parsedUserInfo = JSON.parse(userInfo);

        userId = parsedUserInfo._id || parsedUserInfo.id;
      } catch (e) {
        console.error("Erreur lors du parsing de userInfo:", e);
        setErrorMessage(
          "Erreur lors de la récupération des informations utilisateur",
        );

        return;
      }

      if (!userId) {
        console.error("ID utilisateur non trouvé dans userInfo");
        setErrorMessage("ID utilisateur non trouvé");

        return;
      }

      // Route exactement comme dans le contrôleur backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/revision-errors`,
        {
          userId,
          questionId: error.questionId,
          questionText: error.questionText,
          selectedAnswer: error.selectedAnswer,
          correctAnswer: error.correctAnswer,
          category: error.category,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      if (response.data && response.data.success) {
        // Ajouter l'erreur au state local
        setErrors((prev) => [...prev, response.data.error]);
        console.log("Erreur ajoutée avec succès");
      } else {
        console.error("Erreur lors de l'ajout de l'erreur:", response.data);
        if (response.data && response.data.message) {
          setErrorMessage(response.data.message);
        } else {
          setErrorMessage("Erreur lors de l'ajout de l'erreur");
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'erreur:", error);

      // En cas d'erreur, ajouter l'erreur localement
      const errorData = error as Partial<RevisionError>;
      const newError: RevisionError = {
        _id: `local-${Date.now()}`,
        questionText: errorData.questionText || "Question sans texte",
        selectedAnswer: errorData.selectedAnswer || "Réponse non spécifiée",
        correctAnswer:
          errorData.correctAnswer || "Réponse correcte non spécifiée",
        date: new Date().toISOString(),
        questionId: errorData.questionId,
        category: errorData.category,
        userId: errorData.userId,
      };

      setErrors((prev) => [...prev, newError]);
      console.log("Erreur ajoutée localement en raison d'une erreur API");

      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Erreur lors de l'ajout de l'erreur. L'erreur a été ajoutée localement.",
        );
      }
    }
  };

  const removeError = async (id: string) => {
    try {
      setErrorMessage(null);
      // Récupérer le token d'authentification
      const userToken = localStorage.getItem("userToken");

      if (!userToken) {
        console.error(
          "Impossible de supprimer l'erreur: utilisateur non connecté",
        );
        setErrorMessage("Vous devez être connecté pour supprimer une erreur");

        return;
      }

      // Vérifier si l'ID est un ID d'erreur valide (format MongoDB)
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        console.error("ID d'erreur invalide:", id);
        setErrorMessage("ID d'erreur invalide");

        return;
      }

      // Route exactement comme dans le contrôleur backend
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/revision-errors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      if (response.data && response.data.success) {
        // Supprimer l'erreur du state local
        setErrors((prev) => prev.filter((error) => error._id !== id));
        console.log("Erreur supprimée avec succès");
      } else {
        console.error(
          "Erreur lors de la suppression de l'erreur:",
          response.data,
        );
        if (response.data && response.data.message) {
          setErrorMessage(response.data.message);
          // Si l'erreur est "Erreur non trouvée", on la supprime quand même du state local
          if (response.data.message === "Erreur non trouvée") {
            setErrors((prev) => prev.filter((error) => error._id !== id));
            console.log(
              "L'erreur n'existe pas dans la base de données, suppression du state local",
            );
          }
        } else {
          setErrorMessage("Erreur lors de la suppression de l'erreur");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'erreur:", error);

      // En cas d'erreur, supprimer l'erreur localement
      setErrors((prev) => prev.filter((error) => error._id !== id));
      console.log("Erreur supprimée localement en raison d'une erreur API");

      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
        // Si l'erreur est "Erreur non trouvée", on la supprime quand même du state local
        if (error.response.data.message === "Erreur non trouvée") {
          setErrors((prev) => prev.filter((error) => error._id !== id));
          console.log(
            "L'erreur n'existe pas dans la base de données, suppression du state local",
          );
        }
      } else {
        setErrorMessage(
          "Erreur lors de la suppression de l'erreur. L'erreur a été supprimée localement.",
        );
      }
    }
  };

  const clearErrors = () => {
    setErrors([]);
    setErrorMessage(null);
  };

  return (
    <RevisionContext.Provider
      value={{
        errors,
        addError,
        removeError,
        clearErrors,
        isLoading,
        isAuthenticated,
        errorMessage,
      }}
    >
      {children}
    </RevisionContext.Provider>
  );
};

export const useRevision = () => {
  const context = useContext(RevisionContext);

  if (context === undefined) {
    throw new Error(
      "useRevision doit être utilisé à l'intérieur d'un RevisionProvider",
    );
  }

  return context;
};

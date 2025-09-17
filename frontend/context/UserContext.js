import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importer le routeur ici

import LoadingAnimation from "@/components/loading";

// Créer le contexte utilisateur
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Pas de type User, on utilise simplement null ou un objet utilisateur
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Utiliser useRouter pour les redirections

  // Charger l'utilisateur depuis le localStorage au montage
  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("userToken");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser)); // Charger l'utilisateur depuis localStorage
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
        // En cas d'erreur de parsing, nettoyer les données corrompues
        localStorage.removeItem("user");
        localStorage.removeItem("userToken");
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("user", JSON.stringify(userData)); // Sauvegarder l'utilisateur dans le localStorage

      // Déclencher un événement personnalisé pour notifier les autres composants
      const event = new CustomEvent("userUpdate", { detail: userData });
      window.dispatchEvent(event);
    }
  };

  const logoutUser = () => {
    setUser(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user"); // Supprimer l'utilisateur du localStorage
      localStorage.removeItem("userToken"); // Supprimer le token
    }
    
    router.replace("/"); // Rediriger après déconnexion
    // Suppression du reload automatique pour éviter les problèmes
  };

  if (loading) {
    // eslint-disable-next-line react/jsx-no-undef
    return <LoadingAnimation />;
  }

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

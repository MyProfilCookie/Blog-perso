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
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Charger l'utilisateur depuis localStorage
    }
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Sauvegarder l'utilisateur dans le localStorage

    // Déclencher un événement personnalisé pour notifier les autres composants
    const event = new CustomEvent("userUpdate", { detail: userData });

    window.dispatchEvent(event);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user"); // Supprimer l'utilisateur du localStorage
    router.replace("/"); // Rediriger après déconnexion
    setTimeout(() => window.location.reload(), 500);
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

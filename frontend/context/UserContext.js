import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importer le routeur ici

import LoadingAnimation from "@/components/loading";
import { normalizeAvatarUrl } from "@/utils/normalizeAvatarUrl";

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
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          avatar: normalizeAvatarUrl(parsedUser?.avatar),
        }); // Charger l'utilisateur depuis localStorage
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
        // En cas d'erreur de parsing, nettoyer les données corrompues
        localStorage.removeItem("user");
        localStorage.removeItem("userToken");
      }
    }
    setLoading(false);
  }, []);

  const loginUser = React.useCallback((userData) => {
    const normalizedUser = {
      ...userData,
      avatar: normalizeAvatarUrl(userData?.avatar),
    };
    setUser(normalizedUser);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("user", JSON.stringify(normalizedUser)); // Sauvegarder l'utilisateur dans le localStorage

      // Déclencher un événement personnalisé pour notifier les autres composants
      const event = new CustomEvent("userUpdate", { detail: userData });
      window.dispatchEvent(event);
    }
  }, []);

  const logoutUser = React.useCallback(() => {
    setUser(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user"); // Supprimer l'utilisateur du localStorage
      localStorage.removeItem("userToken"); // Supprimer le token
    }
    
    router.replace("/"); // Rediriger après déconnexion
    // Suppression du reload automatique pour éviter les problèmes
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUserLoggedIn = (event) => {
      const detailUser = event?.detail;
      if (detailUser) {
        loginUser(detailUser);
        return;
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          loginUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Erreur lors de la relecture du user après login:", error);
        }
      }
    };

    window.addEventListener("userLoggedIn", handleUserLoggedIn);

    const syncFromStorage = () => {
      try {
        const token = localStorage.getItem("userToken") || localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) {
          setUser(null);
          return;
        }
        const parsed = JSON.parse(storedUser);
        setUser({ ...parsed, avatar: normalizeAvatarUrl(parsed?.avatar) });
      } catch (e) {
        console.error("Sync user depuis storage a échoué:", e);
        setUser(null);
      }
    };

    const handleStorage = (e) => {
      if (["user", "userToken", "accessToken", "refreshToken"].includes(e.key)) {
        syncFromStorage();
      }
    };

    const handleUserUpdate = () => {
      syncFromStorage();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("userUpdate", handleUserUpdate);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userUpdate", handleUserUpdate);
    };
  }, [loginUser]);

  const contextValue = React.useMemo(() => ({ user, loginUser, logoutUser }), [user, loginUser, logoutUser]);

  if (loading) {
    // eslint-disable-next-line react/jsx-no-undef
    return <LoadingAnimation />;
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

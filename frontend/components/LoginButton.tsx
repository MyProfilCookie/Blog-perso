"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

interface LoginButtonProps {
  variant?: "default" | "outline" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function LoginButton({
  variant = "default",
  size = "md",
  showIcon = true,
  fullWidth = false,
  className = "",
  onClick,
  disabled = false,
  loading = false,
}: LoginButtonProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Vérifier l'état de connexion au montage du composant
  useEffect(() => {
    setMounted(true);
    checkAuthStatus();
    
    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkAuthStatus = () => {
    try {
      // Vérifier différentes sources d'authentification
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      const user = localStorage.getItem("user");
      const userInfoStorage = localStorage.getItem("userInfo");

      let isAuthenticated = false;
      let userData = null;

      // Méthode 1: Token + userId
      if (token && userId) {
        isAuthenticated = true;
      }

      // Méthode 2: Données utilisateur dans localStorage
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          if (parsedUser && (parsedUser._id || parsedUser.id)) {
            isAuthenticated = true;
            userData = parsedUser;
          }
        } catch (e) {
          console.warn("Erreur parsing user:", e);
        }
      }

      // Méthode 3: UserInfo
      if (userInfoStorage) {
        try {
          const parsedUserInfo = JSON.parse(userInfoStorage);
          if (parsedUserInfo && parsedUserInfo._id) {
            isAuthenticated = true;
            userData = parsedUserInfo;
          }
        } catch (e) {
          console.warn("Erreur parsing userInfo:", e);
        }
      }

      setIsLoggedIn(isAuthenticated);
      setUserInfo(userData);
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };

  const handleLogout = () => {
    try {
      // Nettoyer toutes les données d'authentification
      localStorage.removeItem("token");
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
      
      // Mettre à jour l'état
      setIsLoggedIn(false);
      setUserInfo(null);
      
      // Rediriger vers la page d'accueil
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (isLoggedIn) {
      handleLogout();
    } else {
      router.push("/users/login");
    }
  };

  const getButtonProps = () => {
    const baseColor: "danger" | "primary" = isLoggedIn ? "danger" : "primary";
    
    switch (variant) {
      case "outline":
        return {
          color: baseColor,
          variant: "bordered" as const,
        };
      case "ghost":
        return {
          color: baseColor,
          variant: "light" as const,
        };
      case "icon":
        return {
          color: baseColor,
          variant: "light" as const,
          isIconOnly: true,
        };
      default:
        return {
          color: baseColor,
          variant: "solid" as const,
        };
    }
  };

  const buttonProps = getButtonProps();

  // Ne pas rendre le composant côté serveur pour éviter l'hydratation mismatch
  if (!mounted) {
    return (
      <Button
        color="primary"
        variant="solid"
        size={size}
        disabled={true}
        className={`
          ${fullWidth ? "w-full" : ""}
          ${variant === "icon" ? "min-w-unit-10" : ""}
          font-medium
          shadow-lg
          transition-all
          duration-300
          ${className}
        `}
      >
        {variant === "icon" ? (
          <FontAwesomeIcon icon={faUser} className="text-lg" />
        ) : (
          "Chargement..."
        )}
      </Button>
    );
  }

  const buttonText = isLoggedIn ? "Se déconnecter" : "Se connecter";
  const buttonIcon = isLoggedIn ? faSignOutAlt : faSignInAlt;

  // Styles personnalisés pour améliorer la visibilité en mode light
  const getCustomStyles = () => {
    if (variant === "ghost") {
      return isLoggedIn 
        ? `
          !text-red-700 dark:!text-red-400 
          hover:!text-white hover:!bg-red-600 
          border-red-600 dark:border-red-400
          bg-red-50 dark:bg-red-950/20
          hover:border-red-700
        `
        : `
          !text-blue-700 dark:!text-blue-400 
          hover:!text-white hover:!bg-blue-600 
          border-blue-600 dark:border-blue-400
          bg-blue-50 dark:bg-blue-950/20
          hover:border-blue-700
        `;
    }
    
    if (variant === "outline") {
      return isLoggedIn 
        ? `
          !text-red-700 dark:!text-red-400 
          !border-red-600 dark:!border-red-400
          hover:!text-white hover:!bg-red-600 
          hover:!border-red-700
        `
        : `
          !text-blue-700 dark:!text-blue-400 
          !border-blue-600 dark:!border-blue-400
          hover:!text-white hover:!bg-blue-600 
          hover:!border-blue-700
        `;
    }
    
    return "";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        {...buttonProps}
        size={size}
        onClick={handleClick}
        disabled={disabled}
        isLoading={loading}
        className={`
          ${fullWidth ? "w-full" : ""}
          ${variant === "icon" ? "min-w-unit-10" : ""}
          font-medium
          shadow-lg
          hover:shadow-xl
          transition-all
          duration-300
          ${getCustomStyles()}
          ${className}
        `}
        startContent={
          showIcon && variant !== "icon" && !loading ? (
            <FontAwesomeIcon icon={buttonIcon} className="text-sm" />
          ) : null
        }
      >
        {variant === "icon" ? (
          <FontAwesomeIcon icon={isLoggedIn ? faSignOutAlt : faUser} className="text-lg" />
        ) : loading ? (
          "Chargement..."
        ) : (
          buttonText
        )}
      </Button>
    </motion.div>
  );
}

// Composant d'exemple d'utilisation
export function LoginButtonExamples() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-xl font-semibold mb-4">Exemples de boutons de connexion</h3>
      
      {/* Bouton par défaut */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Bouton par défaut :</p>
        <LoginButton />
      </div>

      {/* Bouton outline */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Bouton avec bordure :</p>
        <LoginButton variant="outline" />
      </div>

      {/* Bouton ghost */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Bouton transparent :</p>
        <LoginButton variant="ghost" />
      </div>

      {/* Bouton icône seulement */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Bouton icône :</p>
        <LoginButton variant="icon" />
      </div>

      {/* Bouton pleine largeur */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Bouton pleine largeur :</p>
        <LoginButton fullWidth />
      </div>

      {/* Bouton sans icône */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Bouton sans icône :</p>
        <LoginButton showIcon={false} />
      </div>

      {/* Différentes tailles */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Différentes tailles :</p>
        <div className="flex gap-2 items-center">
          <LoginButton size="sm" />
          <LoginButton size="md" />
          <LoginButton size="lg" />
        </div>
      </div>

      {/* Bouton en chargement */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Bouton en chargement :</p>
        <LoginButton loading />
      </div>

      {/* Bouton désactivé */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Bouton désactivé :</p>
        <LoginButton disabled />
      </div>
    </div>
  );
}
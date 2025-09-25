"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faUser } from "@fortawesome/free-solid-svg-icons";

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

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/users/login");
    }
  };

  const getButtonProps = () => {
    switch (variant) {
      case "outline":
        return {
          color: "primary" as const,
          variant: "bordered" as const,
        };
      case "ghost":
        return {
          color: "primary" as const,
          variant: "light" as const,
        };
      case "icon":
        return {
          color: "primary" as const,
          variant: "light" as const,
          isIconOnly: true,
        };
      default:
        return {
          color: "primary" as const,
          variant: "solid" as const,
        };
    }
  };

  const buttonProps = getButtonProps();

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
          ${className}
        `}
        startContent={
          showIcon && variant !== "icon" && !loading ? (
            <FontAwesomeIcon icon={faSignInAlt} className="text-sm" />
          ) : null
        }
      >
        {variant === "icon" ? (
          <FontAwesomeIcon icon={faUser} className="text-lg" />
        ) : loading ? (
          "Connexion..."
        ) : (
          "Se connecter"
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
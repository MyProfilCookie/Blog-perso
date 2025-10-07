"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { Checkbox } from '@nextui-org/react';
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import { AutismLogo } from "@/components/icons"; // Assurez-vous que le chemin est correct
export default function Connexion() {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État de connexion
  const router = useRouter();

  // Validation du mot de passe
  const validatePassword = (value: string) => {
    const lengthValid = value.length >= 8;
    const specialCharValid = /[!@#$%^&*]/.test(value);

    if (!lengthValid || !specialCharValid) {
      setPasswordStrength(
        "Mot de passe faible (8 caractères minimum et un caractère spécial)",
      );
    } else {
      setPasswordStrength("Mot de passe fort");
    }
  };

  const handleLogin = () => {
    if (pseudo.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le pseudo doit comporter au moins 8 caractères.",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "bg-blue-500 text-white",
        },
      });

      return;
    }

    const passwordRegex = /^(?=.*[!@#$%^&*])/;

    if (password.length < 8 || !passwordRegex.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le mot de passe doit comporter au moins 8 caractères et contenir un caractère spécial.",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "bg-blue-500 text-white",
        },
      });

      return;
    }

    setLoading(true); // Démarrer le chargement

    setTimeout(() => {
      setLoading(false); // Arrêter le chargement après 2 secondes
      setIsAuthenticated(true);
      Swal.fire({
        icon: "success",
        title: "Connexion réussie",
        text: "Bienvenue sur AutiStudy, vous êtes maintenant connecté(e) !",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "bg-green-500 text-white",
        },
      }).then(() => {
        router.push("/profile"); // Redirige vers le profil
      });
    }, 2000);
  };

  const handleSignupRedirect = () => {
    router.push("/signup"); // Redirige vers la page d'inscription
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    Swal.fire({
      icon: "info",
      title: "Déconnexion réussie",
      text: "Vous êtes déconnecté(e).",
      confirmButtonText: "Ok",
      customClass: {
        confirmButton: "bg-blue-500 text-white",
      },
    }).then(() => {
      router.push("/"); // Redirige vers la page d'accueil après déconnexion
    });
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen py-2"
      initial={{ opacity: 0, y: -50 }}
      transition={{ duration: 1 }}
    >
      {/* Logo et Titre */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <AutismLogo className="mx-auto mb-2" size={60} />{" "}
        {/* Utilisation du logo */}
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Bienvenue sur AutiStudy
        </h1>
      </motion.div>

      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-lg text-center text-gray-600"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        Connectez-vous pour accéder à des ressources adaptées et un suivi
        personnalisé.
      </motion.p>

      {!isAuthenticated ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 w-[300px]"
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Input
            isClearable
            required
            placeholder="Pseudo (8 caractères minimum)"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />

          <Input
            isClearable
            required
            placeholder="Mot de passe (8 caractères + caractère spécial)"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          />
          {password && (
            <p
              className={`text-sm ${
                passwordStrength.includes("faible")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {passwordStrength}
            </p>
          )}

          <Checkbox
            isSelected={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
          >
            S'inscrire à la newsletter
          </Checkbox>

          {loading ? (
            <Button disabled className="bg-blue-500">
              Connexion en cours...
            </Button>
          ) : (
            <Button className="bg-blue-500" onPress={handleLogin}>
              Se connecter
            </Button>
          )}

          <p className="mt-4 text-center">
            Vous n'avez pas de compte ?{" "}
            <Button color="primary" onPress={handleSignupRedirect}>
              S'inscrire
            </Button>
          </p>
        </motion.div>
      ) : (
        <Button className="mt-4 bg-red-500" onPress={handleLogout}>
          Se déconnecter
        </Button>
      )}
    </motion.div>
  );
}

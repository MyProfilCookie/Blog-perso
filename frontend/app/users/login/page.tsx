"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { Checkbox } from '@nextui-org/react';
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import "sweetalert2/dist/sweetalert2.min.css";
import axios from "axios";

import { useAuth } from "@/context/AuthContext"; // Assurez-vous d'avoir ce chemin correct
import { AutismLogo } from "@/components/icons"; // Vérifie le bon chemin

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false); // Checkbox newsletter
  const [loading, setLoading] = useState(false); // État de chargement
  const [passwordStrength, setPasswordStrength] = useState(""); // Force du mot de passe
  const router = useRouter();
  // const { login } = useAuth(); // Utilisation du contexte d'authentification

  // Fonction de validation du mot de passe
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

  // Fonction de gestion de la connexion
  const handleLogin = async () => {
    // Validation de l'email (doit ressembler à un email)
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez entrer une adresse email valide.",
        confirmButtonText: "Ok",
      });

      return;
    }

    // Validation du mot de passe
    const passwordRegex = /^(?=.*[!@#$%^&*])/;

    if (password.length < 8 || !passwordRegex.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le mot de passe doit comporter au moins 8 caractères et contenir un caractère spécial.",
        confirmButtonText: "Ok",
      });

      return;
    }

    setLoading(true);

    try {
      console.log("🔍 Tentative de connexion pour:", email);
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      ).replace(/\/$/, "");

      console.log("🔍 URL API:", apiUrl);

      const response = await axios.post(`${apiUrl}/users/login`, {
        email,
        password,
      });

      console.log("✅ Réponse de connexion:", response.status);

      // Vérifier si la réponse contient un token et un utilisateur
      if (response.data && response.data.accessToken) {
        // Stocker le token
        console.log(
          "🔑 Token reçu (début):",
          response.data.accessToken.substring(0, 15) + "...",
        );
        localStorage.setItem("userToken", response.data.accessToken);

        // Vérifier que le token est bien stocké
        const storedToken = localStorage.getItem("userToken");

        console.log(
          "🔍 Token stocké dans localStorage:",
          storedToken ? "OUI" : "NON",
        );

        // Stocker les informations utilisateur
        if (response.data.user) {
          // Normaliser les données utilisateur
          const userData = {
            ...response.data.user,
            avatar:
              response.data.user.image ||
              response.data.user.avatar ||
              "/assets/default-avatar.webp",
            role: response.data.user.role || "user",
            deliveryAddress: response.data.user.deliveryAddress || {
              street: "Adresse inconnue",
              city: "Ville inconnue",
              postalCode: "Code postal inconnu",
              country: "France",
            },
          };

          localStorage.setItem("user", JSON.stringify(userData));
          console.log(
            "✅ Données utilisateur stockées:",
            userData.pseudo || userData.email,
          );

          // Notifier les autres composants que l'utilisateur s'est connecté
          window.dispatchEvent(new CustomEvent("userUpdate"));

          // Afficher le succès et rediriger
          Swal.fire({
            icon: "success",
            title: "Connexion réussie",
            text: `Bienvenue sur AutiStudy, ${userData.pseudo || userData.prenom || userData.nom || userData.email}!`,
            confirmButtonText: "Ok",
          }).then(() => {
            router.back(); // Redirection vers la page précédente
          });
        } else {
          handleLoginError(
            400,
            "Données utilisateur manquantes dans la réponse",
          );
        }
      } else {
        console.error("❌ Réponse incorrecte:", response.data);
        handleLoginError(400, "Token manquant dans la réponse");
      }
    } catch (error: any) {
      console.error("❌ Erreur de connexion:", error);

      if (error.response) {
        console.log(
          "❌ Détails de l'erreur:",
          error.response.status,
          error.response.data,
        );
        handleLoginError(
          error.response.status,
          error.response.data.message || "Erreur inconnue",
        );
      } else {
        handleLoginError(500, "Erreur de connexion au serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = (status: number, message: string) => {
    if (status === 404) {
      Swal.fire({
        icon: "error",
        title: "Utilisateur non trouvé",
        text: "Il semble que vous ne soyez pas encore inscrit(e). Souhaitez-vous vous inscrire maintenant ?",
        showCancelButton: true,
        confirmButtonText: "Oui, m'inscrire",
        cancelButtonText: "Annuler",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/users/signup");
        }
      });
    } else if (status === 401) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Mot de passe incorrect.",
        confirmButtonText: "Ok",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: message || "Erreur serveur",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 md:py-2"
      initial={{ opacity: 0, y: -50 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6 w-full max-w-[90%] md:max-w-[400px]"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <AutismLogo className="mx-auto mb-2" size={40} />
        <h1 className="text-2xl md:text-4xl font-bold text-center text-blue-600">
          Bienvenue sur AutiStudy
        </h1>
      </motion.div>

      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6 text-base md:text-lg text-center text-gray-600 px-4"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        Connectez-vous pour accéder à des ressources adaptées et un suivi personnalisé.
      </motion.p>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 w-full max-w-[90%] md:max-w-[400px] px-4"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <Input
          required
          label="Email"
          placeholder="exemple@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />

        <Input
          required
          label="Mot de passe"
          placeholder="8 caractères min. + caractère spécial"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          className="w-full"
        />
        {password && (
          <p
            className={`text-xs md:text-sm ${
              passwordStrength.includes("faible") ? "text-red-500" : "text-green-500"
            }`}
          >
            {passwordStrength}
          </p>
        )}

        <Checkbox 
          isSelected={newsletter} 
          onValueChange={setNewsletter}
          className="text-sm md:text-base"
        >
          S&apos;inscrire à la newsletter
        </Checkbox>

        <Button
          className="mt-2 w-full"
          color="primary"
          isLoading={loading}
          onClick={handleLogin}
          size="lg"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </Button>

        <div className="mt-4 text-center text-sm md:text-base">
          <p className="mb-2">Vous n&apos;avez pas de compte ?</p>
          <Button
            color="secondary"
            variant="light"
            onClick={() => router.push("/users/signup")}
            className="w-full md:w-auto"
          >
            S&apos;inscrire
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

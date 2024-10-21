/* eslint-disable prettier/prettier */
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Checkbox } from "@nextui-org/react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import "sweetalert2/dist/sweetalert2.min.css";

import { AutismLogo } from "@/components/icons"; // Assurez-vous que le chemin est correct pour votre logo

export default function Connexion() {
  const [identifier, setIdentifier] = useState(""); // Pseudo ou email
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false); // Checkbox newsletter
  const [loading, setLoading] = useState(false); // État de chargement
  const [passwordStrength, setPasswordStrength] = useState(""); // Force du mot de passe
  const router = useRouter();

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
    // Validation du pseudo ou de l'email
    if (identifier.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le pseudo ou l'email doit comporter au moins 8 caractères.",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "bg-blue-500 text-white",
        },
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
        customClass: {
          confirmButton: "bg-blue-500 text-white",
        },
      });

      return;
    }

    // Début du chargement
    setLoading(true);

    const isEmail = /\S+@\S+\.\S+/.test(identifier); // Vérification si l'identifiant est un email

    try {
      // Envoi des données de connexion
      const loginData = isEmail
        ? { email: identifier, password }
        : { pseudo: identifier, password };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        },
      );

      const data = await response.json();

      // Fin du chargement
      setLoading(false);

      if (!response.ok) {
        // Gestion des erreurs du serveur
        if (response.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Utilisateur non trouvé",
            text: "Il semble que vous ne soyez pas encore inscrit(e). Souhaitez-vous vous inscrire maintenant ?",
            showCancelButton: true,
            confirmButtonText: "Oui, m'inscrire",
            cancelButtonText: "Annuler",
            customClass: {
              confirmButton: "bg-blue-500 text-white",
              cancelButton: "bg-gray-500 text-white",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/users/signup");
            }
          });
        } else if (response.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Mot de passe incorrect.",
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "bg-blue-500 text-white",
            },
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: data.message || "Erreur serveur",
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "bg-blue-500 text-white",
            },
          });
        }

        return;
      }

      // Stocker l'utilisateur et le token dans le localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          pseudo: data.user.pseudo,
          email: data.user.email,
          avatar: data.user.avatar || "/assets/default-avatar.webp", // Utiliser l'avatar s'il existe, sinon un avatar par défaut
          role: data.user.role || "user", // Assurez-vous que l'API renvoie bien le rôle de l'utilisateur
        })
      );

      // Stocker le token d'authentification dans le localStorage
      localStorage.setItem("userToken", data.token);  // <-- Ajouter cette ligne

      // Déclencher un événement personnalisé pour rafraîchir la navbar
      const userUpdateEvent = new CustomEvent("userUpdate");

      window.dispatchEvent(userUpdateEvent);

      // Afficher le succès et rediriger vers le tableau de bord correspondant
      Swal.fire({
        icon: "success",
        title: "Connexion réussie",
        text: `Bienvenue sur AutiStudy, ${data.user.pseudo || data.user.prenom}!`,
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "bg-green-500 text-white",
        },
      }).then(() => {
        // Redirection en fonction du rôle de l'utilisateur
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la connexion au serveur.",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "bg-blue-500 text-white",
        },
      });
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen py-2"
      initial={{ opacity: 0, y: -50 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <AutismLogo className="mx-auto mb-2" size={60} />
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

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 w-[300px]"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <Input
          required
          placeholder="Pseudo ou Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <Input
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
            className={`text-sm ${passwordStrength.includes("faible")
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
          S&apos;inscrire à la newsletter
        </Checkbox>

        {loading ? (
          <Button disabled className="bg-blue-500">
            Connexion...
          </Button>
        ) : (
          <Button className="bg-blue-500" onClick={handleLogin}>
            Se connecter
          </Button>
        )}

        <p className="mt-4 text-center">
          Vous n&apos;avez pas de compte ?{" "}
          <Button color="primary" onClick={() => router.push("/users/signup")}>
            S&apos;inscrire
          </Button>
        </p>
      </motion.div>
    </motion.div>
  );
}


/* eslint-disable no-console */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Checkbox, avatar } from "@nextui-org/react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import "sweetalert2/dist/sweetalert2.min.css";

import { AutismLogo } from "@/components/icons"; // Vérifie le bon chemin
import Footer from "@/components/footer";
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
      setPasswordStrength("Mot de passe faible (8 caractères minimum et un caractère spécial)");
    } else {
      setPasswordStrength("Mot de passe fort");
    }
  };

  // Fonction de gestion de la connexion
  const handleLogin = async () => {
    if (identifier.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le pseudo ou l'email doit comporter au moins 8 caractères.",
        confirmButtonText: "Ok",
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
      });
      return;
    }

    setLoading(true);

    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    try {
      const loginData = isEmail ? { email: identifier, password } : { pseudo: identifier, password };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        handleLoginError(response.status, data.message);
        return;
      }

      // Stocker les infos utilisateur dans le localStorage
      localStorage.setItem("userToken", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          pseudo: data.user.pseudo,
          email: data.user.email,
          nom: data.user.nom,
          prenom: data.user.prenom,
          phone: data.user.phone,
          avatar: data.user.avatar || "/assets/default-avatar.webp",
          role: data.user.role || "user",
          deliveryAddress: data.user.deliveryAddress || {
            street: "Adresse inconnue",
            city: "Ville inconnue",
            postalCode: "Code postal inconnu",
            country: "France",
          },
        })
      );

      console.log("Données utilisateur stockées :", localStorage.getItem("user"));

      // Déclencher un événement personnalisé pour rafraîchir la navbar
      window.dispatchEvent(new CustomEvent("userUpdate"));

      // Afficher le succès et rediriger
      Swal.fire({
        icon: "success",
        title: "Connexion réussie",
        text: `Bienvenue sur AutiStudy, ${data.user.pseudo || data.user.prenom}!`,
        confirmButtonText: "Ok",
      }).then(() => {
        router.back(); // ✅ Redirection vers la page précédente
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la connexion au serveur.",
        confirmButtonText: "Ok",
      });
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
    } else if (status === 400) {
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
      className="flex flex-col items-center justify-center min-h-screen py-2"
      initial={{ opacity: 0, y: -50 }}
      transition={{ duration: 1 }}
    >
      <motion.div animate={{ opacity: 1, y: 0 }} className="mb-6" initial={{ opacity: 0, y: -50 }} transition={{ duration: 1, delay: 0.2 }}>
        <AutismLogo className="mx-auto mb-2" size={60} />
        <h1 className="text-4xl font-bold text-center text-blue-600">Bienvenue sur AutiStudy</h1>
      </motion.div>

      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-lg text-center text-gray-600"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        Connectez-vous pour accéder à des ressources adaptées et un suivi personnalisé.
      </motion.p>

      <motion.div animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 w-[300px]" initial={{ opacity: 0, y: 50 }} transition={{ duration: 1, delay: 0.6 }}>
        <Input required placeholder="Pseudo ou Email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />

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
        {password && <p className={`text-sm ${passwordStrength.includes("faible") ? "text-red-500" : "text-green-500"}`}>{passwordStrength}</p>}

        <Checkbox isSelected={newsletter} onChange={(e) => setNewsletter(e.target.checked)}>
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
      <Footer />
    </motion.div>
  );
}



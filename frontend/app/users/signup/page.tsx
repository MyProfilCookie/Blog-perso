/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Checkbox } from "@nextui-org/react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import { AutismLogo } from "@/components/icons";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Connexion() {
  const [pseudo, setPseudo] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const router = useRouter();

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

  const handleLogin = async () => {
    // Vérification que tous les champs obligatoires sont bien remplis
    if (!pseudo || !nom || !prenom || !age || !email || !password) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Tous les champs obligatoires doivent être remplis.",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "bg-blue-500 text-white",
        },
      });

      return;
    }

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

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pseudo,
            nom,
            prenom,
            age,
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: data.message || "Erreur lors de la connexion",
          confirmButtonText: "Ok",
          customClass: {
            confirmButton: "bg-blue-500 text-white",
          },
        });

        return;
      }

      // Stocker les informations de l'utilisateur dans le localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ prenom, avatar: data.avatarUrl }),
      );

      // Popup de bienvenue avec le prénom de l'utilisateur
      Swal.fire({
        icon: "success",
        title: `Bienvenue ${prenom} !`,
        text: "Vous êtes maintenant inscrit(e) sur AutiStudy.",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "bg-green-500 text-white",
        },
      }).then(() => {
        router.push("/dashboard");
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
          placeholder="Pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
        <Input
          required
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <Input
          required
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <Input
          required
          placeholder="Âge"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <Input
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          required
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
        />
        {password && (
          <p
            className={`text-sm ${passwordStrength.includes("faible") ? "text-red-500" : "text-green-500"}`}
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
            Connexion...
          </Button>
        ) : (
          <Button className="bg-blue-500" onPress={handleLogin}>
            S'inscrire
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}

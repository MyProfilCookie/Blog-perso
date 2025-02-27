/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function ContactPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("userToken");

      if (!token) {
        router.push("/login");

        return;
      }

      try {
        const response = await fetch("http://localhost:3001/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("userToken");
            MySwal.fire({
              title: "Session expirée",
              text: "Votre session a expiré. Veuillez vous reconnecter.",
              icon: "warning",
              confirmButtonColor: "#F59E0B",
              confirmButtonText: "Se reconnecter",
              showCancelButton: true,
              cancelButtonText: "Annuler",
            }).then((result) => {
              if (result.isConfirmed) {
                router.push("/login");
              }
            });

            return;
          }
          throw new Error("Erreur lors de la récupération des données.");
        }

        const data = await response.json();
        const userData = data.user || data;

        setUser(userData);
        setNom(userData.nom || "");
        setEmail(userData.email || "");
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error,
        );
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const contactData = { nom, email, message };

    try {
      const response = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        MySwal.fire({
          title: "Message envoyé !",
          text: "Nous vous répondrons dès que possible.",
          icon: "success",
          confirmButtonColor: "#8B5CF6",
        });
        setMessage("");
      } else {
        throw new Error("Échec de l'envoi");
      }
    } catch (error) {
      MySwal.fire({
        title: "Erreur",
        text: "Une erreur est survenue. Réessayez plus tard.",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
    }
  };

  return (
    <section className="flex flex-col items-center p-8">
      <motion.h1
        animate={{
          scale: [1, 1.05, 1], // Effet de pulsation léger
          y: [0, -5, 0], // Léger rebond pour donner du mouvement
          backgroundImage: [
            "linear-gradient(90deg, #FFC1CC, #FFD700)",
            "linear-gradient(90deg, #FFD700, #90EE90)",
            "linear-gradient(90deg, #90EE90, #87CEFA)",
            "linear-gradient(90deg, #87CEFA, #FFC1CC)",
          ], // Changement de couleur progressif et apaisant
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        className="text-4xl font-extrabold text-center mb-6"
        transition={{
          duration: 4, // Animation fluide et douce
          ease: "easeInOut",
          repeat: Infinity, // Animation en boucle
          repeatType: "reverse", // Alterne entre les couleurs et les mouvements
        }}
      >
        📩 Contactez-nous
      </motion.h1>

      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="text-lg text-gray-600 text-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Une question ? Un problème ? Une suggestion ? Nous sommes à votre
        disposition ! <br />
        Notre équipe s'engage à vous répondre sous **24 à 48 heures**.
      </motion.p>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.7 }}
      >
        <Card className="py-6 px-8 bg-cream shadow-lg rounded-2xl">
          <CardBody className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              💬 Envoyer un message
            </h3>
            <p className="text-gray-600 text-sm text-center mb-4">
              Nous sommes disponibles pour répondre à toutes vos demandes.
              **N'hésitez pas à nous contacter !**
            </p>
            <form className="w-full space-y-6" onSubmit={handleSubmit}>
              <input
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                id="nom"
                placeholder="Votre nom"
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
              <input
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                id="email"
                placeholder="Votre email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                id="message"
                placeholder="Votre message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition text-lg"
                type="submit"
              >
                🚀 Envoyer
              </button>
            </form>
          </CardBody>
        </Card>
      </motion.div>

      <section className="mt-12 max-w-2xl">
        <h3 className="text-xl font-semibold text-indigo-700">
          📢 Pourquoi nous contacter ?
        </h3>
        <p className="text-gray-600 mt-2">
          💡 Besoin d'informations sur nos services ? Nous répondons à toutes
          vos questions.
        </p>
        <p className="text-gray-600 mt-2">
          🛠️ Un problème technique ? Décrivez-le nous, nous ferons de notre
          mieux pour le résoudre rapidement.
        </p>
        <p className="text-gray-600 mt-2">
          🚀 Une suggestion ? Votre avis est précieux et nous aide à nous
          améliorer !
        </p>
      </section>

      <section className="mt-8 max-w-2xl">
        <h3 className="text-xl font-semibold text-indigo-700">
          📞 Autres moyens de contact
        </h3>
        <p className="text-gray-600 mt-2">
          📆 Nos horaires : **Lundi - Vendredi : 9h - 18h**
        </p>
        <p className="text-gray-600 mt-2">
          📞 Téléphone : **+33 1 23 45 67 89**
        </p>
        <p className="text-gray-600 mt-2">
          📍 Adresse : **123 Rue de Paris, 75001 Paris, France**
        </p>
      </section>
    </section>
  );
}

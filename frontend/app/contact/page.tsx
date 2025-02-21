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
              text: "Veuillez vous reconnecter.",
              icon: "warning",
              confirmButtonColor: "#F59E0B",
              confirmButtonText: "Se reconnecter",
            }).then(() => {
              router.push("/user/login");
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
    <section className="flex flex-col items-center">
      {/* Titre animé */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl font-extrabold text-indigo-700 text-center"
      >
        📩 Contactez-nous
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-3 text-lg text-gray-600 text-center"
      >
        Une question ? Besoin d&apos;aide ? Envoyez-nous un message ! 🚀
      </motion.h2>

      {/* Formulaire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl mt-8"
      >
        <Card className="py-6 bg-white shadow-lg rounded-2xl">
          <CardBody className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              💬 Envoyer un message
            </h3>
            <form className="w-full px-6" onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col mb-4"
              >
                <label htmlFor="nom" className="mb-2 text-gray-700 font-medium">Nom</label>
                <input
                  id="nom"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Votre nom"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col mb-4"
              >
                <label
                  className="mb-2 text-gray-700 font-medium"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Votre email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-col mb-4"
              >
                <label htmlFor="message" className="mb-2 text-gray-700 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Votre message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="w-full px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                🚀 Envoyer
              </motion.button>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </section>
  );
}

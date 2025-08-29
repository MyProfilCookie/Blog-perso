"use client";
import dynamic from 'next/dynamic';

import { useState, useEffect } from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { Avatar } from '@nextui-org/react'
import { Input } from '@nextui-org/react'
import { Textarea } from '@nextui-org/react'
import {  } from '@nextui-org/react';
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Send,
  Mail,
  MessageCircle,
  Phone,
  Clock,
  Heart,
  Users,
  Sparkles,
} from "lucide-react";

import { title, subtitle } from "@/components/primitives";

const MySwal = withReactContent(Swal);

// Type pour les messages
interface ContactMessage {
  nom: string;
  email: string;
  message: string;
  date: string;
}

const colorVariants = [
  "#DBEAFE",
  "#D1FAE5",
  "#E9D5FF",
  "#FEF3C7",
  "#FECACA",
  "#CCFBF1",
];

const darkColorVariants = [
  "#1E3A8A",
  "#065F46",
  "#5B21B6",
  "#92400E",
  "#991B1B",
  "#0F766E",
];

export default function ContactPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messagesHistory, setMessagesHistory] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [cardColor, setCardColor] = useState(
    () => colorVariants[Math.floor(Math.random() * colorVariants.length)],
  );

  // Détecter le mode sombre
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
      setCardColor(
        isDarkMode 
          ? darkColorVariants[Math.floor(Math.random() * darkColorVariants.length)]
          : colorVariants[Math.floor(Math.random() * colorVariants.length)]
      );
    };

    checkDarkMode();
    
    // Observer les changements de classe sur html
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Charger l'historique des messages depuis le localStorage
  useEffect(() => {
    const stored = localStorage.getItem("contactMessages");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        setMessagesHistory(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Erreur lors du parsing de l'historique:", error);
        setMessagesHistory([]);
      }
    }
  }, []);

  // Pré-remplir nom/email si utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("userToken");

      if (!token) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          const userData = data.user || data;

          setNom(userData.nom || "");
          setEmail(userData.email || "");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur:",
          error,
        );
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation des champs
    if (!nom.trim() || !email.trim() || !message.trim()) {
      MySwal.fire({
        title: "Champs manquants",
        text: "Veuillez remplir tous les champs obligatoires.",
        icon: "warning",
        confirmButtonColor: "#F59E0B",
      });

      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      MySwal.fire({
        title: "Email invalide",
        text: "Veuillez saisir une adresse email valide.",
        icon: "warning",
        confirmButtonColor: "#F59E0B",
      });

      return;
    }

    setLoading(true);
    const contactData: ContactMessage = {
      nom: nom.trim(),
      email: email.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
    };

    try {
      // Simuler l'envoi (remplace par ton fetch réel si besoin)
      await new Promise((res) => setTimeout(res, 800));

      // const response = await fetch("/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(contactData)
      // });
      // if (!response.ok) throw new Error("Erreur lors de l'envoi");

      // Ajout à l'historique local
      const newHistory = [contactData, ...messagesHistory].slice(0, 10);

      setMessagesHistory(newHistory);
      localStorage.setItem("contactMessages", JSON.stringify(newHistory));

      MySwal.fire({
        title: "Message envoyé !",
        text: "Nous vous répondrons sous 24 à 48h.",
        icon: "success",
        confirmButtonColor: "#8B5CF6",
      });

      // Réinitialiser le formulaire
      setMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      MySwal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de l'envoi. Réessayez plus tard.",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center min-h-screen py-12 px-4 w-full">
      {/* Header avec titre animé */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
        initial={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
          className={`${title()} text-violet-600 dark:text-violet-300 text-4xl md:text-5xl flex items-center justify-center gap-3`}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-violet-400" />
          Contactez-nous
          <Mail className="w-8 h-8 text-violet-400" />
        </motion.h1>
        <p
          className={`${subtitle({ class: "mt-4 text-lg md:text-xl text-blue-700 dark:text-blue-300 font-medium" })}`}
        >
          Une famille à votre écoute, prête à vous accompagner
        </p>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Une question, une suggestion, un souci ? Nous sommes là pour vous
          aider et vous accompagner dans votre parcours.
        </p>
      </motion.div>

      {/* Informations de contact */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {[
          {
            icon: <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
            title: "Téléphone",
            text: "Disponible sur demande",
            color: isDark ? "#1E3A8A" : "#DBEAFE",
            darkColor: "#1E3A8A",
          },
          {
            icon: <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />,
            title: "Email",
            text: "contact@autistudy.fr",
            color: isDark ? "#065F46" : "#D1FAE5",
            darkColor: "#065F46",
          },
          {
            icon: <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
            title: "Réponse",
            text: "Sous 24-48h",
            color: isDark ? "#5B21B6" : "#E9D5FF",
            darkColor: "#5B21B6",
          },
        ].map((info, idx) => (
          <motion.div
            key={idx}
            transition={{ duration: 0.25 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card
              className="p-6 rounded-lg shadow-lg text-center dark:bg-gray-800/50 dark:border dark:border-gray-700"
              style={{ backgroundColor: info.color }}
            >
              <div className="mb-3 flex justify-center">{info.icon}</div>
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  {info.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{info.text}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Formulaire principal */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <Card
          className="py-8 px-8 shadow-2xl rounded-2xl w-full dark:bg-gray-800/50 dark:border dark:border-gray-700"
          style={{ backgroundColor: cardColor }}
        >
          <CardBody className="flex flex-col items-center">
            <motion.div
              className="mb-6"
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
              Envoyez-nous un message
            </h3>

            <form className="w-full space-y-6" onSubmit={handleSubmit}>
              <Input
                required
                color="primary"
                disabled={loading}
                label="Votre nom"
                placeholder="Entrez votre nom"
                size="lg"
                value={nom}
                variant="bordered"
                classNames={{
                  input: "dark:text-gray-100",
                  label: "dark:text-gray-300",
                  inputWrapper: "dark:bg-gray-700/50 dark:border-gray-600"
                }}
                onChange={(e) => setNom(e.target.value)}
              />
              <Input
                required
                color="primary"
                disabled={loading}
                label="Votre email"
                placeholder="Entrez votre email"
                size="lg"
                type="email"
                value={email}
                variant="bordered"
                classNames={{
                  input: "dark:text-gray-100",
                  label: "dark:text-gray-300",
                  inputWrapper: "dark:bg-gray-700/50 dark:border-gray-600"
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Textarea
                required
                color="primary"
                disabled={loading}
                label="Votre message"
                minRows={5}
                placeholder="Racontez-nous votre histoire, posez vos questions..."
                size="lg"
                value={message}
                variant="bordered"
                classNames={{
                  input: "dark:text-gray-100",
                  label: "dark:text-gray-300",
                  inputWrapper: "dark:bg-gray-700/50 dark:border-gray-600"
                }}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800"
                color="primary"
                isLoading={loading}
                size="lg"
                startContent={<Send className="w-5 h-5" />}
                type="submit"
              >
                {loading ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </motion.div>

      {/* Historique des messages */}
      {messagesHistory.length > 0 && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl mt-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Vos derniers messages
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Historique de vos échanges avec nous
            </p>
          </div>

          <div className="space-y-4">
            {messagesHistory.map((msg, idx) => (
              <motion.div
                key={idx}
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-xl dark:border dark:border-gray-700">
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
                        name={msg.nom}
                        size="sm"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                          {msg.nom}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                          {new Date(msg.date).toLocaleString("fr-FR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      <Heart className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg dark:border dark:border-gray-600">
                      {msg.message}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bouton pour changer la couleur */}
      <motion.div
        animate={{ opacity: 1 }}
        className="mt-8"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
      >
        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 text-white font-semibold"
          onClick={() => {
            const colorArray = isDark ? darkColorVariants : colorVariants;
            setCardColor(
              colorArray[Math.floor(Math.random() * colorArray.length)],
            );
          }}
        >
          Changer la couleur
        </Button>
      </motion.div>
    </section>
  );
}

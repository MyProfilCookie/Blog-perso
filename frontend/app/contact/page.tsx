"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Mail, Phone, MapPin, Clock, Send, MessageCircle, Heart, Users, Sparkles, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useTheme } from "next-themes";

// Import shadcn components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const MySwal = withReactContent(Swal);

// Type pour les messages
interface ContactMessage {
  nom: string;
  email: string;
  message: string;
  date: string;
}

const ContactPage = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messagesHistory, setMessagesHistory] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const isDarkMode = resolvedTheme === "dark";

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
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
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
      // Simuler l'envoi
      await new Promise((res) => setTimeout(res, 800));

      // Ajout à l'historique local
      const newHistory = [contactData, ...messagesHistory].slice(0, 10);
      setMessagesHistory(newHistory);
      localStorage.setItem("contactMessages", JSON.stringify(newHistory));
      console.log("Message envoyé:", contactData);

      MySwal.fire({
        title: "Message envoyé !",
        text: "Nous vous répondrons sous 24 à 48h.",
        icon: "success",
        confirmButtonColor: "#2563eb",
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative w-full px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                disabled={!mounted}
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white dark:bg-gray-900/60 dark:hover:bg-gray-800/70 dark:border-white/20"
              >
                {mounted ? (
                  isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Contactez AutiStudy
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
                Nous sommes là pour vous accompagner ! 💙
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Une question, une suggestion, un souci ? Notre équipe est à votre écoute pour vous aider dans votre parcours d'apprentissage.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Informations de contact */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: <Phone className="w-6 h-6" />,
                title: "Téléphone",
                text: "Disponible sur demande",
                description: "Appelez-nous pour un accompagnement personnalisé",
                color: "bg-blue-100 dark:bg-blue-900/30",
                iconColor: "text-blue-600 dark:text-blue-400"
              },
              {
                icon: <Mail className="w-6 h-6" />,
                title: "Email",
                text: "contact@autistudy.com",
                description: "Réponse garantie sous 24-48h",
                color: "bg-green-100 dark:bg-green-900/30",
                iconColor: "text-green-600 dark:text-green-400"
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Horaires",
                text: "Lun-Ven 9h-18h",
                description: "Disponible pour vous écouter",
                color: "bg-purple-100 dark:bg-purple-900/30",
                iconColor: "text-purple-600 dark:text-purple-400"
              },
            ].map((info, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 ${info.color} rounded-full flex items-center justify-center`}>
                      <div className={info.iconColor}>
                        {info.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {info.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      {info.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Envoyez-nous un message
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Partagez avec nous vos questions, suggestions ou témoignages
                </p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nom" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Votre nom *
                      </Label>
                      <Input
                        id="nom"
                        type="text"
                        placeholder="Entrez votre nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        disabled={loading}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Votre email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Entrez votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Votre message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Racontez-nous votre histoire, posez vos questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={loading}
                      className="min-h-[120px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-3 text-lg font-semibold"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Envoi en cours...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Envoyer le message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Historique des messages */}
      {messagesHistory.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Vos derniers messages
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Historique de vos échanges avec nous
                </p>
              </div>

              <div className="space-y-4">
                {messagesHistory.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {msg.nom.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {msg.nom}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(msg.date).toLocaleString("fr-FR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Envoyé
                          </Badge>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-200">
                            {msg.message}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Section d'encouragement */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Votre réussite est notre priorité
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Chaque message que vous nous envoyez nous aide à améliorer AutiStudy et à mieux vous accompagner dans votre parcours d'apprentissage.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Équipe dédiée
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Réponse rapide
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                Accompagnement personnalisé
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

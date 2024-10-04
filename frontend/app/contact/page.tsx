/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

import { title } from "@/components/primitives";

export default function ContactPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const contactData = {
      nom,
      email,
      message,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        alert("Message envoyé avec succès !");
        setNom("");
        setEmail("");
        setMessage("");
      } else {
        alert("Erreur lors de l'envoi du message.");
      }
    } catch (error) {
      // Log the error to an external service or handle it appropriately
      // logError("Erreur lors de l'envoi du message :", error);
      alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
  };

  return (
    <section className="flex flex-col justify-between w-screen min-h-screen py-8">
      <div className="flex flex-col items-center justify-center flex-grow w-full px-4 text-center">
        <h1 className={title({ color: "violet" })}>Nous contacter</h1>
        <h2 className="mt-4 text-lg text-gray-600">
          Nous sommes là pour répondre à toutes vos questions.
        </h2>

        {/* Card avec les informations de contact */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="py-4 max-w-[1000px] w-full mx-auto mt-8">
            <CardBody className="flex flex-col items-center">
              <h3 className="mb-4 font-bold text-large">Contactez-nous</h3>
              <p style={{ fontSize: "1.2em", lineHeight: "1.8" }}>
                Si vous avez des questions ou des suggestions, n'hésitez pas à nous contacter via l'un des moyens suivants :
              </p>
              <ul className="mt-4 text-left">
                <li>
                  📧 Email : <a className="text-violet-600" href="mailto:contact@autistudy.com">contact@autistudy.com</a>
                </li>
                <li>
                  ☎️ Téléphone : <a className="text-violet-600" href="tel:+33123456789">+33 1 23 45 67 89</a>
                </li>
                <li>
                  🏢 Adresse : 27 Rue Pablo Picasso, 78500 Sartrouville, France
                </li>
              </ul>
            </CardBody>
          </Card>
        </motion.div>

        {/* Formulaire de contact */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="py-4 max-w-[1000px] w-full mx-auto mt-8">
            <CardBody className="flex flex-col items-center">
              <h3 className="mb-4 font-bold text-large">Envoyer un message</h3>
              <form className="w-full max-w-[800px]" onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                  <label className="mb-2 font-medium text-left">Nom</label>
                  <input
                    required
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Votre nom"
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label className="mb-2 font-medium text-left">Email</label>
                  <input
                    required
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Votre adresse email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label className="mb-2 font-medium text-left">Message</label>
                  <textarea
                    required
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Votre message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button className="px-4 py-2 text-white rounded-md bg-violet-600 hover:bg-violet-700">
                  Envoyer
                </button>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center">
        <p style={{ fontSize: "1em", color: "#888" }}>
          © 2024 AutiStudy - Tous droits réservés.
        </p>
      </footer>
    </section>
  );
}


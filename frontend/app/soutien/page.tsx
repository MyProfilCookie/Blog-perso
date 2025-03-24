/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { title, subtitle } from "@/components/primitives";

export default function FAQ() {
  const [faqItems, setFaqItems] = useState([
    {
      question: "Comment puis-je aider mon enfant à rester concentré ?",
      answer:
        "Vous pouvez essayer de créer un environnement calme, établir des routines, et utiliser des supports visuels pour aider votre enfant à rester concentré.",
      isOpen: false,
    },
    {
      question: "Quels types de ressources proposez-vous ?",
      answer:
        "Nous offrons des cours en ligne adaptés, des outils de suivi des progrès, et un soutien communautaire pour les parents et les professionnels.",
      isOpen: false,
    },
    {
      question:
        "Comment puis-je contacter un professionnel pour obtenir de l'aide ?",
      answer:
        "Vous pouvez utiliser le formulaire de contact sur notre site pour nous envoyer un message, et nous vous mettrons en relation avec un professionnel adapté à vos besoins.",
      isOpen: false,
    },
    {
      question: "Est-ce que AutiStudy est adapté à tous les âges ?",
      answer:
        "Oui, nous proposons des ressources adaptées aux enfants autistes de différents âges et niveaux scolaires.",
      isOpen: false,
    },
    {
      question: "Comment puis-je suivre les progrès de mon enfant ?",
      answer:
        "Notre plateforme inclut des outils de suivi qui vous permettent de voir les progrès de votre enfant au fil du temps.",
      isOpen: false,
    },
    {
      question: "Proposez-vous des supports pour les enseignants ?",
      answer:
        "Absolument, nous fournissons des ressources et des outils spécialement conçus pour aider les enseignants à soutenir les élèves autistes.",
      isOpen: false,
    },
  ]);

  // Fonction pour basculer l'affichage des réponses
  const toggleFaqItem = (index: number) => {
    setFaqItems((prevItems) =>
      prevItems.map((item, i) => {
        if (i === index) {
          return { ...item, isOpen: !item.isOpen };
        }

        return item;
      })
    );
  };

  return (
    <section className="flex flex-col items-center w-full py-12 md:py-16">
      {/* En-tête de la page FAQ */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="px-4 text-center"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={`${title()} text-violet-600 dark:text-violet-300`}>Foire aux Questions</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Trouvez des réponses aux questions les plus fréquemment posées.
        </h2>
      </motion.div>

      {/* Section FAQ */}
      <motion.div
        animate={{ opacity: 1 }}
        className="w-full px-4 mt-12"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {faqItems.map((item, index) => (
          <div
            key={index}
            className={`mb-4 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden`}
          >
            <button
              className="flex items-center justify-between w-full px-4 py-3 text-left bg-gray-100 dark:bg-gray-800 focus:outline-none"
              onClick={() => toggleFaqItem(index)}
            >
              <span className="text-lg font-semibold text-black dark:text-white">
                {item.question}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {item.isOpen ? (
                  <svg
                    className="w-5 h-5 transform rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </span>
            </button>
            {item.isOpen && (
              <motion.div
                animate={{ opacity: 1, height: "auto" }}
                className="px-4 py-2 bg-cream dark:bg-gray-700"
                initial={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-800 dark:text-gray-200">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>
    </section>
  );
}






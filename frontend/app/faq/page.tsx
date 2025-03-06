/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { title, subtitle } from "@/components/primitives";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function FAQ() {
  const [faqItems, setFaqItems] = useState([
    {
      question: "Comment puis-je aider mon enfant à rester concentré ? 🧠",
      answer:
        "Vous pouvez essayer de créer un environnement calme, établir des routines, et utiliser des supports visuels pour aider votre enfant à rester concentré. Les activités sensorielles peuvent également être très bénéfiques! ✨",
      isOpen: false,
      emoji: "🎯"
    },
    {
      question: "Quels types de ressources proposez-vous ? 📚",
      answer:
        "Nous offrons des cours en ligne adaptés, des outils de suivi des progrès, et un soutien communautaire pour les parents et les professionnels. Notre bibliothèque de ressources s'enrichit chaque mois! 🌈",
      isOpen: false,
      emoji: "🧩"
    },
    {
      question:
        "Comment puis-je contacter un professionnel pour obtenir de l'aide ? 📞",
      answer:
        "Vous pouvez utiliser le formulaire de contact sur notre site pour nous envoyer un message, et nous vous mettrons en relation avec un professionnel adapté à vos besoins. Notre équipe répond généralement sous 24h! 😊",
      isOpen: false,
      emoji: "👨‍⚕️"
    },
    {
      question: "Est-ce que AutiStudy est adapté à tous les âges ? 👶👧👦👨👩",
      answer:
        "Oui, nous proposons des ressources adaptées aux enfants autistes de différents âges et niveaux scolaires. Nos contenus sont organisés par tranches d'âge pour faciliter votre navigation! 🎈",
      isOpen: false,
      emoji: "⏳"
    },
    {
      question: "Comment puis-je suivre les progrès de mon enfant ? 📈",
      answer:
        "Notre plateforme inclut des outils de suivi qui vous permettent de voir les progrès de votre enfant au fil du temps. Des graphiques colorés et des rapports détaillés sont disponibles dans votre espace personnel! 🌟",
      isOpen: false,
      emoji: "📊"
    },
    {
      question: "Proposez-vous des supports pour les enseignants ? 👩‍🏫",
      answer:
        "Absolument, nous fournissons des ressources et des outils spécialement conçus pour aider les enseignants à soutenir les élèves autistes. Notre section dédiée aux professionnels est très complète! 🍎",
      isOpen: false,
      emoji: "📝"
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
    <section className="flex flex-col items-center justify-center w-full gap-8 py-12 md:py-16 px-4">
      {/* En-tête de la page FAQ */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-4xl mb-4">❓</div>
        <h1 className={title({ color: "violet" })}>Foire aux Questions</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Trouvez des réponses aux questions les plus fréquemment posées ✨
        </h2>
      </motion.div>

      {/* Section FAQ */}
      <motion.div
        animate={{ opacity: 1 }}
        className="w-full max-w-[900px] mt-8"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            className="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 hover:scale-[1.02]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
            whileHover={{
              rotateX: 5,
              rotateY: 5,
            }}
          >
            <button
              className="flex items-center justify-between w-full p-5 text-left focus:outline-none bg-cream dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => toggleFaqItem(index)}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{item.emoji}</span>
                <span className="font-medium text-gray-900 dark:text-cream">{item.question}</span>
              </div>
              <span className="text-violet-600 dark:text-violet-400 bg-purple-100 dark:bg-gray-700 p-2 rounded-full shadow-md">
                <FontAwesomeIcon icon={item.isOpen ? faChevronUp : faChevronDown} />
              </span>
            </button>
            <AnimatePresence>
              {item.isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 bg-cream dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-gray-600 dark:text-gray-400">Vous ne trouvez pas votre réponse? 🤔</p>
        <a href="/contact" className="mt-2 inline-block px-8 py-3 bg-violet-600 text-white rounded-full font-medium hover:bg-violet-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Contactez-nous! 👋
        </a>
      </motion.div>
    </section>
  );
}
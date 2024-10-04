/* eslint-disable react/jsx-no-undef */
"use client";
import React, { useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import Swal from "sweetalert2"; // Pour afficher les alertes
import Image from "next/image"; // Import Image component from next/image

import { title } from "@/components/primitives";

// Liste complète de 50 questions adaptées aux matières spécifiées
const lessons = [
  // Sciences (12 questions)
  {
    subject: "Sciences",
    question: "Quelle planète est la plus proche du Soleil ?",
    options: ["Mars", "Terre", "Vénus", "Mercure"],
    correctAnswer: "Mercure",
    bgColor: "bg-green-300",
  },
  {
    subject: "Sciences",
    question: "Combien de pattes a une araignée ?",
    options: ["6", "8", "10", "12"],
    correctAnswer: "8",
    bgColor: "bg-green-300",
  },
  {
    subject: "Sciences",
    question: "Quel est le plus grand organe du corps humain ?",
    options: ["Cœur", "Peau", "Foie", "Poumons"],
    correctAnswer: "Peau",
    bgColor: "bg-green-300",
  },
  {
    subject: "Sciences",
    question: "Quel gaz est essentiel à la respiration ?",
    options: ["Hydrogène", "Oxygène", "Carbone", "Azote"],
    correctAnswer: "Oxygène",
    bgColor: "bg-green-300",
  },
  {
    subject: "Sciences",
    question: "Quel animal est un mammifère ?",
    options: ["Crocodile", "Tortue", "Dauphin", "Serpent"],
    correctAnswer: "Dauphin",
    bgColor: "bg-green-300",
  },
  {
    subject: "Sciences",
    question: "Quel est l'état de l'eau à 0°C ?",
    options: ["Liquide", "Solide", "Gazeux", "Plasma"],
    correctAnswer: "Solide",
    bgColor: "bg-green-300",
  },
  {
    subject: "Sciences",
    question: "Combien y a-t-il de planètes dans notre système solaire ?",
    options: ["7", "8", "9", "10"],
    correctAnswer: "8",
    bgColor: "bg-green-300",
  },
  {
    subject: "Sciences",
    question: "Qu'est-ce qu'une éclipse solaire ?",
    options: [
      "La Terre passe devant la Lune",
      "La Lune passe devant le Soleil",
      "Le Soleil disparaît",
      "Une tempête solaire",
    ],
    correctAnswer: "La Lune passe devant le Soleil",
    bgColor: "bg-green-300",
  },
  {
    subject: "Sciences",
    question: "Quel est le rôle des racines dans une plante ?",
    options: [
      "Produire des fruits",
      "Absorber l'eau",
      "Fournir de l'oxygène",
      "Attirer les insectes",
    ],
    correctAnswer: "Absorber l'eau",
    bgColor: "bg-green-300",
  },
  {
    subject: "Sciences",
    question: "Quelle est la formule chimique de l'eau ?",
    options: ["H2O", "CO2", "O2", "H2O2"],
    correctAnswer: "H2O",
    bgColor: "bg-green-300",
  },
  {
    subject: "Sciences",
    question: "Quelle est la force qui maintient les objets sur Terre ?",
    options: ["La gravité", "La friction", "La poussée", "La pression"],
    correctAnswer: "La gravité",
    bgColor: "bg-green-300",
  },
  {
    subject: "Sciences",
    question: "Quel gaz les plantes utilisent-elles pour la photosynthèse ?",
    options: ["Oxygène", "Hydrogène", "Carbone", "Dioxyde de carbone"],
    correctAnswer: "Dioxyde de carbone",
    bgColor: "bg-green-300",
  },

  // Mathématiques (12 questions)
  {
    subject: "Mathématiques",
    question: "Combien font 5 + 3 ?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
    bgColor: "bg-yellow-300",
  },
  {
    subject: "Mathématiques",
    question: "Combien font 7 - 4 ?",
    options: ["3", "4", "5", "2"],
    correctAnswer: "3",
    bgColor: "bg-yellow-300",
  },
  {
    subject: "Mathématiques",
    question: "Quel est le double de 6 ?",
    options: ["10", "12", "14", "16"],
    correctAnswer: "12",
    bgColor: "bg-yellow-300",
  },
  {
    subject: "Mathématiques",
    question: "Quelle est la moitié de 10 ?",
    options: ["4", "5", "6", "7"],
    correctAnswer: "5",
    bgColor: "bg-yellow-300",
  },
  {
    subject: "Mathématiques",
    question: "Combien font 9 x 2 ?",
    options: ["16", "18", "20", "22"],
    correctAnswer: "18",
    bgColor: "bg-yellow-300",
  },
  {
    subject: "Mathématiques",
    question: "Combien font 12 ÷ 3 ?",
    options: ["2", "3", "4", "5"],
    correctAnswer: "4",
    bgColor: "bg-yellow-300",
  },
  {
    subject: "Mathématiques",
    question: "Quel est le carré de 4 ?",
    options: ["8", "12", "16", "18"],
    correctAnswer: "16",
    bgColor: "bg-yellow-300",
  },
  {
    subject: "Mathématiques",
    question: "Combien font 15 - 7 ?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
    bgColor: "bg-yellow-300",
  },
  {
    subject: "Mathématiques",
    question: "Quelle est la racine carrée de 64 ?",
    options: ["6", "8", "10", "12"],
    correctAnswer: "8",
    bgColor: "bg-yellow-300",
  },
  {
    subject: "Mathématiques",
    question: "Combien de côtés a un hexagone ?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "6",
    bgColor: "bg-yellow-300",
  },
  {
    subject: "Mathématiques",
    question: "Quel est le résultat de 3 x 3 x 3 ?",
    options: ["27", "18", "9", "81"],
    correctAnswer: "27",
    bgColor: "bg-yellow-300",
  },
  {
    subject: "Mathématiques",
    question: "Quelle unité de mesure utilise-t-on pour mesurer un angle ?",
    options: ["Litres", "Kilomètres", "Grammes", "Degrés"],
    correctAnswer: "Degrés",
    bgColor: "bg-yellow-300",
  },

  // Français (12 questions)
  {
    subject: "Français",
    question: "Quel est le synonyme de 'heureux' ?",
    options: ["Triste", "Joyeux", "Fâché", "Ennuyé"],
    correctAnswer: "Joyeux",
    bgColor: "bg-red-300",
  },
  {
    subject: "Français",
    question:
      "Comment s'appelle le verbe dans cette phrase: 'Elle court vite' ?",
    options: ["Elle", "court", "vite", "phrase"],
    correctAnswer: "court",
    bgColor: "bg-red-300",
  },
  {
    subject: "Français",
    question: "Quel est l'antonyme de 'grand' ?",
    options: ["Petit", "Fort", "Joli", "Léger"],
    correctAnswer: "Petit",
    bgColor: "bg-red-300",
  },
  {
    subject: "Français",
    question:
      "Quel mot complète la phrase: 'Il fait ___ soleil aujourd'hui.' ?",
    options: ["un", "du", "de", "le"],
    correctAnswer: "du",
    bgColor: "bg-red-300",
  },
  {
    subject: "Français",
    question: "Quelle lettre manque dans le mot 'chat__au' ?",
    options: ["t", "o", "s", "e"],
    correctAnswer: "e",
    bgColor: "bg-red-300",
  },
  {
    subject: "Français",
    question: "Quel mot est un nom commun ?",
    options: ["Paris", "École", "Elle", "Courir"],
    correctAnswer: "École",
    bgColor: "bg-red-300",
  },
  {
    subject: "Français",
    question: "Quel est le pluriel de 'cheval' ?",
    options: ["Chevals", "Chevaux", "Chevauxs", "Chevale"],
    correctAnswer: "Chevaux",
    bgColor: "bg-red-300",
  },
  {
    subject: "Français",
    question: "Quel mot est un adjectif ?",
    options: ["Rouge", "Manger", "Vite", "Chien"],
    correctAnswer: "Rouge",
    bgColor: "bg-red-300",
  },
  {
    subject: "Français",
    question: "Quel est le féminin de 'acteur' ?",
    options: ["Acteur", "Actrice", "Acteure", "Actouresse"],
    correctAnswer: "Actrice",
    bgColor: "bg-red-300",
  },
  {
    subject: "Français",
    question: "Quelle phrase est une question ?",
    options: ["Il fait beau.", "Où vas-tu ?", "Elle mange.", "Nous sommes là."],
    correctAnswer: "Où vas-tu ?",
    bgColor: "bg-red-300",
  },
  {
    subject: "Français",
    question:
      "Quel temps de verbe utilise-t-on dans cette phrase: 'Je mangeais' ?",
    options: ["Passé composé", "Imparfait", "Futur simple", "Présent"],
    correctAnswer: "Imparfait",
    bgColor: "bg-red-300",
  },
  {
    subject: "Français",
    question: "Quel mot est un adverbe ?",
    options: ["Rapidement", "Chat", "Grand", "Jouer"],
    correctAnswer: "Rapidement",
    bgColor: "bg-red-300",
  },

  // Ajoutez les 5 autres questions pour les matières restantes ici...
];

const TrimestreControl = () => {
  const [answers, setAnswers] = useState<string[]>(
    Array(lessons.length).fill(""),
  );
  const [submitted, setSubmitted] = useState(false);

  // Gestion de la sélection des réponses
  const handleSelectChange = (index: number, value: string) => {
    const newAnswers = [...answers];

    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Obtenir l'appréciation en fonction du score
  const getFeedback = (score: number) => {
    if (score === lessons.length) {
      return {
        message: "Excellent travail ! 🌟",
        advice: "Continue comme ça, tu es sur la bonne voie !",
      };
    } else if (score >= lessons.length * 0.8) {
      return {
        message: "Très bien ! 😊",
        advice: "Un peu de révision pour perfectionner tes connaissances.",
      };
    } else if (score >= lessons.length * 0.5) {
      return {
        message: "Bon effort ! 👍",
        advice:
          "Tu as fait du bon travail, mais un peu plus de pratique serait utile.",
      };
    } else {
      return {
        message: "Peut mieux faire. 🤔",
        advice: "Ne te décourage pas ! Revois les leçons et réessaye.",
      };
    }
  };

  // Vérifier les réponses
  const handleSubmit = () => {
    if (answers.includes("")) {
      Swal.fire({
        icon: "warning",
        title: "Réponses incomplètes",
        text: "Veuillez répondre à toutes les questions avant de soumettre.",
        confirmButtonText: "OK",
      });

      return;
    }

    let score = 0;

    answers.forEach((answer, index) => {
      if (answer === lessons[index].correctAnswer) {
        score += 1;
      }
    });

    const feedback = getFeedback(score);

    Swal.fire({
      icon: "info",
      title: "Résultat",
      html: `
        <p>Vous avez obtenu ${score} sur ${lessons.length}.</p>
        <p><strong>${feedback.message}</strong></p>
        <p>${feedback.advice}</p>
      `,
      confirmButtonText: "Merci",
    });

    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 py-8 md:py-10">
      <h1 className={title({ color: "violet" })}>Contrôle Trimestriel</h1>
      <p className="mb-8 text-lg text-center text-gray-600">
        Répondez aux questions pour chaque leçon.
      </p>
      <Image
        alt="Header Image"
        className="w-full max-w-[300px] rounded-lg shadow-md"
        height={300}
        src="/assets/trimestre.webp"
        width={300}
      />

      {submitted && (
        <div className="mb-8 text-lg text-center text-gray-600">
          Merci de votre participation !
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson, index) => (
          <Card
            key={index}
            className={`p-6 w-full max-w-[400px] ${lesson.bgColor} rounded-lg shadow-md`}
          >
            <CardBody>
              <h4 className="mb-4 text-xl font-bold text-center text-gray-800">
                {lesson.subject}
              </h4>
              <p className="mb-4 text-center text-gray-700">
                {lesson.question}
              </p>
              <select
                className="w-full p-2 border rounded-md"
                disabled={submitted}
                value={answers[index]}
                onChange={(e) => handleSelectChange(index, e.target.value)}
              >
                <option value="">Sélectionnez une réponse</option>
                {lesson.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </CardBody>
          </Card>
        ))}
      </div>

      <Button
        className="px-6 py-2 mt-8 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        disabled={submitted}
        onClick={handleSubmit}
      >
        Soumettre
      </Button>
    </div>
  );
};

export default TrimestreControl;

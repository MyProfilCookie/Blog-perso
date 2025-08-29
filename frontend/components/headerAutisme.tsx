import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { title, subtitle } from "@/components/primitives"; // Assurez-vous que ces utilitaires existent ou modifiez-les selon vos besoins.

interface HeaderAutismeProps {
  heading?: string;
  subheading?: string;
  description?: string;
}

const HeaderAutisme: React.FC<HeaderAutismeProps> = ({
  heading,
  subheading,
  description,
}) => {
  // State pour le carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Liste d'emojis pour le carousel
  const images = [
    "🦁🐾", // Lionceau
    "🐻", // Ours
    "🐶", // Chiot
    "🐱", // Chaton
  ];

  // Utilisation de useEffect pour changer d'emoji toutes les 8 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, 8000); // 8 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle à la fin
  }, [images.length]);

  return (
    <OptimizedMotion
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center max-w-[1200px] w-full mx-auto performance-optimized" // Fond plus doux pour la page entière
      initial={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-lg p-10 space-y-6 text-center shadow-2xl rounded-xl dark:bg-gray-800 performance-optimized">
        {/* Ajout d'espace entre les éléments */}

        {/* Carousel d'emojis avec effet 3D */}
        <OptimizedMotion
          className="inline-block performance-optimized"
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          whileHover={{
            scale: 1.1, // Zoom léger sur l'emoji
            rotateX: 10, // Rotation plus discrète pour un effet 3D subtil
            rotateY: 10,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)", // Ombre légère pour un effet plus propre
          }}
        >
          <span className="text-6xl performance-optimized">{images[currentImageIndex]}</span>
        </OptimizedMotion>

        <h1
          className={`${title()} text-violet-600 dark:text-violet-300 text-4xl font-bold leading-tight`}
        >
          {/* Ajout d'espace entre les éléments */}
          {heading || ""}
        </h1>

        {subheading && (
          <h2
            className={subtitle({
              class: "mt-4 text-xl text-gray-700 dark:text-gray-300",
            })}
          >
            {subheading}
          </h2>
        )}

        {description && (
          <p className="text-lg text-gray-500 dark:text-gray-300 performance-optimized">
            {description}
          </p>
        )}
      </div>
    </OptimizedMotion>
  );
};

export default HeaderAutisme;

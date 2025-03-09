"use client";
// Ajoutez cette directive au début du fichier pour indiquer que c'est un composant client

import React from "react";
// Importez vos dépendances de framer-motion ici
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cream dark:bg-gray-900">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        className="w-16 h-16 rounded-full border-4 border-violet-600 border-t-transparent"
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
      <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import { ProgressTracker } from "@/components/progress/ProgressTracker";

export default function MusicPage() {
  const handleRating = (rating: "Facile" | "Moyen" | "Difficile") => {
    // Ici, vous pouvez ajouter la logique pour sauvegarder la progression
    console.log(`Progression en musique : ${rating}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-center">Musique</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contenu existant */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardBody>
            {/* Votre contenu existant */}
          </CardBody>
        </Card>

        {/* Composant de progression */}
        <ProgressTracker subject="Musique" onRating={handleRating} />
      </div>
    </motion.div>
  );
} 
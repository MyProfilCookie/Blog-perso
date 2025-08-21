"use client";
// Ajoutez cette directive au début du fichier pour indiquer que c'est un composant client

import React from "react";
// Importez vos dépendances de framer-motion ici
// TODO: Optimiser avec dynamic import pour réduire le bundle
import { LightAnimation } from "@/components/DynamicMotion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cream dark:bg-gray-900">
      <LightAnimation
        animation="slideUp"
        className="w-16 h-16 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"
      >
        <div />
      </LightAnimation>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
    </div>
  );
}

"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
// Supprimer l'import problématique et utiliser une solution alternative

const BackButton = ({
  label = "Retour",
  className = "",
}: {
  label?: string;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <Button
      className={`flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md ${className}`}
      onClick={() => router.back()}
    >
      {/* Utiliser un élément HTML standard pour la flèche */}
      <span className="text-sm font-bold">&larr;</span>
      <span>{label}</span>
    </Button>
  );
};

export default BackButton;

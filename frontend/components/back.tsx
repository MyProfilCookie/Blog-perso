"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa"; // Utilise l'icône de flèche gauche

const BackButton = ({ label = "Retour", className = "" }) => {
  const router = useRouter();

  return (
    <Button
      className={`flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md ${className}`}
      onClick={() => router.back()}
    >
      <FaArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  );
};

export default BackButton;

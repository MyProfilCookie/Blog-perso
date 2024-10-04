/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Image } from "@nextui-org/react";

const ErrorPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirige automatiquement vers la page d'accueil après 5 secondes
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer); // Nettoyage si le composant est démonté
  }, [router]);

  return (
    <motion.section
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <Image
          alt="Page d'erreur"
          className="object-contain mx-auto"
          height={300}
          src="/assets/error_image.webp"
          width={300}
        />
        <h1 className="text-4xl font-bold text-red-500">Oups !</h1>
        <p className="mt-4 text-lg text-gray-700">
          Il semble que la page que vous recherchez n'existe pas ou a été
          déplacée.
        </p>
        <p className="mt-2 text-gray-500 text-md">
          Vous serez redirigé vers l'accueil dans quelques secondes...
        </p>

        <button
          className="px-4 py-2 mt-6 text-white bg-blue-500 rounded-full hover:bg-blue-700"
          onClick={() => router.push("/")}
        >
          Retour à l'accueil
        </button>
      </div>
    </motion.section>
  );
};

export default ErrorPage;

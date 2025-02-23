/* eslint-disable no-console */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import { ShoppingCart } from "lucide-react";

import LoadingAnimation from "@/components/loading";

export default function ProductPage() {
  const params = useParams();
  const _id = params?.id; // Vérifie que l'ID est bien passé

  interface Product {
    _id: string;
    imageUrl: string;
    title: string;
    description: string;
    price: number;
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!_id) {
      console.error("🚨 Aucun ID détecté !");
      setLoading(false);

      return;
    }

    const fetchProduct = async () => {
      try {
        console.log("🔍 Recherche du produit avec ID:", _id);

        const response = await fetch(`http://localhost:3001/products/${_id}`, {
          headers: { Accept: "application/json" }, // 🔹 Important !
        });

        if (!response.ok) throw new Error("Produit non trouvé");

        const data = await response.json();

        console.log("📦 Produit récupéré :", data);
        setProduct(data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération du produit :", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [_id]);

  if (loading) return <LoadingAnimation />;

  if (!product)
    return (
      <p className="text-center text-red-600 font-semibold">
        ❌ Produit introuvable...
      </p>
    );

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        style={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
        transition={{ duration: 0.5 }}
      >
        🛍️ Découvrez plus de détail sur le produit sélectionné :
      </motion.h1>
      <Card className="shadow-xl p-6 rounded-lg">
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4 text-violet-700 text-center "
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {product.title}
        </motion.h2>
        <CardBody className="flex flex-col items-center text-center">
          <motion.img
            alt={product.title}
            animate={{ scale: 1 }}
            className="w-64 h-64 object-cover rounded-lg mb-6"
            initial={{ scale: 0.9 }}
            src={`${product.imageUrl}`} // 🔹 Vérifie que l'image s'affiche bien
            transition={{ duration: 0.4 }}
          />
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-violet-700"
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {/* notation avec des étoiles alignées à droite */}
            <span className="flex items-center">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className="text-yellow-500">
                  ★
                </span>
              ))}
              {/* Ajout de l'étoile vide */}
              <span className="text-gray-300">☆</span>
            </span>
          </motion.p>
          <p className="text-gray-600 mt-4">{product.description}</p>
          <p className="text-2xl font-semibold text-violet-600 mt-4">
            {product.price.toFixed(2)}€
          </p>
          <motion.button
            className="mt-6 flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg shadow-md hover:bg-violet-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingCart className="mr-2" size={20} /> Ajouter au panier
          </motion.button>
        </CardBody>
      </Card>
    </section>
  );
}

/* eslint-disable no-console */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import { ShoppingCart } from "lucide-react";

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

  if (loading)
    return (
      <p className="text-center text-gray-600">Chargement du produit...</p>
    );

  if (!product)
    return (
      <p className="text-center text-red-600 font-semibold">
        ❌ Produit introuvable...
      </p>
    );

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="shadow-xl p-6 bg-white rounded-lg">
          <CardBody className="flex flex-col items-center text-center">
            <motion.img
              src={`${product.imageUrl}`} // 🔹 Vérifie que l'image s'affiche bien
              alt={product.title}
              className="w-64 h-64 object-cover rounded-lg mb-6"
              animate={{ scale: 1 }}
              initial={{ scale: 0.9 }}
              transition={{ duration: 0.4 }}
            />
            <motion.h1
              className="text-3xl font-bold text-violet-700"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {product.title}
            </motion.h1>
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
      </motion.div>
    </section>
  );
}

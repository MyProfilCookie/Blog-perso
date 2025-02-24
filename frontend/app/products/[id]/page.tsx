/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Info, Ruler, CheckCircle } from "lucide-react";

import LoadingAnimation from "@/components/loading";

export default function ProductPage() {
  const params = useParams();
  const _id = params?.id;

  interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    link: string;
    imageUrl: string;
    weight: number;
    category?: string;
    dimensions?: string;
    features?: string[];
    sizes?: string[];
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

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
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error("Produit non trouvé");

        const data = await response.json();

        console.log("📦 Produit récupéré :", data);
        setProduct(data);

        // Si l'article a des tailles disponibles, on sélectionne la première par défaut
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
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
        transition={{ duration: 0.5 }}
      >
        🛍️ Découvrez plus de détails sur le produit sélectionné :
      </motion.h1>

      {/* Conteneur principal */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full bg-transparent flex flex-col items-center text-center"
      >
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4 text-violet-700 text-center"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {product.title}
        </motion.h2>

        <motion.img
          alt={product.title}
          animate={{ scale: 1 }}
          className="w-64 h-64 object-cover rounded-lg mb-6"
          initial={{ scale: 0.9 }}
          src={`${product.imageUrl}`}
          transition={{ duration: 0.4 }}
        />

        {/* Notation étoiles */}
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-violet-700"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <span className="flex justify-center">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className="text-yellow-500">
                ★
              </span>
            ))}
            <span className="text-gray-300">☆</span>
          </span>
        </motion.p>

        <p className="text-gray-600 mt-4">{product.description}</p>
        <p className="text-2xl font-semibold text-violet-600 mt-4">
          {product.price.toFixed(2)}€
        </p>

        {/* Sélecteur de taille si applicable */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-6">
            <label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center mb-2">
              <Ruler className="mr-2 text-blue-500" /> Choisissez une taille :
            </label>
            <select
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 cursor-pointer"
              value={selectedSize ?? ""}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {product.sizes.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Bouton Ajouter au panier */}
        <motion.button
          className="mt-6 flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg shadow-md hover:bg-violet-700 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ShoppingCart className="mr-2" size={20} /> Ajouter au panier
        </motion.button>

        {/* Section Détails supplémentaires */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="w-full mt-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <h3 className="text-2xl font-bold text-gray-700 dark:text-white flex items-center mb-4">
            <Info className="mr-2 text-blue-500" /> Détails du produit
          </h3>

          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <td className="p-2 font-semibold text-gray-600 dark:text-gray-300">
                  Poids :
                </td>
                <td className="p-2 text-gray-800 dark:text-gray-100">
                  {product.weight} kg
                </td>
              </tr>
              {product.category && (
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <td className="p-2 font-semibold text-gray-600 dark:text-gray-300">
                    Catégorie :
                  </td>
                  <td className="p-2 text-gray-800 dark:text-gray-100">
                    {product.category}
                  </td>
                </tr>
              )}
              {product.dimensions && (
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <td className="p-2 font-semibold text-gray-600 dark:text-gray-300">
                    Dimensions :
                  </td>
                  <td className="p-2 text-gray-800 dark:text-gray-100">
                    {product.dimensions}
                  </td>
                </tr>
              )}
              {product.features && product.features.length > 0 && (
                <tr>
                  <td className="p-2 font-semibold text-gray-600 dark:text-gray-300 align-top">
                    Caractéristiques :
                  </td>
                  <td className="p-2 text-gray-800 dark:text-gray-100">
                    <ul className="list-none space-y-4">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </section>
  );
}

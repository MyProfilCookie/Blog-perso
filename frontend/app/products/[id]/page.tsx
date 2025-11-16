"use client";
export const dynamic = "force-dynamic";
import nextDynamic from 'next/dynamic';
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Info, Ruler, CheckCircle, ArrowLeft } from "lucide-react";

import LoadingAnimation from "@/components/loading";
import Footer from "@/components/footer";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${_id}`, {
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
    <section className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Flèche de retour */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <motion.button
          onClick={() => router.push('/shop')}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Retour à la boutique</span>
        </motion.button>
      </motion.div>

      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        🛍️ Découvrez plus de détails sur le produit sélectionné :
      </motion.h1>

      {/* Conteneur principal */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Colonne gauche - Image et informations principales */}
        <div className="flex-1 flex flex-col items-center lg:items-start">
          <motion.h2
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-violet-700 text-center lg:text-left"
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {product.title}
          </motion.h2>

          <motion.img
            alt={product.title}
            animate={{ scale: 1 }}
            className="w-full max-w-md h-auto object-cover rounded-lg mb-6 shadow-lg"
            initial={{ scale: 0.9 }}
            src={`${product.imageUrl}`}
            transition={{ duration: 0.4 }}
          />

          {/* Notation étoiles */}
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-violet-700 mb-4"
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <span className="flex justify-center lg:justify-start">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className="text-yellow-500">
                  ★
                </span>
              ))}
              <span className="text-gray-300">☆</span>
            </span>
          </motion.p>

          <p className="text-gray-600 dark:text-gray-300 text-center lg:text-left mb-4 text-base md:text-lg">
            {product.description}
          </p>
          
          <p className="text-2xl md:text-3xl font-semibold text-violet-600 mb-6">
            {product.price.toFixed(2)}€
          </p>

          {/* Sélecteur de taille si applicable */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6 w-full max-w-xs">
              <label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center mb-2">
                <Ruler className="mr-2 text-blue-500" /> Choisissez une taille :
              </label>
              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-cream dark:bg-gray-900 text-gray-700 dark:text-gray-200 cursor-pointer"
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
            className="w-full max-w-xs flex items-center justify-center px-6 py-3 bg-violet-600 text-white rounded-lg shadow-md hover:bg-violet-700 transition-all text-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="mr-2" size={20} /> Ajouter au panier
          </motion.button>
        </div>

        {/* Colonne droite - Détails du produit */}
        <div className="flex-1">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md h-fit"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-white flex items-center mb-6">
              <Info className="mr-2 text-blue-500" /> Détails du produit
            </h3>

            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <td className="p-3 font-semibold text-gray-600 dark:text-gray-300">
                    Poids :
                  </td>
                  <td className="p-3 text-gray-800 dark:text-gray-100">
                    {product.weight} kg
                  </td>
                </tr>
                {product.category && (
                  <tr className="border-b border-gray-300 dark:border-gray-700">
                    <td className="p-3 font-semibold text-gray-600 dark:text-gray-300">
                      Catégorie :
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-100">
                      {product.category}
                    </td>
                  </tr>
                )}
                {product.dimensions && (
                  <tr className="border-b border-gray-300 dark:border-gray-700">
                    <td className="p-3 font-semibold text-gray-600 dark:text-gray-300">
                      Dimensions :
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-100">
                      {product.dimensions}
                    </td>
                  </tr>
                )}
                {product.features && product.features.length > 0 && (
                  <tr>
                    <td className="p-3 font-semibold text-gray-600 dark:text-gray-300 align-top">
                      Caractéristiques :
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-100">
                      <ul className="list-none space-y-3">
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
        </div>
      </motion.div>
    </section>
  );
}

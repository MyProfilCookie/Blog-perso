"use client";

/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */

// 📌 1. Imports de bibliothèques tierces
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// 📌 2. Imports absolus (depuis "@/components/")
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/SkeletonLoaders";
import OptimizedImage from "@/components/OptimizedImage";

// 📌 3. Imports relatifs (fichiers du projet)
import { useCart } from "../contexts/cart-context";
// Import du contexte du panier

type Article = {
  [x: string]: any;
  title: string;
  description: string;
  price: number;
  link: string;
  imageUrl: string;
  productId: string;
  _id: string;
  quantity?: number;
};

export default function ArticlesClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utiliser le contexte du panier au lieu de props
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Vérifier le cache local d'abord
        const cachedData = localStorage.getItem('shop-products');
        const cacheTimestamp = localStorage.getItem('shop-products-timestamp');
        const now = Date.now();
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes

        if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < cacheExpiry) {
          setArticles(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }

        const data = await response.json();

        // Mettre en cache les données
        localStorage.setItem('shop-products', JSON.stringify(data));
        localStorage.setItem('shop-products-timestamp', now.toString());

        setArticles(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
          <div className="relative w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto text-center">
              <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Boutique{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    AutiStudy
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Chargement des produits...
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="px-2 py-6 md:px-4 lg:px-6 bg-white dark:bg-gray-900">
          <div className="w-full">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 max-w-7xl mx-auto">
              {[...Array(6)].map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
          {error}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p className="text-xl font-semibold">
          Aucun article disponible pour le moment.
        </p>
        <Button
          asChild
          className="mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
        >
          <NextLink href="/">Retour à l'accueil</NextLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative w-full px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Boutique{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  AutiStudy
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Outils et ressources spécialisés pour l'apprentissage adapté des enfants autistes. 
                Découvrez notre sélection d'équipements sensoriels et éducatifs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-2 py-6 md:px-4 lg:px-6 bg-white dark:bg-gray-900 transition-colors">

      <div className="w-full">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 max-w-7xl mx-auto">
          {articles.map((article, index) => (
            <motion.div
              key={article.productId || index}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.4,
                delay: Math.min(index * 0.05, 0.3), // Délai réduit et limité
                ease: "easeOut"
              }}
              whileHover={{
                y: -4,
                transition: {
                  duration: 0.2,
                  ease: "easeOut"
                }
              }}
            >
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <OptimizedImage
                    src={article.imageUrl}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="w-full h-48 md:h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index < 3} // Priorité pour les 3 premières images
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                      {article.price} €
                    </span>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-4 line-clamp-3">
                    {article.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3">
                    <Button
                      asChild
                      className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white border-0 py-2.5 transition-all duration-300"
                      variant="outline"
                    >
                      <NextLink href={`/products/${article._id}`}>
                        Voir les détails
                      </NextLink>
                    </Button>
                    
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2.5 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => addToCart(article)}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
                      Ajouter au panier
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </section>
    </div>
  );
}

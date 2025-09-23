"use client";

/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
// 🔧 Fix iPhone client-side errors - v2.0 + Performance optimizations

// 📌 1. Imports de bibliothèques tierces
import NextLink from "next/link";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// 📌 2. Imports absolus (depuis "@/components/")
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/SkeletonLoaders";
import OptimizedImage from "@/components/OptimizedImage";
import { useIsClient } from "@/hooks/useIsClient";

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

// Cache global pour éviter les rechargements inutiles
let globalProductsCache: Article[] | null = null;
let globalCacheTimestamp: number = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes au lieu de 5

export default function ArticlesClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isClient = useIsClient();

  // Utiliser le contexte du panier au lieu de props
  const { addToCart } = useCart();

  // Mémoriser les articles pour éviter les re-renders inutiles
  const memoizedArticles = useMemo(() => articles, [articles]);

  useEffect(() => {
    // Démarrer le chargement immédiatement, même sans isClient
    const fetchArticles = async () => {
      try {
        const now = Date.now();
        
        // Vérifier le cache global d'abord
        if (globalProductsCache && (now - globalCacheTimestamp) < CACHE_DURATION) {
          setArticles(globalProductsCache);
          setLoading(false);
          return;
        }

        // Vérifier le cache localStorage seulement côté client
        if (typeof window !== 'undefined') {
          const cachedData = localStorage.getItem('shop-products');
          const cacheTimestamp = localStorage.getItem('shop-products-timestamp');

          if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
            const parsedData = JSON.parse(cachedData);
            globalProductsCache = parsedData;
            globalCacheTimestamp = parseInt(cacheTimestamp);
            setArticles(parsedData);
            setLoading(false);
            return;
          }
        }

        // Fetch avec optimisations
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10s

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            headers: {
              'Cache-Control': 'max-age=900', // 15 minutes
              'Accept': 'application/json',
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Mettre à jour les caches
        globalProductsCache = data;
        globalCacheTimestamp = now;

        if (typeof window !== 'undefined') {
          localStorage.setItem('shop-products', JSON.stringify(data));
          localStorage.setItem('shop-products-timestamp', now.toString());
        }

        setArticles(data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.error("Timeout lors du chargement des produits");
          setError("Le chargement prend trop de temps. Veuillez réessayer.");
        } else {
          console.error("Erreur lors de la récupération des articles :", error);
          setError("Impossible de charger les produits. Vérifiez votre connexion.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []); // Supprimer la dépendance isClient pour un chargement plus rapide

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
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                    Chargement des produits...
                  </p>
                </div>
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
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            {error}
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => {
                setError(null);
                setLoading(true);
                // Forcer un nouveau chargement en vidant le cache
                globalProductsCache = null;
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('shop-products');
                  localStorage.removeItem('shop-products-timestamp');
                }
                window.location.reload();
              }}
              className="mr-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
            >
              Réessayer
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-300 dark:border-gray-600"
            >
              <NextLink href="/">Retour à l'accueil</NextLink>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (memoizedArticles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
            </svg>
          </div>
          <p className="text-xl font-semibold mb-4">
            Aucun produit disponible pour le moment.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Nos produits seront bientôt disponibles. Revenez plus tard !
          </p>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
          >
            <NextLink href="/">Retour à l'accueil</NextLink>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section - Optimisé */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative w-full px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
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

      {/* Products Section - Optimisé */}
      <section className="px-2 py-6 md:px-4 lg:px-6 bg-white dark:bg-gray-900 transition-colors">
        <div className="w-full">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 max-w-7xl mx-auto">
            {memoizedArticles.map((article, index) => (
              <motion.div
                key={article.productId || article._id || index}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.3), // Limite le délai pour éviter les animations trop longues
                  ease: "easeOut"
                }}
              >
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 h-full flex flex-col overflow-hidden">
                  {/* Image Container - Optimisé */}
                  <div className="relative h-64 md:h-72 overflow-hidden rounded-t-2xl">
                    <OptimizedImage
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={index < 3} // Chargement prioritaire pour les 3 premiers
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>

                  {/* Content - Optimisé */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-4 line-clamp-3 flex-1">
                      {article.description}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {typeof article.price === 'number' ? article.price.toFixed(2) : article.price}€
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 mt-auto">
                      <Button
                        onClick={() => addToCart(article)}
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                        Ajouter au panier
                      </Button>
                      
                      {article.link && (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                        >
                          <NextLink href={article.link} target="_blank" rel="noopener noreferrer">
                            Voir les détails
                          </NextLink>
                        </Button>
                      )}
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

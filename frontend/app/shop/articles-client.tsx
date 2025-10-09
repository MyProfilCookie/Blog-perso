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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { ShoppingBag, Star, TrendingUp, Package, Sparkles } from "lucide-react";

// 📌 2. Imports absolus (depuis "@/components/")
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/SkeletonLoader";
import Image from "next/image";
import { useIsClient } from "@/hooks/useIsClient";

// 📌 3. Imports relatifs (fichiers du projet)
import { useCart } from "../contexts/cart-context";
import { fallbackProducts } from "./fallback-products";
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

type ArticlesClientProps = {
  initialProducts?: Article[];
};

export default function ArticlesClient({ initialProducts }: ArticlesClientProps = {}) {
  const [articles, setArticles] = useState<Article[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState<string | null>(null);
  const isClient = useIsClient();

  // Utiliser le contexte du panier au lieu de props
  const { addToCart } = useCart();

  // Mémoriser les articles pour éviter les re-renders inutiles
  const memoizedArticles = useMemo(() => articles, [articles]);

  useEffect(() => {
    // Si on a déjà des produits initiaux, pas besoin de fetcher
    if (initialProducts && initialProducts.length > 0) {
      globalProductsCache = initialProducts;
      globalCacheTimestamp = Date.now();
      return;
    }

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

        // Fetch avec optimisations - Timeout réduit à 5s
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5s au lieu de 10s

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            headers: {
              'Cache-Control': 'max-age=900', // 15 minutes
              'Accept': 'application/json',
            },
            signal: controller.signal,
            next: { revalidate: 300 }, // ISR: Revalider toutes les 5 minutes
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
          console.error("Timeout lors du chargement des produits - Utilisation du fallback");
          // Utiliser les produits de fallback au lieu d'une erreur
          setArticles(fallbackProducts);
          console.info("📦 Produits de fallback chargés");
        } else {
          console.error("Erreur lors de la récupération des articles :", error);
          // Utiliser les produits de fallback au lieu d'une erreur
          setArticles(fallbackProducts);
          console.info("📦 Produits de fallback chargés suite à une erreur");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [initialProducts]); // Dépendance sur initialProducts

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Header de la boutique */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-white" />
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                  Boutique AutiStudy
                </h1>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <p className="text-blue-100 dark:text-blue-200 text-sm md:text-base">
                  Chargement des produits...
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <section className="px-2 py-8 md:px-4 lg:px-6">
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </div>
          <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            {error}
          </p>
          <div className="space-y-2">
            <Button
              className="mr-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
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
            >
              Réessayer
            </Button>
            <Button
              asChild
              className="border-gray-300 dark:border-gray-600"
              variant="outline"
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header de la boutique */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-white" />
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Boutique AutiStudy
              </h1>
            </div>
            <p className="text-blue-100 dark:text-blue-200 text-sm md:text-base max-w-2xl mx-auto">
              Des outils pédagogiques et sensoriels soigneusement sélectionnés pour accompagner l'apprentissage de votre enfant
            </p>
          </motion.div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Livraison rapide</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sous 48-72h</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Qualité garantie</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Produits testés</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Sélection experte</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Par des professionnels</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Nos Produits
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {memoizedArticles.length} produit{memoizedArticles.length > 1 ? 's' : ''} disponible{memoizedArticles.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {memoizedArticles.map((article, index) => (
            <motion.div
              key={article.productId || article._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group h-full"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Badge Nouveau si index < 2 */}
                {index < 2 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      Nouveau
                    </span>
                  </div>
                )}

                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    alt={article.title}
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    fill
                    priority={index < 3}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    src={article.imageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-1">
                    {article.description}
                  </p>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        {typeof article.price === 'number' ? article.price.toFixed(2) : article.price}
                      </span>
                      <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">€</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-2 mt-auto">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95"
                      onClick={() => addToCart(article)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Ajouter au panier
                    </Button>
                    
                    {article.link && (
                      <Button
                        asChild
                        className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 font-medium py-3 rounded-xl transition-all duration-300"
                        variant="outline"
                      >
                        <NextLink href={article.link} rel="noopener noreferrer" target="_blank">
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
      </section>
    </div>
  );
}

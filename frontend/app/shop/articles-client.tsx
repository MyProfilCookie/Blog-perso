import dynamic from 'next/dynamic';
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
"use client";

// 📌 1. Imports de bibliothèques tierces
const motion = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion })), { ssr: false });
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// 📌 2. Imports absolus (depuis "@/components/")
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/loading";

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

  // Utiliser le contexte du panier au lieu de props
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }

        const data = await response.json();

        setArticles(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p className="text-xl font-semibold">
          Aucun article disponible pour le moment.
        </p>
        <Button
          asChild
          className="mt-6 bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white"
        >
          <NextLink href="/">Retour à l'accueil</NextLink>
        </Button>
      </div>
    );
  }

  return (
    <section className="min-h-screen px-2 py-6 md:px-4 lg:px-6 bg-cream dark:bg-gray-900 transition-colors">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Nos articles
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Découvrez nos articles de qualité supérieure.
        </p>
      </motion.div>

      <div className="w-full">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
          {articles.map((article, index) => (
            <motion.div
              key={article.productId || index}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="h-full"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300
                } 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden bg-cream dark:bg-gray-800 border-transparent dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col group">
                <motion.div 
                  className="relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    alt={article.title}
                    className="object-cover object-center w-full h-64 md:h-72 lg:h-80 transition-transform duration-700 group-hover:scale-110"
                    src={article.imageUrl}
                  />
                  <motion.div 
                    className="absolute top-3 right-3"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  >
                    <Badge className="bg-amber-500 hover:bg-amber-600 px-4 py-2 text-lg font-bold text-white shadow-lg">
                      {article.price} €
                    </Badge>
                  </motion.div>
                </motion.div>

                <CardHeader className="p-6 pb-0">
                  <motion.h3 
                    className="mb-3 text-xl md:text-2xl font-bold text-center text-gray-800 dark:text-white"
                    whileHover={{ color: "#7c3aed" }}
                    transition={{ duration: 0.3 }}
                  >
                    {article.title}
                  </motion.h3>
                </CardHeader>

                <CardContent className="p-6 pt-2 flex-grow">
                  <motion.p 
                    className="text-base md:text-lg text-center text-gray-600 dark:text-gray-300 line-clamp-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  >
                    {article.description}
                  </motion.p>
                </CardContent>

                <CardFooter className="p-6 pt-0 flex flex-col space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Button
                      asChild
                      className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white text-base md:text-lg py-3 transition-all duration-300 hover:shadow-lg"
                      variant="default"
                    >
                      <NextLink href={`/products/${article._id}`}>
                        Voir cet article
                      </NextLink>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white text-base md:text-lg py-3 transition-all duration-300 hover:shadow-lg"
                      variant="default"
                      onClick={() => addToCart(article)}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <FontAwesomeIcon className="mr-2" icon={faShoppingCart} />
                      </motion.div>
                      Ajouter au panier
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

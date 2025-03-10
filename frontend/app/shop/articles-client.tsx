/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
"use client";

// 📌 1. Imports de bibliothèques tierces
import { motion } from "framer-motion";
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
    <section className="min-h-screen px-6 py-12 lg:px-12 xl:px-20 bg-cream dark:bg-gray-900 transition-colors">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Nos articles
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Découvrez nos articles de qualité supérieure.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.div
              key={article.productId || index}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-hidden bg-cream dark:bg-gray-800 border-transparent dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="relative">
                  <img
                    alt={article.title}
                    className="object-cover object-center w-full h-52"
                    src={article.imageUrl}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-amber-500 hover:bg-amber-600 px-3 py-1 text-base font-bold text-white">
                      {article.price} €
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-5 pb-0">
                  <h3 className="mb-2 text-lg font-bold text-center text-gray-800 dark:text-white">
                    {article.title}
                  </h3>
                </CardHeader>

                <CardContent className="p-5 pt-2 flex-grow">
                  <p className="text-sm text-center text-gray-600 dark:text-gray-300 line-clamp-3">
                    {article.description}
                  </p>
                </CardContent>

                <CardFooter className="p-5 pt-0 flex flex-col space-y-3">
                  <Button
                    asChild
                    className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white"
                    variant="default"
                  >
                    <NextLink href={`/products/${article._id}`}>
                      Voir cet article
                    </NextLink>
                  </Button>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                    variant="default"
                    onClick={() => addToCart(article)}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faShoppingCart} />
                    Ajouter au panier
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

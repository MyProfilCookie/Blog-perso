/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
"use client";

import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import Loading from "@/components/loading";
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

interface ArticlesPageProps {
    onAddToCart: (article: Article) => void;
    cart: Article[];
}

export default function ArticlesPage({ onAddToCart, cart }: ArticlesPageProps) {
    console.log("Cart items:", cart);

    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);

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
            <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <p className="text-xl font-semibold">Aucun article disponible pour le moment.</p>
                <Button
                    as={NextLink}
                    className="mt-6 bg-violet-600 dark:bg-violet-700 text-white hover:bg-violet-700 dark:hover:bg-violet-800 transition-colors"
                    href="/"
                >
                    Retour à l'accueil
                </Button>
            </div>
        );
    }

    return (
        <section className="min-h-screen px-6 py-12 lg:px-12 xl:px-20 bg-white dark:bg-gray-900 transition-colors">
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-12"
                initial={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-center mb-2">
                    <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
                        🛍️ Notre Boutique
                    </span>
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto mb-8">
                    Découvrez notre sélection de produits spécialement conçus pour améliorer le quotidien
                    des personnes autistes.
                </p>
                <motion.h2
                    className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug text-gray-700 dark:text-gray-300 text-center mb-4 flex items-center justify-center gap-2"
                >
                    <span className="text-yellow-500">
                        <FontAwesomeIcon icon={faStar} />
                    </span>
                    Découvrez notre sélection d&apos;articles
                </motion.h2>
                <p className="text-center text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
                    Des produits soigneusement sélectionnés pour améliorer le quotidien des personnes autistes et faciliter leur inclusion.
                </p>
            </motion.div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, index) => (
                        <motion.div
                            key={article.productId || index}
                            animate={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <Card className="overflow-hidden bg-cream dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl h-full">
                                <div className="relative">
                                    <img
                                        alt={article.title}
                                        className="object-cover object-center w-full h-52"
                                        src={article.imageUrl}
                                    />
                                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-base font-bold">
                                        {article.price} €
                                    </div>
                                </div>
                                <CardBody className="flex flex-col items-center p-5 h-full">
                                    <h3 className="mb-2 text-lg font-bold text-center text-gray-800 dark:text-white">{article.title}</h3>
                                    <p className="text-sm text-center text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                                        {article.description}
                                    </p>
                                    <div className="flex flex-col w-full mt-auto space-y-3">
                                        <NextLink href={`/products/${article._id}`}>
                                            <Button fullWidth className="bg-violet-600 text-white hover:bg-violet-700">
                                                Voir cet article
                                            </Button>
                                        </NextLink>
                                        <Button
                                            fullWidth
                                            className="bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={() => onAddToCart(article)}
                                        >
                                            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                                            Ajouter au panier
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}


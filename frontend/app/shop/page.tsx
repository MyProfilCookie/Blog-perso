/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
"use client";

import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

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
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>Aucun article disponible pour le moment.</p>
            </div>
        );
    }

    return (
        <section className="min-h-screen px-6 py-12 lg:px-12 xl:px-20 dark:bg-gray-900">
            <motion.h2
                animate={{
                    scale: [1, 1.05, 1],
                    color: ["#1E3A8A", "#F59E0B", "#10B981", "#1E3A8A"]
                }}
                className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug text-gray-700 dark:text-gray-300 text-center mb-8"
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <span className="icon">
                    <FontAwesomeIcon icon={faStar} />
                </span> Découvrez notre sélection d&apos;articles pour améliorer le quotidien des personnes autistes.
            </motion.h2>

            <div className="flex flex-col mx-auto text-center max-w-7xl md:flex-row md:items-start md:text-left">
                <div className="w-full">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article, index) => (
                            <motion.div
                                key={article.productId || index}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full"
                                initial={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card className="overflow-hidden transition-all bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white hover:shadow-xl h-full">
                                    <img
                                        alt={article.title}
                                        className="object-cover object-center w-full h-52"
                                        src={article.imageUrl}
                                    />
                                    <CardBody className="flex flex-col items-center p-5 h-full">
                                        <h3 className="mb-2 text-lg font-bold text-center">{article.title}</h3>
                                        <p className="text-sm text-center text-gray-600 dark:text-gray-300 line-clamp-3 min-h-[3rem]">
                                            {article.description}
                                        </p>
                                        <p className="mt-4 text-lg font-semibold text-blue-600">
                                            {article.price} €
                                        </p>
                                        <div className="flex flex-col w-full mt-4 space-y-3">
                                        <NextLink passHref href={`/products/${article._id}`}>
  <Button fullWidth color="danger">Voir cet article</Button>
</NextLink>
                                        <Button fullWidth color="secondary" onClick={() => onAddToCart(article)}>
    Ajouter au panier
                                        </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="w-full py-8 text-sm text-center text-gray-500 dark:text-gray-300">
                © 2024 AutiStudy - Tous droits réservés.
            </footer>
        </section>
    );
}




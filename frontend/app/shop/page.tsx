/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
"use client";

import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import Loading from "@/components/loading";

type Article = {
    title: string;
    description: string;
    price: number;
    link: string;
    imageUrl: string;
    productId: string;
};

interface ArticlesPageProps {
    onAddToCart: (article: Article) => void;
    cart: Article[];
}

export default function ArticlesPage({ onAddToCart, cart }: ArticlesPageProps) {
    console.log("Cart items:", cart);

    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    // Fonction pour générer un ID unique (si nécessaire)
    const generateUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);

    // Fonction pour récupérer les articles via une API
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des produits");
                }

                const data = await response.json();

                // Enrichir les données avec productId si manquant
                const enrichedData = data.map((item: any) => ({
                    ...item,
                    // on recupère l'id de l'article dans la base de données
                    productId: item.productId || item.id || generateUniqueId(),
                }));

                setArticles(enrichedData); // Mettre à jour les articles
            } catch (error) {
                console.error("Erreur lors de la récupération des articles :", error);
            } finally {
                setLoading(false); // Fin du chargement
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <Loading />; // Affichage du message de chargement
    }

    if (articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>Aucun article disponible pour le moment.</p>
            </div>
        );
    }

    return (
        <section className="flex flex-col justify-between min-h-screen py-8 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 text-center">
                <h2 className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Voici une sélection d&apos;articles pour améliorer le quotidien des
                    personnes autistes.
                </h2>

                <div className="grid gap-8 mt-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, index) => (
                        <motion.div
                            key={article.productId || index}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                            initial={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="py-4 max-w-[400px] w-full mx-auto shadow-lg dark:bg-gray-800 dark:text-white">
                                <img
                                    alt={article.title}
                                    className="w-full h-48 object-cover object-center"
                                    src={article.imageUrl}
                                />
                                <CardBody className="flex flex-col items-center">
                                    <h3 className="mb-2 text-xl font-bold">{article.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{article.description}</p>
                                    <p className="mt-4 text-lg font-semibold">{article.price} €</p>
                                    <NextLink passHref href={article.link}>
                                        <Button className="mt-4" color="primary">
                                            Voir cet article
                                        </Button>
                                    </NextLink>
                                    <Button
                                        className="mt-4"
                                        color="secondary"
                                        onClick={() => onAddToCart(article)}
                                    >
                                        Ajouter au panier
                                    </Button>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full py-4 text-center dark:text-gray-300">
                <p style={{ fontSize: "1em", color: "#888" }}>
                    © 2024 AutiStudy - Tous droits réservés.
                </p>
            </footer>
        </section>
    );
}



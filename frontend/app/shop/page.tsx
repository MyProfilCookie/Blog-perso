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
};

interface ArticlesPageProps {
    onAddToCart: (article: Article) => void;
}

export default function ArticlesPage({ onAddToCart }: ArticlesPageProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    // Fonction pour récupérer les articles via une API
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`); // Assurez-vous que l'URL de l'API est correcte
                const data = await res.json();

                setArticles(data); // Mettre à jour l'état avec les articles récupérés
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Erreur lors du chargement des articles", error);
            } finally {
                setLoading(false); // Fin du chargement
            }
        };

        fetchArticles();
    }, []);
    // netoyage du panier si on supprime un article lorsque nous ne sommes pas connectés
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("cart");
        }
    }, []);
    console.log(articles);
    // le panier
    if (loading) {
        return <Loading />; // Message de chargement
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
                            key={index}
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
                                        onClick={() => onAddToCart(article)} // Appel de la fonction pour ajouter au panier
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



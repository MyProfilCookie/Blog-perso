/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";

import { title, subtitle } from "@/components/primitives";

interface Article {
  "📌 titre": string;
  "📝 sous-titre": string;
  "🧠 description": string;
  "📖 content": string;
  "📂 category": string;
  "✍️ auteur": string;
  "🔗 imageUrl": string;
  "📅 date": string;
}

// Fonction pour transformer la date au format "YYYY-MM-DD" en "DD Month YYYY"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  return date.toLocaleDateString('fr-FR', options);
};

const ArticlePage = () => {
  const params = useParams() as { id: string | string[] };
  const articleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api").replace(/\/$/, "");
        const response = await axios.get(`${apiUrl}/articles`);
        const articles = response.data;
        const foundArticle = articles[parseInt(articleId, 10)];

        setArticle(foundArticle || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <Link href="/articles">
          <Button className="mt-4 text-white bg-violet-600 hover:bg-violet-700">
            Retour à la liste des articles
          </Button>
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Article non trouvé</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/articles">
          <Button className="mt-4 text-white bg-violet-600 hover:bg-violet-700">
            Retour à la liste des articles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full bg-cream dark:bg-gray-900 py-16 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Informations sur l'Article */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={`${title()} text-4xl md:text-5xl font-bold leading-tight dark:text-violet-300`}>
            {article["📌 titre"]}
          </h1>
          <h2 className={`${subtitle()} text-xl md:text-2xl text-gray-600 dark:text-gray-300 italic`}>
            {article["📝 sous-titre"]}
          </h2>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>Publié le : <span className="font-medium text-violet-600 dark:text-violet-400">{formatDate(article["📅 date"])}</span></p>
            <p>Auteur : <span className="font-medium text-violet-600 dark:text-violet-400">{article["✍️ auteur"]}</span></p>
          </div>
        </motion.div>

        {/* Image de l'Article */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="w-full max-w-4xl">
            <Image
              alt={article["📌 titre"]}
              className="object-cover w-full h-auto max-h-[500px] rounded-lg shadow-md dark:shadow-gray-800"
              height={500}
              width={800}
              src={article["🔗 imageUrl"]}
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        </motion.div>

        {/* Contenu de l'Article */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Card className="w-full max-w-3xl bg-cream dark:bg-gray-800 shadow-none dark:border dark:border-gray-700">
            <CardBody className="p-8 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
              <div className="prose dark:prose-invert max-w-none">
                {article["📖 content"].split('\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    animate={{ opacity: 1 }}
                    className="mt-4 leading-relaxed text-justify"
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                      part.startsWith('**') ? <strong key={i} className="text-violet-600 dark:text-violet-400">{part.slice(2, -2)}</strong> : part
                    )}
                  </motion.p>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Lien de Retour à la Liste des Articles */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <Link href="/articles">
            <Button className="px-6 py-3 text-white rounded-lg bg-violet-600 hover:bg-violet-700 transition-colors">
              Retour à la liste des articles
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticlePage;

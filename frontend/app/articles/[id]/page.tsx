"use client";
import dynamic from 'next/dynamic';
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */

import React from "react";
import { useParams } from "next/navigation";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Button } from '@nextui-org/react';
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { title, subtitle } from "@/components/primitives";
import articlesData from "@/public/dataarticles.json";

interface Article {
  id: number;
  title: string;
  subtitle: string;
  img: string;
  category?: string;
  author?: string;
  date?: string;
  content?: string;
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
    const fetchArticle = () => {
      try {
        const articles = articlesData.articles;
        const foundArticle = articles.find((article: Article) => article.id === parseInt(articleId, 10));

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
    <section className="flex flex-col items-center justify-center min-h-screen w-full bg-cream dark:bg-gray-900 py-6 sm:py-8 md:py-12 lg:py-16 px-3 sm:px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Informations sur l'Article */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={`${title()} text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight dark:text-violet-300 mb-3 sm:mb-4`}>
            {article.title}
          </h1>
          <h2 className={`${subtitle()} text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 italic mb-3 sm:mb-4`}>
            {article.subtitle}
          </h2>
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
            <p>Publié le : <span className="font-medium text-violet-600 dark:text-violet-400">{article.date ? formatDate(article.date) : 'Date non disponible'}</span></p>
            <p>Auteur : <span className="font-medium text-violet-600 dark:text-violet-400">{article.author || 'Auteur non disponible'}</span></p>
          </div>
        </motion.div>

        {/* Image de l'Article */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="w-full max-w-4xl">
            <Image
              alt={article.title}
              className="object-cover w-full h-auto max-h-[250px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[500px] rounded-lg shadow-md dark:shadow-gray-800"
              height={800}
              width={1200}
              src={article.img}
              priority
              quality={95}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
        </motion.div>

        {/* Contenu de l'Article */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Card className="w-full max-w-3xl bg-cream dark:bg-gray-800 shadow-none dark:border dark:border-gray-700">
            <CardBody className="p-3 sm:p-4 md:p-6 lg:p-8 text-sm sm:text-base md:text-lg leading-relaxed text-gray-800 dark:text-gray-200">
              <div className="prose dark:prose-invert max-w-none">
                {article.content ? article.content.split('\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    animate={{ opacity: 1 }}
                    className="mt-3 sm:mt-4 leading-relaxed text-justify"
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                      part.startsWith('**') ? <strong key={i} className="text-violet-600 dark:text-violet-400">{part.slice(2, -2)}</strong> : part
                    )}
                  </motion.p>
                )) : (
                  <motion.p
                    animate={{ opacity: 1 }}
                    className="mt-3 sm:mt-4 leading-relaxed text-justify"
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    Contenu de l'article en cours de chargement...
                  </motion.p>
                )}
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
            <Button className="px-3 sm:px-4 md:px-6 py-2 md:py-3 text-sm sm:text-base text-white rounded-lg bg-violet-600 hover:bg-violet-700 transition-colors">
              Retour à la liste des articles
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticlePage;

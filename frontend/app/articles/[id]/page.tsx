/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { useParams } from "next/navigation"; // Utiliser useParams pour obtenir les paramètres de l'URL
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { title, subtitle } from "@/components/primitives";

// Importation des données d'articles depuis le fichier JSON
import articlesData from "@/public/dataarticless.json";

// Fonction pour transformer la date au format "YYYY-MM-DD" en "DD Month YYYY"
const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  return date.toLocaleDateString('fr-FR', options);
};

const ArticlePage = () => {
  const { id } = useParams(); // Récupérer l'ID de l'URL
  const articleId = Array.isArray(id) ? id[0] : id; // Ensure id is a string

  // Recherche de l'article correspondant à l'ID
  const article = articlesData.articles.find(
    (article) => article.id === parseInt(articleId, 10)
  );

  // Vérifie si l'article existe
  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen text-center bg-cream dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Article non trouvé</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/articles">
          <Button className="mt-4 text-white bg-violet-600 dark:bg-violet-700 hover:bg-violet-700 dark:hover:bg-violet-800">
            Retour à la liste des articles
          </Button>
        </Link>
      </div>
    );
  }

  // Rendu du contenu de l'article en fonction de son type (paragraphe, sous-titre, image)
  const renderContent = () => {
    return article.content.map((item, index) => {
      switch (item.type) {
        case "paragraph":
          return (
            <motion.p
              key={index}
              animate={{ opacity: 1 }}
              className="mt-4 leading-relaxed text-justify text-gray-800 dark:text-gray-200"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {(item.text ?? '').split(/(\*\*.*?\*\*)/g).map((part, i) =>
                part.startsWith('**') ? <strong key={i} className="text-violet-600 dark:text-violet-400">{part.slice(2, -2)}</strong> : part
              )}
            </motion.p>
          );
        case "subtitle":
          return (
            <motion.h3
              key={index}
              animate={{ opacity: 1 }}
              className="mt-8 text-2xl font-semibold text-violet-700 dark:text-violet-400"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {item.text}
            </motion.h3>
          );
        case "image":
          return (
            <motion.div
              key={index}
              animate={{ opacity: 1 }}
              className="my-8"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Image
                alt={item.alt || ''}
                className="object-cover w-full h-auto max-h-[500px] rounded-lg shadow-md dark:shadow-gray-800"
                height={0}
                src={item.src || ''}
                width={0}
              />
            </motion.div>
          );
        default:
          return null;
      }
    });
  };

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
            {article.title}
          </h1>
          <h2 className={`${subtitle()} text-xl md:text-2xl text-gray-600 dark:text-gray-300 italic`}>
            {article.subtitle}
          </h2>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>Publié le : <span className="font-medium text-violet-600 dark:text-violet-400">{formatDate(article.date)}</span></p>
            <p>Auteur : <span className="font-medium text-violet-600 dark:text-violet-400">{article.author}</span></p>
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
              alt={article.title}
              className="object-cover w-full h-auto max-h-[500px] rounded-lg shadow-md dark:shadow-gray-800"
              height={0}
              src={article.image}
              width={0}
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
              {renderContent()}
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
            <Button className="px-6 py-3 text-white rounded-lg bg-violet-600 dark:bg-violet-700 hover:bg-violet-700 dark:hover:bg-violet-800 transition-colors">
              Retour à la liste des articles
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticlePage;







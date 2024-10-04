/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { useParams } from "next/navigation"; // Utiliser useParams pour obtenir les paramètres de l'URL
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";

// Importation des données d'articles depuis le fichier JSON
import articlesData from "@/public/dataarticless.json";
import { title, subtitle } from "@/components/primitives";

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
      <div className="flex flex-col items-center justify-center w-full h-screen text-center">
        <h2 className="text-2xl font-bold">Article non trouvé</h2>
        <p className="mt-4">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/articles">
          <Button className="mt-4 text-white bg-violet-600">Retour à la liste des articles</Button>
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
            <p key={index} className="mt-4 leading-relaxed text-justify text-gray-800">
              {(item.text ?? '').split(/(\*\*.*?\*\*)/g).map((part, i) =>
                part.startsWith('**') ? <strong key={i} className="text-violet-600">{part.slice(2, -2)}</strong> : part
              )}
            </p>
          );
        case "subtitle":
          return (
            <h3 key={index} className="mt-8 text-2xl font-semibold text-violet-700">
              {item.text}
            </h3>
          );
        case "image":
          return (
            <div key={index} className="my-8">
              <img
                alt={item.alt}
                className="object-cover w-full h-auto max-h-[500px] rounded-lg shadow-md"
                src={item.src}
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <section className="flex flex-col items-center justify-start w-full min-h-screen gap-12 px-4 py-16 bg-white md:px-8">
      {/* Informations sur l'Article */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl text-center"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={`${title({ color: "violet" })} text-4xl md:text-5xl font-bold leading-tight`}>{article.title}</h1>
        <h2 className={`${subtitle({ class: "mt-4" })} text-xl md:text-2xl text-gray-600 italic`}>{article.subtitle}</h2>
        <div className="mt-4 text-sm text-gray-500">
          <p>Publié le : <span className="font-medium text-violet-600">{formatDate(article.date)}</span></p>
          <p>Auteur : <span className="font-medium text-violet-600">{article.author}</span></p>
        </div>
      </motion.div>

      {/* Image de l'Article */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <img
          alt={article.title}
          className="object-cover w-full h-auto max-h-[500px] rounded-lg shadow-md"
          src={article.image}
        />
      </motion.div>

      {/* Contenu de l'Article */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mt-8"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <Card className="bg-white shadow-none">
          <CardBody className="p-8 text-lg leading-relaxed text-gray-800">
            {renderContent()}
          </CardBody>
        </Card>
      </motion.div>

      {/* Lien de Retour à la Liste des Articles */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-12"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <Link href="/articles">
          <Button className="px-6 py-3 text-white rounded-lg bg-violet-600 hover:bg-violet-700">
            Retour à la liste des articles
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default ArticlePage;








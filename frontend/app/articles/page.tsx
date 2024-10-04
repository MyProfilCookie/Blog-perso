/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
// eslint-disable-next-line import/order
import Link from "next/link"; // Utilisé pour les liens internes

// Supposons que votre fichier JSON soit importé ici
import articlesData from "@/public/dataarticles.json";
import { title, subtitle } from "@/components/primitives";


// Composant pour afficher un article individuel dans la grille
const ArticleCard = ({ id, title, subtitle, img }: { id: number, title: string, subtitle: string, img: string }) => (
  <motion.div
    className="w-full mb-6"
    whileHover={{ scale: 1.05 }}
  >
    <Card className="h-full shadow-lg">
      <CardBody className="p-4">
      <Link href={`/articles/${id}`}>
        <img
          alt={title}
          className="object-cover w-full h-[150px] rounded-lg"
          src={img}
        />
      </Link>
        <h4 className="mt-4 text-lg font-bold">{title}</h4>
        <p className="mt-2 text-default-500">{subtitle}</p>
        {/* Lien vers la page de détails de l'article */}
        <Link href={`/articles/${id}`}>
          <Button className="mt-4 text-white bg-violet-600">
            Lire la suite
          </Button>
        </Link>
      </CardBody>
    </Card>
  </motion.div>
);

const ArticlesPage = () => {
  // Nous affichons ici un maximum de 12 articles
  const articlesToDisplay = articlesData.articles.slice(0, 12).map((article: { id?: number; title: string; subtitle: string; image: string; content: string; }, index) => ({
    ...article,
    id: article.id ?? index, // Ensure each article has an id
  }));

  return (
    <section className="flex flex-col items-center justify-center w-full gap-8 py-12 md:py-16">
      {/* Header Title Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={title({ color: "violet" })}>Articles et Astuces</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Explorez une variété d'articles et d'astuces pour mieux comprendre et
          accompagner les enfants autistes.
        </h2>
      </motion.div>

      {/* Articles Grid */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1200px] mt-12"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        {articlesToDisplay.map((article: { id: React.Key | null | undefined; subtitle: string; image: string; title: string; }) => (
          <ArticleCard
            key={article.id}
            id={Number(article.id) ?? 0}
            img={article.image}
            subtitle={article.subtitle}
            title={article.title}
          />
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center w-full mt-8"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <Button
          className="text-white bg-violet-600"
          href="/resources"
        >
          Voir toutes nos ressources
        </Button>
      </motion.div>

      {/* Footer */}
      <footer className="mt-16 text-center">
        <p style={{ fontSize: "1em", color: "#888" }}>
          © 2024 AutiStudy - Tous droits réservés. Créé par la famille Ayivor.
        </p>
      </footer>
    </section>
  );
};

export default ArticlesPage;


/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

import articlesData from "@/public/dataarticles.json";
import { title, subtitle } from "@/components/primitives";
import { Input } from "@/components/ui/input";

const ArticleCard = ({ id, title, subtitle, img }: { id: number, title: string, subtitle: string, img: string }) => (
  <motion.div
    className="w-full mb-6"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-cream rounded-lg overflow-hidden flex flex-col h-full">
      <CardBody className="p-4">
        <Link href={`/articles/${id}`}>
          <motion.img
            alt={title}
            className="object-cover w-full h-[150px] rounded-lg"
            src={img}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        </Link>
        <h4 className="mt-4 text-lg font-bold">{title}</h4>
        <p className="mt-2 text-default-500">{subtitle}</p>
        <Link href={`/articles/${id}`}>
          <motion.button
            className="mt-4 text-white bg-violet-600 px-4 py-2 rounded-lg shadow-lg hover:bg-violet-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Lire la suite
          </motion.button>
        </Link>
      </CardBody>
    </Card>
  </motion.div>
);

const ArticlesPage = () => {
  const [search, setSearch] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(articlesData.articles);

  useEffect(() => {
    const filtered = articlesData.articles.filter((article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.subtitle.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [search]);
  
  return (
    <section className="flex flex-col items-center justify-center w-full gap-8 py-12 md:py-16">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className={title({ color: "violet" }) + " flex items-center justify-center gap-2"}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Articles et Astuces
          <Sparkles className="text-violet-600 w-6 h-6" />
        </motion.h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Explorez une variété d'articles et d'astuces pour mieux comprendre et
          accompagner les enfants autistes.
        </h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full flex justify-center"
        >
          <Input
            className="w-full sm:w-2/3 px-4 py-2 border rounded-lg shadow-lg focus:ring-2 focus:ring-violet-500 mt-4"
            placeholder="Rechercher un article..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1200px] mt-12"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        {filteredArticles.map((article, index) => (
          <ArticleCard
            key={article.id || index}
            id={article.id || index}
            img={article.image}
            subtitle={article.subtitle}
            title={article.title}
          />
        ))}
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center w-full mt-8"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.button
          className="text-white bg-violet-600 px-6 py-3 rounded-lg shadow-lg hover:bg-violet-700"
          onClick={() => window.location.href = "/resources"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Voir toutes nos ressources
        </motion.button>
      </motion.div>

      <footer className="mt-16 text-center">
        <motion.p
          style={{ fontSize: "1em", color: "#888" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          © 2024 AutiStudy - Tous droits réservés. Créé par la famille Ayivor.
        </motion.p>
      </footer>
    </section>
  );
};

export default ArticlesPage;






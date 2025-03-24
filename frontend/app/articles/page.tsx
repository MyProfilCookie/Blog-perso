/* eslint-disable padding-line-between-statements */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

// Importation des composants shadcn/ui
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import articlesData from "@/public/dataarticles.json";
import { title } from "@/components/primitives";
import ArticlesList from "@/components/articles/ArticlesList";

interface ArticleCardProps {
  id: number;
  title: string;
  subtitle: string;
  img: string;
}

const ArticleCard = ({ id, title, subtitle, img }: ArticleCardProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="w-full mb-6"
    initial={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.03 }}
  >
    <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-cream dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col h-full border border-transparent dark:border-gray-700">
      <Link className="block relative overflow-hidden h-[150px]" href={`/articles/${id}`}>
        <motion.img
          alt={title}
          className="object-cover w-full h-full rounded-t-lg transition-transform duration-300"
          src={img}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
        />
      </Link>

      <CardHeader className="p-4 pb-0">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h4>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-gray-500 dark:text-gray-300">{subtitle}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link className="block w-full" href={`/articles/${id}`}>
          <Button
            className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white"
          >
            Lire la suite
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
);

const ArticlesPage = () => {
  const [search, setSearch] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(articlesData.articles);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Calcul pour la pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  useEffect(() => {
    const filtered = articlesData.articles.filter((article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.subtitle.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredArticles(filtered);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une recherche
  }, [search]);

  // Changement de page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll en haut pour une meilleure UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Générer les numéros de page
  const getPageNumbers = () => {
    const pages = [];

    // Si moins de 7 pages, afficher toutes les pages
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toujours afficher la première page
      pages.push(1);

      // Si on est près du début
      if (currentPage <= 3) {
        pages.push(2, 3, 4, 5);
        pages.push(null); // Ellipsis
        pages.push(totalPages);
      }
      // Si on est près de la fin
      else if (currentPage >= totalPages - 2) {
        pages.push(null); // Ellipsis
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
      // Si on est au milieu
      else {
        pages.push(null); // Ellipsis
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push(null); // Ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <motion.div
        className="w-full text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className={`${title()} text-4xl md:text-5xl font-bold leading-tight text-violet-600 dark:text-violet-300 flex items-center justify-center gap-2`}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Articles et Astuces
        </motion.h1>
      </motion.div>

      <ArticlesList />
    </div>
  );
};

export default ArticlesPage;

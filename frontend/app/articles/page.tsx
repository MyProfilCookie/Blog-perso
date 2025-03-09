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
import { title, subtitle } from "@/components/primitives";

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
    <section className="flex flex-col items-center justify-center w-full gap-8 py-12 md:py-16 bg-cream dark:bg-gray-900">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
          className={title({ color: "violet" }) + " flex items-center justify-center gap-2 dark:text-violet-300"}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Articles et Astuces
          <Sparkles className="text-violet-600 dark:text-violet-400 w-6 h-6" />
        </motion.h1>
        <h2 className={subtitle({ class: "mt-4" }) + " dark:text-gray-300"}>
          Explorez une variété d'articles et d'astuces pour mieux comprendre et
          accompagner les enfants autistes.
        </h2>
        <motion.div
          animate={{ opacity: 1 }}
          className="w-full flex justify-center px-4"
          initial={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="w-full sm:w-2/3 mt-4">
            <Input
              className="px-4 py-2 border rounded-lg shadow-lg focus-visible:ring-2 focus-visible:ring-violet-500 bg-cream dark:bg-gray-800 dark:text-white dark:border-gray-700"
              placeholder="Rechercher un article..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1200px] mt-8 px-4"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {currentArticles.length > 0 ? (
          currentArticles.map((article, index) => (
            <ArticleCard
              key={article.id || index}
              id={article.id || index}
              img={article.image}
              subtitle={article.subtitle}
              title={article.title}
            />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
            <Card className="bg-cream dark:bg-gray-800 border border-transparent dark:border-gray-700 shadow-md">
              <CardContent className="p-6">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Aucun article ne correspond à votre recherche.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>

      {filteredArticles.length > articlesPerPage && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-900/30"}
                  onClick={() => paginate(currentPage - 1)}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                page === null ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${page}`}>
                    <PaginationLink
                      className={page === currentPage
                        ? "bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800"
                        : "hover:bg-violet-100 dark:hover:bg-violet-900/30 cursor-pointer"
                      }
                      isActive={page === currentPage}
                      onClick={() => paginate(page as number)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}

              <PaginationItem>
                <PaginationNext
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-900/30"}
                  onClick={() => paginate(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center w-full mt-8"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <Link href="/resources">
          <Button
            className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white px-6 py-6 h-auto text-base font-medium shadow-lg"
            size="lg"
          >
            Voir toutes nos ressources
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default ArticlesPage;

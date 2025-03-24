"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";
import ArticleCard from "@/components/articles/ArticleCard";

interface Article {
  id: number;
  title: string;
  subtitle: string;
  img: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "Introduction à React",
    subtitle: "Découvrez les bases de React",
    img: "/images/react.jpg"
  },
  // ... Ajoutez plus d'articles ici
];

export default function ArticlesList() {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const filteredArticles = mockArticles.filter(article =>
    article.title.toLowerCase().includes(searchInput.toLowerCase()) ||
    article.subtitle.toLowerCase().includes(searchInput.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          type="search"
          placeholder="Rechercher des articles..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-xs"
        />
        <Button
          as="a"
          href="/ressources"
          color="primary"
          variant="flat"
        >
          Voir les ressources
        </Button>
      </div>

      {currentArticles.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {currentArticles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">
            Aucun article ne correspond à votre recherche.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
} 
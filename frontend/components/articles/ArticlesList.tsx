"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ArticleCard from "./ArticleCard";

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

type SortOption = "date" | "titre" | "auteur" | "category";

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const articlesPerPage = 6;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api").replace(/\/$/, "");
        const response = await axios.get(`${apiUrl}/articles`);
        setArticles(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fonction de tri
  const sortArticles = (articles: Article[]) => {
    return [...articles].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a["📅 date"]).getTime() - new Date(b["📅 date"]).getTime();
          break;
        case "titre":
          comparison = a["📌 titre"].localeCompare(b["📌 titre"]);
          break;
        case "auteur":
          comparison = a["✍️ auteur"].localeCompare(b["✍️ auteur"]);
          break;
        case "category":
          comparison = a["📂 category"].localeCompare(b["📂 category"]);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  // Filtrage et tri des articles
  const filteredArticles = articles
    .filter((article) =>
      article["📌 titre"].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article["📝 sous-titre"].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article["🧠 description"].toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a["📅 date"]).getTime() - new Date(b["📅 date"]).getTime();
          break;
        case "titre":
          comparison = a["📌 titre"].localeCompare(b["📌 titre"]);
          break;
        case "auteur":
          comparison = a["✍️ auteur"].localeCompare(b["✍️ auteur"]);
          break;
        case "category":
          comparison = a["📂 category"].localeCompare(b["📂 category"]);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Barre de recherche et options de tri */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Rechercher un article..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          startContent={
            <svg
              className="text-gray-400"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" x2="16.65" y1="21" y2="16.65" />
            </svg>
          }
        />
        <div className="flex gap-2">
          <Select
            placeholder="Trier par"
            selectedKeys={[sortBy]}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-40"
          >
            <SelectItem key="date" value="date">Date</SelectItem>
            <SelectItem key="titre" value="titre">Titre</SelectItem>
            <SelectItem key="auteur" value="auteur">Auteur</SelectItem>
            <SelectItem key="category" value="category">Catégorie</SelectItem>
          </Select>
          <Button
            isIconOnly
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-violet-600 text-white"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      {/* Liste des articles */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {paginatedArticles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ArticleCard
                id={index.toString()}
                title={article["📌 titre"]}
                subtitle={article["📝 sous-titre"]}
                img={article["🔗 imageUrl"]}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            isDisabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-violet-600 text-white"
          >
            Précédent
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                isIconOnly
                onClick={() => setCurrentPage(page)}
                className={`${
                  currentPage === page
                    ? "bg-violet-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            isDisabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-violet-600 text-white"
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Message si aucun résultat */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            Aucun article ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ArticleCard from "./ArticleCard";
import axios from "axios";
import { motion } from "framer-motion";

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

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  const filteredArticles = articles.filter((article) =>
    article["📌 titre"].toLowerCase().includes(searchQuery.toLowerCase()) ||
    article["📝 sous-titre"].toLowerCase().includes(searchQuery.toLowerCase()) ||
    article["🧠 description"].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  if (loading) {
    return (
      <motion.div 
        className="flex justify-center items-center min-h-[400px] w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="text-center text-red-500 p-4 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p>{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-8 w-full max-w-7xl mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un article..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles.map((article, index) => (
          <ArticleCard
            key={index}
            id={index.toString()}
            title={article["📌 titre"]}
            subtitle={article["📝 sous-titre"]}
            img={article["🔗 imageUrl"]}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
          >
            Précédent
          </button>
          <span className="px-4 py-2">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
          >
            Suivant
          </button>
        </div>
      )}
    </motion.div>
  );
} 
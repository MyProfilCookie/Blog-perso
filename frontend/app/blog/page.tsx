/* eslint-disable no-console */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import NextLink from "next/link";
import { RefreshCw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  category: "Sensibilisation" | "Témoignages" | "Conseils" | "Recherche";
  author: string;
  imageUrl: string;
  createdAt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const blogsPerPage = 6;

  const fetchBlogs = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/blog?page=${pageNum}&limit=${blogsPerPage}`,
      );

      if (!response.ok)
        throw new Error("Erreur lors de la récupération des articles");

      const data = await response.json();

      setBlogs(data.blogs);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("❌ Erreur :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handleRefresh = () => {
    setPage(1);
    fetchBlogs(1);
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-violet-700 dark:text-violet-300 shadow-md p-2 rounded-lg">
          📰 Nos Derniers Articles
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
          Explorez nos articles, astuces et conseils sur l’autisme.
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 max-w-3xl mx-auto">
        <Input
          className="w-full sm:w-2/3 px-4 py-2 border rounded-lg shadow-lg focus:ring-2 focus:ring-violet-500"
          placeholder="Rechercher un article..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="bg-violet-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-violet-700 shadow-lg"
          disabled={loading}
          onClick={handleRefresh}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Rafraîchir
        </Button>
      </div>

      {error && (
        <motion.div
          animate={{ opacity: 1 }}
          className="text-center text-red-600 bg-red-100 p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredBlogs.map((blog) => (
          <motion.div
            key={blog._id}
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="shadow-2xl bg-white rounded-lg overflow-hidden hover:shadow-xl flex flex-col h-full">
              <img
                alt={blog.title}
                className="w-full h-48 object-cover"
                src={blog.imageUrl}
                onError={(e) =>
                  (e.currentTarget.src = "/assets/autism-daily.jpg")
                }
              />
              <CardBody className="p-4 flex flex-col justify-between flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 shadow-sm p-2 rounded-lg">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {blog.description}
                </p>
                <NextLink href={`/blog/${blog._id}`}>
                  <motion.button
                    className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg shadow-lg self-start"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    Lire l&apos;article
                  </motion.button>
                </NextLink>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          disabled={page === 1}
          onClick={prevPage}
        >
          Précédent
        </Button>
        <span className="text-gray-700">
          Page {page} sur {totalPages}
        </span>
        <Button
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          disabled={page === totalPages}
          onClick={nextPage}
        >
          Suivant
        </Button>
      </div>
    </section>
  );
}

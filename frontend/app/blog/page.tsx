/* eslint-disable no-console */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Pour la redirection
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import { RefreshCw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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

const categories = [
  "Tous",
  "Sensibilisation",
  "Témoignages",
  "Conseils",
  "Recherche",
];

export default function BlogPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
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
    if (page < totalPages) setPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  };

  // 🔎 **Filtrage combiné par titre et catégorie**
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "Tous" || blog.category === selectedCategory),
  );

  return (
    <section className="min-h-screen bg-cream dark:bg-gray-900 py-10 px-6">
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

      {/* ✅ Ajout du champ de recherche et du filtre catégorie */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 max-w-3xl mx-auto">
        {/* 🔎 Input de recherche */}
        <Input
          className="w-full sm:w-2/3 px-4 py-2 border rounded-lg shadow-lg focus:ring-2 focus:ring-violet-500 bg-cream"
          placeholder="Rechercher un article..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 🔽 Select pour filtrer par catégorie (Correction de l'erreur) */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-1/3 px-4 py-2 border rounded-lg shadow-lg bg-cream dark:bg-gray-800 dark:text-white">
            {selectedCategory}
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 🔄 Bouton de rafraîchissement */}
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

      {/* ✅ Liste des articles filtrés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto bg-cream dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        {filteredBlogs.map((blog) => (
          <motion.div
            key={blog._id}
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="shadow-2xl bg-cream dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl flex flex-col h-full">
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
                <motion.button
                  className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg shadow-lg self-start"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => router.push(`/blog/${blog._id}`)}
                >
                  Lire l&apos;article
                </motion.button>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
          disabled={page === 1}
          onClick={prevPage}
        >
          Précédent
        </Button>
        <div className="flex items-center">
          <span className="text-gray-700 dark:text-gray-300">
            Page {page} sur {totalPages}
          </span>
        </div>
        <Button
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
          disabled={page === totalPages}
          onClick={nextPage}
        >
          Suivant
        </Button>
      </div>
    </section>
  );
}

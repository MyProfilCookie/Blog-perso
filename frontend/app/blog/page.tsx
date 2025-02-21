"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import NextLink from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Blog {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Récupération des articles
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`http://localhost:3001/blogs?page=${page}&limit=6`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des articles");

        const data = await response.json();
        setBlogs((prev) => [...prev, ...data]);
        if (data.length < 6) setHasMore(false);
      } catch (error) {
        console.error("❌ Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  // Filtrage des articles
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      {/* Section Héros */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-violet-700 dark:text-violet-300">
          📰 Nos Derniers Articles
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3">
          Découvrez nos articles et conseils.
        </p>
      </motion.div>

      {/* Barre de recherche */}
      <div className="flex justify-center mb-6">
        <Input
          type="text"
          placeholder="Rechercher un article..."
          className="w-full max-w-md px-4 py-2 border rounded-lg"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

      {/* Grille des articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-600 col-span-3">Aucun article trouvé.</p>
        ) : (
          filteredBlogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="shadow-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover" />
                <CardBody className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{blog.description}</p>
                  <NextLink href={`/blog/${blog._id}`}>
                    <motion.button
                      className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg shadow-md hover:bg-violet-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Lire l&apos;article
                    </motion.button>
                  </NextLink>
                </CardBody>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Bouton "Charger plus" */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            className="bg-violet-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-violet-700"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Charger plus d&apos;articles
          </Button>
        </div>
      )}
    </section>
  );
}
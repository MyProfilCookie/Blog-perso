"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import NextLink from "next/link";

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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:3001/blogs"); // 🔹 Adapter l'URL selon ton backend
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des articles");

        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("❌ Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-600">Chargement des articles...</p>
    );

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <motion.h1
        className="text-4xl font-bold text-violet-700 dark:text-violet-300 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📰 Nos derniers articles
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {blogs.map((blog) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="shadow-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <CardBody className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {blog.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {blog.description}
                </p>
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
        ))}
      </div>
    </section>
  );
}

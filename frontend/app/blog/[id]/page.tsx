/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";

export default function BlogPostPage() {
  const params = useParams();
  const { id } = params || {};

  console.log("🔍 ID récupéré :", id);

  interface Blog {
    _id: string;
    title: string;
    description: string;
    content: string | string[]; // Peut être une chaîne ou un tableau
    category: string;
    author: string;
    imageUrl: string;
    createdAt: string;
  }

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Aucun ID fourni pour récupérer l'article.");
      setLoading(false);

      return;
    }

    const fetchBlog = async () => {
      try {
        console.log("📡 Récupération des données...");
        const response = await fetch(`http://localhost:3001/blog/${id}`);

        if (!response.ok) throw new Error("Article introuvable");

        const data = await response.json();

        console.log("📦 Données récupérées :", data);

        if (data.blog) {
          setBlog(data.blog);
        } else {
          throw new Error("Données de l'article non trouvées");
        }
      } catch (error) {
        console.error("❌ Erreur API :", error);
        setError("Erreur lors du chargement de l'article.");
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-cream dark:bg-gray-900">
        <Loader2 className="animate-spin h-10 w-10 text-violet-600 dark:text-violet-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-cream dark:bg-gray-900 p-6">
        <p className="text-red-600 dark:text-red-400 font-semibold text-xl mb-4">
          {error}
        </p>
        <Link href="/blog">
          <motion.button
            className="px-4 py-2 bg-violet-600 dark:bg-violet-700 text-white rounded-lg hover:bg-violet-700 dark:hover:bg-violet-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retour aux articles
          </motion.button>
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-cream dark:bg-gray-900 p-6">
        <p className="text-center text-red-600 dark:text-red-400 font-semibold text-xl mb-4">
          ❌ Article introuvable...
        </p>
        <Link href="/blog">
          <motion.button
            className="px-4 py-2 bg-violet-600 dark:bg-violet-700 text-white rounded-lg hover:bg-violet-700 dark:hover:bg-violet-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retour aux articles
          </motion.button>
        </Link>
      </div>
    );
  }

  // 🔥 Correction : Vérifier et filtrer les lignes vides
  const contentArray = Array.isArray(blog.content)
    ? blog.content
    : blog.content?.split("\n").filter((line) => line.trim() !== "") || [];

  // Format date
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-cream dark:bg-gray-900">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/blog">
          <motion.button
            className="px-4 py-2 mb-6 bg-violet-600 dark:bg-violet-700 text-white rounded-lg hover:bg-violet-700 dark:hover:bg-violet-800 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Retour aux articles
          </motion.button>
        </Link>

        <h1 className="text-4xl font-bold text-violet-700 dark:text-violet-300 mb-4 text-center">
          📝 Découvrez notre article !
        </h1>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-cream dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <img
          alt={blog.title}
          className="w-full h-64 object-cover"
          src={blog.imageUrl}
          onError={(e) => (e.currentTarget.src = "/assets/default-blog.jpg")}
        />

        <div className="p-6 md:p-8 space-y-6">
          <h1 className="text-3xl font-bold text-violet-700 dark:text-violet-300">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>

            {formattedDate && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Tag className="w-4 h-4" />
              <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full text-xs">
                {blog.category}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
              {blog.description}
            </p>

            <div className="text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
              <ul className="list-none space-y-4">
                {contentArray.map((paragraph, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="leading-relaxed">{paragraph}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="w-full max-w-3xl mt-8 flex justify-center">
        <Link href="/blog">
          <motion.button
            className="px-6 py-3 bg-violet-600 dark:bg-violet-700 text-white rounded-lg hover:bg-violet-700 dark:hover:bg-violet-800 transition-colors shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Découvrir d'autres articles
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

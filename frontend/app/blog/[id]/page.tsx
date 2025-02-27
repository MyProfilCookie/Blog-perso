"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";

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
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <p className="text-center text-red-600 font-semibold">
        ❌ Article introuvable...
      </p>
    );
  }

  // 🔥 Correction : Vérifier et filtrer les lignes vides
  const contentArray = Array.isArray(blog.content)
    ? blog.content
    : blog.content?.split("\n").filter((line) => line.trim() !== "") || [];

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-violet-700 dark:text-violet-300 mb-8"
      >
        📝 Découvrez notre article !
      </motion.h1>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full bg-cream dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6"
      >
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
          onError={(e) => (e.currentTarget.src = "/assets/default-blog.jpg")}
        />
        <h1 className="text-3xl font-bold text-violet-700 dark:text-violet-300 mb-4">
          {blog.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Auteur :</strong> {blog.author}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          <strong>Catégorie :</strong> {blog.category}
        </p>

        {/* ✅ Affichage propre des paragraphes sans espaces vides */}
        <div className="text-gray-800 dark:text-gray-100">
          <ul className="list-none space-y-4">
            {contentArray.map((paragraph, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="leading-relaxed">{paragraph}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

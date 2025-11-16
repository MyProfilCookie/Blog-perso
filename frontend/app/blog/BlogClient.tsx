"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt?: string;
}

export default function BlogClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return blogs.filter(b => b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q));
  }, [blogs, search]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs?page=1&limit=60`);
        if (!res.ok) throw new Error("Impossible de récupérer les articles");
        const data = await res.json();
        setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-white" />
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Blog et Témoignages</h1>
          </div>
          <p className="text-blue-100 dark:text-blue-200 text-sm md:text-base">Découvrez nos articles, témoignages et conseils</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" placeholder="Rechercher un article..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {error && (
          <div className="text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg shadow-lg mb-6">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.6 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {filtered.map((b) => (
              <Card key={b._id} className="shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <CardHeader className="p-5 pb-3">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">{b.title}</h4>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">{b.description}</p>
                  <Link href={`/blog/${b._id}`} className="inline-block">
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white">Lire l'article</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

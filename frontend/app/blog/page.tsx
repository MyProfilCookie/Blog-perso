/* eslint-disable react/no-unknown-property */
/* eslint-disable no-console */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import Image from "next/image";

// Importation des composants shadcn/ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

const getCategoryBadge = (category: string) => {
  const badgeClasses = {
    Sensibilisation: "bg-blue-500 hover:bg-blue-600",
    Témoignages: "bg-yellow-500 hover:bg-yellow-600",
    Conseils: "bg-green-500 hover:bg-green-600",
    Recherche: "bg-purple-500 hover:bg-purple-600",
  };

  // @ts-ignore - On sait que la clé existe
  return badgeClasses[category] || "bg-gray-500 hover:bg-gray-600";
};

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
        `${process.env.NEXT_PUBLIC_API_URL}/blog?page=${pageNum}&limit=${blogsPerPage}`,
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

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Générer les numéros de page
  const getPageNumbers = () => {
    const pages = [];

    // Si moins de 7 pages, afficher toutes les pages
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toujours afficher la première page
      pages.push(1);

      // Si on est près du début
      if (page <= 3) {
        pages.push(2, 3, 4, 5);
        pages.push(null); // Ellipsis
        pages.push(totalPages);
      }
      // Si on est près de la fin
      else if (page >= totalPages - 2) {
        pages.push(null); // Ellipsis
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
      // Si on est au milieu
      else {
        pages.push(null); // Ellipsis
        pages.push(page - 1, page, page + 1);
        pages.push(null); // Ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "Tous" || blog.category === selectedCategory),
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <section className="min-h-screen bg-cream dark:bg-gray-900 py-10 px-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-violet-700 dark:text-violet-300 shadow-md p-2 rounded-lg bg-cream/50 dark:bg-gray-800/50">
          📰 Nos Derniers Articles de blog
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Explorez nos articles, astuces et conseils sur l'autisme.
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 max-w-3xl mx-auto">
        <div className="w-full sm:w-2/3">
          <Input
            className="px-4 py-2 border rounded-lg shadow-lg focus-visible:ring-2 focus-visible:ring-violet-500 bg-cream dark:bg-gray-800 dark:text-white dark:border-gray-700"
            placeholder="Rechercher un article..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-1/3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="px-4 py-2 border rounded-lg shadow-lg bg-cream dark:bg-gray-800 dark:text-white dark:border-gray-700">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              {categories.map((cat) => (
                <SelectItem
                  key={cat}
                  className="dark:text-white dark:hover:bg-gray-700"
                  value={cat}
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white shadow-lg transition-colors"
          disabled={loading}
          onClick={handleRefresh}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Rafraîchir
        </Button>
      </div>

      {error && (
        <motion.div
          animate={{ opacity: 1 }}
          className="text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg shadow-lg mb-8"
          initial={{ opacity: 0 }}
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto bg-cream/80 dark:bg-gray-800/50 p-6 rounded-lg shadow-lg">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <motion.div
              key={blog._id}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="shadow-xl h-full bg-cream dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl border border-transparent dark:border-gray-700 transition-shadow duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    src={blog.imageUrl}
                    onError={(e) =>
                      (e.currentTarget.src = "/assets/autism-daily.jpg")
                    }
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={`${getCategoryBadge(blog.category)} text-white`}>
                      {blog.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-4 pb-2">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white line-clamp-2">
                    {blog.title}
                  </h2>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    {blog.description}
                  </p>
                  {blog.createdAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Publié le {formatDate(blog.createdAt)}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button
                    className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white shadow-md transition-all"
                    onClick={() => router.push(`/blog/${blog._id}`)}
                  >
                    Lire l&apos;article
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Aucun article ne correspond à votre recherche.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-900/30"}
                  onClick={() => paginate(page - 1)}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNum, index) => (
                pageNum === null ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${pageNum}`}>
                    <PaginationLink
                      className={pageNum === page
                        ? "bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800"
                        : "hover:bg-violet-100 dark:hover:bg-violet-900/30 cursor-pointer"
                      }
                      isActive={pageNum === page}
                      onClick={() => paginate(pageNum as number)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}

              <PaginationItem>
                <PaginationNext
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-900/30"}
                  onClick={() => paginate(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  );
}

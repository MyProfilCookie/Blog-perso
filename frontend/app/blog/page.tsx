"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable padding-line-between-statements */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */

import dynamic from 'next/dynamic';

import { useState, useEffect, useMemo } from "react";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  BookOpen, 
  Star, 
  Eye,
  ArrowRight,
  Grid3X3,
  List,
  RefreshCw
} from "lucide-react";

import { title } from "@/components/primitives";

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

interface BlogCardProps {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  author?: string;
  createdAt?: string;
  readTime?: string;
  views?: number;
  rating?: number;
}

const BlogCard = ({ _id, title, description, imageUrl, category, author, createdAt, readTime, views, rating }: BlogCardProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="w-full mb-6"
    initial={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.02 }}
  >
    <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col h-full border border-gray-200 dark:border-gray-700 group">
      <Link className="block relative overflow-hidden h-[200px]" href={`/blog/${_id}`}>
        <motion.img
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          src={imageUrl}
          onError={(e) => (e.currentTarget.src = "/assets/autism-daily.webp")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {category && (
          <Badge className="absolute top-3 left-3 bg-violet-600 hover:bg-violet-700 text-white">
            {category}
          </Badge>
        )}
        {rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        )}
      </Link>

      <CardHeader className="p-5 pb-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          {author && (
            <>
              <User className="w-4 h-4" />
              <span>{author}</span>
            </>
          )}
          {createdAt && (
            <>
              <Calendar className="w-4 h-4" />
              <span>{new Date(createdAt).toLocaleDateString('fr-FR')}</span>
            </>
          )}
        </div>
        <h4 className="text-xl font-bold text-gray-800 dark:text-white leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {title}
        </h4>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex-grow">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          {readTime && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{readTime} min</span>
            </div>
          )}
          {views && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{views} vues</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link className="block w-full" href={`/blog/${_id}`}>
          <Button
            className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white group-hover:bg-violet-700 transition-all duration-300"
          >
            Lire l'article
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
);

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const blogsPerPage = 12;

  // Catégories disponibles
  const categories = useMemo(() => [
    { name: "Toutes les catégories", value: "all" },
    { name: "Sensibilisation", value: "Sensibilisation" },
    { name: "Témoignages", value: "Témoignages" },
    { name: "Conseils", value: "Conseils" },
    { name: "Recherche", value: "Recherche" }
  ], []);

  // Calcul pour la pagination
  const { indexOfLastBlog, indexOfFirstBlog, currentBlogs, totalPages } = useMemo(() => {
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    
    return { indexOfLastBlog, indexOfFirstBlog, currentBlogs, totalPages };
  }, [currentPage, filteredBlogs, blogsPerPage]);

  // Statistiques simulées
  const stats = useMemo(() => ({
    totalBlogs: blogs.length,
    totalViews: 25420,
    totalLikes: 5240,
    averageRating: 4.8
  }), [blogs.length]);

  // Catégories populaires
  const popularCategories = useMemo(() => [
    { name: "Sensibilisation", count: 15, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { name: "Témoignages", count: 8, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
    { name: "Conseils", count: 12, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
    { name: "Recherche", count: 6, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" }
  ], []);

  // Blogs recommandés (simulés)
  const recommendedBlogs = useMemo(() => blogs.slice(0, 3).map((blog) => ({
    ...blog,
    readTime: 3 + (blog._id.charCodeAt(0) % 8),
    views: 100 + (blog._id.charCodeAt(0) % 900),
    rating: (3.5 + (blog._id.charCodeAt(0) % 20) / 10).toFixed(1)
  })), [blogs]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs?page=1&limit=100`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Aucun article trouvé");
        }
        throw new Error("Erreur lors de la récupération des articles");
      }

      const data = await response.json();

      if (!data.blogs || !Array.isArray(data.blogs)) {
        throw new Error("Format de données invalide");
      }

      setBlogs(data.blogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("❌ Erreur :", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.description.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter(blog => 
        blog.category === selectedCategory
      );
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "popularity":
          return 0; // Tri par popularité non disponible pour le moment
        default:
          return 0;
      }
    });

    setFilteredBlogs(filtered);
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy, blogs]);

  // Changement de page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Générer les numéros de page
  const getPageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage <= 3) {
        pages.push(2, 3, 4, 5);
        pages.push(null);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(null);
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(null);
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push(null);
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      {/* Header avec titre animé */}
      <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="w-full px-3 sm:px-4 text-center">
          <motion.h1
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
            className={`${title()} text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4`}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Blog et Témoignages
          </motion.h1>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-lg md:text-xl text-violet-100 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Découvrez nos articles, témoignages et conseils sur l'autisme
          </motion.p>
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
        {/* Statistiques */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-3 sm:p-4 md:p-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-violet-600 dark:text-violet-400 mb-1 sm:mb-2">
              {stats.totalBlogs}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">Articles</div>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-3 sm:p-4 md:p-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">Vues</div>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-3 sm:p-4 md:p-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
              {stats.totalLikes.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">J'aime</div>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-3 sm:p-4 md:p-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1 sm:mb-2">
              {stats.averageRating}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">Note moyenne</div>
          </Card>
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm sm:text-base"
                placeholder="Rechercher un article..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm sm:text-base">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm sm:text-base">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Plus récents</SelectItem>
                <SelectItem value="title">Ordre alphabétique</SelectItem>
                <SelectItem value="popularity">Plus populaires</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1 sm:gap-2">
              <Button
                className="bg-violet-600 hover:bg-violet-700 text-white"
                size="sm"
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                className="bg-violet-600 hover:bg-violet-700 text-white"
                size="sm"
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button
              className="bg-violet-600 hover:bg-violet-700 text-white"
              disabled={loading}
              onClick={fetchBlogs}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Rafraîchir
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            animate={{ opacity: 1 }}
            className="text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg shadow-lg mb-4 sm:mb-6 md:mb-8"
            initial={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Catégories populaires */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                Catégories populaires
              </h3>
              <div className="space-y-1 sm:space-y-2">
                {popularCategories.map((category, index) => (
                  <motion.div
                    key={`category-${category.name}`}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">{category.name}</span>
                    <Badge className={category.color}>{category.count}</Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Articles recommandés */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                Recommandés
              </h3>
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {recommendedBlogs.map((blog, index) => (
                  <motion.div
                    key={`recommended-${blog._id}`}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/blog/${blog._id}`}>
                      <div className="flex gap-2 sm:gap-3">
                        <img
                          alt={blog.title}
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-cover rounded-lg"
                          src={blog.imageUrl}
                          onError={(e) => (e.currentTarget.src = "/assets/autism-daily.webp")}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                            {blog.title}
                          </h4>
                          <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <Eye className="w-3 h-3" />
                            <span>{blog.views}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{blog.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl p-3 sm:p-4 md:p-6 text-white"
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2">Restez informé</h3>
              <p className="text-violet-100 text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4">
                Recevez nos derniers articles directement dans votre boîte mail
              </p>
              <div className="space-y-2 sm:space-y-3">
                <Input
                  className="bg-white/20 border-white/30 text-white placeholder:text-violet-200 text-sm"
                  placeholder="Votre email"
                />
                <Button className="w-full bg-white text-violet-600 hover:bg-gray-100 text-sm">
                  S'abonner
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {/* Grille d'articles */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className={`grid gap-3 sm:gap-4 md:gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                  : "grid-cols-1"
              }`}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {currentBlogs.map((blog, index) => {
                // Générer des valeurs stables pour éviter les problèmes de clés
                const stableRating = 3.5 + (blog._id.charCodeAt(0) % 20) / 10;
                const stableReadTime = 3 + (blog._id.charCodeAt(0) % 8);
                const stableViews = 100 + (blog._id.charCodeAt(0) % 900);
                
                return (
                  <BlogCard
                    key={`blog-${blog._id}`}
                    _id={blog._id}
                    author={blog.author}
                    category={blog.category}
                    createdAt={blog.createdAt}
                    description={blog.description}
                    imageUrl={blog.imageUrl}
                    rating={stableRating}
                    readTime={`${stableReadTime}`}
                    title={blog.title}
                    views={stableViews}
                  />
                );
              })}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center items-center gap-2 mt-12"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Button
                  className="border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
                  disabled={currentPage === 1}
                  variant="outline"
                  onClick={() => paginate(currentPage - 1)}
                >
                  Précédent
                </Button>
                
                <div className="flex items-center gap-1">
                  {getPageNumbers.map((page, index) => (
                    page === null ? (
                      <span key={`ellipsis-${currentPage}-${index}`} className="px-2 text-gray-500">...</span>
                    ) : (
                      <Button
                        key={`page-${page}-${currentPage}`}
                        className={
                          currentPage === page
                            ? "bg-violet-600 hover:bg-violet-700 text-white"
                            : "border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
                        }
                        size="sm"
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </Button>
                    )
                  ))}
                </div>
                
                <Button
                  className="border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
                  disabled={currentPage === totalPages}
                  variant="outline"
                  onClick={() => paginate(currentPage + 1)}
                >
                  Suivant
                </Button>
              </motion.div>
            )}

            {/* Message si aucun résultat */}
            {filteredBlogs.length === 0 && !loading && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Aucun article trouvé
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setSortBy("date");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            )}

            {/* Loading state */}
            {loading && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Chargement en cours...
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Veuillez patienter pendant que nous récupérons les articles
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

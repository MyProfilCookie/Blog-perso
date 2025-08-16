import dynamic from 'next/dynamic';
/* eslint-disable @next/next/no-img-element */
/* eslint-disable padding-line-between-statements */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import React from "react";
const motion = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion })), { ssr: false });
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
  List
} from "lucide-react";

import articlesData from "@/public/dataarticles.json";
import { title } from "@/components/primitives";

interface Article {
  id: number;
  title: string;
  subtitle: string;
  img: string;
  category?: string;
  author?: string;
  date?: string;
  content?: string;
}

interface ArticleCardProps {
  id: number;
  title: string;
  subtitle: string;
  img: string;
  category?: string;
  author?: string;
  date?: string;
  readTime?: string;
  views?: number;
  rating?: number;
}

const ArticleCard = ({ id, title, subtitle, img, category, author, date, readTime, views, rating }: ArticleCardProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="w-full mb-6"
    initial={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.02 }}
  >
    <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col h-full border border-gray-200 dark:border-gray-700 group">
      <Link className="block relative overflow-hidden h-[200px]" href={`/articles/${id}`}>
        <motion.img
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          src={img}
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
          {date && (
            <>
              <Calendar className="w-4 h-4" />
              <span>{new Date(date).toLocaleDateString('fr-FR')}</span>
            </>
          )}
        </div>
        <h4 className="text-xl font-bold text-gray-800 dark:text-white leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {title}
        </h4>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex-grow">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {subtitle}
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
        <Link className="block w-full" href={`/articles/${id}`}>
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

const ArticlesPage = () => {
  const [search, setSearch] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const articlesPerPage = 12;

  // Convertir les données d'articles au bon format
  const articles: Article[] = useMemo(() => articlesData.articles.map((article: any, index: number) => ({
    id: article.id || index,
    title: article.title || "",
    subtitle: article.subtitle || "",
    img: article.image || article.img || "",
    category: article.category || "",
    author: article.author || "",
    date: article.date || new Date().toISOString(),
    content: article.content || ""
  })), []);

  // Calcul pour la pagination
  const { indexOfLastArticle, indexOfFirstArticle, currentArticles, totalPages } = useMemo(() => {
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    return { indexOfLastArticle, indexOfFirstArticle, currentArticles, totalPages };
  }, [currentPage, filteredArticles, articlesPerPage]);

  // Statistiques simulées
  const stats = useMemo(() => ({
    totalArticles: articles.length,
    totalViews: 15420,
    totalLikes: 3240,
    averageRating: 4.6
  }), [articles.length]);

  // Catégories populaires
  const popularCategories = useMemo(() => [
    { name: "Autisme", count: 8, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { name: "Éducation", count: 12, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
    { name: "Santé", count: 6, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    { name: "Technologie", count: 4, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
    { name: "Lifestyle", count: 7, color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" }
  ], []);

  // Articles recommandés (simulés)
  const recommendedArticles = useMemo(() => articles.slice(0, 3).map((article) => ({
    ...article,
    readTime: 3 + (article.id % 8),
    views: 100 + (article.id % 900),
    rating: (3.5 + (article.id % 20) / 10).toFixed(1)
  })), [articles]);

  useEffect(() => {
    let filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.subtitle.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => 
        article.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "popularity":
          return 0; // Tri par popularité non disponible pour le moment
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy, articles]);

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
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-700 dark:to-purple-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
            className={`${title()} text-5xl md:text-6xl font-bold text-white mb-4`}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Articles et Astuces
          </motion.h1>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-violet-100 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Découvrez nos articles spécialisés sur l'autisme, l'éducation et le bien-être
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistiques */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-6">
            <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
              {stats.totalArticles}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Articles</div>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-6">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Vues</div>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.totalLikes.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-300">J'aime</div>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-6">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              {stats.averageRating}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Note moyenne</div>
          </Card>
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                placeholder="Rechercher un article..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="autisme">Autisme</SelectItem>
                <SelectItem value="education">Éducation</SelectItem>
                <SelectItem value="sante">Santé</SelectItem>
                <SelectItem value="technologie">Technologie</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Plus récents</SelectItem>
                <SelectItem value="title">Ordre alphabétique</SelectItem>
                <SelectItem value="popularity">Plus populaires</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
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
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Catégories populaires */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-violet-600" />
                Catégories populaires
              </h3>
              <div className="space-y-2">
                {popularCategories.map((category, index) => (
                  <motion.div
                    key={`category-${category.name}`}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                    <Badge className={category.color}>{category.count}</Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Articles recommandés */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Recommandés
              </h3>
              <div className="space-y-4">
                {recommendedArticles.map((article, index) => (
                  <motion.div
                    key={`recommended-${article.id}`}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/articles/${article.id}`}>
                      <div className="flex gap-3">
                        <img
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded-lg"
                          src={article.img}
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <Eye className="w-3 h-3" />
                            <span>{article.views || Math.floor((article.id % 900) + 100)}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{article.rating}</span>
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
              className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl p-6 text-white"
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <h3 className="text-lg font-semibold mb-2">Restez informé</h3>
              <p className="text-violet-100 text-sm mb-4">
                Recevez nos derniers articles directement dans votre boîte mail
              </p>
              <div className="space-y-3">
                <Input
                  className="bg-white/20 border-white/30 text-white placeholder:text-violet-200"
                  placeholder="Votre email"
                />
                <Button className="w-full bg-white text-violet-600 hover:bg-gray-100">
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
              className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                  : "grid-cols-1"
              }`}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {currentArticles.map((article, index) => {
                // Générer des valeurs stables pour éviter les problèmes de clés
                const stableRating = 3.5 + (article.id % 20) / 10;
                const stableReadTime = 3 + (article.id % 8);
                const stableViews = 100 + (article.id % 900);
                
                return (
                  <ArticleCard
                    key={`article-${article.id}`}
                    author={article.author}
                    category={article.category}
                    date={article.date}
                    id={article.id}
                    img={article.img}
                    rating={stableRating}
                    readTime={`${stableReadTime}`}
                    subtitle={article.subtitle}
                    title={article.title}
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
            {filteredArticles.length === 0 && (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;

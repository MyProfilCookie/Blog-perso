"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  Clock,
  TrendingUp,
  Newspaper,
  Sparkles,
  Filter,
  ChevronDown,
  BookOpen,
  X
} from "lucide-react";

// shadcn/ui components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AIAssistantPremium from "@/components/AIAssistantPremium";

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  author: string;
  date: string;
  readTimeMinutes?: number;
  tags?: string[];
}

export default function JournalPostsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("Tous");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [showAI, setShowAI] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/dataarticless.json");
        const data = await response.json();
        
        if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filtrage et tri des articles
  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Tous" || article.category === selectedCategory;
      const matchesAuthor = selectedAuthor === "Tous" || article.author === selectedAuthor;
      return matchesSearch && matchesCategory && matchesAuthor;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "readTime":
          return (a.readTimeMinutes || 0) - (b.readTimeMinutes || 0);
        default:
          return 0;
      }
    });

  const categories = ["Tous", ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))];
  const authors = ["Tous", ...Array.from(new Set(articles.map(a => a.author).filter(Boolean)))];
  
  // Article en vedette
  const featuredArticle = (searchTerm === "" && selectedCategory === "Tous" && selectedAuthor === "Tous") 
    ? filteredArticles[0] 
    : null;
  
  // Les autres articles
  const otherArticles = featuredArticle ? filteredArticles.slice(1) : filteredArticles;
  
  // Pagination
  const totalPages = Math.ceil(otherArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const paginatedArticles = otherArticles.slice(startIndex, endIndex);
  
  // Réinitialiser la page lors du changement de filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedAuthor, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Tous");
    setSelectedAuthor("Tous");
    setSortBy("recent");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header du journal */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Newspaper className="w-10 h-10 md:w-12 md:h-12 text-white" />
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Le Journal AutiStudy
              </h1>
            </div>
            <p className="text-blue-100 dark:text-blue-200 text-sm md:text-base">
              {new Date().toLocaleDateString("fr-FR", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barre de recherche et filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 space-y-4">
              {/* Recherche principale */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-600" />
                  <Input
                    placeholder="Rechercher un article..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <Button
                  variant={showAI ? "default" : "outline"}
                  onClick={() => setShowAI(!showAI)}
                  className="h-12"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Assistant IA
                </Button>
              </div>
              
              {/* Filtres avancés */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-11">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-violet-600" />
                        <span className="font-medium">Catégorie:</span>
                        <span className="text-violet-600 truncate">{selectedCategory}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {categories.map((cat) => (
                      <DropdownMenuItem
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-11">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-violet-600" />
                        <span className="font-medium">Auteur:</span>
                        <span className="text-violet-600 truncate">{selectedAuthor}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {authors.map((author) => (
                      <DropdownMenuItem
                        key={author}
                        onClick={() => setSelectedAuthor(author)}
                      >
                        {author}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-11">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-violet-600" />
                        <span className="font-medium">Trier:</span>
                        <span className="text-violet-600 truncate">
                          {sortBy === "recent" && "Plus récents"}
                          {sortBy === "oldest" && "Plus anciens"}
                          {sortBy === "title" && "A-Z"}
                          {sortBy === "readTime" && "Temps"}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => setSortBy("recent")}>
                      Plus récents
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      Plus anciens
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("title")}>
                      Titre (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("readTime")}>
                      Temps de lecture
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Badge de résultats et reset */}
              {(searchTerm || selectedCategory !== "Tous" || selectedAuthor !== "Tous") && (
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Badge variant="secondary" className="px-3 py-1">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {filteredArticles.length} résultat{filteredArticles.length > 1 ? "s" : ""}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={resetFilters}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Réinitialiser
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Assistant IA */}
        <AnimatePresence>
          {showAI && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <AIAssistantPremium />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Article en vedette */}
        {featuredArticle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-violet-600" />
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                À la Une
              </h2>
            </div>
            
            <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-gray-200 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-80 md:h-auto w-full">
                  <Image
                    src={featuredArticle.image || featuredArticle.imageUrl || "/assets/default.webp"}
                    alt={featuredArticle.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-violet-600 text-white">
                      <Tag className="w-3 h-3 mr-1" />
                      {featuredArticle.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-8 flex flex-col justify-center">
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                    {featuredArticle.title}
                  </h3>
                  {featuredArticle.subtitle && (
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                      {featuredArticle.subtitle}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredArticle.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                    {featuredArticle.readTimeMinutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredArticle.readTimeMinutes} min</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    <Link href={`/posts/${featuredArticle.id}`}>
                      <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                        Lire l'article
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Grille d'articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            {searchTerm || selectedCategory !== "Tous" ? "Résultats" : "Derniers Articles"}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Aucun article trouvé
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/posts/${article.id}`}>
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-gray-200 dark:border-gray-700">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={article.image || article.imageUrl || "/assets/default.webp"}
                          alt={article.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-violet-600 text-white text-xs">
                            {article.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-5">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {article.subtitle || ""}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                          </div>
                          {article.readTimeMinutes && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTimeMinutes} min</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-center items-center gap-4 py-8"
          >
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                  return false;
                })
                .map((page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="px-2">...</span>
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-violet-600 hover:bg-violet-700" : ""}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-violet-600 hover:bg-violet-700" : ""}
                    >
                      {page}
                    </Button>
                  );
                })}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                Articles {startIndex + 1} - {Math.min(endIndex, otherArticles.length)} sur {otherArticles.length}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
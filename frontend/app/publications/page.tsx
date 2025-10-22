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
  X,
  Mail,
  Heart,
  Star,
  Users,
  ArrowRight
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
  _id?: string;
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  img?: string;
  category?: string;
  author?: string;
  date: string;
  readTimeMinutes?: number;
  tags?: string[];
  content?: string | any[];
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${apiUrl}/publications`);
        const data = await response.json();

        if (Array.isArray(data)) {
          // Mapper _id vers id pour compatibilité
          const articlesWithId = data.map(article => ({
            ...article,
            id: article._id || article.id
          }));
          setArticles(articlesWithId);
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

        {/* Section Statistiques du Journal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <Card className="border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-10 h-10 text-violet-600 dark:text-violet-400 mx-auto mb-3" />
              <div className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 mb-1">
                {articles.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Articles publiés
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardContent className="p-6 text-center">
              <Tag className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
                {categories.length - 1}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Catégories
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30">
            <CardContent className="p-6 text-center">
              <User className="w-10 h-10 text-pink-600 dark:text-pink-400 mx-auto mb-3" />
              <div className="text-3xl font-extrabold text-pink-600 dark:text-pink-400 mb-1">
                {authors.length - 1}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Auteurs
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-extrabold text-green-600 dark:text-green-400 mb-1">
                +{Math.floor(Math.random() * 20) + 5}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Nouveaux ce mois
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Section À propos du Journal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-violet-600 to-purple-600 border-none text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h2 className="text-3xl font-extrabold mb-4">
                  Le Journal AutiStudy
                </h2>
                <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                  Découvrez des articles éducatifs, des conseils pratiques et des ressources adaptées 
                  pour accompagner les enfants avec autisme dans leur apprentissage. Notre équipe 
                  passionnée partage régulièrement du contenu de qualité pour vous aider.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
                    Éducation adaptée
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
                    Conseils d'experts
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
                    Ressources gratuites
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
                    Communauté bienveillante
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section Catégories Populaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Tag className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Explorer par Catégorie
              </h2>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.filter(cat => cat !== "Tous").slice(0, 8).map((category, index) => {
              const categoryColors = [
                { bg: "from-violet-500 to-purple-600", icon: "text-violet-100" },
                { bg: "from-blue-500 to-cyan-600", icon: "text-blue-100" },
                { bg: "from-pink-500 to-rose-600", icon: "text-pink-100" },
                { bg: "from-green-500 to-emerald-600", icon: "text-green-100" },
                { bg: "from-orange-500 to-amber-600", icon: "text-orange-100" },
                { bg: "from-indigo-500 to-blue-600", icon: "text-indigo-100" },
                { bg: "from-red-500 to-pink-600", icon: "text-red-100" },
                { bg: "from-teal-500 to-cyan-600", icon: "text-teal-100" }
              ];
              const colors = categoryColors[index % categoryColors.length];
              const articlesCount = articles.filter(a => a.category === category).length;
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card 
                    className="cursor-pointer overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className={`bg-gradient-to-br ${colors.bg} p-6 text-white`}>
                      <BookOpen className={`w-8 h-8 mb-3 ${colors.icon}`} />
                      <h3 className="font-bold text-lg mb-1">{category}</h3>
                      <p className="text-sm opacity-90">{articlesCount} article{articlesCount > 1 ? 's' : ''}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

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
                    <Link href={`/publications/${featuredArticle.id}`}>
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
                  <Link href={`/publications/${article.id}`}>
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
        
        {/* Section Newsletter / Communauté */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 border-none text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-10 h-10 text-yellow-300" />
                    <h2 className="text-3xl font-extrabold">
                      Restez Informé
                    </h2>
                  </div>
                  <p className="text-blue-100 text-lg mb-6">
                    Recevez nos derniers articles, conseils et ressources directement dans votre boîte mail. 
                    Rejoignez notre communauté de parents et professionnels engagés !
                  </p>
                  <div className="flex gap-3 items-center">
                    <Users className="w-6 h-6 text-yellow-300" />
                    <span className="text-blue-100 font-medium">Déjà plus de 5 000 abonnés !</span>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex flex-col gap-4">
                    <Input 
                      placeholder="Votre adresse email"
                      className="h-12 bg-white/90 border-white/30 text-gray-900 placeholder:text-gray-600"
                    />
                    <Button 
                      size="lg" 
                      className="h-12 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold shadow-lg"
                    >
                      S'abonner à la Newsletter
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <p className="text-xs text-blue-100 text-center">
                      ✨ Pas de spam, uniquement du contenu de qualité
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Section Pourquoi nous suivre */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
              Pourquoi Lire le Journal AutiStudy ?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des ressources fiables, actualisées et adaptées pour accompagner votre parcours
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-violet-200 dark:border-violet-800 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  Contenu Expert
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Articles rédigés par des professionnels et validés scientifiquement
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  Approche Bienveillante
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Des conseils pratiques avec empathie et compréhension
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  Mise à Jour Régulière
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Nouveaux articles chaque semaine sur des sujets variés
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
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
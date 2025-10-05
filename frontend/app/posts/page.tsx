"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Input, Chip, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
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
  BookOpen
} from "lucide-react";
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
  
  // Article en vedette (le premier des résultats filtrés si aucun filtre actif)
  const featuredArticle = (searchTerm === "" && selectedCategory === "Tous" && selectedAuthor === "Tous") 
    ? filteredArticles[0] 
    : null;
  
  // Les autres articles (exclure l'article en vedette)
  const otherArticles = featuredArticle ? filteredArticles.slice(1) : filteredArticles;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header du journal */}
      <div className="bg-white dark:bg-gray-900 border-b-4 border-violet-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Newspaper className="w-10 h-10 text-violet-600" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Le Journal AutiStudy
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-light">
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
        {/* Barre de recherche et filtres avancés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700">
            {/* Recherche principale */}
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                className="flex-1"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<Search className="w-5 h-5 text-violet-600" />}
                size="lg"
                classNames={{
                  input: "text-base",
                  inputWrapper: "h-12 bg-gray-50 dark:bg-gray-900"
                }}
              />
              <Button
                color="secondary"
                variant={showAI ? "solid" : "flat"}
                onClick={() => setShowAI(!showAI)}
                startContent={<Sparkles className="w-5 h-5" />}
                size="lg"
                className="h-12"
              >
                Assistant IA
              </Button>
            </div>
            
            {/* Filtres avancés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="w-full justify-between bg-gray-50 dark:bg-gray-900"
                    endContent={<ChevronDown className="w-4 h-4" />}
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-violet-600" />
                      <span className="font-medium">Catégorie:</span>
                      <span className="text-violet-600 truncate">{selectedCategory}</span>
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Catégories"
                  onAction={(key) => setSelectedCategory(key as string)}
                  selectedKeys={[selectedCategory]}
                  selectionMode="single"
                >
                  {categories.map((cat) => (
                    <DropdownItem key={cat}>{cat}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="w-full justify-between bg-gray-50 dark:bg-gray-900"
                    endContent={<ChevronDown className="w-4 h-4" />}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-violet-600" />
                      <span className="font-medium">Auteur:</span>
                      <span className="text-violet-600 truncate">{selectedAuthor}</span>
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Auteurs"
                  onAction={(key) => setSelectedAuthor(key as string)}
                  selectedKeys={[selectedAuthor]}
                  selectionMode="single"
                >
                  {authors.map((author) => (
                    <DropdownItem key={author}>{author}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="w-full justify-between bg-gray-50 dark:bg-gray-900"
                    endContent={<ChevronDown className="w-4 h-4" />}
                  >
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
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Trier"
                  onAction={(key) => setSortBy(key as string)}
                  selectedKeys={[sortBy]}
                  selectionMode="single"
                >
                  <DropdownItem key="recent">Plus récents</DropdownItem>
                  <DropdownItem key="oldest">Plus anciens</DropdownItem>
                  <DropdownItem key="title">Titre (A-Z)</DropdownItem>
                  <DropdownItem key="readTime">Temps de lecture</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            
            {/* Badge de résultats et reset */}
            {(searchTerm || selectedCategory !== "Tous" || selectedAuthor !== "Tous") && (
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Chip
                  color="primary"
                  variant="flat"
                  size="md"
                  startContent={<BookOpen className="w-4 h-4" />}
                >
                  {filteredArticles.length} résultat{filteredArticles.length > 1 ? "s" : ""}
                </Chip>
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Tous");
                    setSelectedAuthor("Tous");
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            )}
          </div>
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
            
            <Card className="hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <CardBody className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-80 md:h-auto">
                    <Image
                      src={featuredArticle.image || featuredArticle.imageUrl || "/assets/default.webp"}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute top-4 left-4">
                      <Chip
                        className="bg-violet-600 text-white font-semibold"
                        startContent={<Tag className="w-4 h-4" />}
                      >
                        {featuredArticle.category}
                      </Chip>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                      {featuredArticle.title}
                    </h3>
                    {featuredArticle.subtitle && (
                      <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 font-light">
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
                      <Button
                        as={Link}
                        href={`/posts/${featuredArticle.id}`}
                        color="primary"
                        size="lg"
                        className="font-semibold"
                      >
                        Lire l'article
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Grille d'articles */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            {searchTerm || selectedCategory !== "Tous" ? "Résultats" : "Derniers Articles"}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Aucun article trouvé
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/posts/${article.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      <CardBody className="p-0">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={article.image || article.imageUrl || "/assets/default.webp"}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <Chip
                              size="sm"
                              className="bg-violet-600 text-white font-semibold"
                            >
                              {article.category}
                            </Chip>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors tracking-tight">
                            {article.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 font-light">
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
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

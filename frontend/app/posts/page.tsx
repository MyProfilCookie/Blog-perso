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
  ChevronDown
} from "lucide-react";
import AIAssistant from "@/components/AIAssistant";

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
  readTimeMinutes: number;
  tags?: string[];
}

export default function JournalPostsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [showAI, setShowAI] = useState(false);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/dataarticless.json");
        const data = await response.json();
        
        if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
          // Premier article comme featured
          if (data.articles.length > 0) {
            setFeaturedArticle(data.articles[0]);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Tous", ...Array.from(new Set(articles.map(a => a.category)))];

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
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white">
                Le Journal AutiStudy
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-serif italic">
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
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <Input
            className="flex-1"
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search className="w-5 h-5 text-gray-400" />}
            classNames={{
              input: "text-gray-900 dark:text-white",
              inputWrapper: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
            }}
          />
          
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                endContent={<ChevronDown className="w-4 h-4" />}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                {selectedCategory}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Catégories"
              onAction={(key) => setSelectedCategory(key as string)}
            >
              {categories.map((cat) => (
                <DropdownItem key={cat}>{cat}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Button
            color="secondary"
            variant={showAI ? "solid" : "flat"}
            onClick={() => setShowAI(!showAI)}
            startContent={<Sparkles className="w-4 h-4" />}
          >
            Assistant IA
          </Button>
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
              <AIAssistant />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Article en vedette */}
        {featuredArticle && !searchTerm && selectedCategory === "Tous" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-violet-600" />
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                À la Une
              </h2>
            </div>
            
            <Link href={`/posts/${featuredArticle.id}`}>
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
                <CardBody className="p-0">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-80 md:h-auto">
                      <Image
                        src={featuredArticle.imageUrl}
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
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                        {featuredArticle.title}
                      </h3>
                      {featuredArticle.subtitle && (
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 font-serif italic">
                          {featuredArticle.subtitle}
                        </p>
                      )}
                      <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3">
                        {featuredArticle.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{featuredArticle.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(featuredArticle.date).toLocaleDateString("fr-FR")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{featuredArticle.readTimeMinutes} min</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button
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
            </Link>
          </motion.div>
        )}

        {/* Grille d'articles */}
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
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
              {filteredArticles.slice(featuredArticle ? 1 : 0).map((article, index) => (
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
                            src={article.imageUrl}
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
                          <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                            {article.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                            {article.description || article.subtitle}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTimeMinutes} min</span>
                            </div>
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

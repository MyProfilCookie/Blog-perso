"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Badge, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Download, 
  Copy, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp,
  Database,
  FileText,
  ExternalLink,
  Calendar,
  User,
  Tag,
  BookOpen,
  ArrowRight,
  Search,
  Filter,
  Grid3X3,
  List
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  img?: string;
  category?: string;
  author?: string;
  date?: string;
  content?: string;
  [key: string]: any;
}

export default function PostsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
  const [showJson, setShowJson] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://blog-perso.onrender.com/api';
  // Utiliser toujours les données locales du fichier dataarticless.json
  const shouldUseLocalData = true;

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Debug Posts Page:');
      console.log('- baseUrl:', baseUrl);
      console.log('- shouldUseLocalData:', shouldUseLocalData);
      console.log('- NODE_ENV:', process.env.NODE_ENV);

      if (baseUrl && !shouldUseLocalData) {
        console.log('📡 Tentative d\'appel API:', `${baseUrl}/articles`);
        const response = await fetch(`${baseUrl}/articles`);
        console.log('📡 Réponse API:', response.status, response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📡 Données reçues:', Array.isArray(data) ? `${data.length} articles` : 'Pas un tableau');
          // S'assurer que les données sont un tableau
          const articlesArray = Array.isArray(data) ? data : [];
          setArticles(articlesArray);
          return;
        }
      }

      // Fallback vers les données locales
      console.log('📁 Fallback vers données locales: /dataarticless.json');
      const localResponse = await fetch('/dataarticless.json');
      if (localResponse.ok) {
        const localData = await localResponse.json();
        console.log('📁 Données locales reçues:', localData);
        // Le fichier dataarticless.json a une structure { articles: [...] }
        const articlesArray = Array.isArray(localData.articles) ? localData.articles : [];
        console.log('📁 Articles extraits:', `${articlesArray.length} articles`);
        setArticles(articlesArray);
      } else {
        throw new Error('Impossible de charger les données');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des articles:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.subtitle && article.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (article.author && article.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredArticles(filtered);
  }, [articles, searchTerm]);

  const toggleExpanded = (articleId: string) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId);
    } else {
      newExpanded.add(articleId);
    }
    setExpandedArticles(newExpanded);
  };

  const copyToClipboard = async (data: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      alert('JSON copié dans le presse-papiers !');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      alert('Erreur lors de la copie');
    }
  };

  const downloadJson = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des articles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardBody className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 text-lg">Erreur : {error}</p>
              <Button 
                color="danger" 
                variant="flat" 
                className="mt-4"
                onClick={fetchArticles}
              >
                Réessayer
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const resolveImagePath = (imagePath: string) => {
    if (imagePath?.startsWith('http')) return imagePath;
    if (imagePath?.startsWith('/')) return imagePath;
    return `/assets/couvertures/${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Posts Data
            </h1>
            <p className="text-xl text-violet-100 max-w-3xl mx-auto mb-8">
              Lisez et explorez vos articles avec une interface moderne et intuitive
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-violet-200">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                <span>{articles.length} articles</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Lecture intégrée</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Contenu structuré</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search and Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardBody className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher dans les articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid" 
                          ? "bg-white dark:bg-gray-600 shadow-sm" 
                          : "hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list" 
                          ? "bg-white dark:bg-gray-600 shadow-sm" 
                          : "hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* JSON Toggle */}
                  <Button
                    color={showJson ? "danger" : "secondary"}
                    variant="flat"
                    startContent={showJson ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    onClick={() => setShowJson(!showJson)}
                    size="sm"
                  >
                    {showJson ? 'Masquer JSON' : 'Afficher JSON'}
                  </Button>

                  {/* Link to Articles */}
                  <Link href="/articles">
                    <Button
                      color="default"
                      variant="flat"
                      startContent={<ExternalLink className="w-4 h-4" />}
                      size="sm"
                    >
                      Voir articles
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Database className="w-4 h-4" />
                  <span>{filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}</span>
                </div>
                {searchTerm && (
                  <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400">
                    <Filter className="w-4 h-4" />
                    <span>Filtré par: "{searchTerm}"</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Articles Grid/List */}
        {filteredArticles.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardBody className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? `Aucun résultat pour "${searchTerm}"` : "Aucun article disponible"}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-6"
          }>
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={resolveImagePath(article.image || article.img || '/assets/couvertures/default.webp')}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Chip size="sm" color="primary" variant="solid">
                        ID: {article.id}
                      </Chip>
                    </div>
                  </div>

                  <CardBody className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {article.title || 'Titre non disponible'}
                    </h3>

                    {/* Subtitle */}
                    {article.subtitle && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {article.subtitle}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
                      {article.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{article.author}</span>
                        </div>
                      )}
                      {article.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(article.date)}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <Link href={`/posts/${article.id}`} className="flex-1">
                        <Button
                          color="primary"
                          variant="flat"
                          size="sm"
                          startContent={<BookOpen className="w-4 h-4" />}
                          className="w-full"
                        >
                          Lire l'article
                        </Button>
                      </Link>
                      
                      <Button
                        color="secondary"
                        variant="flat"
                        size="sm"
                        startContent={expandedArticles.has(article.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        onClick={() => toggleExpanded(article.id)}
                        className="flex-1"
                      >
                        {expandedArticles.has(article.id) ? 'Réduire' : 'Aperçu'}
                      </Button>
                      
                      {showJson && (
                        <Button
                          color="default"
                          variant="flat"
                          size="sm"
                          startContent={<Copy className="w-4 h-4" />}
                          onClick={() => copyToClipboard(article)}
                          className="flex-1"
                        >
                          Copier JSON
                        </Button>
                      )}
                    </div>
                  </CardBody>

                  {/* Article Content */}
                  {expandedArticles.has(article.id) && (
                    <CardBody className="pt-0 px-6 pb-6">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Contenu de l'article
                        </h4>
                        
                        {/* Article Content */}
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                          {Array.isArray(article.content) ? (
                            article.content.map((block: any, blockIndex: number) => {
                              if (block.type === 'paragraph') {
                                return (
                                  <p key={blockIndex} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                    {block.text}
                                  </p>
                                );
                              } else if (block.type === 'subtitle') {
                                return (
                                  <h3 key={blockIndex} className="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                                    {block.text}
                                  </h3>
                                );
                              } else if (block.type === 'image') {
                                return (
                                  <div key={blockIndex} className="my-6">
                                    <Image
                                      src={resolveImagePath(block.src)}
                                      alt={block.alt || 'Image de l\'article'}
                                      width={600}
                                      height={400}
                                      className="rounded-lg shadow-md mx-auto"
                                    />
                                    {block.alt && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 italic">
                                        {block.alt}
                                      </p>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            })
                          ) : (
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {article.content || 'Aucun contenu disponible'}
                            </div>
                          )}
                        </div>

                        {/* JSON Toggle */}
                        {showJson && (
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="text-md font-medium text-gray-900 dark:text-white">
                                Données JSON
                              </h5>
                              <Button
                                size="sm"
                                variant="flat"
                                color="secondary"
                                startContent={<Copy className="w-4 h-4" />}
                                onClick={() => copyToClipboard(article)}
                              >
                                Copier JSON
                              </Button>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-4 overflow-hidden">
                              <pre className="text-green-400 text-xs overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
                                {JSON.stringify(article, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

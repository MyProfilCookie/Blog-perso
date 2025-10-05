"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { 
  Download, 
  Copy, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp,
  Database,
  FileText,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

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
  const [showJson, setShowJson] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const shouldUseLocalData = process.env.NODE_ENV === 'production' && 
    (baseUrl?.includes('localhost') || baseUrl?.includes('render.com'));

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      if (baseUrl && !shouldUseLocalData) {
        const response = await fetch(`${baseUrl}/articles`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
          return;
        }
      }

      // Fallback vers les données locales
      const localResponse = await fetch('/dataarticles.json');
      if (localResponse.ok) {
        const localData = await localResponse.json();
        setArticles(localData);
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

  const downloadAllArticles = () => {
    downloadJson(articles, `all-articles-${new Date().toISOString().split('T')[0]}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Posts Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Visualisez et téléchargez les données JSON de tous vos articles
          </p>
        </motion.div>

        {/* Actions Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardBody className="p-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Database className="w-4 h-4" />
                    <span>{articles.length} articles trouvés</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="w-4 h-4" />
                    <span>Source: {baseUrl && !shouldUseLocalData ? 'Base de données' : 'Données locales'}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={showJson ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    onClick={() => setShowJson(!showJson)}
                    size="sm"
                  >
                    {showJson ? 'Masquer JSON' : 'Afficher JSON'}
                  </Button>
                  
                  <Button
                    color="secondary"
                    variant="flat"
                    startContent={<Download className="w-4 h-4" />}
                    onClick={downloadAllArticles}
                    size="sm"
                  >
                    Télécharger tout
                  </Button>

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
            </CardBody>
          </Card>
        </motion.div>

        {/* Articles List */}
        <div className="space-y-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {article.title || 'Titre non disponible'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>ID: {article.id}</span>
                        {article.category && <span>• Catégorie: {article.category}</span>}
                        {article.author && <span>• Auteur: {article.author}</span>}
                        {article.date && <span>• {new Date(article.date).toLocaleDateString('fr-FR')}</span>}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        startContent={<Copy className="w-4 h-4" />}
                        onClick={() => copyToClipboard(article)}
                      >
                        Copier
                      </Button>
                      
                      <Button
                        color="secondary"
                        variant="flat"
                        size="sm"
                        startContent={<Download className="w-4 h-4" />}
                        onClick={() => downloadJson(article, `article-${article.id}`)}
                      >
                        Télécharger
                      </Button>
                      
                      {showJson && (
                        <Button
                          color="default"
                          variant="flat"
                          size="sm"
                          startContent={expandedArticles.has(article.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          onClick={() => toggleExpanded(article.id)}
                        >
                          {expandedArticles.has(article.id) ? 'Réduire' : 'Développer'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {showJson && (
                  <CardBody className="pt-0">
                    <div className="bg-gray-900 rounded-lg p-4 overflow-hidden">
                      <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                        {expandedArticles.has(article.id) 
                          ? JSON.stringify(article, null, 2)
                          : JSON.stringify(article, null, 2).substring(0, 200) + '...'
                        }
                      </pre>
                    </div>
                  </CardBody>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {articles.length === 0 && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <CardBody className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">Aucun article trouvé</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

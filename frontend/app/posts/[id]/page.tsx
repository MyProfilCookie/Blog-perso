"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar,
  User,
  ArrowLeft,
  Share2,
  BookOpen,
  Clock,
  Tag
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

// shadcn/ui components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  img?: string;
  category?: string;
  author?: string;
  date?: string;
  content?: string | any[];
  [key: string]: any;
}

export default function PostPage() {
  const params = useParams();
  const articleId = params.id as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/dataarticless.json');
      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data.articles)) {
          const foundArticle = data.articles.find((art: Article) => art.id.toString() === articleId);
          
          if (foundArticle) {
            setArticle(foundArticle);
          } else {
            setError('Article non trouvé');
          }
        } else {
          setError('Format de données invalide');
        }
      } else {
        setError('Impossible de charger les données');
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'article:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

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

  const calculateReadingTime = (content: any) => {
    let textLength = 0;
    if (Array.isArray(content)) {
      textLength = content
        .filter(block => block.type === 'paragraph')
        .reduce((acc, block) => acc + (block.text?.length || 0), 0);
    } else if (typeof content === 'string') {
      textLength = content.length;
    }
    
    const wordsPerMinute = 200;
    const avgCharsPerWord = 5;
    const words = textLength / avgCharsPerWord;
    const minutes = Math.ceil(words / wordsPerMinute);
    
    return minutes;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.subtitle,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-red-200 dark:border-red-800">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Article non trouvé
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'L\'article demandé n\'existe pas.'}
            </p>
            <Link href="/posts">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux articles
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative w-full px-4 md:px-8 lg:px-12 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link href="/posts" className="inline-flex items-center text-blue-100 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux articles
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight w-full">
              {article.title || 'Titre non disponible'}
            </h1>

            {/* Subtitle */}
            {article.subtitle && (
              <p className="text-xl text-blue-100 mb-8 w-full">
                {article.subtitle}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap justify-center gap-6 text-blue-100">
              {article.author && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{article.author}</span>
                </div>
              )}
              {article.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(article.date)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{calculateReadingTime(article.content)} min de lecture</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article Content */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-gray-200 dark:border-gray-700 overflow-hidden w-full">
            {/* Featured Image */}
            {(article.image || article.img) && (
              <div className="relative h-80 sm:h-96 lg:h-[500px] w-full">
                <Image
                  src={resolveImagePath(article.image || article.img || '')}
                  alt={article.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <CardContent className="p-6 md:p-10 lg:p-16">
              {/* Article Content */}
              <div className="prose prose-lg prose-gray dark:prose-invert max-w-none w-full">
                {Array.isArray(article.content) ? (
                  article.content.map((block: any, blockIndex: number) => {
                    if (block.type === 'paragraph') {
                      return (
                        <p key={blockIndex} className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                          {block.text}
                        </p>
                      );
                    } else if (block.type === 'subtitle') {
                      return (
                        <h2 key={blockIndex} className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                          {block.text}
                        </h2>
                      );
                    } else if (block.type === 'image') {
                      return (
                        <div key={blockIndex} className="my-8">
                          <div className="relative w-full h-96">
                            <Image
                              src={resolveImagePath(block.src)}
                              alt={block.alt || 'Image de l\'article'}
                              fill
                              sizes="(max-width: 1280px) 100vw, 1280px"
                              className="rounded-lg object-cover"
                            />
                          </div>
                          {block.alt && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3 italic">
                              {block.alt}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })
                ) : (
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {article.content || 'Aucun contenu disponible'}
                  </div>
                )}
              </div>

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {article.category && (
                      <Badge variant="secondary">
                        <Tag className="w-3 h-3 mr-1" />
                        {article.category}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <BookOpen className="w-3 h-3 mr-1" />
                      ID: {article.id}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                    
                    <Link href="/posts">
                      <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
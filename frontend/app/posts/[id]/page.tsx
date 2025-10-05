"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Badge } from "@nextui-org/react";
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

      console.log('🔍 Fetching article with ID:', articleId);
      
      // Charger tous les articles depuis dataarticless.json
      const response = await fetch('/dataarticless.json');
      if (response.ok) {
        const data = await response.json();
        console.log('📁 Data loaded:', data);
        
        if (Array.isArray(data.articles)) {
          const foundArticle = data.articles.find((art: Article) => art.id.toString() === articleId);
          console.log('📄 Found article:', foundArticle);
          
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
    
    // Estimation: 200 mots par minute, 5 caractères par mot en moyenne
    const wordsPerMinute = 200;
    const avgCharsPerWord = 5;
    const words = textLength / avgCharsPerWord;
    const minutes = Math.ceil(words / wordsPerMinute);
    
    return minutes;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de l'article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full px-4 py-8">
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 max-w-2xl mx-auto">
            <CardBody className="text-center py-12">
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Article non trouvé
              </h1>
              <p className="text-red-600 dark:text-red-400 mb-6">
                {error || 'L\'article demandé n\'existe pas.'}
              </p>
              <Link href="/posts">
                <Button color="primary" variant="flat" startContent={<ArrowLeft className="w-4 h-4" />}>
                  Retour aux articles
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative w-full px-4 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Breadcrumb */}
              <div className="mb-6">
                <Link href="/posts" className="inline-flex items-center text-violet-200 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux articles
                </Link>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {article.title || 'Titre non disponible'}
              </h1>

              {/* Subtitle */}
              {article.subtitle && (
                <p className="text-xl text-violet-100 mb-8 max-w-3xl mx-auto">
                  {article.subtitle}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap justify-center gap-6 text-violet-200">
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
      </div>

      {/* Article Content */}
      <div className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              {/* Featured Image */}
              {(article.image || article.img) && (
                <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-t-lg">
                  <Image
                    src={resolveImagePath(article.image || article.img || '')}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <CardBody className="p-8">
                {/* Article Content */}
                <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
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
                          <h2 key={blockIndex} className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                            {block.text}
                          </h2>
                        );
                      } else if (block.type === 'image') {
                        return (
                          <div key={blockIndex} className="my-8">
                            <Image
                              src={resolveImagePath(block.src)}
                              alt={block.alt || 'Image de l\'article'}
                              width={800}
                              height={600}
                              className="rounded-lg shadow-lg mx-auto"
                            />
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
                        <Badge color="primary" variant="flat" startContent={<Tag className="w-3 h-3" />}>
                          {article.category}
                        </Badge>
                      )}
                      <Badge color="secondary" variant="flat" startContent={<BookOpen className="w-3 h-3" />}>
                        ID: {article.id}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        startContent={<Share2 className="w-4 h-4" />}
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: article.title,
                              text: article.subtitle,
                              url: window.location.href,
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Lien copié dans le presse-papiers !');
                          }
                        }}
                      >
                        Partager
                      </Button>
                      
                      <Link href="/posts">
                        <Button color="default" variant="flat" size="sm" startContent={<ArrowLeft className="w-4 h-4" />}>
                          Retour
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

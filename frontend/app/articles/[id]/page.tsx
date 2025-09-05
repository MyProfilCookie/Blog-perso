"use client";
import dynamic from 'next/dynamic';
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardBody, CardHeader, Button, Badge, Chip } from '@nextui-org/react';
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  ArrowLeft, 
  BookOpen,
  Tag,
  MessageCircle
} from "lucide-react";

import { title, subtitle } from "@/components/primitives";
import articlesData from "@/public/dataarticles.json";

interface Article {
  id: number;
  title: string;
  subtitle: string;
  img?: string;
  image?: string;
  category?: string;
  author?: string;
  date?: string;
  content?: string;
}

// Fonction pour transformer la date au format "YYYY-MM-DD" en "DD Month YYYY"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  return date.toLocaleDateString('fr-FR', options);
};


const ArticlePage = () => {
  const params = useParams() as { id: string | string[] };
  const articleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = () => {
      try {
        const articles = articlesData.articles;
        const foundArticle = articles.find((article: Article) => article.id === parseInt(articleId, 10));

        setArticle(foundArticle || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <Link href="/articles">
          <Button className="mt-4 text-white bg-violet-600 hover:bg-violet-700">
            Retour à la liste des articles
          </Button>
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Article non trouvé</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/articles">
          <Button className="mt-4 text-white bg-violet-600 hover:bg-violet-700">
            Retour à la liste des articles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header avec navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/articles">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux articles
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="ghost"
                className="text-gray-600 dark:text-gray-300 hover:text-red-500"
              >
                <Heart className="w-4 h-4" />
              </Button>
              <Button
                isIconOnly
                variant="ghost"
                className="text-gray-600 dark:text-gray-300 hover:text-violet-600"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {/* En-tête de l'article */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                {article.category && (
                  <Badge 
                    color="primary" 
                    variant="flat"
                    className="text-xs"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {article.category}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                {article.title}
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {article.subtitle}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{article.author || 'Équipe AutiStudy'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date ? formatDate(article.date) : 'Date non disponible'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.ceil((article.content?.length || 0) / 1000)} min de lecture</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 500) + 100} vues</span>
                </div>
              </div>
            </motion.div>

            {/* Image principale */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  alt={article.title}
                  className="object-cover w-full h-[300px] sm:h-[400px] lg:h-[500px]"
                  height={500}
                  width={1200}
                  src={article.img || article.image || "/assets/default-image.webp"}
                  priority
                  quality={95}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 900px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>

            {/* Contenu de l'article */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
                <CardBody className="p-6 sm:p-8 lg:p-10">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {article.content ? article.content.split('\n').map((paragraph, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-justify"
                      >
                        {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                          part.startsWith('**') ? (
                            <strong key={i} className="text-violet-600 dark:text-violet-400 font-semibold">
                              {part.slice(2, -2)}
                            </strong>
                          ) : part
                        )}
                      </motion.p>
                    )) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        Contenu de l'article en cours de chargement...
                      </motion.p>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Actions en bas d'article */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <Button
                  color="danger"
                  variant="bordered"
                  startContent={<Heart className="w-4 h-4" />}
                  className="hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  J'aime
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  startContent={<Share2 className="w-4 h-4" />}
                >
                  Partager
                </Button>
                <Button
                  color="secondary"
                  variant="bordered"
                  startContent={<MessageCircle className="w-4 h-4" />}
                >
                  Commenter
                </Button>
              </div>
              
              <Link href="/articles">
                <Button
                  color="primary"
                  variant="solid"
                  startContent={<ArrowLeft className="w-4 h-4" />}
                >
                  Autres articles
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Auteur */}
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    À propos de l'auteur
                  </h3>
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {article.author || 'Équipe AutiStudy'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Expert en autisme
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Spécialiste de l'accompagnement des enfants autistes avec plus de 10 ans d'expérience.
                  </p>
                </CardBody>
              </Card>

              {/* Articles similaires */}
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Articles similaires
                  </h3>
                </CardHeader>
                <CardBody className="pt-0 space-y-4">
                  {articlesData.articles
                    .filter((a: any) => a.id !== article.id && a.category === article.category)
                    .slice(0, 3)
                    .map((relatedArticle: any) => (
                      <Link key={relatedArticle.id} href={`/articles/${relatedArticle.id}`}>
                        <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0">
                            <Image
                              src={relatedArticle.image || relatedArticle.img || "/assets/default-image.webp"}
                              alt={relatedArticle.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                              {relatedArticle.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {relatedArticle.date ? formatDate(relatedArticle.date) : 'Date non disponible'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </CardBody>
              </Card>

              {/* Statistiques */}
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Statistiques
                  </h3>
                </CardHeader>
                <CardBody className="pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Vues</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Math.floor(Math.random() * 500) + 100}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Temps de lecture</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Math.ceil((article.content?.length || 0) / 1000)} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Catégorie</span>
                    <Chip size="sm" color="primary" variant="flat">
                      {article.category || 'Général'}
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;

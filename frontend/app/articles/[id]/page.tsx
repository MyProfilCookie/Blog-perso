"use client";
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */

import React from "react";
import { useParams, useRouter } from "next/navigation";
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
  Tag,
  MessageCircle
} from "lucide-react";

import articlesData from "@/public/dataarticles.json";

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  author?: string;
  date?: string;
  image?: string;
  img?: string;
  content?: string;
}

const sanitizeContent = (rawContent: unknown): string => {
  if (Array.isArray(rawContent)) {
    return rawContent
      .map((block) => {
        if (typeof block === "string") {
          return block;
        }
        if (block && typeof block === "object") {
          if (typeof (block as { text?: string }).text === "string") {
            return (block as { text: string }).text;
          }
          if (typeof (block as { content?: string }).content === "string") {
            return (block as { content: string }).content;
          }
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }

  if (typeof rawContent === "string") {
    return rawContent;
  }

  if (rawContent && typeof rawContent === "object") {
    const maybeText = (rawContent as { text?: string; content?: string }).text ?? (rawContent as { content?: string }).content;
    if (typeof maybeText === "string") {
      return maybeText;
    }
  }

  return "";
};

const DEFAULT_ARTICLE_IMAGE = "/assets/default-image.webp";

const resolveImagePath = (value?: string | null): string => {
  if (!value || typeof value !== "string") {
    return DEFAULT_ARTICLE_IMAGE;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_ARTICLE_IMAGE;
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }

  const normalized = trimmed.replace(/^\.\/?/, "");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

const normalizeArticleData = (raw: any): Article | null => {
  if (!raw) {
    return null;
  }

  const identifier = raw._id ?? raw.id ?? raw.slug;
  if (identifier === undefined || identifier === null) {
    return null;
  }

  const image = resolveImagePath(
    raw.image ??
      raw.imageUrl ??
      raw.imageURL ??
      raw.img ??
      raw.cover ??
      raw.imagePath ??
      raw.image_path ??
      raw.image_name ??
      raw.imageName ??
      raw.image_url ??
      "",
  );
  const content = sanitizeContent(
    raw.content ?? raw.contenu ?? raw.body ?? raw.description ?? raw.text,
  );

  return {
    id: String(identifier),
    title: raw.title ?? raw.titre ?? raw.name ?? "",
    subtitle:
      raw.subtitle ??
      raw["sous-titre"] ??
      raw.sousTitre ??
      raw.sous_titre ??
      raw.description ??
      "",
    category:
      raw.category ??
      raw.categorie ??
      raw["catégorie"] ??
      raw.tag ??
      raw.genre ??
      "",
    author: raw.author ?? raw.auteur ?? raw.writer ?? "",
    date: raw.date ?? raw.createdAt ?? raw.updatedAt ?? raw.publishedAt ?? "",
    image,
    img: image,
    content,
  };
};

const computeStableHash = (value: string): number => {
  if (!value) {
    return 0;
  }

  const numericValue = Number(value);
  if (!Number.isNaN(numericValue)) {
    return Math.abs(Math.floor(numericValue));
  }

  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
};

const getDefaultLikes = (id: string): number => 15 + (computeStableHash(id) % 35);

const getDefaultViews = (id: string): number => 150 + (computeStableHash(id) % 200);

// Fonction pour transformer la date au format "YYYY-MM-DD" en "DD Month YYYY"
const formatDate = (dateString: string) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  return date.toLocaleDateString('fr-FR', options);
};

const isLikelyObjectId = (value: string | undefined | null): boolean => {
  if (!value) {
    return false;
  }

  return /^[a-fA-F0-9]{24}$/.test(value);
};

const ArticlePage = () => {
  const params = useParams() as { id: string | string[] };
  const router = useRouter();
  const articleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const articleMetricsKey = article?.id ?? (articleId ? String(articleId) : "");

  // Fonction pour gérer les likes
  const handleLike = () => {
    const storageKey = article?.id ?? (articleId ? String(articleId) : "");

    if (!storageKey) {
      return;
    }

    const likedArticlesRaw = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    const likedArticles: string[] = Array.isArray(likedArticlesRaw)
      ? likedArticlesRaw.map((id: unknown) => String(id))
      : [];

    const likesDataRaw = JSON.parse(localStorage.getItem('articleLikes') || '{}');
    const likesData: Record<string, number> =
      likesDataRaw && typeof likesDataRaw === 'object' ? { ...likesDataRaw } : {};

    if (isLiked) {
      const updatedLikes = likedArticles.filter((id) => id !== storageKey);
      localStorage.setItem('likedArticles', JSON.stringify(updatedLikes));
      setIsLiked(false);
      const newCount = Math.max(0, likeCount - 1);
      setLikeCount(newCount);
      likesData[storageKey] = newCount;
    } else {
      const updatedLikes = likedArticles.includes(storageKey)
        ? likedArticles
        : [...likedArticles, storageKey];
      localStorage.setItem('likedArticles', JSON.stringify(updatedLikes));
      setIsLiked(true);
      const newCount = likeCount + 1;
      setLikeCount(newCount);
      likesData[storageKey] = newCount;
    }

    localStorage.setItem('articleLikes', JSON.stringify(likesData));
  };

  // Fonction pour charger les données de like
  const loadLikeData = (storageKey: string) => {
    const likedArticlesRaw = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    const likedArticles: string[] = Array.isArray(likedArticlesRaw)
      ? likedArticlesRaw.map((id: unknown) => String(id))
      : [];

    setIsLiked(likedArticles.includes(storageKey));

    const likesDataRaw = JSON.parse(localStorage.getItem('articleLikes') || '{}');
    const likesData: Record<string, number> =
      likesDataRaw && typeof likesDataRaw === 'object' ? { ...likesDataRaw } : {};

    let storedCount = likesData[storageKey];
    if (typeof storedCount !== 'number') {
      storedCount = getDefaultLikes(storageKey);
      likesData[storageKey] = storedCount;
      localStorage.setItem('articleLikes', JSON.stringify(likesData));
    }

    setLikeCount(storedCount);
  };

  const getRelatedArticles = async (
    category?: string,
    currentId?: string,
    baseUrl?: string,
    preloadedSources?: any[],
  ): Promise<Article[]> => {
    let sources: any[] = Array.isArray(preloadedSources) ? preloadedSources : [];

    if (!sources.length && baseUrl) {
      try {
        const response = await fetch(`${baseUrl}/articles`);
        if (response.ok) {
          const data = await response.json();
          const articles = Array.isArray(data) ? data : data.articles ?? data.data ?? [];
          if (Array.isArray(articles)) {
            sources = articles;
          }
        }
      } catch (fetchError) {
        console.error("❌ Erreur lors de la récupération des articles similaires :", fetchError);
      }
    }

    if (!Array.isArray(sources) || sources.length === 0) {
      sources = articlesData.articles;
    }

    const normalizedCategory = category ? category.toLowerCase() : null;

    return sources
      .map((item: any) => {
        const normalized = normalizeArticleData(item);
        if (normalized) {
          return normalized;
        }
        if (item && typeof item === "object" && typeof item.id !== "undefined" && typeof item.title === "string") {
          return item as Article;
        }
        return null;
      })
      .filter((item): item is Article => Boolean(item))
      .filter((item) =>
        item.id !== currentId &&
        (!normalizedCategory || (item.category ?? '').toLowerCase() === normalizedCategory)
      )
      .slice(0, 3);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      console.log("🔍 Article ID:", articleId);
      console.log("🔍 Params:", params);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/$/, "")
        : "";
      
      console.log("🔍 Base URL:", baseUrl);
      
      // En production, si l'API n'est pas disponible, utiliser les données locales
      const isProduction = process.env.NODE_ENV === 'production';
      const shouldUseLocalData = isProduction && (!baseUrl || baseUrl.includes('localhost'));
      
      console.log("🔍 Should use local data:", shouldUseLocalData);

      let normalizedArticle: Article | null = null;

      // Toujours tenter de récupérer depuis l'API si une baseUrl est définie et qu'on n'est pas en production avec localhost
      if (baseUrl && articleId && !shouldUseLocalData) {
        try {
          const apiUrl = `${baseUrl}/articles/${articleId}`;
          console.log("🔍 Fetching from API:", apiUrl);
          const response = await fetch(apiUrl);
          if (response.ok) {
            const data = await response.json();
            const rawArticle =
              data.article ??
              data.data ??
              data.result ??
              data;
            normalizedArticle = normalizeArticleData(rawArticle);
          } else if (response.status !== 404) {
            throw new Error(`Erreur API (${response.status})`);
          }
        } catch (apiError) {
          console.error("❌ Erreur lors de la récupération de l'article :", apiError);
        }
      }

      if (!normalizedArticle) {
        const fallbackArticle = articlesData.articles.find(
          (item: any) => String(item.id) === String(articleId),
        );
        normalizedArticle = normalizeArticleData(fallbackArticle);
      }

      let relatedList: Article[] = [];

      if (normalizedArticle) {
        relatedList = await getRelatedArticles(
          normalizedArticle.category,
          normalizedArticle.id,
          baseUrl || undefined,
        );
      }

      if (!isMounted) {
        return;
      }

      if (normalizedArticle) {
        setArticle(normalizedArticle);
        setRelatedArticles(relatedList);
        setError(null);
      } else {
        setArticle(null);
        setRelatedArticles([]);
        setError("Article non trouvé");
      }

      setLoading(false);
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  // Charger les données de like quand l'article est chargé
  useEffect(() => {
    const storageKey = article?.id ?? (articleId ? String(articleId) : "");
    if (storageKey) {
      loadLikeData(storageKey);
    }
  }, [article, articleId]);

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
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
              onClick={() => router.push('/articles')}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux articles
            </Button>

            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="ghost"
                className={`${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'} transition-colors`}
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {likeCount}
              </span>
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
                  <span>{getDefaultViews(articleMetricsKey)} vues</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{likeCount} j'aime</span>
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
                  src={resolveImagePath(article.img || article.image)}
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
                  color={isLiked ? "danger" : "default"}
                  variant={isLiked ? "solid" : "bordered"}
                  startContent={<Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />}
                  className={`${isLiked ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-50 dark:hover:bg-red-900/20'} transition-all duration-200`}
                  onClick={handleLike}
                >
                  {isLiked ? 'J\'aime' : 'J\'aime'} ({likeCount})
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
                  {relatedArticles.length > 0 ? (
                    relatedArticles.map((relatedArticle) => (
                      <Link key={relatedArticle.id} href={`/articles/${relatedArticle.id}`}>
                        <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0">
                            <Image
                              src={resolveImagePath(relatedArticle.image || relatedArticle.img)}
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
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Aucun autre article pour cette catégorie pour le moment.
                    </p>
                  )}
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
                      {getDefaultViews(articleMetricsKey)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">J'aime</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {likeCount}
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

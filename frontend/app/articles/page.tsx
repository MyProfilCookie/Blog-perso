"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable padding-line-between-statements */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */

import { useState, useEffect, useMemo } from "react";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  Star, 
  Eye,
  ArrowRight,
  Grid3X3,
  List,
  BookOpen,
} from "lucide-react";

import articlesData from "@/public/dataarticles.json";
import { title } from "@/components/primitives";

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
    image,
    img: image,
    category:
      raw.category ??
      raw.categorie ??
      raw["catégorie"] ??
      raw.tag ??
      raw.genre ??
      "",
    author: raw.author ?? raw.auteur ?? raw.writer ?? "",
    date: raw.date ?? raw.createdAt ?? raw.updatedAt ?? raw.publishedAt ?? "",
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

interface ArticleCardProps {
  id: string;
  title: string;
  subtitle?: string;
  img?: string;
  image?: string;
  category?: string;
  author?: string;
  date?: string;
  readTime?: number;
  views?: number;
  rating?: number;
}

const ArticleCard = ({ id, title, subtitle, img, image, category, author, date, readTime, views, rating }: ArticleCardProps) => {
  const imageSrc = resolveImagePath(img || image);
  const hash = computeStableHash(id);
  const priority = hash % 7 === 0;
  const ratingDisplay = typeof rating === "number" ? rating.toFixed(1) : rating;

  return (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="w-full mb-4 sm:mb-5 md:mb-6"
    initial={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.02 }}
  >
    <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col h-full border border-gray-200 dark:border-gray-700 group">
      <Link className="block relative overflow-hidden h-[160px] sm:h-[180px] md:h-[200px]" href={`/articles/${id}`}>
        <Image
          alt={title}
          className="object-cover w-full h-full transition-transform durée-500 group-hover:scale-110"
          src={imageSrc || DEFAULT_ARTICLE_IMAGE}
          width={600}
          height={400}
          quality={90}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {category && (
          <Badge className="absolute top-3 left-3 bg-violet-600 hover:bg-violet-700 text-white">
            {category}
          </Badge>
        )}
        {rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        )}
      </Link>

      <CardHeader className="p-3 sm:p-4 md:p-5 pb-2 sm:pb-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          {author && (
            <>
              <User className="w-4 h-4" />
              <span>{author}</span>
            </>
          )}
          {date && (
            <>
              <Calendar className="w-4 h-4" />
              <span>{new Date(date).toLocaleDateString('fr-FR')}</span>
            </>
          )}
        </div>
        <h4 className="text-xl font-bold text-gray-800 dark:text-white leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {title}
        </h4>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-5 pt-0 flex-grow">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {subtitle}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          {readTime && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{readTime} min</span>
            </div>
          )}
          {views && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{views} vues</span>
            </div>
          )}
          {ratingDisplay && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{ratingDisplay}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 md:p-5 pt-0">
        <Link className="block w-full" href={`/articles/${id}`}>
          <Button
            className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800 text-white group-hover:bg-violet-700 transition-all duration-300"
          >
            Lire l'article
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
  );
};

const ArticlesPage = () => {
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const articlesPerPage = 12;

  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      setLoadingArticles(true);
      setLoadError(null);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/$/, "")
        : "";

      let normalizedArticles: Article[] = [];

      if (baseUrl) {
        try {
          const response = await fetch(`${baseUrl}/articles`);
          if (!response.ok) {
            throw new Error(`API error ${response.status}`);
          }

          const data = await response.json();
          const items = Array.isArray(data)
            ? data
            : data.articles ?? data.data ?? data.results ?? [];

          if (Array.isArray(items)) {
            normalizedArticles = items
              .map((item: any) => normalizeArticleData(item))
              .filter((item): item is Article => Boolean(item));
          }
        } catch (error) {
          console.error("❌ Erreur lors du chargement des articles :", error);
          if (isMounted) {
            setLoadError("Impossible de récupérer les articles depuis le serveur. Affichage des données locales.");
          }
        }
      }

      if (normalizedArticles.length === 0) {
        normalizedArticles = articlesData.articles
          .map((item: any, index: number) => normalizeArticleData({ ...item, id: item.id ?? index }))
          .filter((item): item is Article => Boolean(item));
      }

      if (!isMounted) {
        return;
      }

      setArticles(normalizedArticles);
      setLoadingArticles(false);
    };

    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calcul pour la pagination
  const { indexOfLastArticle, indexOfFirstArticle, currentArticles, totalPages } = useMemo(() => {
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    return { indexOfLastArticle, indexOfFirstArticle, currentArticles, totalPages };
  }, [currentPage, filteredArticles, articlesPerPage]);

  // Statistiques simulées
  const stats = useMemo(() => {
    const totalArticles = articles.length;

    if (totalArticles === 0) {
      return {
        totalArticles,
        totalViews: 0,
        totalLikes: 0,
        averageRating: 0,
      };
    }

    const aggregate = articles.reduce(
      (acc, article) => {
        const hash = computeStableHash(article.id);
        acc.views += 300 + (hash % 1500);
        acc.likes += 25 + (hash % 150);
        acc.rating += 3.8 + (hash % 12) / 10;
        return acc;
      },
      { views: 0, likes: 0, rating: 0 },
    );

    return {
      totalArticles,
      totalViews: aggregate.views,
      totalLikes: aggregate.likes,
      averageRating: Number((aggregate.rating / totalArticles).toFixed(1)),
    };
  }, [articles]);

  // Catégories populaires
  const popularCategories = useMemo(() => {
    if (articles.length === 0) {
      return [] as Array<{ name: string; count: number; color: string }>;
    }

    const palette = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    ];

    const counts = articles.reduce((acc, article) => {
      const key = (article.category ?? "Autisme").trim() || "Autisme";
      acc.set(key, (acc.get(key) ?? 0) + 1);
      return acc;
    }, new Map<string, number>());

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, palette.length)
      .map(([name, count], index) => ({
        name,
        count,
        color: palette[index % palette.length],
      }));
  }, [articles]);

  const categoriesOptions = useMemo(() => {
    const fallback = ["Autisme", "Éducation", "Santé", "Technologie", "Lifestyle"];

    if (articles.length === 0) {
      return fallback;
    }

    const set = new Set<string>();
    articles.forEach((article) => {
      if (article.category) {
        set.add(article.category);
      }
    });

    if (set.size === 0) {
      return fallback;
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
  }, [articles]);

  // Articles recommandés (simulés)
  const recommendedArticles = useMemo(
    () =>
      articles.slice(0, 3).map((article) => {
        const hash = computeStableHash(article.id);
        return {
          ...article,
          readTime: 3 + (hash % 8),
          views: 100 + (hash % 900),
          rating: Number((3.5 + (hash % 20) / 10).toFixed(1)),
        };
      }),
    [articles],
  );

  useEffect(() => {
    const normalizedSearch = search.toLowerCase();

    let filtered = articles.filter((article) => {
      const titleMatch = (article.title ?? "").toLowerCase().includes(normalizedSearch);
      const subtitleMatch = (article.subtitle ?? "").toLowerCase().includes(normalizedSearch);
      return titleMatch || subtitleMatch;
    });

    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => 
        article.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "popularity":
          return 0; // Tri par popularité non disponible pour le moment
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy, articles]);

  // Changement de page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Générer les numéros de page
  const getPageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage <= 3) {
        pages.push(2, 3, 4, 5);
        pages.push(null);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(null);
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(null);
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push(null);
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      {/* Header avec titre animé */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-700 dark:to-purple-700 py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
          <motion.h1
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
            className={`${title()} text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4`}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Articles et Astuces
          </motion.h1>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-lg md:text-xl text-violet-100 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Découvrez nos articles spécialisés sur l'autisme, l'éducation et le bien-être
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 md:py-4 lg:py-6 xl:py-8">
        {/* Statistiques */}
        {loadingArticles ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`stats-skeleton-${index}`}
                className="h-24 sm:h-28 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-3 sm:p-4 md:p-6">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-violet-600 dark:text-violet-400 mb-1 sm:mb-2">
                {stats.totalArticles}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">Articles</div>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-3 sm:p-4 md:p-6">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">Vues</div>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-3 sm:p-4 md:p-6">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
                {stats.totalLikes.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">J'aime</div>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center p-3 sm:p-4 md:p-6">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1 sm:mb-2">
                {stats.averageRating}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">Note moyenne</div>
            </Card>
          </motion.div>
        )}

        {/* Filtres et recherche */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 items-stretch md:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm sm:text-base"
                placeholder="Rechercher un article..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm sm:text-base">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categoriesOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm sm:text-base">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Plus récents</SelectItem>
                <SelectItem value="title">Ordre alphabétique</SelectItem>
                <SelectItem value="popularity">Plus populaires</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1 sm:gap-2">
              <Button
                className="bg-violet-600 hover:bg-violet-700 text-white border-violet-600 dark:border-violet-500"
                size="sm"
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                className="bg-violet-600 hover:bg-violet-700 text-white border-violet-600 dark:border-violet-500"
                size="sm"
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {loadError && (
          <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-700/60 dark:bg-yellow-900/30 dark:text-yellow-200">
            {loadError}
          </div>
        )}

        {loadingArticles ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-transparent" />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
            {/* Catégories populaires */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                Catégories populaires
              </h3>
              <div className="space-y-1 sm:space-y-2">
                {popularCategories.map((category, index) => (
                  <motion.div
                    key={`category-${category.name}`}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">{category.name}</span>
                    <Badge className={category.color}>{category.count}</Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Articles recommandés */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                Recommandés
              </h3>
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {recommendedArticles.map((article, index) => (
                  <motion.div
                    key={`recommended-${article.id}`}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/articles/${article.id}`}>
                      <div className="flex gap-2 sm:gap-3">
                        <Image
                          alt={article.title}
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-cover rounded-lg"
                          src={resolveImagePath(article.img || article.image)}
                          width={64}
                          height={64}
                          quality={90}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <Eye className="w-3 h-3" />
                            <span>{article.views ?? 100 + (computeStableHash(article.id) % 900)}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>
                              {typeof article.rating === 'number'
                                ? article.rating.toFixed(1)
                                : article.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl p-3 sm:p-4 md:p-6 text-white"
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2">Restez informé</h3>
              <p className="text-violet-100 text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4">
                Recevez nos derniers articles directement dans votre boîte mail
              </p>
              <div className="space-y-2 sm:space-y-3">
                <Input
                  className="bg-white/20 border-white/30 text-white placeholder:text-violet-200 text-sm"
                  placeholder="Votre email"
                />
                <Button className="w-full bg-white text-violet-600 hover:bg-gray-100 text-sm">
                  S'abonner
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Contenu principal */}
          <div className="md:col-span-3">
            {/* Grille d'articles */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className={`grid gap-2 sm:gap-3 md:gap-4 lg:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {currentArticles.map((article, index) => {
                // Générer des valeurs stables pour éviter les problèmes de clés
                const hash = computeStableHash(article.id);
                const stableRating = Number((3.5 + (hash % 20) / 10).toFixed(1));
                const stableReadTime = 3 + (hash % 8);
                const stableViews = 100 + (hash % 900);
                
                return (
                  <ArticleCard
                    key={`article-${article.id}`}
                    author={article.author}
                    category={article.category}
                    date={article.date}
                    id={article.id}
                    img={article.img}
                    image={article.image}
                    rating={stableRating}
                    readTime={stableReadTime}
                    subtitle={article.subtitle}
                    title={article.title}
                    views={stableViews}
                  />
                );
              })}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center items-center gap-2 mt-12"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Button
                  className="border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
                  disabled={currentPage === 1}
                  variant="outline"
                  onClick={() => paginate(currentPage - 1)}
                >
                  Précédent
                </Button>
                
                <div className="flex items-center gap-1">
                  {getPageNumbers.map((page, index) => (
                    page === null ? (
                      <span key={`ellipsis-${currentPage}-${index}`} className="px-2 text-gray-500">...</span>
                    ) : (
                      <Button
                        key={`page-${page}-${currentPage}`}
                        className={
                          currentPage === page
                            ? "bg-violet-600 hover:bg-violet-700 text-white"
                            : "border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
                        }
                        size="sm"
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </Button>
                    )
                  ))}
                </div>
                
                <Button
                  className="border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
                  disabled={currentPage === totalPages}
                  variant="outline"
                  onClick={() => paginate(currentPage + 1)}
                >
                  Suivant
                </Button>
              </motion.div>
            )}

            {/* Message si aucun résultat */}
            {filteredArticles.length === 0 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Aucun article trouvé
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setSortBy("date");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;

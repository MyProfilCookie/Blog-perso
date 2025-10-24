"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ThumbsDown,
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  FileText,
  Newspaper
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LikedContent {
  _id: string;
  contentType: 'article' | 'publication' | 'blog';
  contentId: string;
  likedAt: string;
  content: {
    _id: string;
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    img?: string;
    category?: string;
    author?: string;
    date: string;
  };
}

const PLACEHOLDER_IMAGE = '/placeholder.webp';

const normalizeImagePath = (value?: string | null): string => {
  if (!value || typeof value !== 'string') {
    return PLACEHOLDER_IMAGE;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return PLACEHOLDER_IMAGE;
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed;
  }

  const normalized = trimmed.replace(/^\.?\/+/, '');
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
};

const normalizeArticlePayload = (raw: any): LikedContent['content'] | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const identifier =
    raw._id ??
    raw.id ??
    (typeof raw.slug === 'object' ? raw.slug?.current : raw.slug) ??
    raw.articleId ??
    raw.contentId;

  if (!identifier) {
    return null;
  }

  const imageCandidate =
    raw.image ??
    raw.img ??
    raw.imageUrl ??
    raw.imageURL ??
    raw.cover ??
    raw.thumbnail ??
    raw.image_path ??
    raw.imagePath ??
    raw.image_name ??
    raw.imageName;

  const normalizedImage = normalizeImagePath(imageCandidate);
  const dateValue =
    raw.date ??
    raw.createdAt ??
    raw.updatedAt ??
    raw.publishedAt ??
    raw.likedAt ??
    '';

  return {
    _id: String(identifier),
    id: String(identifier),
    title:
      raw.title ??
      raw.name ??
      raw.headline ??
      raw.heading ??
      raw.nom ??
      'Article indisponible',
    subtitle:
      raw.subtitle ??
      raw.description ??
      raw.excerpt ??
      raw.summary ??
      raw.subheading ??
      raw['sous-titre'] ??
      '',
    description: raw.description ?? raw.summary ?? '',
    image: normalizedImage,
    img: normalizedImage,
    category:
      raw.category ??
      raw.categorie ??
      raw.genre ??
      raw.tag ??
      (Array.isArray(raw.tags) ? raw.tags[0] : undefined),
    author: raw.author ?? raw.auteur ?? raw.writer ?? '',
    date: dateValue ? String(dateValue) : ''
  };
};

const loadLocalArticles = async (): Promise<Map<string, LikedContent['content']>> => {
  const sources = ['/dataarticles.json', '/dataarticless.json'];
  const articleMap = new Map<string, LikedContent['content']>();

  await Promise.all(
    sources.map(async (source) => {
      try {
        const response = await fetch(source);
        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        const articles = Array.isArray(payload)
          ? payload
          : payload?.articles ?? payload?.data ?? [];

        if (!Array.isArray(articles)) {
          return;
        }

        articles.forEach((entry: any) => {
          const normalized = normalizeArticlePayload(entry);
          if (normalized) {
            articleMap.set(normalized._id, normalized);
            articleMap.set(normalized.id, normalized);
          }
        });
      } catch (error) {
        console.warn(`❌ Erreur lors du chargement du fichier ${source}:`, error);
      }
    })
  );

  return articleMap;
};

export default function LikedContentPage() {
  const [likedContent, setLikedContent] = useState<LikedContent[]>([]);
  const [dislikedContent, setDislikedContent] = useState<LikedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    // Récupérer l'ID utilisateur depuis le localStorage ou le contexte
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user._id || user.id);
    }
  }, []);

  useEffect(() => {
    const fetchLikedContent = async () => {
      if (!userId) {
        console.log('❌ Pas d\'userId');
        return;
      }

      console.log('🔍 Chargement des contenus likés pour userId:', userId);
      setLoading(true);
      try {
        const articleCache = new Map<string, LikedContent['content']>();
        const localArticlesPromise = loadLocalArticles();
        const likedUrl = `${apiUrl}/likes/user/${userId}/liked`;
        const dislikedUrl = `${apiUrl}/likes/user/${userId}/disliked`;

        const [localArticles, likedResponse, dislikedResponse] = await Promise.all([
          localArticlesPromise,
          fetch(likedUrl),
          fetch(dislikedUrl)
        ]);

        const enrichEntries = async (entries: unknown[]): Promise<LikedContent[]> => {
          if (!Array.isArray(entries)) {
            return [];
          }

          return Promise.all(
            entries
              .filter(
                (entry): entry is LikedContent =>
                  Boolean(
                    entry &&
                    typeof entry === 'object' &&
                    'contentType' in entry &&
                    'contentId' in entry
                  )
              )
              .map(async (entry) => {
                if (entry.contentType !== 'article') {
                  return entry;
                }

                const contentId = entry.contentId ? String(entry.contentId) : '';
                if (!contentId) {
                  return entry;
                }

                const existingContent = entry.content?.title
                  ? normalizeArticlePayload(entry.content)
                  : null;

                if (existingContent) {
                  articleCache.set(contentId, existingContent);
                  return {
                    ...entry,
                    content: existingContent
                  };
                }

                if (articleCache.has(contentId)) {
                  return {
                    ...entry,
                    content: articleCache.get(contentId)!
                  };
                }

                let articleDetails: LikedContent['content'] | null = null;

                if (apiUrl) {
                  try {
                    const articleResponse = await fetch(`${apiUrl}/articles/${contentId}`);
                    if (articleResponse.ok) {
                      const payload = await articleResponse.json();
                      articleDetails = normalizeArticlePayload(
                        payload?.article ?? payload?.data ?? payload
                      );
                    }
                  } catch (error) {
                    console.warn('❌ Erreur lors de la récupération de l\'article via API:', error);
                  }
                }

                if (!articleDetails) {
                  articleDetails = localArticles.get(contentId) ?? null;
                }

                if (!articleDetails) {
                  const numericId = Number(contentId);
                  if (!Number.isNaN(numericId)) {
                    articleDetails = localArticles.get(String(numericId)) ?? null;
                  }
                }

                if (!articleDetails) {
                  articleDetails = {
                    _id: contentId,
                    id: contentId,
                    title: 'Contenu indisponible',
                    subtitle: '',
                    description: '',
                    image: PLACEHOLDER_IMAGE,
                    img: PLACEHOLDER_IMAGE,
                    category: '',
                    author: '',
                    date: entry.likedAt
                  };
                }

                articleCache.set(contentId, articleDetails);

                return {
                  ...entry,
                  content: articleDetails
                };
              })
          );
        };

        if (likedResponse.ok) {
          const likedData = await likedResponse.json();
          const enrichedLiked = await enrichEntries(likedData);
          setLikedContent(enrichedLiked);
        } else {
          console.log('⚠️ Pas encore de contenus likés ou API non disponible');
          setLikedContent([]);
        }

        if (dislikedResponse.ok) {
          const dislikedData = await dislikedResponse.json();
          const enrichedDisliked = await enrichEntries(dislikedData);
          setDislikedContent(enrichedDisliked);
        } else {
          console.log('Pas encore de contenus dislikés ou API non disponible');
          setDislikedContent([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des contenus:', error);
        setLikedContent([]);
        setDislikedContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedContent();
  }, [userId, apiUrl]);

  const getContentLink = (item: LikedContent) => {
    switch (item.contentType) {
      case 'article':
        return `/articles/${item.contentId}`;
      case 'publication':
        return `/publications/${item.contentId}`;
      case 'blog':
        return `/blog/${item.contentId}`;
      default:
        return '/';
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'publication':
        return <BookOpen className="w-4 h-4" />;
      case 'blog':
        return <Newspaper className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const ContentCard = ({ item }: { item: LikedContent }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={getContentLink(item)}>
        <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-gray-200 dark:border-gray-700">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={item.content.image || item.content.img || '/placeholder.webp'}
              alt={item.content.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90">
                {getContentIcon(item.contentType)}
                <span className="ml-1 capitalize">{item.contentType}</span>
              </Badge>
            </div>
          </div>

          <CardContent className="p-4">
            {item.content.category && (
              <Badge variant="outline" className="mb-2">
                {item.content.category}
              </Badge>
            )}

            <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
              {item.content.title}
            </h3>

            {item.content.subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {item.content.subtitle}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              {item.content.author && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{item.content.author}</span>
                </div>
              )}
              {item.content.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(item.content.date).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Connexion requise</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connectez-vous pour voir vos contenus aimés
            </p>
            <Link href="/login">
              <Button>Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de vos contenus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          <Link href="/profile" className="inline-flex items-center text-blue-100 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au profil
          </Link>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Mes contenus aimés
              </h1>
              <p className="text-blue-100">
                Retrouvez tous les articles, publications et blogs que vous avez aimés
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <Tabs defaultValue="liked" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="liked" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Aimés ({likedContent.length})
            </TabsTrigger>
            <TabsTrigger value="disliked" className="flex items-center gap-2">
              <ThumbsDown className="w-4 h-4" />
              Non aimés ({dislikedContent.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="liked">
            {likedContent.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Aucun contenu aimé</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Commencez à aimer des articles, publications ou blogs !
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/posts">
                      <Button variant="outline">Voir les articles</Button>
                    </Link>
                    <Link href="/publications">
                      <Button variant="outline">Voir les publications</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedContent.map((item) => (
                  <ContentCard key={item._id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="disliked">
            {dislikedContent.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ThumbsDown className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Aucun contenu non aimé</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Vous n'avez pas encore indiqué de contenu que vous n'aimez pas
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dislikedContent.map((item) => (
                  <ContentCard key={item._id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

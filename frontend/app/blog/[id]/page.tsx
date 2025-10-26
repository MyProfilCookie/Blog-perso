 "use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Loader2,
  Calendar,
  User,
  Tag,
  ArrowLeft,
  CheckCircle,
  Clock,
  BookOpen,
} from "lucide-react";

import BackButton from "@/components/back";
import LikeButton from "@/components/LikeButton";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";

type Blog = {
  _id: string;
  title: string;
  description: string;
  content: string | string[];
  category: string;
  author: string;
  imageUrl: string;
  createdAt: string;
};

export default function BlogPostPage() {
  const { id } = useParams() ?? {};

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [imageError, setImageError] = useState(false);

  const { isMobile } = useMobileOptimization({ enableReducedMotion: true });

  useEffect(() => {
    if (!id) {
      setError("Aucun identifiant d’article fourni.");
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`,
        );

        if (!response.ok) {
          throw new Error("Article introuvable");
        }

        const data = await response.json();
        if (data?.blog) {
          setBlog(data.blog);
        } else {
          throw new Error("Données de l’article manquantes");
        }
      } catch (fetchError) {
        console.error("Erreur lors du chargement de l’article :", fetchError);
        setError("Impossible de charger cet article pour le moment.");
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user?._id || user?.id || "");
      } catch (parseError) {
        console.error("Erreur lors de la lecture du profil utilisateur :", parseError);
      }
    }
  }, []);

  const contentArray = useMemo(() => {
    if (!blog?.content) {
      return [];
    }

    if (Array.isArray(blog.content)) {
      return blog.content.filter((paragraph) => paragraph.trim().length > 0);
    }

    return blog.content
      .split("\n")
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0);
  }, [blog]);

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const readingTime = useMemo(() => {
    if (!contentArray.length) {
      return 3;
    }
    const totalWords = contentArray.join(" ").split(/\s+/).filter(Boolean).length;
    return Math.max(3, Math.round(totalWords / 180));
  }, [contentArray]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-300" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 text-center dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <p className="mb-6 max-w-lg text-lg font-semibold text-red-600 dark:text-red-400">
          {error ?? "Article introuvable."}
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux articles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-900">
      <div className="w-full px-4 pb-16 pt-8 md:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <BackButton label="Retour aux articles" />

          <motion.article
            initial={isMobile ? undefined : { opacity: 0, y: 24 }}
            animate={isMobile ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-2xl backdrop-blur dark:border-white/5 dark:bg-gray-900/80"
          >
            <div className="relative h-64 w-full overflow-hidden rounded-t-3xl sm:h-80">
              <Image
                priority
                fill
                alt={blog.title}
                className="object-cover"
                src={
                  imageError || !blog.imageUrl
                    ? "/assets/default-blog.jpg"
                    : blog.imageUrl
                }
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-900 shadow-sm dark:bg-black/60 dark:text-white">
                    {blog.category}
                  </span>
                  <span className="rounded-full bg-blue-600/90 px-3 py-1 text-xs font-semibold text-white shadow">
                    {readingTime} min de lecture
                  </span>
                  <div className="ml-auto">
                    <LikeButton
                      contentType="blog"
                      contentId={id as string}
                      userId={userId}
                      showCounts
                      size="sm"
                    />
                  </div>
                </div>
                <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                  {blog.title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm text-blue-100 md:text-base">
                  {blog.description}
                </p>
              </div>
            </div>

            <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="space-y-8">
                <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-800 shadow-sm dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-100">
                  {blog.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{blog.author}</span>
                    </div>
                  )}
                  {formattedDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formattedDate}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>{blog.category}</span>
                  </div>
                </div>

                <div className="space-y-6 text-gray-700 dark:text-gray-100">
                  {contentArray.map((paragraph, index) => (
                    <p
                      key={`paragraph-${index}`}
                      className="text-base leading-relaxed md:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="rounded-3xl border border-blue-100 bg-white/70 p-6 shadow-sm dark:border-blue-900/40 dark:bg-blue-900/20">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                    Ce qu’il faut retenir
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200">
                    {contentArray.slice(0, 3).map((paragraph, index) => (
                      <li
                        key={`insight-${index}`}
                        className="flex items-start gap-2 rounded-2xl border border-blue-100 bg-white/80 px-3 py-2.5 dark:border-blue-900/30 dark:bg-blue-900/30"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                        <span>{paragraph}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-purple-100 bg-white/80 p-6 shadow-lg dark:border-purple-900/30 dark:bg-gray-900/70">
                  <h4 className="flex items-center gap-2 text-base font-semibold text-purple-700 dark:text-purple-200">
                    <BookOpen className="h-4 w-4" />
                    Pour aller plus loin
                  </h4>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                    Téléchargez nos fiches pratiques et retrouvez les ateliers liés à ce thème dans
                    la section ressources.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 text-sm">
                    <Link
                      href="/resources/tools"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-purple-200 px-4 py-2 font-semibold text-purple-700 transition hover:border-purple-300 hover:text-purple-800 dark:border-purple-900/40 dark:text-purple-200 dark:hover:border-purple-700"
                    >
                      Boîte à outils associée
                    </Link>
                    <Link
                      href="/resources/trainings"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 font-semibold text-white shadow-lg transition hover:from-purple-700 hover:to-pink-600"
                    >
                      Réserver un atelier
                    </Link>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
                  <h5 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                    Newsletter
                  </h5>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                    Une idée sensorielle, un script social et nos prochains rendez-vous directement
                    dans votre boîte mail.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
                  >
                    Je m’abonne à la lettre douce
                  </Link>
                </div>
              </aside>
            </div>
          </motion.article>

          <div className="flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:text-blue-800 dark:border-blue-900/40 dark:text-blue-200 dark:hover:border-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Explorer d’autres articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

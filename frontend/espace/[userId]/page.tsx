"use client";

export const dynamic = "force-dynamic";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Heart,
  BookOpen,
  ArrowRight,
  Star,
  Calendar,
  Trophy,
  Palette,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

import { UserContext } from "@/context/UserContext";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EleveStats {
  overallAverage: number;
  totalPagesCompleted: number;
  globalStats: {
    totalExercises: number;
    totalCorrect: number;
    averageScore: number;
    totalTimeSpent: number;
    streak: number;
  };
  subjects: {
    subjectName: string;
    averageScore: number;
    stats: { exercisesCompleted: number };
  }[];
}

interface ProfileUser {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  image: string;
  role: string;
  isAdmin: boolean;
  ageEnfantOuAdulteAutiste?: number;
}

// ---------------------------------------------------------------------------
// Couleurs par défaut pour les badges selon les scores
// ---------------------------------------------------------------------------

function getBadges(stats: EleveStats | null): { icon: typeof Star; text: string; colors: string }[] {
  const badges = [
    {
      icon: Star,
      text: "Super élève",
      colors: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-200",
    },
    {
      icon: Heart,
      text: "Courageux·se",
      colors: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200",
    },
    {
      icon: Trophy,
      text: "En progrès",
      colors: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200",
    },
  ];

  // Badge dynamique selon la moyenne
  if (stats && stats.overallAverage >= 80) {
    badges[2] = {
      icon: Trophy,
      text: "Excellent·e",
      colors: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200",
    };
  } else if (stats && stats.globalStats.streak >= 7) {
    badges[2] = {
      icon: TrendingUp,
      text: `🔥 ${stats.globalStats.streak} jours`,
      colors: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200",
    };
  }

  return badges;
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export default function EspaceEleve() {
  const context = useContext(UserContext);
  const currentUser = context?.user ?? null;
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [eleveStats, setEleveStats] = useState<EleveStats | null>(null);
  const [loading, setLoading] = useState(true);

  const { isMobile, shouldReduceAnimations } = useMobileOptimization({
    enableReducedMotion: true,
  });
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = isMobile || prefersReducedMotion || shouldReduceAnimations;
  const instantTransition = { duration: 0 };

  // ---------------------------------------------------------------------------
  // Autorisation : seul l'élève lui-même ou un admin peut accéder
  // ---------------------------------------------------------------------------

  const isAuthorized =
    currentUser?.isAdmin || currentUser?._id === userId;

  useEffect(() => {
    if (currentUser === null) {
      router.replace("/");
      return;
    }
    if (currentUser && !isAuthorized) {
      router.replace("/");
    }
  }, [currentUser, isAuthorized, router]);

  // ---------------------------------------------------------------------------
  // Chargement des données de l'élève
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!userId || !isAuthorized) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

    async function fetchData() {
      try {
        setLoading(true);

        // Profil utilisateur
        const userRes = await fetch(`${apiBase}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setProfileUser(userData.user ?? userData);
        }

        // Statistiques élève
        const eleveRes = await fetch(`${apiBase}/api/eleve/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (eleveRes.ok) {
          const eleveData = await eleveRes.json();
          setEleveStats(eleveData.eleve ?? eleveData);
        }
      } catch (err) {
        console.error("Erreur chargement données élève :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId, isAuthorized]);

  // ---------------------------------------------------------------------------
  // États de chargement / accès refusé
  // ---------------------------------------------------------------------------

  if (!currentUser || !isAuthorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6 text-center dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <p className="mb-6 max-w-lg text-lg font-semibold text-gray-700 dark:text-gray-200">
          Cet espace est privé. 💜
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Revenir à l'accueil
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <motion.div
          animate={disableMotion ? {} : { rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent"
        />
      </div>
    );
  }

  const prenom = profileUser?.prenom ?? currentUser?.prenom ?? "Élève";
  const avatar = profileUser?.image ?? "/assets/default-avatar.webp";
  const badges = getBadges(eleveStats);

  // ---------------------------------------------------------------------------
  // Rendu principal
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-900">
      <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 md:px-8">

        {/* ------------------------------------------------------------------ */}
        {/* Hero Section                                                         */}
        {/* ------------------------------------------------------------------ */}
        <motion.section
          initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={disableMotion ? instantTransition : { duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl backdrop-blur dark:border-white/5 dark:bg-gray-900"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-blue-400/20" />

          {/* Cercles décoratifs */}
          <motion.div
            className="absolute -left-24 top-20 h-48 w-48 rounded-full bg-pink-400/30 blur-3xl"
            animate={disableMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-purple-400/30 blur-3xl"
            animate={disableMotion ? {} : { scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative p-8 md:p-14 text-center">

            {/* Avatar */}
            <motion.div
              className="flex justify-center mb-4"
              initial={disableMotion ? {} : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={disableMotion ? instantTransition : { type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-purple-300 shadow-xl">
                <Image
                  src={avatar}
                  alt={`Photo de ${prenom}`}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Badge bienvenue */}
            <motion.div
              className="flex justify-center mb-4"
              initial={disableMotion ? {} : { scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={disableMotion ? instantTransition : { type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <motion.span
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-lg font-bold text-white shadow-lg"
                whileHover={disableMotion ? {} : { scale: 1.05 }}
                whileTap={disableMotion ? {} : { scale: 0.95 }}
              >
                <Sparkles className="h-5 w-5" />
                Bienvenue {prenom} !
                <Sparkles className="h-5 w-5" />
              </motion.span>
            </motion.div>

            {/* Date du jour */}
            <motion.p
              className="text-lg text-purple-600 dark:text-purple-300 font-medium mb-6"
              initial={disableMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={disableMotion ? instantTransition : { delay: 0.4 }}
            >
              📅{" "}
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </motion.p>

            {/* Titre */}
            <motion.h1
              className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mb-4"
              initial={disableMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={disableMotion ? instantTransition : { delay: 0.5 }}
            >
              Mon Espace Personnel{" "}
              <motion.span
                animate={disableMotion ? {} : { scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="inline-block"
              >
                💜
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={disableMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={disableMotion ? instantTransition : { delay: 0.7 }}
            >
              Cet espace est rien qu'à toi, {prenom} ! Tu peux y retrouver tes activités
              préférées, tes réussites et ton avancement.
            </motion.p>

            {/* Badges */}
            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-4"
              initial={disableMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={disableMotion ? instantTransition : { delay: 0.9 }}
            >
              {badges.map((badge, index) => (
                <motion.span
                  key={badge.text}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${badge.colors}`}
                  initial={disableMotion ? {} : { opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={
                    disableMotion
                      ? instantTransition
                      : { delay: 1 + index * 0.15, type: "spring", stiffness: 200 }
                  }
                  whileHover={disableMotion ? {} : { scale: 1.1, y: -2 }}
                >
                  <badge.icon className="h-4 w-4" />
                  {badge.text}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              className="mt-10"
              initial={disableMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={disableMotion ? instantTransition : { delay: 1.3 }}
            >
              <Link href="/controle">
                <motion.button
                  className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white shadow-xl hover:shadow-2xl transition-shadow"
                  whileHover={disableMotion ? {} : { scale: 1.05, y: -3 }}
                  whileTap={disableMotion ? {} : { scale: 0.95 }}
                >
                  <span>📝</span>
                  Mes Contrôles
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* ------------------------------------------------------------------ */}
        {/* Statistiques dynamiques                                              */}
        {/* ------------------------------------------------------------------ */}
        {eleveStats && (
          <motion.section
            initial={disableMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={disableMotion ? instantTransition : { duration: 0.6, delay: 0.1 }}
            className="mt-10 grid gap-4 grid-cols-2 md:grid-cols-4"
          >
            {[
              {
                icon: TrendingUp,
                label: "Moyenne générale",
                value: `${Math.round(eleveStats.overallAverage)}%`,
                color: "text-purple-600 dark:text-purple-300",
                bg: "bg-purple-50 dark:bg-purple-900/20",
              },
              {
                icon: CheckCircle,
                label: "Exercices faits",
                value: eleveStats.globalStats.totalExercises,
                color: "text-green-600 dark:text-green-300",
                bg: "bg-green-50 dark:bg-green-900/20",
              },
              {
                icon: Clock,
                label: "Série en cours",
                value: `${eleveStats.globalStats.streak} 🔥`,
                color: "text-orange-600 dark:text-orange-300",
                bg: "bg-orange-50 dark:bg-orange-900/20",
              },
              {
                icon: BookOpen,
                label: "Pages complétées",
                value: eleveStats.totalPagesCompleted,
                color: "text-blue-600 dark:text-blue-300",
                bg: "bg-blue-50 dark:bg-blue-900/20",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl p-4 shadow-md ${stat.bg} border border-white/50 dark:border-white/5`}
              >
                <stat.icon className={`h-6 w-6 mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Activités + Réussites                                               */}
        {/* ------------------------------------------------------------------ */}
        <motion.section
          initial={disableMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={disableMotion ? instantTransition : { duration: 0.6, delay: 0.15 }}
          className="mt-10 grid gap-6 md:grid-cols-2"
        >
          {/* Mes Activités */}
          <div className="rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-xl dark:border-pink-900/40 dark:bg-gray-900/80">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white mb-4">
              <Calendar className="h-6 w-6 text-pink-500" />
              Mes Activités
            </h2>
            <div className="space-y-3">
              <Link
                href="/controle"
                className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/50 p-4 transition hover:bg-pink-100/50 dark:border-pink-900/30 dark:bg-pink-950/30 dark:hover:bg-pink-900/40"
              >
                <BookOpen className="h-8 w-8 text-pink-600" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Mes Contrôles</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Révise et apprends</p>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto text-pink-600" />
              </Link>
              <Link
                href="/resources"
                className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-purple-50/50 p-4 transition hover:bg-purple-100/50 dark:border-purple-900/30 dark:bg-purple-950/30 dark:hover:bg-purple-900/40"
              >
                <Palette className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Mes Ressources</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Outils et supports</p>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto text-purple-600" />
              </Link>
            </div>
          </div>

          {/* Mes Réussites */}
          <div className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl dark:border-purple-900/40 dark:bg-gray-900/80">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white mb-4">
              <Trophy className="h-6 w-6 text-purple-500" />
              Mes Réussites
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 p-4 dark:from-yellow-900/30 dark:to-orange-900/30">
                <span className="text-3xl">🏆</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Super travail !</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Tu fais de ton mieux chaque jour
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-4 dark:from-green-900/30 dark:to-emerald-900/30">
                <span className="text-3xl">⭐</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Toujours curieux·se</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Tu aimes apprendre de nouvelles choses
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 p-4 dark:from-pink-900/30 dark:to-rose-900/30">
                <span className="text-3xl">💖</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Plein·e de talent</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Tu es unique et merveilleux·se
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ------------------------------------------------------------------ */}
        {/* Progrès par matière                                                  */}
        {/* ------------------------------------------------------------------ */}
        {eleveStats && eleveStats.subjects.length > 0 && (
          <motion.section
            initial={disableMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={disableMotion ? instantTransition : { duration: 0.6, delay: 0.2 }}
            className="mt-10 rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900/80"
          >
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white mb-6">
              <TrendingUp className="h-6 w-6 text-green-500" />
              Mes Matières
            </h2>
            <div className="space-y-4">
              {eleveStats.subjects.map((subject) => (
                <div key={subject.subjectName}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {subject.subjectName}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {Math.round(subject.averageScore)}%
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <motion.div
                      className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.averageScore}%` }}
                      transition={disableMotion ? instantTransition : { duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Message motivant                                                     */}
        {/* ------------------------------------------------------------------ */}
        <motion.section
          initial={disableMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={disableMotion ? instantTransition : { duration: 0.6, delay: 0.25 }}
          className="mt-10 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-8 shadow-xl text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">
            Tu es formidable, {prenom} ! 🌟
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Continue d'apprendre, de créer et de t'amuser. On est tous très fiers de toi !
          </p>
          <div className="mt-6 flex justify-center gap-4 text-4xl">
            <span>💜</span>
            <span>🌈</span>
            <span>✨</span>
            <span>🎨</span>
            <span>📚</span>
          </div>
        </motion.section>

        {/* ------------------------------------------------------------------ */}
        {/* Lien profil                                                          */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          initial={disableMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={disableMotion ? instantTransition : { duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-purple-700 shadow-lg transition hover:bg-purple-50 dark:bg-gray-800 dark:text-purple-300 dark:hover:bg-gray-700"
          >
            Voir mon profil
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

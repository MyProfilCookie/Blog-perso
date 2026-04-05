"use client";

export const dynamic = "force-dynamic";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Heart,
  Smile,
  Book,
  Music,
  Palette,
  Users,
  Star,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle,
  Clock,
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
  }[];
}

interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  summary?: string;
  averageScore?: number;
}

// ---------------------------------------------------------------------------
// Accès restreint à Michael (ou admin)
// Remplace cet email par celui de Michael dans ta base de données.
// ---------------------------------------------------------------------------

const AUTHORIZED_EMAIL = "michael@autistudy.fr"; // ← à mettre à jour

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MichaelPage() {
  const context = useContext(UserContext);
  const currentUser = context?.user ?? null;
  const router = useRouter();

  const [eleveStats, setEleveStats] = useState<EleveStats | null>(null);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(true);

  const { isMobile, shouldReduceAnimations } = useMobileOptimization({ enableReducedMotion: true });
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = isMobile || prefersReducedMotion || shouldReduceAnimations;
  const instant = { duration: 0 };

  const isAuthorized =
    currentUser?.email?.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase() ||
    currentUser?.isAdmin === true;

  // Redirection si non autorisé
  useEffect(() => {
    if (currentUser === null) { router.replace("/"); return; }
    if (currentUser && !isAuthorized) router.replace("/");
  }, [currentUser, isAuthorized, router]);

  // Chargement des stats élève
  useEffect(() => {
    if (!currentUser?._id || !isAuthorized) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    async function fetchData() {
      try {
        const [eleveRes, reportsRes] = await Promise.all([
          fetch(`${apiBase}/api/eleve/${currentUser._id}`, { headers }),
          fetch(`${apiBase}/api/rapports-hebdo/${currentUser._id}`, { headers }),
        ]);

        if (eleveRes.ok) {
          const data = await eleveRes.json();
          setEleveStats(data.eleve ?? data);
        }
        if (reportsRes.ok) {
          const data = await reportsRes.json();
          setWeeklyReports((data.reports ?? data).slice(0, 3));
        }
      } catch (err) {
        console.error("Erreur chargement données Michael :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUser, isAuthorized]);

  // ---------------------------------------------------------------------------
  // Accès refusé
  // ---------------------------------------------------------------------------

  if (!currentUser || !isAuthorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 text-center dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <p className="mb-6 max-w-lg text-lg font-semibold text-gray-700 dark:text-gray-200">
          Cet espace est réservé à Michael. 💙
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Revenir à l'accueil
        </Link>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Chargement
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <motion.div
          animate={disableMotion ? {} : { rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  const prenom = currentUser.prenom ?? "Michael";
  const age = currentUser.ageEnfantOuAdulteAutiste ?? 14;
  const avatar = currentUser.image ?? "/assets/family/michael.webp";

  // Photos de galerie
  const galleryImages = [
    "/assets/michael/michael1.webp",
    "/assets/michael/michael2.webp",
    "/assets/michael/michael3.webp",
  ];

  // ---------------------------------------------------------------------------
  // Rendu
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">

        {/* ── En-tête ── */}
        <motion.div
          initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={disableMotion ? instant : { duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
            Mon espace personnel, {prenom} 💙
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Un espace rien qu'à toi pour voir tes activités, tes progrès et tes souvenirs.
          </p>
        </motion.div>

        {/* ── Stats dynamiques ── */}
        {eleveStats && (
          <motion.div
            initial={disableMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={disableMotion ? instant : { duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {[
              { icon: TrendingUp,  label: "Moyenne générale",  value: `${Math.round(eleveStats.overallAverage)}%`,   color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
              { icon: CheckCircle, label: "Exercices faits",   value: eleveStats.globalStats.totalExercises,          color: "text-green-600",  bg: "bg-green-50 dark:bg-green-900/20" },
              { icon: Clock,       label: "Série en cours",    value: `${eleveStats.globalStats.streak} 🔥`,          color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
              { icon: Book,        label: "Pages complétées",  value: eleveStats.totalPagesCompleted,                 color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-900/20" },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-2xl p-4 shadow-md ${stat.bg} border border-white/50 dark:border-white/5`}>
                <stat.icon className={`h-6 w-6 mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Profil + Activités ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Carte profil */}
          <motion.div
            initial={disableMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={disableMotion ? instant : { duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden shadow-xl border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                    <Image
                      src={avatar}
                      alt={prenom}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center mt-4">{prenom}</CardTitle>
                <p className="text-center text-blue-100">{age} ans</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    À propos de {prenom}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {prenom} a {age} ans et fait partie de la communauté AutiStudy.
                    C'est un garçon plein de curiosité et d'énergie.
                  </p>
                </div>

                {/* Badges dynamiques selon stats */}
                <div className="flex flex-wrap gap-2 pt-4">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Heart className="w-3 h-3 mr-1" /> {age} ans
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <Smile className="w-3 h-3 mr-1" /> Créatif
                  </Badge>
                  {eleveStats && eleveStats.overallAverage >= 70 ? (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <Star className="w-3 h-3 mr-1" /> {eleveStats.overallAverage >= 85 ? "Excellent" : "En progrès"}
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Star className="w-3 h-3 mr-1" /> Curieux
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activités + Outils */}
          <motion.div
            initial={disableMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={disableMotion ? instant : { duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-red-500" />
                  Les activités que {prenom} apprécie particulièrement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: <Book className="w-6 h-6 text-blue-600" />,   title: "Apprentissage ludique", description: "Exercices interactifs et jeux éducatifs" },
                    { icon: <Music className="w-6 h-6 text-purple-600" />, title: "Musique",               description: "Activités musicales et rythmiques" },
                    { icon: <Palette className="w-6 h-6 text-pink-600" />, title: "Créativité",            description: "Dessin et activités artistiques" },
                    { icon: <Users className="w-6 h-6 text-green-600" />,  title: "Socialisation",         description: "Interactions et activités de groupe" },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={disableMotion ? {} : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={disableMotion ? instant : { delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0">{activity.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-950 dark:to-teal-950">
                <CardTitle className="flex items-center gap-2">
                  <Award className="text-green-600" />
                  Outils et méthodes adaptés aux besoins de {prenom}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { title: "Supports visuels",       description: "Utilisation d'images et de pictogrammes pour faciliter la compréhension" },
                    { title: "Exercices personnalisés", description: "Activités adaptées à son rythme et à ses centres d'intérêt" },
                    { title: "Routine structurée",      description: "Un cadre rassurant avec des étapes claires et prévisibles" },
                  ].map((tool, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{tool.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── Progrès par matière ── */}
        {eleveStats && eleveStats.subjects.length > 0 && (
          <motion.div
            initial={disableMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={disableMotion ? instant : { duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="text-purple-600" />
                  Mes matières
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {eleveStats.subjects.map((subject) => (
                    <div key={subject.subjectName}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subject.subjectName}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{Math.round(subject.averageScore)}%</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                        <motion.div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${subject.averageScore}%` }}
                          transition={disableMotion ? instant : { duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Suivi / Rapports hebdomadaires ── */}
        <motion.div
          initial={disableMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={disableMotion ? instant : { duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-950 dark:to-orange-950">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingUp className="text-yellow-600" />
                Suivi du développement et des progrès de {prenom}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {(weeklyReports.length > 0
                  ? weeklyReports.map((report, index) => ({
                      date: new Date(report.weekStart).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
                      achievement: `Rapport semaine du ${new Date(report.weekStart).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`,
                      description: report.summary ?? `Moyenne de la semaine : ${report.averageScore ? Math.round(report.averageScore) + "%" : "en cours"}`,
                    }))
                  : [
                      { date: "Janvier 2024", achievement: "Progression en autonomie",         description: "Michael a commencé à utiliser plus régulièrement les outils numériques de manière autonome." },
                      { date: "Mars 2024",    achievement: "Amélioration de la communication", description: "Michael exprime mieux ses besoins et communique plus facilement avec son entourage." },
                      { date: "Juin 2024",    achievement: "Développement de la créativité",   description: "Michael explore de nouvelles activités créatives et montre un grand intérêt pour l'art." },
                    ]
                ).map((progress, index) => (
                  <motion.div
                    key={index}
                    initial={disableMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={disableMotion ? instant : { delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        <Star className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{progress.date}</span>
                      </div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{progress.achievement}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{progress.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Galerie photos ── */}
        <motion.div
          initial={disableMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={disableMotion ? instant : { duration: 0.6, delay: 0.8 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-950 dark:to-rose-950">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="text-pink-600" />
                Souvenirs et moments importants de {prenom}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <motion.div
                        whileHover={disableMotion ? {} : { scale: 1.05 }}
                        whileTap={disableMotion ? {} : { scale: 0.95 }}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                      >
                        <Image
                          src={image}
                          alt={`${prenom} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogTitle>Photo de {prenom}</DialogTitle>
                      <div className="relative aspect-video">
                        <Image src={image} alt={prenom} fill className="object-contain" />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Lien profil ── */}
        <motion.div
          initial={disableMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={disableMotion ? instant : { duration: 0.6, delay: 0.9 }}
          className="mt-10 text-center"
        >
          <Link href="/profile" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700">
            Voir mon profil
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}


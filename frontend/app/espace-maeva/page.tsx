"use client";
export const dynamic = "force-dynamic";

import { useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Heart,
  BookOpen,
  ArrowRight,
  Star,
  Calendar,
  Trophy,
  Music,
  Palette,
} from "lucide-react";

import { UserContext } from "@/context/UserContext";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";

// Seule Maeva peut accéder à cette page
const AUTHORIZED_EMAIL = "maevaayivor78500@gmail.com";

export default function EspaceMaevaPage() {
  const context = useContext(UserContext);
  const currentUser = context?.user ?? null;
  const router = useRouter();
  const { isMobile, shouldReduceAnimations } = useMobileOptimization({
    enableReducedMotion: true,
  });
  const prefersReducedMotion = useReducedMotion();
  const disableMotion =
    isMobile || prefersReducedMotion || shouldReduceAnimations;
  const instantTransition = { duration: 0 };

  const isAuthorized =
    currentUser?.email?.toLowerCase?.() === AUTHORIZED_EMAIL.toLowerCase();

  useEffect(() => {
    if (currentUser === null) {
      router.replace("/");
    } else if (currentUser && !isAuthorized) {
      router.replace("/");
    }
  }, [currentUser, isAuthorized, router]);

  if (!currentUser || !isAuthorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6 text-center dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <p className="mb-6 max-w-lg text-lg font-semibold text-gray-700 dark:text-gray-200">
          Cet espace est réservé à Maeva. 💜
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Revenir à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-900">
      <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 md:px-8">
        {/* Hero Section */}
        <motion.section
          initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            disableMotion
              ? instantTransition
              : { duration: 0.8, ease: "easeOut" }
          }
          className="relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl backdrop-blur dark:border-white/5 dark:bg-gray-900"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-blue-400/20" />
          
          {/* Cercles animés en arrière-plan */}
          <motion.div 
            className="absolute -left-24 top-20 h-48 w-48 rounded-full bg-pink-400/30 blur-3xl"
            animate={disableMotion ? {} : { 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-purple-400/30 blur-3xl"
            animate={disableMotion ? {} : { 
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative p-8 md:p-14 text-center">
            {/* Badge de bienvenue avec animation bounce */}
            <motion.div 
              className="flex justify-center mb-4"
              initial={disableMotion ? {} : { scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={disableMotion ? instantTransition : { 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.2
              }}
            >
              <motion.span 
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-lg font-bold text-white shadow-lg"
                whileHover={disableMotion ? {} : { scale: 1.05 }}
                whileTap={disableMotion ? {} : { scale: 0.95 }}
              >
                <motion.span
                  animate={disableMotion ? {} : { rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.span>
                Bienvenue Maeva !
                <motion.span
                  animate={disableMotion ? {} : { rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.span>
              </motion.span>
            </motion.div>
            
            {/* Date du jour avec animation */}
            <motion.p 
              className="text-lg text-purple-600 dark:text-purple-300 font-medium mb-6"
              initial={disableMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={disableMotion ? instantTransition : { delay: 0.4, duration: 0.5 }}
            >
              📅 {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </motion.p>
            
            {/* Titre avec animation */}
            <motion.h1 
              className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mb-4"
              initial={disableMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={disableMotion ? instantTransition : { delay: 0.5, duration: 0.6 }}
            >
              Mon Espace Personnel{" "}
              <motion.span
                animate={disableMotion ? {} : { 
                  scale: [1, 1.2, 1],
                }}
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
              transition={disableMotion ? instantTransition : { delay: 0.7, duration: 0.5 }}
            >
              Cet espace est rien qu'à toi, Maeva ! Tu peux y retrouver tes activités préférées, 
              tes réussites et plein de surprises.
            </motion.p>

            {/* Badges avec animation stagger */}
            <motion.div 
              className="mt-8 flex flex-wrap justify-center gap-4"
              initial={disableMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={disableMotion ? instantTransition : { delay: 0.9 }}
            >
              {[
                { icon: Star, text: "Super élève", colors: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-200" },
                { icon: Heart, text: "Créative", colors: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200" },
                { icon: Trophy, text: "Courageuse", colors: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200" }
              ].map((badge, index) => (
                <motion.span
                  key={badge.text}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${badge.colors}`}
                  initial={disableMotion ? {} : { opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={disableMotion ? instantTransition : { 
                    delay: 1 + index * 0.15,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={disableMotion ? {} : { scale: 1.1, y: -2 }}
                >
                  <motion.span
                    animate={disableMotion ? {} : { rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 1.5 + index * 0.2, repeat: Infinity, repeatDelay: 4 }}
                  >
                    <badge.icon className="h-4 w-4" />
                  </motion.span>
                  {badge.text}
                </motion.span>
              ))}
            </motion.div>

            {/* Bouton vers les contrôles */}
            <motion.div
              className="mt-10"
              initial={disableMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={disableMotion ? instantTransition : { delay: 1.3, duration: 0.5 }}
            >
              <Link href="/controle">
                <motion.button
                  className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white shadow-xl hover:shadow-2xl transition-shadow"
                  whileHover={disableMotion ? {} : { scale: 1.05, y: -3 }}
                  whileTap={disableMotion ? {} : { scale: 0.95 }}
                >
                  <motion.span
                    animate={disableMotion ? {} : { rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    📝
                  </motion.span>
                  Mes Contrôles
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Sections d'activités */}
        <motion.section
          initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            disableMotion
              ? instantTransition
              : { duration: 0.6, delay: 0.1, ease: "easeOut" }
          }
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">Tu fais de ton mieux chaque jour</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-4 dark:from-green-900/30 dark:to-emerald-900/30">
                <span className="text-3xl">⭐</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Toujours curieuse</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Tu aimes apprendre de nouvelles choses</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 p-4 dark:from-pink-900/30 dark:to-rose-900/30">
                <span className="text-3xl">💖</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Pleine de talent</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Tu es unique et merveilleuse</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Galerie Photos de Maeva */}
        <motion.section
          initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            disableMotion
              ? instantTransition
              : { duration: 0.6, delay: 0.15, ease: "easeOut" }
          }
          className="mt-10 rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-xl dark:border-pink-900/40 dark:bg-gray-900/80"
        >
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white mb-6">
            <Heart className="h-6 w-6 text-pink-500" />
            Mes Photos 📸
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg group">
              <Image
                src="/assets/maeva/Maeva.webp"
                alt="Maeva souriante"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg group">
              <Image
                src="/assets/maeva/Maeva1.webp"
                alt="Maeva"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg group">
              <Image
                src="/assets/maeva/IMG_1427.webp"
                alt="Maeva en train de dessiner"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg group">
              <Image
                src="/assets/maeva/IMG_2203.webp"
                alt="Maeva concentrée"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg group">
              <Image
                src="/assets/maeva/IMG_2248.webp"
                alt="Maeva"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg group">
              <Image
                src="/assets/maeva/Maevanini.webp"
                alt="Maeva petite"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg group">
              <Image
                src="/assets/maeva/IMG_1411.webp"
                alt="Maeva"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="relative h-48 md:col-span-1 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg flex items-center justify-center">
              <div className="text-center text-white p-4">
                <span className="text-4xl">💜</span>
                <p className="mt-2 font-semibold">Tu es magnifique !</p>
              </div>
            </div>
          </div>
        </motion.section>
        <motion.section
          initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            disableMotion
              ? instantTransition
              : { duration: 0.6, delay: 0.2, ease: "easeOut" }
          }
          className="mt-10 rounded-3xl border border-gray-200 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-8 shadow-xl text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">
            Tu es formidable, Maeva ! 🌟
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Continue d'apprendre, de créer et de t'amuser. 
            On est tous très fiers de toi !
          </p>
          <div className="mt-6 flex justify-center gap-4 text-4xl">
            <span>💜</span>
            <span>🌈</span>
            <span>✨</span>
            <span>🎨</span>
            <span>📚</span>
          </div>
        </motion.section>

        {/* Lien vers le profil */}
        <motion.div
          initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            disableMotion
              ? instantTransition
              : { duration: 0.6, delay: 0.3, ease: "easeOut" }
          }
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

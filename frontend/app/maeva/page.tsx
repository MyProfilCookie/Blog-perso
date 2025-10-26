"use client";

import { useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  BookOpen,
  ArrowRight,
  Feather,
  Star,
  Compass,
} from "lucide-react";

import { UserContext } from "@/context/UserContext";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";

const AUTHORIZED_EMAIL = "virginie.ayivor@yahoo.fr";

const milestones = [
  {
    year: "2010",
    title: "Une naissance lumineuse",
    description:
      "Maeva arrive le 26 octobre 2010. Dès ses premières heures, elle illumine sa famille par sa présence et sa curiosité silencieuse.",
  },
  {
    year: "2014",
    title: "Les premiers mots avec le classeur PECS",
    description:
      "Grâce aux pictogrammes, Maeva apprend à se faire comprendre, à exprimer ses envies et ses besoins. Une étape fondatrice pour sa confiance.",
  },
  {
    year: "2020",
    title: "L’école à la maison",
    description:
      "La famille choisit l’instruction à domicile. Les apprentissages s’organisent autour d’un planning sensoriel, loin de l’agitation des classes traditionnelles et adapté à sa déficience intellectuelle.",
  },
  {
    year: "Aujourd’hui",
    title: "Une visionnaire",
    description:
      "Maeva co-inspire AutiStudy. Elle déteste toujours les chiens et les oiseaux, mais elle adore comprendre, progresser et transmettre.",
  },
];

const favorites = [
  {
    icon: <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />,
    title: "Apprendre avec douceur",
    description:
      "Maeva adore découvrir des sujets nouveaux lorsqu’ils sont présentés avec clarté et visuels rassurants.",
  },
  {
    icon: <Heart className="h-5 w-5 text-rose-600 dark:text-rose-300" />,
    title: "Moments partagés",
    description:
      "Elle aime travailler avec des personnes de confiance, dans des espaces où elle peut se sentir accueillie telle qu'elle est.",
  },
  {
    icon: <Compass className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />,
    title: "Repères sensoriels",
    description:
      "Loin des chiens et des oiseaux, Maeva choisit toujours des environnements apaisants qui respectent ses sensibilités.",
  },
];

const mangaHighlights = [
  {
    title: "Univers Manga",
    description:
      "Maeva se passionne pour les héroïnes qui apprennent en dépassant leurs limites et collectionne des planches colorées qui lui donnent confiance.",
    image: "/assets/maeva/Maeva1.webp",
  },
  {
    title: "Carnets illustrés",
    description:
      "Ses carnets de travail mélangent pictogrammes PECS et dessins inspirés de ses mangas préférés, sans jamais faire place aux chiens ou aux oiseaux qu’elle redoute.",
    image: "/assets/art/art.webp",
  },
  {
    title: "Apprentissages guidés",
    description:
      "Chaque nouveau chapitre d’AutiStudy est testé à la maison avec Maeva : activités scénarisées, supports sensoriels et fiches visuelles personnalisées.",
    image: "/assets/resources/tools.webp",
  },
];

const dailyRituals = [
  {
    title: "Routine sensorielle du matin",
    description:
      "Respirations guidées, musique douce et check-list visuelle pour ouvrir la journée sans surcharge.",
  },
  {
    title: "Temps d’étude modulaires",
    description:
      "Séquences de 25 minutes suivies d’une pause sensorielle, adaptées à son rythme de concentration.",
  },
  {
    title: "Ateliers créatifs",
    description:
      "Carnets manga, expériences scientifiques simplifiées et jeux de logique partagés avec la famille.",
  },
  {
    title: "Journal de gratitude",
    description:
      "Chaque soir, Maeva note trois réussites ou sensations agréables pour clôturer la journée positivement.",
  },
];

const supportingLinks = [
  {
    label: "Classeur PECS favori",
    href: "/resources/tools",
    description: "Nos supports visuels à imprimer qui ont accompagné Maeva dès ses premiers mots.",
  },
  {
    label: "Lettre douce du dimanche",
    href: "/resources/trainings",
    description: "Une routine familiale inspirée par Maeva pour partager idées sensorielles et encouragements.",
  },
  {
    label: "Studio créatif AutiStudy",
    href: "/shop",
    description: "Sélection de matériels sensoriels et carnets illustrés testés avec elle.",
  },
];

export default function MaevaPage() {
  const context = useContext(UserContext);
  const currentUser = context?.user ?? null;
  const router = useRouter();
  const { isMobile } = useMobileOptimization({ enableReducedMotion: true });

  const isAuthorized =
    currentUser?.email?.toLowerCase?.() === AUTHORIZED_EMAIL;

  useEffect(() => {
    if (currentUser === null) {
      // utilisateur non connecté
      router.replace("/");
    } else if (currentUser && !isAuthorized) {
      router.replace("/");
    }
  }, [currentUser, isAuthorized, router]);

  if (!currentUser || !isAuthorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 text-center dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <p className="mb-6 max-w-lg text-lg font-semibold text-gray-700 dark:text-gray-200">
          Cette page est un espace intime réservé à Maeva et à sa famille.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Revenir à l’accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-900">
      <div className="mx-auto w-full px-4 pb-16 pt-10 md:px-8 lg:px-12">
        <motion.section
          initial={isMobile ? undefined : { opacity: 0, y: 24 }}
          animate={isMobile ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl backdrop-blur dark:border-white/5 dark:bg-gray-900"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-rose-400/20" />
          <div className="absolute -left-24 top-20 h-48 w-48 rounded-full bg-blue-400/30 blur-3xl" />
          <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-pink-400/30 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />

          <div className="relative grid gap-12 p-8 md:grid-cols-[1.15fr_0.85fr] md:p-14">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-100/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">
                  Espace privé Maeva
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-purple-700 shadow-sm dark:bg-purple-900/40 dark:text-purple-200">
                  Depuis 2010
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
                Maeva, le cœur battant d’AutiStudy
              </h1>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-blue-300">
                Bienvenue sur ma page
              </p>
              <p className="text-base text-gray-600 dark:text-gray-300 md:text-lg">
                Née le 26 octobre 2010, Maeva vit avec une déficience intellectuelle et une grande
                sensibilité sensorielle. Sa manière d’apprendre – douce, structurée, créative – inspire
                chaque parcours que nous imaginons pour les familles AutiStudy.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-blue-100/80 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-blue-900/40 dark:bg-blue-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-200">
                    Ce qu’elle aime
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Les cours à la maison, les carnets manga, les défis logiques qui respectent son rythme.
                  </p>
                </div>
                <div className="rounded-3xl border border-purple-100/80 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-purple-900/40 dark:bg-purple-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-700 dark:text-purple-200">
                    Ce qui la protège
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Un environnement apaisant, loin des chiens et des oiseaux, nourri de supports visuels rassurants.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:bg-blue-900/30 dark:text-blue-200">
                  <Sparkles className="h-4 w-4" /> 15 ans de rayonnement
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm dark:bg-purple-900/30 dark:text-purple-200">
                  <BookOpen className="h-4 w-4" /> PECS &amp; passion d’apprendre
                </span>
              </div>
            </div>

            <div className="relative h-[22rem] overflow-visible">
              <div className="absolute inset-0 -translate-x-6 rounded-3xl border backdrop-blur dark:border-white/10 dark:bg-gray-900/70" />
              <Image
                src="/assets/maeva/Maeva.webp"
                alt="Maeva souriante"
                fill
                className="relative rounded-3xl object-cover shadow-2xl"
                priority
              />
              <div className="absolute -bottom-12 left-6 h-32 w-32 overflow-hidden rounded-2xl border border-white/70 shadow-lg dark:border-white/10">
                <Image
                  src="/assets/maeva/IMG_2203.webp"
                  alt="Maeva concentrée sur un atelier"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-10 right-0 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-900">
                <Image
                  src="/assets/maeva/IMG_1427.webp"
                  alt="Maeva en train de dessiner"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-6 right-4 max-w-xs rounded-2xl bg-gray-900/85 px-4 py-3 text-xs text-white shadow-2xl sm:text-sm">
                « Je préfère les salles calmes, les carnets et les défis logiques. »
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={isMobile ? undefined : { opacity: 0, y: 24 }}
          animate={isMobile ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mt-12 grid gap-8 md:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-xl dark:border-blue-900/40 dark:bg-gray-900/80">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Son parcours en quatre étapes clés
            </h2>
            <div className="mt-8 space-y-6">
              {milestones.map((milestone) => (
                <div
                  key={milestone.year}
                  className="flex gap-4 rounded-3xl border border-blue-100 bg-white/80 p-5 shadow-sm transition hover:border-blue-200 dark:border-blue-900/30 dark:bg-gray-900/70 dark:hover:border-blue-700"
                >
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-lg font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                    {milestone.year}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl dark:border-purple-900/40 dark:bg-gray-900/80">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ce que Maeva aime (et ce qu’elle évite)
              </h3>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Les chiens et les oiseaux ne font pas partie de ses passions — mais
                offrez-lui un projet à comprendre, une histoire à décoder ou un
                défi logico-sensoriel, et elle s’y plonge avec enthousiasme.
              </p>
              <div className="mt-5 grid gap-4">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.title}
                    className="flex items-start gap-3 rounded-3xl border border-gray-100 bg-white/80 px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900/70"
                  >
                    <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                      {favorite.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {favorite.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {favorite.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-xl dark:border-blue-900/40 dark:bg-gray-900/80">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 dark:text-blue-200">
                <Feather className="h-5 w-5" />
                Son héritage dans AutiStudy
              </h3>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Maeva nous guide vers des contenus apaisants, structurés et inclusifs.
                Sa façon d’apprendre, de rejeter ce qui l’inconforte et d’embrasser
                ce qui la rassure inspire nos parcours personnalisés.
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2 rounded-full bg-blue-100/70 px-3 py-1 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                  <Star className="h-4 w-4" />
                  Co-création des routines visuelles AutiStudy
                </div>
                <div className="flex items-center gap-2 rounded-full bg-blue-100/70 px-3 py-1 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                  <Star className="h-4 w-4" />
                  Inspiration des séries “Lettre douce” du dimanche
                </div>
                <div className="flex items-center gap-2 rounded-full bg-blue-100/70 px-3 py-1 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                  <Star className="h-4 w-4" />
                  Tests en famille sur les outils sensoriels de la boutique
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={isMobile ? undefined : { opacity: 0, y: 24 }}
          animate={isMobile ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-12 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900/80"
        >
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                « Maeva, c’est notre raison d’inventer AutiStudy. »
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 md:text-base">
                AutiStudy grandit avec elle, pour elle, et pour toutes les familles
                qui cherchent un accompagnement respectueux et créatif.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-purple-700"
              >
                Nous écrire un mot pour Maeva
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-0.5">
              <div className="rounded-3xl bg-white/95 p-6 text-sm text-gray-600 shadow-xl dark:bg-gray-900/90 dark:text-gray-300">
                <p>
                  Maeva déteste les chiens et les oiseaux, mais elle adore les mots,
                  les chiffres et les scénarios sociaux. Chaque nouvelle fonctionnalité
                  est testée à travers son regard exigeant — c’est notre meilleure
                  garante de qualité.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={isMobile ? undefined : { opacity: 0, y: 24 }}
          animate={isMobile ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {mangaHighlights.map((item) => (
            <div
              key={item.title}
              className="group overflow-hidden rounded-3xl border border-purple-100 bg-white/90 shadow-lg transition hover:-translate-y-1 hover:border-purple-200 dark:border-purple-900/30 dark:bg-gray-900/75"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-5 text-sm text-gray-600 dark:text-gray-300">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </motion.section>

        <motion.section
          initial={isMobile ? undefined : { opacity: 0, y: 24 }}
          animate={isMobile ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-12 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900/80"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Instants de vie
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 md:text-base">
            Quelques clichés que nous aimons partager : les séances de travail à la maison,
            les pauses manga et les moments de fierté après un apprentissage.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "/assets/maeva/IMG_1427.webp",
              "/assets/maeva/IMG_2203.webp",
              "/assets/maeva/IMG_2248.webp",
              "/assets/maeva/Maevanini.webp",
            ].map((src) => (
              <div
                key={src}
                className="relative h-48 overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800"
              >
                <Image
                  src={src}
                  alt="Souvenir de Maeva"
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={isMobile ? undefined : { opacity: 0, y: 24 }}
          animate={isMobile ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
        >
          <div className="rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-xl dark:border-blue-900/40 dark:bg-gray-900/80">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Sa journée à la maison
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 md:text-base">
              Les cours à domicile de Maeva sont rythmés par des repères sensoriels,
              des temps de respiration et des séquences pédagogiques courtes.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {dailyRituals.map((ritual) => (
                <div
                  key={ritual.title}
                  className="rounded-3xl border border-blue-100 bg-white/80 p-4 shadow-sm transition hover:border-blue-200 dark:border-blue-900/30 dark:bg-gray-900/70 dark:hover:border-blue-700"
                >
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-200">
                    {ritual.title}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {ritual.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white/90 p-8 shadow-xl dark:border-purple-900/40 dark:bg-gray-900/80">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ressources qu’elle inspire
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Chaque lien ci-dessous existe parce que Maeva en a piloté les besoins ou
              a testé la version pilote à la maison.
            </p>
            <div className="mt-6 space-y-4">
              {supportingLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-start justify-between gap-4 rounded-3xl border border-purple-100 bg-white/80 px-5 py-4 text-sm shadow-sm transition hover:border-purple-200 hover:text-purple-700 dark:border-purple-900/30 dark:bg-gray-900/70 dark:hover:border-purple-700 dark:hover:text-purple-200"
                >
                  <span>
                    <strong className="block text-gray-900 dark:text-white">
                      {item.label}
                    </strong>
                    <span className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

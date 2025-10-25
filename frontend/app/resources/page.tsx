"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BackButton from "@/components/back";
import OptimizedImage from "@/components/OptimizedImage";
import { Card, CardBody } from "@nextui-org/react";
import {
  BookOpen,
  Sparkles,
  Puzzle,
  GraduationCap,
  HeartHandshake,
  Download,
  Headphones,
  BrainCircuit,
  CalendarRange,
  ArrowRight,
} from "lucide-react";

const resourceCollections = [
  {
    title: "Guides & Fiches pratiques",
    description:
      "Des supports clairs pour accompagner les routines, préparer une inclusion, ou expliquer un changement.",
    icon: <BookOpen className="h-5 w-5" />,
    accent: "from-blue-500/90 to-blue-400/80",
    link: "/resources/tools",
    illustration: "/assets/resources/tools.webp",
  },
  {
    title: "Activités sensorielles clés en main",
    description:
      "Des idées d’ateliers à mettre en place à la maison ou en structure, classées par âge et besoins sensoriels.",
    icon: <Puzzle className="h-5 w-5" />,
    accent: "from-purple-500/90 to-pink-500/80",
    link: "/resources/games",
    illustration: "/assets/resources/games.webp",
  },
  {
    title: "Apps & outils numériques",
    description:
      "Sélection d’applications vérifiées par la famille AutiStudy pour développer autonomie et communication.",
    icon: <BrainCircuit className="h-5 w-5" />,
    accent: "from-emerald-500/90 to-teal-400/80",
    link: "/resources/apps",
    illustration: "/assets/resources/apps.webp",
  },
  {
    title: "Formations & ateliers en direct",
    description:
      "Sessions animées par nos experts et parents ambassadeurs pour approfondir la neuroéducation.",
    icon: <GraduationCap className="h-5 w-5" />,
    accent: "from-orange-500/90 to-yellow-500/80",
    link: "/resources/trainings",
    illustration: "/assets/resources/trainings.webp",
  },
];

const familyToolbox = [
  {
    title: "Lettre douce hebdomadaire",
    description:
      "Chaque dimanche : une activité sensorielle, un script social, un mot de soutien.",
    icon: <HeartHandshake className="h-5 w-5 text-rose-500" />,
  },
  {
    title: "Playlists apaisantes",
    description:
      "Sélection de sons et musiques testées avec nos enfants pour se recentrer ou s’endormir.",
    icon: <Headphones className="h-5 w-5 text-blue-500" />,
  },
  {
    title: "Tableaux de suivi imprimables",
    description:
      "Visualisez les réussites de la semaine, valorisez les efforts et préparez les rendez-vous.",
    icon: <Download className="h-5 w-5 text-emerald-500" />,
  },
];

const upcomingEvents = [
  {
    title: "Atelier parents / enseignants",
    date: "Mardi 4 février — 20h",
    description:
      "Construire un cahier de liaison sensoriel efficace entre la maison et l’école.",
  },
  {
    title: "Masterclass Autonomie quotidienne",
    date: "Samedi 15 février — 10h",
    description:
      "Pas-à-pas pour créer des routines pictogrammes et introductions sociales.",
  },
  {
    title: "Cercle de partage familles",
    date: "Dernier jeudi du mois",
    description:
      "Rencontres en petit groupe pour échanger astuces et défis, animé par Virginie.",
  },
];

const motionConfig = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
  viewport: { once: true, margin: "-50px" },
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 blur-3xl opacity-60 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40" />
        <div className="relative z-10 px-4 pt-10 md:px-8">
          <BackButton label="Retour à l'accueil" />
          <motion.div
            {...motionConfig}
            className="max-w-3xl mx-auto text-center space-y-4"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
              Espace Ressources
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Les essentiels AutiStudy pour accompagner votre quotidien
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              Retrouvez nos supports créés par la famille AutiStudy, nos éducateurs et la
              communauté : fiches pratiques, ateliers sensoriels, masterclass et outils numériques.
            </p>
            <div className="mx-auto max-w-2xl rounded-2xl border border-blue-100 bg-white/90 px-6 py-4 text-sm text-blue-700 shadow-sm backdrop-blur dark:border-blue-900/40 dark:bg-gray-900/80 dark:text-blue-200">
              <strong>Comment démarrer ?</strong> Choisissez une collection ci-dessous,
              puis explorez les fiches et suggestions d&apos;activités. Tous les contenus sont
              prêts à l&apos;emploi et mis à jour chaque mois.
            </div>
          </motion.div>
        </div>
      </div>

      <main className="relative z-10 space-y-16 md:space-y-20 px-4 md:px-8 lg:px-12 pb-16 md:pb-24">
        <section className="max-w-6xl mx-auto">
          <motion.div {...motionConfig} className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {resourceCollections.map((item) => (
                <Link key={item.title} href={item.link}>
                  <Card className="group h-full overflow-hidden border-none shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
                    <CardBody className="flex flex-col gap-5 p-5 md:p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${item.accent} text-white shadow-lg`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-2xl">
                        <OptimizedImage
                          src={item.illustration}
                          alt={item.title}
                          width={960}
                          height={540}
                          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm font-semibold text-blue-600 dark:text-blue-300">
                        <span>Explorer les contenus</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="max-w-6xl mx-auto">
          <motion.div {...motionConfig} className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-3xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 p-1">
              <div className="rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur dark:bg-gray-900/80">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Boîte à outils des familles
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Nos ressources favorites pour créer des moments rassurants et encourager
                  l’autonomie en douceur.
                </p>
                <ul className="mt-6 space-y-4">
                  {familyToolbox.map((tool) => (
                    <li
                      key={tool.title}
                      className="flex items-start gap-3 rounded-2xl border border-purple-100 bg-white/90 px-4 py-3 text-sm leading-relaxed shadow-sm dark:border-purple-900/40 dark:bg-gray-900/70 dark:text-gray-200"
                    >
                      <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-purple-50">
                        {tool.icon}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {tool.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Card className="border-none bg-gradient-to-br from-blue-600 via-purple-600 to-rose-500 text-white shadow-2xl">
              <CardBody className="space-y-5 p-6 md:p-8">
                <h2 className="text-2xl font-semibold">
                  Recevez un nouveau pack ressources chaque mois
                </h2>
                <p className="text-sm text-white/80">
                  Dossiers thématiques, vidéos explicatives, scripts sociaux et routines visuelles
                  prêts à l&apos;emploi directement dans votre boîte mail.
                </p>
                <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm text-white/90">
                  <strong>Prochain envoi :</strong> Pack “Préparer les vacances scolaires” —
                  calendrier visuel, idées de transition et fiches sensorimotrices.
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-slate-100"
                >
                  Je souhaite le recevoir <ArrowRight className="h-4 w-4" />
                </Link>
              </CardBody>
            </Card>
          </motion.div>
        </section>

        <section className="max-w-6xl mx-auto">
          <motion.div {...motionConfig} className="rounded-3xl border border-teal-100 bg-white/95 p-6 shadow-xl dark:border-teal-900/40 dark:bg-gray-900/80">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
                  Agenda AutiStudy
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Des rendez-vous pour apprendre et souffler
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                  Participez à nos ateliers en ligne et retrouvez des ressources pour prolonger l’expérience à la maison. Chaque mois,
                  nous ajoutons des contenus pratiques, des fiches sensorimotrices et des vidéos explicatives.
                </p>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.title}
                      className="rounded-2xl border border-teal-100 bg-white/90 px-4 py-3 text-sm leading-relaxed shadow-sm dark:border-teal-900/40 dark:bg-gray-900/70 dark:text-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {event.title}
                        </h3>
                        <span className="rounded-full border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-600 dark:border-teal-900/40 dark:text-teal-200">
                          {event.date}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-teal-600 hover:to-blue-600"
                  >
                    Voir le programme complet
                  </Link>
                  <Link
                    href="/resources/trainings"
                    className="inline-flex items-center gap-2 rounded-full border border-teal-200 px-5 py-2.5 text-sm font-semibold text-teal-700 transition hover:border-teal-300 hover:text-teal-800 dark:border-teal-900/40 dark:text-teal-200 dark:hover:border-teal-700"
                  >
                    <CalendarRange className="h-4 w-4" />
                    Réserver un atelier
                  </Link>
                </div>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-500/10 p-1">
                <div className="rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur dark:bg-gray-900/80">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Ce que vous obtenez
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-300" />
                      Des fiches d&apos;activités sensorimotrices prêtes à l&apos;emploi pour rythmer vos semaines.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-300" />
                      Des vidéos explicatives courtes à regarder avec votre enfant pour lancer un nouveau rituel.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-300" />
                      Des supports de communication pour dialoguer sereinement avec l’école ou les thérapeutes.
                    </li>
                  </ul>
                  <div className="mt-6 rounded-2xl border border-teal-100 bg-white/90 px-4 py-3 text-sm text-teal-700 shadow-sm dark:border-teal-900/40 dark:bg-gray-900/70 dark:text-teal-200">
                    <Headphones className="mr-2 inline h-4 w-4" />
                    Abonnez-vous à notre lettre douce : chaque dimanche, une suggestion sensorielle, une activité à imprimer et un mot de soutien.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

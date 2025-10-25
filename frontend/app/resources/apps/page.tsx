"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardBody, CardFooter, Chip, Button } from "@nextui-org/react";
import BackButton from "@/components/back";
import {
  Phone,
  MessageCircle,
  Sparkles,
  Shield,
  Download,
  Apple,
  Smartphone,
  CheckCircle,
} from "lucide-react";

const heroVariant = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const appHighlights = [
  {
    title: "Communication augmentée",
    description:
      "Des applications validées par nos orthophonistes partenaires pour soutenir l’expression et l’écoute active.",
    icon: <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />,
    color: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
  },
  {
    title: "Autonomie guidée",
    description:
      "Des routines visuelles et des agendas interactifs pour favoriser les gestes du quotidien en toute confiance.",
    icon: <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />,
    color: "from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30",
  },
  {
    title: "Apprentissages ludiques",
    description:
      "Des expériences sensorielles et pédagogiques imaginées avec nos enfants pour apprendre en s’amusant.",
    icon: <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-300" />,
    color: "from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
  },
];

const featuredApps = [
  {
    name: "Proloquo2Go",
    goal: "Communication alternative et augmentée",
    description:
      "Clavier visuel personnalisable avec pictogrammes, voix naturelles et scénarios sociaux pour faciliter les échanges au quotidien.",
    platforms: [
      {
        label: "iOS",
        icon: <Apple className="h-4 w-4" />,
        href: "https://apps.apple.com/us/app/proloquo2go/id308368164",
      },
    ],
    tags: ["Communication", "Pictogrammes", "Personnalisation"],
    color: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    name: "Choiceworks",
    goal: "Routines et gestion émotionnelle",
    description:
      "Tableaux visuels pour structurer la journée, planifier des tâches et exprimer ses émotions avec des supports visuels apaisants.",
    platforms: [
      {
        label: "iOS",
        icon: <Apple className="h-4 w-4" />,
        href: "https://apps.apple.com/us/app/choiceworks/id486210964",
      },
    ],
    tags: ["Routines", "Émotions", "Autonomie"],
    color: "bg-emerald-50 dark:bg-emerald-900/30",
  },
  {
    name: "Endless Reader",
    goal: "Lecture ludique",
    description:
      "Mini-jeux pour associer lettres, sons et mots, avec animations positives pour renforcer la compréhension écrite.",
    platforms: [
      {
        label: "iOS",
        icon: <Apple className="h-4 w-4" />,
        href: "https://apps.apple.com/us/app/endless-reader/id722910739",
      },
      {
        label: "Android",
        icon: <Smartphone className="h-4 w-4" />,
        href: "https://play.google.com/store/apps/details?id=com.originatorkids.EndlessReader",
      },
    ],
    tags: ["Lecture", "Phonologie", "Mini-jeux"],
    color: "bg-purple-50 dark:bg-purple-900/30",
  },
  {
    name: "See.Touch.Learn",
    goal: "Enrichissement du vocabulaire",
    description:
      "Bibliothèque d’images classées par thèmes pour travailler la catégorisation, la correspondance et la reconnaissance visuelle.",
    platforms: [
      {
        label: "iOS",
        icon: <Apple className="h-4 w-4" />,
        href: "https://apps.apple.com/us/app/see-touch-learn/id377860936",
      },
    ],
    tags: ["Langage", "Catégorisation", "Visuel"],
    color: "bg-orange-50 dark:bg-orange-900/30",
  },
];

const familyTips = [
  {
    title: "Co-navigation",
    description:
      "Accompagnez les premières utilisations pour modéliser les gestes, rassurer et valoriser les réussites.",
  },
  {
    title: "Limiter la surcharge",
    description:
      "Activez progressivement les fonctionnalités : mieux vaut peu d’icônes bien maîtrisées que de nombreuses options difficiles à exploiter.",
  },
  {
    title: "Ancrer dans la réalité",
    description:
      "Reliez chaque réussite numérique à une situation vécue (dire bonjour, préparer son sac) pour renforcer l’apprentissage concret.",
  },
];

const resourceLinks = [
  {
    title: "Guide d’intégration des apps AutiStudy",
    description:
      "PDF à imprimer pour planifier les sessions, noter les réactions sensorielles et suivre les progrès.",
    href: "/contact?subject=guide-apps",
  },
  {
    title: "Playlist d’histoires sociales",
    description:
      "Historiettes audio à écouter avant une nouvelle activité pour préparer l’enfant en douceur.",
    href: "/contact?subject=playlist-histoires",
  },
  {
    title: "Session collective “Apps & Autonomie”",
    description:
      "Atelier en visio tous les 15 jours pour partager vos retours et découvrir de nouveaux usages.",
    href: "/resources/trainings",
  },
];

export default function AppsPage() {
  return (
    <div className="space-y-16 pb-20">
      <BackButton label="Retour aux ressources" />

      <motion.section
        variants={heroVariant}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-px shadow-2xl"
      >
        <div className="grid gap-8 rounded-3xl bg-white/95 p-8 dark:bg-gray-900/90 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
              Applications recommandées
            </span>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              Les apps qui simplifient la communication et l’autonomie
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Nous avons rassemblé les outils numériques que nous utilisons avec nos enfants,
              testés avec nos éducateurs et approuvés par la communauté AutiStudy.
              Découvrez comment les intégrer en douceur dans votre quotidien.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                as={Link}
                href="/controle"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
              >
                Ouvrir les parcours adaptés
              </Button>
              <Button
                as={Link}
                href="/resources/trainings"
                variant="bordered"
                className="border-blue-200 text-blue-700 hover:border-blue-300 dark:border-blue-900/40 dark:text-blue-200"
              >
                Participer aux ateliers
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-xs rounded-3xl bg-blue-600/10 p-4 shadow-inner dark:bg-blue-500/10">
              <Phone className="mx-auto h-16 w-16 text-blue-600 dark:text-blue-300" />
              <p className="mt-4 text-center text-sm text-blue-700 dark:text-blue-200">
                Conseil AutiStudy : préparez un petit rituel avant chaque session pour
                créer un moment attendu et rassurant.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          {appHighlights.map((item) => (
            <div
              key={item.title}
              className={`rounded-3xl bg-gradient-to-br ${item.color} p-6 shadow-lg`}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/70 backdrop-blur dark:bg-white/10">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notre sélection 2025
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Chaque application est testée par la famille AutiStudy, évaluée sur la clarté,
            la possibilité de personnalisation et le respect du rythme des enfants.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {featuredApps.map((app) => (
            <Card key={app.name} className={`${app.color} border-none shadow-xl`}>
              <CardBody className="space-y-4 p-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {app.name}
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-200">
                        {app.goal}
                      </p>
                    </div>
                    <Chip
                      className="bg-white/80 text-blue-700 dark:bg-white/10 dark:text-blue-200"
                      startContent={<Sparkles className="h-3.5 w-3.5" />}
                      variant="bordered"
                      size="sm"
                    >
                      Recommandé
                    </Chip>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{app.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {app.tags.map((tag) => (
                    <Chip key={tag} variant="flat" color="secondary" className="bg-white/70 dark:bg-white/10">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </CardBody>
              <CardFooter className="flex flex-wrap gap-3 border-t border-white/60 bg-white/40 px-6 py-4 dark:border-white/10 dark:bg-white/5">
                {app.platforms.map((platform) => (
                  <Button
                    key={platform.label}
                    as={Link}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="flat"
                    size="sm"
                    className="flex items-center gap-2 bg-white/70 text-blue-700 hover:bg-white dark:bg-white/10 dark:text-blue-200"
                  >
                    {platform.icon}
                    {platform.label}
                  </Button>
                ))}
                <Button
                  as={Link}
                  href="/resources/tools"
                  size="sm"
                  variant="ghost"
                  className="ml-auto text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Combiner avec nos fiches
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-none bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white shadow-2xl">
            <CardBody className="space-y-5 p-6 md:p-8">
              <h2 className="text-2xl font-semibold">
                Atelier “Apps & Autonomie” – prochain rendez-vous jeudi 20h
              </h2>
              <p className="text-sm text-white/80">
                En 60 minutes, nous vous aidons à configurer vos applications, partager
                les bonnes pratiques et répondre en direct à vos questions.
              </p>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Démonstrations en direct sur Proloquo2Go, Choiceworks et See.Touch.Learn</li>
                <li>• Études de cas réelles pour ajuster les pictogrammes et routines</li>
                <li>• Ressources à télécharger et support après l’atelier</li>
              </ul>
              <Button
                as={Link}
                href="/resources/trainings"
                className="bg-white text-blue-700 hover:bg-slate-100"
              >
                Réserver ma place
              </Button>
            </CardBody>
          </Card>

          <div className="space-y-4">
            <Card className="border-none bg-white/90 shadow-xl dark:bg-gray-900/80">
              <CardBody className="space-y-4 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Conseils pour une adoption sereine
                </h3>
                <div className="space-y-3">
                  {familyTips.map((tip) => (
                    <div
                      key={tip.title}
                      className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-gray-700 shadow-sm dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-gray-200"
                    >
                      <h4 className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-200">
                        <CheckCircle className="h-4 w-4" />
                        {tip.title}
                      </h4>
                      <p className="mt-1">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card className="border-none bg-white/90 shadow-xl dark:bg-gray-900/80">
              <CardBody className="space-y-4 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ressources complémentaires
                </h3>
                <div className="space-y-3">
                  {resourceLinks.map((resource) => (
                    <Link
                      key={resource.title}
                      href={resource.href}
                      className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm text-gray-700 transition hover:border-blue-200 hover:bg-blue-50/60 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-200 dark:hover:border-blue-900/40 dark:hover:bg-blue-900/20"
                    >
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                        <Download className="h-4 w-4" />
                      </span>
                      <span>
                        <strong className="block text-gray-900 dark:text-white">
                          {resource.title}
                        </strong>
                        {resource.description}
                      </span>
                    </Link>
                  ))}
                </div>

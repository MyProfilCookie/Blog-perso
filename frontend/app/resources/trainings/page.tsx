"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Chip,
} from "@nextui-org/react";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Users,
  Video,
  Download,
} from "lucide-react";
import BackButton from "@/components/back";
import OptimizedImage from "@/components/OptimizedImage";

const heroVariant = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const trainingHighlights = [
  {
    title: "Approche neuro-inclusive",
    description:
      "Contenus co-construits avec nos enseignants spécialisés, ergothérapeutes et familles ressources.",
    icon: (
      <GraduationCap className="h-5 w-5 text-amber-600 dark:text-amber-300" />
    ),
    gradient:
      "from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30",
  },
  {
    title: "Formats courts & concrets",
    description:
      "Sessions de 45 à 75 minutes avec démonstrations, ressources prêtes à l’emploi et temps d’échanges.",
    icon: <Video className="h-5 w-5 text-purple-600 dark:text-purple-300" />,
    gradient:
      "from-purple-100 via-pink-100 to-rose-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30",
  },
  {
    title: "Suivi après la formation",
    description:
      "Accès aux replays, fiches synthèse et salon Discord privé pour prolonger l’accompagnement.",
    icon: <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />,
    gradient:
      "from-blue-100 via-indigo-100 to-violet-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-violet-900/30",
  },
];

const upcomingSessions = [
  {
    title: "Créer un environnement sensoriel apaisant",
    date: "Mardi 11 février — 20h",
    duration: "75 minutes",
    format: "Visio interactive",
    description:
      "Apprenez à analyser les besoins sensoriels, ajuster la lumière, le son et le mobilier pour des journées sereines.",
    color: "bg-amber-50 dark:bg-amber-900/20",
    href: "/contact?session=sensoriel",
  },
  {
    title: "Routines visuelles à l’école et à la maison",
    date: "Jeudi 20 février — 12h30",
    duration: "60 minutes",
    format: "Replay + Q&A live",
    description:
      "Construisez un cahier de liaison efficace et des séquentiels visuels harmonisés pour accompagner la transition.",
    color: "bg-blue-50 dark:bg-blue-900/20",
    href: "/contact?session=routines",
  },
  {
    title: "Communication augmentée en duo",
    date: "Samedi 1er mars — 10h",
    duration: "90 minutes",
    format: "Atelier pratique",
    description:
      "Configuez votre app de CAA, entraînez-vous avec des scénarios et repartez avec des scripts sociaux personnalisés.",
    color: "bg-purple-50 dark:bg-purple-900/20",
    href: "/contact?session=caa",
  },
];

const programPillars = [
  "Analyse de cas concrets issus de la communauté AutiStudy.",
  "Modèles et fiches à personnaliser pour avancer dès la fin du cours.",
  "Séquences d’exercices progressives pour pratiquer entre deux rencontres.",
];

const supportResources = [
  {
    title: "Guide d’accueil des nouveaux accompagnants",
    description:
      "Un document clé en main pour présenter le profil sensoriel et les stratégies qui fonctionnent.",
    href: "/contact?subject=guide-accompagnants",
  },
  {
    title: "Calendrier des masterclass 2025",
    description:
      "Les 12 grandes thématiques AutiStudy pour planifier vos apprentissages sur l’année.",
    href: "/contact?subject=calendrier-masterclass",
  },
  {
    title: "Checklist inclusion école-maison",
    description:
      "Points de vigilance, questions à poser et éléments à partager avec l’équipe éducative.",
    href: "/contact?subject=checklist-inclusion",
  },
];

const TrainingsComponent = () => {
  return (
    <div className="space-y-16 pb-20">
      <BackButton label="Retour aux ressources" />

      <motion.section
        variants={heroVariant}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-pink-500/10 to-purple-500/10 p-px shadow-2xl"
      >
        <div className="grid gap-8 rounded-3xl bg-white/95 p-8 dark:bg-gray-900/90 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
              Formations & ateliers AutiStudy
            </span>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              Progresser ensemble, en live ou en replay guidé
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Des rencontres animées par nos spécialistes et parents ambassadeurs pour avancer
              pas à pas dans l’accompagnement, sans jamais être seul.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                as={Link}
                href="/controle"
                className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white shadow-lg hover:from-amber-600 hover:via-pink-600 hover:to-purple-700"
              >
                Voir les parcours recommandés
              </Button>
              <Button
                as={Link}
                href="/contact"
                variant="bordered"
                className="border-amber-200 text-amber-700 hover:border-amber-300 dark:border-amber-900/40 dark:text-amber-200"
              >
                Demander un devis équipe
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-xs overflow-hidden rounded-3xl bg-amber-600/10 p-4 shadow-inner dark:bg-amber-500/10">
              <OptimizedImage
                alt="Ateliers AutiStudy"
                className="h-64 w-full rounded-2xl object-cover"
                height={640}
                src="/assets/resources/trainings.webp"
                width={640}
              />
              <p className="mt-4 text-center text-sm text-amber-700 dark:text-amber-200">
                Chaque session inclut un temps de questions-réponses et un guide PDF à télécharger.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          {trainingHighlights.map((item) => (
            <div
              key={item.title}
              className={`rounded-3xl bg-gradient-to-br ${item.gradient} p-6 shadow-lg`}
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
            Prochaines sessions
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Choisissez votre créneau, participez en direct ou recevez le replay et les supports dans
            votre espace ressources.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {upcomingSessions.map((session) => (
            <Card key={session.title} className={`${session.color} border-none shadow-xl`}>
              <CardBody className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {session.title}
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-200">{session.date}</p>
                  </div>
                  <Chip
                    className="bg-white/80 text-amber-700 dark:bg-white/10 dark:text-amber-200"
                    startContent={<CalendarClock className="h-3.5 w-3.5" />}
                    size="sm"
                    variant="bordered"
                  >
                    {session.duration}
                  </Chip>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">
                  <Users className="h-3.5 w-3.5" />
                  {session.format}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200">{session.description}</p>
              </CardBody>
              <CardFooter className="border-t border-white/60 bg-white/40 px-6 py-4 dark:border-white/10 dark:bg-white/5">
                <Button
                  as={Link}
                  href={session.href}
                  size="sm"
                  className="w-full bg-white text-amber-700 hover:bg-slate-100 dark:bg-white/10 dark:text-amber-200"
                >
                  Je réserve ma place
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-none bg-gradient-to-br from-amber-500 via-pink-500 to-purple-500 text-white shadow-2xl">
            <CardBody className="space-y-5 p-6 md:p-8">
              <h2 className="text-2xl font-semibold">
                Parcours « Autonomie au quotidien » – 4 ateliers progressifs
              </h2>
              <p className="text-sm text-white/80">
                Un cycle pensé pour les familles et les accompagnants qui veulent structurer des
                routines solides tout en respectant le rythme de l’enfant.
              </p>
              <ul className="space-y-2 text-sm text-white/90">
                {programPillars.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <Button
                as={Link}
                href="/contact?session=autonomie"
                className="bg-white text-amber-700 hover:bg-slate-100"
              >
                Recevoir le programme détaillé
              </Button>
            </CardBody>
          </Card>

          <Card className="border-none bg-white/90 shadow-xl dark:bg-gray-900/80">
            <CardBody className="space-y-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Comment se déroule une formation ?
              </h3>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                <p className="flex items-start gap-2">
                  <Sparkles className="mt-1 h-4 w-4 text-amber-600 dark:text-amber-300" />
                  <span>
                    15 minutes d&apos;immersion avec un cas concret tiré des situations des familles
                    AutiStudy.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-4 w-4 text-amber-600 dark:text-amber-300" />
                  <span>
                    30 minutes d’outils pratiques et de démonstrations, prêts à transposer dans votre
                    environnement.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <MessageCircle className="mt-1 h-4 w-4 text-amber-600 dark:text-amber-300" />
                  <span>
                    15 minutes de questions-réponses guidées par un binôme expert + parent ambassadeur.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Users className="mt-1 h-4 w-4 text-amber-600 dark:text-amber-300" />
                  <span>
                    Accès à un espace d’échanges privé pour maintenir la dynamique entre les sessions.
                  </span>
                </p>
              </div>
              <Button
                as={Link}
                href="/resources/apps"
                variant="flat"
                className="w-full bg-amber-600/10 text-amber-700 hover:bg-amber-600/20 dark:bg-amber-500/10 dark:text-amber-200"
              >
                Préparer mes supports numériques
              </Button>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-5xl rounded-3xl border border-amber-100 bg-white/95 p-6 shadow-xl dark:border-amber-900/40 dark:bg-gray-900/80">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ressources offertes avec votre inscription
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Recevez nos supports exclusifs et partagez-les avec votre équipe éducative.
            </p>
          </div>
          <Button
            as={Link}
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-purple-600 text-white hover:from-amber-600 hover:to-purple-700"
          >
            Nous poser une question <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {supportResources.map((resource) => (
            <Link
              key={resource.title}
              href={resource.href}
              className="group flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm text-gray-700 transition hover:border-amber-200 hover:bg-amber-50/60 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-200 dark:hover:border-amber-900/40 dark:hover:bg-amber-900/20"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-amber-700 transition group-hover:translate-x-1 dark:text-amber-200">
                <Download className="h-4 w-4" />
                {resource.title}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {resource.description}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TrainingsComponent;

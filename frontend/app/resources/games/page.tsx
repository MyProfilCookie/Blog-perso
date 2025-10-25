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
  BadgeCheck,
  HandHeart,
  Joystick,
  Puzzle,
  Sprout,
  Users,
  Download,
} from "lucide-react";
import BackButton from "@/components/back";
import OptimizedImage from "@/components/OptimizedImage";

const heroVariant = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const gameHighlights = [
  {
    title: "Sensoriel & mouvement",
    description:
      "Jeux inspirés des besoins proprioceptifs et vestibulaires pour canaliser l’énergie et favoriser la coordination.",
    icon: <Sprout className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />,
    gradient:
      "from-emerald-100 via-teal-100 to-blue-100 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-blue-900/30",
  },
  {
    title: "Coopération douce",
    description:
      "Supports pour encourager les interactions, partager les règles et célébrer les progrès ensemble.",
    icon: <Users className="h-5 w-5 text-purple-600 dark:text-purple-300" />,
    gradient:
      "from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-orange-900/30",
  },
  {
    title: "Apprentissages incarnés",
    description:
      "Activités ludiques pour explorer les concepts académiques par le jeu, la manipulation et la répétition positive.",
    icon: <Puzzle className="h-5 w-5 text-blue-600 dark:text-blue-300" />,
    gradient:
      "from-blue-100 via-indigo-100 to-violet-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-violet-900/30",
  },
];

const experiencePacks = [
  {
    name: "Parcours calme et attention",
    focus: "Régulation sensorielle douce",
    description:
      "Jeu d’alignement tactile, cartes respiration et scénarios pour apprendre à savourer une pause sensorielle.",
    tags: ["Apaisement", "Respiration", "Textures"],
    href: "/contact?subject=parcours-calme",
    color: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "Aventure motrice du week-end",
    focus: "Motricité globale & coordination",
    description:
      "Circuit motorisé, cartes défis et tableau de réussites pour rythmer l’énergie de façon sécurisante.",
    tags: ["Motricité", "Planification", "Famille"],
    href: "/contact?subject=aventure-motrice",
    color: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    name: "Jeux pour raconter",
    focus: "Langage & narration visuelle",
    description:
      "Plateau d’histoires sociales, cartes émotions et dés d’inspiration pour enrichir le vocabulaire.",
    tags: ["Langage", "Storytelling", "Émotions"],
    href: "/contact?subject=jeux-raconter",
    color: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    name: "Mini-labo scientifique",
    focus: "Explorations sensorielles",
    description:
      "Fiches expériences simples, protocoles d’observation et tableau de prédictions pour éveiller la curiosité.",
    tags: ["Sciences", "Observation", "Expérimentation"],
    href: "/contact?subject=mini-labo",
    color: "bg-amber-50 dark:bg-amber-900/20",
  },
];

const ritualTips = [
  {
    title: "Ancrer un rituel d’ouverture",
    description:
      "Utilisez une cloche douce, un mouvement ou une phrase signal pour annoncer le début du jeu et rassurer.",
  },
  {
    title: "Nommer la sensation",
    description:
      "Après chaque exploration sensorielle, invitez votre enfant à décrire ce qu’il ressent avec un mot, un pictogramme ou un geste.",
  },
  {
    title: "Ritualiser la fin",
    description:
      "Une carte « bravo » ou un câlin compression préféré aide à clôturer le moment et passer à la suite sans rupture.",
  },
];

const goFurtherResources = [
  {
    title: "Webinaire « Jeux sensoriels sans surcharge »",
    description:
      "45 minutes avec notre psychomotricienne pour adapter vos activités selon le profil sensoriel de votre enfant.",
    href: "/resources/trainings",
  },
  {
    title: "Playlist de temps calmes guidés",
    description:
      "Audios de 5 minutes pour se recentrer entre deux activités ou préparer l’endormissement.",
    href: "/contact?subject=playlist-temps-calme",
  },
  {
    title: "Blog – 10 jeux coopératifs testés en famille",
    description:
      "Retours d’expérience de la communauté AutiStudy pour créer des mini-challenges sans pression.",
    href: "/blog",
  },
];

const GamesComponent = () => {
  return (
    <div className="space-y-16 pb-20">
      <BackButton label="Retour aux ressources" />

      <motion.section
        variants={heroVariant}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 p-px shadow-2xl"
      >
        <div className="grid gap-8 rounded-3xl bg-white/95 p-8 dark:bg-gray-900/90 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
              Jeux sensoriels AutiStudy
            </span>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              Des jeux pour apprendre, se connecter et s'apaiser
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Chaque idée est testée par notre communauté et documentée par nos experts. Composez
              des séances adaptées, respectueuses du profil sensoriel de votre enfant.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                as={Link}
                href="/controle"
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white shadow-lg hover:from-emerald-600 hover:via-teal-600 hover:to-blue-700"
              >
                Explorer les parcours de jeu
              </Button>
              <Button
                as={Link}
                href="/resources/apps"
                variant="bordered"
                className="border-emerald-200 text-emerald-700 hover:border-emerald-300 dark:border-emerald-900/40 dark:text-emerald-200"
              >
                Compléter avec nos apps
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-xs overflow-hidden rounded-3xl bg-emerald-600/10 p-4 shadow-inner dark:bg-emerald-500/10">
              <OptimizedImage
                alt="Jeux sensoriels AutiStudy"
                className="h-64 w-full rounded-2xl object-cover"
                height={640}
                src="/assets/resources/games.webp"
                width={640}
              />
              <p className="mt-4 text-center text-sm text-emerald-700 dark:text-emerald-200">
                Conseil AutiStudy : alternez activités dynamiques et temps d'intégration pour installer
                un rythme sécurisant.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          {gameHighlights.map((item) => (
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
            Des packs de jeux adaptés à vos moments clés
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Choisissez un scénario clé en main et laissez-vous guider par les fiches d'activité et les
            supports visuels fournis.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {experiencePacks.map((pack) => (
            <Card key={pack.name} className={`${pack.color} border-none shadow-xl`}>
              <CardBody className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {pack.name}
                    </h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">{pack.focus}</p>
                  </div>
                  <Chip
                    className="bg-white/80 text-emerald-700 dark:bg-white/10 dark:text-emerald-200"
                    startContent={<Joystick className="h-3.5 w-3.5" />}
                    size="sm"
                    variant="bordered"
                  >
                    Edition AutiStudy
                  </Chip>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200">{pack.description}</p>
                <div className="flex flex-wrap gap-2">
                  {pack.tags.map((tag) => (
                    <Chip
                      key={tag}
                      variant="flat"
                      color="success"
                      className="bg-white/70 text-sm dark:bg-white/10"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </CardBody>
              <CardFooter className="flex items-center gap-3 border-t border-white/60 bg-white/40 px-6 py-4 dark:border-white/10 dark:bg-white/5">
                <Button
                  as={Link}
                  href={pack.href}
                  size="sm"
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-slate-100 dark:bg-white/10 dark:text-emerald-200"
                >
                  <Download className="h-4 w-4" />
                  Recevoir le pack
                </Button>
                <Button
                  as={Link}
                  href="/resources/tools"
                  size="sm"
                  variant="ghost"
                  className="ml-auto text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Ajouter un support visuel
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-none bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 text-white shadow-2xl">
            <CardBody className="space-y-5 p-6 md:p-8">
              <h2 className="text-2xl font-semibold">
                Cercle « Jeux en famille » – dimanche 10h en visio
              </h2>
              <p className="text-sm text-white/80">
                Partagez vos réussites, posez vos questions et découvrez une nouvelle activité guidée
                à chaque session.
              </p>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Démonstrations en direct et adaptations selon le profil sensoriel</li>
                <li>• Fiches récapitulatives envoyées après chaque rencontre</li>
                <li>• Accès à un forum privé pour poursuivre les échanges</li>
              </ul>
              <Button
                as={Link}
                href="/resources/trainings"
                className="bg-white text-emerald-700 hover:bg-slate-100"
              >
                Réserver ma place
              </Button>
            </CardBody>
          </Card>

          <Card className="border-none bg-white/90 shadow-xl dark:bg-gray-900/80">
            <CardBody className="space-y-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Installer un rituel de jeu apaisant
              </h3>
              <div className="space-y-3">
                {ritualTips.map((tip) => (
                  <div
                    key={tip.title}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-gray-700 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-gray-200"
                  >
                    <h4 className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-200">
                      <BadgeCheck className="h-4 w-4" />
                      {tip.title}
                    </h4>
                    <p className="mt-1">{tip.description}</p>
                  </div>
                ))}
              </div>
              <Button
                as={Link}
                href="/contact?subject=planning-jeux"
                variant="flat"
                className="w-full bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-200"
              >
                Recevoir un planning hebdo
              </Button>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-5xl rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-xl dark:border-emerald-900/40 dark:bg-gray-900/80">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pour aller encore plus loin
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Des formats complémentaires pour nourrir vos temps de jeu et trouver de nouvelles idées.
            </p>
          </div>
          <Button
            as={Link}
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-emerald-600 hover:to-blue-700"
          >
            Besoin d'un coup de pouce ? <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {goFurtherResources.map((resource) => (
            <Link
              key={resource.title}
              href={resource.href}
              className="group flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-200 dark:hover:border-emerald-900/40 dark:hover:bg-emerald-900/20"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:translate-x-1 dark:text-emerald-200">
                <HandHeart className="h-4 w-4" />
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

export default GamesComponent;

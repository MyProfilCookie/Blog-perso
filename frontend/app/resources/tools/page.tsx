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
  CheckCircle,
  ClipboardList,
  Lightbulb,
  NotebookPen,
  Palette,
  PenTool,
  Sparkles,
  Download,
} from "lucide-react";
import BackButton from "@/components/back";
import OptimizedImage from "@/components/OptimizedImage";

const heroVariant = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const toolHighlights = [
  {
    title: "Supports visuels prêts à l'emploi",
    description:
      "Des tableaux, pictogrammes et scripts sociaux co-conçus avec nos ergothérapeutes pour faciliter la communication.",
    icon: (
      <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-300" />
    ),
    gradient:
      "from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30",
  },
  {
    title: "Rituels sensoriels guidés",
    description:
      "Des pas-à-pas pour introduire un nouveau rituel, observer les réactions sensorielles et ajuster en douceur.",
    icon: <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-300" />,
    gradient:
      "from-purple-100 via-pink-100 to-rose-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30",
  },
  {
    title: "Adaptations scolaires",
    description:
      "Des modèles de feuilles de route, de cahiers de liaison et de fiches séquentielles pour harmoniser maison / école.",
    icon: (
      <NotebookPen className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
    ),
    gradient:
      "from-emerald-100 via-teal-100 to-blue-100 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-blue-900/30",
  },
];

const toolKits = [
  {
    name: "Pack Routines du matin",
    focus: "Motivation & autonomie progressive",
    description:
      "Cartes séquentielles, planning magnétique et scénarios sociaux pour préparer la journée sereinement.",
    tags: ["Rituels", "Visualisation", "Autonomie"],
    href: "/contact?subject=pack-routines-matin",
    color: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "Kit Communication apaisée",
    focus: "Expression des besoins & émotions",
    description:
      "Pictogrammes PECS, échelle météo émotionnelle et scripts de demande pour encourager la prise de parole.",
    tags: ["Communication", "Émotions", "PECS"],
    href: "/contact?subject=kit-communication",
    color: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    name: "Boîte sensorielle personnalisée",
    focus: "Régulation & exploration",
    description:
      "Recettes d'activités, fiches d'observation et routine d'installation pour créer un coin sensoriel sur mesure.",
    tags: ["Sensoriel", "Observation", "DIY"],
    href: "/contact?subject=boite-sensorielle",
    color: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    name: "Carnet d'inclusion scolaire",
    focus: "Co-construction avec l'équipe éducative",
    description:
      "Trames de réunions, fiches de suivi hebdomadaire et guide pour présenter le profil sensoriel de l'enfant.",
    tags: ["École", "Coordination", "Suivi"],
    href: "/contact?subject=carnet-inclusion",
    color: "bg-amber-50 dark:bg-amber-900/20",
  },
];

const quickWins = [
  {
    title: "Préparer l'enfant",
    description:
      "Présentez toujours un nouveau support visuel avec un moment de connexion (regard, sourire, respiration) pour créer un ancrage positif.",
    icon: (
      <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-300" />
    ),
  },
  {
    title: "Observer et ajuster",
    description:
      "Notez les réactions sensorielles pendant trois jours afin d'ajuster les pictogrammes, la taille des supports ou les consignes.",
    icon: (
      <PenTool className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
    ),
  },
  {
    title: "Valoriser les réussites",
    description:
      "Utilisez les mini-certificats fournis pour féliciter l'enfant lorsqu'il s'approprie un outil et l'inscrire dans la routine.",
    icon: (
      <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-300" />
    ),
  },
];

const downloadResources = [
  {
    title: "Guide d'installation des supports visuels",
    description:
      "Méthodologie pas-à-pas, check-list matériel et exemples illustrés.",
    href: "/contact?subject=guide-supports-visuels",
  },
  {
    title: "Journal d'observation sensorielle",
    description:
      "Tableaux prêts à imprimer pour suivre réactions, déclencheurs et stratégies apaisantes.",
    href: "/contact?subject=journal-sensoriel",
  },
  {
    title: "Playlist de rituels audio",
    description:
      "Sélections de comptines et musiques calmes pour introduire ou conclure une activité.",
    href: "/contact?subject=playlist-rituels",
  },
];

const ToolsComponent = () => {
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
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
              Boîte à outils AutiStudy
            </span>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              Des supports visuels et sensoriels pour rythmer vos journées
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Chaque outil a été prototypé avec nos enfants et ajusté par nos
              intervenants. Imprimez, assemblez et introduisez-les en douceur pour
              encourager autonomie, communication et capacités d'adaptation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                as={Link}
                href="/controle"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
              >
                Découvrir les parcours guidés
              </Button>
              <Button
                as={Link}
                href="/resources/trainings"
                variant="bordered"
                className="border-blue-200 text-blue-700 hover:border-blue-300 dark:border-blue-900/40 dark:text-blue-200"
              >
                S'inscrire aux ateliers
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-xs overflow-hidden rounded-3xl bg-blue-600/10 p-4 shadow-inner dark:bg-blue-500/10">
              <OptimizedImage
                alt="Kit d'outils AutiStudy"
                className="h-64 w-full rounded-2xl object-cover"
                height={640}
                src="/assets/resources/tools.webp"
                width={640}
              />
              <p className="mt-4 text-center text-sm text-blue-700 dark:text-blue-200">
                Conseil AutiStudy : introduisez toujours un nouvel outil en lien avec
                un moment positif pour favoriser l'adhésion.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          {toolHighlights.map((item) => (
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
            Nos kits prêts à déployer
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Recevez, imprimez ou utilisez en version numérique. Chaque kit inclut un guide
            d'accompagnement et des temps de mise en place suggérés.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {toolKits.map((kit) => (
            <Card key={kit.name} className={`${kit.color} border-none shadow-xl`}>
              <CardBody className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {kit.name}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-200">{kit.focus}</p>
                  </div>
                  <Chip
                    className="bg-white/80 text-blue-700 dark:bg-white/10 dark:text-blue-200"
                    startContent={<Palette className="h-3.5 w-3.5" />}
                    size="sm"
                    variant="bordered"
                  >
                    Sur demande
                  </Chip>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200">{kit.description}</p>
                <div className="flex flex-wrap gap-2">
                  {kit.tags.map((tag) => (
                    <Chip
                      key={tag}
                      variant="flat"
                      color="secondary"
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
                  href={kit.href}
                  size="sm"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-slate-100 dark:bg-white/10 dark:text-blue-200"
                >
                  <Download className="h-4 w-4" />
                  Demander le kit
                </Button>
                <Button
                  as={Link}
                  href="/resources/apps"
                  size="sm"
                  variant="ghost"
                  className="ml-auto text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Associer avec nos apps
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-none bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white shadow-2xl">
            <CardBody className="space-y-5 p-6 md:p-8">
              <h2 className="text-2xl font-semibold">
                Atelier fabrication d'outils – chaque mercredi 19h
              </h2>
              <p className="text-sm text-white/80">
                En petit groupe, créez votre kit, profitez de retours personnalisés et repartez avec
                un plan d'introduction étape par étape.
              </p>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Coaching en direct pour adapter pictogrammes et séquentiels</li>
                <li>• Retours croisés entre parents et professionnels</li>
                <li>• Support PDF et replays disponibles pendant 30 jours</li>
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

          <Card className="border-none bg-white/90 shadow-xl dark:bg-gray-900/80">
            <CardBody className="space-y-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Conseils express pour démarrer
              </h3>
              <div className="space-y-3">
                {quickWins.map((tip) => (
                  <div
                    key={tip.title}
                    className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-gray-700 shadow-sm dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-gray-200"
                  >
                    <h4 className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-200">
                      {tip.icon}
                      {tip.title}
                    </h4>
                    <p className="mt-1">{tip.description}</p>
                  </div>
                ))}
              </div>
              <Button
                as={Link}
                href="/resources#coaching"
                variant="flat"
                className="w-full bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 dark:bg-blue-500/10 dark:text-blue-200"
              >
                Demander un rendez-vous coaching
              </Button>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-5xl rounded-3xl border border-blue-100 bg-white/95 p-6 shadow-xl dark:border-blue-900/40 dark:bg-gray-900/80">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ressources complémentaires à télécharger
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Des documents prêts à imprimer et des playlists pour enrichir vos routines.
            </p>
          </div>
          <Button
            as={Link}
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            On assemble ensemble ? <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {downloadResources.map((resource) => (
            <Link
              key={resource.title}
              href={resource.href}
              className="group flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm text-gray-700 transition hover:border-blue-200 hover:bg-blue-50/60 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-200 dark:hover:border-blue-900/40 dark:hover:bg-blue-900/20"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-blue-700 transition group-hover:translate-x-1 dark:text-blue-200">
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

export default ToolsComponent;

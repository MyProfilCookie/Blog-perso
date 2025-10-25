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
  ArrowUpRight,
  BookOpen,
  BookOpenCheck,
  Lightbulb,
  Quote,
  Sparkles,
} from "lucide-react";
import BackButton from "@/components/back";

const heroVariant = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const readingThemes = [
  {
    title: "Parents qui débutent",
    description:
      "Des livres accessibles pour comprendre le quotidien sensoriel et poser des mots justes dès les premières démarches.",
    icon: <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-300" />,
    gradient:
      "from-purple-100 via-pink-100 to-rose-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30",
  },
  {
    title: "Professionnels en quête d’outils",
    description:
      "Approches pédagogiques, stratégies d’accompagnement et retours de terrain pour enrichir vos pratiques.",
    icon: <BookOpenCheck className="h-5 w-5 text-blue-600 dark:text-blue-300" />,
    gradient:
      "from-blue-100 via-indigo-100 to-violet-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-violet-900/30",
  },
  {
    title: "Ados & jeunes adultes",
    description:
      "Témoignages inspirants et supports pour ouvrir le dialogue, valoriser les singularités et projeter l’avenir.",
    icon: <Quote className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />,
    gradient:
      "from-emerald-100 via-teal-100 to-blue-100 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-blue-900/30",
  },
];

const bookRecommendations = [
  {
    title: "L'Autisme expliqué aux non-autistes",
    author: "Brigitte Harrisson & Lise St-Charles",
    focus: "Décoder la structure perceptive et les codes sensoriels",
    tags: ["Compréhension", "Famille", "Communication"],
    links: [
      {
        label: "Amazon",
        href: "https://www.amazon.fr/s?k=L%27Autisme+expliqu%C3%A9+aux+non-autistes",
      },
      {
        label: "Fnac",
        href: "https://www.fnac.com/SearchResult/ResultList.aspx?Search=L%27Autisme+expliqu%C3%A9+aux+non-autistes",
      },
    ],
  },
  {
    title: "Un autre regard : Ma vie d’autiste",
    author: "Josef Schovanec",
    focus: "Témoignage sensible sur le parcours scolaire et professionnel",
    tags: ["Témoignage", "Adulte", "Inspiration"],
    links: [
      {
        label: "Amazon",
        href: "https://www.amazon.fr/s?k=Un+autre+regard+Ma+vie+d%27autiste",
      },
      {
        label: "Fnac",
        href: "https://www.fnac.com/SearchResult/ResultList.aspx?Search=Un+autre+regard+Ma+vie+d%27autiste",
      },
    ],
  },
  {
    title: "La Différence invisible",
    author: "Julie Dachez & Mademoiselle Caroline",
    focus: "Roman graphique pour parler du diagnostic à l’âge adulte",
    tags: ["BD", "Diagnostic", "Sensibilisation"],
    links: [
      {
        label: "Amazon",
        href: "https://www.amazon.fr/s?k=La+Diff%C3%A9rence+invisible",
      },
      {
        label: "Cultura",
        href: "https://www.cultura.com/recherche?q=La+Diff%C3%A9rence+invisible",
      },
    ],
  },
  {
    title: "L’autisme raconté aux enfants",
    author: "Pascale Boulay",
    focus: "Ouvrage illustré pour expliquer l’autisme avec des mots simples",
    tags: ["Enfants", "Illustré", "Dialogue"],
    links: [
      {
        label: "Amazon",
        href: "https://www.amazon.fr/s?k=L%27autisme+racont%C3%A9+aux+enfants",
      },
      {
        label: "Fnac",
        href: "https://www.fnac.com/SearchResult/ResultList.aspx?Search=L%27autisme+racont%C3%A9+aux+enfants",
      },
    ],
  },
  {
    title: "Comprendre l'autisme pour les nuls",
    author: "Stephen Shore",
    focus: "Panorama accessible des approches éducatives et sensorielles",
    tags: ["Guide", "Famille", "Professionnels"],
    links: [
      {
        label: "Amazon",
        href: "https://www.amazon.fr/s?k=Comprendre+l%27autisme+pour+les+nuls",
      },
      {
        label: "Cultura",
        href: "https://www.cultura.com/recherche?q=Comprendre+l%27autisme+pour+les+nuls",
      },
    ],
  },
  {
    title: "L'Autisme, de la compréhension à l'intervention",
    author: "Isabelle Hénault",
    focus: "Outils d'accompagnement éducatif et pistes d'intervention",
    tags: ["Intervention", "Professionnels", "Outils"],
    links: [
      {
        label: "Amazon",
        href: "https://www.amazon.fr/s?k=L%27Autisme+de+la+compr%C3%A9hension+%C3%A0+l%27intervention",
      },
      {
        label: "Fnac",
        href: "https://www.fnac.com/SearchResult/ResultList.aspx?Search=L%27Autisme+de+la+compr%C3%A9hension+%C3%A0+l%27intervention",
      },
    ],
  },
  {
    title: "Les clés de l'autisme",
    author: "Caroline Sole",
    focus: "Comprendre les besoins sensoriels et proposer des adaptations",
    tags: ["Adaptations", "Sensoriel", "Famille"],
    links: [
      {
        label: "Amazon",
        href: "https://www.amazon.fr/s?k=Les+cl%C3%A9s+de+l%27autisme",
      },
      {
        label: "Cultura",
        href: "https://www.cultura.com/recherche?q=Les+cl%C3%A9s+de+l%27autisme",
      },
    ],
  },
  {
    title: "L'Autisme au quotidien",
    author: "Élise Gravel",
    focus: "Album coloré pour normaliser les différences et valoriser les forces",
    tags: ["Illustré", "Positif", "Famille"],
    links: [
      {
        label: "Amazon",
        href: "https://www.amazon.fr/s?k=L%27Autisme+au+quotidien",
      },
      {
        label: "Fnac",
        href: "https://www.fnac.com/SearchResult/ResultList.aspx?Search=L%27Autisme+au+quotidien",
      },
    ],
  },
];

const clubResources = [
  {
    title: "Club de lecture AutiStudy – premier mardi du mois",
    description:
      "Rencontrez d’autres familles, échangez sur les lectures du moment et repartez avec une fiche synthèse prête à partager avec votre entourage.",
    cta: "Je m'inscris",
    href: "/contact?session=club-lecture",
  },
  {
    title: "Fiche de lecture à imprimer",
    description:
      "Un template pour noter vos idées clés, citations favorites et actions à tester dans votre quotidien.",
    cta: "Recevoir la fiche",
    href: "/contact?subject=fiche-lecture",
  },
];

const BooksComponent: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      <BackButton label="Retour aux ressources" />

      <motion.section
        variants={heroVariant}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-emerald-500/10 p-px shadow-2xl"
      >
        <div className="grid gap-8 rounded-3xl bg-white/95 p-8 dark:bg-gray-900/90 md:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
              Bibliothèque AutiStudy
            </span>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              Des lectures qui éclairent, rassurent et inspirent
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Une sélection affinée par nos familles et nos experts pour comprendre l’autisme,
              valoriser les profils sensoriels et construire des ponts avec l’entourage.
            </p>
            <Button
              as={Link}
              href="/contact?subject=selection-lecture"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-500 text-white shadow-lg hover:from-purple-700 hover:via-blue-700 hover:to-emerald-600"
            >
              Recevoir la liste imprimable <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-3xl bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-emerald-600/10 p-6 text-center shadow-inner">
              <BookOpen className="mx-auto h-14 w-14 text-purple-600 dark:text-purple-300" />
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                « Les livres m’ont donné des mots doux pour expliquer les besoins de mon enfant à la
                famille » — Témoignage de Céline, maman AutiStudy.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          {readingThemes.map((theme) => (
            <div
              key={theme.title}
              className={`rounded-3xl bg-gradient-to-br ${theme.gradient} p-6 shadow-lg`}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/70 backdrop-blur dark:bg-white/10">
                {theme.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {theme.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {theme.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Les recommandations de la communauté
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Chaque ouvrage a été relu par un binôme parent / professionnel pour vérifier la clarté et
            la qualité des outils proposés.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bookRecommendations.map((book) => (
            <Card key={book.title} className="border-none bg-white/90 shadow-xl dark:bg-gray-900/80">
              <CardBody className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {book.title}
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-200">par {book.author}</p>
                  </div>
                  <Chip
                    className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200"
                    size="sm"
                  >
                    Coup de cœur
                  </Chip>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200">{book.focus}</p>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <Chip
                      key={tag}
                      variant="flat"
                      color="secondary"
                      className="bg-purple-50 text-xs text-purple-700 dark:bg-purple-900/20 dark:text-purple-200"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </CardBody>
              <CardFooter className="flex flex-wrap gap-2 border-t border-gray-100 bg-gray-50/80 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/60">
                {book.links.map((link) => (
                  <Button
                    key={link.label}
                    as={Link}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="flat"
                    size="sm"
                    className="inline-flex items-center gap-2 bg-white text-purple-700 hover:bg-slate-100 dark:bg-white/10 dark:text-purple-200"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl rounded-3xl border border-purple-100 bg-white/95 p-6 shadow-xl dark:border-purple-900/40 dark:bg-gray-900/80">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Envies de partager vos lectures ?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Nos clubs et supports de synthèse facilitent la transmission aux enseignants, proches ou
              professionnels.
            </p>
          </div>
          <Button
            as={Link}
            href="/resources/trainings"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
          >
            Participer à un atelier lecture <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {clubResources.map((resource) => (
            <Card
              key={resource.title}
              className="border border-purple-100 bg-purple-50/60 shadow-sm dark:border-purple-900/40 dark:bg-purple-900/20"
            >
              <CardBody className="space-y-3 p-5">
                <h4 className="text-base font-semibold text-purple-700 dark:text-purple-200">
                  {resource.title}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-200">{resource.description}</p>
              </CardBody>
              <CardFooter className="px-5 pb-5">
                <Button
                  as={Link}
                  href={resource.href}
                  className="inline-flex items-center gap-2 bg-white text-purple-700 hover:bg-slate-100 dark:bg-white/10 dark:text-purple-200"
                >
                  {resource.cta} <Sparkles className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BooksComponent;

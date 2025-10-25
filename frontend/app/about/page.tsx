"use client";

/* eslint-disable react/jsx-sort-props */

import React from "react";
import { motion } from "framer-motion";
import { Button, Card, CardBody } from "@nextui-org/react";
import {
  ArrowRight,
  Sparkles,
  Users,
  HeartHandshake,
  Lightbulb,
  BookOpen,
  Compass,
  Star,
  Shield,
  Globe,
  Target,
  Smile,
} from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

const achievements = [
  {
    icon: <Users className="h-6 w-6" />,
    number: "500+",
    label: "Familles accompagnées",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    number: "1 000+",
    label: "Activités et parcours",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    number: "4.9 / 5",
    label: "Satisfaction moyenne",
  },
  {
    icon: <HeartHandshake className="h-6 w-6" />,
    number: "24/7",
    label: "Support humain",
  },
];

const philosophyPillars = [
  {
    title: "Apprentissage personnalisé",
    description:
      "Des parcours adaptés au rythme et aux centres d’intérêt de chaque enfant autiste, avec un suivi fin de la progression.",
    icon: <Lightbulb className="h-6 w-6 text-blue-600" />,
    accent: "from-blue-100 to-blue-200",
  },
  {
    title: "Famille au cœur",
    description:
      "Nous co-construisons AutiStudy avec notre famille et la communauté : les besoins du quotidien guident nos décisions.",
    icon: <HeartHandshake className="h-6 w-6 text-purple-600" />,
    accent: "from-purple-100 to-purple-200",
  },
  {
    title: "Inclusion bienveillante",
    description:
      "Chaque interface, chaque activité, chaque mot est pensé pour offrir un espace sécurisant, positif et valorisant.",
    icon: <Globe className="h-6 w-6 text-emerald-600" />,
    accent: "from-emerald-100 to-emerald-200",
  },
];

const approachSteps = [
  {
    title: "Écouter les besoins",
    description:
      "Nous échangeons avec les familles, éducateurs et thérapeutes pour rester au plus près des réalités du terrain.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Concevoir avec soin",
    description:
      "Chaque ressource est relue par notre comité familial et testée avec nos enfants pour vérifier la clarté et l’intérêt.",
    icon: <Compass className="h-5 w-5" />,
  },
  {
    title: "Accompagner au quotidien",
    description:
      "Guides pratiques, notifications intelligentes et suivi détaillé : tout est pensé pour alléger la charge des proches aidants.",
    icon: <Smile className="h-5 w-5" />,
  },
  {
    title: "Améliorer en continu",
    description:
      "Les retours des familles nourrissent nos mises à jour hebdomadaires afin de garder une plateforme vivante et évolutive.",
    icon: <Target className="h-5 w-5" />,
  },
];

const supportHighlights = [
  {
    icon: <Shield className="h-6 w-6 text-indigo-600" />,
    title: "Environnement sécurisé",
    description:
      "Des parcours sans publicité ni distraction, protégés par une politique stricte de confidentialité.",
  },
  {
    icon: <Star className="h-6 w-6 text-amber-500" />,
    title: "Valorisation des forces",
    description:
      "Nous misons sur les intérêts spécifiques pour développer la confiance, l’autonomie et le plaisir d’apprendre.",
  },
  {
    icon: <HeartHandshake className="h-6 w-6 text-rose-500" />,
    title: "Support humain",
    description:
      "Une équipe disponible pour répondre, conseiller et ajuster les parcours en fonction des retours.",
  },
];

const familyMembers = [
  {
    name: "Jessica",
    role: "Super-membre",
    status: "Admin",
    img: "/assets/family/avatar/jessica.webp",
    className: "bg-pink-100 text-pink-600",
    borderColor: "#f8b0c5",
    imagePosition: "object-top",
  },
  {
    name: "Joshua",
    role: "Co-fondateur",
    status: "Admin",
    img: "/assets/family/avatar/joshua.webp",
    className: "bg-yellow-100 text-yellow-600",
    borderColor: "#fdd68a",
    imagePosition: "object-top",
  },
  {
    name: "Maeva",
    role: "Super-membre",
    status: "Membre",
    img: "/assets/family/avatar/maeva.webp",
    className: "bg-green-100 text-green-600",
    borderColor: "#aee9c5",
    imagePosition: "object-top",
  },
  {
    name: "Benjamin",
    role: "Co-fondateur",
    status: "Admin",
    img: "/assets/family/avatar/benjamin.webp",
    className: "bg-indigo-100 text-indigo-600",
    borderColor: "#b8c5ff",
    imagePosition: "object-top",
  },
  {
    name: "Mickael",
    role: "Membre",
    status: "Membre",
    img: "/assets/family/avatar/mickael.webp?v=2",
    className: "bg-teal-100 text-teal-600",
    borderColor: "#7dd3c0",
    imagePosition: "object-top",
  },
  {
    name: "Chantal",
    role: "Membre",
    status: "Membre",
    img: "/assets/family/avatar/chantal.webp",
    className: "bg-purple-100 text-purple-600",
    borderColor: "#cab7ff",
    imagePosition: "object-top",
  },
  {
    name: "Virginie",
    role: "Fondatrice",
    status: "Admin",
    img: "/assets/family/avatar/virginie.webp",
    className: "bg-blue-100 text-blue-600",
    borderColor: "#a8d5ff",
    imagePosition: "object-top",
  },
  {
    name: "Paul",
    role: "Co-fondateur",
    status: "Admin",
    img: "/assets/family/avatar/paul.webp",
    className: "bg-orange-100 text-orange-600",
    borderColor: "#fcd0a1",
    imagePosition: "object-top",
  },
  {
    name: "Pauline",
    role: "Super-membre",
    status: "Admin",
    img: "/assets/family/avatar/pauline.webp",
    className: "bg-orange-100 text-orange-600",
    borderColor: "#fcd0a1",
    imagePosition: "object-center",
  },
  {
    name: "Vanessa",
    role: "Super-membre",
    status: "Admin",
    img: "/assets/family/avatar/vanessa.webp",
    className: "bg-red-100 text-red-600",
    borderColor: "#f8b4b4",
    imagePosition: "object-top",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <main className="w-full px-4 pb-24 pt-12 sm:px-8 lg:px-16">
        <section className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/70 px-4 py-2 text-sm font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              <Sparkles className="h-4 w-4" />
              AutiStudy, né d&apos;une famille engagée
            </div>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              L&apos;apprentissage apaisé pour les enfants autistes et leurs
              familles
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              AutiStudy est un projet familial conçu pour simplifier le
              quotidien des proches aidants. Nous rassemblons des parcours
              pédagogiques, des outils de suivi et une communauté soudée afin
              que chaque enfant puisse explorer ses forces, à son rythme.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                as="a"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-500 hover:to-purple-500"
                endContent={<ArrowRight className="h-5 w-5" />}
                href="/controle"
                size="lg"
              >
                Découvrir les parcours
              </Button>
              <Button
                as="a"
                className="border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-200"
                href="/shop"
                size="lg"
                variant="bordered"
              >
                Soutenir le projet
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.label}
                  className="rounded-xl border border-blue-100/70 bg-white/80 p-4 text-center shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/70"
                >
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    {achievement.icon}
                    {achievement.label}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                    {achievement.number}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-xl">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl" />
              <Card className="relative overflow-hidden rounded-3xl border-none bg-white/90 shadow-xl backdrop-blur dark:bg-gray-900/70">
                <CardBody className="p-6 sm:p-8">
                  <div className="mb-6 rounded-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-rose-100 p-1 dark:from-blue-900 dark:via-purple-900 dark:to-rose-900">
                    <OptimizedImage
                      alt="Famille AutiStudy réunie"
                      className="h-64 w-full rounded-2xl object-cover object-center"
                      height={600}
                      priority
                      src="/assets/family/family1.webp"
                      width={800}
                    />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Une aventure profondément humaine
                  </h2>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    Nous sommes parents, frères et sœurs, éducateurs et amis.
                    Nous avançons ensemble, en partageant nos réussites comme
                    nos défis, pour bâtir un espace vraiment adapté aux
                    neurodivergences.
                  </p>
                </CardBody>
              </Card>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto mt-24 max-w-6xl">
          <motion.div
            {...fadeUp}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Notre philosophie d&apos;accompagnement
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              AutiStudy repose sur trois piliers qui guident chacune de nos
              décisions.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {philosophyPillars.map((pillar) => (
              <motion.div
                key={pillar.title}
                {...fadeUp}
                viewport={{ once: true, amount: 0.2 }}
                className="h-full"
              >
                <Card className="h-full border-none bg-white/90 shadow-lg backdrop-blur hover:shadow-xl dark:bg-gray-900/70">
                  <CardBody className="space-y-4 p-6">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${pillar.accent}`}
                    >
                      {pillar.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {pillar.title}
                    </h3>
                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                      {pillar.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-6xl rounded-3xl bg-white/90 p-8 shadow-lg backdrop-blur dark:bg-gray-900/70 sm:p-12">
          <motion.div
            {...fadeUp}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Notre approche pédagogique
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Une boucle d&apos;amélioration continue pour proposer des
              expériences d&apos;apprentissage sereines.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approachSteps.map((step, index) => (
              <motion.div
                key={step.title}
                {...fadeUp}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="relative h-full"
              >
                <Card className="h-full border border-blue-100/70 bg-gradient-to-b from-white to-blue-50/40 shadow-sm dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
                  <CardBody className="space-y-4 p-6">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-6xl">
          <motion.div
            {...fadeUp}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Un projet familial avant tout
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Chaque personne ci-dessous influence la direction d&apos;AutiStudy
              et nous rappelle pourquoi nous créons cette plateforme.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {familyMembers.map((member) => (
              <motion.div
                key={member.name}
                {...fadeUp}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Card
                  className="h-full border-none bg-white/90 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900/70"
                  style={{
                    boxShadow: `0 15px 35px -15px ${member.borderColor}`,
                  }}
                >
                  <CardBody className="flex flex-col items-center gap-4 p-6">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full text-sm font-semibold uppercase tracking-wide ${member.className}`}
                    >
                      {member.role}
                    </div>
                    <div className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-lg dark:border-gray-800">
                      <OptimizedImage
                        alt={`Portrait de ${member.name}`}
                        className={`h-full w-full object-cover ${member.imagePosition}`}
                        height={256}
                        src={member.img}
                        width={256}
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {member.status}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-6xl">
          <motion.div
            {...fadeUp}
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-rose-500 p-8 text-white shadow-xl sm:p-12"
          >
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold sm:text-4xl">
                  Ensemble, nous construisons un espace rassurant pour apprendre
                  et s&apos;épanouir.
                </h2>
                <p className="text-base leading-relaxed text-white/80">
                  Rejoignez la communauté AutiStudy, partagez vos retours et
                  aidez-nous à imaginer les prochains modules. Votre expérience
                  est précieuse pour créer un outil réellement utile aux
                  familles neurodivergentes.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    as="a"
                    className="bg-white text-blue-700 hover:bg-slate-100"
                    endContent={<ArrowRight className="h-5 w-5" />}
                    href="/contact"
                    size="lg"
                  >
                    Nous contacter
                  </Button>
                  <Button
                    as="a"
                    className="border-white text-white"
                    href="/blog"
                    size="lg"
                    variant="bordered"
                  >
                    Lire nos actualités
                  </Button>
                </div>
              </div>
              <div className="space-y-6">
                {supportHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur"
                  >
                    <div className="rounded-full bg-white/20 p-3">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-white/80">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

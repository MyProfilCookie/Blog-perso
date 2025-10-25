"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import {
  ArrowLeft,
  Sparkles,
  HeartHandshake,
  Shield,
  Lightbulb,
  Clock,
  BookOpen,
  Smile,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import OptimizedImage from "@/components/OptimizedImage";
import AIAssistantPremium from "@/components/AIAssistantPremium";
import { AutismLogo } from "@/components/icons";

const featureChips = [
  { label: "Suivi pédagogique personnalisé", color: "primary" },
  { label: "Guides pratiques pour la famille", color: "success" },
  { label: "Disponibilité 24/7", color: "secondary" },
  { label: "Langage bienveillant garanti", color: "warning" },
];

const pillars = [
  {
    icon: HeartHandshake,
    title: "Pensé avec les familles",
    description:
      "Les scénarios de dialogue sont inspirés de nos échanges quotidiens avec les parents, éducateurs et thérapeutes qui accompagnent nos enfants autistes.",
  },
  {
    icon: Shield,
    title: "Sécurité & confidentialité",
    description:
      "Aucune donnée sensible n'est réutilisée. Les informations sont chiffrées et nous n'entraînons pas l'IA sur vos conversations.",
  },
  {
    icon: Lightbulb,
    title: "Soutien pédagogique concret",
    description:
      "Alia fournit des idées d'activités, des scripts sociaux et des adaptations en lien direct avec les parcours AutiStudy.",
  },
];

const useCases = [
  {
    title: "Préparer une séance",
    description:
      "Générez un plan d'exercices adaptés aux centres d'intérêt de votre enfant et à son niveau actuel sur AutiStudy.",
    icon: BookOpen,
  },
  {
    title: "Faire face aux imprévus",
    description:
      "Besoin d'une idée rapide pour apaiser une crise ou expliquer un changement de routine ? Alia propose des réponses calmes et structurées.",
    icon: Smile,
  },
  {
    title: "Suivre les progrès",
    description:
      "Recevez des conseils pour noter les succès, ajuster le niveau de difficulté et valoriser chaque avancée.",
    icon: Compass,
  },
];

const commitments = [
  {
    title: "Transparence",
    detail:
      "Les sources utilisées sont affichées à chaque fois que possible afin que vous puissiez valider les recommandations.",
  },
  {
    title: "Respect du rythme",
    detail:
      "Alia privilégie des réponses pas-à-pas et rappelle les bonnes pratiques pour respecter les besoins sensoriels.",
  },
  {
    title: "Support humain",
    detail:
      "Vous n'êtes jamais seul·e : notre équipe reste disponible pour prendre le relais si une réponse mérite un suivi personnalisé.",
  },
];

const rotatingTips = [
  "Conseil : demandez à Alia d'adapter une activité AutiStudy selon les intérêts spécifiques de votre enfant.",
  "Astuce : partagez le contexte sensoriel pour recevoir des stratégies d'apaisement plus pertinentes.",
  "Inspiration : Alia peut vous aider à écrire un message aux enseignants pour préparer une inclusion sereine.",
];

export default function AIAssistantPage() {
  const router = useRouter();
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setTipIndex((previous) => (previous + 1) % rotatingTips.length),
      6000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <main className="w-full px-4 py-12 sm:px-8 lg:px-16">
        <section className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <Button
                className="flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-2 text-sm font-medium text-violet-600 shadow-sm transition hover:-translate-x-1 hover:bg-violet-50 dark:border-violet-900/40 dark:bg-gray-900 dark:text-violet-200 dark:hover:bg-violet-900/30"
                onPress={() => router.back()}
                size="sm"
                startContent={<ArrowLeft className="h-4 w-4" />}
                variant="flat"
              >
                Retour
              </Button>
              <Sparkles className="h-6 w-6 text-violet-500 dark:text-violet-300" />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <AutismLogo className="h-10 w-10 md:h-12 md:w-12" size={40} />
                <div>
                  <p className="text-sm uppercase tracking-widest text-violet-600 dark:text-violet-300">
                    AutiStudy AI
                  </p>
                  <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
                    Alia, l&apos;accompagnante pédagogique qui connaît vos
                    réalités
                  </h1>
                </div>
              </div>

              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-violet-100 bg-white/80 px-5 py-4 text-base font-medium text-gray-700 shadow-sm backdrop-blur dark:border-violet-900/40 dark:bg-gray-900/70 dark:text-gray-200"
              >
                {rotatingTips[tipIndex]}
              </motion.p>

              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Alia complète les parcours AutiStudy en offrant des réponses
                nuancées, des idées d&apos;activités et des ressources validées
                par notre équipe familiale. L&apos;objectif : vous donner des
                clés concrètes, documentées et bienveillantes au moment où vous
                en avez le plus besoin.
              </p>

              <div className="flex flex-wrap gap-2">
                {featureChips.map((chip) => (
                  <Chip
                    key={chip.label}
                    color={chip.color as any}
                    size="sm"
                    variant="flat"
                    className="rounded-full border border-transparent px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur"
                  >
                    {chip.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <Card
                    key={pillar.title}
                    className="border-none bg-white/90 shadow-lg backdrop-blur hover:shadow-xl dark:bg-gray-900/70"
                  >
                    <CardBody className="flex h-full flex-col gap-3 p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {pillar.description}
                      </p>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-2xl">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-500/15 to-blue-500/15 blur-3xl" />
              <Card className="relative overflow-hidden rounded-3xl border-none bg-white/90 shadow-xl backdrop-blur dark:bg-gray-900/70">
                <CardBody className="space-y-6 p-6 sm:p-8">
                  <div className="rounded-3xl bg-gradient-to-br from-violet-100 via-blue-100 to-rose-100 p-1 dark:from-violet-900 dark:via-blue-900 dark:to-rose-900">
                    <OptimizedImage
                      alt="Parent utilisant Alia, l'assistante AutiStudy"
                      className="h-72 w-full rounded-3xl object-cover object-center sm:h-[360px] lg:h-[420px]"
                      height={640}
                      src="/assets/progress-tracking.webp"
                      width={960}
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Un partenaire rassurant au quotidien
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      Alia transforme vos questions en accompagnement clair :
                      explications sociales, idées de rituels visuels,
                      adaptation de devoirs ou préparation d&apos;un rendez-vous
                      médical, toujours avec le ton apaisant et respectueux qui
                      caractérise AutiStudy.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Comment Alia vous accompagne ?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Chaque réponse est contextualisée selon les méthodes AutiStudy
              pour vous faire gagner du temps et alléger la charge mentale.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="border-none bg-white/90 shadow-lg backdrop-blur hover:shadow-xl dark:bg-gray-900/70"
                >
                  <CardBody className="space-y-3 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl rounded-3xl bg-white/90 p-8 shadow-lg backdrop-blur dark:bg-gray-900/70 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="grid gap-10 lg:grid-cols-[1fr_1fr]"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl dark:text-white">
                Une IA au service de la confiance et du respect
              </h2>
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                L&apos;intelligence artificielle ne remplace pas l&apos;humain,
                elle l&apos;épaule. Alia a été entraînée sur nos contenus
                validés, nos guides internes et les retours de la communauté
                pour proposer des réponses alignées avec la philosophie
                AutiStudy.
              </p>
              <div className="space-y-4">
                {commitments.map((item) => (
                  <div className="flex items-start gap-3" key={item.title}>
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-200">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-none bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 text-white shadow-xl">
              <CardBody className="space-y-6 p-8">
                <div className="space-y-3">
                  <p className="rounded-full bg-white/20 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-white">
                    Disponible dans l&apos;espace Contrôle
                  </p>
                  <h3 className="text-2xl font-semibold leading-tight">
                    Ouvrez Alia, posez votre question, et laissez-vous guider
                    pas à pas.
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-white/80">
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Réponses en quelques secondes, avec des liens vers les
                    ressources AutiStudy associées.
                  </p>
                  <p className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Vos conversations restent privées et peuvent être effacées à
                    tout moment.
                  </p>
                  <p className="flex items-center gap-2">
                    <HeartHandshake className="h-4 w-4" />
                    Une tonalité douce et rassurante, testée avec notre famille.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    as="a"
                    href="/controle"
                    size="lg"
                    className="bg-white text-violet-700 hover:bg-slate-100"
                    endContent={<Sparkles className="h-4 w-4" />}
                  >
                    Accéder à Alia
                  </Button>
                  <Button
                    as="a"
                    href="/contact"
                    size="lg"
                    variant="bordered"
                    className="border-white text-white"
                  >
                    Planifier un accompagnement
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </section>

        <section className="mx-auto mt-20 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-violet-100 bg-white/95 p-6 shadow-lg backdrop-blur dark:border-violet-900/40 dark:bg-gray-900/70 sm:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
                      Session en direct
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
                      Dialogue avec Alia
                    </h2>
                  </div>
                  <div className="hidden rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 dark:border-violet-900/40 dark:bg-violet-900/30 dark:text-violet-200 sm:flex sm:items-center sm:gap-2">
                    <Clock className="h-4 w-4" />
                    Réponses instantanées
                  </div>
                </div>

                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  Cette fenêtre est un aperçu réel de la manière dont Alia vous
                  accompagne. Posez-lui une question concrète et observez
                  comment elle structure ses réponses avec bienveillance,
                  exemples et ressources associées AutiStudy.
                </p>

                <ul className="space-y-3">
                  {[
                    "Conseils contextualisés à votre situation familiale.",
                    "Suggestions d'activités adaptées aux profils AutiStudy.",
                    "Explications rassurantes pour annoncer un changement ou gérer une émotion.",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-gray-700 dark:text-gray-200"
                    >
                      <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-200">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl border border-violet-100 bg-violet-50/70 px-4 py-4 text-sm text-violet-700 shadow-sm dark:border-violet-900/40 dark:bg-violet-900/40 dark:text-violet-200">
                  <p className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      Pour tester Alia sur vos propres situations, connectez-vous à
                      l&apos;espace Contrôle : l&apos;assistant est déjà intégré aux
                      parcours et mémorise vos préférences.
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    as="a"
                    href="/controle"
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white shadow-lg hover:from-violet-700 hover:via-purple-700 hover:to-pink-700"
                    endContent={<Sparkles className="h-4 w-4" />}
                  >
                    Ouvrir Alia dans l&apos;espace Contrôle
                  </Button>
                  <Button
                    as="a"
                    href="/contact"
                    size="lg"
                    variant="bordered"
                    className="border-violet-200 text-violet-700 dark:border-violet-900/40 dark:text-violet-200"
                  >
                    Besoin d&apos;un guide humain ?
                  </Button>
                </div>
              </div>

              <div className="w-full">
                <AIAssistantPremium />
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

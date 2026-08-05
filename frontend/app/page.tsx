/// <reference types="react" />
/* eslint-disable react/no-unescaped-entities */
"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import {
  Sparkles,
  ArrowRight,
  Download,
  Users,
  Baby,
  Stethoscope,
} from "lucide-react";

const universCards = [
  {
    title: "Parents",
    text: "Des guides concrets, des routines visuelles et un espace pour souffler entre parents qui se comprennent.",
    img: "/assets/family/family.webp",
    link: "/resources",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Enfants",
    text: "Des jeux et défis colorés pensés pour apprendre en s'amusant, à son propre rythme, sans pression.",
    img: "/assets/education_autisme.webp",
    link: "/controle",
    icon: <Baby className="h-5 w-5" />,
  },
  {
    title: "Professionnels",
    text: "Des supports prêts à imprimer, alignés sur les méthodes ABA, TEACCH et PECS, à intégrer à vos suivis.",
    img: "/assets/aba_therapy.webp",
    link: "/resources",
    icon: <Stethoscope className="h-5 w-5" />,
  },
];

const programmeSteps = [
  { step: "1", title: "Communication", text: "Pictogrammes, PECS et premiers mots pour se faire comprendre." },
  { step: "2", title: "Émotions", text: "Reconnaître, nommer et exprimer ce que l'on ressent." },
  { step: "3", title: "Autonomie", text: "Routines du quotidien, repères visuels et petites victoires." },
  { step: "4", title: "Sensoriel", text: "Apprivoiser les sons, textures et lumières à son rythme." },
];

const resourceCards = [
  { tag: "Fiche PDF", tagColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200", title: "Planning visuel de la journée", text: "Un emploi du temps illustré pour structurer chaque matinée sans stress.", meta: "5 min de lecture" },
  { tag: "Article", tagColor: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200", title: "Comprendre les crises sensorielles", text: "Les signaux à repérer et comment réagir avec calme, écrit avec des orthophonistes.", meta: "8 min de lecture" },
  { tag: "Activité", tagColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200", title: "Jeu des émotions à imprimer", text: "Des cartes à découper pour nommer et mimer 12 émotions du quotidien.", meta: "Dès 4 ans" },
  { tag: "Guide pro", tagColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200", title: "Adapter une séance TEACCH", text: "Trame prête à l'emploi pour structurer l'espace et le temps de travail.", meta: "12 min de lecture" },
];

export default function HomePage() {
  const { isMobile } = useMobileOptimization();
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = isMobile || prefersReducedMotion;
  const instantTransition = { duration: 0 };
  const [deferredSections, setDeferredSections] = useState(false);

  useEffect(() => {
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setDeferredSections(true), { timeout: 1200 })
      : window.setTimeout(() => setDeferredSections(true), 600);
    return () => {
      if (typeof id === "number") clearTimeout(id);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-12 md:py-20 lg:py-28">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900" />
          <div className="relative z-10 w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto grid gap-10 md:gap-12 md:grid-cols-2 items-center">
              <motion.div
                initial={disableMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={disableMotion ? instantTransition : { duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center text-center md:items-start md:text-left gap-6"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Conçu avec des professionnels du TSA
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white max-w-xl">
                  Apprendre à son rythme, en toute confiance
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
                  Des ressources ludiques, un parcours pas à pas et une communauté bienveillante pour accompagner chaque enfant autiste — et sa famille — vers l'autonomie.
                </p>
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                  <Link
                    href="/resources"
                    className="bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center gap-2 text-sm md:text-base shadow-md"
                  >
                    Explorer les ressources gratuites
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="#programme"
                    className="border-2 border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-200 px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    Voir comment ça marche
                  </Link>
                </div>
                <div className="flex gap-8">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">1 200+</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">fiches &amp; activités</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">40k</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">familles accompagnées</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">100%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">gratuit pour démarrer</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={disableMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={disableMotion ? instantTransition : { duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="relative mx-auto max-w-md sm:max-w-lg md:mx-0"
              >
                <OptimizedImage
                  src="/assets/home/home.webp"
                  alt="Enfant qui apprend en jouant avec AutiStudy"
                  width={600}
                  height={420}
                  className="rounded-[2.5rem] shadow-2xl w-full h-auto object-cover aspect-square"
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 600px"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trois univers */}
        {deferredSections && (
          <section id="univers" className="py-12 md:py-20 bg-white dark:bg-gray-900">
            <div className="w-full px-4 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  whileInView={disableMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={disableMotion ? instantTransition : { duration: 0.5 }}
                  viewport={disableMotion ? undefined : { once: true }}
                  className="mb-10 md:mb-12"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Pour qui</span>
                  <h2 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white max-w-md">
                    Trois univers, un seul accompagnement
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                  {universCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      whileInView={disableMotion ? undefined : { opacity: 1, y: 0 }}
                      transition={disableMotion ? instantTransition : { duration: 0.4, delay: index * 0.1 }}
                      viewport={disableMotion ? undefined : { once: true, margin: "-50px" }}
                      className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-4"
                    >
                      <OptimizedImage
                        src={card.img}
                        alt={card.title}
                        width={400}
                        height={220}
                        className="w-full h-40 object-cover rounded-2xl"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
                        {card.icon}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">{card.text}</p>
                      <Link href={card.link} className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 flex items-center gap-1 hover:underline">
                        En savoir plus <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Programme */}
        {deferredSections && (
          <section id="programme" className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
            <div className="w-full px-4 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  whileInView={disableMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={disableMotion ? instantTransition : { duration: 0.5 }}
                  viewport={disableMotion ? undefined : { once: true }}
                  className="mb-10 md:mb-12 max-w-2xl"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Le programme</span>
                  <h2 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    Un parcours pas à pas, jamais imposé
                  </h2>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    Chaque enfant avance à son allure : les modules se débloquent selon ses progrès, pas selon son âge.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                  <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-px bg-gray-200 dark:bg-gray-700" />
                  {programmeSteps.map((s, index) => (
                    <motion.div
                      key={s.step}
                      initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      whileInView={disableMotion ? undefined : { opacity: 1, y: 0 }}
                      transition={disableMotion ? instantTransition : { duration: 0.4, delay: index * 0.1 }}
                      viewport={disableMotion ? undefined : { once: true, margin: "-50px" }}
                      className="relative z-10 flex flex-col gap-3"
                    >
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-white font-bold ${
                          index % 2 === 0 ? "bg-indigo-600" : "bg-teal-500"
                        }`}
                      >
                        {s.step}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{s.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Ressources */}
        {deferredSections && (
          <section id="ressources" className="py-12 md:py-20 bg-white dark:bg-gray-900">
            <div className="w-full px-4 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="mb-10 md:mb-12 flex items-end justify-between gap-4 flex-wrap">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Ressources</span>
                    <h2 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                      À télécharger dès aujourd'hui
                    </h2>
                  </div>
                  <Link
                    href="/resources"
                    className="rounded-full border border-gray-200 dark:border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Toutes les ressources
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {resourceCards.map((r, index) => (
                    <motion.div
                      key={r.title}
                      initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      whileInView={disableMotion ? undefined : { opacity: 1, y: 0 }}
                      transition={disableMotion ? instantTransition : { duration: 0.4, delay: index * 0.1 }}
                      viewport={disableMotion ? undefined : { once: true, margin: "-50px" }}
                      className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-5 shadow-sm flex flex-col gap-2"
                    >
                      <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${r.tagColor}`}>{r.tag}</span>
                      <h4 className="mt-1 font-semibold text-gray-900 dark:text-white">{r.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">{r.text}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{r.meta}</span>
                        <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Communauté */}
        {deferredSections && (
          <section id="communaute" className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
            <div className="w-full px-4 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-2 items-center">
                <motion.div
                  initial={disableMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  whileInView={disableMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={disableMotion ? instantTransition : { duration: 0.5 }}
                  viewport={disableMotion ? undefined : { once: true }}
                  className="rounded-3xl bg-teal-50 dark:bg-teal-900/20 p-6 md:p-8"
                >
                  <p className="text-lg font-medium text-teal-900 dark:text-teal-100 leading-snug">
                    « Depuis qu'on utilise le planning visuel, les matins sont enfin sereins. On ne se sent plus seuls. »
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <OptimizedImage
                      src="/assets/family/avatar/marie.webp"
                      alt="Camille"
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                      sizes="44px"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">Camille, maman de Léo</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Membre depuis 8 mois</div>
                    </div>
                  </div>
                </motion.div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Communauté</span>
                  <h2 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    Vous n'êtes pas seul·e sur ce chemin
                  </h2>
                  <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-md">
                    Échangez avec d'autres parents, posez vos questions à des professionnels et partagez vos petites victoires dans un espace bienveillant, sans jugement.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-teal-700 transition-colors"
                  >
                    Rejoindre la communauté
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        {deferredSections && (
          <section className="py-12 md:py-16">
            <div className="w-full px-4 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-600 to-teal-500 p-8 md:p-12 flex flex-wrap items-center justify-between gap-6">
                <div className="max-w-md">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Restez informé·e des nouvelles ressources</h2>
                  <p className="mt-2 text-indigo-100">Une fois par mois, une sélection de fiches, d'articles et de conseils. Pas de spam, promis.</p>
                </div>
                <form className="flex gap-2 flex-wrap" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="rounded-full px-5 py-3 text-sm w-64 max-w-full border-0 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
                  >
                    S'inscrire
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

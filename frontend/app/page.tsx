/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { Card, CardBody, CardHeader } from "@/components/OptimizedNextUI";
import OptimizedImage from "@/components/OptimizedImage";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import Link from "next/link";

import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Heart,
  Star,
  ArrowRight,
  CheckCircle,
  Brain,
  Lightbulb,
  Shield,
  Sparkles,
  Award,
  MessageCircle,
  PlayCircle,
  Leaf,
  CalendarRange,
  Headphones
} from "lucide-react";

// Données des articles optimisées
const articles = [
  {
    id: 11,
    title: "Stratégies d'apprentissage pour enfants autistes",
    description: "Découvrez des méthodes adaptées pour faciliter l'apprentissage...",
    img: "/assets/images/autism-awareness.webp",
    link: "/articles/11",
    category: "Éducation"
  },
  {
    id: 12,
    title: "Ressources éducatives spécialisées",
    description: "Une collection d'outils et de matériels éducatifs...",
    img: "/assets/aba_therapy.webp",
    link: "/articles/12",
    category: "Ressources"
  },
  {
    id: 13,
    title: "Accompagnement parental",
    description: "Conseils et soutien pour les parents d'enfants autistes...",
    img: "/assets/family/family.webp",
    link: "/articles/13",
    category: "Parentalité"
  }
];

const communityHighlights = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Famille impliquée",
    description:
      "Chaque module est co-construit avec nos enfants, nos éducateurs et la communauté AutiStudy.",
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    title: "Support humain",
    description:
      "Une équipe à l’écoute pour répondre à vos questions et ajuster les parcours selon vos retours.",
  },
  {
    icon: <Leaf className="h-5 w-5" />,
    title: "Respect sensoriel",
    description:
      "Des activités pensées pour apaiser les sens, valoriser les routines et éviter la surcharge.",
  },
];

const programmeSteps = [
  {
    step: "01",
    title: "Découverte guidée",
    description:
      "Nous apprenons à connaître votre enfant grâce à un quiz sensoriel et des observations familiales.",
  },
  {
    step: "02",
    title: "Parcours personnalisé",
    description:
      "Alia génère des activités adaptées aux centres d’intérêt et au niveau d’énergie du moment.",
  },
  {
    step: "03",
    title: "Suivi bienveillant",
    description:
      "Les progrès sont visualisés sur un tableau de bord clair, avec des rappels doux et positifs.",
  },
  {
    step: "04",
    title: "Échanges continus",
    description:
      "Partagez vos retours, recevez des conseils et adaptez les parcours en quelques clics.",
  },
];

const eventShowcase = [
  {
    title: "Ateliers famille & sensoriel",
    description:
      "Sessions en direct pour apprendre à créer des routines sécurisantes à la maison.",
    date: "Chaque mercredi",
  },
  {
    title: "Masterclass neurodiversité",
    description:
      "Des experts partagent des stratégies concrètes pour l’école, la maison et les loisirs.",
    date: "1er samedi du mois",
  },
  {
    title: "Rencontres parents / pro",
    description:
      "Échanges libres autour des solutions AutiStudy et des aménagements à mettre en place.",
    date: "Planning disponible dans l’espace Contrôle",
  },
];

// Services principaux
const services = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Ressources Éducatives",
    description: "Matériels adaptés et spécialisés pour tous les niveaux",
    color: "bg-blue-100 text-blue-600",
    link: "/resources"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Exercices Interactifs",
    description: "Activités ludiques et progressives personnalisées",
    color: "bg-green-100 text-green-600",
    link: "/controle"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Accompagnement",
    description: "Soutien personnalisé et suivi des progrès",
    color: "bg-purple-100 text-purple-600",
    link: "/soutien"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Support Parental",
    description: "Conseils et ressources pour les familles",
    color: "bg-orange-100 text-orange-600",
    link: "/about"
  }
];

// Témoignages
const testimonials = [
  {
    name: "Parent d'élève",
    role: "Parent de Maeva",
    content: "AutiStudy a transformé l'apprentissage de Maeva. Les exercices sont parfaitement adaptés à ses besoins.",
    avatar: "/assets/family/avatar/family.webp",
    rating: 5
  },
  {
    name: "Benjamin Insigne",
    role: "Papa de Michael, 14 ans",
    content: "Avec AutiStudy, je me sens comme un membre de la famille même si nous n'avons pas le même nom. Cette plateforme comprend vraiment les besoins de Michael et nous accompagne au quotidien.",
    avatar: "/assets/family/avatar/benjamin.webp",
    rating: 5
  },
  {
    name: "Marie",
    role: "Éducatrice spécialisée",
    content: "Une plateforme exceptionnelle qui respecte les besoins spécifiques de chaque enfant.",
    avatar: "/assets/family/avatar/marie.webp",
    rating: 5
  },
  {
    name: "Thomas",
    role: "Papa de Lucas",
    content: "Les progrès de notre fils sont remarquables grâce aux exercices personnalisés d'AutiStudy.",
    avatar: "/assets/family/avatar/thomas.webp",
    rating: 5
  }
];

export default function HomePage() {
  const { isMobile } = useMobileOptimization();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main>
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
          <div className="relative w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center grid-cls-optimized grid-cls-optimized grid-cls-optimized">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                    Apprentissage{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      adapté
                    </span>{" "}
                    pour enfants autistes
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
                    Une plateforme éducative spécialisée qui s'adapte aux besoins
                    uniques de chaque enfant pour un apprentissage efficace et bienveillant.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <Link
                      href="/users/signup"
                      className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Star className="w-4 h-4 md:w-5 md:h-5" />
                      Commencer gratuitement
                    </Link>
                    <Link
                      href="/about"
                      className="border-2 border-blue-600 text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Shield className="w-4 h-4 md:w-5 md:h-5" />
                      En savoir plus
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  className="relative"
                >
                  <OptimizedImage
                    src="/assets/home/home.webp"
                    alt="Enfant apprenant avec AutiStudy"
                    width={600}
                    height={400}
                    className="hero-image rounded-2xl shadow-2xl image-optimized cls-image-container"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-gradient-to-b from-white via-blue-50/40 to-white dark:via-gray-900/50">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                    Notre méthode
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    Un parcours d&apos;apprentissage apaisant et structuré
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                    Nous combinons observation familiale, IA bienveillante et coaching humain pour guider chaque enfant pas à pas.
                    Les étapes ci-dessous vous accompagnent depuis la découverte jusqu&apos;à la célébration des réussites.
                  </p>
                  <div className="rounded-2xl border border-blue-100 bg-white/90 p-4 text-sm text-blue-700 shadow-sm backdrop-blur dark:border-blue-900/40 dark:bg-gray-900/80 dark:text-blue-200">
                    <strong>Transparence :</strong> votre famille garde le contrôle. Vous choisissez les activités à activer, les notifications et les retours envoyés à l’équipe AutiStudy.
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  {programmeSteps.map((step) => (
                    <div
                      key={step.step}
                      className="group rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-blue-900/40 dark:bg-gray-900/70"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                        {step.step}
                      </span>
                      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center mb-12 md:mb-16"
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  Nos services
                </h2>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                  Tout ce dont vous avez besoin pour accompagner l'apprentissage de votre enfant
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 grid-cls-optimized grid-cls-optimized grid-cls-optimized">
                {services.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <Link href={service.link}>
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardBody className="text-center p-4 md:p-6">
                          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${service.color} flex items-center justify-center mx-auto mb-3 md:mb-4`}>
                            {service.icon}
                          </div>
                          <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            {service.title}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                            {service.description}
                          </p>
                        </CardBody>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-white dark:bg-gray-900">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
              >
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
                    Communauté AutiStudy
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    Nous avançons ensemble, parents, pros et enfants
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                    AutiStudy est né d&apos;une famille qui cherchait des réponses. Aujourd&apos;hui,
                    nous co-créons la plateforme avec les retours des parents, éducateurs et thérapeutes qui vivent au quotidien la neurodiversité.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {communityHighlights.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-purple-100 bg-white/90 p-4 text-sm leading-relaxed shadow-md dark:border-purple-900/40 dark:bg-gray-900/70 dark:text-gray-300"
                      >
                        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-200">
                          {item.icon}
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 p-1">
                  <div className="rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur dark:bg-gray-900/80">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Témoignages en direct
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      “AutiStudy nous aide à structurer nos journées et à garder une trace des réussites de notre fils.
                      Nous nous sentons accompagnés en permanence.” — Paul & Virginie
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-blue-100 bg-white/90 p-4 text-sm dark:border-blue-900/40 dark:bg-gray-900/60">
                        <Award className="mb-2 h-5 w-5 text-blue-600 dark:text-blue-300" />
                        <p className="font-semibold text-gray-900 dark:text-white">
                          +500 familles accompagnées
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          Des profils variés, des besoins sensoriels différents, une même recherche de sérénité.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-blue-100 bg-white/90 p-4 text-sm dark:border-blue-900/40 dark:bg-gray-900/60">
                        <Headphones className="mb-2 h-5 w-5 text-blue-600 dark:text-blue-300" />
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Coaching parental mensuel
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          Des rendez-vous pour répondre à vos questions et vous aider à adapter AutiStudy.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        {/* Témoignages Section */}
        <section className="py-12 md:py-20">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center mb-12 md:mb-16"
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  Ils nous font confiance
                </h2>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                  Découvrez les témoignages de nos utilisateurs
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 grid-cls-optimized">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <Card className="h-full">
                      <CardBody className="p-4 md:p-6">
                        <div className="flex items-center mb-3 md:mb-4 cls-image-container"><OptimizedImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={60}
                          height={60}
                          className="w-12 h-12 md:w-15 md:h-15 rounded-full mr-3 md:mr-4 image-optimized"
                          sizes="60px"
                        />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          "{testimonial.content}"
                        </p>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
                    Agenda AutiStudy
                  </span>
                  <h2 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    Des rendez-vous pour apprendre et souffler
                  </h2>
                  <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                    Participez à nos ateliers en ligne et trouvez des ressources pour
                    prolonger l&apos;expérience à la maison. Chaque mois, nous ajoutons des
                    contenus pratiques, des fiches sensorimotrices et des vidéos explicatives.
                  </p>
                  <div className="mt-8 space-y-4">
                    {eventShowcase.map((event) => (
                      <div
                        key={event.title}
                        className="flex flex-col gap-3 rounded-2xl border border-teal-100 bg-white/90 p-4 shadow-sm dark:border-teal-900/40 dark:bg-gray-900/70"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {event.title}
                          </h3>
                          <span className="rounded-full border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-600 dark:border-teal-900/40 dark:text-teal-200">
                            {event.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {event.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-teal-600 hover:to-blue-600"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Voir le programme complet
                    </Link>
                    <Link
                      href="/resources"
                      className="inline-flex items-center gap-2 rounded-full border border-teal-200 px-5 py-2.5 text-sm font-semibold text-teal-700 transition hover:border-teal-300 hover:text-teal-800 dark:border-teal-900/40 dark:text-teal-200 dark:hover:border-teal-700"
                    >
                      <CalendarRange className="h-4 w-4" />
                      Ressources à télécharger
                    </Link>
                  </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-500/10 p-1">
                  <div className="rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur dark:bg-gray-900/80">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Ce qui vous attend
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-300" />
                        <span>
                          Des fiches d&apos;activités sensorimotrices prêtes à l&apos;emploi pour
                          rythmer vos semaines.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-300" />
                        <span>
                          Des vidéos explicatives courtes pour accompagner vos enfants devant
                          l&apos;écran.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-300" />
                        <span>
                          Des supports de communication pour échanger avec l&apos;équipe pédagogique
                          ou thérapeutique.
                        </span>
                      </li>
                    </ul>
                    <div className="mt-6 rounded-2xl border border-teal-100 bg-white/90 px-4 py-3 text-sm text-teal-700 shadow-sm dark:border-teal-900/40 dark:bg-gray-900/70 dark:text-teal-200">
                      Abonnez-vous à notre lettre douce : chaque dimanche, une suggestion
                      sensorielle, une activité à imprimer et un mot de soutien.
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  Articles récents
                </h2>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                  Découvrez nos derniers articles et conseils
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 grid-cls-optimized grid-cls-optimized grid-cls-optimized">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <CardHeader className="p-0">
                        <OptimizedImage
                          src={article.img}
                          alt={article.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover image-optimized cls-image-container"
                          priority={article.id === 1}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                        />
                      </CardHeader>
                      <CardBody className="p-4 md:p-6">
                        <div className="mb-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {article.category}
                          </span>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                          {article.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">
                          {article.description}
                        </p>
                        <Link
                          href={article.link}
                          className="text-blue-600 hover:underline font-semibold flex items-center gap-2"
                        >
                          Lire la suite
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Call-to-Action */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="w-full px-4 md:px-8 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
                Prêt à commencer l'aventure ?
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8">
                Rejoignez des centaines de familles qui font confiance à AutiStudy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/users/signup"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Créer un compte gratuit
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Lightbulb className="w-5 h-5" />
                  Nous contacter
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </div>
  );
}

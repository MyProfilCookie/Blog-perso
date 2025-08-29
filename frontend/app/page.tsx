/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { Suspense, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/OptimizedNextUI";
import OptimizedImage from "@/components/OptimizedImage";
import MobileOptimizedImage from "@/components/MobileOptimizedImage";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import { LazyWrapper } from "@/components/LazyComponents";
import Link from "next/link";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Users, 
  Target, 
  Award, 
  Heart, 
  Star, 
  ArrowRight, 
  Play,
  CheckCircle,
  Brain,
  Lightbulb,
  Shield
} from "lucide-react";

// Données des articles optimisées
const articles = [
  {
    id: 1,
    title: "Stratégies d'apprentissage pour enfants autistes",
    description: "Découvrez des méthodes adaptées pour faciliter l'apprentissage...",
    img: "/assets/images/autism-awareness.webp",
    link: "/articles/strategies-apprentissage",
    category: "Éducation"
  },
  {
    id: 2,
    title: "Ressources éducatives spécialisées",
    description: "Une collection d'outils et de matériels éducatifs...",
    img: "/assets/aba_therapy.webp",
    link: "/articles/ressources-educatives",
    category: "Ressources"
  },
  {
    id: 3,
    title: "Accompagnement parental",
    description: "Conseils et soutien pour les parents d'enfants autistes...",
    img: "/assets/family/family.webp",
    link: "/articles/accompagnement-parental",
    category: "Parentalité"
  }
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
    name: "Chantal",
    role: "Maman de Maeva",
    content: "AutiStudy a transformé l'apprentissage de notre fille. Les exercices sont parfaitement adaptés à ses besoins.",
    avatar: "/assets/family/avatar/chantal.webp",
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
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
          <div className="relative w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                    Apprentissage{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      adapté
                    </span>{" "}
                    pour enfants autistes
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Une plateforme éducative spécialisée qui s'adapte aux besoins 
                    uniques de chaque enfant pour un apprentissage efficace et bienveillant.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/users/signup" 
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Star className="w-5 h-5" />
                      Commencer gratuitement
                    </Link>
                    <Link 
                      href="/about" 
                      className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      En savoir plus
                    </Link>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <OptimizedImage
                    src="/assets/home/home.webp"
                    alt="Enfant apprenant avec AutiStudy"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                    priority
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Nos services
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Tout ce dont vous avez besoin pour accompagner l'apprentissage de votre enfant
                </p>
              </motion.div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={service.link}>
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardBody className="text-center p-6">
                          <div className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mx-auto mb-4`}>
                            {service.icon}
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
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

        {/* Témoignages Section */}
        <section className="py-20">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Ils nous font confiance
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Découvrez les témoignages de nos utilisateurs
                </p>
              </motion.div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full">
                      <CardBody className="p-6">
                        <div className="flex items-center mb-4">
                          <OptimizedImage
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            width={60}
                            height={60}
                            className="w-15 h-15 rounded-full mr-4"
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

        {/* Articles Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Articles récents
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Découvrez nos derniers articles et conseils
                </p>
              </motion.div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <CardHeader className="p-0">
                        <OptimizedImage
                          src={article.img}
                          alt={article.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover"
                          priority={article.id === 1}
                        />
                      </CardHeader>
                      <CardBody className="p-6">
                        <div className="mb-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {article.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
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
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="w-full px-4 md:px-8 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prêt à commencer l'aventure ?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
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
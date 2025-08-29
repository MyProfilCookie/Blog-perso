/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { Suspense } from "react";
import { Card, CardBody, CardHeader } from "@/components/OptimizedNextUI";
import OptimizedImage from "@/components/OptimizedImage";
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
    name: "Paul",
    role: "Papa développeur",
    content: "En tant que parent et développeur, je suis fier de contribuer à une plateforme qui fait vraiment la différence.",
    avatar: "/assets/family/avatar/paul.webp",
    rating: 5
  },
  {
    name: "Maeva",
    role: "Élève",
    content: "J'aime beaucoup les exercices de musique et d'art ! C'est amusant et j'apprends beaucoup.",
    avatar: "/assets/family/avatar/maeva.webp",
    rating: 5
  }
];

// Statistiques
const stats = [
  { number: "500+", label: "Exercices créés", icon: <Target className="w-6 h-6" /> },
  { number: "50+", label: "Familles accompagnées", icon: <Users className="w-6 h-6" /> },
  { number: "95%", label: "Satisfaction", icon: <Star className="w-6 h-6" /> },
  { number: "24/7", label: "Support disponible", icon: <Shield className="w-6 h-6" /> }
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream dark:bg-gray-900">
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="relative pt-8 pb-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 overflow-hidden">
          {/* Éléments décoratifs de fond */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="w-full px-4 md:px-8 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                {/* Logo et titre */}
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <div className="w-16 h-16 mr-4">
                    <svg
                      height="64"
                      viewBox="0 0 200 200"
                      width="64"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      <circle cx={100} cy={100} fill="#f2f2f2" r={90} />
                      <path
                        d="M100 30 A30 30 0 0 1 130 60 L130 100 A30 30 0 0 1 100 130 L100 170 A30 30 0 0 1 70 140 L70 100 A30 30 0 0 1 100 70 Z"
                        fill="#0066cc"
                      />
                      <circle cx={165} cy={100} fill="#cc3300" r={15} />
                      <circle cx={35} cy={100} fill="#ff9900" r={15} />
                      <circle cx={100} cy={165} fill="#33cc33" r={15} />
                      <path
                        d="M85 95 A10 10 0 1 1 95 105 A10 10 0 1 1 105 95 A10 10 0 1 1 115 105 A10 10 0 1 1 85 95"
                        fill="none"
                        stroke="white"
                        strokeWidth={3}
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
                      AutiStudy
                    </h1>
                    <p className="text-lg md:text-xl text-blue-600 dark:text-blue-400 font-medium">
                      L'éducation adaptée
                    </p>
                  </div>
                </div>

                {/* Sous-titre et description */}
                <div className="mb-8">
                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 font-medium">
                    Plateforme éducative spécialisée pour les enfants autistes
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                    Créée par une famille pour les familles. Des ressources adaptées, ludiques et efficaces pour l'épanouissement de chaque enfant.
                  </p>
                </div>

                {/* Points clés */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center justify-center lg:justify-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exercices adaptés</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <Heart className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Approche bienveillante</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <Users className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Support familial</span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    href="/users/signup" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <BookOpen className="w-5 h-5" />
                    Commencer gratuitement
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/about" 
                    className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 font-semibold flex items-center justify-center gap-2 hover:border-blue-700"
                  >
                    <Play className="w-5 h-5" />
                    Découvrir notre histoire
                  </Link>
                </div>

                {/* Statistiques rapides */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Exercices créés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">50+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Familles accompagnées</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">95%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
                  </div>
                </div>
              </motion.div>

              {/* Image principale */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative">
                  <OptimizedImage
                    src="/assets/home/home.webp"
                    alt="Famille AutiStudy - Éducation adaptée pour enfants autistes"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                    priority
                  />
                  {/* Overlay avec texte */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl flex items-end">
                    <div className="p-6 text-white">
                      <p className="text-lg font-semibold">"Une famille, une mission : l'éducation inclusive"</p>
                      <p className="text-sm opacity-90">Chantal, Paul & Maeva</p>
                    </div>
                  </div>
                </div>
                
                {/* Éléments flottants */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">Recommandé par les familles</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">100% sécurisé</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section Présentation */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Une famille, une mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
                AutiStudy est née de l'expérience d'une famille avec un enfant autiste. 
                Nous créons des ressources éducatives adaptées, ludiques et efficaces.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={service.link}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer">
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
        </section>

        {/* Section Statistiques */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Notre impact en chiffres
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-white mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Témoignages */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ils nous font confiance
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Découvrez les témoignages de notre famille et de nos utilisateurs
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
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
                          className="rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
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
        </section>

        {/* Section Articles */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="w-full px-4 md:px-8 lg:px-12">
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
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody, CardFooter, Button, Chip } from "@nextui-org/react";
import { ExternalLink, ArrowRight, Eye, Utensils, Plane } from "lucide-react";
import Image from "next/image";

export default function ProjetPage() {
  const projects = [
    {
      title: "Vision Pour Tous",
      subtitle: "Imitation 'Lunettes pour tous'",
      description: "Une interface e-commerce moderne et accessible pour la vente de lunettes. Ce projet met l'accent sur la clarté visuelle et la facilité de navigation.",
      icon: <Eye className="w-6 h-6 text-blue-500" />,
      image: "https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=Modern%20optical%20store%20website%20interface%20showcasing%20glasses%20on%20display%2C%20clean%20minimalist%20design%2C%20white%20and%20blue%20color%20scheme&image_size=landscape_4_3",
      tags: ["E-commerce", "Accessibilité", "Design Épuré"],
      color: "blue"
    },
    {
      title: "AutiBurger",
      subtitle: "Site Burger Maison",
      description: "Une expérience culinaire immersive pour commander des burgers artisanaux. Design appétissant avec des interactions fluides.",
      icon: <Utensils className="w-6 h-6 text-orange-500" />,
      image: "https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=Gourmet%20burger%20restaurant%20website%20interface%2C%20dark%20theme%2C%20delicious%20burger%20photography%2C%20orange%20and%20black%20colors&image_size=landscape_4_3",
      tags: ["Restauration", "UX Gourmand", "Dark Mode"],
      color: "orange"
    },
    {
      title: "Évasion Autisme",
      subtitle: "Agence de Voyage Adaptée",
      description: "Une plateforme de réservation de voyages conçue pour la sérénité. Destinations calmes et hébergements adaptés.",
      icon: <Plane className="w-6 h-6 text-teal-500" />,
      image: "https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=Travel%20agency%20website%20interface%20featuring%20serene%20tropical%20landscapes%2C%20calm%20colors%2C%20inviting%20atmosphere&image_size=landscape_4_3",
      tags: ["Voyage", "Sérénité", "Réservation"],
      color: "teal"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-24 px-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Notre Philosophie : <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">Apprendre par le Projet</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed"
          >
            Chez AutiStudy, nous croyons que la meilleure façon de grandir est de construire. 
            Ces projets fictifs démontrent nos compétences et notre vision pour des applications web modernes et inclusives.
          </motion.p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              De l'idée à la réalité
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Chaque projet présenté ici est plus qu'une simple démonstration technique. C'est une exploration de différents secteurs d'activité (commerce, restauration, tourisme) à travers le prisme de l'accessibilité et de l'expérience utilisateur.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Nous nous inspirons de succès existants pour réimaginer des interfaces plus intuitives, performantes et agréables pour tous.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">1</div>
                <div>
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-300">Immersion</h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-400">Comprendre les besoins réels du secteur</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl">2</div>
                <div>
                  <h3 className="font-bold text-purple-900 dark:text-purple-300">Conception</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-400">Créer des interfaces centrées sur l'humain</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-xl">3</div>
                <div>
                  <h3 className="font-bold text-pink-900 dark:text-pink-300">Réalisation</h3>
                  <p className="text-sm text-pink-700 dark:text-pink-400">Développer avec les dernières technologies</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Nos Projets Pilotes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-800 border dark:border-gray-700">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className={`absolute inset-0 bg-${project.color}-500/20 z-10`} />
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-black/80 p-2 rounded-full shadow-lg backdrop-blur-sm">
                    {project.icon}
                  </div>
                </div>
                <CardBody className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{project.title}</h3>
                    <p className={`text-sm font-medium text-${project.color}-600 dark:text-${project.color}-400`}>{project.subtitle}</p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                      <Chip key={i} size="sm" variant="flat" className={`bg-${project.color}-100 text-${project.color}-700 dark:bg-${project.color}-900/30 dark:text-${project.color}-300`}>
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </CardBody>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Button 
                    className={`w-full bg-${project.color}-600 text-white shadow-lg`}
                    endContent={<ArrowRight className="w-4 h-4" />}
                  >
                    Voir le concept
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

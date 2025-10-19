"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Heart,
  Smile,
  Book,
  Music,
  Palette,
  Users,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";
import Image from "next/image";

const MichaelPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Images de Michael
  const galleryImages = [
    "/assets/michael/michael1.webp",
    "/assets/michael/michael2.webp",
    "/assets/michael/michael3.webp",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* En-tête de la page */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
            Ma page dédiée à Michael
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Un espace personnel pour découvrir Michael, ses passions et son parcours
          </p>
        </motion.div>

        {/* Section principale - Profil de Michael */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Carte principale avec photo et informations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden shadow-xl border-2 border-purple-200 dark:border-purple-800">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                    <Image
                      src="/assets/family/michael.webp"
                      alt="Michael"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center mt-4">Michael</CardTitle>
                <p className="text-center text-blue-100">14 ans</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    À propos de Michael
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Michael a 14 ans et fait partie de la communauté AutiStudy.
                    C'est un garçon plein de curiosité et d'énergie.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Ses intérêts
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Michael aime particulièrement les activités créatives et interactives.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Heart className="w-3 h-3 mr-1" /> 14 ans
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <Smile className="w-3 h-3 mr-1" /> Créatif
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Star className="w-3 h-3 mr-1" /> Curieux
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section des activités préférées */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-red-500" />
                  Les activités que Michael apprécie particulièrement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Book className="w-6 h-6 text-blue-600" />,
                      title: "Apprentissage ludique",
                      description: "Exercices interactifs et jeux éducatifs",
                    },
                    {
                      icon: <Music className="w-6 h-6 text-purple-600" />,
                      title: "Musique",
                      description: "Activités musicales et rythmiques",
                    },
                    {
                      icon: <Palette className="w-6 h-6 text-pink-600" />,
                      title: "Créativité",
                      description: "Dessin et activités artistiques",
                    },
                    {
                      icon: <Users className="w-6 h-6 text-green-600" />,
                      title: "Socialisation",
                      description: "Interactions et activités de groupe",
                    },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0">{activity.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {activity.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Outils et méthodes */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-950 dark:to-teal-950">
                <CardTitle className="flex items-center gap-2">
                  <Award className="text-green-600" />
                  Outils et méthodes adaptés aux besoins de Michael
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    {
                      title: "Supports visuels",
                      description:
                        "Utilisation d'images et de pictogrammes pour faciliter la compréhension",
                    },
                    {
                      title: "Exercices personnalisés",
                      description:
                        "Activités adaptées à son rythme et à ses centres d'intérêt",
                    },
                    {
                      title: "Routine structurée",
                      description:
                        "Un cadre rassurant avec des étapes claires et prévisibles",
                    },
                  ].map((tool, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-green-500 pl-4 py-2"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {tool.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Section progrès */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-950 dark:to-orange-950">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingUp className="text-yellow-600" />
                Suivi du développement et des progrès de Michael
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {[
                  {
                    date: "Janvier 2024",
                    achievement: "Progression en autonomie",
                    description:
                      "Michael a commencé à utiliser plus régulièrement les outils numériques de manière autonome.",
                  },
                  {
                    date: "Mars 2024",
                    achievement: "Amélioration de la communication",
                    description:
                      "Michael exprime mieux ses besoins et communique plus facilement avec son entourage.",
                  },
                  {
                    date: "Juin 2024",
                    achievement: "Développement de la créativité",
                    description:
                      "Michael explore de nouvelles activités créatives et montre un grand intérêt pour l'art.",
                  },
                ].map((progress, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        <Star className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {progress.date}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {progress.achievement}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {progress.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Galerie de souvenirs */}
        {galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-950 dark:to-rose-950">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="text-pink-600" />
                  Souvenirs et moments importants de la vie de Michael
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryImages.map((image, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                          onClick={() => setSelectedImage(image)}
                        >
                          <Image
                            src={image}
                            alt={`Michael ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogTitle>Photo de Michael</DialogTitle>
                        <div className="relative aspect-video">
                          <Image
                            src={image}
                            alt="Michael"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MichaelPage;


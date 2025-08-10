"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar } from "@/components/ui/calendar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MaevaPage = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [progressValue, setProgressValue] = useState(67);

  // Images de Maeva
  const images = [
    "/assets/maeva/maeva1.webp",
    "/assets/maeva/maeva.webp",
    "/assets/maeva/maevanini.webp",
    "/assets/maeva/IMG_1411.jpg",
    "/assets/maeva/IMG_1427.webp",
    "/assets/maeva/IMG_2248.webp",
  ];

  // Activités préférées
  const activites = [
    {
      titre: "Jeux éducatifs",
      description:
        "Maeva aime particulièrement les jeux d'association d'images et de mots.",
      niveau: "Enthousiaste",
    },
    {
      titre: "Dessin",
      description:
        "Elle adore dessiner et colorier, surtout avec des couleurs vives.",
      niveau: "Passion",
    },
    {
      titre: "Musique",
      description: "Écouter de la musique calme l'aide à se concentrer.",
      niveau: "Appréciation",
    },
    {
      titre: "Exercices tactiles",
      description:
        "Les activités avec différentes textures l'aident à développer sa sensorialité.",
      niveau: "Intérêt",
    },
  ];

  // Objectifs d'apprentissage
  const objectifs = [
    {
      domaine: "Communication",
      description: "Développer l'expression verbale et non-verbale",
      progres: 65,
    },
    {
      domaine: "Autonomie",
      description: "Renforcer les compétences quotidiennes",
      progres: 72,
    },
    {
      domaine: "Socialisation",
      description: "Améliorer les interactions avec les autres",
      progres: 58,
    },
    {
      domaine: "Motricité",
      description: "Travailler la coordination et la motricité fine",
      progres: 80,
    },
  ];

  // Contacts de l'équipe d'accompagnement
  const contacts = [
    {
      nom: "Dr. Marie Laurent",
      role: "Orthophoniste",
      telephone: "01 XX XX XX XX",
      email: "m.laurent@example.fr",
      jours: "Lundi et jeudi",
    },
    {
      nom: "Thomas Dubois",
      role: "Éducateur spécialisé",
      telephone: "01 XX XX XX XX",
      email: "t.dubois@example.fr",
      jours: "Mardi et vendredi",
    },
    {
      nom: "Nathalie Petit",
      role: "Psychologue",
      telephone: "01 XX XX XX XX",
      email: "n.petit@example.fr",
      jours: "Mercredi",
    },
  ];

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center text-violet-600 dark:text-violet-400 mb-2">
          Ma page dédiée à Maeva
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Un espace personnalisé pour suivre son développement et ses activités
        </p>
      </motion.div>

      {/* Tabs pour organiser le contenu */}
      <Tabs className="w-full" defaultValue="profil">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="activites">Activités</TabsTrigger>
          <TabsTrigger value="progres">Progrès</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        {/* Section Profil */}
        <TabsContent value="profil">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 overflow-hidden rounded-full border-2 border-violet-400">
                    <Image
                      alt="Maeva"
                      layout="fill"
                      objectFit="cover"
                      src={images[0]}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Maeva</CardTitle>
                    <CardDescription>Née le 26 octobre 2010</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg text-violet-600 dark:text-violet-400 mb-2">
                      À propos de Maeva
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Maeva est née le 26 octobre 2010 et habite à Sartrouville,
                      au 27 rue Pablo Picasso. Elle est une jeune fille pleine
                      de vie, mais qui fait face à des défis quotidiens en
                      raison de son retard de langage et de ses difficultés à
                      communiquer. Ces aspects de son développement nécessitent
                      une attention et des méthodes d&apos;apprentissage adaptées
                      pour l&apos;aider à progresser.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                      Maeva a aussi des préférences bien définies. Elle adore
                      les frites, ainsi que les paniers de Yoplait fraises, un
                      plaisir simple qui lui apporte beaucoup de bonheur.
                      Cependant, elle a également des aversions fortes,
                      notamment envers les chiens et les oiseaux. Elle est
                      particulièrement sensible au bruit, qui peut être une
                      source de stress majeur pour elle.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Préférences</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Les frites</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Les paniers de Yoplait fraises</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Les environnements calmes</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Les activités structurées</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Points de vigilance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <span className="text-red-500">×</span>
                            <span>Les chiens</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-red-500">×</span>
                            <span>Les oiseaux</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-red-500">×</span>
                            <span>Les environnements bruyants</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-red-500">×</span>
                            <span>Les changements imprévus</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agenda et rendez-vous</CardTitle>
                  <CardDescription>
                    Planification des activités et rendez-vous à venir
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <Calendar
                        className="rounded-md border"
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                      />
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="text-lg font-medium mb-4">
                        Prochains rendez-vous
                      </h3>
                      <div className="space-y-3">
                        <div className="border rounded-lg p-3">
                          <div className="flex justify-between">
                            <p className="font-medium">Orthophoniste</p>
                            <Badge variant="outline">30 Mars</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            14:00 - Dr. Marie Laurent
                          </p>
                        </div>
                        <div className="border rounded-lg p-3">
                          <div className="flex justify-between">
                            <p className="font-medium">Éducateur spécialisé</p>
                            <Badge variant="outline">2 Avril</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            10:30 - Thomas Dubois
                          </p>
                        </div>
                        <div className="border rounded-lg p-3">
                          <div className="flex justify-between">
                            <p className="font-medium">Psychologue</p>
                            <Badge variant="outline">5 Avril</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            16:15 - Nathalie Petit
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* Section Photos */}
        <TabsContent value="photos">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Album photos</CardTitle>
                <CardDescription>
                  Souvenirs et moments importants de la vie de Maeva
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Carrousel d'images */}
                <div className="mb-6">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem
                          key={index}
                          className="md:basis-1/2 lg:basis-1/3"
                        >
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-2">
                                <div className="relative w-full h-full">
                                  <Image
                                    alt={`Maeva ${index + 1}`}
                                    className="rounded-md cursor-pointer"
                                    layout="fill"
                                    objectFit="cover"
                                    src={image}
                                    onClick={() => handleImageClick(image)}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>

                {/* Grille d'images */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleImageClick(image)}
                    >
                      <Image
                        alt={`Maeva ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        src={image}
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Section Activités */}
        <TabsContent value="activites">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Activités préférées</CardTitle>
                <CardDescription>
                  Les activités que Maeva apprécie particulièrement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activites.map((activite, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {activite.titre}
                          </CardTitle>
                          <Badge variant="secondary">{activite.niveau}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">
                          {activite.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">
                    Programme d&apos;activités quotidien
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-5 bg-gray-100 dark:bg-gray-800 font-medium">
                      <div className="p-3 border-r">Horaire</div>
                      <div className="p-3 border-r hidden md:block">Lundi</div>
                      <div className="p-3 border-r hidden md:block">Mardi</div>
                      <div className="p-3 border-r hidden md:block">
                        Mercredi
                      </div>
                      <div className="p-3">Jeudi</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 border-t">
                      <div className="p-3 border-r font-medium">9h - 10h</div>
                      <div className="p-3 border-r hidden md:block">
                        Lecture
                      </div>
                      <div className="p-3 border-r hidden md:block">
                        Expression
                      </div>
                      <div className="p-3 border-r hidden md:block">
                        Motricité
                      </div>
                      <div className="p-3">Mathématiques</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 border-t">
                      <div className="p-3 border-r font-medium">10h - 11h</div>
                      <div className="p-3 border-r hidden md:block">Dessin</div>
                      <div className="p-3 border-r hidden md:block">
                        Musique
                      </div>
                      <div className="p-3 border-r hidden md:block">
                        Jeux éducatifs
                      </div>
                      <div className="p-3">Orthophonie</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 border-t">
                      <div className="p-3 border-r font-medium">11h - 12h</div>
                      <div className="p-3 border-r hidden md:block">
                        Orthophonie
                      </div>
                      <div className="p-3 border-r hidden md:block">
                        Lecture
                      </div>
                      <div className="p-3 border-r hidden md:block">
                        Expression
                      </div>
                      <div className="p-3">Dessin</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ressources pédagogiques</CardTitle>
                  <CardDescription>
                    Outils et méthodes adaptés aux besoins de Maeva
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion collapsible className="w-full" type="single">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Supports visuels</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1">
                          <li>
                            Cartes illustrées pour enrichir le vocabulaire
                          </li>
                          <li>Tableaux de communication avec pictogrammes</li>
                          <li>Affiches des routines journalières</li>
                          <li>
                            Livres adaptés avec supports visuels renforcés
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        Applications recommandées
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Bitsboard - pour créer des jeux personnalisés</li>
                          <li>Voice4u - aide à la communication</li>
                          <li>
                            Fun with Directions - pour améliorer la
                            compréhension
                          </li>
                          <li>
                            LetterSchool - pour l&apos;apprentissage de l&apos;écriture
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Matériel sensoriel</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Balles texturées pour la stimulation tactile</li>
                          <li>Coussin lesté pour moments de repos</li>
                          <li>Timer visuel pour gérer les transitions</li>
                          <li>
                            Écouteurs anti-bruit pour les environnements
                            sensibles
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* Section Progrès */}
        <TabsContent value="progres">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Objectifs d&apos;apprentissage</CardTitle>
                <CardDescription>
                  Suivi du développement et des progrès de Maeva
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {objectifs.map((objectif, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{objectif.domaine}</h3>
                        <span className="text-sm text-gray-500">
                          {objectif.progres}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {objectif.description}
                      </p>
                      <Progress className="h-2" value={objectif.progres} />
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">
                    Évolution mensuelle
                  </h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="h-[200px] w-full bg-gray-100 dark:bg-gray-800 rounded-md relative">
                        {/* Ligne de progression simulée - dans un vrai projet on utiliserait une bibliothèque de graphiques */}
                        <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                          <div className="w-1/6 h-[40%] bg-blue-500 opacity-70 mx-1 rounded-t-sm" />
                          <div className="w-1/6 h-[50%] bg-blue-500 opacity-70 mx-1 rounded-t-sm" />
                          <div className="w-1/6 h-[45%] bg-blue-500 opacity-70 mx-1 rounded-t-sm" />
                          <div className="w-1/6 h-[55%] bg-blue-500 opacity-70 mx-1 rounded-t-sm" />
                          <div className="w-1/6 h-[60%] bg-blue-500 opacity-70 mx-1 rounded-t-sm" />
                          <div className="w-1/6 h-[67%] bg-blue-500 opacity-70 mx-1 rounded-t-sm" />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Octobre</span>
                        <span>Novembre</span>
                        <span>Décembre</span>
                        <span>Janvier</span>
                        <span>Février</span>
                        <span>Mars</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">
                    Notes de progrès récentes
                  </h3>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-md">
                            Communication
                          </CardTitle>
                          <Badge>15 Mars</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Maeva a commencé à utiliser plus régulièrement les
                          cartes de communication pour exprimer ses besoins.
                          Progrès notable dans l&apos;utilisation de phrases courtes
                          de 2-3 mots.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-md">Autonomie</CardTitle>
                          <Badge>28 Février</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Maeva parvient maintenant à suivre sa routine matinale
                          avec moins de rappels. Elle utilise efficacement son
                          tableau visuel de tâches.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Section Contacts */}
        <TabsContent value="contacts">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Équipe d&apos;accompagnement</CardTitle>
                <CardDescription>
                  Professionnels qui travaillent avec Maeva
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contacts.map((contact, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{contact.nom}</CardTitle>
                        <CardDescription>{contact.role}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm flex items-center gap-2">
                            <svg
                              className="text-violet-500"
                              fill="none"
                              height="16"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              width="16"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            {contact.telephone}
                          </p>
                          <p className="text-sm flex items-center gap-2">
                            <svg
                              className="text-violet-500"
                              fill="none"
                              height="16"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              width="16"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                            {contact.email}
                          </p>
                          <p className="text-sm flex items-center gap-2">
                            <svg
                              className="text-violet-500"
                              fill="none"
                              height="16"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              width="16"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                height="18"
                                rx="2"
                                ry="2"
                                width="18"
                                x="3"
                                y="4"
                              />
                              <line x1="16" x2="16" y1="2" y2="6" />
                              <line x1="8" x2="8" y1="2" y2="6" />
                              <line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                            {contact.jours}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline">
                          Contacter
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <div className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Établissement scolaire</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">
                            ULIS de l&apos;école Jean Jaurès
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            15 Rue des Écoles, 78500 Sartrouville
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Tél: 01 XX XX XX XX
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium">Enseignante référente</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Mme Sophie Martin
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Email: s.martin@academie.fr
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium">AESH</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            M. Lucas Bernard
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Présent: Lundi, mardi, jeudi et vendredi
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Boutons de navigation */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          className="flex items-center gap-2"
          variant="outline"
          onClick={() => router.push("/controle")}
        >
          <svg
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Accueil
        </Button>
        <Button
          className="flex items-center gap-2"
          variant="outline"
          onClick={() => router.push("/controle")}
        >
          <svg
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
          </svg>
          Cours
        </Button>
        <Button
          className="flex items-center gap-2"
          variant="outline"
          onClick={() => router.push("/articles")}
        >
          <svg
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Articles
        </Button>
      </div>

      {/* Dialog pour afficher l'image en grand */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Photo de Maeva</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full aspect-square sm:aspect-video">
              <Image
                alt="Maeva"
                className="rounded-md"
                layout="fill"
                objectFit="contain"
                src={selectedImage}
              />
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaevaPage;

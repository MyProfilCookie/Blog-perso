/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { Link } from "@nextui-org/link";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Image,
} from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
// eslint-disable-next-line import/order
import ScrollToTopButton from "@/components/ScrollToTopButton";
import HeaderAutisme from "@/components/headerAutisme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCrown, faEnvelope, faMapMarkerAlt, faPhone, faQuestionCircle, faUser } from "@fortawesome/free-solid-svg-icons"; // Import des icônes
import AIAssistant from "@/components/AIAssistant";


export default function Home() {
  const [user, setUser] = useState<any>(null);

  // Charger l'utilisateur depuis localStorage (ou API) au montage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [imageIndices, setImageIndices] = useState(Array(8).fill(0));

  const articles = [
    {
      title: "5 astuces pour améliorer la concentration des enfants autistes",
      description:
        "Découvrez des méthodes pour aider les enfants à rester concentrés pendant leurs activités.",
      img: "/assets/home/home.webp",
    },
    {
      title: "Créer un environnement apaisant pour les enfants autistes",
      description:
        "Apprenez à organiser un espace calme et adapté aux besoins sensoriels des enfants autistes.",
      img: "/assets/home/home1.webp",
    },
    {
      title: "Les avantages des routines structurées",
      description:
        "Les routines peuvent apporter un sentiment de sécurité aux enfants autistes. Voici comment les mettre en place.",
      img: "/assets/home/home2.webp",
    },
  ];

  // Tableau des membres de l'équipe
  const teamMembers = [
    {
      name: "Papa",
      role: "Père de famille",
      img: "/assets/family/paul.png",
    },
    {
      name: "Maman",
      role: "Mère de famille",
      img: "/assets/family/chantal.png",
    },
    {
      name: "Virginie",
      role: "Sœur de Maeva",
      img: "/assets/family/virginie.png",
    },
    {
      name: "Joshua",
      role: "Frère de Maeva",
      img: "/assets/family/joshua.png",
    },
    {
      name: "Vanessa",
      role: "Soeur de Maeva",
      img: "/assets/family/vanessa.png",
    },
    {
      name: "Pauline",
      role: "Soeur de Maeva",
      img: "/assets/family/pauline.png",
    },
    {
      name: "Jessica",
      role: "Soeur de Maeva",
      img: "/assets/family/jessica.png",
    },
    {
      name: "Maeva",
      role: "Inspiratrice de la plateforme",
      img: "/assets/family/maeva.png",
    },
  ];

  // Fonction pour diviser les membres en groupes de 4
  const handleNextImage = (index: number) => {
    const newIndex = (imageIndices[index] + 1) % teamMembers.length;
    const newImageIndices = [...imageIndices];

    newImageIndices[index] = newIndex;
    setImageIndices(newImageIndices);
  };

  // Fonction pour revenir à l'image précédente

  const teamGroups = [];

  for (let i = 0; i < teamMembers.length; i += 2) {
    teamGroups.push(teamMembers.slice(i, i + 2));
  }

  const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  const previousSlide = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? articles.length - 1 : prevIndex - 1));
  const nextTeamSlide = () => setCurrentTeamIndex((prevIndex) => (prevIndex + 1) % teamGroups.length);
  const previousTeamSlide = () => setCurrentTeamIndex((prevIndex) => (prevIndex === 0 ? teamGroups.length - 1 : prevIndex - 1));




  return (
    <section className="flex flex-col items-center justify-center w-full gap-4 sm:gap-8 py-4 sm:py-12 px-2 sm:px-4">
      {/* Header Title Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center w-full max-w-full px-2 sm:px-4"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={`${title()} text-violet-600 dark:text-violet-300 text-2xl sm:text-4xl`}>
          Bienvenue sur AutiStudy
        </h1>
        <h2 className={subtitle({ class: "mt-2 sm:mt-4" })}>
          Bonjour à toi {user?.pseudo}
          {user?.isAdmin ? (
            <FontAwesomeIcon className="ml-2 text-yellow-500" icon={faCrown} />
          ) : (
            <FontAwesomeIcon className="ml-2 text-blue-500" icon={faUser} />
          )}
        </h2>
        <h2 className={subtitle({ class: "mt-2 sm:mt-4" })}>il est grand temps de faire de la paix avec l'autisme</h2>
        <h3 className={subtitle({ class: "mt-2 sm:mt-4" })}>
          Une plateforme dédiée à l'éducation des enfants autistes, offrant des
          ressources et un accompagnement personnalisés.
        </h3>
      </motion.div>
      <HeaderAutisme
        heading=""
        subheading="Ressources et accompagnement"
        description="Découvrez des informations essentielles pour accompagner les enfants et adultes autistes dans leur quotidien.
      "
      />

      {/* CTA Buttons */}
      {/* <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 md:flex-row"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button
          as={Link}
          className="text-white bg-blue-500 hover:bg-blue-400"
          href={siteConfig.links.docs}
        >
          Découvrir nos ressources
        </Button>
        <Button
          as={Link}
          className="text-blue-500 border-blue-500 hover:bg-blue-100 hover:text-blue-600"
          href={siteConfig.links.github}
        >
          <GithubIcon className="mr-2" size={20} />
          Code source sur GitHub
        </Button>
      </motion.div> */}

      {/* Image and Info Card Section */}
      {/* <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <Card className="py-6 max-w-[800px] w-full">
          <Link href="/resources">
            <CardBody className="flex flex-col items-center md:flex-row">
              <Image
                isZoomed
                width={240}
                alt="logo autistudy"
                src="/assets/home/home8.webp"
              />
              <div className="mt-6 md:mt-0 md:ml-8">
                <p className="font-bold uppercase text-tiny">Notre mission</p>
                <h4 className="font-bold text-large">
                  Accompagner chaque enfant
                </h4>
                <p className="mt-2 text-default-500">
                  Nous offrons des outils pédagogiques adaptés pour accompagner
                  les enfants autistes dans leur apprentissage, tout en prenant en
                  compte leurs particularités et besoins spécifiques.
                </p>
              </div>
            </CardBody>
          </Link>
        </Card>
      </motion.div> */}

      {/* Features Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-[1200px] mt-8 px-2 sm:px-4"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        {/* Feature 1 */}
        <Card
          className="p-6 transition-all transform bg-cream dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl hover:shadow-xl hover:border-violet-500"
          style={{
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Link href="/controle">
            <CardBody className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Image
                  isZoomed
                  width={600}
                  alt="Learning"
                  className="h-16 w-16 object-contain"
                  src="/assets/online-learning.webp"
                />
              </div>
              <h4 className="font-bold text-large text-gray-800 dark:text-white">Cours en ligne adaptés</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Des leçons personnalisées, adaptées aux besoins spécifiques des
                enfants autistes, pour chaque niveau scolaire.
              </p>
            </CardBody>
          </Link>
        </Card>

        {/* Feature 2 */}
        <Card
          className="p-6 transition-all transform bg-cream dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl hover:shadow-xl hover:border-violet-500"
          style={{
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Link href="/soutien">
            <CardBody className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Image
                  isZoomed
                  width={600}
                  alt="Support"
                  className="h-16 w-16 object-contain"
                  src="/assets/community-support.webp"
                />
              </div>
              <h4 className="font-bold text-large text-gray-800 dark:text-white">Soutien communautaire</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Un espace où parents, enseignants, et professionnels échangent des
                conseils et du soutien.
              </p>
            </CardBody>
          </Link>
        </Card>

        {/* Feature 3 */}
        <Card
          className="p-6 transition-all transform bg-cream dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl hover:shadow-xl hover:border-violet-500"
          style={{
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Link href="/progres">
            <CardBody className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Image
                  isZoomed
                  width={600}
                  alt="Progress"
                  className="h-16 w-16 object-contain"
                  src="/assets/progress-tracking.webp"
                />
              </div>
              <h4 className="font-bold text-large text-gray-800 dark:text-white">Suivi des progrès</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Des outils pour suivre les progrès de chaque enfant, pour une
                approche d'apprentissage optimisée.
              </p>
            </CardBody>
          </Link>
        </Card>
      </motion.div>




      {/* Articles and Tips Slider */}
      <motion.div
        animate={{ opacity: 1 }}
        className="w-full max-w-[800px] mt-8 sm:mt-16 mx-auto text-center px-2 sm:px-4"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <h2 className={`${title()} text-center text-blue-600 dark:text-blue-400 text-xl sm:text-2xl`}>Articles et Astuces</h2>
        <p className="mb-4 sm:mb-8 text-base sm:text-lg text-blue-500 dark:text-blue-300">
          Des conseils pratiques pour aider les enfants autistes au quotidien.
        </p>

        <div className="relative flex items-center justify-center px-2 sm:px-4">
          <Button
            isIconOnly
            className="absolute left-0 z-10 flex items-center justify-center w-10 h-10 text-lg text-white transform -translate-y-1/2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 top-1/2"
            onClick={previousSlide}
          >
            {"<"}
          </Button>

          <motion.div
            key={currentIndex}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-[1200px] px-4"
            exit={{ opacity: 0, x: 100 }}
            initial={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {articles.slice(currentIndex, currentIndex + 2).map((article, idx) => (
                <Card
                  key={idx}
                  className="w-full p-4 transition duration-300 ease-in-out rounded-lg shadow-lg bg-cream dark:bg-gray-800 hover:shadow-xl hover:border-blue-500 dark:border-gray-700"
                  style={{
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardBody className="flex flex-col items-center text-center">
                    <Image
                      isZoomed
                      alt={article.title}
                      width={600}
                      className="object-cover rounded-lg w-full h-[180px] mb-3"
                      height={280}
                      src={article.img}
                    />
                    <h4 className="mb-2 text-lg font-bold text-blue-700 dark:text-blue-400">
                      {article.title}
                    </h4>
                    <p className="text-sm text-blue-500 dark:text-blue-300">
                      {article.description}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </motion.div>

          <Button
            isIconOnly
            className="absolute right-0 z-10 flex items-center justify-center w-10 h-10 text-lg text-white transform -translate-y-1/2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 top-1/2"
            onClick={nextSlide}
          >
            {">"}
          </Button>
        </div>
      </motion.div>

      {/* Remplacer la section "Notre Équipe" par "Nos Approches Pédagogiques" */}
      <motion.div
        className="w-full max-w-5xl mx-auto mt-8 sm:mt-16 text-center px-2 sm:px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Titre */}
        <h2 className="text-2xl sm:text-4xl font-bold text-violet-700 dark:text-violet-400">Nos Approches Pédagogiques</h2>
        <p className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-500 dark:text-gray-400">
          Des méthodes adaptées aux besoins spécifiques des enfants autistes
        </p>

        <div className="relative flex items-center justify-center mt-6 sm:mt-10 px-2 sm:px-12">
          {/* Bouton précédent */}
          <Button
            isIconOnly
            className="absolute left-0 md:left-8 z-10 w-10 h-10 md:w-12 md:h-12 text-white bg-violet-600 rounded-full shadow-md hover:bg-violet-700 transition-all flex items-center justify-center"
            onClick={previousTeamSlide}
          >
            <span className="text-xl">&lt;</span>
          </Button>

          {/* Contenu des approches */}
          <div className="w-full max-w-4xl mx-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTeamIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 gap-8 sm:grid-cols-2"
              >
                {[
                  {
                    title: "Méthode TEACCH",
                    description: "Structuration de l'environnement et des activités pour favoriser l'autonomie et la compréhension",
                    icon: "/assets/icons/structure.svg",
                    color: "bg-blue-500"
                  },
                  {
                    title: "Communication Visuelle",
                    description: "Utilisation de supports visuels pour faciliter la communication et la compréhension",
                    icon: "/assets/icons/visual.svg",
                    color: "bg-green-500"
                  },
                  {
                    title: "Approche Sensorielle",
                    description: "Prise en compte des particularités sensorielles pour adapter l'environnement d'apprentissage",
                    icon: "/assets/icons/sensory.svg",
                    color: "bg-purple-500"
                  },
                  {
                    title: "Apprentissage Structuré",
                    description: "Décomposition des tâches en étapes simples et progressives pour faciliter l'acquisition",
                    icon: "/assets/icons/learning.svg",
                    color: "bg-orange-500"
                  },
                  {
                    title: "Intérêts Spécifiques",
                    description: "Utilisation des centres d'intérêt de l'enfant comme levier d'apprentissage et de motivation",
                    icon: "/assets/icons/interest.svg",
                    color: "bg-red-500"
                  },
                  {
                    title: "Gestion Émotionnelle",
                    description: "Outils et stratégies pour aider à identifier et gérer les émotions",
                    icon: "/assets/icons/emotion.svg",
                    color: "bg-teal-500"
                  },
                  {
                    title: "Autonomie Quotidienne",
                    description: "Développement des compétences pratiques pour favoriser l'indépendance",
                    icon: "/assets/icons/autonomy.svg",
                    color: "bg-indigo-500"
                  },
                  {
                    title: "Socialisation Adaptée",
                    description: "Apprentissage progressif des compétences sociales dans un cadre bienveillant",
                    icon: "/assets/icons/social.svg",
                    color: "bg-pink-500"
                  }
                ].slice(currentTeamIndex*2, currentTeamIndex*2+2).map((approach, index) => (
                  <Card
                    key={index}
                    className="p-6 transition-all transform bg-cream dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl hover:shadow-xl hover:border-violet-500"
                    style={{
                      borderRadius: '10px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <CardBody className="text-center">
                      <div className={`relative w-20 h-20 mx-auto mb-6 overflow-hidden rounded-full ${approach.color} flex items-center justify-center`}>
                        <FontAwesomeIcon 
                          icon={
                            index % 8 === 0 ? faUser : 
                            index % 8 === 1 ? faQuestionCircle : 
                            index % 8 === 2 ? faClock : 
                            index % 8 === 3 ? faEnvelope : 
                            index % 8 === 4 ? faMapMarkerAlt : 
                            index % 8 === 5 ? faPhone : 
                            index % 8 === 6 ? faCrown : 
                            faUser
                          } 
                          className="text-white text-3xl"
                        />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{approach.title}</h4>
                      <p className="text-gray-500 dark:text-gray-300">{approach.description}</p>
                    </CardBody>
                  </Card>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bouton suivant */}
          <Button
            isIconOnly
            className="absolute right-0 md:right-8 z-10 w-10 h-10 md:w-12 md:h-12 text-white bg-violet-600 rounded-full shadow-md hover:bg-violet-700 transition-all flex items-center justify-center"
            onClick={nextTeamSlide}
          >
            <span className="text-xl">&gt;</span>
          </Button>
        </div>
        
        {/* Bouton pour en savoir plus */}
        <div className="mt-8">
          <Button
            as={Link}
            href="/approches"
            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
          >
            Découvrir toutes nos approches
          </Button>
        </div>
      </motion.div>

      {/*  New Section: L'accompagnement de l'enfant et de l'adulte autiste */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full mt-16 text-center"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <h2 className={title({ color: "blue", class: "text-center dark:text-blue-400" })}>
          L'accompagnement des enfants et des adultes autistes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px] mt-12 mx-auto px-4">
          {/* Card 1 */}
          <Card className="shadow-md bg-blue-50 dark:bg-blue-900/30 border border-transparent dark:border-blue-800">
            <CardBody className="text-left text-blue-700 dark:text-blue-300">
              <h3 className="text-center"><strong>L'accompagnement de l'enfant autiste</strong></h3>
              <p className="mt-4">
                L'accompagnement des enfants autistes nécessite une approche personnalisée qui tient compte de leurs besoins spécifiques. Nos ressources éducatives sont conçues pour:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Respecter le rythme d'apprentissage de chaque enfant</li>
                <li>Proposer des activités adaptées à leurs centres d'intérêt</li>
                <li>Utiliser des supports visuels pour faciliter la compréhension</li>
                <li>Établir des routines structurées et prévisibles</li>
              </ul>
              <Link href="/resources" className="block mt-2 text-center text-blue-500 dark:text-blue-300 hover:underline">
                En savoir plus
              </Link>
            </CardBody>
          </Card>
          
          {/* Card 2 */}
          <Card className="shadow-md bg-violet-50 dark:bg-violet-900/30 border border-transparent dark:border-violet-800">
            <CardBody className="text-left text-violet-700 dark:text-violet-300">
              <h3 className="text-center"><strong>Stratégies éducatives adaptées</strong></h3>
              <p className="mt-4">
                Nos stratégies éducatives s'inspirent des meilleures pratiques et méthodes reconnues pour l'éducation des personnes autistes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Méthode TEACCH pour structurer l'environnement</li>
                <li>Communication visuelle et alternative</li>
                <li>Approche ABA adaptée et bienveillante</li>
                <li>Intégration sensorielle et régulation émotionnelle</li>
              </ul>
              <Link href="/strategies" className="block mt-2 text-center text-violet-500 dark:text-violet-300 hover:underline">
                Découvrir nos méthodes
              </Link>
            </CardBody>
          </Card>
          
          {/* Card 3 */}
          <Card className="shadow-md bg-green-50 dark:bg-green-900/30 border border-transparent dark:border-green-800">
            <CardBody className="text-left text-green-700 dark:text-green-300">
              <h3 className="text-center"><strong>Soutien aux familles</strong></h3>
              <p className="mt-4">
                Nous reconnaissons l'importance du soutien aux familles dans l'accompagnement des personnes autistes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Ressources pour comprendre l'autisme</li>
                <li>Conseils pratiques pour le quotidien</li>
                <li>Groupes de soutien et d'échange entre parents</li>
                <li>Formations et webinaires spécialisés</li>
              </ul>
              <Link href="/family-support" className="block mt-2 text-center text-green-500 dark:text-green-300 hover:underline">
                Accéder aux ressources
              </Link>
            </CardBody>
          </Card>
        </div>
      </motion.div>

      {/* Section: Témoignages et succès */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1200px] mt-16 mx-auto px-4"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <h2 className={title({ color: "orange", class: "text-center dark:text-orange-400" })}>
          Témoignages et histoires de réussite
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mt-4 mb-8 max-w-2xl mx-auto">
          Découvrez comment notre plateforme a aidé des enfants autistes à progresser dans leur parcours d'apprentissage
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Témoignage 1 */}
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-100 dark:border-orange-800/50 shadow-md">
            <CardBody className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={faUser} className="text-orange-600 dark:text-orange-300 text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-orange-700 dark:text-orange-300">Famille Martin</h3>
                  <p className="text-orange-600 dark:text-orange-400 text-sm">Parents de Lucas, 8 ans</p>
                </div>
              </div>
              <p className="italic text-gray-700 dark:text-gray-300">
                "Grâce à AutiStudy, Lucas a fait d'énormes progrès en mathématiques, une matière qu'il trouvait auparavant très difficile. Les exercices visuels et la structure claire l'ont vraiment aidé à comprendre les concepts."
              </p>
            </CardBody>
          </Card>
          
          {/* Témoignage 2 */}
          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-100 dark:border-teal-800/50 shadow-md">
            <CardBody className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-teal-200 dark:bg-teal-800 flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={faUser} className="text-teal-600 dark:text-teal-300 text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-teal-700 dark:text-teal-300">Sophie Dubois</h3>
                  <p className="text-teal-600 dark:text-teal-400 text-sm">Éducatrice spécialisée</p>
                </div>
              </div>
              <p className="italic text-gray-700 dark:text-gray-300">
                "J'utilise AutiStudy avec plusieurs enfants que j'accompagne. La possibilité d'adapter le contenu à chaque profil est inestimable. Les rapports hebdomadaires me permettent de suivre précisément leurs progrès."
              </p>
            </CardBody>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <Button
            as={Link}
            href="/temoignages"
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 dark:from-orange-600 dark:to-amber-600 dark:hover:from-orange-500 dark:hover:to-amber-500"
          >
            Voir plus de témoignages
          </Button>
        </div>
      </motion.div>

      {/* Section: Statistiques et impact */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1200px] mt-16 mx-auto px-4"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 2.2 }}
      >
        <h2 className={title({ color: "indigo", class: "text-center dark:text-indigo-400" })}>
          Notre impact
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {/* Stat 1 */}
          <Card className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 shadow-md">
            <CardBody className="p-6 text-center">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-300 mb-2">500+</div>
              <p className="text-indigo-700 dark:text-indigo-400">Enfants accompagnés</p>
            </CardBody>
          </Card>
          
          {/* Stat 2 */}
          <Card className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 shadow-md">
            <CardBody className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-300 mb-2">85%</div>
              <p className="text-blue-700 dark:text-blue-400">Progression moyenne</p>
            </CardBody>
          </Card>
          
          {/* Stat 3 */}
          <Card className="bg-violet-50 dark:bg-violet-900/30 border border-violet-100 dark:border-violet-800 shadow-md">
            <CardBody className="p-6 text-center">
              <div className="text-4xl font-bold text-violet-600 dark:text-violet-300 mb-2">1000+</div>
              <p className="text-violet-700 dark:text-violet-400">Ressources éducatives</p>
            </CardBody>
          </Card>
          
          {/* Stat 4 */}
          <Card className="bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 shadow-md">
            <CardBody className="p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-300 mb-2">24/7</div>
              <p className="text-purple-700 dark:text-purple-400">Support disponible</p>
            </CardBody>
          </Card>
        </div>
      </motion.div>

      {/* AI Assistant Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1200px] mt-16 text-center mx-auto px-4"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 2.5 }}
      >
        <h2 className="text-3xl font-bold text-violet-700 dark:text-violet-400">Assistant d'apprentissage IA</h2>
        <p className="mt-4 text-lg text-violet-500 dark:text-violet-300">
          Posez vos questions à notre assistant intelligent pour obtenir de l'aide personnalisée
        </p>
        <div className="mt-8">
          <AIAssistant />
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl mt-8 sm:mt-16 text-center px-3 sm:px-6 mx-auto"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        {/* 🏆 Titre */}
        <h2 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-400 dark:from-violet-400 dark:to-purple-300">
          Nous Contacter
        </h2>
        <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Besoin d'assistance ou d'informations supplémentaires ? Voici comment nous joindre !
        </p>

        {/* 📞 Contact & Infos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-10 text-left">
          {/* 📍 Adresse */}
          <motion.div
            className="p-6 border-2 border-purple-400 dark:border-purple-500 shadow-lg bg-gradient-to-br from-violet-100 to-purple-50 dark:from-violet-900/40 dark:to-purple-900/40 rounded-xl hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-4xl text-purple-500 dark:text-purple-400"
            />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-2">Notre Adresse</h4>
            <p className="text-gray-600 dark:text-gray-300">123 Avenue des Lumières, 75000 Paris</p>
          </motion.div>

          {/* 📞 Téléphone */}
          <motion.div
            className="p-6 border-2 border-indigo-400 dark:border-indigo-500 shadow-lg bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-xl hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon
              icon={faPhone}
              className="text-4xl text-indigo-500 dark:text-indigo-400"
            />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-2">Appelez-nous</h4>
            <p className="text-gray-600 dark:text-gray-300">+33 1 23 45 67 89</p>
          </motion.div>

          {/* 📧 Email */}
          <motion.div
            className="p-6 border-2 border-pink-400 dark:border-pink-500 shadow-lg bg-gradient-to-br from-pink-100 to-red-50 dark:from-pink-900/40 dark:to-red-900/40 rounded-xl hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-4xl text-pink-500 dark:text-pink-400"
            />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-2">Email</h4>
            <p className="text-gray-600 dark:text-gray-300">contact@notreplateforme.com</p>
          </motion.div>

          {/* 🕒 Horaires */}
          <motion.div
            className="p-6 border-2 border-green-400 dark:border-green-500 shadow-lg bg-gradient-to-br from-green-100 to-lime-50 dark:from-green-900/40 dark:to-lime-900/40 rounded-xl hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon
              icon={faClock}
              className="text-4xl text-green-500 dark:text-green-400"
            />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-2">Nos Horaires</h4>
            <p className="text-gray-600 dark:text-gray-300">Lundi - Vendredi : 9h - 18h</p>
          </motion.div>
        </div>

        {/* ❓ Besoin d'aide supplémentaire ? */}
        <div className="mt-10">
          <Link href="/faq">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700 text-white font-bold rounded-lg shadow-md hover:from-violet-700 hover:to-purple-800 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
              Visitez notre FAQ
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Nouvelle section: Parcours d'apprentissage personnalisés */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1200px] mt-16 px-4 mx-auto"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className={title({ color: "violet", class: "text-center dark:text-violet-400 mb-8" })}>
          Parcours d'apprentissage personnalisés
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Carte 1: Évaluation des besoins */}
          <Card className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/30 dark:to-violet-900/30 border border-blue-200 dark:border-blue-800 shadow-md hover:shadow-lg transition-all">
            <CardBody className="p-6">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-800/50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faUser} className="h-10 w-10 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">Évaluation personnalisée</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Notre plateforme commence par évaluer les besoins spécifiques de chaque enfant autiste pour créer un parcours d'apprentissage adapté à ses forces et ses défis particuliers.
              </p>
              <div className="mt-6 text-center">
                <Button
                  as={Link}
                  href="/evaluation"
                  className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Découvrir l'évaluation
                </Button>
              </div>
            </CardBody>
          </Card>
          
          {/* Carte 2: Contenu adapté */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800 shadow-md hover:shadow-lg transition-all">
            <CardBody className="p-6">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="bg-purple-100 dark:bg-purple-800/50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faQuestionCircle} className="h-10 w-10 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">Contenu adapté aux besoins</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Nos ressources pédagogiques sont conçues pour s'adapter aux différentes sensibilités sensorielles et styles d'apprentissage, avec des options visuelles, auditives et kinesthésiques.
              </p>
              <div className="mt-6 text-center">
                <Button
                  as={Link}
                  href="/ressources"
                  className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                >
                  Explorer nos ressources
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Deuxième rangée */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Carte 3: Suivi des progrès */}
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border border-green-200 dark:border-green-800 shadow-md hover:shadow-lg transition-all">
            <CardBody className="p-6">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="bg-green-100 dark:bg-green-800/50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faClock} className="h-10 w-10 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300">Suivi des progrès en temps réel</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Notre système de suivi permet aux parents et éducateurs de visualiser les progrès de l'enfant, d'identifier les domaines de réussite et ceux nécessitant plus d'attention.
              </p>
              <div className="mt-6 text-center">
                <Button
                  as={Link}
                  href="/progres"
                  className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  Voir le suivi
                </Button>
              </div>
            </CardBody>
          </Card>
          
          {/* Carte 4: Communauté de soutien */}
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 border border-orange-200 dark:border-orange-800 shadow-md hover:shadow-lg transition-all">
            <CardBody className="p-6">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="bg-orange-100 dark:bg-orange-800/50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faEnvelope} className="h-10 w-10 text-orange-600 dark:text-orange-300" />
                </div>
                <h3 className="text-xl font-bold text-orange-700 dark:text-orange-300">Communauté de soutien</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Rejoignez notre communauté de parents, éducateurs et professionnels pour partager des expériences, des conseils et trouver du soutien dans votre parcours avec l'autisme.
              </p>
              <div className="mt-6 text-center">
                <Button
                  as={Link}
                  href="/soutien"
                  className="bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
                >
                  Rejoindre la communauté
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </motion.div>

      {/* Scroll to top button */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="fixed z-10 bottom-8 right-8 filter drop-shadow-lg dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 3 }}
      >
        <ScrollToTopButton />
      </motion.div>
    </section>
  );
}
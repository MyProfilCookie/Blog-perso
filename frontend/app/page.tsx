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
  Input,
  Textarea,
  Image,
} from "@nextui-org/react";
import { motion } from "framer-motion";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
// eslint-disable-next-line import/order
import { GithubIcon } from "@/components/icons";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import HeaderAutisme from "@/components/headerAutisme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faUser } from "@fortawesome/free-solid-svg-icons"; // Import des icônes
import Contact from "./contact";


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
      name: "Paul Ayivor",
      role: "Père de famille",
      img: "/assets/family/papa.jpg",
    },
    {
      name: "Ayivor Chantal",
      role: "Mère de famille",
      img: "/assets/family/maman.JPG",
    },
    {
      name: "Ayivor Virginie",
      role: "Sœur de Maeva",
      img: "/assets/family/nini.jpg",
    },
    {
      name: "Ayivor Joshua",
      role: "Frère de Maeva",
      img: "/assets/family/Joshua.jpg",
    },
    {
      name: "Ayivor Vanessa",
      role: "Soeur de Maeva",
      img: "/assets/family/titi.jpg",
    },
    {
      name: "Ayivor Pauline",
      role: "Soeur de Maeva",
      img: "/assets/family/Pauline.jpg",
    },
    {
      name: "Ayivor Jessica",
      role: "Soeur de Maeva",
      img: "/assets/family/jessica.jpg",
    },
    {
      name: "Ayivor Maeva",
      role: "Inspiratrice de la plateforme",
      img: "/assets/family/Maeva.jpg",
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
  const handlePreviousImage = (index: number) => {
    const newIndex = (imageIndices[index] - 1 + teamMembers.length) % teamMembers.length;
    const newImageIndices = [...imageIndices];

    newImageIndices[index] = newIndex;
    setImageIndices(newImageIndices);
  };

  const teamGroups = [];

  for (let i = 0; i < teamMembers.length; i += 2) {
    teamGroups.push(teamMembers.slice(i, i + 2));
  }

  const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  const previousSlide = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? articles.length - 1 : prevIndex - 1));
  const nextTeamSlide = () => setCurrentTeamIndex((prevIndex) => (prevIndex + 1) % teamGroups.length);
  const previousTeamSlide = () => setCurrentTeamIndex((prevIndex) => (prevIndex === 0 ? teamGroups.length - 1 : prevIndex - 1));



  return (
    <section className="flex flex-col items-center justify-center w-full gap-8 py-12 md:py-16">
      {/* Header Title Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={title({ color: "violet" })}>
          Bienvenue sur AutiStudy
        </h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Bonjour à toi {user?.pseudo}

          {user?.isAdmin ? (
            <FontAwesomeIcon
              className="ml-2 text-yellow-500"
              icon={faCrown}
            />
          ) : (
            <FontAwesomeIcon className="ml-2 text-blue-500" icon={faUser} />
          )}
        </h2>
        <h2 className={subtitle({ class: "mt-4" })}>il est grand temps de faire de la paix avec l'autisme</h2>
        <h3 className={subtitle({ class: "mt-4" })}>
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
      <motion.div
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
      </motion.div>

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
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px] mt-12"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        {/* Feature 1 */}
        <Card className="p-6">
          <Link href="/controle">
            <CardBody className="text-center">
              <Image
                isZoomed
                width={600}
                alt="Learning"
                className="h-20 mx-auto mb-4"
                src="/assets/online-learning.webp"
              />
              <h4 className="font-bold text-large">Cours en ligne adaptés</h4>
              <p className="mt-2 text-default-500">
                Des leçons personnalisées, adaptées aux besoins spécifiques des
                enfants autistes, pour chaque niveau scolaire.
              </p>
            </CardBody>
          </Link>
        </Card>

        {/* Feature 2 */}
        <Card className="p-6">
          <Link href="/soutien">
            <CardBody className="text-center">
              <Image
                isZoomed
                width={600}
                alt="Support"
                className="h-20 mx-auto mb-4"
                src="/assets/community-support.webp"
              />
              <h4 className="font-bold text-large">Soutien communautaire</h4>
              <p className="mt-2 text-default-500">
                Un espace où parents, enseignants, et professionnels échangent des
                conseils et du soutien.
              </p>
            </CardBody>
          </Link>
        </Card>

        {/* Feature 3 */}
        <Card className="p-6">
          <Link href="/progres">
            <CardBody className="text-center">
              <Image
                isZoomed
                width={600}
                alt="Progress"
                className="h-20 mx-auto mb-4"
                src="/assets/progress-tracking.webp"
              />
              <h4 className="font-bold text-large">Suivi des progrès</h4>
              <p className="mt-2 text-default-500">
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
        className="w-full max-w-[800px] mt-16 mx-auto text-center"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <h2 className="mb-4 text-3xl font-bold text-blue-700">
          Articles et Astuces
        </h2>
        <p className="mb-8 text-lg text-blue-500">
          Des conseils pratiques pour aider les enfants autistes au quotidien.
        </p>

        <div className="relative flex items-center justify-center">
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
                  className="w-full p-4 transition duration-300 ease-in-out rounded-lg shadow-lg"
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
                    <h4 className="mb-2 text-lg font-bold text-blue-700">
                      {article.title}
                    </h4>
                    <p className="text-sm text-blue-500">
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

      {/* Team Section */}
      <motion.div animate={{ opacity: 1, y: 0 }} className="w-full max-w-[600px] mt-16 text-center" initial={{ opacity: 0, y: 50 }} transition={{ duration: 0.8, delay: 2.5 }}>
        <h2 className={`${title()} text-purple-700 text-4xl font-bold`}>Notre Équipe</h2>
        <p className="mt-4 text-lg text-gray-500">Une équipe dédiée à offrir un apprentissage adapté à tous.</p>
        <div className="relative mt-8">
          <Button isIconOnly className="absolute left-0 z-10 flex items-center justify-center w-12 h-12 text-lg text-white transform -translate-y-1/2 bg-purple-600 rounded-full shadow-md hover:bg-purple-700 top-1/2" onClick={previousTeamSlide}>
            {"<"}
          </Button>
          <motion.div key={currentTeamIndex} animate={{ opacity: 1, x: 0 }} className="w-full" exit={{ opacity: 0, x: -100 }} initial={{ opacity: 0, x: 100 }} transition={{ duration: 0.8 }}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {teamGroups[currentTeamIndex].map((member, index) => (
                <Card key={index} className="p-6 transition duration-300 ease-in-out rounded-lg shadow-md bg-purple-50 hover:bg-purple-100">
                  <CardBody className="text-center">
                    <div className="relative">
                      <img alt={member.name} className="object-cover w-24 h-24 mx-auto mb-4 border-2 border-purple-500 rounded-full" src={member.img} />
                      {/* <div className="flex justify-center gap-2 mt-4">
                        <Button isIconOnly onClick={() => handlePreviousImage(index + currentTeamIndex * 2)} className="bg-purple-400 hover:bg-purple-500">
                          {"<"}
                        </Button>
                        <Button isIconOnly onClick={() => handleNextImage(index + currentTeamIndex * 2)} className="bg-purple-400 hover:bg-purple-500">
                          {">"}
                        </Button>
                      </div> */}
                    </div>
                    <h4 className="font-bold text-gray-700">{member.name}</h4>
                    <p className="text-gray-500">{member.role}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </motion.div>
          <Button isIconOnly className="absolute right-0 z-10 flex items-center justify-center w-12 h-12 text-lg text-white transform -translate-y-1/2 bg-purple-600 rounded-full shadow-md hover:bg-purple-700 top-1/2" onClick={nextTeamSlide}>
            {">"}
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
        <h2 className={title({ color: "blue", class: "text-center" })}>
          L'accompagnement des enfants et des adultes autistes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px] mt-12">
          {/* Card 1 */}
          <Card className="shadow-md bg-blue-50">
            <CardBody className="text-left text-blue-700">
              <h3 className="text-center"><strong>L’accompagnement de l’enfant autiste</strong></h3>
              <Image
                isZoomed
                width={600}
                height={200}
                alt="Learning"
                className="h-20 mx-auto mb-4"
                src="/assets/online-learning.webp"
              />
              <p>
                L'éducation des enfants autistes demande patience et organisation. Nos fiches pédagogiques aident à chaque étape, de l'apprentissage de la propreté au développement de l'autonomie.
              </p>
            </CardBody>
          </Card>

          {/* Card 2 */}
          <Card className="shadow-md bg-green-50">
            <CardBody className="text-left text-green-700">
              <h3 className="text-center"><strong>L’accompagnement de l’adulte autiste</strong></h3>
              <Image
                isZoomed
                width={600}
                height={200}
                alt="Learning"
                className="h-20 mx-auto mb-4 cover"
                src="/assets/accompagnement.webp"
              />
              <p>
                L'accompagnement de l'adulte autiste est essentiel pour la vie professionnelle et sociale. Nos ressources les guident vers une plus grande autonomie et une meilleure qualité de vie.
              </p>
            </CardBody>
          </Card>

          {/* Card 3 */}
          <Card className="shadow-md bg-purple-50">
            <CardBody className="text-left text-purple-700">
              <h3 className="text-center"><strong>Travailler avec des enfants autistes</strong></h3>
              <Image
                isZoomed
                width={600}
                height={200}
                alt="Learning"
                className="h-20 mx-auto mb-4"
                src="/assets/online-learn.webp"
              />
              <p>
                Les méthodes éducatives telles que ABA et TEACCH sont recommandées pour favoriser le développement et l'épanouissement de l'enfant autiste. Découvrez-en plus dans nos ressources.
              </p>
            </CardBody>
          </Card>

          {/* Card 4 */}
          <Card className="shadow-md bg-orange-50">
            <CardBody className="text-left text-orange-700">
              <h3 className="text-center"><strong>Interventions et thérapies</strong></h3>
              <Image
                isZoomed
                width={600}
                height={200}
                alt="Learning"
                className="h-20 mx-auto mb-4"
                src="/assets/interventions.webp"
              />
              <p>
                Un large éventail de thérapies est disponible pour accompagner les personnes autistes. Nos recommandations issues de la HAS vous aident à choisir les plus adaptées.
              </p>
            </CardBody>
          </Card>

          {/* Card 5 */}
          <Card className="shadow-md bg-red-50">
            <CardBody className="text-left text-red-700">
              <h3 className="text-center"><strong>Ressources web</strong></h3>
              <Image
                isZoomed
                width={600}
                height={200}
                alt="Learning"
                className="h-20 mx-auto mb-4"
                src="/assets/ressources.webp"
              />
              <p>
                Des outils numériques et sites dédiés à l’autisme sont disponibles. Consultez, achetez ou téléchargez nos supports pédagogiques pour un apprentissage adapté.
              </p>
              <Link href="/resources" className="block mt-2 text-center text-blue-500 hover:underline">
                En savoir plus
              </Link>
            </CardBody>
          </Card>
          {/* Card 6 */}
          <Card className="shadow-md bg-yellow-50">
            <CardBody className="text-left text-yellow-700">
              <h3 className="text-center"><strong>Supports pédagogiques</strong></h3>
              <Image
                isZoomed
                width={600}
                height={200}
                alt="Learning"
                className="h-20 mx-auto mb-4"
                src="/assets/support.webp"
              />
              <p>
                Des outils numériques et sites dédiés à l’autisme sont disponibles. Consultez, achetez ou déchargez nos supports pédagogiques pour un apprentissage adapté.
              </p>
              <Link href="/resources" className="block mt-2 text-center text-blue-500 hover:underline">
                En savoir plus
              </Link>
            </CardBody>
          </Card>
        </div>
      </motion.div>

      {/* New Section: Testimonials */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1200px] mt-16 text-center"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <h2 className="text-3xl font-bold text-blue-700">Témoignages</h2>
        <p className="mt-4 text-lg text-blue-500">
          Ce que disent les parents et les professionnels à propos de notre plateforme.
        </p>

        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3">
          {/* Testimonial 1 */}
          <Card className="p-6 transition-transform transform bg-blue-100 shadow-lg rounded-xl hover:scale-105">
            <CardBody>
              <p className="italic text-gray-700">
                "AutiStudy a complètement transformé la façon dont mon enfant apprend. Les ressources sont parfaitement adaptées à ses besoins."
              </p>
              <p className="mt-4 font-bold text-blue-700">- Marie, Maman de Léo</p>
            </CardBody>
          </Card>

          {/* Testimonial 2 */}
          <Card className="p-6 transition-transform transform bg-blue-100 shadow-lg rounded-xl hover:scale-105">
            <CardBody>
              <p className="italic text-gray-700">
                "En tant qu'éducateur, je trouve les outils proposés très complets et adaptés aux enfants autistes. Cela a fait une grande différence."
              </p>
              <p className="mt-4 font-bold text-blue-700">- Pierre, Enseignant spécialisé</p>
            </CardBody>
          </Card>

          {/* Testimonial 3 */}
          <Card className="p-6 transition-transform transform bg-blue-100 shadow-lg rounded-xl hover:scale-105">
            <CardBody>
              <p className="italic text-gray-700">
                "L'accompagnement proposé par AutiStudy est inestimable. J'ai enfin trouvé un endroit où ma fille est comprise et aidée."
              </p>
              <p className="mt-4 font-bold text-blue-700">- Sarah, Maman de Julia</p>
            </CardBody>
          </Card>
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        animate={{ opacity: 1 }}
        className="w-full max-w-[1200px] mt-16 text-center px-4 md:px-0"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <h2 className={title()}>Contactez-nous pour plus d'informations</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-[800px] mx-auto">
          Vous avez des questions ou souhaitez en savoir plus ? Remplissez le
          formulaire ci-dessous et notre équipe vous contactera dans les plus
          brefs délais.
        </p>

        {/* Contact Form */}
        {/* <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="relative mt-12"
        >
          <Card className="p-10 rounded-lg">
            <CardBody className="p-8 rounded-lg">
              <h2
                className={title({ color: "violet" })}
                style={{
                  marginBottom: "1.5rem",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Envoyez-nous un message
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  aria-label="Nom"
                  isClearable
                  placeholder="Votre nom"
                  fullWidth
                  color="default"
                />
                <Input
                  aria-label="Email"
                  isClearable
                  placeholder="Votre email"
                  type="email"
                  fullWidth
                  color="default"
                />
              </div>
              <Textarea
                aria-label="Message"
                placeholder="Votre message"
                rows={4}
                fullWidth
                color="default"
                className="mt-4"
              />
              <Button className="w-full mt-6 text-white bg-purple-600 hover:bg-purple-700">
                Envoyer votre message
              </Button>
            </CardBody>
          </Card>
        </motion.div> */}
        <Contact />
      </motion.div>

      {/* Scroll to top button */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="fixed z-10 bottom-8 right-8"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 3 }}
      >
        <ScrollToTopButton />
      </motion.div>

      {/* Section  */}

      {/* Footer */}
      <motion.footer
        animate={{ opacity: 1 }}
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 3 }}
        style={{ paddingBottom: "2rem", zIndex: 10 }}
      >
        <p className="text-sm text-gray-500">
          © 2024 AutiStudy - Tous droits réservés. Créé par la famille Ayivor.
        </p>
      </motion.footer>
    </section>
  );
}
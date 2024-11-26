/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Card, CardBody, Avatar, Button } from "@nextui-org/react";
import { motion } from "framer-motion";

import { title, subtitle } from "@/components/primitives";

const AboutUsPage = () => {
  return (
    <section className="flex flex-col gap-8 justify-center items-center py-12 w-full md:py-16">
      {/* Header Title Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={title({ color: "blue" })}>Notre Histoire</h1>
        <h2 className={subtitle({ class: "mt-4 text-blue-600" })}>
          Découvrez la famille derrière AutiStudy et notre mission dédiée à l'éducation adaptée des enfants autistes.
        </h2>
      </motion.div>

      {/* First Block: Introduction to the Family */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[800px]"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Card className="px-8 py-6 bg-blue-100 rounded-lg shadow-lg">
          <CardBody>
            <p className="text-lg text-gray-700">
              Nous sommes une famille nombreuse, composée de plusieurs enfants âgés de 38 ans à 14 ans, Maeva étant la benjamine. Chaque membre de la famille a un rôle essentiel dans la création de <strong>AutiStudy</strong>, une plateforme éducative dédiée aux enfants autistes.
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Second Block: The Role of Mom */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[800px]"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <Card className="px-8 py-6 bg-green-100 rounded-lg shadow-lg">
          <CardBody>
            <p className="text-lg text-gray-700">
              <strong>Notre maman</strong>, formée en <strong>Sogelene</strong> et en <strong>gestion des émotions</strong>, s'occupe de créer un environnement serein et bienveillant pour chaque enfant. Elle veille à ce que chacun trouve sa place et s'épanouisse dans un cadre qui respecte les particularités de chacun, notamment celles de Maeva.
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Third Block: The Role of Dad */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[800px]"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <Card className="px-8 py-6 bg-purple-100 rounded-lg shadow-lg">
          <CardBody>
            <p className="text-lg text-gray-700">
              <strong>Notre papa</strong>, ingénieur télécom, met à profit ses compétences pour développer des solutions éducatives adaptées aux besoins spécifiques des enfants autistes. Il accompagne le développement de Maeva en adaptant des outils technologiques pour favoriser son apprentissage.
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Fourth Block: Our Mission */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[800px]"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <Card className="px-8 py-6 bg-yellow-100 rounded-lg shadow-lg">
          <CardBody>
            <p className="text-lg text-gray-700">
              Ensemble, nous avons créé <strong>AutiStudy</strong>, une plateforme d'apprentissage adaptée aux enfants autistes. Notre mission est de rendre l'apprentissage plus accessible, agréable et personnalisé pour chaque enfant, en tenant compte de leurs besoins particuliers.
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Meet the Family Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mt-12 w-full"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 2.5 }}
      >
        <Card className="py-4 max-w-[800px] w-full mt-6 bg-teal-100 rounded-lg">
          <CardBody className="flex flex-col items-center">
            <h3 className="mb-6 font-bold text-gray-800 text-large">Rencontrez les membres de la famille Ayivor</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Avatar isBordered alt="Membre 1" color="warning" size="lg" src="/assets/family/avatar/jessica.jpg" />
              <Avatar isBordered alt="Membre 2" color="primary" size="lg" src="/assets/family/avatar/Joshua.jpg" />
              <Avatar isBordered alt="Membre 3" color="danger" size="lg" src="/assets/family/avatar/Maeva.jpg" />
              <Avatar isBordered alt="Membre 4" color="secondary" size="lg" src="/assets/family/avatar/maman.jpg" />
              <Avatar isBordered alt="Membre 5" color="success" size="lg" src="/assets/family/avatar/nini.jpg" />
              <Avatar isBordered alt="Membre 6" color="warning" size="lg" src="/assets/family/avatar/papa.jpg" />
              <Avatar isBordered alt="Membre 7" color="primary" size="lg" src="/assets/family/avatar/pauline.jpg" />
              <Avatar isBordered alt="Membre 8" color="danger" size="lg" src="/assets/family/avatar/titi.jpg" />
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mt-8 w-full"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 3 }}
      >
        <Button className="text-white bg-blue-600 hover:bg-blue-500" href="/resources">
          Explorer nos ressources
        </Button>
      </motion.div>

      {/* Footer */}
      <footer className="mt-16 text-center">
        <p className="text-sm text-gray-500">
          © 2024 AutiStudy - Tous droits réservés. Créé par la famille Ayivor.
        </p>
      </footer>
    </section>
  );
};

export default AboutUsPage;





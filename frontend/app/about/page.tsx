"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Avatar, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Sparkles, Users, HeartHandshake, Code, Target } from "lucide-react";

import { title, subtitle } from "@/components/primitives";

// ✅ Définition des couleurs en format hexadécimal pour éviter Tailwind
const colorVariants = [
  "#DBEAFE",
  "#D1FAE5",
  "#E9D5FF",
  "#FEF3C7",
  "#FECACA",
  "#CCFBF1",
];

const AboutUsPage = () => {
  const familyMembers = [
    { name: "Jessica", img: "/assets/family/avatar/jessica.png" },
    { name: "Joshua", img: "/assets/family/avatar/joshua.png" },
    { name: "Maeva", img: "/assets/family/avatar/maeva.png" },
    { name: "Maman", img: "/assets/family/avatar/chantal.png" },
    { name: "Nini", img: "/assets/family/avatar/virginie.png" },
    { name: "Papa", img: "/assets/family/avatar/paul.png" },
    { name: "Pauline", img: "/assets/family/avatar/pauline.png" },
    { name: "Titi", img: "/assets/family/avatar/vanessa.png" },
  ];

  // ✅ Attribution aléatoire des couleurs
  const [cardColors, setCardColors] = useState(() =>
    Array(4)
      .fill(null)
      .map(
        () => colorVariants[Math.floor(Math.random() * colorVariants.length)],
      ),
  );

  // ✅ Couleur dynamique pour la carte famille
  const [familyCardColor, setFamilyCardColor] = useState(
    colorVariants[Math.floor(Math.random() * colorVariants.length)],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCardColors(
        Array(4)
          .fill(null)
          .map(
            () =>
              colorVariants[Math.floor(Math.random() * colorVariants.length)],
          ),
      );
      setFamilyCardColor(
        colorVariants[Math.floor(Math.random() * colorVariants.length)],
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col gap-8 justify-center items-center py-12 w-full md:py-16">
      {/* 🎇 Titre animé */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
          className={`${title()} text-blue-600 flex items-center justify-center gap-2`}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Notre Histoire <Sparkles className="text-blue-600 w-6 h-6" />
        </motion.h1>
        <h2 className={subtitle({ class: "mt-4 text-blue-600" })}>
          Découvrez la famille derrière AutiStudy et notre mission dédiée à
          l&apos;éducation adaptée des enfants autistes.
        </h2>
      </motion.div>

      {/* 🏡 Cartes informatives avec couleurs dynamiques en style inline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-[1000px]">
        {[
          {
            title: "Notre Famille",
            text: "Nous sommes une famille nombreuse avec plusieurs enfants âgés de 38 à 14 ans, Maeva étant la benjamine.",
            icon: <Users className="text-blue-600 w-8 h-8" />,
          },
          {
            title: "Notre Maman",
            text: "Notre maman, formée en gestion des émotions, s'occupe de créer un environnement bienveillant pour chaque enfant.",
            icon: <HeartHandshake className="text-green-600 w-8 h-8" />,
          },
          {
            title: "Notre Papa",
            text: "Notre papa, ingénieur télécom, met à profit ses compétences pour développer des solutions éducatives adaptées. Il est le co-fondateur d'AutiStudy.",
            icon: <Code className="text-purple-600 w-8 h-8" />,
          },
          {
            title: "Notre Mission",
            text: "Nous avons créé AutiStudy, une plateforme d'apprentissage adaptée aux enfants autistes. Notre mission est de rendre l'éducation inclusive.",
            icon: <Target className="text-yellow-600 w-8 h-8" />,
          },
        ].map((info, index) => (
          <motion.div
            key={index}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card
              className="p-6 rounded-lg shadow-lg min-h-[220px] flex flex-col items-center text-center"
              style={{ backgroundColor: cardColors[index] }}
            >
              <div className="mb-4">{info.icon}</div>
              <CardBody>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {info.title}
                </h3>
                <p className="text-lg text-gray-700">{info.text}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 👨‍👩‍👧‍👦 Carte dynamique des membres de la famille avec couleur en style inline */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className=" max-w-[800px] w-full mt-6 rounded-lg shadow-lg transition-colors duration-500"
        transition={{ duration: 0.5, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
      >
        <Card
          className="rounded-lg shadow-lg"
          style={{ backgroundColor: familyCardColor }}
        >
          <CardBody className="flex flex-col items-center">
            <h3 className="mb-6 font-bold text-gray-800 text-large">
              Rencontrez les membres de la famille Ayivor
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {familyMembers.map((member, index) => (
                <Avatar
                  key={index}
                  isBordered
                  alt={member.name}
                  className="aspect-square w-full h-full"
                  color="primary"
                  size="lg"
                  src={member.img}
                />
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* 🎨 Bouton pour changer manuellement les couleurs */}
      <div className="flex justify-center mt-6">
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setCardColors(
              Array(4)
                .fill(null)
                .map(
                  () =>
                    colorVariants[
                      Math.floor(Math.random() * colorVariants.length)
                    ],
                ),
            );
            setFamilyCardColor(
              colorVariants[Math.floor(Math.random() * colorVariants.length)],
            );
          }}
        >
          Changer les couleurs
        </Button>
      </div>
    </section>
  );
};

export default AboutUsPage;

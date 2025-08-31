"use client";
import dynamic from 'next/dynamic';

import React, { useEffect, useState } from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Avatar } from '@nextui-org/react'
import { Button } from '@nextui-org/react';
import { motion } from "framer-motion";
import { Sparkles, Users, HeartHandshake, Code, Target, Star, Globe, HelpingHand, Lightbulb } from "lucide-react";

const colorVariants = [
  "#DBEAFE", "#D1FAE5", "#E9D5FF", "#FEF3C7", "#FECACA", "#CCFBF1"
];

const familyMembers = [
  { name: "Jessica", img: "/assets/family/avatar/jessica.webp" },
  { name: "Joshua", img: "/assets/family/avatar/joshua.webp" },
  { name: "Maeva", img: "/assets/family/avatar/maeva.webp" },
  { name: "Maman", img: "/assets/family/avatar/chantal.webp" },
  { name: "Nini", img: "/assets/family/avatar/virginie.webp" },
  { name: "Papa", img: "/assets/family/avatar/paul.webp" },
  { name: "Pauline", img: "/assets/family/avatar/pauline.webp" },
  { name: "Titi", img: "/assets/family/avatar/vanessa.webp" },
];

export default function AboutUsPage() {
  const [cardColors, setCardColors] = useState(() =>
    Array(4).fill(null).map(
      () => colorVariants[Math.floor(Math.random() * colorVariants.length)]
    )
  );
  const [familyCardColor, setFamilyCardColor] = useState(
    colorVariants[Math.floor(Math.random() * colorVariants.length)]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCardColors(
        Array(4).fill(null).map(
          () => colorVariants[Math.floor(Math.random() * colorVariants.length)]
        )
      );
      setFamilyCardColor(
        colorVariants[Math.floor(Math.random() * colorVariants.length)]
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col gap-6 md:gap-8 lg:gap-10 items-center py-6 md:py-8 lg:py-12 w-full px-4 md:px-6 lg:px-8">
      {/* Titre principal */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.7 }}
        className="text-center w-full"
      >
        <motion.h1
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-600 flex items-center justify-center gap-3"
        >
          Notre Histoire <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-400" />
        </motion.h1>
        <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-blue-700 font-medium px-2">
          Une famille soudée, une mission : l'éducation inclusive et bienveillante pour tous les enfants autistes.
        </p>
        <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2 md:px-4 leading-relaxed">
          Chez AutiStudy, chaque membre de la famille apporte sa pierre à l'édifice pour créer une plateforme unique, pensée pour l'épanouissement et la réussite de tous.
        </p>
      </motion.div>

      {/* Cartes informatives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8 w-full max-w-5xl">
        {[
          {
            title: "Notre Famille",
            text: "Nous sommes une grande famille unie, avec des enfants de 14 à 38 ans. Maeva, la benjamine, est notre source d'inspiration.",
            icon: <Users className="text-blue-600 w-8 h-8 sm:w-10 sm:h-10" />,
          },
          {
            title: "Notre Maman",
            text: "Chantal, maman au grand cœur, veille chaque jour à l'harmonie et au bien-être de tous.",
            icon: <HeartHandshake className="text-green-600 w-8 h-8 sm:w-10 sm:h-10" />,
          },
          {
            title: "Notre Papa",
            text: "Paul, papa ingénieur, développe les outils numériques d'AutiStudy et co-fonde la plateforme.",
            icon: <Code className="text-purple-600 w-8 h-8 sm:w-10 sm:h-10" />,
          },
          {
            title: "Notre Mission",
            text: "AutiStudy est née de notre volonté de rendre l'apprentissage accessible, ludique et adapté à chaque enfant autiste.",
            icon: <Target className="text-yellow-600 w-8 h-8 sm:w-10 sm:h-10" />,
          },
        ].map((info, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.25 }}
          >
            <Card
              className="p-5 md:p-6 lg:p-8 rounded-xl shadow-xl min-h-[200px] sm:min-h-[220px] md:min-h-[240px] flex flex-col items-center text-center border-2 border-gray-100 hover:border-blue-200 transition-all duration-300"
              style={{ backgroundColor: cardColors[idx] }}
            >
              <div className="mb-4 md:mb-5 p-3 bg-white/50 rounded-full">{info.icon}</div>
              <CardBody className="p-3 md:p-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                  {info.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">{info.text}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Valeurs */}
      <div className="w-full max-w-5xl mt-8 md:mt-10 lg:mt-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 mb-6 md:mb-8 text-center">Nos valeurs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {[
            { icon: <Star className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-500" />, label: "Bienveillance" },
            { icon: <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />, label: "Inclusion" },
            { icon: <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />, label: "Innovation" },
            { icon: <HelpingHand className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />, label: "Entraide" },
          ].map((val, i) => (
            <div key={i} className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4 md:p-5 lg:p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="p-3 bg-gray-50 rounded-full mb-3">{val.icon}</div>
              <span className="text-sm sm:text-base font-bold text-gray-800 text-center">{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Carte famille */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full mt-8 md:mt-10 lg:mt-12 rounded-xl shadow-xl"
        whileHover={{ scale: 1.02 }}
      >
        <Card style={{ backgroundColor: familyCardColor }} className="border-2 border-gray-200">
          <CardBody className="flex flex-col items-center p-5 md:p-6 lg:p-8">
            <h3 className="mb-6 md:mb-8 font-bold text-gray-800 text-lg sm:text-xl md:text-2xl text-center">
              Rencontrez la famille Ayivor
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full">
              {familyMembers.map((member, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Avatar
                    isBordered
                    alt={member.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
                    color="primary"
                    size="lg"
                    src={member.img}
                    style={{
                      borderWidth: "3px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}
                  />
                  <span className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-center">{member.name}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Appel à l'action */}
      <div className="flex flex-col items-center mt-8 md:mt-10 lg:mt-12 gap-4 md:gap-5">
        <p className="text-base sm:text-lg md:text-xl text-gray-700 text-center px-4 max-w-2xl">
          Envie d'en savoir plus ou de rejoindre l'aventure ? Découvrez la plateforme ou contactez-nous !
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 md:px-8 lg:px-10 rounded-lg text-base sm:text-lg md:text-xl shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => window.location.href = '/contact'}
        >
          Nous contacter
        </Button>
      </div>

      {/* Bouton pour changer les couleurs */}
      <div className="flex justify-center mt-6 md:mt-8 lg:mt-10">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-5 md:px-6 rounded-lg text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg transition-all duration-300"
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
}

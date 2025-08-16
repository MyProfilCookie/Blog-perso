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
    <section className="flex flex-col gap-10 items-center py-12 w-full md:py-16">
      {/* Titre principal */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <motion.h1
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl md:text-5xl font-extrabold text-blue-600 flex items-center justify-center gap-2"
        >
          Notre Histoire <Sparkles className="w-7 h-7 text-blue-400" />
        </motion.h1>
        <p className="mt-4 text-lg md:text-xl text-blue-700 font-medium">
          Une famille soudée, une mission : l’éducation inclusive et bienveillante pour tous les enfants autistes.
        </p>
        <p className="mt-2 text-base text-gray-600 max-w-2xl mx-auto">
          Chez AutiStudy, chaque membre de la famille apporte sa pierre à l’édifice pour créer une plateforme unique, pensée pour l’épanouissement et la réussite de tous.
        </p>
      </motion.div>

      {/* Cartes informatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {[
          {
            title: "Notre Famille",
            text: "Nous sommes une grande famille unie, avec des enfants de 14 à 38 ans. Maeva, la benjamine, est notre source d’inspiration.",
            icon: <Users className="text-blue-600 w-8 h-8" />,
          },
          {
            title: "Notre Maman",
            text: "Chantal, maman au grand cœur, veille chaque jour à l’harmonie et au bien-être de tous.",
            icon: <HeartHandshake className="text-green-600 w-8 h-8" />,
          },
          {
            title: "Notre Papa",
            text: "Paul, papa ingénieur, développe les outils numériques d’AutiStudy et co-fonde la plateforme.",
            icon: <Code className="text-purple-600 w-8 h-8" />,
          },
          {
            title: "Notre Mission",
            text: "AutiStudy est née de notre volonté de rendre l’apprentissage accessible, ludique et adapté à chaque enfant autiste.",
            icon: <Target className="text-yellow-600 w-8 h-8" />,
          },
        ].map((info, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.25 }}
          >
            <Card
              className="p-6 rounded-lg shadow-lg min-h-[200px] flex flex-col items-center text-center"
              style={{ backgroundColor: cardColors[idx] }}
            >
              <div className="mb-3">{info.icon}</div>
              <CardBody>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {info.title}
                </h3>
                <p className="text-base text-gray-700">{info.text}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Valeurs */}
      <div className="w-full max-w-3xl mt-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Nos valeurs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Star className="w-6 h-6 text-yellow-400" />, label: "Bienveillance" },
            { icon: <Globe className="w-6 h-6 text-blue-500" />, label: "Inclusion" },
            { icon: <Lightbulb className="w-6 h-6 text-purple-500" />, label: "Innovation" },
            { icon: <HelpingHand className="w-6 h-6 text-green-500" />, label: "Entraide" },
          ].map((val, i) => (
            <div key={i} className="flex flex-col items-center bg-white rounded-lg shadow p-4">
              {val.icon}
              <span className="mt-2 text-sm font-semibold text-gray-700">{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Carte famille */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full mt-8 rounded-lg shadow-lg"
        whileHover={{ scale: 1.03 }}
      >
        <Card style={{ backgroundColor: familyCardColor }}>
          <CardBody className="flex flex-col items-center">
            <h3 className="mb-5 font-bold text-gray-800 text-lg">
              Rencontrez la famille Ayivor
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {familyMembers.map((member, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Avatar
                    isBordered
                    alt={member.name}
                    className="w-20 h-20"
                    color="primary"
                    size="lg"
                    src={member.img}
                  />
                  <span className="mt-2 text-sm font-medium text-gray-700">{member.name}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Appel à l'action */}
      <div className="flex flex-col items-center mt-8 gap-2">
        <p className="text-base text-gray-700 text-center">
          Envie d’en savoir plus ou de rejoindre l’aventure ? Découvrez la plateforme ou contactez-nous !
        </p>
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          onClick={() => window.location.href = '/contact'}
        >
          Nous contacter
        </Button>
      </div>

      {/* Bouton pour changer les couleurs */}
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
}

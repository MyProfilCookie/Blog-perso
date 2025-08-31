"use client";
import dynamic from 'next/dynamic';

import React, { useEffect, useState } from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Avatar } from '@nextui-org/react'
import { Button } from '@nextui-org/react';
import { motion } from "framer-motion";
import { Sparkles, Users, HeartHandshake, Code, Target, Star, Globe, HelpingHand, Lightbulb, Award, BookOpen, Shield, Zap } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

const colorVariants = [
  "#DBEAFE", "#D1FAE5", "#E9D5FF", "#FEF3C7", "#FECACA", "#CCFBF1"
];

const familyMembers = [
  { name: "Jessica", img: "/assets/family/avatar/jessica.webp", role: "Sœur aînée", age: "38 ans" },
  { name: "Joshua", img: "/assets/family/avatar/joshua.webp", role: "Frère", age: "35 ans" },
  { name: "Maeva", img: "/assets/family/avatar/maeva.webp", role: "Notre inspiration", age: "14 ans" },
  { name: "Chantal", img: "/assets/family/avatar/chantal.webp", role: "Maman", age: "Maman au grand cœur" },
  { name: "Virginie", img: "/assets/family/avatar/virginie.webp", role: "Nini", age: "Sœur" },
  { name: "Paul", img: "/assets/family/avatar/paul.webp", role: "Papa", age: "Ingénieur & Co-fondateur" },
  { name: "Pauline", img: "/assets/family/avatar/pauline.webp", role: "Sœur", age: "Sœur" },
  { name: "Vanessa", img: "/assets/family/avatar/vanessa.webp", role: "Titi", age: "Sœur" },
];

const achievements = [
  { icon: <Users className="w-6 h-6" />, number: "500+", label: "Familles accompagnées" },
  { icon: <BookOpen className="w-6 h-6" />, number: "1000+", label: "Exercices créés" },
  { icon: <Star className="w-6 h-6" />, number: "4.9/5", label: "Note moyenne" },
  { icon: <HeartHandshake className="w-6 h-6" />, number: "24/7", label: "Support familial" },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main>
        {/* Hero Section Familiale */}
        <section className="relative py-12 md:py-20 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20"></div>
          <div className="relative w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6"
                  >
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 dark:text-blue-300 font-semibold">Famille Ayivor</span>
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                    Notre{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      Histoire
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                    Une famille soudée, une mission : l'éducation inclusive et bienveillante pour tous les enfants autistes.
                  </p>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    Chez AutiStudy, chaque membre de la famille apporte sa pierre à l'édifice pour créer une plateforme unique, pensée pour l'épanouissement et la réussite de tous.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="text-center"
                      >
                        <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {achievement.number}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <OptimizedImage
                    src="/assets/family/family.webp"
                    alt="Famille Ayivor"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                    priority
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Notre Mission */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-800">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Notre Mission
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  AutiStudy est née de notre volonté de rendre l'apprentissage accessible, ludique et adapté à chaque enfant autiste.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[
                  {
                    title: "Notre Famille",
                    text: "Nous sommes une grande famille unie, avec des enfants de 14 à 38 ans. Maeva, la benjamine, est notre source d'inspiration.",
                    icon: <Users className="text-blue-600 w-8 h-8" />,
                    color: "from-blue-100 to-blue-200"
                  },
                  {
                    title: "Notre Maman",
                    text: "Chantal, maman au grand cœur, veille chaque jour à l'harmonie et au bien-être de tous.",
                    icon: <HeartHandshake className="text-green-600 w-8 h-8" />,
                    color: "from-green-100 to-green-200"
                  },
                  {
                    title: "Notre Papa",
                    text: "Paul, papa ingénieur, développe les outils numériques d'AutiStudy et co-fonde la plateforme.",
                    icon: <Code className="text-purple-600 w-8 h-8" />,
                    color: "from-purple-100 to-purple-200"
                  },
                  {
                    title: "Notre Vision",
                    text: "Créer un monde où chaque enfant autiste peut apprendre, grandir et s'épanouir dans un environnement bienveillant.",
                    icon: <Target className="text-yellow-600 w-8 h-8" />,
                    color: "from-yellow-100 to-yellow-200"
                  },
                ].map((info, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="group"
                  >
                    <Card className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border-2 border-gray-100 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <CardBody className="p-6 md:p-8 text-center">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          {info.icon}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                          {info.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {info.text}
                        </p>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Valeurs */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Nos Valeurs
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Les principes qui guident notre action au quotidien
                </p>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {[
                  { icon: <Star className="w-8 h-8 text-yellow-500" />, label: "Bienveillance", description: "Chaque enfant est unique et mérite notre attention" },
                  { icon: <Globe className="w-8 h-8 text-blue-600" />, label: "Inclusion", description: "Un monde accessible pour tous" },
                  { icon: <Lightbulb className="w-8 h-8 text-purple-600" />, label: "Innovation", description: "Technologies au service de l'apprentissage" },
                  { icon: <HelpingHand className="w-8 h-8 text-green-600" />, label: "Entraide", description: "Ensemble, nous sommes plus forts" },
                ].map((val, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <CardBody className="p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          {val.icon}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{val.label}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{val.description}</p>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Famille */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-800">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Rencontrez la Famille Ayivor
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Chaque membre apporte sa contribution unique à notre mission
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                className="max-w-6xl mx-auto"
              >
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-400 shadow-2xl">
                  <CardBody className="p-8 md:p-12">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
                      {familyMembers.map((member, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                          viewport={{ once: true, margin: "-50px" }}
                          whileHover={{ scale: 1.02 }}
                          className="flex flex-col items-center text-center"
                        >
                          <Avatar
                            isBordered
                            alt={member.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mb-4"
                            color="primary"
                            size="lg"
                            src={member.img}
                            style={{
                              borderWidth: "4px",
                              boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                            }}
                          />
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {member.name}
                          </h3>
                          <p className="text-sm md:text-base text-blue-600 dark:text-blue-400 font-semibold mb-1">
                            {member.role}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            {member.age}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section Call-to-Action */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="w-full px-4 md:px-8 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Rejoignez l'Aventure AutiStudy
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Ensemble, créons un monde plus inclusif et bienveillant pour tous les enfants
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
                  onClick={() => window.location.href = '/users/signup'}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Commencer gratuitement
                </Button>
                <Button
                  className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-bold text-lg"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Nous contacter
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bouton pour changer les couleurs */}
        <div className="flex justify-center py-8">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
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
            <Sparkles className="w-4 h-4 mr-2" />
            Changer les couleurs
          </Button>
        </div>
      </main>
    </div>
  );
}

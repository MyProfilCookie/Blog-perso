"use client";
import dynamic from 'next/dynamic';
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */

import React from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Image } from '@nextui-org/react';
const motion = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion })), { ssr: false });

import { title } from "@/components/primitives";
import BackButton from "@/components/back";

const Resources = () => {
  // Liste des ressources
  const resources = [
    {
      title: "Outils pédagogiques",
      description: "Des fiches et supports adaptés pour aider les enfants autistes dans leur apprentissage au quotidien.",
      img: "/assets/resources/tools.webp",
      link: "/resources/tools"
    },
    {
      title: "Livres et articles",
      description: "Découvrez une sélection de livres et d'articles écrits par des spécialistes de l'autisme.",
      img: "/assets/resources/books.webp",
      link: "/resources/books"
    },
    {
      title: "Applications éducatives",
      description: "Une liste d'applications pour soutenir l'éducation des enfants autistes et développer leur autonomie.",
      img: "/assets/resources/apps.webp",
      link: "/resources/apps"
    },
    {
      title: "Jeux éducatifs",
      description: "Des jeux adaptés pour stimuler l'apprentissage et la socialisation des enfants autistes.",
      img: "/assets/resources/games.webp",
      link: "/resources/games"
    },
    {
      title: "Formations et ateliers",
      description: "Des formations pour les parents et les professionnels pour mieux comprendre et accompagner l'autisme.",
      img: "/assets/resources/trainings.webp",
      link: "/resources/trainings"
    }
  ];

  return (
    <section className="flex flex-col items-center justify-center w-full gap-8 py-12 md:py-16">
      {/* Titre de la page */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={`${title()} text-violet-600 dark:text-violet-300`}>Ressources</h1>
        <p className="mt-4 text-lg text-gray-600">
          Explorez nos ressources dédiées à l'accompagnement des enfants et adultes autistes.
        </p>
      </motion.div>
      <BackButton label="Retour" />

      {/* Liste des ressources */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1200px] mt-12"
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {resources.map((resource, index) => (
          <Card key={index} className="transition-shadow duration-300 shadow-md hover:shadow-lg">
            <CardBody className="flex flex-col items-center text-center">
              <Image
                alt={resource.title}
                className="object-cover rounded-lg"
                src={resource.img}
                style={{ width: '100%', height: '250px' }}
              />
              <h3 className="mt-4 text-xl font-bold text-violet-700">{resource.title}</h3>
              <p className="mt-2 text-gray-600">{resource.description}</p>
              <a
                className="block mt-4 text-blue-500 hover:underline"
                href={resource.link}
              >
                Découvrir
              </a>
            </CardBody>
          </Card>
        ))}
      </motion.div>
    </section>
  );
};

export default Resources;


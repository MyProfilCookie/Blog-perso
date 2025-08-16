/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Image } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { Divider } from '@nextui-org/react';

import BackButton from "@/components/back";

const ToolsComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 py-8">
      <Card className="max-w-3xl shadow-md bg-blue-50">
        <CardBody>
          <h2 className="text-3xl font-bold text-center text-blue-700">
            Outils pédagogiques
          </h2>
          <BackButton label="Retour" />
          <Image
            alt="Outils pédagogiques"
            className="object-cover w-full h-64 mt-4 rounded-lg"
            src="/assets/resources/tools.webp"
          />
          <p className="mt-4 text-center text-gray-700">
            Des fiches et supports adaptés pour aider les enfants autistes dans
            leur apprentissage quotidien, et les aider à développer des
            compétences clés.
          </p>

          {/* Objectifs des outils pédagogiques */}
          <h3 className="mt-6 text-2xl font-bold text-blue-700">
            Objectifs des outils :
          </h3>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              Faciliter la communication grâce à des supports visuels et
              interactifs.
            </li>
            <li>
              Encourager l'apprentissage de nouvelles compétences à travers des
              activités adaptées.
            </li>
            <li>
              Renforcer les routines quotidiennes pour une meilleure autonomie.
            </li>
            <li>
              Soutenir l'apprentissage des concepts de base, tels que les
              couleurs, les chiffres, et les lettres.
            </li>
          </ul>

          <Divider className="my-6" />

          {/* Exemples d'outils pédagogiques */}
          <h3 className="text-2xl font-bold text-blue-700">
            Exemples d'outils pédagogiques :
          </h3>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              <strong>Tableaux de routine :</strong> Utiliser des tableaux
              visuels pour aider l'enfant à suivre sa journée et comprendre les
              différentes étapes à accomplir.
            </li>
            <li>
              <strong>Cartes d'émotions :</strong> Des cartes illustrant
              différentes émotions pour aider l'enfant à identifier et exprimer
              ses sentiments.
            </li>
            <li>
              <strong>Pictogrammes PECS :</strong> Des supports de communication
              visuelle pour faciliter les échanges et l'expression des besoins.
            </li>
            <li>
              <strong>Fiches éducatives :</strong> Des fiches thématiques sur
              les couleurs, les chiffres, les animaux, etc., pour un
              apprentissage interactif.
            </li>
            <li>
              <strong>Applications d'apprentissage :</strong> Des applications
              pédagogiques, offrant des activités ludiques pour renforcer
              l'acquisition des compétences.
            </li>
            <li>
              <strong>Boîtes à sons :</strong> Des supports audio pour aider
              l'enfant à reconnaître et différencier les sons, améliorant ainsi
              son attention auditive.
            </li>
          </ul>

          <Divider className="my-6" />

          {/* Conseils pour utiliser les outils pédagogiques */}
          <h3 className="text-2xl font-bold text-blue-700">
            Conseils d&rsquo;utilisation :
          </h3>
          <p className="mt-4 text-gray-700">
            Les outils pédagogiques peuvent être utilisés de différentes
            manières en fonction des besoins de l&rsquo;enfant :
          </p>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              Adaptez les supports en fonction du niveau de développement de
              l'enfant.
            </li>
            <li>
              Introduisez les outils progressivement pour ne pas surcharger
              l'enfant.
            </li>
            <li>
              Faites participer l'enfant dans le choix des outils pour qu'il se
              sente impliqué.
            </li>
            <li>
              Utilisez les outils de manière régulière pour renforcer les acquis
              et instaurer une routine.
            </li>
          </ul>

          <Divider className="my-6" />

          {/* Ressources complémentaires */}
          <h3 className="text-2xl font-bold text-blue-700">
            Ressources complémentaires :
          </h3>
          <p className="mt-4 text-gray-700">
            Pour vous aider à utiliser ces outils pédagogiques au quotidien,
            nous proposons :
          </p>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              Des guides pratiques expliquant comment intégrer les outils dans
              les routines de l'enfant.
            </li>
            <li>
              Des vidéos tutoriels pour apprendre à fabriquer vos propres outils
              personnalisés à la maison.
            </li>
            <li>
              Des fiches conseils pour adapter les outils en fonction des
              besoins spécifiques de chaque enfant.
            </li>
            <li>
              Des liens vers des boutiques spécialisées pour trouver des outils
              adaptés à l'apprentissage des enfants autistes.
            </li>
          </ul>

          <div className="flex justify-center mt-8">
            <Button className="text-white bg-blue-600 hover:bg-blue-700">
              En savoir plus
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ToolsComponent;

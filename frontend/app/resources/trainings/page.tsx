"use client";
import React from "react";
import { Card, CardBody, Image, Button, Divider } from "@nextui-org/react";

import BackButton from "@/components/back";

const TrainingsComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 py-8">
      <BackButton label="Retour" />
      <Card className="max-w-3xl shadow-md bg-yellow-50">
        <CardBody>
          <h2 className="text-3xl font-bold text-center text-yellow-700">
            Formations et Ateliers
          </h2>
          <Image
            alt="Formations et Ateliers"
            className="object-cover w-full h-64 mt-4 rounded-lg"
            src="/assets/resources/trainings.webp"
          />
          <p className="mt-4 text-center text-gray-700">
            Nos formations sont conçues pour les parents, les enseignants, et
            les professionnels de santé, afin de mieux comprendre l’autisme et
            d&rsquo;acquérir des outils concrets pour accompagner les enfants
            autistes dans leur quotidien.
          </p>

          {/* Objectifs de la formation */}
          <h3 className="mt-6 text-2xl font-bold text-yellow-700">
            Objectifs de la formation :
          </h3>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>Comprendre les spécificités de l&rsquo;autisme.</li>
            <li>Apprendre à utiliser des méthodes éducatives adaptées.</li>
            <li>Développer des techniques de gestion du comportement.</li>
            <li>Améliorer la communication et l’interaction sociale.</li>
            <li>
              Créer un environnement sécurisant et propice à
              l&rsquo;apprentissage.
            </li>
          </ul>

          <Divider className="my-6" />

          {/* Exemples de formations */}
          <h3 className="text-2xl font-bold text-yellow-700">
            Exemples de formations :
          </h3>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              <strong>Ateliers sur la méthode ABA :</strong> Introduction à
              l&rsquo;Applied Behavior Analysis (ABA), une approche basée sur
              des principes comportementaux pour aider les enfants autistes à
              acquérir des compétences sociales, de communication et de
              comportement.
            </li>
            <li>
              <strong>
                Sessions de formation en communication non-verbale :
              </strong>{" "}
              Techniques pour développer la communication, avec des outils tels
              que les pictogrammes PECS, le langage des signes, et les
              applications de communication assistée.
            </li>
            <li>
              <strong>Groupes de soutien pour les parents :</strong> Des
              ateliers interactifs permettant aux parents de partager leurs
              expériences et d’apprendre des stratégies de gestion du stress et
              de développement des compétences parentales.
            </li>
            <li>
              <strong>
                Ateliers pour créer des supports visuels adaptés :
              </strong>{" "}
              Comment élaborer des supports pédagogiques comme des tableaux de
              routine, des cartes de communication et des fiches éducatives
              personnalisées.
            </li>
            <li>
              <strong>
                Formations en gestion des crises et des comportements difficiles
                :
              </strong>{" "}
              Apprentissage des techniques pour anticiper et gérer les crises,
              avec des stratégies pour apaiser et accompagner l’enfant lors de
              situations stressantes.
            </li>
            <li>
              <strong>Introduction aux thérapies sensorielles :</strong>{" "}
              Comprendre les besoins sensoriels des enfants autistes et
              découvrir des activités pour les aider à mieux gérer leur
              environnement.
            </li>
            <li>
              <strong>Formation sur l’autonomie à la maison :</strong> Conseils
              et outils pour encourager l’autonomie des enfants dans les tâches
              quotidiennes, comme s&rsquo;habiller, se laver les dents, et
              ranger leurs affaires.
            </li>
            <li>
              <strong>Accompagnement scolaire :</strong> Formation à destination
              des enseignants pour créer un environnement scolaire inclusif,
              avec des stratégies d’apprentissage adaptées aux besoins
              spécifiques des élèves autistes.
            </li>
          </ul>

          <Divider className="my-6" />

          {/* Informations pratiques */}
          <h3 className="text-2xl font-bold text-yellow-700">
            Informations pratiques :
          </h3>
          <p className="mt-4 text-gray-700">
            Nos formations sont disponibles sous plusieurs formats pour
            s&rsquo;adapter à vos besoins :
          </p>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              <strong>En ligne :</strong> Des sessions en ligne interactives
              avec des modules vidéo, des exercices pratiques, et des
              discussions en direct avec des experts.
            </li>
            <li>
              <strong>En présentiel :</strong> Des formations en groupe ou
              individuelles, dans des centres spécialisés ou à domicile, pour un
              accompagnement personnalisé.
            </li>
            <li>
              <strong>Ateliers thématiques :</strong> Des ateliers intensifs sur
              des sujets spécifiques, organisés régulièrement pour approfondir
              des thématiques précises comme la gestion des comportements ou les
              stratégies éducatives.
            </li>
          </ul>
          <p className="mt-4 text-gray-700">
            Toutes nos formations sont animées par des professionnels
            expérimentés dans le domaine de l’autisme. Un certificat de
            participation est délivré à la fin de chaque formation.
          </p>

          <Divider className="my-6" />

          {/* Ressources complémentaires */}
          <h3 className="text-2xl font-bold text-yellow-700">
            Ressources complémentaires :
          </h3>
          <p className="mt-4 text-gray-700">
            Chaque participant reçoit un accès à notre bibliothèque de
            ressources comprenant :
          </p>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>Des fiches pratiques et des guides téléchargeables.</li>
            <li>Des vidéos et des tutoriels animés par des experts.</li>
            <li>
              Des liens vers des articles et des ouvrages de référence sur
              l&rsquo;autisme.
            </li>
            <li>
              Un accès à une communauté de parents et de professionnels pour
              échanger et se soutenir.
            </li>
          </ul>

          <div className="flex justify-center mt-8">
            <Button className="text-white bg-yellow-600 hover:bg-yellow-700">
              En savoir plus
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TrainingsComponent;

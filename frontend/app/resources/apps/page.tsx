"use client";
import React from "react";
import { Card, CardBody, Image, Button, Divider } from "@nextui-org/react";

const AppsComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 py-8">
      <Card className="max-w-3xl shadow-md bg-blue-50">
        <CardBody>
          <h2 className="text-3xl font-bold text-center text-blue-700">
            Applications éducatives
          </h2>
          <Image
            alt="Applications éducatives"
            className="object-cover w-full h-64 mt-4 rounded-lg"
            src="/assets/resources/apps.webp"
          />
          <p className="mt-4 text-center text-gray-700">
            Une liste d&apos;applications pour soutenir l&apos;éducation des
            enfants autistes et développer leur autonomie.
          </p>

          {/* Objectifs des applications éducatives */}
          <h3 className="mt-6 text-2xl font-bold text-blue-700">
            Objectifs des applications :
          </h3>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              Améliorer la communication par le biais d&apos;applications
              spécialisées.
            </li>
            <li>
              Renforcer les compétences cognitives et sociales grâce à des jeux
              éducatifs interactifs.
            </li>
            <li>
              Encourager l&apos;autonomie des enfants en établissant des
              routines quotidiennes.
            </li>
            <li>
              Favoriser la reconnaissance des émotions et l&apos;expression de
              soi.
            </li>
          </ul>

          <Divider className="my-6" />

          {/* Exemples d'applications éducatives */}
          <h3 className="text-2xl font-bold text-blue-700">
            Exemples d&apos;applications :
          </h3>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              <strong>Proloquo2Go :</strong> Une application de communication
              assistée pour aider les enfants à exprimer leurs besoins et
              sentiments.
            </li>
            <li>
              <strong>Autism Therapy with MITA :</strong> Un outil
              d&apos;entraînement cognitif conçu pour améliorer les compétences
              de perception, d&apos;attention et de langage.
            </li>
            <li>
              <strong>Choiceworks :</strong> Aide à établir des routines
              quotidiennes et à enseigner des compétences de gestion des
              émotions.
            </li>
            <li>
              <strong>Endless Reader :</strong> Une application pour apprendre
              la lecture, en utilisant des animations et des interactions
              amusantes.
            </li>
            <li>
              <strong>Social Stories Creator & Library :</strong> Permet de
              créer des histoires sociales personnalisées pour enseigner les
              compétences sociales et comportementales.
            </li>
            <li>
              <strong>See.Touch.Learn :</strong> Une application visuelle pour
              développer des compétences telles que la correspondance, la
              discrimination visuelle et le développement du vocabulaire.
            </li>
          </ul>

          <Divider className="my-6" />

          {/* Conseils pour utiliser les applications éducatives */}
          <h3 className="text-2xl font-bold text-blue-700">
            Conseils d&apos;utilisation :
          </h3>
          <p className="mt-4 text-gray-700">
            Les applications éducatives peuvent être intégrées dans le quotidien
            de l&apos;enfant de manière flexible :
          </p>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              Choisissez des applications adaptées au niveau de développement et
              aux intérêts de l&apos;enfant.
            </li>
            <li>
              Limitez le temps d&apos;écran pour favoriser un usage sain et
              équilibré des applications.
            </li>
            <li>
              Accompagnez l&apos;enfant dans l&apos;utilisation des applications
              pour renforcer l&apos;apprentissage et l&apos;interaction.
            </li>
            <li>
              Utilisez les applications comme complément aux activités
              éducatives traditionnelles.
            </li>
          </ul>

          <Divider className="my-6" />

          {/* Ressources complémentaires */}
          <h3 className="text-2xl font-bold text-blue-700">
            Ressources complémentaires :
          </h3>
          <p className="mt-4 text-gray-700">
            Découvrez des tutoriels et guides d&apos;utilisation pour chaque
            application afin de maximiser leur efficacité :
          </p>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              Guides pratiques pour configurer et personnaliser les applications
              en fonction des besoins de l&apos;enfant.
            </li>
            <li>
              Recommandations sur les meilleures pratiques pour intégrer les
              applications dans les routines d&apos;apprentissage.
            </li>
            <li>
              Liens vers des plateformes d&apos;app store pour trouver et
              télécharger les applications éducatives adaptées.
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

export default AppsComponent;

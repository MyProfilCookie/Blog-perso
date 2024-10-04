"use client";
import React from "react";
import { Card, CardBody, Image, Button, Divider } from "@nextui-org/react";

import BackButton from "@/components/back";

const GamesComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 py-8">
      <Card className="max-w-3xl shadow-md bg-green-50">
        <CardBody>
          <h2 className="text-3xl font-bold text-center text-green-700">
            Jeux éducatifs
          </h2>
          <BackButton label="Retour" />
          <Image
            alt="Jeux éducatifs"
            className="object-cover w-full h-64 mt-4 rounded-lg"
            src="/assets/resources/games.webp"
          />
          <p className="mt-4 text-center text-gray-700">
            Une sélection de jeux adaptés pour stimuler l&apos;apprentissage, la
            concentration, et la socialisation des enfants autistes.
          </p>

          {/* Objectifs des jeux éducatifs */}
          <h3 className="mt-6 text-2xl font-bold text-green-700">
            Objectifs des jeux :
          </h3>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>Améliorer la motricité fine et la coordination.</li>
            <li>Développer la communication et les compétences sociales.</li>
            <li>Renforcer la concentration et l&apos;attention.</li>
            <li>Apprendre en s&apos;amusant avec des concepts éducatifs.</li>
          </ul>

          <Divider className="my-6" />

          {/* Exemples de jeux éducatifs */}
          <h3 className="text-2xl font-bold text-green-700">
            Exemples de jeux éducatifs :
          </h3>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              <strong>Jeu de Memory :</strong> Utiliser des images simples comme
              des animaux, des objets, ou des couleurs pour travailler la
              concentration et la mémoire visuelle.
            </li>
            <li>
              <strong>Puzzles progressifs :</strong> Des puzzles adaptés au
              niveau de l&apos;enfant, pour développer la motricité fine et la
              capacité de résolution de problèmes.
            </li>
            <li>
              <strong>Jeux de société comme &quot;Qui est-ce ?&quot; :</strong>{" "}
              Stimuler Stimuler les interactions sociales et la communication en
              posant questions et en identifiant des personnages.
            </li>
            <li>
              <strong>Blocs de construction :</strong> Des jeux de construction
              tels que les Lego pour développer la créativité, la motricité
              fine, et l&apos;apprentissage des formes et des couleurs.
            </li>
            <li>
              <strong>Jeux sensoriels :</strong> Des jeux de sable, de pâte à
              modeler ou de balles pour stimuler les sens et favoriser
              l’exploration tactile.
            </li>
            <li>
              <strong>Applications ludo-éducatives :</strong> Des applications
              spécialement conçues pour les enfants autistes, qui combinent le
              jeu et l&apos;apprentissage de concepts de base comme les
              chiffres, les lettres, et les couleurs.
            </li>
          </ul>

          <Divider className="my-6" />

          {/* Conseils pour choisir les jeux */}
          <h3 className="text-2xl font-bold text-green-700">
            Conseils pour choisir les jeux :
          </h3>
          <p className="mt-4 text-gray-700">
            Lors du choix des jeux éducatifs pour les enfants autistes, il est
            essentiel de prendre en compte leurs intérêts, leurs besoins
            spécifiques, et leur niveau de développement. Voici quelques
            conseils :
          </p>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              Privilégier les jeux qui offrent une expérience sensorielle
              agréable.
            </li>
            <li>
              Choisir des jeux à étapes progressives pour favoriser
              l&apos;apprentissage en douceur.
            </li>
            <li>
              Éviter les jeux trop stimulants, avec des bruits ou des lumières
              intenses.
            </li>
            <li>
              Intégrer des moments de jeu dans la routine quotidienne pour créer
              un environnement rassurant.
            </li>
          </ul>

          <Divider className="my-6" />

          {/* Ressources complémentaires */}
          <h3 className="text-2xl font-bold text-green-700">
            Ressources complémentaires :
          </h3>
          <p className="mt-4 text-gray-700">
            Pour accompagner les enfants dans leurs moments de jeu éducatif,
            nous mettons à disposition :
          </p>
          <ul className="mt-4 ml-6 text-gray-700 list-disc">
            <li>
              Des guides d&apos;utilisation pour les parents, pour optimiser les
              bénéfices de chaque jeu.
            </li>
            <li>
              Des tutoriels vidéo expliquant comment adapter les jeux en
              fonction des besoins de l&apos;enfant.
            </li>
            <li>
              Une liste d&apos;applications mobiles recommandées pour
              l&apos;apprentissage ludique.
            </li>
            <li>
              Des fiches conseils pour créer des jeux personnalisés à la maison.
            </li>
          </ul>

          <div className="flex justify-center mt-8">
            <Button className="text-white bg-green-600 hover:bg-green-700">
              En savoir plus
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default GamesComponent;

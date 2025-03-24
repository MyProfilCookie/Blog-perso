/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { title } from "@/components/primitives";

const CoursePage = () => {
  const router = useRouter();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const images = [
    "/assets/maeva/maeva1.jpg",
    "/assets/maeva/maeva.jpg",
    "/assets/maeva/maevanini.jpg",
    "/assets/maeva/IMG_1411.jpg",
    "/assets/maeva/IMG_1427.jpg",
    "/assets/maeva/IMG_2248.jpg",
  ];

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="justify-center inline-block text-center">
        <h1 className={`${title()} text-violet-600 dark:text-violet-300`}>Ma page dédiée à Maeva</h1>
      </div>

      {/* Description complète de Maeva */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center w-full"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full py-4">
          <CardBody className="flex flex-col items-center">
            <p style={{ fontSize: "1em", lineHeight: "1.6" }}>
              Maeva est née le 26 octobre 2010 et habite à Sartrouville, au 27
              rue Pablo Picasso. Elle est une jeune fille pleine de vie, mais
              qui fait face à des défis quotidiens en raison de son retard de
              langage et de ses difficultés à communiquer. Ces aspects de son
              développement nécessitent une attention et des méthodes
              d'apprentissage adaptées pour l'aider à progresser.
            </p>
            <p style={{ fontSize: "1em", lineHeight: "1.6", marginTop: "1em" }}>
              Maeva a aussi des préférences bien définies. Elle adore les
              frites, ainsi que les paniers de Yoplait fraises, un plaisir
              simple qui lui apporte beaucoup de bonheur. Cependant, elle a
              également des aversions fortes, notamment envers les chiens et les
              oiseaux. Elle est particulièrement sensible au bruit, qui peut
              être une source de stress majeur pour elle.
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Grille des photos de Maeva */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="w-full mt-8"
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={index} className="flex justify-center">
              <Image
                alt={`Maeva ${index + 1}`}
                className="object-cover w-full h-auto cursor-pointer rounded-xl"
                src={image}
                onClick={() => openModal(image)}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Modal pour afficher l'image en grand */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent onClick={closeModal}>
          {selectedImage && (
            <Image
              alt={`Maeva ${selectedImage}`}
              className="object-cover w-full h-auto rounded-xl"
              src={selectedImage}
              onClick={(e) => e.stopPropagation()} // Empêche la fermeture du modal en cliquant sur l'image
            />
          )}
        </ModalContent>
        <ModalHeader className="flex justify-end">
          <Button color="danger" variant="flat" onClick={closeModal}>
            Fermer
          </Button>
        </ModalHeader>
      </Modal>

      {/* Boutons de navigation */}
      <div className="flex flex-col items-start w-full gap-4 mt-8 md:flex-row md:justify-around md:items-center">
        <div className="flex gap-3">
          <Button
            className={`rounded-full px-4 py-2 ${hoveredButton === "cours" ? "bg-violet-600 text-white" : "bg-gray-200 text-black"}`}
            onClick={() => router.push("/controle")}
            onMouseEnter={() => setHoveredButton("cours")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Aller aux Cours
          </Button>
          <Button
            className={`rounded-full px-4 py-2 ${hoveredButton === "articles" ? "bg-violet-600 text-white" : "bg-gray-200 text-black"}`}
            onClick={() => router.push("/articles")}
            onMouseEnter={() => setHoveredButton("articles")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursePage;

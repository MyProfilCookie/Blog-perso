"use client";
import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";

const courseThemes = [
  {
    id: 1,
    title: "Leçons du jour",
    description: "Apprends les leçons du jour.",
    image: "/assets/lessons.jpg",
    route: "/controle/lessons",
    bgColor: "bg-blue-200", // Couleur personnalisée
  },
  {
    id: 2,
    title: "Sciences",
    description: "Explore le monde des sciences.",
    image: "/assets/sciences.jpg",
    route: "/controle/sciences",
    bgColor: "bg-green-200", // Couleur personnalisée
  },
  {
    id: 3,
    title: "Mathématiques",
    description: "Apprends les bases des mathématiques.",
    image: "/assets/math.jpg",
    route: "/controle/math",
    bgColor: "bg-yellow-200", // Couleur personnalisée
  },
  {
    id: 4,
    title: "Français",
    description: "Améliore ton français avec des exercices adaptés.",
    image: "/assets/french.jpg",
    route: "/controle/french",
    bgColor: "bg-red-200", // Couleur personnalisée
  },
  {
    id: 5,
    title: "Arts Plastiques",
    description: "Découvre l'art et exprime ta créativité.",
    image: "/assets/art.jpg",
    route: "/controle/art",
    bgColor: "bg-purple-200", // Couleur personnalisée
  },
  {
    id: 6,
    title: "Langues",
    description: "Apprends les langues.",
    image: "/assets/language.jpg",
    route: "/controle/language",
    bgColor: "bg-pink-200", // Couleur personnalisée
  },
  {
    id: 7,
    title: "Histoire",
    description: "Apprends l'histoire.",
    image: "/assets/history.jpg",
    route: "/controle/history",
    bgColor: "bg-indigo-200", // Couleur personnalisée
  },
  {
    id: 8,
    title: "Geographie",
    description: "Apprends la geographie.",
    image: "/assets/geography.jpg",
    route: "/controle/geography",
    bgColor: "bg-teal-200", // Couleur personnalisée
  },
  {
    id: 9,
    title: "Trimestres",
    description: "Résultat de l'examen de fin d'étude.",
    image: "/assets/trimestres.webp",
    route: "/controle/trimestres",
    bgColor: "bg-orange-200", // Couleur personnalisée
  },
  {
    id: 10,
    title: "Rapport Hebdo",
    description: "Rapport hebdomadaire.",
    image: "/assets/rapport_hebdo.webp",
    route: "/controle/rapportHebdo",
    bgColor: "bg-gray-200", // Couleur personnalisée
  },
];

const BlogPage = () => {
  const router = useRouter();

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className={title()}>Les contrôles</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courseThemes.map((theme) => (
          <motion.div
            key={theme.id}
            animate={{ opacity: 1, y: 0 }}
            className="w-full cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            onClick={() => handleCardClick(theme.route)}
          >
            <Card
              className={`max-w-[400px] w-full hover:shadow-lg ${theme.bgColor}`}
            >
              <CardBody className="flex flex-col items-center p-0">
                {" "}
                {/* Remplacer le padding par `p-0` */}
                <img
                  alt={theme.title}
                  className="object-cover w-full h-[250px] rounded-none"
                  src={theme.image}
                  onPointerDown={(e) => e.preventDefault()} // Prevent image from opening in new tab
                />
                <div className="mt-4 text-center">
                  <h4 className="font-bold text-large">{theme.title}</h4>
                  <small className="text-default-500">
                    {theme.description}
                  </small>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;

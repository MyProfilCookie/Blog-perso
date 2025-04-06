export async function getServerSideProps() {
  // Simuler la récupération des statuts depuis une base
  const courseThemes = [
    {
      id: 1,
      title: "Français",
      route: "/controle/french",
      status: "completed",
      description: "Grammaire, conjugaison et vocabulaire",
      icon: "faBookOpen",
      bgColor: "bg-red-100 dark:bg-red-800",
      iconColor: "text-red-600 dark:text-red-300",
    },
    {
      id: 2,
      title: "Arts Plastiques",
      route: "/controle/art",
      status: "in-progress",
      description: "Exercices créatifs et artistiques",
      icon: "faPaintBrush",
      bgColor: "bg-purple-100 dark:bg-purple-800",
      iconColor: "text-purple-600 dark:text-purple-300",
    },
    {
      id: 3,
      title: "Histoire",
      route: "/controle/history",
      status: "locked",
      description: "Repères historiques essentiels",
      icon: "faHistory",
      bgColor: "bg-indigo-100 dark:bg-indigo-800",
      iconColor: "text-indigo-600 dark:text-indigo-300",
    },
    {
      id: 4,
      title: "Sciences",
      route: "/controle/science",
      status: "in-progress",
      description: "Expériences et découvertes",
      icon: "faFlask",
      bgColor: "bg-green-100 dark:bg-green-800",
      iconColor: "text-green-600 dark:text-green-300",
    },
    {
      id: 5,
      title: "Mathématiques",
      route: "/controle/maths",
      status: "completed",
      description: "Calculs, logique et raisonnement",
      icon: "faCalculator",
      bgColor: "bg-yellow-100 dark:bg-yellow-800",
      iconColor: "text-yellow-600 dark:text-yellow-300",
    },
    {
      id: 6,
      title: "Langues",
      route: "/controle/english",
      status: "in-progress",
      description: "Compréhension et vocabulaire",
      icon: "faLanguage",
      bgColor: "bg-pink-100 dark:bg-pink-800",
      iconColor: "text-pink-600 dark:text-pink-300",
    },
    {
      id: 7,
      title: "Musique",
      route: "/controle/music",
      status: "locked",
      description: "Écoute et culture musicale",
      icon: "faMusic",
      bgColor: "bg-rose-100 dark:bg-rose-800",
      iconColor: "text-rose-600 dark:text-rose-300",
    },
    {
      id: 8,
      title: "Technologie",
      route: "/controle/technology",
      status: "locked",
      description: "Culture techno et logique",
      icon: "faGears",
      bgColor: "bg-cyan-100 dark:bg-cyan-800",
      iconColor: "text-cyan-600 dark:text-cyan-300",
    },
    {
      id: 9,
      title: "Géographie",
      route: "/controle/geography",
      status: "completed",
      description: "Découverte du monde",
      icon: "faGlobe",
      bgColor: "bg-teal-100 dark:bg-teal-800",
      iconColor: "text-teal-600 dark:text-teal-300",
    },
  ];

  return {
    props: {
      courseThemes,
    },
  };
}

import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/router";
import {
  faFileAlt,
  faBolt,
  faClock,
  faExclamationTriangle,
  faBookOpen,
  faPaintBrush,
  faHistory,
  faFlask,
  faCalculator,
  faLanguage,
  faMusic,
  faGears,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  faBookOpen,
  faPaintBrush,
  faHistory,
  faFlask,
  faCalculator,
  faLanguage,
  faMusic,
  faGears,
  faGlobe,
};

import BackButton from "@/components/back";

interface CourseTheme {
  id: number;
  title: string;
  route: string;
  status: "completed" | "in-progress" | "locked";
  description: string;
  icon: keyof typeof iconMap;
  bgColor: string;
  iconColor: string;
}

const stats = [
  { label: "Réussites", value: "85%", icon: faBolt, color: "text-green-500" },
  {
    label: "Temps moyen",
    value: "17 min",
    icon: faClock,
    color: "text-blue-500",
  },
  {
    label: "Tentatives",
    value: "42",
    icon: faFileAlt,
    color: "text-purple-500",
  },
  {
    label: "Erreurs",
    value: "5",
    icon: faExclamationTriangle,
    color: "text-red-500",
  },
];

const ControlePage = ({ courseThemes }: { courseThemes: CourseTheme[] }) => {
  const router = useRouter();

  return (
    <div className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6 relative">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
              Contrôle
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Exercices de contrôle
            </p>
          </motion.div>
          <div className="flex justify-center mb-4">
            <BackButton />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl items-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon
                className={`text-2xl mb-2 ${stat.color}`}
                icon={stat.icon}
              />
              <h3 className="text-lg font-semibold">{stat.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.div
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mt-8"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {courseThemes.map((theme, index) => (
          <motion.div
            key={theme.id}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card
              isPressable
              className={`relative w-full h-full min-h-[160px] ${theme.bgColor} flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:brightness-110`}
              onClick={() => {
                if (router.pathname !== theme.route) {
                  router.push(theme.route);
                }
              }}
            >
              <CardBody className="p-4 flex flex-col justify-center h-full text-center items-center">
                {theme.status && (
                  <div
                    className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${
                      theme.status === "completed"
                        ? "bg-green-500 text-white"
                        : theme.status === "in-progress"
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-400 text-white"
                    }`}
                  >
                    {theme.status === "completed"
                      ? "Terminé"
                      : theme.status === "in-progress"
                        ? "En cours"
                        : "Verrouillé"}
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon
                    className={theme.iconColor}
                    icon={iconMap[theme.icon as keyof typeof iconMap]}
                  />
                  <h2 className="font-bold">{theme.title}</h2>
                </div>
                <p className="text-sm">{theme.description}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ControlePage;

"use client";
import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faFlask,
  faCalculator,
  faLanguage,
  faPalette,
  faLandmark,
  faGlobe,
  faTrophy,
  faClipboardList,
  faMicrochip,
  faStar,
  faClock,
  faUsers,
  faChartBar,
  faMusic,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

import BackButton from "@/components/back";

const stats = [
  {
    icon: faStar,
    label: "Moyenne Générale",
    value: "15.5/20",
    color: "text-yellow-500 dark:text-yellow-400",
  },
  {
    icon: faClock,
    label: "Temps d'étude",
    value: "2h/jour",
    color: "text-blue-500 dark:text-blue-400",
  },
  {
    icon: faUsers,
    label: "Élèves actifs",
    value: "24",
    color: "text-green-500 dark:text-green-400",
  },
  {
    icon: faChartBar,
    label: "Progression",
    value: "+12%",
    color: "text-purple-500 dark:text-purple-400",
  },
];

interface CourseProgress {
  progress: number;
  status: "completed" | "in-progress" | "locked";
}

interface CourseProgressMap {
  [key: number]: CourseProgress;
}

const courseProgress: CourseProgressMap = {
  1: { progress: 85, status: "completed" },
  2: { progress: 60, status: "in-progress" },
  3: { progress: 75, status: "in-progress" },
  4: { progress: 90, status: "completed" },
  5: { progress: 40, status: "in-progress" },
  6: { progress: 30, status: "locked" },
  7: { progress: 50, status: "in-progress" },
  8: { progress: 20, status: "locked" },
  9: { progress: 95, status: "completed" },
  10: { progress: 70, status: "in-progress" },
  11: { progress: 0, status: "locked" },
};

interface CourseTheme {
  id: number;
  title: string;
  description: string;
  image: string;
  route: string;
  bgColor: string;
  icon: any;
  iconColor: string;
}

const courseThemes: CourseTheme[] = [
  {
    id: 1,
    title: "Leçons du jour",
    description: "Apprends les leçons du jour.",
    image: "https://placehold.co/600x400/blue/white?text=Leçons",
    route: "/pages/controle/lessons",
    bgColor: "bg-blue-200 dark:bg-blue-900/30",
    icon: faBookOpen,
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    id: 2,
    title: "Sciences",
    description: "Explore le monde des sciences.",
    image: "https://placehold.co/600x400/green/white?text=Sciences",
    route: "/pages/controle/sciences",
    bgColor: "bg-green-200 dark:bg-green-900/30",
    icon: faFlask,
    iconColor: "text-green-500 dark:text-green-400",
  },
  {
    id: 3,
    title: "Mathématiques",
    description: "Apprends les bases des mathématiques.",
    image: "https://placehold.co/600x400/yellow/white?text=Maths",
    route: "/pages/controle/math",
    bgColor: "bg-yellow-200 dark:bg-yellow-900/30",
    icon: faCalculator,
    iconColor: "text-yellow-500 dark:text-yellow-400",
  },
  {
    id: 4,
    title: "Français",
    description: "Améliore ton français avec des exercices adaptés.",
    image: "https://placehold.co/600x400/red/white?text=Français",
    route: "/pages/controle/french",
    bgColor: "bg-red-200 dark:bg-red-900/30",
    icon: faLanguage,
    iconColor: "text-red-500 dark:text-red-400",
  },
  {
    id: 5,
    title: "Arts Plastiques",
    description: "Découvre l'art et exprime ta créativité.",
    image: "https://placehold.co/600x400/purple/white?text=Arts",
    route: "/pages/controle/art",
    bgColor: "bg-purple-200 dark:bg-purple-900/30",
    icon: faPalette,
    iconColor: "text-purple-500 dark:text-purple-400",
  },
  {
    id: 6,
    title: "Langues",
    description: "Apprends les langues.",
    image: "https://placehold.co/600x400/pink/white?text=Langues",
    route: "/pages/controle/language",
    bgColor: "bg-pink-200 dark:bg-pink-900/30",
    icon: faLanguage,
    iconColor: "text-pink-500 dark:text-pink-400",
  },
  {
    id: 7,
    title: "Histoire",
    description: "Apprends l'histoire.",
    image: "https://placehold.co/600x400/indigo/white?text=Histoire",
    route: "/pages/controle/history",
    bgColor: "bg-indigo-200 dark:bg-indigo-900/30",
    icon: faLandmark,
    iconColor: "text-indigo-500 dark:text-indigo-400",
  },
  {
    id: 8,
    title: "Geographie",
    description: "Apprends la geographie.",
    image: "https://placehold.co/600x400/teal/white?text=Géographie",
    route: "/controle/geography",
    bgColor: "bg-teal-200 dark:bg-teal-900/30",
    icon: faGlobe,
    iconColor: "text-teal-500 dark:text-teal-400",
  },
  {
    id: 9,
    title: "Trimestres",
    description: "Résultat de l'examen de fin d'étude.",
    image: "https://placehold.co/600x400/orange/white?text=Trimestres",
    route: "/controle/trimestres",
    bgColor: "bg-orange-200 dark:bg-orange-900/30",
    icon: faTrophy,
    iconColor: "text-orange-500 dark:text-orange-400",
  },
  {
    id: 10,
    title: "Rapport Hebdo",
    description: "Rapport hebdomadaire.",
    image: "https://placehold.co/600x400/gray/white?text=Rapport",
    route: "/pages/controle/rapportHebdo",
    bgColor: "bg-gray-200 dark:bg-gray-900/30",
    icon: faClipboardList,
    iconColor: "text-gray-500 dark:text-gray-400",
  },
  {
    id: 11,
    title: "Technologie",
    description: "Apprends la technologie.",
    image: "https://placehold.co/600x400/cyan/white?text=Technologie",
    route: "/pages/controle/technology",
    bgColor: "bg-cyan-200 dark:bg-cyan-900/30",
    icon: faMicrochip,
    iconColor: "text-cyan-500 dark:text-cyan-400",
  },
  {
    id: 12,
    title: "Musique",
    description: "Découvre la musique et les instruments.",
    image: "https://placehold.co/600x400/rose/white?text=Musique",
    route: "/pages/controle/music",
    bgColor: "bg-rose-200 dark:bg-rose-900/30",
    icon: faMusic,
    iconColor: "text-rose-500 dark:text-rose-400",
  },
  {
    id: 13,
    title: "Erreurs de révision",
    description: "Résultat de l'examen de fin d'étude.",
    image: "https://placehold.co/600x400/orange/white?text=Erreurs",
    route: "/revision-errors",
    bgColor: "bg-orange-200 dark:bg-orange-900/30",
    icon: faExclamationTriangle,
    iconColor: "text-gray-500 dark:text-gray-400",
  },
];

export default function ControlePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex-1 w-full max-w-7xl mx-auto">
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

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl"
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
                className={`w-full ${theme.bgColor}`}
                onClick={() => router.push(theme.route)}
              >
                <CardBody className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon
                      className={theme.iconColor}
                      icon={theme.icon}
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
    </div>
  );
}

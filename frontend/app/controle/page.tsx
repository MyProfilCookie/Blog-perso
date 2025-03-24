"use client";
import { Card, CardBody, Badge } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
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
  faCheckCircle,
  faLock,
  faCrown,
  faFire,
} from "@fortawesome/free-solid-svg-icons";

import { title } from "@/components/primitives";
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
    route: "/controle/lessons",
    bgColor: "bg-blue-200 dark:bg-blue-900/30",
    icon: faBookOpen,
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    id: 2,
    title: "Sciences",
    description: "Explore le monde des sciences.",
    image: "https://placehold.co/600x400/green/white?text=Sciences",
    route: "/controle/sciences",
    bgColor: "bg-green-200 dark:bg-green-900/30",
    icon: faFlask,
    iconColor: "text-green-500 dark:text-green-400",
  },
  {
    id: 3,
    title: "Mathématiques",
    description: "Apprends les bases des mathématiques.",
    image: "https://placehold.co/600x400/yellow/white?text=Maths",
    route: "/controle/math",
    bgColor: "bg-yellow-200 dark:bg-yellow-900/30",
    icon: faCalculator,
    iconColor: "text-yellow-500 dark:text-yellow-400",
  },
  {
    id: 4,
    title: "Français",
    description: "Améliore ton français avec des exercices adaptés.",
    image: "https://placehold.co/600x400/red/white?text=Français",
    route: "/controle/french",
    bgColor: "bg-red-200 dark:bg-red-900/30",
    icon: faLanguage,
    iconColor: "text-red-500 dark:text-red-400",
  },
  {
    id: 5,
    title: "Arts Plastiques",
    description: "Découvre l'art et exprime ta créativité.",
    image: "https://placehold.co/600x400/purple/white?text=Arts",
    route: "/controle/art",
    bgColor: "bg-purple-200 dark:bg-purple-900/30",
    icon: faPalette,
    iconColor: "text-purple-500 dark:text-purple-400",
  },
  {
    id: 6,
    title: "Langues",
    description: "Apprends les langues.",
    image: "https://placehold.co/600x400/pink/white?text=Langues",
    route: "/controle/language",
    bgColor: "bg-pink-200 dark:bg-pink-900/30",
    icon: faLanguage,
    iconColor: "text-pink-500 dark:text-pink-400",
  },
  {
    id: 7,
    title: "Histoire",
    description: "Apprends l'histoire.",
    image: "https://placehold.co/600x400/indigo/white?text=Histoire",
    route: "/controle/history",
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
    route: "/controle/rapportHebdo",
    bgColor: "bg-gray-200 dark:bg-gray-900/30",
    icon: faClipboardList,
    iconColor: "text-gray-500 dark:text-gray-400",
  },
  {
    id: 11,
    title: "Technologie",
    description: "Apprends la technologie.",
    image: "https://placehold.co/600x400/cyan/white?text=Technologie",
    route: "/controle/technology",
    bgColor: "bg-cyan-200 dark:bg-cyan-900/30",
    icon: faMicrochip,
    iconColor: "text-cyan-500 dark:text-cyan-400",
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
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4">
      <BackButton />
      
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon 
            icon={faGraduationCap} 
            className="text-4xl text-primary-500" 
          />
          <h1 className="text-2xl font-bold">Les contrôles</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {courseThemes.map((theme) => (
          <Card 
            key={theme.id}
            isPressable 
            className={`w-full ${theme.bgColor}`}
            onClick={() => router.push(theme.route)}
          >
            <CardBody className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon 
                  icon={theme.icon} 
                  className={theme.iconColor}
                />
                <h2 className="font-bold">{theme.title}</h2>
              </div>
              <p className="text-sm">{theme.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

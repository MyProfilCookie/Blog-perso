"use client";
import { Card, CardBody, Badge, Progress } from "@nextui-org/react";
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
  faFire
} from "@fortawesome/free-solid-svg-icons";

import { title } from "@/components/primitives";
import BackButton from "@/components/back";

const courseThemes = [
  {
    id: 1,
    title: "Leçons du jour",
    description: "Apprends les leçons du jour.",
    image: "/assets/lessons.jpg",
    route: "/controle/lessons",
    bgColor: "bg-blue-200 dark:bg-blue-900/30",
    icon: faBookOpen,
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    id: 2,
    title: "Sciences",
    description: "Explore le monde des sciences.",
    image: "/assets/sciences.jpg",
    route: "/controle/sciences",
    bgColor: "bg-green-200 dark:bg-green-900/30",
    icon: faFlask,
    iconColor: "text-green-500 dark:text-green-400",
  },
  {
    id: 3,
    title: "Mathématiques",
    description: "Apprends les bases des mathématiques.",
    image: "/assets/math.jpg",
    route: "/controle/math",
    bgColor: "bg-yellow-200 dark:bg-yellow-900/30",
    icon: faCalculator,
    iconColor: "text-yellow-500 dark:text-yellow-400",
  },
  {
    id: 4,
    title: "Français",
    description: "Améliore ton français avec des exercices adaptés.",
    image: "/assets/french.jpg",
    route: "/controle/french",
    bgColor: "bg-red-200 dark:bg-red-900/30",
    icon: faLanguage,
    iconColor: "text-red-500 dark:text-red-400",
  },
  {
    id: 5,
    title: "Arts Plastiques",
    description: "Découvre l'art et exprime ta créativité.",
    image: "/assets/art.jpg",
    route: "/controle/art",
    bgColor: "bg-purple-200 dark:bg-purple-900/30",
    icon: faPalette,
    iconColor: "text-purple-500 dark:text-purple-400",
  },
  {
    id: 6,
    title: "Langues",
    description: "Apprends les langues.",
    image: "/assets/language.jpg",
    route: "/controle/language",
    bgColor: "bg-pink-200 dark:bg-pink-900/30",
    icon: faLanguage,
    iconColor: "text-pink-500 dark:text-pink-400",
  },
  {
    id: 7,
    title: "Histoire",
    description: "Apprends l'histoire.",
    image: "/assets/history.jpg",
    route: "/controle/history",
    bgColor: "bg-indigo-200 dark:bg-indigo-900/30",
    icon: faLandmark,
    iconColor: "text-indigo-500 dark:text-indigo-400",
  },
  {
    id: 8,
    title: "Geographie",
    description: "Apprends la geographie.",
    image: "/assets/geography.jpg",
    route: "/controle/geography",
    bgColor: "bg-teal-200 dark:bg-teal-900/30",
    icon: faGlobe,
    iconColor: "text-teal-500 dark:text-teal-400",
  },
  {
    id: 9,
    title: "Trimestres",
    description: "Résultat de l'examen de fin d'étude.",
    image: "/assets/trimestres.webp",
    route: "/controle/trimestres",
    bgColor: "bg-orange-200 dark:bg-orange-900/30",
    icon: faTrophy,
    iconColor: "text-orange-500 dark:text-orange-400",
  },
  {
    id: 10,
    title: "Rapport Hebdo",
    description: "Rapport hebdomadaire.",
    image: "/assets/rapport_hebdo.webp",
    route: "/controle/rapportHebdo",
    bgColor: "bg-gray-200 dark:bg-gray-900/30",
    icon: faClipboardList,
    iconColor: "text-gray-500 dark:text-gray-400",
  },
  {
    id: 11,
    title: "Technologie",
    description: "Apprends la technologie.",
    image: "/assets/technology.jpg",
    route: "/controle/technology",
    bgColor: "bg-cyan-200 dark:bg-cyan-900/30",
    icon: faMicrochip,
    iconColor: "text-cyan-500 dark:text-cyan-400",
  },
];

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

const BlogPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case "locked":
        return <FontAwesomeIcon icon={faLock} className="text-gray-500" />;
      default:
        return null;
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 px-4 min-h-screen bg-gradient-to-b from-background to-background/80">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary-500/20 to-transparent pointer-events-none"
      />
      
      <BackButton />
      
      {/* Header Section avec animation améliorée */}
      <motion.div 
        className="flex flex-col items-center gap-6 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <FontAwesomeIcon 
              icon={faGraduationCap} 
              className="text-4xl text-primary-500 dark:text-primary-400" 
            />
          </motion.div>
          <h1 className={`${title()} text-center`}>Les contrôles</h1>
        </div>
        
        {/* Stats Section avec hover effects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <FontAwesomeIcon 
                icon={stat.icon} 
                className={`text-2xl mb-2 ${stat.color}`}
              />
              <h3 className="text-lg font-semibold">{stat.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Cards Grid avec effets améliorés */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {courseThemes.map((theme, index) => {
          const progress = courseProgress[theme.id];
          return (
            <motion.div
              key={theme.id}
              animate={{ opacity: 1, y: 0 }}
              className="w-full cursor-pointer relative group"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleCardClick(theme.route)}
            >
              <Card
                className={`w-full transition-all duration-300 ${theme.bgColor} backdrop-blur-sm`}
                isPressable
              >
                <CardBody className="flex flex-col items-center p-0 overflow-hidden">
                  <div className="relative w-full h-[200px]">
                    <Image
                      alt={theme.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                      src={theme.image}
                      onPointerDown={(e) => e.preventDefault()}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    {/* Badge de statut */}
                    {progress.status === "completed" && (
                      <div className="absolute top-2 right-2">
                        <Badge 
                          color="warning"
                          className="text-white"
                        >
                          <FontAwesomeIcon icon={faCrown} />
                        </Badge>
                      </div>
                    )}
                    
                    {/* Streak indicator */}
                    {progress.progress > 80 && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500/80 text-white px-2 py-1 rounded-full text-xs">
                        <FontAwesomeIcon icon={faFire} className="text-yellow-300" />
                        <span>En feu!</span>
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon 
                          icon={theme.icon} 
                          className={`text-2xl ${theme.iconColor}`}
                        />
                        {getStatusIcon(progress.status)}
                      </div>
                      <h4 className="font-bold text-xl text-white mb-1">{theme.title}</h4>
                      <small className="text-white/80 block mb-2">
                        {theme.description}
                      </small>
                      
                      {/* Barre de progression */}
                      <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            progress.status === "completed" ? "bg-green-500" : "bg-blue-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <small className="text-white/90 text-xs mt-1 block">
                        {progress.progress}% complété
                      </small>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogPage;

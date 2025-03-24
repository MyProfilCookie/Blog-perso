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
  faCheckCircle,
  faLock,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";

import { title } from "@/components/primitives";
import BackButton from "@/components/back";

const courseThemes = [
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
  // Other course themes...
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Add console logs for debugging
      console.log("Component mounting...");
      console.log("Number of courses:", courseThemes.length);

      // Set mounted state
      setMounted(true);
    } catch (err) {
      console.error("Error during component initialization:", err);
      setError("Une erreur s'est produite lors du chargement des cours");
    }
  }, []);

  const handleCardClick = (route: string) => {
    try {
      console.log("Navigating to:", route);
      router.push(route);
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Erreur de navigation. Veuillez réessayer.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <FontAwesomeIcon className="text-green-500" icon={faCheckCircle} />
        );
      case "locked":
        return <FontAwesomeIcon className="text-gray-500" icon={faLock} />;
      default:
        return null;
    }
  };

  // Loading state
  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Actualiser la page
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 px-4 min-h-screen bg-gradient-to-b from-background to-background/80">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary-500/20 to-transparent pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
      />

      <BackButton />

      {/* Header Section */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <FontAwesomeIcon
              className="text-4xl text-primary-500 dark:text-primary-400"
              icon={faGraduationCap}
            />
          </motion.div>
          <h1 className={`${title()} text-center`}>Les contrôles</h1>
        </div>
      </motion.div>

      {/* Debug info - remove in production */}
      <div className="w-full max-w-7xl mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-bold mb-2">Informations de débogage:</h3>
        <p>Nombre de cours disponibles: {courseThemes.length}</p>
        <p>État du montage: {mounted ? "Monté" : "Non monté"}</p>
      </div>

      {/* Cards Grid - Make sure courseThemes is not empty before mapping */}
      {courseThemes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {courseThemes.map((theme, index) => {
            const progress = courseProgress[theme.id] || {
              progress: 0,
              status: "locked",
            };

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
                  isPressable
                  className={`w-full transition-all duration-300 ${theme.bgColor} backdrop-blur-sm`}
                >
                  <CardBody className="flex flex-col items-center p-0 overflow-hidden">
                    <div className="relative w-full h-[200px]">
                      <Image
                        fill
                        alt={theme.title}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        src={theme.image}
                        onPointerDown={(e) => e.preventDefault()}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                      {/* Badge de statut */}
                      {progress.status === "completed" && (
                        <div className="absolute top-2 right-2">
                          <Badge className="text-white" color="warning">
                            <FontAwesomeIcon icon={faCrown} />
                          </Badge>
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FontAwesomeIcon
                            className={`text-2xl ${theme.iconColor}`}
                            icon={theme.icon}
                          />
                          {getStatusIcon(progress.status)}
                        </div>
                        <h4 className="font-bold text-xl text-white mb-1">
                          {theme.title}
                        </h4>
                        <small className="text-white/80 block mb-2">
                          {theme.description}
                        </small>

                        {/* Barre de progression */}
                        <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                          <motion.div
                            animate={{ width: `${progress.progress}%` }}
                            className={`h-full rounded-full ${
                              progress.status === "completed"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                            initial={{ width: 0 }}
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
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl">Aucun cours disponible pour le moment.</p>
          <p className="mt-2 text-gray-500">
            Veuillez vérifier votre connexion ou réessayer plus tard.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;

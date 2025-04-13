/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
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
  faUser,
  faCreditCard,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Card, CardBody, Spinner, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";

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

const courseThemes = [
  {
    id: 1,
    title: "Français",
    description: "Grammaire, conjugaison et vocabulaire",
    route: "/controle/french",
    icon: faBookOpen,
    bgColor: "bg-red-100 dark:bg-red-800",
    iconColor: "text-red-600 dark:text-red-300",
  },
  {
    id: 2,
    title: "Sciences",
    description: "Expériences et découvertes",
    route: "/controle/sciences",
    icon: faFlask,
    bgColor: "bg-green-100 dark:bg-green-800",
    iconColor: "text-green-600 dark:text-green-300",
  },
  {
    id: 3,
    title: "Mathématiques",
    description: "Calculs, logique et raisonnement",
    route: "/controle/math",
    icon: faCalculator,
    bgColor: "bg-yellow-100 dark:bg-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-300",
  },
  {
    id: 4,
    title: "Langues",
    description: "Compréhension et vocabulaire",
    route: "/controle/language",
    icon: faLanguage,
    bgColor: "bg-pink-100 dark:bg-pink-800",
    iconColor: "text-pink-600 dark:text-pink-300",
  },
  {
    id: 5,
    title: "Arts Plastiques",
    description: "Exercices créatifs et artistiques",
    route: "/controle/art",
    icon: faPalette,
    bgColor: "bg-purple-100 dark:bg-purple-800",
    iconColor: "text-purple-600 dark:text-purple-300",
  },
  {
    id: 6,
    title: "Histoire",
    description: "Repères historiques essentiels",
    route: "/controle/history",
    icon: faLandmark,
    bgColor: "bg-indigo-100 dark:bg-indigo-800",
    iconColor: "text-indigo-600 dark:text-indigo-300",
  },
  {
    id: 7,
    title: "Géographie",
    description: "Découverte du monde",
    route: "/controle/geography",
    icon: faGlobe,
    bgColor: "bg-teal-100 dark:bg-teal-800",
    iconColor: "text-teal-600 dark:text-teal-300",
  },
  {
    id: 8,
    title: "Trimestres",
    description: "Résultat de l'examen de fin d'étude",
    route: "/controle/trimestres",
    icon: faTrophy,
    bgColor: "bg-orange-100 dark:bg-orange-800",
    iconColor: "text-orange-600 dark:text-orange-300",
    isPremium: true,
  },
  {
    id: 9,
    title: "Rapport Hebdo",
    description: "Rapport hebdomadaire",
    route: "/controle/rapportHebdo",
    icon: faClipboardList,
    bgColor: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-300",
    isPremium: true,
  },
  {
    id: 10,
    title: "Technologie",
    description: "Culture techno et logique",
    route: "/controle/technology",
    icon: faMicrochip,
    bgColor: "bg-cyan-100 dark:bg-cyan-800",
    iconColor: "text-cyan-600 dark:text-cyan-300",
  },
  {
    id: 11,
    title: "Musique",
    description: "Découvre la musique et les instruments",
    route: "/controle/music",
    icon: faMusic,
    bgColor: "bg-rose-100 dark:bg-rose-800",
    iconColor: "text-rose-600 dark:text-rose-300",
  },
  {
    id: 12,
    title: "Erreurs de révision",
    description: "Résultat de l'examen de fin d'étude",
    route: "/controle/revision-errors",
    icon: faExclamationTriangle,
    bgColor: "bg-red-200 dark:bg-red-800",
    iconColor: "text-red-600 dark:text-red-300",
  },
  {
    id: 13,
    title: "Lessons",
    description: "Apprendre les leçons",
    route: "/controle/lessons",
    icon: faBookOpen,
    bgColor: "bg-blue-100 dark:bg-blue-800",
    iconColor: "text-blue-600 dark:text-blue-300",
    isPremium: true,
  },
  {
    id: 14,
    title: "Eleve",
    description: "Accéder à votre profil",
    route: "/controle/eleve",
    icon: faUser,
    bgColor: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-300",
  },
  {
    id: 15,
    title: "Subscription",
    description: "Accéder à votre profil",
    route: "/controle/subscription",
    icon: faCreditCard,
    bgColor: "bg-blue-100 dark:bg-blue-800",
    iconColor: "text-blue-600 dark:text-blue-300",
  },
];

export default function ControlePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      // Vérifier toutes les sources possibles d'authentification
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      const userInfo = localStorage.getItem("userInfo");
      const user = localStorage.getItem("user");

      console.log("Vérification auth:", {
        token: token ? "Présent" : "Absent",
        userId: userId ? "Présent" : "Absent",
        userInfo: userInfo ? "Présent" : "Absent",
        user: user ? "Présent" : "Absent",
      });

      // Vérifier si l'utilisateur est connecté d'une manière ou d'une autre
      let isAuthenticated = false;

      // Méthode 1: Token et userId
      if (token && userId) {
        isAuthenticated = true;
      }

      // Méthode 2: userInfo contient un ID
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);

          if (parsedUserInfo && parsedUserInfo._id) {
            isAuthenticated = true;
          }
        } catch (e) {
          console.error("Erreur parsing userInfo:", e);
        }
      }

      // Méthode 3: user contient un ID
      if (user) {
        try {
          const parsedUser = JSON.parse(user);

          if (parsedUser && (parsedUser._id || parsedUser.id)) {
            isAuthenticated = true;
          }
        } catch (e) {
          console.error("Erreur parsing user:", e);
        }
      }

      if (!isAuthenticated) {
        console.log("Redirection vers login - Aucune authentification trouvée");
        router.push("/users/login");

        return;
      }

      setLoading(false);
      setMounted(true);
    };

    checkAuth();
  }, [router]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner color="primary" size="lg" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 p-4 rounded-lg text-red-700 max-w-md text-center">
          <p className="font-bold mb-2">⚠️ Erreur</p>
          <p>{error}</p>
        </div>
        <Button
          className="mt-4"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col items-center justify-center gap-6 py-4 sm:py-8 md:py-10">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6 relative">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 sm:mb-6"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
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
            <Link key={theme.id} className="block" href={theme.route}>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  isPressable
                  className={`w-full h-full min-h-[160px] ${theme.bgColor} flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:brightness-110`}
                >
                  <CardBody className="p-4 flex flex-col justify-center h-full text-center items-center">
                    <div className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon
                        className={theme.iconColor}
                        icon={theme.icon}
                      />
                      <h2 className="font-bold">{theme.title}</h2>
                    </div>
                    <p className="text-sm">{theme.description}</p>
                    <div className="mt-2">
                      {theme.isPremium ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
                          <FontAwesomeIcon className="mr-1" icon={faStar} />
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <FontAwesomeIcon className="mr-1" icon={faCheck} />
                          Gratuit
                        </span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

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
import axios from "axios";

import BackButton from "@/components/back";

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
  const [stats, setStats] = useState({
    totalEleves: 0,
    averageScore: "0",
    progression: "0",
    eleve: {
      nom: "",
      prenom: ""
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`);
        setStats(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
      }
    };

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
      let userData = null;

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
            userData = parsedUserInfo;
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
            userData = parsedUser;
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

      // Mettre à jour les informations de l'élève
      if (userData) {
        setStats(prevStats => ({
          ...prevStats,
          eleve: {
            nom: userData.nom || "",
            prenom: userData.prenom || ""
          }
        }));
      }

      setLoading(false);
      setMounted(true);
    };

    checkAuth();
    fetchStats();
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

  // Remplacer le tableau stats statique par les données dynamiques
  const statsCards = [
    {
      icon: faStar,
      label: "Moyenne Générale",
      value: `${stats.averageScore}/20`,
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
      value: stats.totalEleves.toString(),
      color: "text-green-500 dark:text-green-400",
    },
    {
      icon: faChartBar,
      label: "Progression",
      value: `${stats.progression}%`,
      color: "text-purple-500 dark:text-purple-400",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="self-start">
          <BackButton />
        </div>
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mt-4 animate-bounce">
          🌟 Bonjour {stats.eleve.prenom} ! 🌟
        </h1>
        <p className="text-xl text-center text-gray-600 dark:text-gray-300 mt-2">
          Bienvenue dans ton espace d&apos;apprentissage magique ! ✨
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseThemes.map((theme) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <Link href={theme.route}>
                <Card 
                  className={`cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl
                    ${theme.bgColor} border-2 border-opacity-50 dark:border-opacity-20`}
                >
                  <CardBody className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${theme.iconColor}`}>
                        <FontAwesomeIcon icon={theme.icon} className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                          {theme.title}
                          {theme.isPremium && (
                            <FontAwesomeIcon
                              icon={faStar}
                              className="ml-2 text-yellow-400"
                            />
                          )}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                          {theme.description}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

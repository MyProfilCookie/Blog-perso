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
} from "@fortawesome/free-solid-svg-icons";
import { Card, CardBody, Spinner, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";

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
  {
    id: 16,
    title: "Stats",
    description: "Accéder à vos statistiques",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-300",
    route: "/controle/stats",
    icon: faChartBar,
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
      prenom: "",
      modificationsCount: 0,
      lastModificationDate: "",
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("userToken");
        const userId =
          localStorage.getItem("userId") ||
          JSON.parse(localStorage.getItem("user") || "{}")._id;

        if (!token || !userId) throw new Error("Utilisateur non authentifié");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/eleves/stats/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        // Fusionner les données de l'API avec les données par défaut
        setStats({
          totalEleves: response.data.totalEleves || 0,
          averageScore: response.data.averageScore || "0",
          progression: response.data.progression || "0",
          eleve: response.data.eleve || {
            nom: "",
            prenom: "",
            modificationsCount: 0,
            lastModificationDate: "",
          },
        });
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        // Ne pas afficher d'erreur si les stats ne peuvent pas être récupérées
        // Les données du localStorage seront utilisées à la place
        console.log("Utilisation des données du localStorage comme fallback");
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
        console.log("Données utilisateur trouvées:", userData);
        setStats((prevStats) => ({
          ...prevStats,
          eleve: {
            nom: userData.nom || userData.lastName || "",
            prenom: userData.prenom || userData.firstName || userData.pseudo || "",
            modificationsCount: userData.modificationsCount || 0,
            lastModificationDate: userData.lastModificationDate || "",
          },
        }));
      } else {
        // S'assurer que eleve existe même si pas de userData
        setStats((prevStats) => ({
          ...prevStats,
          eleve: prevStats.eleve || {
            nom: "",
            prenom: "",
            modificationsCount: 0,
            lastModificationDate: "",
          },
        }));
      }

      setLoading(false);
      setMounted(true);
    };

    checkAuth();
    fetchStats();
  }, [router]);

  // Fonction pour vérifier si la modification est possible
  const canModifyProfile = () => {
    // Vérifier si stats.eleve existe
    if (!stats.eleve) {
      return true; // Si pas d'élève, permettre la modification
    }

    // Vérifier si lastModificationDate existe et est valide
    if (!stats.eleve.lastModificationDate) {
      return true; // Si pas de date, permettre la modification
    }

    try {
      const lastModification = new Date(stats.eleve.lastModificationDate);
      
      // Vérifier si la date est valide
      if (isNaN(lastModification.getTime())) {
        return true; // Si date invalide, permettre la modification
      }

      const currentDate = new Date();
      const monthDiff =
        (currentDate.getFullYear() - lastModification.getFullYear()) * 12 +
        (currentDate.getMonth() - lastModification.getMonth());

      return monthDiff >= 1 || (stats.eleve.modificationsCount || 0) < 3;
    } catch (error) {
      console.error("Erreur lors de la vérification de la date:", error);
      return true; // En cas d'erreur, permettre la modification
    }
  };

  // Fonction pour mettre à jour le profil
  const updateProfile = async (newData: any) => {
    if (!canModifyProfile()) {
      Swal.fire({
        title: "Limite atteinte",
        text: "Vous avez atteint la limite de 3 modifications par mois. Veuillez réessayer le mois prochain.",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return false;
    }

    try {
      const currentModificationsCount = stats.eleve?.modificationsCount || 0;
      
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          ...newData,
          modificationsCount: currentModificationsCount + 1,
          lastModificationDate: new Date().toISOString(),
        },
      );

      setStats((prevStats) => ({
        ...prevStats,
        eleve: {
          ...prevStats.eleve,
          ...newData,
          modificationsCount: (prevStats.eleve?.modificationsCount || 0) + 1,
          lastModificationDate: new Date().toISOString(),
        },
      }));

      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);

      return false;
    }
  };

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
      value: `${stats.averageScore || "0"}/20`,
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
      value: (stats.totalEleves || 0).toString(),
      color: "text-green-500 dark:text-green-400",
    },
    {
      icon: faChartBar,
      label: "Progression",
      value: `${stats.progression || "0"}%`,
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
          🌟 Bonjour {(() => {
            // Essayer d'abord stats.eleve.prenom
            if (stats.eleve?.prenom) {
              return stats.eleve.prenom;
            }
            
            // Fallback: récupérer depuis le localStorage
            try {
              const storedUser = localStorage.getItem("user");
              if (storedUser) {
                const userData = JSON.parse(storedUser);
                return userData.prenom || userData.firstName || userData.pseudo || "Élève";
              }
            } catch (e) {
              console.error("Erreur lors de la récupération du prénom depuis localStorage:", e);
            }
            
            return "Élève";
          })()} ! 🌟
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
              animate={{ opacity: 1, y: 0 }}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={theme.route}>
                <Card
                  className={`cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl
                    ${theme.bgColor} border-2 border-opacity-50 dark:border-opacity-20`}
                >
                  <CardBody className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${theme.iconColor}`}>
                        <FontAwesomeIcon
                          className="h-6 w-6"
                          icon={theme.icon}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                          {theme.title}
                          {theme.isPremium && (
                            <FontAwesomeIcon
                              className="ml-2 text-yellow-400"
                              icon={faStar}
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

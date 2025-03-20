/* eslint-disable no-console */
"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faNewspaper,
  faCrown,
  faTachometerAlt,
  faShoppingCart,
  faBars,
  faUser,
  faHome,
  faInfoCircle,
  faPhone,
  faUserGroup,
  faGraduationCap,
  faQuestionCircle,
  faMoon,
  faCode,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { AutismLogo } from "@/components/icons";

// Type definition for user
type User = {
  id: string;
  pseudo: string;
  email: string;
  avatar?: string;
  role: string;
  token?: string;
};

// Type pour les compteurs de commandes
type OrderCountType = {
  pending: number;
  shipped: number;
  total: number;
};

// Interface pour le type Order
interface Order {
  status: string;
  _id: string;
  createdAt: string;
  total?: number;
  totalAmount?: number;
  items?: any[];
  deliveryCost?: number;
  paymentMethod?: string;
  paymentStatus?: string;
}

// Function to get the appropriate icon for each navigation item
const getIconForNavItem = (label: string) => {
  const iconMap: Record<string, any> = {
    Accueil: faHome,
    "À propos": faInfoCircle,
    Contact: faPhone,
    Services: faInfoCircle,
    Équipe: faUserGroup,
    Blog: faNewspaper,
    Cours: faGraduationCap,
    FAQ: faQuestionCircle,
  };

  return iconMap[label] || faInfoCircle; // Default icon if no match
};

// Function to verify token validity
const verifyToken = async (token: string): Promise<boolean> => {
  if (!token) return false;

  try {
    const response = await fetch("/auth/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
      credentials: "include",
    });

    if (!response.ok) {
      console.warn("Token verification failed with status:", response.status);

      return false;
    }

    const data = await response.json();

    return data.valid === true;
  } catch (error) {
    console.error("Error verifying token:", error);

    return false;
  }
};

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [orderCount, setOrderCount] = useState<OrderCountType>({
    pending: 0,
    shipped: 0,
    total: 0,
  });
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderLoadError, setOrderLoadError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [avatarColorIndex, setAvatarColorIndex] = useState(0);

  // Colors for avatar animation
  const adminColors = ["#FF0000", "#FF3333", "#FF6666", "#FF9999"];
  const userColors = ["#0066FF", "#3399FF", "#66CCFF", "#99DDFF"];
  const guestColors = ["#000000", "#333333", "#666666", "#999999"];

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Pour le débogage
  useEffect(() => {
    console.log("API URL Configuration:");
    console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log(
      "API Base URL qui sera utilisée:",
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api").replace(
        /\/$/,
        "",
      ),
    );
  }, []);

  // Pour le suivi de l'état des compteurs
  useEffect(() => {
    console.log("État actuel des compteurs de commandes:", orderCount);
  }, [orderCount]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto theme updater based on time of day
  useEffect(() => {
    if (!mounted) return;

    const updateThemeByTime = () => {
      if (localStorage.getItem("themeMode") === "auto") {
        const currentHour = new Date().getHours();
        const isDayTime = currentHour >= 6 && currentHour < 18;

        if (isDayTime) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        }
      }
    };

    updateThemeByTime();
    const interval = setInterval(updateThemeByTime, 60000);

    return () => clearInterval(interval);
  }, [mounted]);

  // Avatar color animation
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setAvatarColorIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 1500);

    return () => clearInterval(colorInterval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  /**
   * Handle invalid token
   */
  const handleTokenInvalid = () => {
    if (isVerifyingToken) return;

    Swal.fire({
      title: "Session expirée",
      text: "Votre session a expiré. Veuillez vous reconnecter pour continuer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4169E1",
      cancelButtonColor: "#FFB74D",
      confirmButtonText: "Se connecter",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = user?.id;

        localStorage.removeItem("user");
        if (userId) {
          localStorage.removeItem(`cart_${userId}`);
        }
        setUser(null);
        setCartItemsCount(0);

        const event = new CustomEvent("userUpdate");

        window.dispatchEvent(event);

        router.push("/users/login");
      }
    });
  };

  /**
   * Check token validity
   */
  const checkTokenValidity = async () => {
    if (isVerifyingToken) return;

    setIsVerifyingToken(true);

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const token = parsedUser.token;

        if (!token) {
          console.warn("No token found in user data");
          setIsVerifyingToken(false);

          return;
        }

        const isValid = await verifyToken(token);

        if (!isValid) {
          handleTokenInvalid();
        }
      } catch (error) {
        console.error("Error checking token validity:", error);
      }
    }

    setIsVerifyingToken(false);
  };

  /**
   * Get user and cart from local storage
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);

        const userCart = localStorage.getItem(`cart_${parsedUser.id}`);

        if (userCart) {
          setCartItemsCount(JSON.parse(userCart).length);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Check token validity every 30 minutes
    const intervalId = setInterval(checkTokenValidity, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  console.log(
    "🔍 FRONTEND - NEXT_PUBLIC_API_URL:",
    process.env.NEXT_PUBLIC_API_URL,
  );

  /**
   * Update user and cart when a "userUpdate" event is triggered
   */
  useEffect(() => {
    const handleUserUpdate = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          setUser(parsedUser);

          const userCart = localStorage.getItem(`cart_${parsedUser.id}`);

          setCartItemsCount(userCart ? JSON.parse(userCart).length : 0);
        } catch (error) {
          console.error("Error parsing user data during update:", error);
        }
      } else {
        setUser(null);
        setCartItemsCount(0);
      }
    };

    window.addEventListener("userUpdate", handleUserUpdate);

    return () => {
      window.removeEventListener("userUpdate", handleUserUpdate);
    };
  }, []);

  /**
   * User logout
   */
  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté(e) et votre panier sera vidé.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4169E1",
      cancelButtonColor: "#FFB74D",
      confirmButtonText: "Oui, déconnectez-moi !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = user?.id;

        localStorage.removeItem("user");
        if (userId) {
          localStorage.removeItem(`cart_${userId}`);
        }
        setUser(null);
        setCartItemsCount(0);

        const event = new CustomEvent("userUpdate");

        window.dispatchEvent(event);

        Swal.fire({
          title: "Déconnexion réussie",
          text: "Vous avez été déconnecté(e).",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          router.push("/");
        });
      }
    });
  };

  /**
   * Redirect to login or signup page
   */
  const handleLoginRedirect = () => {
    Swal.fire({
      title: "Connectez-vous ou inscrivez-vous",
      text: "Vous devez être connecté(e) pour accéder à cette fonctionnalité.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Se connecter",
      cancelButtonText: "S'inscrire",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/users/login");
      } else {
        router.push("/users/signup");
      }
    });
  };

  /**
   * Fetch order count from API - VERSION CORRIGÉE
   */
  /**
   * Fonction robuste pour récupérer les données utilisateur et l'ID
   * Basée sur la version qui fonctionne dans votre page Orders
   */
  const getUserData = () => {
    if (typeof window === "undefined") return null;

    try {
      // Essayer toutes les sources possibles de token
      const userStr = localStorage.getItem("user");
      const directToken = localStorage.getItem("token");
      const userToken = localStorage.getItem("userToken");

      let userData = null;
      let token = directToken || userToken;

      // Analyser les données utilisateur si disponibles
      if (userStr) {
        try {
          userData = JSON.parse(userStr);
          // Si les données utilisateur ont un token, l'utiliser (priorité)
          if (userData.token) {
            token = userData.token;
          }
        } catch (e) {
          console.error("Erreur lors de l'analyse des données utilisateur:", e);
        }
      }

      // Si pas de données utilisateur mais nous avons un token, créer un objet utilisateur minimal
      if (!userData && token) {
        userData = { token };
      }

      // Si nous avons des données utilisateur mais pas de token, ajouter le token
      if (userData && !userData.token && token) {
        userData.token = token;
      }

      // Extraire l'ID utilisateur de diverses sources
      let userId = userData?.id || userData?._id || userData?.userId;

      // Essayer d'obtenir l'ID utilisateur du JWT si non trouvé dans les données utilisateur
      if (!userId && token && token.split(".").length === 3) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));

          userId = payload.id || payload.userId || payload.sub || payload._id;

          if (userId && userData) {
            userData.id = userId;
          }
        } catch (e) {
          console.error("Erreur lors de l'extraction de l'ID du JWT:", e);
        }
      }

      // S'assurer que l'ID est correctement attaché aux données utilisateur
      if (userId && userData) {
        userData.id = userId;
      }

      console.log(
        "Données utilisateur récupérées:",
        userData?.id ? "ID trouvé: " + userData.id : "ID non trouvé",
      );

      return userData;
    } catch (e) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        e,
      );

      return null;
    }
  };

  /**
   * Fetch order count from API - VERSION CORRIGÉE
   */
  const fetchOrderCount = async () => {
    setIsLoadingOrders(true);
    setOrderLoadError(null);

    try {
      // Récupération des données utilisateur
      const userData = getUserData();

      if (!userData || !userData.id || !userData.token) {
        console.error("Données utilisateur insuffisantes");
        setIsLoadingOrders(false);

        return;
      }

      const userId = userData.id;
      const token = userData.token;

      // Utiliser directement l'URL qui fonctionne
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      ).replace(/\/$/, "");
      const url = `${apiUrl}/orders/user/${userId}`;

      console.log("Récupération des commandes via:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Extraire les commandes selon le format de réponse
      let orders = [];

      if (data && Array.isArray(data)) {
        orders = data;
      } else if (data && data.orders && Array.isArray(data.orders)) {
        orders = data.orders;
      } else if (data && data.data && Array.isArray(data.data)) {
        orders = data.data;
      }

      // Calculer les compteurs
      const pending = orders.filter(
        (order: Order) =>
          order.status?.toLowerCase().includes("pend") ||
          order.status?.toLowerCase().includes("process") ||
          order.status?.toLowerCase().includes("valid") ||
          order.status?.toLowerCase().includes("cours") ||
          order.status?.toLowerCase().includes("enregistr"),
      ).length;

      const shipped = orders.filter(
        (order: Order) =>
          order.status?.toLowerCase().includes("ship") ||
          order.status?.toLowerCase().includes("exped") ||
          order.status?.toLowerCase().includes("livr"),
      ).length;

      setOrderCount({
        pending,
        shipped,
        total: orders.length,
      });

      console.log("Compteurs calculés:", {
        pending,
        shipped,
        total: orders.length,
      });
    } catch (error) {
      console.error("Exception lors de la récupération des compteurs:", error);
      setOrderLoadError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la récupération",
      );
    } finally {
      setIsLoadingOrders(false);
    }
  };

  /**
   * Mark order updates as read - VERSION CORRIGÉE
   */
  const markOrderUpdatesAsRead = async () => {
    try {
      const userData = getUserData();

      if (!userData || !userData.id || !userData.token) {
        console.error("Données utilisateur insuffisantes");

        return;
      }

      const userId = userData.id;
      const token = userData.token;

      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      ).replace(/\/$/, "");
      const url = `${apiUrl}/orders/user/${userId}/orders/updates/read`;

      console.log("Marquage des mises à jour comme lues via:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Mises à jour marquées comme lues avec succès");
        // Rafraîchir les compteurs après avoir marqué comme lus
        fetchOrderCount();
      } else {
        console.error(
          "Échec du marquage des mises à jour:",
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Erreur lors du marquage des mises à jour:", error);
    }
  };

  // Récupérer le compteur de commandes au chargement
  useEffect(() => {
    console.log("Configuration du suivi des commandes");

    // Utiliser la fonction robuste pour configurer le suivi des commandes
    const setupOrderTracking = () => {
      const userData = getUserData();

      if (!userData || !userData.id || !userData.token) {
        console.warn(
          "Données utilisateur insuffisantes pour le suivi des commandes",
        );

        return;
      }

      console.log(
        "Suivi des commandes configuré pour l'utilisateur:",
        userData.id,
      );

      // Récupération initiale
      fetchOrderCount();

      // Configurer l'intervalle pour rafraîchir le compteur de commandes
      const intervalId = setInterval(() => {
        console.log("Rafraîchissement automatique des compteurs de commandes");
        fetchOrderCount();
      }, 30000); // Vérifier toutes les 30 secondes

      // Rafraîchir également lors du focus sur la page
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          console.log("Focus sur l'onglet, rafraîchissement des compteurs");
          fetchOrderCount();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Nettoyer l'intervalle lorsque le composant est démonté
      return () => {
        clearInterval(intervalId);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    };

    setupOrderTracking();
  }, []); // Exécuter une fois au montage

  return (
    <NextUINavbar
      className="dark:bg-gray-900 bg-cream"
      maxWidth="xl"
      position="sticky"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {/* Logo */}
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <AutismLogo />
            <p className="font-bold text-blue-800 dark:text-white">AutiStudy</p>
          </NextLink>
        </NavbarBrand>

        {/* Bouton menu mobile */}
        <NavbarMenuToggle
          aria-label="Toggle navigation"
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </NavbarMenuToggle>

        {/* Conteneur pour centrer la navigation */}
        <div className="hidden lg:flex flex-grow justify-center">
          <div className="flex items-center">
            {/* Onglets visibles dans la barre de navigation */}
            <ul className="flex gap-4 items-center">
              {siteConfig.navItems.map((item) => (
                <NavbarItem key={item.label}>
                  <NextLink
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                    href={String(item.href)}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
              ))}

              <NavbarItem key="shop" className="relative">
                <NextLink
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500 flex items-center relative"
                  href="/shop"
                >
                  <FontAwesomeIcon className="mr-2" icon={faShoppingCart} />
                  Shop
                  {cartItemsCount > 0 && (
                    <Badge
                      color="danger"
                      content={cartItemsCount}
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                      }}
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </NextLink>
              </NavbarItem>
              <NavbarItem className="hidden lg:flex">
                <ThemeSwitch />
              </NavbarItem>
            </ul>
          </div>
        </div>

        {/* Menu burger pour mobile amélioré avec des icônes */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              animate={{ height: "auto", opacity: 1, y: 0, scale: 1 }}
              className="lg:hidden dark:bg-gray-900 bg-white w-full shadow-md absolute top-full left-0 z-20 max-h-[80vh] overflow-y-auto rounded-b-lg border-t border-gray-200 dark:border-gray-800"
              exit={{ height: 0, opacity: 0, y: -10, scale: 0.95 }}
              initial={{ height: 0, opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="p-4">
                {/* En-tête du menu */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-bold text-blue-700 dark:text-blue-400">
                    Navigation
                  </p>
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="18" x2="6" y1="6" y2="18" />
                      <line x1="6" x2="18" y1="6" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Sections principales */}
                <div className="grid gap-4">
                  {/* Navigation principale */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Pages principales
                    </h3>
                    <ul className="grid gap-1">
                      {siteConfig.navItems
                        .filter((item) =>
                          [
                            "Accueil",
                            "À propos",
                            "Services",
                            "Contact",
                          ].includes(item.label),
                        )
                        .map((item) => (
                          <li key={item.label}>
                            <NextLink
                              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                              href={String(item.href)}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <FontAwesomeIcon
                                className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                                icon={getIconForNavItem(item.label)}
                              />
                              {item.label}
                            </NextLink>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Sections secondaires */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Découvrir
                    </h3>
                    <ul className="grid gap-1">
                      {siteConfig.navItems
                        .filter((item) =>
                          ["Blog", "Équipe", "Cours", "FAQ"].includes(
                            item.label,
                          ),
                        )
                        .map((item) => (
                          <li key={item.label}>
                            <NextLink
                              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                              href={String(item.href)}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <FontAwesomeIcon
                                className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                                icon={getIconForNavItem(item.label)}
                              />
                              {item.label}
                            </NextLink>
                          </li>
                        ))}

                      {/* Shop avec badge */}
                      <li>
                        <NextLink
                          className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                          href="/shop"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FontAwesomeIcon
                            className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                            icon={faShoppingCart}
                          />
                          <span className="flex-1">Shop</span>
                          {cartItemsCount > 0 && (
                            <Badge color="danger">{cartItemsCount}</Badge>
                          )}
                        </NextLink>
                      </li>
                    </ul>
                  </div>

                  {/* Section utilisateur */}
                  {user && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Mon compte
                      </h3>
                      <ul className="grid gap-1">
                        <li>
                          <NextLink
                            className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                            href="/profile"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <FontAwesomeIcon
                              className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                              icon={faUser}
                            />
                            Profil
                          </NextLink>
                        </li>
                        <li>
                          <NextLink
                            className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                            href={
                              user.role === "admin"
                                ? "/admin/dashboard"
                                : "/dashboard"
                            }
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <FontAwesomeIcon
                              className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                              icon={
                                user.role === "admin"
                                  ? faCrown
                                  : faTachometerAlt
                              }
                            />
                            {user.role === "admin"
                              ? "Dashboard Admin"
                              : "Dashboard"}
                          </NextLink>
                        </li>
                        <li>
                          <button
                            className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                            role="menuitem"
                            type="button"
                            onClick={() => {
                              setIsMenuOpen(false);
                              markOrderUpdatesAsRead();
                              router.push("/orders");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setIsMenuOpen(false);
                                markOrderUpdatesAsRead();
                                router.push("/orders");
                              }
                            }}
                          >
                            <FontAwesomeIcon
                              className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                              icon={faNewspaper}
                            />
                            <span className="flex-1">Mes commandes</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">
                                {orderCount.pending || 0}
                              </span>
                              <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                                {orderCount.shipped || 0}
                              </span>
                            </div>
                          </button>
                        </li>
                        <li>
                          <button
                            className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                            onClick={() => {
                              setIsMenuOpen(false);
                              handleLogout();
                            }}
                          >
                            <FontAwesomeIcon
                              className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                              icon={faSignOutAlt}
                            />
                            Déconnexion
                          </button>
                        </li>

                        {/* Bouton de test de l'API */}
                        <li>
                          <button
                            className="w-full flex items-center px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
                            onClick={async () => {
                              try {
                                const apiUrl = (
                                  process.env.NEXT_PUBLIC_API_URL ||
                                  "http://localhost:3000/api"
                                ).replace(/\/$/, "");
                                // Utiliser la route correcte
                                const response = await fetch(
                                  `${apiUrl}/orders/users/${user.id}/order-counts`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${user.token || localStorage.getItem("token")}`,
                                    },
                                  },
                                );
                                const data = await response.json();

                                console.log("Test direct API:", data);
                                alert(JSON.stringify(data, null, 2));
                              } catch (e: unknown) {
                                console.error("Test échoué:", e);
                                alert(
                                  "Erreur: " +
                                    (e instanceof Error
                                      ? e.message
                                      : String(e)),
                                );
                              }
                            }}
                          >
                            <FontAwesomeIcon
                              className="mr-3 w-5"
                              icon={faCode}
                            />
                            Tester l&apos;API Commandes
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </NavbarContent>

      <NavbarContent className="sm:flex basis-1/5 sm:basis-full" justify="end">
        {/* Bouton de mode nuit visible en mobile et tablette mais caché en desktop */}
        <NavbarItem className="flex lg:hidden">
          <Dropdown>
            <DropdownTrigger>
              <button
                aria-label="Toggle theme"
                className="flex items-center gap-2 p-1.5 rounded-md bg-cream dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {mounted && (
                  <>
                    {document.documentElement.classList.contains("dark") ? (
                      <MoonFilledIcon className="text-blue-300" size={20} />
                    ) : (
                      <SunFilledIcon className="text-yellow-500" size={20} />
                    )}
                  </>
                )}
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Options de thème">
              <DropdownItem
                key="light"
                onClick={() => {
                  document.documentElement.classList.remove("dark");
                  localStorage.setItem("theme", "light");
                  localStorage.setItem("themeMode", "manual");
                  setAvatarColorIndex((prev) => prev);
                }}
              >
                <div className="flex items-center gap-2">
                  <SunFilledIcon className="text-yellow-500" size={16} />
                  <span>Mode clair</span>
                </div>
              </DropdownItem>
              <DropdownItem
                key="dark"
                onClick={() => {
                  document.documentElement.classList.add("dark");
                  localStorage.setItem("theme", "dark");
                  localStorage.setItem("themeMode", "manual");
                  setAvatarColorIndex((prev) => prev);
                }}
              >
                <div className="flex items-center gap-2">
                  <MoonFilledIcon className="text-blue-300" size={16} />
                  <span>Mode sombre</span>
                </div>
              </DropdownItem>
              <DropdownItem
                key="auto"
                onClick={() => {
                  localStorage.setItem("themeMode", "auto");
                  // Apply theme based on current time
                  const currentHour = new Date().getHours();
                  const isDayTime = currentHour >= 6 && currentHour < 18;

                  if (isDayTime) {
                    document.documentElement.classList.remove("dark");
                    localStorage.setItem("theme", "light");
                  } else {
                    document.documentElement.classList.add("dark");
                    localStorage.setItem("theme", "dark");
                  }
                  setAvatarColorIndex((prev) => prev);
                }}
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon className="text-gray-500" icon={faMoon} />
                  <span>Mode automatique</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        {/* Bouton de forçage de mise à jour des commandes */}
        {user && (
          <NavbarItem className="flex items-center">
            <button
              aria-label="Rafraîchir les compteurs"
              className="p-1 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={isLoadingOrders}
              onClick={fetchOrderCount}
            >
              <FontAwesomeIcon icon={faSyncAlt} spin={isLoadingOrders} />
            </button>
          </NavbarItem>
        )}

        {/* Debug pour les compteurs */}
        {user && process.env.NODE_ENV !== "production" && (
          <NavbarItem className="hidden md:flex">
            <div className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded mx-1">
              {isLoadingOrders
                ? "..."
                : `P:${orderCount.pending} S:${orderCount.shipped} T:${orderCount.total}`}
            </div>
          </NavbarItem>
        )}

        {user && (
          <NavbarItem className="hidden md:flex">
            <Button
              aria-label={
                user.role === "admin" ? "Dashboard Admin" : "Dashboard"
              }
              as={Link}
              className="text-sm font-normal text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
              href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
            >
              <FontAwesomeIcon
                className="mr-2"
                icon={user.role === "admin" ? faCrown : faTachometerAlt}
              />
              {user.role === "admin" ? "Dashboard Admin" : "Dashboard"}
            </Button>
          </NavbarItem>
        )}

        {!user ? (
          <Avatar
            isBordered
            showFallback
            aria-label="Connectez-vous pour accéder à votre profil"
            className="cursor-pointer text-tiny text-default-500 transition-colors duration-700"
            name="Invité"
            size="md"
            src="/assets/default-avatar.webp"
            style={{
              borderColor: guestColors[avatarColorIndex],
              borderWidth: "3px",
              boxShadow: `0 0 8px ${guestColors[avatarColorIndex]}`,
            }}
            onClick={handleLoginRedirect}
          />
        ) : (
          <>
            {/* For mobile view - direct click to profile */}
            <div className="md:hidden">
              <Avatar
                isBordered
                alt={`Avatar de ${user?.pseudo}`}
                className="transition-colors duration-700 cursor-pointer"
                size="sm"
                src={user?.avatar || "/assets/default-avatar.webp"}
                style={{
                  borderColor:
                    user?.role === "admin"
                      ? adminColors[avatarColorIndex]
                      : userColors[avatarColorIndex],
                  borderWidth: "3px",
                  boxShadow: `0 0 8px ${
                    user?.role === "admin"
                      ? adminColors[avatarColorIndex]
                      : userColors[avatarColorIndex]
                  }`,
                }}
                onClick={() => router.push("/profile")}
              />
            </div>

            {/* For desktop view - keep the dropdown */}
            <div className="hidden md:block">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    aria-label="Menu utilisateur"
                    className="bg-transparent relative"
                  >
                    <Avatar
                      isBordered
                      alt={`Avatar de ${user?.pseudo}`}
                      className="transition-colors duration-700"
                      size="sm"
                      src={user?.avatar || "/assets/default-avatar.webp"}
                      style={{
                        borderColor:
                          user?.role === "admin"
                            ? adminColors[avatarColorIndex]
                            : userColors[avatarColorIndex],
                        borderWidth: "3px",
                        boxShadow: `0 0 8px ${
                          user?.role === "admin"
                            ? adminColors[avatarColorIndex]
                            : userColors[avatarColorIndex]
                        }`,
                      }}
                    />
                    <span className="ml-2 hidden xl:inline dark:text-white">
                      {user?.pseudo || "Utilisateur"}
                    </span>

                    {/* Badge combiné pour les commandes */}
                    {(orderCount.pending > 0 || orderCount.shipped > 0) && (
                      <Badge
                        className="absolute -top-2 -right-2"
                        color="danger"
                      >
                        {orderCount.total}
                      </Badge>
                    )}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key="profile"
                    onClick={() => router.push("/profile")}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faUser} />
                    Profil
                  </DropdownItem>
                  <DropdownItem key="shop" onClick={() => router.push("/shop")}>
                    <FontAwesomeIcon className="mr-2" icon={faShoppingCart} />
                    Shop
                  </DropdownItem>
                  <DropdownItem
                    key="orders"
                    className="relative"
                    startContent={
                      <FontAwesomeIcon
                        className="text-blue-500"
                        icon={faNewspaper}
                      />
                    }
                    onClick={() => {
                      markOrderUpdatesAsRead();
                      router.push("/orders");
                    }}
                  >
                    <div className="flex flex-col w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <div>Mes commandes en cours</div>
                        <span className="text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">
                          {orderCount.pending || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>Mes commandes envoyées</div>
                        <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                          {orderCount.shipped || 0}
                        </span>
                      </div>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="controle"
                    onClick={() => router.push("/controle")}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faNewspaper} />
                    Controle
                  </DropdownItem>

                  {/* Bouton de test API */}
                  <DropdownItem
                    key="test-api"
                    onClick={async () => {
                      try {
                        const apiUrl = (
                          process.env.NEXT_PUBLIC_API_URL ||
                          "http://localhost:3000/api"
                        ).replace(/\/$/, "");
                        const response = await fetch(
                          `${apiUrl}/orders/users/${user.id}/order-counts`,
                          {
                            headers: {
                              Authorization: `Bearer ${user.token || localStorage.getItem("token")}`,
                            },
                          },
                        );
                        const data = await response.json();

                        console.log("Test direct API:", data);
                        alert(JSON.stringify(data, null, 2));
                      } catch (e: unknown) {
                        console.error("Test échoué:", e);
                        alert(
                          "Erreur: " +
                            (e instanceof Error ? e.message : String(e)),
                        );
                      }
                    }}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faCode} />
                    Tester l&apos;API
                  </DropdownItem>

                  {/* Bouton rafraîchir les commandes */}
                  <DropdownItem key="refresh-orders" onClick={fetchOrderCount}>
                    <FontAwesomeIcon
                      className="mr-2"
                      icon={faSyncAlt}
                      spin={isLoadingOrders}
                    />
                    {isLoadingOrders
                      ? "Actualisation..."
                      : "Actualiser commandes"}
                  </DropdownItem>

                  {/* mode */}
                  <DropdownItem key="theme">
                    <Dropdown placement="left-start">
                      <DropdownTrigger>
                        <div className="flex items-center w-full cursor-pointer">
                          <FontAwesomeIcon className="mr-2" icon={faMoon} />
                          Thème
                        </div>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Options de thème">
                        <DropdownItem
                          key="light"
                          onClick={() => {
                            document.documentElement.classList.remove("dark");
                            localStorage.setItem("theme", "light");
                            localStorage.setItem("themeMode", "manual");
                            setAvatarColorIndex((prev) => prev);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <SunFilledIcon
                              className="text-yellow-500"
                              size={16}
                            />
                            <span>Mode clair</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          key="dark"
                          onClick={() => {
                            document.documentElement.classList.add("dark");
                            localStorage.setItem("theme", "dark");
                            localStorage.setItem("themeMode", "manual");
                            setAvatarColorIndex((prev) => prev);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <MoonFilledIcon
                              className="text-blue-300"
                              size={16}
                            />
                            <span>Mode sombre</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          key="auto"
                          onClick={() => {
                            localStorage.setItem("themeMode", "auto");
                            // Apply theme based on current time
                            const currentHour = new Date().getHours();
                            const isDayTime =
                              currentHour >= 6 && currentHour < 18;

                            if (isDayTime) {
                              document.documentElement.classList.remove("dark");
                              localStorage.setItem("theme", "light");
                            } else {
                              document.documentElement.classList.add("dark");
                              localStorage.setItem("theme", "dark");
                            }
                            setAvatarColorIndex((prev) => prev);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              className="text-gray-500"
                              icon={faMoon}
                            />
                            <span>Mode automatique</span>
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </DropdownItem>
                  <DropdownItem key="logout" onClick={handleLogout}>
                    <FontAwesomeIcon className="mr-2" icon={faSignOutAlt} />
                    Déconnexion
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </>
        )}

        {/* Bouton de test API dans la barre de navigation */}
        {user && (
          <button
            className="ml-2 p-2 bg-blue-500 text-white text-xs rounded"
            onClick={async () => {
              try {
                const userData = getUserData();

                if (!userData || !userData.id || !userData.token) {
                  alert("Données utilisateur insuffisantes");

                  return;
                }

                // Construction de l'URL de base
                const apiBaseUrl =
                  process.env.NEXT_PUBLIC_API_URL ||
                  "http://localhost:3000/api";
                const cleanApiUrl = apiBaseUrl.replace(/\/+$/, "");
                const baseUrl = cleanApiUrl.endsWith("/api")
                  ? cleanApiUrl.substring(0, cleanApiUrl.length - 4)
                  : cleanApiUrl;

                // Créer un élément de diagnostic
                const diagDiv = document.createElement("div");

                diagDiv.style.position = "fixed";
                diagDiv.style.top = "50%";
                diagDiv.style.left = "50%";
                diagDiv.style.transform = "translate(-50%, -50%)";
                diagDiv.style.background = "white";
                diagDiv.style.padding = "20px";
                diagDiv.style.border = "1px solid #ccc";
                diagDiv.style.borderRadius = "8px";
                diagDiv.style.zIndex = "9999";
                diagDiv.style.maxHeight = "80vh";
                diagDiv.style.maxWidth = "90vw";
                diagDiv.style.overflow = "auto";
                diagDiv.innerHTML = "<h3>Test d'URLs API</h3>";

                document.body.appendChild(diagDiv);

                // Tester toutes les URLs possibles
                const urlFormats = [
                  `${cleanApiUrl}/orders/users/${userData.id}/order-counts`,
                  `${baseUrl}/orders/users/${userData.id}/order-counts`,
                  `${cleanApiUrl}/orders/user/${userData.id}/order-counts`,
                  `${baseUrl}/orders/user/${userData.id}/order-counts`,
                  `${cleanApiUrl}/users/${userData.id}/order-counts`,
                  `${baseUrl}/users/${userData.id}/order-counts`,
                  `${cleanApiUrl}/orders/users/${userData.id}/counts`,
                  `${baseUrl}/orders/users/${userData.id}/counts`,
                ];

                for (const url of urlFormats) {
                  try {
                    diagDiv.innerHTML += `<p>Test URL: ${url}... </p>`;

                    const response = await fetch(url, {
                      headers: {
                        Authorization: `Bearer ${userData.token}`,
                      },
                    });

                    if (response.ok) {
                      const data = await response.json();

                      diagDiv.innerHTML += `<p style="color:green">✅ SUCCÈS (${response.status})</p>`;
                      diagDiv.innerHTML += `<pre style="background:#f5f5f5;padding:10px">${JSON.stringify(data, null, 2)}</pre>`;
                    } else {
                      diagDiv.innerHTML += `<p style="color:red">❌ ÉCHEC (${response.status})</p>`;
                    }
                  } catch (e: unknown) {
                    diagDiv.innerHTML += `<p style="color:red">⚠️ ERREUR: ${e instanceof Error ? e.message : String(e)}</p>`;
                  }
                }
                diagDiv.innerHTML += `<button id="close-diag" style="margin-top:10px;padding:8px 16px;background:#f44336;color:white;border:none;border-radius:4px">Fermer</button>`;
                const closeButton = document.getElementById("close-diag");

                if (closeButton) {
                  closeButton.addEventListener("click", () => {
                    document.body.removeChild(diagDiv);
                  });
                }
              } catch (e: unknown) {
                console.error("Test échoué:", e);
                alert(
                  "Erreur: " + (e instanceof Error ? e.message : String(e)),
                );
              }
            }}
          >
            Test complet API
          </button>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};

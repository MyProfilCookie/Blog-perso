/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
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
  processing: number;
  delivered: number;
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
    processing: 0,
    delivered: 0,
    total: 0
  });
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [avatarColorIndex, setAvatarColorIndex] = useState(0);

  // Colors for avatar animation
  const adminColors = ["#FF0000", "#FF3333", "#FF6666", "#FF9999"];
  const userColors = ["#0066FF", "#3399FF", "#66CCFF", "#99DDFF"];
  const guestColors = ["#000000", "#333333", "#666666", "#999999"];

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
  console.log("🔍 FRONTEND - NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

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
   * Fetch order count from API
   */
  /**
 * Récupérer le compteur de commandes depuis l'API
 */

// Fonction complètement réécrite pour la récupération des compteurs
const fetchOrderCount = async () => {
  if (!user || !user.id) {
    console.log("Pas d'utilisateur ou d'ID utilisateur, impossible de récupérer les commandes");
    return;
  }
  
  if (isLoadingOrders) {
    console.log("Récupération des commandes déjà en cours");
    return;
  }
  
  setIsLoadingOrders(true);
  console.log("Début de la récupération des compteurs de commandes");
  
  try {
    // 1. Récupérer le token de toutes les sources possibles
    const token = user.token || localStorage.getItem("token") || localStorage.getItem("userToken");
    if (!token) {
      console.error("Pas de token disponible pour l'authentification");
      return;
    }
    
    // 2. Construire l'URL proprement
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    apiUrl = apiUrl.replace(/\/$/, ""); // Supprimer le slash final s'il existe
    const endpoint = `/orders/users/${user.id}/order-counts`;
    const fullUrl = `${apiUrl}${endpoint}`;
    
    console.log("Récupération des compteurs depuis:", fullUrl);
    
    // 3. Faire la requête avec un timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout
    
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache, no-store"
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // 4. Traiter la réponse
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log("Réponse brute:", responseText);
    
    // 5. Analyser la réponse JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Erreur lors de l'analyse JSON:", e);
      console.error("Texte brut reçu:", responseText);
      throw new Error("Format de réponse invalide");
    }
    
    console.log("Données reçues:", data);
    
    // 6. Mettre à jour l'état avec les nouvelles données
    if (data.success && data.counts) {
      console.log("Mise à jour des compteurs avec:", data.counts);
      // Forcer React à reconnaître le changement d'état avec un nouvel objet
      setOrderCount({
        pending: data.counts.pending || 0,
        shipped: data.counts.shipped || 0,
        total: data.counts.total || 0,
        processing: data.counts.processing || 0,
        delivered: data.counts.delivered || 0
      });
    } else if (Array.isArray(data)) {
      console.log("Format ancien (tableau), calcul manuel des compteurs");
      const orders = data;
      const counts = {
        pending: orders.filter(order => 
          order.status?.toLowerCase().includes('pend') || 
          order.status?.toLowerCase().includes('attente')
        ).length,
        shipped: orders.filter(order => 
          order.status?.toLowerCase().includes('ship') || 
          order.status?.toLowerCase().includes('livr')
        ).length,
        total: orders.length
      };
      console.log("Compteurs calculés:", counts);
      // Ajouter les propriétés manquantes pour correspondre à OrderCountType
      setOrderCount({
        ...counts,
        processing: 0,
        delivered: 0,
      });
    } else {
      console.warn("Format de réponse inattendu:", data);
    }
  } catch (error) {
    console.error("Exception lors de la récupération des compteurs:", error);
  } finally {
    console.log("Fin de la récupération des compteurs");
    setIsLoadingOrders(false);
  }
};

// Dans le useEffect, forcez une re-récupération
useEffect(() => {
  if (user && user.id) {
    console.log("Configuration de la récupération des compteurs pour l'utilisateur:", user.id);
    
    // Récupération immédiate
    fetchOrderCount();
    
    // Récupération périodique
    const intervalId = setInterval(() => {
      console.log("Actualisation périodique des compteurs de commandes");
      fetchOrderCount();
    }, 30000); // Toutes les 30 secondes
    
    // Forcer une réactualisation lors du focus sur l'onglet
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Onglet visible, actualisation des compteurs");
        fetchOrderCount();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }
}, [user]);

useEffect(() => {
  console.log("Configuration de l'URL API:");
  console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("URL de base API qui sera utilisée:", (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api").replace(/\/$/, ""));
  console.log("Utilisateur actuel:", user);
}, [user]);
/**
 * Marquer les mises à jour des commandes comme lues
 */
const markOrderUpdatesAsRead = async () => {
  if (!user || !user.id) return;
  
  try {
    const token = user.token || localStorage.getItem("token") || localStorage.getItem("userToken");
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api").replace(/\/$/, "");
    
    const url = `${apiUrl}/orders/users/${user.id}/orders/updates/read`;
    console.log("URL pour marquer les mises à jour comme lues:", url);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      console.log("Mises à jour des commandes marquées comme lues avec succès");
      // Rafraîchir les compteurs après avoir marqué comme lus
      fetchOrderCount();
    } else {
      console.error("Échec du marquage des mises à jour comme lues:", response.status, response.statusText);
      // Tenter d'obtenir plus d'informations sur l'erreur
      try {
        const errorData = await response.json();
        console.error("Détails de l'erreur:", errorData);
      } catch (e) {
        // Si nous ne pouvons pas analyser la réponse, on continue silencieusement
      }
    }
  } catch (error) {
    console.error("Erreur lors du marquage des mises à jour comme lues:", error);
  }
};

// Récupérer le compteur de commandes lorsque l'utilisateur est chargé ou change
useEffect(() => {
  if (user && user.id) {
    // Vérifier si un token valide est disponible
    const token = user.token || localStorage.getItem("token") || localStorage.getItem("userToken");
    if (!token) {
      console.warn("Aucun token d'authentification disponible - récupération des commandes ignorée");
      return;
    }
    
    console.log("Initialisation du suivi des commandes pour l'utilisateur:", user.id);
    
    // Récupération initiale
    fetchOrderCount();
    
    // Configurer l'intervalle pour rafraîchir le compteur de commandes
    const intervalId = setInterval(() => {
      console.log("Rafraîchissement automatique des compteurs de commandes");
      fetchOrderCount();
    }, 60000); // Vérifier toutes les minutes
    
    // Nettoyer l'intervalle lorsque le composant est démonté ou l'utilisateur change
    return () => {
      console.log("Nettoyage de l'intervalle de rafraîchissement des commandes");
      clearInterval(intervalId);
    }
  }
}, [user]);

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
                              if (e.key === 'Enter' || e.key === ' ') {
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
                             {/* Commandes pending */}
                             <span className="text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">
                              {orderCount.pending || 0}
                             </span>
                             {/* Commandes Processing */}
                             <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                              {orderCount.processing || 0}
                              </span>
                              {/* Commandes Shipped */}
                              <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                              {orderCount.shipped || 0}
                              </span>
                              {/* Commandes Delivered */}
                              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                              {orderCount.delivered || 0}
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
          // Replace the entire Dropdown component with this conditional rendering
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
                  boxShadow: `0 0 8px ${user?.role === "admin"
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
                        boxShadow: `0 0 8px ${user?.role === "admin"
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
                  <DropdownItem key={""} onClick={() => router.push("/profile")}>
                    <FontAwesomeIcon className="mr-2" icon={faUser} />
                    Profil
                  </DropdownItem>
                  <DropdownItem key={""} onClick={() => router.push("/shop")}>
                    <FontAwesomeIcon className="mr-2" icon={faShoppingCart} />
                    Shop
                  </DropdownItem>
                  <DropdownItem
                    key="orders"
                    className="relative"
                    startContent={<FontAwesomeIcon className="text-blue-500" icon={faNewspaper} />}
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
                  <DropdownItem key={""} onClick={() => router.push("/controle")}>
                    <FontAwesomeIcon className="mr-2" icon={faNewspaper} />
                    Controle
                  </DropdownItem>
                  {/* mode */}
                  <DropdownItem key={""}>
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
                  <DropdownItem key={""} onClick={handleLogout}>
                    <FontAwesomeIcon className="mr-2" icon={faSignOutAlt} />
                    Déconnexion
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};

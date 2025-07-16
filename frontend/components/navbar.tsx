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
  faBars,
  faUser,
  faMoon,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

import { 
  SunFilledIcon, 
  MoonFilledIcon, 
  AutismLogo, 
  AutiStudyMenuIcon,
  AutiStudyBurgerIcon,
  SimpleAutiStudyBurgerIcon,
  PuzzleBurgerIcon,
  VisibleBurgerIcon,
  PendingOrdersIcon,
  ShippedOrdersIcon,
  DeliveredOrdersIcon,
  CloseMenuIcon
} from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";

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
  delivered: number;
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
    Accueil: "🏠",
    "À propos": "ℹ️",
    Services: "⚡",
    Équipe: "👥",
    Articles: "📚",
    Cours: "🎓",
    FAQ: "❓",
    Controle: "🎮",
    Manuel: "📖",
  };

  return iconMap[label] || "ℹ️"; // Default icon if no match
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
    delivered: 0,
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
      // Vérifier si le clic est sur le bouton du menu
      const target = event.target as HTMLElement;
      const isMenuButton = target.closest('button[aria-label="Toggle navigation"]');
      
      if (menuRef.current && !menuRef.current.contains(target) && !isMenuButton) {
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

  // Close menu when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    // Écouter les changements de route
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

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
        localStorage.removeItem("userToken");
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
   * Check token validity - DÉSACTIVÉ pour éviter les déconnexions automatiques
   */
  const checkTokenValidity = async () => {
    // Fonction désactivée pour éviter les déconnexions lors du rafraîchissement
    // La vérification du token se fera uniquement lors des requêtes API
    return;
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

        setCartItemsCount(userCart ? JSON.parse(userCart).length : 0);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Vérification automatique du token désactivée pour éviter les déconnexions
    // lors du rafraîchissement de la page
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

          // Mettre à jour les compteurs de commandes immédiatement après la connexion
          fetchOrderCount();
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
        // Nettoyer toutes les données du localStorage
        const userId = user?.id;
        
        // Supprimer toutes les données liées à l'utilisateur
        localStorage.removeItem("user");
        localStorage.removeItem("userToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("serInfo");
        localStorage.removeItem("token");
        
        // Supprimer les données du panier
        if (userId) {
          localStorage.removeItem(`cart_${userId}`);
        }
        
        // Réinitialiser l'état
        setUser(null);
        setCartItemsCount(0);
        setOrderCount({
          pending: 0,
          shipped: 0,
          delivered: 0,
          total: 0
        });

        // Notifier les autres composants
        const event = new CustomEvent("userUpdate");
        window.dispatchEvent(event);

        // Forcer le rechargement de la page pour s'assurer que tout est nettoyé
        window.location.href = "/";
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

      const delivered = orders.filter(
        (order: Order) =>
          order.status?.toLowerCase().includes("livr") ||
          order.status?.toLowerCase().includes("deliv"),
      ).length;

      setOrderCount({
        pending,
        shipped,
        delivered,
        total: orders.length,
      });

      console.log("Compteurs calculés:", {
        pending,
        shipped,
        delivered,
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
    let intervalId: NodeJS.Timeout | null = null;

    const setupOrderTracking = () => {
      const userData = getUserData();

      if (!userData || !userData.id || !userData.token) {
        console.warn(
          "Données utilisateur insuffisantes pour le suivi des commandes",
        );
        return;
      }

      // Récupération initiale
      fetchOrderCount();

      // Configurer l'intervalle pour rafraîchir le compteur de commandes
      intervalId = setInterval(() => {
        const currentUserData = getUserData();
        if (!currentUserData || !currentUserData.id || !currentUserData.token) {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          return;
        }
        fetchOrderCount();
      }, 15000); // Vérifier toutes les 15 secondes

      // Rafraîchir également lors du focus sur la page
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          const currentUserData = getUserData();
          if (!currentUserData || !currentUserData.id || !currentUserData.token) {
            return;
          }
          fetchOrderCount();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Nettoyer l'intervalle lorsque le composant est démonté
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    };

    const cleanup = setupOrderTracking();

    // Nettoyer lors du démontage
    return () => {
      if (cleanup) cleanup();
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, []); // Exécuter une fois au montage

  // Vérifier la validité du token toutes les 5 minutes
  useEffect(() => {
    let tokenCheckInterval: NodeJS.Timeout | null = null;

    const setupTokenCheck = () => {
      const userData = getUserData();
      if (!userData || !userData.token) {
        return;
      }

      tokenCheckInterval = setInterval(() => {
        const currentUserData = getUserData();
        if (!currentUserData || !currentUserData.token) {
          if (tokenCheckInterval) {
            clearInterval(tokenCheckInterval);
            tokenCheckInterval = null;
          }
          return;
        }
        checkTokenValidity();
      }, 5 * 60 * 1000); // 5 minutes
    };

    setupTokenCheck();

    return () => {
      if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval);
        tokenCheckInterval = null;
      }
    };
  }, []);

  // Vérification du token au chargement et périodiquement
  useEffect(() => {
    let tokenCheckInterval: NodeJS.Timeout | null = null;

    const checkTokenValidity = async () => {
      const userData = getUserData();
      if (!userData || !userData.token) {
        return;
      }

      try {
        // Vérifier si le token est expiré
        const isExpired = isTokenExpired(userData.token);
        
        if (isExpired) {
          // Nettoyer les données utilisateur
          const userId = user?.id;
          localStorage.removeItem("user");
          localStorage.removeItem("userToken");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("serInfo");
          localStorage.removeItem("token");
          if (userId) {
            localStorage.removeItem(`cart_${userId}`);
          }
          setUser(null);
          setCartItemsCount(0);

          // Notifier les autres composants
          const event = new CustomEvent("userUpdate");
          window.dispatchEvent(event);

          // Afficher une alerte à l'utilisateur
          Swal.fire({
            title: "Session expirée",
            text: "Votre session a expiré. Veuillez vous reconnecter pour continuer.",
            icon: "warning",
            confirmButtonColor: "#4169E1",
            confirmButtonText: "Se connecter",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/users/login");
            }
          });
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du token:", error);
      }
    };

    // Fonction pour vérifier si le token est expiré
    const isTokenExpired = (token: string): boolean => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        
        // Vérifier si le token a une date d'expiration
        if (!payload.exp) return true;
        
        // Comparer la date d'expiration avec la date actuelle
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
      } catch (error) {
        console.error("Erreur lors de la vérification du token:", error);
        return true; // En cas d'erreur, considérer le token comme expiré
      }
    };

    // Vérifier au chargement
    checkTokenValidity();

    // Vérifier périodiquement
    tokenCheckInterval = setInterval(() => {
      const userData = getUserData();
      if (!userData || !userData.token) {
        if (tokenCheckInterval) {
          clearInterval(tokenCheckInterval);
          tokenCheckInterval = null;
        }
        return;
      }
      checkTokenValidity();
    }, 5 * 60 * 1000); // Toutes les 5 minutes
    
    return () => {
      if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval);
        tokenCheckInterval = null;
      }
    };
  }, [router, user]);

  return (
    <NextUINavbar
      className="dark:bg-gray-900 bg-white/70 backdrop-blur-sm font-sans"
      maxWidth="xl"
      position="sticky"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {/* Logo */}
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <AutismLogo />
            <p className="font-bold text-blue-800 dark:text-white font-sans">
              AutiStudy
            </p>
          </NextLink>
        </NavbarBrand>

        {/* Bouton menu mobile avec icône burger visible */}
        <button
          aria-label="Toggle navigation"
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <VisibleBurgerIcon 
            size={24} 
            className={`text-blue-800 dark:text-white hover:text-blue-500 transition-colors duration-200 ${
              isMenuOpen ? 'rotate-90' : ''
            }`}
          />
        </button>

        {/* Conteneur pour centrer la navigation */}
        <div className="hidden lg:flex flex-grow justify-center">
          <div className="flex items-center">
            {/* Onglets visibles dans la barre de navigation */}
            <ul className="flex gap-4 items-center font-sans">
              <NavbarItem>
                <NextLink
                  className="text-blue-800 dark:text-white hover:text-blue-500 text-lg font-medium tracking-wide"
                  href="/"
                >
                  Accueil
                </NextLink>
              </NavbarItem>
              <NavbarItem>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="text-blue-800 dark:text-white hover:text-blue-500 bg-transparent p-0 text-lg font-medium tracking-wide"
                      radius="sm"
                      variant="light"
                    >
                      À propos
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="À propos menu"
                    className="animate-in fade-in-80 zoom-in-95 duration-200"
                  >
                    <DropdownItem
                      key="about"
                      textValue="À propos de nous"
                      onClick={() => router.push("/about")}
                    >
                      À propos de nous
                    </DropdownItem>
                    <DropdownItem
                      key="contact"
                      textValue="Contact"
                      onClick={() => router.push("/contact")}
                    >
                      Contact
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
              <NavbarItem>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="text-blue-800 dark:text-white hover:text-blue-500 bg-transparent p-0 text-lg font-medium tracking-wide"
                      radius="sm"
                      variant="light"
                      onClick={() => router.push("/articles")}
                    >
                      Articles
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Articles menu"
                    className="animate-in fade-in-80 zoom-in-95 duration-200"
                  >
                    <DropdownItem
                      key="blog"
                      textValue="Blog"
                      onClick={() => router.push("/blog")}
                    >
                      Blog
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
              <NavbarItem>
                <NextLink
                  className="text-blue-800 dark:text-white hover:text-blue-500 text-lg font-medium tracking-wide"
                  href="/controle"
                >
                  Controle
                </NextLink>
              </NavbarItem>

              <NavbarItem key="shop" className="relative">
                <NextLink
                  className="text-blue-800 dark:text-white hover:text-blue-500 flex items-center relative text-lg font-medium tracking-wide"
                  href="/shop"
                >
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
              className="lg:hidden dark:bg-gray-900 bg-white w-full shadow-lg absolute top-full left-0 z-20 max-h-[80vh] overflow-y-auto rounded-b-lg border-t border-gray-200 dark:border-gray-700"
              exit={{ height: 0, opacity: 0, y: -10, scale: 0.95 }}
              initial={{ height: 0, opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="p-4 space-y-4">
                {/* En-tête du menu */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-gray-200 dark:border-gray-700">
                  <p className="font-bold text-lg text-blue-700 dark:text-blue-400">
                    Navigation
                  </p>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CloseMenuIcon 
                      size={24} 
                      className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    />
                  </button>
                </div>

                {/* Section utilisateur */}
                {user && (
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300 px-2">
                      Mon compte
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                      <NextLink
                        className="block w-full"
                        href="/orders"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50/30 dark:hover:bg-yellow-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                            <div className="flex items-center gap-3">
                              <PendingOrdersIcon 
                                size={28} 
                                className="text-yellow-600 dark:text-yellow-400"
                              />
                              <div className="flex flex-col">
                                <div className="font-medium text-yellow-600 dark:text-yellow-400">
                                  En cours
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Commandes en traitement
                                </div>
                              </div>
                            </div>
                            <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 min-w-[2rem] text-center">
                              {orderCount.pending || 0}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                            <div className="flex items-center gap-3">
                              <ShippedOrdersIcon 
                                size={28} 
                                className="text-blue-600 dark:text-blue-400"
                              />
                              <div className="flex flex-col">
                                <div className="font-medium text-blue-600 dark:text-blue-400">
                                  Envoyées
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  En cours de livraison
                                </div>
                              </div>
                            </div>
                            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400 min-w-[2rem] text-center">
                              {orderCount.shipped || 0}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-green-200 dark:border-green-800 hover:bg-green-50/30 dark:hover:bg-green-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                            <div className="flex items-center gap-3">
                              <DeliveredOrdersIcon 
                                size={28} 
                                className="text-green-600 dark:text-green-400"
                              />
                              <div className="flex flex-col">
                                <div className="font-medium text-green-600 dark:text-green-400">
                                  Livrées
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Commandes terminées
                                </div>
                              </div>
                            </div>
                            <span className="text-lg font-semibold text-green-600 dark:text-green-400 min-w-[2rem] text-center">
                              {orderCount.delivered || 0}
                            </span>
                          </div>
                        </div>
                      </NextLink>

                      {/* Dashboard */}
                      <NextLink
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
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
                            user.role === "admin" ? faCrown : faTachometerAlt
                          }
                        />
                        <span className="font-medium">
                          {user.role === "admin"
                            ? "Dashboard Admin"
                            : "Dashboard"}
                        </span>
                      </NextLink>

                      {/* Contrôle */}
                      <NextLink
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        href="/controle"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FontAwesomeIcon
                          className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                          icon={faNewspaper}
                        />
                        <span className="font-medium">Contrôle</span>
                      </NextLink>

                      {/* Déconnexion */}
                      <button
                        className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        <FontAwesomeIcon
                          className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                          icon={faSignOutAlt}
                        />
                        <span className="font-medium">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </NavbarContent>

      <NavbarContent className="sm:flex basis-1/5 sm:basis-full" justify="end">
        {/* Bouton de mode nuit visible en mobile et tablette mais caché en desktop */}
        <NavbarItem className="flex lg:hidden">
          <ThemeSwitch />
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
                  <DropdownItem
                    key="orders-title"
                    showDivider
                    className="font-medium"
                    textValue="Mes commandes"
                  >
                    Mes commandes
                  </DropdownItem>

                  <DropdownItem
                    key="orders-pending"
                    className="relative"
                    onClick={() => {
                      router.push("/orders?status=pending");
                    }}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50/30 dark:hover:bg-yellow-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">⏳</span>
                        <div className="flex flex-col">
                          <div className="font-medium text-yellow-600 dark:text-yellow-400">
                            En cours
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Commandes en traitement
                          </div>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 min-w-[2rem] text-center">
                        {orderCount.pending || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    key="orders-shipped"
                    className="relative"
                    onClick={() => {
                      router.push("/orders?status=shipped");
                    }}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🚚</span>
                        <div className="flex flex-col">
                          <div className="font-medium text-blue-600 dark:text-blue-400">
                            Envoyées
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            En cours de livraison
                          </div>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-blue-600 dark:text-blue-400 min-w-[2rem] text-center">
                        {orderCount.shipped || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    key="orders-delivered"
                    className="relative"
                    onClick={() => {
                      router.push("/orders?status=delivered");
                    }}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50/30 dark:hover:bg-green-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">✅</span>
                        <div className="flex flex-col">
                          <div className="font-medium text-green-600 dark:text-green-400">
                            Livrées
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Commandes terminées
                          </div>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400 min-w-[2rem] text-center">
                        {orderCount.delivered || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    key="orders-all"
                    showDivider
                    className="relative"
                    onClick={() => {
                      router.push("/orders");
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Voir toutes mes commandes</span>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {orderCount.total || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    key="controle"
                    onClick={() => router.push("/controle")}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faNewspaper} />
                    Controle
                  </DropdownItem>

                  {/* mode */}
                  <DropdownItem key="theme" textValue="Thème">
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
                          textValue="Mode clair"
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
                          textValue="Mode sombre"
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
                          textValue="Mode automatique"
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
      </NavbarContent>
    </NextUINavbar>
  );
};

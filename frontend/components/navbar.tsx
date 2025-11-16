/* eslint-disable no-console */
"use client";
import React, { useState, useEffect, useContext } from "react";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Dropdown } from "@nextui-org/react";
import { DropdownTrigger } from "@nextui-org/react";
import { DropdownMenu } from "@nextui-org/react";
import { DropdownItem } from "@nextui-org/react";
import { Badge } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faUser,
  faMoon,
  faInfoCircle,
  faBook,
  faGamepad,
  faShoppingCart,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import Swal from "sweetalert2";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { UserContext } from "@/context/UserContext";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";

import {
  SunFilledIcon,
  MoonFilledIcon,
  AutismLogo,
  PendingOrdersIcon,
  ShippedOrdersIcon,
  DeliveredOrdersIcon,
  CancelledOrdersIcon,
} from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";

const VIRGINIE_EMAIL = "virginie.ayivor@yahoo.fr";

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

export const Navbar = () => {
  const userContext = useContext(UserContext) as any;
  const user = userContext?.user || null;
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [orderCount, setOrderCount] = useState<OrderCountType>({
    pending: 0,
    shipped: 0,
    delivered: 0,
    total: 0,
  });
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderLoadError, setOrderLoadError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [avatarColorIndex, setAvatarColorIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, shouldReduceAnimations } = useMobileOptimization({
    enableReducedMotion: true,
  });
  const isVirginie =
    user?.email?.toLowerCase?.() === VIRGINIE_EMAIL;

  // Couleurs pour l'animation de l'avatar - couleurs de l'autisme
  const adminColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"];
  const userColors = ["#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];
  const guestColors = ["#E8E8E8", "#D4D4D4", "#B8B8B8", "#9E9E9E"];

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isThemeReady, setIsThemeReady] = useState(false);
  useEffect(() => setIsThemeReady(true), []);
  const currentTheme = (resolvedTheme ?? theme) ?? "light";
  const isDarkTheme = currentTheme === "dark";

  const handleThemeToggle = (target?: "light" | "dark") => {
    const nextTheme = target ?? (isDarkTheme ? "light" : "dark");
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", nextTheme);
      localStorage.removeItem("themeMode");
      localStorage.removeItem("autoModeHours");
    }
    setTheme(nextTheme);
    setAvatarColorIndex((prev) => prev);
  };

  // Fermer automatiquement le menu lorsque l'on quitte le format mobile
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  // Ferme le menu mobile dès qu'une navigation se produit
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Animation de couleur de l'avatar - optimisée pour les performances
  useEffect(() => {
    if (shouldReduceAnimations || isMobile) {
      return;
    }

    const colorInterval = setInterval(() => {
      setAvatarColorIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 8000);

    return () => clearInterval(colorInterval);
  }, [shouldReduceAnimations, isMobile]);

  useEffect(() => {
    if (shouldReduceAnimations || isMobile) {
      setAvatarColorIndex(0);
    }
  }, [shouldReduceAnimations, isMobile]);

  /**
   * Synchroniser le panier avec l'utilisateur
   */
  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const userCart = localStorage.getItem(`cart_${user.id}`);
      setCartItemsCount(userCart ? JSON.parse(userCart).length : 0);
      // Chargement différé des commandes (uniquement si nécessaire)
      const timer = setTimeout(() => fetchOrderCount(), 500);
      return () => clearTimeout(timer);
    } else {
      setCartItemsCount(0);
    }
  }, [user]);

  /**
   * Mettre à jour le panier lors d'un événement "userUpdate"
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUserUpdate = () => {
      if (user && typeof window !== "undefined") {
        const userCart = localStorage.getItem(`cart_${user.id}`);
        setCartItemsCount(userCart ? JSON.parse(userCart).length : 0);
        fetchOrderCount();
      }
    };

    window.addEventListener("userUpdate", handleUserUpdate);

    return () => {
      window.removeEventListener("userUpdate", handleUserUpdate);
    };
  }, [user]);

  /**
   * Déconnexion de l'utilisateur
   */
  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté(e) et votre panier sera vidé.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4ECDC4",
      cancelButtonColor: "#FF6B6B",
      confirmButtonText: "Oui, déconnectez-moi !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
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

        setCartItemsCount(0);
        setOrderCount({
          pending: 0,
          shipped: 0,
          delivered: 0,
          total: 0,
        });

        const event = new CustomEvent("userUpdate");
        window.dispatchEvent(event);

        window.location.href = "/";
      }
    });
  };

  /**
   * Rediriger vers la page de connexion ou d'inscription
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
   * Fonction robuste pour récupérer les données utilisateur et l'ID
   */
  const getUserData = () => {
    if (typeof window === "undefined") return null;

    try {
      const userStr = localStorage.getItem("user");
      const directToken = localStorage.getItem("token");
      const userToken = localStorage.getItem("userToken");

      let userData = null;
      let token = directToken || userToken;

      if (userStr) {
        try {
          userData = JSON.parse(userStr);
          if (userData.token) {
            token = userData.token;
          }
        } catch (e) {
          console.error("Erreur lors de l'analyse des données utilisateur:", e);
        }
      }

      if (!userData && token) {
        userData = { token };
      }

      if (userData && !userData.token && token) {
        userData.token = token;
      }

      let userId = userData?.id || userData?._id || userData?.userId;

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

      if (userId && userData) {
        userData.id = userId;
      }

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
   * Récupérer le compteur de commandes depuis l'API
   */
  const fetchOrderCount = async () => {
    setIsLoadingOrders(true);
    setOrderLoadError(null);

    try {
      const userData = getUserData();

      if (!userData || !userData.id || !userData.token) {
        console.error("Données utilisateur insuffisantes");
        setIsLoadingOrders(false);
        return;
      }

      const userId = userData.id;
      const token = userData.token;

      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      ).replace(/\/$/, "");
      const url = `${apiUrl}/orders/user/${userId}`;

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

      let orders = [];

      if (data && Array.isArray(data)) {
        orders = data;
      } else if (data && data.orders && Array.isArray(data.orders)) {
        orders = data.orders;
      } else if (data && data.data && Array.isArray(data.data)) {
        orders = data.data;
      }

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

      fetchOrderCount();

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
      }, 60000);

      const handleVisibilityChange = () => {
        if (!document.hidden) {
          const currentUserData = getUserData();
          if (
            !currentUserData ||
            !currentUserData.id ||
            !currentUserData.token
          ) {
            return;
          }
          fetchOrderCount();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

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

    return () => {
      if (cleanup) cleanup();
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, []);

  // Menu items pour le menu mobile
  const menuItems = [
    { name: "🏠 Accueil", href: "/", color: "foreground" },
    { name: "ℹ️ À propos", href: "/about", color: "foreground" },
    { name: "📄 Publications", href: "/articles", color: "foreground" },
    { name: "📝 Posts", href: "/posts", color: "foreground" },
    { name: "🎮 Contrôle", href: "/controle", color: "foreground" },
    { name: "🛒 Shop", href: "/shop", color: "foreground" },
    ...(isVirginie
      ? [{ name: "🌟 Maeva", href: "/maeva", color: "foreground" }]
      : []),
    { name: "❤️ Contact", href: "/contact", color: "foreground" },
  ];

  // Menu utilisateur pour le burger (mobile)
  const userMenuItems: any[] = user
    ? [
        { name: "👤 Profil", href: "/profile", color: "foreground" },
        { name: "🧾 Mes commandes", href: "/orders", color: "foreground", divider: true },
        { name: "⏳ En cours", href: "/orders?status=pending", color: "foreground", badge: orderCount.pending || 0 },
        { name: "📦 Expédiées", href: "/orders?status=shipped", color: "foreground", badge: orderCount.shipped || 0 },
        { name: "✅ Livrées", href: "/orders?status=delivered", color: "foreground", badge: orderCount.delivered || 0 },
        { name: "🚪 Déconnexion", href: "#", color: "danger", action: () => handleLogout() },
      ]
    : [];

  const menuOverlayClassName =
    "md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm";
  const menuPanelClassName =
    "md:hidden fixed top-0 left-0 h-auto max-h-screen w-72 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto rounded-r-2xl";
  const disableMenuMotion = isMobile || shouldReduceAnimations;

  const menuPanelContent = (
    <div className="p-4 flex flex-col">
      {/* Header avec logo et bouton fermer */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <AutismLogo size={12} />
          <span className="font-bold text-violet-600 dark:text-violet-400 text-lg">
            AutiStudy
          </span>
        </div>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Fermer le menu"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Bouton AI Assistant */}
      <div className="mb-3">
        <Button
          as={NextLink}
          href="/ai-assistant"
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
          size="md"
          startContent={<Sparkles className="w-4 h-4" />}
          onPress={() => {
            router.push("/ai-assistant");
            setIsMenuOpen(false);
          }}
        >
          🤖 Assistant IA
        </Button>
      </div>

      {/* Séparateur */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

      {/* Liens principaux */}
      <div className="space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NextLink
            key={`${item.name}-${index}`}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className={isMobile ? "block py-2.5 px-3 text-gray-700 dark:text-gray-200 font-medium rounded-lg text-sm hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400" : "block py-2.5 px-3 text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-all rounded-lg text-sm"}
          >
            {item.name}
          </NextLink>
        ))}
      </div>

      {/* Liens utilisateur si connecté */}
      {userMenuItems.length > 0 && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
          <div className="space-y-1 pb-4">
            {userMenuItems.map((item, index) =>
              item.href === "#" ? (
                <button
                  key={`user-${item.name}-${index}`}
                  className={`${isMobile ? "block w-full text-left py-2.5 px-3 font-medium rounded-lg text-sm hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400" : "block w-full text-left py-2.5 px-3 font-medium transition-all rounded-lg text-sm"} ${
                    item.color === "danger"
                      ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                      : "text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400"
                  }`}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    }
                    setIsMenuOpen(false);
                  }}
                >
                  {item.name}
                </button>
              ) : (
                <NextLink
                  key={`user-${item.name}-${index}`}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${isMobile ? "block py-2.5 px-3 font-medium rounded-lg text-sm hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400" : "block py-2.5 px-3 font-medium transition-all rounded-lg text-sm"} ${
                    item.color === "danger"
                      ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                      : "text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400"
                  }`}
                >
                  {item.name}
                </NextLink>
              ),
            )}
          </div>
        </>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 my-3" />
      <button
        className={isMobile ? "flex w-full items-center justify-between rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700" : "flex w-full items-center justify-between rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"}
        disabled={!isThemeReady}
        onClick={() => {
          handleThemeToggle();
          setIsMenuOpen(false);
        }}
      >
        <span>Mode {isDarkTheme ? "clair" : "sombre"}</span>
        {isDarkTheme ? (
          <SunFilledIcon className="text-yellow-400" size={18} />
        ) : (
          <MoonFilledIcon className="text-blue-400" size={18} />
        )}
      </button>
    </div>
  );

  return (
    <NextUINavbar
      className="dark:bg-gray-900/95 bg-white/95 backdrop-blur-md font-['Inter',_'system-ui',_-apple-system,_'SF_Pro_Display',_sans-serif] relative performance-optimized no-border-navbar h-16 md:h-20"
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      position="sticky"
    >
      <NavbarContent className="flex-shrink-0 basis-1/5 sm:basis-full">
        <button
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400"
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth >= 768) {
              setIsMenuOpen(false);
            } else {
              setIsMenuOpen(!isMenuOpen);
            }
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        <NavbarBrand as="li" className="gap-2 flex-shrink-0">
          <NextLink
            className={isMobile ? "flex items-center justify-start gap-2" : "flex items-center justify-start gap-2 hover:scale-105 transition-transform duration-200"}
            href="/"
          >
            <AutismLogo size={10} />
            <div className="flex flex-col">
              <p className="font-bold text-violet-600 dark:text-violet-400 text-sm md:text-lg lg:text-xl tracking-tight">
                AutiStudy
              </p>
              <p className="text-[0.65rem] md:text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                Créé par une famille
              </p>
            </div>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4 xl:gap-8 flex-1" justify="center">
        <NavbarItem>
          <NextLink
            className={isMobile ? "text-gray-700 dark:text-gray-200 text-base xl:text-lg font-semibold flex items-center gap-2 px-1" : "text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 text-base xl:text-lg font-semibold transition-colors duration-200 flex items-center gap-2 px-1"}
            href="/about"
          >
            <FontAwesomeIcon className="w-5 h-5" icon={faInfoCircle} />
            À propos
          </NextLink>
        </NavbarItem>

        <NavbarItem>
          <NextLink
            className={isMobile ? "text-gray-700 dark:text-gray-200 text-base xl:text-lg font-semibold flex items-center gap-2 px-1" : "text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 text-base xl:text-lg font-semibold transition-colors duration-200 flex items-center gap-2 px-1"}
            href="/articles"
          >
            <FontAwesomeIcon className="w-5 h-5" icon={faBook} />
            Publications
          </NextLink>
        </NavbarItem>

        <NavbarItem>
          <NextLink
            className={isMobile ? "text-gray-700 dark:text-gray-200 text-base xl:text-lg font-semibold flex items-center gap-2 px-1" : "text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 text-base xl:text-lg font-semibold transition-colors duration-200 flex items-center gap-2 px-1"}
            href="/posts"
          >
            <FontAwesomeIcon className="w-5 h-5" icon={faNewspaper} />
            Posts
          </NextLink>
        </NavbarItem>

        <NavbarItem>
          <NextLink
            className={isMobile ? "text-gray-700 dark:text-gray-200 text-base xl:text-lg font-semibold flex items-center gap-2 px-1" : "text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 text-base xl:text-lg font-semibold transition-colors duration-200 flex items-center gap-2 px-1"}
            href="/controle"
          >
            <FontAwesomeIcon className="w-5 h-5" icon={faGamepad} />
            Contrôle
          </NextLink>
        </NavbarItem>

        <NavbarItem className="relative" key="shop">
          <NextLink
            className={isMobile ? "text-gray-700 dark:text-gray-200 flex items-center gap-2 relative text-base xl:text-lg font-semibold px-1" : "text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 flex items-center gap-2 relative text-base xl:text-lg font-semibold transition-colors duration-200 px-1"}
            href="/shop"
          >
            <FontAwesomeIcon className="w-5 h-5" icon={faShoppingCart} />
            Shop
            {cartItemsCount > 0 && (
              <Badge
                color="danger"
                content={cartItemsCount}
                size="sm"
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

        {isVirginie && (
          <NavbarItem>
            <NextLink
              className={isMobile ? "text-gray-700 dark:text-gray-200 text-base xl:text-lg font-semibold flex items-center gap-2 px-1" : "text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 text-base xl:text-lg font-semibold transition-colors duration-200 flex items-center gap-2 px-1"}
              href="/maeva"
            >
              <Sparkles className="w-5 h-5" />
              Maeva
            </NextLink>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="flex-shrink-0 gap-3 md:gap-5" justify="end">
        {/* Bouton AI Assistant */}
        <NavbarItem>
          <Button
            as={NextLink}
            href="/ai-assistant"
            isIconOnly
            variant="flat"
            size="md"
            className={isMobile ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white w-10 h-10 md:w-12 md:h-12" : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transition-all w-10 h-10 md:w-12 md:h-12"}
            aria-label="Assistant IA"
            onPress={() => router.push("/ai-assistant")}
          >
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </NavbarItem>

        {/* Bouton de thème */}
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitch />
        </NavbarItem>

        {/* Avatar utilisateur */}
        {!user ? (
          <Avatar
            aria-label="Connectez-vous pour accéder à votre profil"
            className="cursor-pointer flex-shrink-0 text-tiny text-default-500 transition-none motion-reduce:transform-none active:scale-100 focus:outline-none focus:ring-0"
            isBordered
            name="Invité"
            onClick={handleLoginRedirect}
            showFallback
            size="sm"
            src="/assets/default-avatar.webp"
            style={{
              borderColor: guestColors[avatarColorIndex],
              borderWidth: "3px",
              boxShadow: `0 0 12px ${guestColors[avatarColorIndex]}`,
            }}
          />
        ) : (
          <>
            {/* Avatar mobile sans sous-menu: ouvre directement le profil */}
            <div className="lg:hidden">
              <Avatar
                alt={`Avatar de ${user?.pseudo}`}
                className="cursor-pointer flex-shrink-0 transition-none motion-reduce:transform-none active:scale-100 focus:outline-none focus:ring-0"
                isBordered
                size="sm"
                src={user?.avatar || "/assets/default-avatar.webp"}
                style={{
                  borderColor:
                    user?.role === "admin"
                      ? adminColors[avatarColorIndex]
                      : userColors[avatarColorIndex],
                  borderWidth: "3px",
                  boxShadow: `0 0 12px ${
                    user?.role === "admin"
                      ? adminColors[avatarColorIndex]
                      : userColors[avatarColorIndex]
                  }`,
                }}
                onClick={() => router.push("/profile")}
              />
            </div>

            {/* Avatar desktop avec dropdown */}
            <div className="hidden lg:block">
              <Dropdown disableAnimation>
                <DropdownTrigger className="no-motion-dropdown">
                  <Button
                    aria-label="Menu utilisateur"
                    className="bg-transparent relative button-cls-optimized button-cls-optimized button-cls-optimized button-cls-optimized focus-visible:outline-none transition-none"
                  >
                    <Avatar
                      alt={`Avatar de ${user?.pseudo}`}
                      className="cursor-pointer flex-shrink-0 transition-none motion-reduce:transform-none active:scale-100 focus:outline-none focus:ring-0"
                      isBordered
                      size="sm"
                      src={user?.avatar || "/assets/default-avatar.webp"}
                      style={{
                        borderColor:
                          user?.role === "admin"
                            ? adminColors[avatarColorIndex]
                            : userColors[avatarColorIndex],
                        borderWidth: "3px",
                        boxShadow: `0 0 12px ${
                          user?.role === "admin"
                            ? adminColors[avatarColorIndex]
                            : userColors[avatarColorIndex]
                        }`,
                      }}
                    />
                    <span className="ml-2 hidden xl:inline dark:text-gray-200 text-gray-700 text-sm">
                      {user?.pseudo || "Utilisateur"}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu className="dark:bg-gray-800 dark:border-gray-700 no-motion-dropdown">
                  <DropdownItem
                    className="dark:text-gray-200 dark:hover:bg-gray-700"
                    key="profile"
                    onClick={() => router.push("/profile")}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faUser} />
                    Profil
                  </DropdownItem>
                  <DropdownItem
                    className="font-medium dark:text-gray-300"
                    key="orders-title"
                    showDivider
                    textValue="Mes commandes"
                  >
                    Mes commandes
                  </DropdownItem>

                  <DropdownItem
                    className="relative"
                    key="orders-pending"
                    onPress={() => {
                      router.push("/orders?status=pending");
                    }}
                  >
                    <div className="flex items-center justify-between p-2 md:p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50/30 dark:hover:bg-yellow-900/20 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-2 md:gap-3">
                        <PendingOrdersIcon
                          className="text-yellow-600 dark:text-yellow-400"
                          size={24}
                        />
                        <div className="flex flex-col">
                          <div className="font-medium text-yellow-600 dark:text-yellow-400 text-sm">
                            En cours
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Commandes en traitement
                          </div>
                        </div>
                      </div>
                      <span className="text-base md:text-lg font-semibold text-yellow-600 dark:text-yellow-400 min-w-[2rem] text-center">
                        {orderCount.pending || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    className="relative"
                    key="orders-shipped"
                    onPress={() => {
                      router.push("/orders?status=shipped");
                    }}
                  >
                    <div className="flex items-center justify-between p-2 md:p-3 rounded-lg border border-violet-200 dark:border-violet-800 hover:bg-violet-50/30 dark:hover:bg-violet-900/20 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-2 md:gap-3">
                        <ShippedOrdersIcon
                          className="text-violet-600 dark:text-violet-400"
                          size={24}
                        />
                        <div className="flex flex-col">
                          <div className="font-medium text-violet-600 dark:text-violet-400 text-sm">
                            Envoyées
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            En cours de livraison
                          </div>
                        </div>
                      </div>
                      <span className="text-base md:text-lg font-semibold text-violet-600 dark:text-violet-400 min-w-[2rem] text-center">
                        {orderCount.shipped || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    className="relative"
                    key="orders-delivered"
                    onPress={() => {
                      router.push("/orders?status=delivered");
                    }}
                  >
                    <div className="flex items-center justify-between p-2 md:p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50/30 dark:hover:bg-green-900/20 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-2 md:gap-3">
                        <DeliveredOrdersIcon
                          className="text-green-600 dark:text-green-400"
                          size={24}
                        />
                        <div className="flex flex-col">
                          <div className="font-medium text-green-600 dark:text-green-400 text-sm">
                            Livrées
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Commandes terminées
                          </div>
                        </div>
                      </div>
                      <span className="text-base md:text-lg font-semibold text-green-600 dark:text-green-400 min-w-[2rem] text-center">
                        {orderCount.delivered || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    className="relative dark:text-gray-200 dark:hover:bg-gray-700"
                    key="orders-all"
                    onPress={() => {
                      router.push("/orders");
                    }}
                    showDivider
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">Voir toutes mes commandes</span>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {orderCount.total || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    className="dark:text-gray-200 dark:hover:bg-gray-700"
                    key="controle"
                    onPress={() => router.push("/controle")}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faGamepad} />
                    Contrôle
                  </DropdownItem>

                  {/* Thème */}
                  <DropdownItem
                    className="dark:text-gray-200 dark:hover:bg-gray-700"
                    key="theme"
                    textValue="Thème"
                  >
                    <Dropdown placement="left-start" disableAnimation>
                      <DropdownTrigger>
                        <div className="flex items-center w-full cursor-pointer">
                          <FontAwesomeIcon className="mr-2" icon={faMoon} />
                          Thème
                        </div>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Options de thème"
                        className="dark:bg-gray-800 dark:border-gray-700"
                      >
                        <DropdownItem
                          className="dark:text-gray-200 dark:hover:bg-gray-700"
                          key="light"
                          onPress={() => {
                            if (typeof window !== "undefined") {
                              localStorage.removeItem("themeMode");
                              localStorage.removeItem("autoModeHours");
                            }
                            handleThemeToggle("light");
                          }}
                          textValue="Mode clair"
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
                          className="dark:text-gray-200 dark:hover:bg-gray-700"
                          key="dark"
                          onPress={() => {
                            if (typeof window !== "undefined") {
                              localStorage.removeItem("themeMode");
                              localStorage.removeItem("autoModeHours");
                            }
                            handleThemeToggle("dark");
                          }}
                          textValue="Mode sombre"
                        >
                          <div className="flex items-center gap-2">
                            <MoonFilledIcon
                              className="text-violet-300"
                              size={16}
                            />
                            <span>Mode sombre</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          className="dark:text-gray-200 dark:hover:bg-gray-700"
                          key="auto"
                          onClick={() => {
                            const savedHours =
                              localStorage.getItem("autoModeHours");
                            const autoModeHours = savedHours
                              ? JSON.parse(savedHours)
                              : { start: 20, end: 7 };

                            localStorage.setItem("themeMode", "auto");
                            localStorage.setItem(
                              "autoModeHours",
                              JSON.stringify(autoModeHours),
                            );

                            const currentHour = new Date().getHours();
                            const shouldBeDark =
                              currentHour >= autoModeHours.start ||
                              currentHour < autoModeHours.end;

                            localStorage.setItem("theme", shouldBeDark ? "dark" : "light");
                            setTheme(shouldBeDark ? "dark" : "light");
                            setAvatarColorIndex((prev) => prev);
                          }}
                          textValue="Mode automatique"
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
                  <DropdownItem
                    className="dark:text-gray-200 dark:hover:bg-gray-700"
                    key="logout"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faSignOutAlt} />
                    Déconnexion
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </>
        )}
      </NavbarContent>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && !disableMenuMotion && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={menuOverlayClassName}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={menuPanelClassName}
            >
              {menuPanelContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {isMenuOpen && disableMenuMotion && (
        <>
          <div
            className={menuOverlayClassName}
            onClick={() => setIsMenuOpen(false)}
          />
          <div className={menuPanelClassName}>{menuPanelContent}</div>
        </>
      )}
    </NextUINavbar>
  );
};

export default Navbar;

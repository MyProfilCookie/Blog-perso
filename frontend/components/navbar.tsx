/* eslint-disable no-console */
"use client";
import React, { useState, useRef, useEffect } from "react";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Avatar } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { Dropdown } from '@nextui-org/react'
import { DropdownTrigger } from '@nextui-org/react'
import { DropdownMenu } from '@nextui-org/react'
import { DropdownItem } from '@nextui-org/react'
import { Badge } from '@nextui-org/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faNewspaper,
  faCrown,
  faTachometerAlt,
  faUser,
  faMoon,
  faHome,
  faInfoCircle,
  faBook,
  faGamepad,
  faShoppingCart,
  faGraduationCap,
  faUsers,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { 
  SunFilledIcon, 
  MoonFilledIcon, 
  AutismLogo, 
  VisibleBurgerIcon,
  PendingOrdersIcon,
  ShippedOrdersIcon,
  DeliveredOrdersIcon,
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

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
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
  const [avatarColorIndex, setAvatarColorIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Couleurs pour l'animation de l'avatar - couleurs de l'autisme
  const adminColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"];
  const userColors = ["#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];
  const guestColors = ["#E8E8E8", "#D4D4D4", "#B8B8B8", "#9E9E9E"];

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation de couleur de l'avatar - optimisée pour les performances
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setAvatarColorIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 4000);

    return () => clearInterval(colorInterval);
  }, []);

  /**
   * Récupérer l'utilisateur et le panier depuis le localStorage
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
  }, []);

  /**
   * Mettre à jour l'utilisateur et le panier lors d'un événement "userUpdate"
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
        
        setUser(null);
        setCartItemsCount(0);
        setOrderCount({
          pending: 0,
          shipped: 0,
          delivered: 0,
          total: 0
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
      console.error("Erreur lors de la récupération des données utilisateur:", e);
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
          if (!currentUserData || !currentUserData.id || !currentUserData.token) {
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
    { name: "📚 Articles", href: "/articles", color: "foreground" },
    { name: "🎮 Contrôle", href: "/controle", color: "foreground" },
    { name: "🛒 Shop", href: "/shop", color: "foreground" },
    { name: "❤️ Contact", href: "/contact", color: "foreground" },
  ];

  // Menu items utilisateur si connecté
  const userMenuItems = user ? [
    { name: "👤 Profil", href: "/profile", color: "foreground" },
    { name: "🎓 Dashboard", href: user.role === 'admin' ? '/admin/dashboard' : '/dashboard', color: "foreground" },
    { name: "🚪 Déconnexion", href: "#", color: "danger", action: handleLogout },
  ] : [];

  return (
    <NextUINavbar
      className="dark:bg-gray-900/95 bg-white/95 backdrop-blur-md font-sans relative performance-optimized"
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
      style={{ 
        boxShadow: resolvedTheme === 'dark' 
          ? "0 4px 20px rgba(0, 0, 0, 0.3)" 
          : "0 4px 20px rgba(0, 0, 0, 0.08)",
        background: resolvedTheme === 'dark'
          ? "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,243,255,0.95) 100%)",
        contain: "layout style paint",
        borderBottom: "none",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        border: "none",
        outline: "none",
        borderWidth: "0",
        borderStyle: "none"
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="sm:hidden text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400"
        />
        <NavbarBrand as="li" className="gap-2 max-w-fit">
          <NextLink className="flex items-center justify-start gap-2 hover:scale-105 transition-transform duration-200 animation-optimized" href="/">
            <AutismLogo size={16} />
            <div className="flex flex-col">
              <p className="font-bold text-violet-600 dark:text-violet-400 text-sm md:text-base font-sans">
                AutiStudy
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                Créé par une famille
              </p>
            </div>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <NextLink
            className="text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 text-sm xl:text-base font-medium tracking-wide transition-colors duration-200 flex items-center gap-2"
            href="/about"
          >
            <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4" />
            À propos
          </NextLink>
        </NavbarItem>
        
        <NavbarItem>
          <NextLink
            className="text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 text-sm xl:text-base font-medium tracking-wide transition-colors duration-200 flex items-center gap-2"
            href="/articles"
          >
            <FontAwesomeIcon icon={faBook} className="w-4 h-4" />
            Articles
          </NextLink>
        </NavbarItem>
        
        <NavbarItem>
          <NextLink
            className="text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 text-sm xl:text-base font-medium tracking-wide transition-colors duration-200 flex items-center gap-2"
            href="/controle"
          >
            <FontAwesomeIcon icon={faGamepad} className="w-4 h-4" />
            Contrôle
          </NextLink>
        </NavbarItem>

        <NavbarItem key="shop" className="relative">
          <NextLink
            className="text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 flex items-center gap-2 relative text-sm xl:text-base font-medium tracking-wide transition-colors duration-200"
            href="/shop"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
            Shop
            {cartItemsCount > 0 && (
              <Badge
                color="danger"
                content={cartItemsCount}
                size="sm"
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                }}
              >
                {cartItemsCount}
              </Badge>
            )}
          </NextLink>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {/* Bouton de thème mobile */}
        <NavbarItem className="flex lg:hidden">
          <ThemeSwitch />
        </NavbarItem>

        {/* Avatar utilisateur */}
        {!user ? (
          <Avatar
            isBordered
            showFallback
            aria-label="Connectez-vous pour accéder à votre profil"
            className="cursor-pointer text-tiny text-default-500 transition-all duration-300 hover:scale-110"
            name="Invité"
            size="sm"
            src="/assets/default-avatar.webp"
            style={{
              borderColor: guestColors[avatarColorIndex],
              borderWidth: "3px",
              boxShadow: `0 0 12px ${guestColors[avatarColorIndex]}`,
            }}
            onClick={handleLoginRedirect}
          />
        ) : (
          <>
            {/* Avatar mobile */}
            <div className="md:hidden">
              <Avatar
                isBordered
                alt={`Avatar de ${user?.pseudo}`}
                className="transition-all duration-300 cursor-pointer hover:scale-110"
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
            <div className="hidden md:block">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    aria-label="Menu utilisateur"
                    className="bg-transparent relative button-cls-optimized hover:bg-violet-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Avatar
                      isBordered
                      alt={`Avatar de ${user?.pseudo}`}
                      className="transition-all duration-300"
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
                <DropdownMenu className="dark:bg-gray-800 dark:border-gray-700">
                  <DropdownItem
                    key="profile"
                    onClick={() => router.push("/profile")}
                    className="dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon className="mr-2" icon={faUser} />
                    Profil
                  </DropdownItem>
                  <DropdownItem
                    key="orders-title"
                    showDivider
                    className="font-medium dark:text-gray-300"
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
                    <div className="flex items-center justify-between p-2 md:p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50/30 dark:hover:bg-yellow-900/20 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-2 md:gap-3">
                        <PendingOrdersIcon 
                          size={24} 
                          className="text-yellow-600 dark:text-yellow-400"
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
                    key="orders-shipped"
                    className="relative"
                    onClick={() => {
                      router.push("/orders?status=shipped");
                    }}
                  >
                    <div className="flex items-center justify-between p-2 md:p-3 rounded-lg border border-violet-200 dark:border-violet-800 hover:bg-violet-50/30 dark:hover:bg-violet-900/20 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-2 md:gap-3">
                        <ShippedOrdersIcon 
                          size={24} 
                          className="text-violet-600 dark:text-violet-400"
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
                    key="orders-delivered"
                    className="relative"
                    onClick={() => {
                      router.push("/orders?status=delivered");
                    }}
                  >
                    <div className="flex items-center justify-between p-2 md:p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50/30 dark:hover:bg-green-900/20 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-2 md:gap-3">
                        <DeliveredOrdersIcon 
                          size={24} 
                          className="text-green-600 dark:text-green-400"
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
                    key="orders-all"
                    showDivider
                    className="relative dark:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => {
                      router.push("/orders");
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">Voir toutes mes commandes</span>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {orderCount.total || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    key="controle"
                    onClick={() => router.push("/controle")}
                    className="dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FontAwesomeIcon className="mr-2" icon={faGamepad} />
                    Contrôle
                  </DropdownItem>

                  {/* Thème */}
                  <DropdownItem key="theme" textValue="Thème" className="dark:text-gray-200 dark:hover:bg-gray-700">
                    <Dropdown placement="left-start">
                      <DropdownTrigger>
                        <div className="flex items-center w-full cursor-pointer">
                          <FontAwesomeIcon className="mr-2" icon={faMoon} />
                          Thème
                        </div>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Options de thème" className="dark:bg-gray-800 dark:border-gray-700">
                        <DropdownItem
                          key="light"
                          textValue="Mode clair"
                          onClick={() => {
                            localStorage.removeItem("themeMode");
                            localStorage.removeItem("autoModeHours");
                            document.documentElement.classList.remove("dark");
                            localStorage.setItem("theme", "light");
                            setTheme("light");
                            setAvatarColorIndex((prev) => prev);
                          }}
                          className="dark:text-gray-200 dark:hover:bg-gray-700"
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
                            localStorage.removeItem("themeMode");
                            localStorage.removeItem("autoModeHours");
                            document.documentElement.classList.add("dark");
                            localStorage.setItem("theme", "dark");
                            setTheme("dark");
                            setAvatarColorIndex((prev) => prev);
                          }}
                          className="dark:text-gray-200 dark:hover:bg-gray-700"
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
                          key="auto"
                          textValue="Mode automatique"
                          onClick={() => {
                            const savedHours = localStorage.getItem("autoModeHours");
                            const autoModeHours = savedHours ? JSON.parse(savedHours) : { start: 20, end: 7 };
                            
                            localStorage.setItem("themeMode", "auto");
                            localStorage.setItem("autoModeHours", JSON.stringify(autoModeHours));
                            
                            const currentHour = new Date().getHours();
                            const shouldBeDark = currentHour >= autoModeHours.start || currentHour < autoModeHours.end;

                            if (shouldBeDark) {
                              document.documentElement.classList.add("dark");
                              localStorage.setItem("theme", "dark");
                              setTheme("dark");
                            } else {
                              document.documentElement.classList.remove("dark");
                              localStorage.setItem("theme", "light");
                              setTheme("light");
                            }
                            setAvatarColorIndex((prev) => prev);
                          }}
                          className="dark:text-gray-200 dark:hover:bg-gray-700"
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
                  <DropdownItem key="logout" onClick={handleLogout} className="dark:text-gray-200 dark:hover:bg-gray-700">
                    <FontAwesomeIcon className="mr-2" icon={faSignOutAlt} />
                    Déconnexion
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </>
        )}
      </NavbarContent>

      {/* Menu mobile HeroUI */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className="w-full"
              color={item.color as any}
              href={item.href}
              size="lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        {userMenuItems.map((item, index) => (
          <NavbarMenuItem key={`user-${item.name}-${index}`}>
            <Link
              className="w-full"
              color={item.color as any}
              href={item.href}
              size="lg"
              onClick={() => {
                if (item.action) {
                  item.action();
                }
                setIsMenuOpen(false);
              }}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
};

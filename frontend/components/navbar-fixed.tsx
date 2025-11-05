/* eslint-disable no-console */
"use client";
import React, { useState, useRef, useEffect } from "react";
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
  faCrown,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    // Réduire la fréquence d'animation pour améliorer les performances
    const colorInterval = setInterval(() => {
      setAvatarColorIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 4000); // Changé de 2000ms à 4000ms

    return () => clearInterval(colorInterval);
  }, []);

  // Fermer le menu en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const isMenuButton = target.closest(
        'button[aria-label="Toggle navigation"]',
      );

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !isMenuButton
      ) {
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

  // Fermer le menu lors de la navigation
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
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
      }, 60000); // Changé de 30000ms à 60000ms pour améliorer les performances

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

  return (
    <NextUINavbar
      className="dark:bg-gray-900/95 bg-white/95 backdrop-blur-md font-sans relative border-b border-gray-200 dark:border-gray-700 performance-optimized"
      maxWidth="xl"
      position="sticky"
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)",
        contain: "layout style paint",
      }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {/* Logo AutiStudy */}
        <NavbarBrand as="li" className="gap-2 max-w-fit">
          <NextLink
            className="flex items-center justify-start gap-2 hover:scale-105 transition-transform duration-200 animation-optimized"
            href="/"
          >
            <AutismLogo size={16} />
            <div className="flex flex-col">
              <p className="font-bold text-blue-600 dark:text-blue-400 text-base font-sans">
                AutiStudy
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Créé par une famille
              </p>
            </div>
          </NextLink>
        </NavbarBrand>

        {/* Bouton menu mobile */}
        <button
          aria-label="Toggle navigation"
          className="md:hidden p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200 animation-optimized"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <VisibleBurgerIcon
            className={`text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors duration-200 ${isMenuOpen ? "rotate-90" : ""
              }`}
            size={24}
          />
        </button>

        {/* Navigation desktop */}
        <div className="hidden lg:flex flex-grow justify-center">
          <div className="flex items-center">
            <ul className="flex gap-6 items-center font-sans">
              <NavbarItem>
                <NextLink
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-base font-medium tracking-wide transition-colors duration-200 flex items-center gap-2"
                  href="/"
                >
                  <FontAwesomeIcon className="w-4 h-4" icon={faHome} />
                  Accueil
                </NextLink>
              </NavbarItem>

              <NavbarItem>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-transparent p-0 text-base font-medium tracking-wide button-cls-optimized flex items-center gap-2"
                      radius="sm"
                      variant="light"
                    >
                      <FontAwesomeIcon
                        className="w-4 h-4"
                        icon={faInfoCircle}
                      />
                      À propos
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="À propos menu"
                    className="animate-in fade-in-80 zoom-in-95 duration-200"
                  >
                    <DropdownItem
                      key="about"
                      onClick={() => router.push("/about")}
                      textValue="À propos de nous"
                    >
                      <FontAwesomeIcon className="mr-2" icon={faUsers} />À
                      propos de nous
                    </DropdownItem>
                    <DropdownItem
                      key="contact"
                      onClick={() => router.push("/contact")}
                      textValue="Contact"
                    >
                      <FontAwesomeIcon className="mr-2" icon={faHeart} />
                      Contact
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>

              <NavbarItem>
                <NextLink
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-base font-medium tracking-wide transition-colors duration-200 flex items-center gap-2"
                  href="/articles"
                >
                  <FontAwesomeIcon className="w-4 h-4" icon={faBook} />
                  Articles
                </NextLink>
              </NavbarItem>

              <NavbarItem>
                <NextLink
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-base font-medium tracking-wide transition-colors duration-200 flex items-center gap-2"
                  href="/controle"
                >
                  <FontAwesomeIcon className="w-4 h-4" icon={faGamepad} />
                  Contrôle
                </NextLink>
              </NavbarItem>

              <NavbarItem className="relative" key="shop">
                <NextLink
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 relative text-base font-medium tracking-wide transition-colors duration-200"
                  href="/shop"
                >
                  <FontAwesomeIcon className="w-4 h-4" icon={faShoppingCart} />
                  Shop
                  {cartItemsCount > 0 && (
                    <Badge
                      color="danger"
                      content={cartItemsCount}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
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
      </NavbarContent>

      <NavbarContent className="sm:flex basis-1/5 sm:basis-full" justify="end">
        {/* Bouton de thème mobile */}
        <NavbarItem className="flex lg:hidden">
          <ThemeSwitch />
        </NavbarItem>

        {/* Dashboard pour utilisateurs connectés */}
        {user && (
          <NavbarItem className="hidden md:flex">
            <Button
              aria-label={
                user.role === "admin" ? "Dashboard Admin" : "Dashboard"
              }
              as={Link}
              className="text-sm font-normal text-gray-600 dark:text-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-700 dark:hover:to-gray-600 button-cls-optimized border border-blue-200 dark:border-gray-600"
              href={user.role === "admin" ? "/admin/dashboard" : "/profile"}
            >
              <FontAwesomeIcon
                className="mr-2"
                icon={user.role === "admin" ? faCrown : faGraduationCap}
              />
              {user.role === "admin" ? "Admin" : "Dashboard"}
            </Button>
          </NavbarItem>
        )}

        {/* Avatar utilisateur */}
        {!user ? (
          <Avatar
            aria-label="Connectez-vous pour accéder à votre profil"
            className="cursor-pointer text-tiny text-default-500 md:transition-all md:duration-300 md:hover:scale-110"
            isBordered
            name="Invité"
            onClick={handleLoginRedirect}
            showFallback
            size="md"
            src="/assets/default-avatar.webp"
            style={{
              borderColor: guestColors[avatarColorIndex],
              borderWidth: "3px",
              boxShadow: `0 0 12px ${guestColors[avatarColorIndex]}`,
            }}
          />
        ) : (
          <>
            {/* Avatar mobile avec dropdown */}
            <div className="md:hidden">
              <Dropdown>
                <DropdownTrigger className="focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:opacity-100">
                  <Avatar
                    alt={`Avatar de ${user?.pseudo}`}
                    className="cursor-pointer transition-none"
                    isBordered
                    size="sm"
                    src={user?.avatar || "/assets/default-avatar.webp"}
                    style={{
                      borderColor:
                        user?.role === "admin"
                          ? adminColors[avatarColorIndex]
                          : userColors[avatarColorIndex],
                      borderWidth: "3px",
                      boxShadow: `0 0 12px ${user?.role === "admin"
                          ? adminColors[avatarColorIndex]
                          : userColors[avatarColorIndex]
                        }`,
                    }}
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Menu utilisateur mobile"
                  className="dark:bg-gray-900/95 bg-white/95 border border-gray-200 dark:border-gray-700"
                >
                  <DropdownItem
                    key="profile-mobile"
                    onPress={() => router.push("/profile")}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faUser} />
                    Profil
                  </DropdownItem>

                  <DropdownItem
                    className="font-medium"
                    key="orders-title-mobile"
                    showDivider
                    textValue="Mes commandes"
                  >
                    Mes commandes
                  </DropdownItem>

                  <DropdownItem
                    className="relative"
                    key="orders-pending-mobile"
                    onPress={() => {
                      router.push("/orders?status=pending");
                    }}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50/30 dark:hover:bg-yellow-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
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
                      <span className="text-base font-semibold text-yellow-600 dark:text-yellow-400 min-w-[2rem] text-center">
                        {orderCount.pending || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    className="relative"
                    key="orders-shipped-mobile"
                    onPress={() => {
                      router.push("/orders?status=shipped");
                    }}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <ShippedOrdersIcon
                          className="text-blue-600 dark:text-blue-400"
                          size={24}
                        />
                        <div className="flex flex-col">
                          <div className="font-medium text-blue-600 dark:text-blue-400 text-sm">
                            Envoyées
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            En cours de livraison
                          </div>
                        </div>
                      </div>
                      <span className="text-base font-semibold text-blue-600 dark:text-blue-400 min-w-[2rem] text-center">
                        {orderCount.shipped || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    className="relative"
                    key="orders-delivered-mobile"
                    onPress={() => {
                      router.push("/orders?status=delivered");
                    }}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50/30 dark:hover:bg-green-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
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
                      <span className="text-base font-semibold text-green-600 dark:text-green-400 min-w-[2rem] text-center">
                        {orderCount.delivered || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    className="relative"
                    key="orders-all-mobile"
                    onPress={() => {
                      router.push("/orders");
                    }}
                    showDivider
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Voir toutes mes commandes</span>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {orderCount.total || 0}
                      </span>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    key="controle-mobile"
                    onPress={() => router.push("/controle")}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faGamepad} />
                    Contrôle
                  </DropdownItem>

                  <DropdownItem key="theme-mobile" textValue="Thème">
                    <Dropdown placement="left-start" disableAnimation>
                      <DropdownTrigger>
                        <div className="flex items-center w-full cursor-pointer">
                          <FontAwesomeIcon className="mr-2" icon={faMoon} />
                          Thème
                        </div>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Options de thème">
                        <DropdownItem
                          key="light-mobile"
                          onPress={() => {
                            localStorage.removeItem("themeMode");
                            localStorage.removeItem("autoModeHours");
                            document.documentElement.classList.remove("dark");
                            localStorage.setItem("theme", "light");
                            setTheme("light");
                            setAvatarColorIndex((prev) => prev);
                          }}
                          textValue="Mode clair"
                        >
                          <div className="flex items-center gap-2">
                            <SunFilledIcon className="text-yellow-500" size={16} />
                            <span>Mode clair</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          key="dark-mobile"
                          onPress={() => {
                            localStorage.removeItem("themeMode");
                            localStorage.removeItem("autoModeHours");
                            document.documentElement.classList.add("dark");
                            localStorage.setItem("theme", "dark");
                            setTheme("dark");
                            setAvatarColorIndex((prev) => prev);
                          }}
                          textValue="Mode sombre"
                        >
                          <div className="flex items-center gap-2">
                            <MoonFilledIcon className="text-blue-300" size={16} />
                            <span>Mode sombre</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          key="auto-mobile"
                          onPress={() => {
                            const savedHours = localStorage.getItem("autoModeHours");
                            const autoModeHours = savedHours
                              ? JSON.parse(savedHours)
                              : { start: 20, end: 7 };

                            localStorage.setItem("themeMode", "auto");
                            localStorage.setItem("autoModeHours", JSON.stringify(autoModeHours));
                            setTheme("system");
                            setAvatarColorIndex((prev) => prev);

                            const currentHour = new Date().getHours();
                            const isNight =
                              autoModeHours.start > autoModeHours.end
                                ? currentHour >= autoModeHours.start ||
                                  currentHour < autoModeHours.end
                                : currentHour >= autoModeHours.start &&
                                  currentHour < autoModeHours.end;

                            if (isNight) {
                              document.documentElement.classList.add("dark");
                            } else {
                              document.documentElement.classList.remove("dark");
                            }
                          }}
                          textValue="Mode automatique"
                        >
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon className="text-gray-500" icon={faMoon} />
                            <span>Mode automatique</span>
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </DropdownItem>

                  <DropdownItem key="logout-mobile" onPress={handleLogout}>
                    <FontAwesomeIcon className="mr-2" icon={faSignOutAlt} />
                    Déconnexion
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            {/* Avatar desktop avec dropdown */}
            <div className="hidden md:block">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    aria-label="Menu utilisateur"
                    className="bg-transparent relative button-cls-optimized hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Avatar
                      alt={`Avatar de ${user?.pseudo}`}
                      className="transition-all duration-300"
                      isBordered
                      size="sm"
                      src={user?.avatar || "/assets/default-avatar.webp"}
                      style={{
                        borderColor:
                          user?.role === "admin"
                            ? adminColors[avatarColorIndex]
                            : userColors[avatarColorIndex],
                        borderWidth: "3px",
                        boxShadow: `0 0 12px ${user?.role === "admin"
                            ? adminColors[avatarColorIndex]
                            : userColors[avatarColorIndex]
                          }`,
                      }}
                    />
                    <span className="ml-2 hidden xl:inline dark:text-white text-gray-700">
                      {user?.pseudo || "Utilisateur"}
                    </span>
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
                    className="font-medium"
                    key="orders-title"
                    showDivider
                    textValue="Mes commandes"
                  >
                    Mes commandes
                  </DropdownItem>

                  <DropdownItem
                    className="relative"
                    key="orders-pending"
                    onClick={() => {
                      router.push("/orders?status=pending");
                    }}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50/30 dark:hover:bg-yellow-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <PendingOrdersIcon
                          className="text-yellow-600 dark:text-yellow-400"
                          size={28}
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
                  </DropdownItem>

                  <DropdownItem
                    className="relative"
                    key="orders-shipped"
                    onClick={() => {
                      router.push("/orders?status=shipped");
                    }}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <ShippedOrdersIcon
                          className="text-blue-600 dark:text-blue-400"
                          size={28}
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
                  </DropdownItem>

                  <DropdownItem
                    className="relative"
                    key="orders-delivered"
                    onClick={() => {
                      router.push("/orders?status=delivered");
                    }}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50/30 dark:hover:bg-green-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <DeliveredOrdersIcon
                          className="text-green-600 dark:text-green-400"
                          size={28}
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
                  </DropdownItem>

                  <DropdownItem
                    className="relative"
                    key="orders-all"
                    onClick={() => {
                      router.push("/orders");
                    }}
                    showDivider
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
                    <FontAwesomeIcon className="mr-2" icon={faGamepad} />
                    Contrôle
                  </DropdownItem>

                  {/* Thème */}
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
                          onClick={() => {
                            localStorage.removeItem("themeMode");
                            localStorage.removeItem("autoModeHours");
                            document.documentElement.classList.remove("dark");
                            localStorage.setItem("theme", "light");
                            setTheme("light");
                            setAvatarColorIndex((prev) => prev);
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
                          key="dark"
                          onClick={() => {
                            localStorage.removeItem("themeMode");
                            localStorage.removeItem("autoModeHours");
                            document.documentElement.classList.add("dark");
                            localStorage.setItem("theme", "dark");
                            setTheme("dark");
                            setAvatarColorIndex((prev) => prev);
                          }}
                          textValue="Mode sombre"
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

      {/* Menu burger mobile avec animations améliorées */}
      <div className="animate-presence-optimized">
        {isMenuOpen && (
          <div
            className="lg:hidden dark:bg-gray-900/95 bg-white/95 w-full shadow-xl absolute top-full left-0 z-50 max-h-[80vh] overflow-y-auto rounded-b-xl border-t border-gray-200 dark:border-gray-700 backdrop-blur-md slide-up-optimized visible"
            ref={menuRef}
          >
            <div className="p-6 space-y-6 fade-optimized visible">
              {/* Section utilisateur */}
              {user && (
                <div className="space-y-4 slide-up-optimized visible">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 px-2 flex items-center gap-2 slide-left-optimized visible">
                    <FontAwesomeIcon className="text-blue-600" icon={faUser} />
                    Mon compte
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 space-y-3 border border-blue-200 dark:border-gray-600">
                    <NextLink
                      className="block w-full"
                      href="/orders"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border-2 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50/30 dark:hover:bg-yellow-900/10 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                          <div className="flex items-center gap-3">
                            <PendingOrdersIcon
                              className="text-yellow-600 dark:text-yellow-400"
                              size={28}
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
                              className="text-blue-600 dark:text-blue-400"
                              size={28}
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
                              className="text-green-600 dark:text-green-400"
                              size={28}
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
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                      href={
                        user.role === "admin" ? "/admin/dashboard" : "/profile"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon
                        className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                        icon={user.role === "admin" ? faCrown : faGraduationCap}
                      />
                      <span className="font-medium">
                        {user.role === "admin"
                          ? "Dashboard Admin"
                          : "Dashboard"}
                      </span>
                    </NextLink>

                    {/* Contrôle */}
                    <NextLink
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                      href="/controle"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon
                        className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                        icon={faGamepad}
                      />
                      <span className="font-medium">Contrôle</span>
                    </NextLink>

                    {/* Déconnexion */}
                    <button
                      className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <FontAwesomeIcon
                        className="mr-3 text-red-600 dark:text-red-400 w-5"
                        icon={faSignOutAlt}
                      />
                      <span className="font-medium">Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation mobile pour les utilisateurs non connectés */}
              {!user && (
                <div className="space-y-4 slide-up-optimized visible">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 px-2 flex items-center gap-2 slide-left-optimized visible">
                    <FontAwesomeIcon className="text-blue-600" icon={faHome} />
                    Navigation
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 space-y-3 border border-blue-200 dark:border-gray-600">
                    <NextLink
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                      href="/"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon
                        className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                        icon={faHome}
                      />
                      <span className="font-medium">Accueil</span>
                    </NextLink>

                    <NextLink
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                      href="/about"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon
                        className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                        icon={faInfoCircle}
                      />
                      <span className="font-medium">À propos</span>
                    </NextLink>

                    <NextLink
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                      href="/articles"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon
                        className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                        icon={faBook}
                      />
                      <span className="font-medium">Articles</span>
                    </NextLink>

                    <NextLink
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                      href="/controle"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon
                        className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                        icon={faGamepad}
                      />
                      <span className="font-medium">Contrôle</span>
                    </NextLink>

                    <NextLink
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                      href="/shop"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon
                        className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                        icon={faShoppingCart}
                      />
                      <span className="font-medium">Shop</span>
                    </NextLink>

                    <NextLink
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                      href="/contact"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon
                        className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                        icon={faHeart}
                      />
                      <span className="font-medium">Contact</span>
                    </NextLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </NextUINavbar>
  );
};

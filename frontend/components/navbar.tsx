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
  const fetchOrderCount = async () => {
    if (!user || !user.id || isLoadingOrders) return;
  
    setIsLoadingOrders(true);
    console.log("Début de la récupération des compteurs de commandes...");
  
    try {
      const token = user.token || localStorage.getItem("token") || localStorage.getItem("userToken");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api").replace(/\/$/, "");
      
      // Ajustez ce chemin pour qu'il corresponde à vos routes backend
      // Si vos routes sont montées avec /api/orders
      const url = `${apiUrl}/orders/users/${user.id}/order-counts`;
      // Si vos routes sont montées avec /api
      // const url = `${apiUrl}/users/${user.id}/order-counts`;
      
      console.log("URL de récupération des compteurs de commandes:", url);
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Statut de la réponse:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Données des compteurs:", data);
        
        if (data.counts) {
          setOrderCount({
            pending: data.counts.pending,
            shipped: data.counts.shipped,
            total: data.counts.total
          });
        }
      } else {
        console.error("Erreur lors de la récupération des compteurs:", await response.text());
      }
    } catch (error) {
      console.error("Exception lors de la récupération des compteurs:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  /**
   * Mark order updates as read
   */
  const markOrderUpdatesAsRead = async () => {
    if (!user || !user.id) return;
  
    try {
      const token = user.token || localStorage.getItem("token") || localStorage.getItem("userToken");
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api").replace(/\/$/, "");
  
      // Ajustez ce chemin également
      // Si vos routes sont montées avec /api/orders
      const url = `${apiUrl}/orders/users/${user.id}/orders/updates/read`;
      // Si vos routes sont montées avec /api
      // const url = `${apiUrl}/users/${user.id}/orders/updates/read`;
  
      console.log("URL pour marquer les mises à jour comme lues:", url);
  
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Rafraîchir les compteurs après avoir marqué comme lus
      fetchOrderCount();
    } catch (error) {
      console.error("Erreur lors du marquage des mises à jour comme lues:", error);
    }
  };

  // Fetch order count when user is loaded or changes
  useEffect(() => {
    if (user && user.id) {
      fetchOrderCount();

      // Set up interval to refresh order count
      const intervalId = setInterval(fetchOrderCount, 60000); // Check every minute
      return () => clearInterval(intervalId);
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
                          <NextLink
                            className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                            href="/orders"
                            onClick={() => {
                              setIsMenuOpen(false);
                              markOrderUpdatesAsRead();
                            }}
                          >
                            <FontAwesomeIcon
                              className="mr-3 text-blue-600 dark:text-blue-400 w-5"
                              icon={faNewspaper}
                            />
                            <span className="flex-1">Mes commandes</span>
                            <div className="flex items-center space-x-1">
                              {orderCount.pending > 0 && (
                                <span className="text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">
                                  {orderCount.pending}
                                </span>
                              )}
                              {orderCount.shipped > 0 && (
                                <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                                  {orderCount.shipped}
                                </span>
                              )}
                              <span className="text-xs text-gray-400">
                                ({orderCount.total})
                              </span>
                            </div>
                          </NextLink>
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
                    key={""}
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
                          {orderCount.pending}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>Mes commandes envoyées</div>
                        <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                          {orderCount.shipped}
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

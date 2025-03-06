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

// Définir le type pour l'utilisateur
type User = {
  id: string;
  pseudo: string;
  email: string;
  avatar?: string;
  role: string;
  token?: string; // Ajouté pour la vérification du token
};

// Fonction pour obtenir l'icône appropriée pour chaque élément de navigation
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

  return iconMap[label] || faInfoCircle; // Icône par défaut si aucune correspondance
};

// Fonction pour vérifier la validité du token
const verifyToken = async (token: string): Promise<boolean> => {
  // Vérification simple pour éviter les appels API inutiles
  if (!token) return false;

  try {
    // Remplacer par votre endpoint API réel pour vérifier le token
    const response = await fetch("/api/auth/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ajouter le token dans les headers pour sécurité
      },
      body: JSON.stringify({ token }),
      // Ajouter ces options pour s'assurer que les cookies sont envoyés
      credentials: "include",
    });

    if (!response.ok) {
      console.warn("Token verification failed with status:", response.status);

      return false;
    }

    const data = await response.json();

    return data.valid === true;
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);

    return false;
  }
};

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false); // Flag pour éviter les vérifications multiples
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [avatarColorIndex, setAvatarColorIndex] = useState(0);

  // Couleurs pour l'animation des avatars
  const adminColors = ["#FF0000", "#FF3333", "#FF6666", "#FF9999"];
  const userColors = ["#0066FF", "#3399FF", "#66CCFF", "#99DDFF"];
  const guestColors = ["#000000", "#333333", "#666666", "#999999"];

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  // Auto theme updater based on time of day
  useEffect(() => {
    // Only run if mounted
    if (!mounted) return;

    // Function to update theme based on time
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

        // Force re-render
        setAvatarColorIndex((prev) => prev);
      }
    };

    // Update theme immediately
    updateThemeByTime();

    // Set interval to check every minute
    const interval = setInterval(updateThemeByTime, 60000);

    return () => clearInterval(interval);
  }, [mounted]);

  // Animation des couleurs d'avatar
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setAvatarColorIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 1500);

    return () => clearInterval(colorInterval);
  }, []);

  // Ajout d'un effet de débogage pour vérifier que l'index change bien
  useEffect(() => {
    console.log("Avatar color index changed:", avatarColorIndex);
  }, [avatarColorIndex]);

  // ✅ Ferme le menu quand on clique à l'extérieur
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
   * Gérer un token invalide
   */
  const handleTokenInvalid = () => {
    // Éviter de montrer plusieurs alertes
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
        // Effacer les données utilisateur invalides
        const userId = user?.id;

        localStorage.removeItem("user");
        if (userId) {
          localStorage.removeItem(`cart_${userId}`);
        }
        setUser(null);
        setCartItemsCount(0);

        // Déclencher l'événement de mise à jour
        const event = new CustomEvent("userUpdate");

        window.dispatchEvent(event);

        // Rediriger vers la page de connexion
        router.push("/users/login");
      }
    });
  };

  /**
   * Vérifier la validité du token
   */
  const checkTokenValidity = async () => {
    // Éviter les vérifications multiples
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
   * Récupérer l'utilisateur et son panier depuis le stockage local
   * Vérifier la validité du token uniquement lors de l'initialisation
   * et non à chaque rafraichissement
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

        // Vérification initiale du token - commentez cette ligne si vous voulez désactiver temporairement
        // checkTokenValidity();
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Vérifier périodiquement la validité du token (toutes les 30 minutes)
    // Prolonger l'intervalle pour éviter des vérifications trop fréquentes
    const intervalId = setInterval(checkTokenValidity, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  /**
   * Mettre à jour l'utilisateur et le panier lorsqu'un événement "userUpdate" est déclenché
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
   * Déconnexion de l'utilisateur
   */
  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté(e) et votre panier sera vidé.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4169E1", // Royal Blue au lieu de vert #4CAF50
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
   * Redirection vers la page de connexion ou d'inscription
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
                    className="bg-transparent"
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
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onClick={() => router.push("/profile")}>
                    <FontAwesomeIcon className="mr-2" icon={faUser} />
                    Profil
                  </DropdownItem>
                  <DropdownItem onClick={() => router.push("/shop")}>
                    <FontAwesomeIcon className="mr-2" icon={faShoppingCart} />
                    Shop
                  </DropdownItem>
                  <DropdownItem onClick={() => router.push("/controle")}>
                    <FontAwesomeIcon className="mr-2" icon={faNewspaper} />
                    Controle
                  </DropdownItem>
                  {/* mode */}
                  <DropdownItem>
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
                  <DropdownItem onClick={handleLogout}>
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

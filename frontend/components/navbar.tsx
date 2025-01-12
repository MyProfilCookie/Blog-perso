"use client";
import React, { useState, useEffect } from "react";
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
  faBook,
  faNewspaper,
  faCrown,
  faTachometerAlt,
  faShoppingCart,
  faBars,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, AutismLogo } from "@/components/icons";
import { motion } from "framer-motion";

// Définir le type pour l'utilisateur
type User = {
  id: string;
  pseudo: string;
  email: string;
  avatar?: string;
  role: string;
};

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  /**
   * Charger l'utilisateur et le panier depuis le localStorage
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      const userCart = localStorage.getItem(`cart_${parsedUser.id}`);

      if (userCart) {
        setCartItemsCount(JSON.parse(userCart).length);
      }
    }
  }, []);

  /**
   * Mettre à jour l'utilisateur et le panier lorsqu'un événement "userUpdate" est déclenché
   */
  useEffect(() => {
    const handleUserUpdate = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);

        const userCart = localStorage.getItem(`cart_${parsedUser.id}`);

        setCartItemsCount(userCart ? JSON.parse(userCart).length : 0);
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
      confirmButtonColor: "#4CAF50",
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
      className="dark:bg-gray-900"
      maxWidth="xl"
      position="sticky"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <AutismLogo />
            <p className="font-bold text-blue-800 dark:text-white">AutiStudy</p>
          </NextLink>
        </NavbarBrand>

        <NavbarMenuToggle
          aria-label="Toggle navigation"
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </NavbarMenuToggle>

        {/* Onglets visibles dans la barre de navigation */}
        <ul className="hidden gap-4 ml-2 lg:flex">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.label}>
              <NextLink
                className="text-gray-700 dark:text-gray-300 hover:text-green-500"
                href={String(item.href)}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}

          <NavbarItem key="shop" className="relative">
            <NextLink
              className="text-gray-700 dark:text-gray-300 hover:text-green-500 flex items-center relative"
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
        </ul>

        {/* Menu burger pour mobile */}
        {isMenuOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="lg:hidden dark:bg-gray-900 bg-white w-full shadow-md absolute top-full left-0 z-20"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col items-start p-4 gap-4">
              {siteConfig.navItems.map((item) => (
                <li key={item.label}>
                  <NextLink
                    className="text-gray-700 dark:text-gray-300 hover:text-green-500"
                    href={String(item.href)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </NextLink>
                </li>
              ))}
              <li className="relative">
                <NextLink
                  className="text-gray-700 dark:text-gray-300 hover:text-green-500 flex items-center relative"
                  href="/shop"
                  onClick={() => setIsMenuOpen(false)}
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
              </li>
              <li>
                <NextLink
                  className="text-gray-700 dark:text-gray-300 hover:text-green-500"
                  href="/blog"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </NextLink>
              </li>
              <li>
                <NextLink
                  className="text-gray-700 dark:text-gray-300 hover:text-green-500"
                  href="/courses"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </NextLink>
              </li>
            </ul>
          </motion.div>
        )}
      </NavbarContent>

      <NavbarContent className="sm:flex basis-1/5 sm:basis-full" justify="end">
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
            className="cursor-pointer text-tiny text-default-500"
            color="danger"
            name="Invité"
            size="sm"
            src="/assets/default-avatar.webp"
            onClick={handleLoginRedirect}
          />
        ) : (
          <Dropdown>
            <DropdownTrigger>
              <Button aria-label="Menu utilisateur" className="bg-transparent">
                <Avatar
                  isBordered
                  alt={`Avatar de ${user?.pseudo}`}
                  color="success"
                  size="sm"
                  src={user?.avatar || "/assets/default-avatar.webp"}
                />
                <span className="ml-2 hidden lg:inline dark:text-white">
                  {user?.pseudo || "Utilisateur"}
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem onClick={() => router.push("/profile")}>
                <FontAwesomeIcon icon={faUser} />
                Profil
              </DropdownItem>
              <DropdownItem onClick={() => router.push("/shop")}>
                <FontAwesomeIcon icon={faShoppingCart} />
                Shop
              </DropdownItem>
              <DropdownItem onClick={() => router.push("/blog")}>
                <FontAwesomeIcon icon={faNewspaper} />
                Blog
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                Déconnexion
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};

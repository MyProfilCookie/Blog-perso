"use client";
import React, { useState, useEffect } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
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
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, AutismLogo } from "@/components/icons";

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
  const [cartItemsCount, setCartItemsCount] = useState<number>(0); // État pour le panier
  const router = useRouter();

  // Charger l'utilisateur depuis le localStorage lors du montage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setUser({
        ...parsedUser,
        role: parsedUser.role,
      });
    }
  }, []);

  // Écouter l'événement personnalisé pour mettre à jour l'état de l'utilisateur
  useEffect(() => {
    const handleUserUpdate = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setUser({
          ...parsedUser,
          role: parsedUser.role,
        });
      } else {
        setUser(null);
      }
    };

    window.addEventListener("userUpdate", handleUserUpdate);

    return () => {
      window.removeEventListener("userUpdate", handleUserUpdate);
    };
  }, []);

  const handleLoginRedirect = () => {
    router.replace("/users/login");
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté(e).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#FFB74D",
      confirmButtonText: "Oui, déconnectez-moi !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        setUser(null);

        const event = new CustomEvent("userUpdate");

        window.dispatchEvent(event);

        Swal.fire({
          title: "Déconnexion réussie",
          text: "Vous avez été déconnecté(e).",
          icon: "success",
          confirmButtonText: "Ok",
          customClass: {
            confirmButton: "bg-green-400 text-white",
          },
        }).then(() => {
          router.replace("/");
        });
      }
    });
  };

  // Fonction pour ajouter un article au panier
  const handleAddToCart = (article: any) => {
    setCartItemsCount(cartItemsCount + 1); // Incrémente le nombre d'articles dans le panier
    console.log(`Article ajouté au panier: ${article.title}`);
  };

  return (
    <NextUINavbar
      maxWidth="xl"
      position="sticky"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Section gauche (logo et navigation principale) */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <AutismLogo />
            <p className="font-bold text-blue-800">AutiStudy</p>
          </NextLink>
        </NavbarBrand>

        <ul className="justify-start hidden gap-4 ml-2 lg:flex">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.label}>
              <NextLink
                className="text-gray-700 hover:text-green-500"
                href={String(item.href)}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}

          {/* Ajout de la page Shop avec l'icône du panier et la bulle */}
          <NavbarItem key="shop" className="relative">
            <NextLink
              className="text-gray-700 hover:text-green-500 flex items-center relative"
              href="/shop"
            >
              <FontAwesomeIcon className="mr-2" icon={faShoppingCart} />
              Shop
              {/* Afficher le Badge uniquement si cartItemsCount > 0 */}
              {cartItemsCount > 0 && (
                <Badge
                  className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
                  color="danger"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </NextLink>
          </NavbarItem>

          {user?.role === "admin" && (
            <NavbarItem key="maeva">
              <NextLink
                className="text-gray-700 hover:text-green-500"
                href="/maeva"
              >
                Maeva
              </NextLink>
            </NavbarItem>
          )}
        </ul>
      </NavbarContent>

      {/* Section droite (actions utilisateur et autres) */}
      <NavbarContent className="sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden gap-2 sm:flex">
          <Link
            isExternal
            aria-label="Github"
            className="text-gray-500"
            href={siteConfig.links.github}
          >
            <GithubIcon className="text-gray-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>

        {/* Afficher un lien Dashboard dynamique si l'utilisateur est connecté */}
        {user && (
          <NavbarItem className="hidden md:flex">
            <Button
              aria-label={
                user.role === "admin" ? "Dashboard Admin" : "Dashboard"
              }
              as={Link}
              className="text-sm font-normal text-gray-600 bg-gray-200 hover:bg-gray-300"
              href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              onPress={() =>
                router.push(
                  user.role === "admin" ? "/admin/dashboard" : "/dashboard",
                )
              }
            >
              <FontAwesomeIcon
                className="mr-2"
                icon={user.role === "admin" ? faCrown : faTachometerAlt}
              />
              {user.role === "admin" ? "Dashboard Admin" : "Dashboard"}
            </Button>
          </NavbarItem>
        )}

        {/* Avatar et menu utilisateur */}
        {!user ? (
          <Avatar
            isBordered
            showFallback
            aria-label="Connectez-vous pour accéder à votre profil"
            className="cursor-pointer text-tiny text-default-500"
            color="danger"
            name="Joe"
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
                  aria-label={`Avatar de ${user?.pseudo}`}
                  color="success"
                  size="sm"
                  src={user?.avatar || "/assets/default-avatar.webp"}
                />
                <span className="ml-2">{user?.pseudo || "Utilisateur"}</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Menu des utilisateurs">
              <DropdownItem
                key="courses"
                className="text-gray-600 hover:text-green-500"
                textValue="Cours"
                onClick={() => router.replace("/controle")}
              >
                <FontAwesomeIcon icon={faBook} />
                <span className="ml-2">Cours suivis</span>
              </DropdownItem>

              <DropdownItem
                key="articles"
                className="text-gray-600 hover:text-green-500"
                textValue="Articles"
                onClick={() => router.replace("/articles")}
              >
                <FontAwesomeIcon icon={faNewspaper} />
                <span className="ml-2">Articles suivis</span>
              </DropdownItem>

              <DropdownItem
                key="logout"
                className="text-gray-600 hover:text-green-500"
                textValue="Déconnexion"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span className="ml-2">Déconnexion</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};

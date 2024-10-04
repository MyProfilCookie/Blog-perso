/* eslint-disable react/jsx-sort-props */
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
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faUser,
  faBook,
  faNewspaper,
  faCrown, // Import de l'icône couronne
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation"; // Utiliser useRouter pour les redirections

import SearchBar from "@/components/search";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, HeartFilledIcon, AutismLogo } from "@/components/icons";

// Définir le type pour l'utilisateur
type User = {
  id: string;
  pseudo: string;
  email: string;
  avatar?: string; // Facultatif
  isAdmin: boolean; // Ajout du booléen isAdmin
};

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null); // Utilisation du type User
  const [searchQuery, setSearchQuery] = useState(""); // Ajout de l'état searchQuery
  const router = useRouter(); // Utiliser le routeur ici

  // Charger l'utilisateur depuis le localStorage lors du montage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // On se fie directement à isAdmin pour savoir si l'utilisateur est admin
      const userWithAdminStatus = {
        ...parsedUser,
        isAdmin: parsedUser.isAdmin, // Utilisation de isAdmin depuis localStorage
      };

      // Vérification du contenu de l'utilisateur
      setUser(userWithAdminStatus); // Charger l'utilisateur avec isAdmin
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
          isAdmin: parsedUser.isAdmin, // Reprise de l'état isAdmin
        });
      } else {
        setUser(null);
      }
    };

    // Ajouter un écouteur pour l'événement "userUpdate"
    window.addEventListener("userUpdate", handleUserUpdate);

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener("userUpdate", handleUserUpdate);
    };
  }, []);

  const handleLoginRedirect = () => {
    router.replace("/users/login"); // Rediriger vers la page de login
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
        localStorage.removeItem("user"); // Supprimer l'utilisateur du localStorage
        setUser(null); // Supprimer l'utilisateur de l'état local

        // Déclencher un événement personnalisé
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
          router.replace("/"); // Rediriger vers la page d'accueil après la déconnexion
        });
      }
    });
  };

  return (
    <NextUINavbar
      maxWidth="xl"
      position="sticky"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <AutismLogo />
            <p className="font-bold text-blue-800">AutiStudy</p>
          </NextLink>
        </NavbarBrand>

        <ul className="justify-start hidden gap-4 ml-2 lg:flex">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={String(item.href)}>
              <NextLink
                className="text-gray-700 hover:text-green-500"
                href={String(item.href)}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
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

        <NavbarItem className="hidden lg:flex">
          <SearchBar
            searchQuery={searchQuery} // Correction de la gestion de searchQuery
            setSearchQuery={setSearchQuery}
          />
        </NavbarItem>

        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            aria-label="Sponsor"
            as={Link}
            className="text-sm font-normal text-gray-600 bg-gray-200 hover:bg-gray-300"
            href={siteConfig.links.sponsor}
          >
            <HeartFilledIcon className="text-red-400" />
            Sponsor
          </Button>
        </NavbarItem>

        {/* Affichage du lien admin si l'utilisateur est admin */}
        {user?.isAdmin && (
          <NavbarItem className="hidden md:flex">
            <Button
              aria-label="Dashboard Admin"
              as={Link}
              className="text-sm font-normal text-gray-600 bg-gray-200 hover:bg-gray-300"
              href="/admin/dashboard"
            >
              <FontAwesomeIcon
                className="mr-2 text-yellow-500"
                icon={faCrown}
              />
              Dashboard Admin
            </Button>
          </NavbarItem>
        )}

        {!user ? (
          <Avatar
            isBordered
            showFallback
            aria-label="Connectez-vous pour accéder à votre profil"
            className="cursor-pointer text-tiny text-default-500"
            color="success"
            name="Joe"
            size="sm"
            src="/default-avatar.webp"
            onClick={handleLoginRedirect}
          />
        ) : (
          <Dropdown>
            <DropdownTrigger>
              <Button
                aria-label="Menu utilisateur"
                className="text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
                <Avatar
                  alt="Avatar de l'utilisateur"
                  aria-label={`Avatar de ${user?.pseudo || "Utilisateur"}`}
                  size="sm"
                  src={user?.avatar || "/default-avatar.webp"}
                />
                <span className="ml-2">{user?.pseudo || "Utilisateur"}</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Menu des utilisateurs">
              <DropdownItem
                key="profile"
                className="text-gray-600 hover:text-green-500"
                textValue="Profil"
                onClick={() => router.replace("/profile")}
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="ml-2">Profil</span>
              </DropdownItem>
              <DropdownItem
                key="courses"
                className="text-gray-600 hover:text-green-500"
                textValue="Cours"
                onClick={() => router.replace("/controle")}
              >
                <FontAwesomeIcon icon={faBook} />
                <span className="ml-2">Cours suivis</span>
              </DropdownItem>
              {user?.isAdmin ? (
                <DropdownItem
                  className="text-gray-600 hover:text-green-500"
                  key="admin"
                  textValue="Dashboard Admin"
                  onClick={() => router.replace("/admin/dashboard")}
                >
                  <FontAwesomeIcon icon={faCrown} />
                  <span className="ml-2">Dashboard Admin</span>
                </DropdownItem>
              ) : null}
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

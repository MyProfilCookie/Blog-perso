// AutiStudy Header Component
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  _id: string;
  pseudo: string;
  role: string;
  image?: string;
}

// Navigation links
const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Produits" },
  { href: "/formations", label: "Formations" },
  { href: "/articles", label: "Articles" },
  { href: "/contact", label: "Contact" },
];

const AutiStudyHeader = ({ user }: { user: User | null }) => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    // Implement logout functionality
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    window.location.href = "/users/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and brand */}
        <div className="flex items-center">
          <Link className="flex items-center gap-2" href="/">
            <Image
              alt="AutiStudy"
              className="rounded"
              height={40}
              src="/logo-autistudy.png"
              width={40}
            />
            <span className="text-2xl font-bold text-blue-700">AutiStudy</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            aria-label="Toggle theme"
            className="rounded-full"
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </Button>

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full relative hover:bg-muted"
                  variant="ghost"
                >
                  <Avatar className="h-9 w-9 border-2 border-primary">
                    <AvatarImage
                      alt={user.pseudo}
                      src={user.image || "/assets/default-avatar.webp"}
                    />
                    <AvatarFallback>
                      {user.pseudo.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.role === "admin" && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.pseudo}</p>
                    {user.role === "admin" && (
                      <p className="text-xs text-muted-foreground">
                        Administrateur
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Mon profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mes-commandes">Mes commandes</Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Tableau de bord Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={handleLogout}
                >
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline">
              <Link href="/users/login">Connexion</Link>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="ghost">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-xs" side="right">
              <nav className="flex flex-col gap-4 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    className="text-base font-medium"
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  className="text-base font-medium border-t pt-4 mt-2"
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon profil
                </Link>
                {user?.role === "admin" && (
                  <Link
                    className="text-base font-medium"
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Administration
                  </Link>
                )}
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AutiStudyHeader;

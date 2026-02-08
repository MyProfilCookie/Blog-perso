"use client";
export const dynamic = "force-dynamic";

import * as React from "react";
import { useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { Input } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { Checkbox } from '@nextui-org/react';
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Link from "next/link";

import { normalizeAvatarUrl } from "@/utils/normalizeAvatarUrl";
import axios from "axios";

import { AutismLogo } from "@/components/icons"; // Vérifie le bon chemin

declare global {
  interface Window {
    google?: any;
  }
}

export default function Connexion() {
  const userContext = useContext(UserContext) as any;
  const user = userContext?.user;
  const loginUser = userContext?.loginUser;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false); // Checkbox newsletter
  const [loading, setLoading] = useState(false); // État de chargement
  const [passwordStrength, setPasswordStrength] = useState(""); // Force du mot de passe
  const [failedAttempts, setFailedAttempts] = useState(0); // Compteur de tentatives échouées
  const [showResetOption, setShowResetOption] = useState(false); // Afficher option reset
  const router = useRouter();
  const searchParams = useSearchParams();
  const [returnUrl, setReturnUrl] = React.useState("/profile");
  const googleButtonRef = React.useRef<HTMLDivElement | null>(null);
  const googleInitialized = React.useRef(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const disableMotion = true;
  const instantTransition = { duration: 0 };
  const isGoogleAuthEnabled = Boolean(googleClientId);

  const getSafeReturnUrl = React.useCallback(
    (value?: string | null) => {
      if (typeof window === "undefined" || !value) {
        return null;
      }

      try {
        const url = new URL(value, window.location.origin);

        if (url.origin !== window.location.origin) {
          return null;
        }

        const path = `${url.pathname}${url.search}${url.hash}`;
        return path === "" ? "/" : path;
      } catch {
        return value.startsWith("/") ? value : null;
      }
    },
    [],
  );

  // Sauvegarder la page actuelle au chargement
  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const paramValue = searchParams.get("returnUrl");
    const sessionValue = sessionStorage.getItem("returnUrl");
    const referrerValue = window.document.referrer;

    const safeReturnUrl =
      getSafeReturnUrl(paramValue) ??
      getSafeReturnUrl(sessionValue) ??
      getSafeReturnUrl(referrerValue) ??
      "/profile";

    setReturnUrl(safeReturnUrl);

    if (!paramValue && referrerValue) {
      const sanitizedReferrer = getSafeReturnUrl(referrerValue);
      if (sanitizedReferrer && sanitizedReferrer !== "/profile") {
        sessionStorage.setItem("returnUrl", sanitizedReferrer);
      } else {
        sessionStorage.removeItem("returnUrl");
      }
    }
  }, [searchParams, getSafeReturnUrl]);

  // Rediriger si l'utilisateur est déjà connecté
  React.useEffect(() => {
    if (user) {
      const destination = getSafeReturnUrl(returnUrl) ?? "/profile";
      router.push(destination);
    }
  }, [user, router, returnUrl, getSafeReturnUrl]);

  // Fonction de validation du mot de passe
  const validatePassword = (value: string) => {
    const lengthValid = value.length >= 8;
    const specialCharValid = /[!@#$%^&*]/.test(value);

    if (!lengthValid || !specialCharValid) {
      setPasswordStrength(
        "Mot de passe faible (8 caractères minimum et un caractère spécial)",
      );
    } else {
      setPasswordStrength("Mot de passe fort");
    }
  };

  const handleGoogleCredential = React.useCallback(
    async (credentialResponse: any) => {
      const credential = credentialResponse?.credential;
      if (!credential) {
        return;
      }

      setLoading(true);

      try {
        const apiUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
        ).replace(/\/$/, "");

        const response = await axios.post(`${apiUrl}/users/google-login`, {
          credential,
        });

        if (response.data && response.data.accessToken) {
          localStorage.setItem("userToken", response.data.accessToken);

          if (response.data.user) {
            const userData = {
              ...response.data.user,
              avatar: normalizeAvatarUrl(
                response.data.user.avatar || response.data.user.image,
              ),
              image: normalizeAvatarUrl(
                response.data.user.avatar || response.data.user.image,
              ),
            };

            localStorage.setItem("user", JSON.stringify(userData));
            loginUser?.(userData);

            Swal.fire({
              icon: "success",
              title: "Connexion réussie",
              text: `Bienvenue sur AutiStudy, ${
                userData.pseudo || userData.prenom || userData.nom || userData.email
              } !`,
              confirmButtonText: "Ok",
            }).then(() => {
              sessionStorage.removeItem("returnUrl");
              window.dispatchEvent(new CustomEvent("userLoggedIn", { detail: userData }));
              
              // Redirection spéciale pour Maeva vers son espace personnel
              const MAEVA_EMAIL = "maevaayivor78500@gmail.com";
              if (userData.email?.toLowerCase() === MAEVA_EMAIL.toLowerCase()) {
                router.push("/espace-maeva");
              } else {
                const destination = getSafeReturnUrl(returnUrl) ?? "/profile";
                router.push(destination);
              }
            });
          }
        } else {
          throw new Error(response.data?.message || "Réponse inattendue du serveur");
        }
      } catch (error: any) {
        console.error("❌ Connexion Google échouée:", error);
        Swal.fire({
          icon: "error",
          title: "Connexion Google impossible",
          text:
            error?.response?.data?.message ||
            error?.message ||
            "Veuillez réessayer ou utiliser votre mot de passe.",
          confirmButtonText: "Ok",
        });
      } finally {
        setLoading(false);
      }
    },
    [loginUser, returnUrl, router, getSafeReturnUrl],
  );

  React.useEffect(() => {
    if (typeof window === "undefined" || !isGoogleAuthEnabled) {
      return;
    }

    const initialize = () => {
      if (!window.google || googleInitialized.current || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: googleButtonRef.current.offsetWidth || 280,
      });

      googleInitialized.current = true;
    };

    if (window.google && window.google.accounts && window.google.accounts.id) {
      initialize();
      return () => {
        window.google?.accounts?.id?.cancel();
      };
    }

    const existingScript = document.getElementById("google-identity-service");

    if (existingScript) {
      existingScript.addEventListener("load", initialize, { once: true });
      return () => {
        existingScript.removeEventListener("load", initialize);
        window.google?.accounts?.id?.cancel();
      };
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-identity-service";
    script.onload = initialize;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
      window.google?.accounts?.id?.cancel();
    };
  }, [isGoogleAuthEnabled, handleGoogleCredential]);

  if (user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AutismLogo size={48} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
            Redirection en cours...
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Vous êtes déjà connecté, redirection vers votre dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Fonction de gestion de la connexion
  const handleLogin = async () => {
    // Validation de l'email (doit ressembler à un email)
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez entrer une adresse email valide.",
        confirmButtonText: "Ok",
      });

      return;
    }

    // Validation du mot de passe
    const passwordRegex = /^(?=.*[!@#$%^&*])/;

    if (password.length < 8 || !passwordRegex.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le mot de passe doit comporter au moins 8 caractères et contenir un caractère spécial.",
        confirmButtonText: "Ok",
      });

      return;
    }

    setLoading(true);

    try {
      console.log("🔍 Tentative de connexion pour:", email);
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      ).replace(/\/$/, "");

      console.log("🔍 URL API:", apiUrl);

      const response = await axios.post(`${apiUrl}/users/login`, {
        email,
        password,
      });

      console.log("✅ Réponse de connexion:", response.status);

      // Vérifier si la réponse contient un token et un utilisateur
      if (response.data && response.data.accessToken) {
        // Stocker le token
        console.log(
          "🔑 Token reçu (début):",
          response.data.accessToken.substring(0, 15) + "...",
        );
        localStorage.setItem("userToken", response.data.accessToken);

        // Vérifier que le token est bien stocké
        const storedToken = localStorage.getItem("userToken");

        console.log(
          "🔍 Token stocké dans localStorage:",
          storedToken ? "OUI" : "NON",
        );

        // Stocker les informations utilisateur
        if (response.data.user) {
          // Normaliser les données utilisateur
          const userData = {
            ...response.data.user,
            avatar: normalizeAvatarUrl(
              response.data.user.avatar || response.data.user.image,
            ),
            image: normalizeAvatarUrl(
              response.data.user.avatar || response.data.user.image,
            ),
            role: response.data.user.role || "user",
            deliveryAddress: response.data.user.deliveryAddress || {
              street: "Adresse inconnue",
              city: "Ville inconnue",
              postalCode: "Code postal inconnu",
              country: "France",
            },
          };

          localStorage.setItem("user", JSON.stringify(userData));
          console.log(
            "✅ Données utilisateur stockées:",
            userData.pseudo || userData.email,
          );

          // Mettre à jour le contexte d'authentification
          loginUser(userData);

          // Afficher le succès et rediriger
          Swal.fire({
            icon: "success",
            title: "Connexion réussie",
            text: `Bienvenue sur AutiStudy, ${userData.pseudo || userData.prenom || userData.nom || userData.email}!`,
            confirmButtonText: "Ok",
          }).then(() => {
            // Nettoyer le returnUrl du sessionStorage
            sessionStorage.removeItem("returnUrl");
            
            // Déclencher l'événement de mise à jour du panier pour fusionner
            window.dispatchEvent(new CustomEvent("userLoggedIn", { detail: userData }));
            
            // Redirection spéciale pour Maeva vers son espace personnel
            const MAEVA_EMAIL = "maevaayivor78500@gmail.com";
            if (userData.email?.toLowerCase() === MAEVA_EMAIL.toLowerCase()) {
              router.push("/espace-maeva");
            } else {
              // Rediriger vers la page d'origine ou profil
              const destination = getSafeReturnUrl(returnUrl) ?? "/profile";
              router.push(destination);
            }
          });
        } else {
          handleLoginError(
            400,
            "Données utilisateur manquantes dans la réponse",
          );
        }
      } else {
        console.error("❌ Réponse incorrecte:", response.data);
        handleLoginError(400, "Token manquant dans la réponse");
      }
    } catch (error: any) {
      console.error("❌ Erreur de connexion:", error);

      if (error.response) {
        console.log(
          "❌ Détails de l'erreur:",
          error.response.status,
          error.response.data,
        );
        handleLoginError(
          error.response.status,
          error.response.data.message || "Erreur inconnue",
        );
      } else {
        handleLoginError(500, "Erreur de connexion au serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = (status: number, message: string) => {
    if (status === 404) {
      Swal.fire({
        icon: "error",
        title: "Utilisateur non trouvé",
        text: "Il semble que vous ne soyez pas encore inscrit(e). Souhaitez-vous vous inscrire maintenant ?",
        showCancelButton: true,
        confirmButtonText: "Oui, m'inscrire",
        cancelButtonText: "Annuler",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/users/signup");
        }
      });
    } else if (status === 401) {
      // Incrémenter le compteur de tentatives échouées
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        // Après 3 tentatives, proposer le reset du mot de passe
        setShowResetOption(true);
        Swal.fire({
          icon: "warning",
          title: "Mot de passe incorrect",
          html: `<p>Vous avez fait ${newAttempts} tentatives.</p><p class="mt-2">Souhaitez-vous réinitialiser votre mot de passe ?</p>`,
          showCancelButton: true,
          confirmButtonText: "Réinitialiser mon mot de passe",
          cancelButtonText: "Réessayer",
          confirmButtonColor: "#3b82f6",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/forgot-password?email=" + encodeURIComponent(email));
          }
        });
      } else {
        const remainingAttempts = 3 - newAttempts;
        Swal.fire({
          icon: "error",
          title: "Mot de passe incorrect",
          text: `Il vous reste ${remainingAttempts} tentative${remainingAttempts > 1 ? 's' : ''} avant de pouvoir réinitialiser votre mot de passe.`,
          confirmButtonText: "Réessayer",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: message || "Erreur serveur",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 md:py-2"
      initial={{ opacity: 1, y: 0 }}
      transition={instantTransition}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6 w-full max-w-[90%] md:max-w-[400px]"
        initial={{ opacity: 1, y: 0 }}
        transition={instantTransition}
      >
        <AutismLogo className="mx-auto mb-2" size={40} />
        <h1 className="text-2xl md:text-4xl font-bold text-center text-blue-600">
          Bienvenue sur AutiStudy
        </h1>
      </motion.div>

      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6 text-base md:text-lg text-center text-gray-600 px-4"
        initial={{ opacity: 1, y: 0 }}
        transition={instantTransition}
      >
        Connectez-vous pour accéder à des ressources adaptées et un suivi personnalisé.
      </motion.p>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 w-full max-w-[90%] md:max-w-[400px] px-4"
        initial={{ opacity: 1, y: 0 }}
        transition={instantTransition}
      >
        <Input
          required
          label="Email"
          placeholder="exemple@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          classNames={{
            input: "text-gray-900 dark:text-white",
            inputWrapper: "bg-white dark:bg-slate-900",
            label: "text-gray-700 dark:text-gray-300",
            description: "text-gray-500 dark:text-gray-400",
            errorMessage: "text-red-500",
          }}
        />

        <Input
          required
          label="Mot de passe"
          placeholder="8 caractères min. + caractère spécial"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          className="w-full"
          classNames={{
            input: "text-gray-900 dark:text-white",
            inputWrapper: "bg-white dark:bg-slate-900",
            label: "text-gray-700 dark:text-gray-300",
            description: "text-gray-500 dark:text-gray-400",
            errorMessage: "text-red-500",
          }}
        />
        {password && (
          <p
            className={`text-xs md:text-sm ${
              passwordStrength.includes("faible") ? "text-red-500" : "text-green-500"
            }`}
          >
            {passwordStrength}
          </p>
        )}

        {/* Lien mot de passe oublié - toujours visible ou après 3 tentatives */}
        <div className="text-right">
          <Link
            href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
            className={`text-sm hover:underline ${
              showResetOption 
                ? 'text-orange-600 dark:text-orange-400 font-semibold animate-pulse' 
                : 'text-blue-600 dark:text-blue-400'
            }`}
          >
            {showResetOption ? '⚠️ Réinitialiser mon mot de passe' : 'Mot de passe oublié ?'}
          </Link>
        </div>

        <Checkbox 
          isSelected={newsletter} 
          onValueChange={setNewsletter}
          className="text-sm md:text-base"
        >
          S&apos;inscrire à la newsletter
        </Checkbox>

        <Button
          className="mt-2 w-full"
          color="primary"
          isLoading={loading}
          onClick={handleLogin}
          size="lg"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </Button>

        {isGoogleAuthEnabled ? (
          <>
            <div className="relative my-4 flex items-center gap-2">
              <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">
                ou
              </span>
              <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>
            <div
              ref={googleButtonRef}
              className={`flex justify-center transition-opacity ${loading ? "pointer-events-none opacity-60" : "opacity-100"}`}
              style={{ minHeight: 48 }}
            />
          </>
        ) : (
          <div className="rounded-md bg-gray-100 dark:bg-gray-800 px-4 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
            Connexion Google désactivée. Ajoutez la variable <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> pour l'activer.
          </div>
        )}

        <div className="mt-4 text-center text-sm md:text-base">
          <p className="mb-2">Vous n&apos;avez pas de compte ?</p>
          <Button
            color="secondary"
            variant="light"
            onClick={() => router.push("/users/signup")}
            className="w-full md:w-auto"
          >
            S&apos;inscrire
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* eslint-disable no-console */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/back";

interface SubscriptionInfo {
  type: "free" | "premium";
  status: "active" | "expired" | "cancelled";
  startDate: string | null;
  endDate: string | null;
}

interface UserSubscription {
  subscription: SubscriptionInfo;
  role: string;
  dailyExerciseCount: number;
}

const SubscriptionPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth() || {
    user: null,
    isAuthenticated: () => false,
  };
  const { authenticatedGet, authenticatedPost } = useAuthenticatedApi();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<UserSubscription | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripe, setStripe] = useState<any>(null);

  // Éviter le flash hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      // Vérifier si nous sommes dans un environnement navigateur
      if (typeof window === "undefined") return;

      // Vérifier toutes les sources possibles de tokens
      const userToken = localStorage.getItem("userToken");
      const accessToken = localStorage.getItem("accessToken");
      const token = userToken || accessToken;

      // Si pas de token du tout, rediriger vers login sans afficher de logs
      if (!token) {
        router.push("/users/login");
        return;
      }

      // Vérifier si l'utilisateur est déjà sur la page de login pour éviter les boucles
      const isLoginPage = window.location.pathname === "/users/login";

      // Si déjà sur la page de login, ne pas continuer la vérification
      if (isLoginPage) {
        return;
      }

      // À partir d'ici, on sait qu'il y a un token, on peut afficher les logs
      console.log("=== VÉRIFICATION D'AUTHENTIFICATION ===");
      console.log("userToken:", userToken ? "Présent" : "Absent");
      console.log("accessToken:", accessToken ? "Présent" : "Absent");
      console.log("Token utilisé:", token ? "Présent" : "Absent");
      console.log("Est sur la page de login:", isLoginPage);

      // Vérifier si le token est expiré
      const isTokenExpired = (tokenToCheck: string): boolean => {
        try {
          const base64Url = tokenToCheck.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(atob(base64));

          // Vérifier si le token a une date d'expiration
          if (!payload.exp) {
            console.log("Token sans date d'expiration");
            return true;
          }

          // Comparer la date d'expiration avec la date actuelle
          const currentTime = Math.floor(Date.now() / 1000);
          const isExpired = payload.exp < currentTime;

          console.log(
            "Expiration du token:",
            new Date(payload.exp * 1000).toLocaleString(),
          );
          console.log(
            "Heure actuelle:",
            new Date(currentTime * 1000).toLocaleString(),
          );
          console.log("Token expiré:", isExpired);

          return isExpired;
        } catch (error) {
          console.error("Erreur lors de la vérification du token:", error);
          return true;
        }
      };

      // Si le token est expiré, essayer de le rafraîchir avant de rediriger
      if (isTokenExpired(token)) {
        console.log("Token expiré, tentative de rafraîchissement...");

        // Vérifier si un refreshToken est disponible
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            console.log("RefreshToken trouvé, tentative de rafraîchissement");

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
              },
            );

            if (response.ok) {
              const data = await response.json();

              if (data.accessToken) {
                console.log("Token rafraîchi avec succès");
                localStorage.setItem("userToken", data.accessToken);
                localStorage.setItem("accessToken", data.accessToken);

                if (data.refreshToken) {
                  localStorage.setItem("refreshToken", data.refreshToken);
                }

                // Continuer avec le token rafraîchi
                await fetchSubscriptionInfo();
                return;
              }
            }

            console.log("Échec du rafraîchissement du token");
          } catch (error) {
            console.error("Erreur lors du rafraîchissement du token:", error);
          }
        }

        // Si le rafraîchissement a échoué ou n'était pas possible, déconnecter l'utilisateur
        console.log("Déconnexion après échec de rafraîchissement");
        setSubscriptionInfo(null);
        localStorage.removeItem("userToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
        router.push("/users/login");
        return;
      }

      // À ce stade, nous avons un token valide
      console.log("Token valide, vérification du rôle...");

      try {
        // Récupérer les informations d'abonnement d'abord
        console.log("Chargement des informations d'abonnement");
        const subscriptionResponse = await authenticatedGet(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/info`,
        );

        if (subscriptionResponse.data && subscriptionResponse.data.role === "admin") {
          console.log("Utilisateur identifié comme admin via l'API");
          setSubscriptionInfo({
            subscription: {
              type: "premium",
              status: "active",
              startDate: null,
              endDate: null,
            },
            role: "admin",
            dailyExerciseCount: Infinity,
          });
          setLoading(false);
          return;
        }

        // Pour les utilisateurs non-admin, initialiser Stripe et charger les infos d'abonnement
        console.log("Utilisateur non-admin, initialisation de Stripe");
        const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

        if (!stripeKey) {
          throw new Error("Clé Stripe non trouvée");
        }

        const stripeInstance = await loadStripe(stripeKey);

        if (!stripeInstance) {
          throw new Error("Impossible d'initialiser Stripe");
        }

        setStripe(stripeInstance);
        setStripeLoaded(true);

        // Charger les informations d'abonnement
        console.log("Chargement des informations d'abonnement");
        await fetchSubscriptionInfo();
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
        setError("Erreur lors de l'initialisation du service de paiement");
        setLoading(false);
      }
    };

    if (mounted) {
      checkAuth();
    }
  }, [mounted, router]);

  if (!mounted) {
    return null;
  }

  const fetchSubscriptionInfo = async () => {
    const token = localStorage.getItem("userToken") || localStorage.getItem("accessToken");
    if (!token) {
      setError("Session expirée. Veuillez vous reconnecter.");
      router.push("/users/login");
      return;
    }

    try {
      const response = await authenticatedGet(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/info`,
      );

      if (!response.data || !response.data.subscription) {
        throw new Error("Données d'abonnement invalides");
      }

      // Vérifier si l'abonnement est expiré
      if (response.data.subscription.status === "expired") {
        setSubscriptionInfo({
          ...response.data,
          subscription: {
            ...response.data.subscription,
            type: "free",
            status: "expired",
          },
        });
      } else {
        setSubscriptionInfo(response.data);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des informations d'abonnement:",
        err,
      );

      // Vérifier si l'erreur est liée à l'authentification
      const status = (err as any).response?.status;

      if (status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        
        // Nettoyer le stockage local
        localStorage.removeItem("userToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
        
        // Éviter les redirections en boucle
        if (window.location.pathname !== "/users/login") {
          setTimeout(() => {
            router.push("/users/login");
          }, 2000);
        }
      } else {
        setError("Erreur lors du chargement des informations d'abonnement");
        // En cas d'erreur, définir l'utilisateur comme non premium
        setSubscriptionInfo({
          subscription: {
            type: "free",
            status: "active",
            startDate: null,
            endDate: null,
          },
          role: "user",
          dailyExerciseCount: 3,
        });
      }

      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!stripeLoaded || !stripe) {
      setError("Le service de paiement n'est pas encore initialisé");

      return;
    }

    try {
      setProcessingPayment(true);

      const response = await authenticatedPost(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/create-checkout-session`,
        {},
      );

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      console.error(
        "Erreur lors de la création de la session de paiement:",
        err,
      );

      // Si l'erreur est liée à l'authentification, l'intercepteur s'en chargera
      // Sinon, afficher l'erreur
      if ((err as any).response?.status !== 401) {
        setError("Erreur lors du traitement du paiement");
      }
      setProcessingPayment(false);
    }
  };

  const features = {
    free: [
      "3 exercices par jour",
      "Statistiques basiques",
      "Accès aux corrections",
      "Support par email",
    ],
    premium: [
      "Exercices illimités",
      "Statistiques détaillées",
      "Historique complet",
      "Export des données",
      "Support prioritaire",
      "Accès anticipé aux nouvelles fonctionnalités",
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream dark:bg-gray-900">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Chargement de vos options d&rsquo;abonnement...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream p-4">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
        >
          <Card className="border-destructive bg-card">
            <CardHeader>
              <CardTitle className="text-destructive">⚠️ Erreur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">{error}</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
        >
          <BackButton />
          <h1 className="text-4xl font-bold text-foreground text-center">
            Choisissez votre plan
          </h1>
          <div className="w-[100px]" />
        </motion.div>

        {subscriptionInfo && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
          >
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">
                      {subscriptionInfo.subscription.type === "premium"
                        ? "👑"
                        : "⭐"}
                    </span>
                    <div>
                      <CardTitle className="text-xl text-foreground mb-1">
                        Votre abonnement actuel
                      </CardTitle>
                      <CardDescription>
                        {subscriptionInfo.subscription.type === "premium"
                          ? "Premium"
                          : "Gratuit"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      subscriptionInfo.subscription.type === "premium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {subscriptionInfo.subscription.type === "premium"
                      ? "Premium"
                      : "Gratuit"}
                  </Badge>
                </div>
                {subscriptionInfo.subscription.type === "premium" && (
                  <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                    <span className="text-xl">⏰</span>
                    <p>
                      Prochain renouvellement :{" "}
                      {new Date(
                        subscriptionInfo.subscription.endDate!,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {subscriptionInfo?.role === "admin" ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-2xl">👑</span>
                  <CardTitle className="text-xl text-foreground">
                    Accès Premium Administrateur
                  </CardTitle>
                </div>
                <p className="mt-4 text-muted-foreground">
                  En tant qu&apos;administrateur, vous avez automatiquement
                  accès à toutes les fonctionnalités Premium.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Plan Gratuit */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-3xl text-foreground text-center">
                    Gratuit
                  </CardTitle>
                  <CardDescription className="text-4xl font-bold text-center">
                    0€
                    <span className="text-lg font-normal text-muted-foreground">
                      /mois
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {features.free.map((feature, index) => (
                      <motion.li
                        key={index}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center p-3 rounded-lg bg-muted text-foreground"
                        initial={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="mr-3">✓</span>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={subscriptionInfo?.subscription.type === "free"}
                    variant="outline"
                  >
                    Plan actuel
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Plan Premium */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-card relative">
                <div className="absolute -top-2 right-4">
                  <Badge variant="default">Recommandé</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-3xl text-foreground text-center">
                    Premium
                  </CardTitle>
                  <CardDescription className="text-4xl font-bold text-center">
                    5€
                    <span className="text-lg font-normal text-muted-foreground">
                      /mois
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {features.premium.map((feature, index) => (
                      <motion.li
                        key={index}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center p-3 rounded-lg bg-muted text-foreground"
                        initial={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="mr-3">✓</span>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={subscriptionInfo?.subscription.type === "premium"}
                    onClick={handleSubscribe}
                  >
                    {processingPayment && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {subscriptionInfo?.subscription.type === "premium"
                      ? "Plan actuel"
                      : "Passer à Premium"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
        >
          <p className="text-muted-foreground">
            🔒 Paiement sécurisé par Stripe • Annulation à tout moment
          </p>
          <p className="mt-4 text-muted-foreground">
            Une question ?{" "}
            <Button variant="link" onClick={() => router.push("/contact")}>
              Contactez-nous
            </Button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

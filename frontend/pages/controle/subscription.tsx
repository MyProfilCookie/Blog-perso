import dynamic from 'next/dynamic';
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
const motion = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion })), { ssr: false });
import {
  Loader2,
  Heart,
  Star,
  Users,
  Sparkles,
  Shield,
  Gift,
  Crown,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

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

      // Vérifier toutes les sources possibles de tokens et données utilisateur
      const userToken = localStorage.getItem("userToken");
      const accessToken = localStorage.getItem("accessToken");
      const userInfo = localStorage.getItem("userInfo");
      const serInfo = localStorage.getItem("serInfo");
      const user = localStorage.getItem("user");
      const token = userToken || accessToken;

      // Vérifier si toutes les données nécessaires sont présentes
      const hasValidAuth = token && (userInfo || serInfo || user);

      // Si pas de données d'authentification valides, rediriger vers login
      if (!hasValidAuth) {
        setSubscriptionInfo(null);
        setLoading(false);
        // Nettoyer le localStorage
        localStorage.removeItem("userToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("serInfo");
        localStorage.removeItem("user");
        router.push("/users/login");

        return;
      }

      // Vérifier si l'utilisateur est déjà sur la page de login
      const isLoginPage = window.location.pathname === "/users/login";

      if (isLoginPage) {
        setSubscriptionInfo(null);
        setLoading(false);

        return;
      }

      // Vérifier si le token est expiré
      const isTokenExpired = (tokenToCheck: string): boolean => {
        try {
          const base64Url = tokenToCheck.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(atob(base64));

          if (!payload.exp) return true;

          const currentTime = Math.floor(Date.now() / 1000);

          return payload.exp < currentTime;
        } catch (error) {
          return true;
        }
      };

      // Si le token est expiré, essayer de le rafraîchir
      if (isTokenExpired(token)) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
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
                localStorage.setItem("userToken", data.accessToken);
                localStorage.setItem("accessToken", data.accessToken);

                if (data.refreshToken) {
                  localStorage.setItem("refreshToken", data.refreshToken);
                }

                await fetchSubscriptionInfo();

                return;
              }
            }
          } catch (error) {
            console.error("Erreur lors du rafraîchissement du token:", error);
          }
        }

        // Si le rafraîchissement a échoué, déconnecter l'utilisateur
        setSubscriptionInfo(null);
        localStorage.removeItem("userToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("serInfo");
        localStorage.removeItem("user");
        setLoading(false);
        router.push("/users/login");

        return;
      }

      try {
        const subscriptionResponse = await authenticatedGet(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/info`,
        );

        if (!subscriptionResponse.data) {
          throw new Error("Données d'abonnement invalides");
        }

        if (subscriptionResponse.data.role === "admin") {
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
        } else {
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

          await fetchSubscriptionInfo();
        }
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
        setError("Erreur lors de l'initialisation du service de paiement");
        setSubscriptionInfo(null);
      } finally {
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
    const token =
      localStorage.getItem("userToken") || localStorage.getItem("accessToken");

    if (!token) {
      setError("Session expirée. Veuillez vous reconnecter.");
      setSubscriptionInfo(null);
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
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des informations d'abonnement:",
        err,
      );

      // Vérifier si l'erreur est liée à l'authentification
      const status = (err as any).response?.status;

      if (status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        setSubscriptionInfo(null);

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
    } finally {
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
      "3 exercices par jour pour commencer en douceur",
      "Accès aux corrections détaillées",
      "Statistiques de progression basiques",
      "Support communautaire bienveillant",
      "Ressources éducatives adaptées",
    ],
    premium: [
      "Exercices illimités pour un apprentissage sans limites",
      "Statistiques détaillées et personnalisées",
      "Historique complet de progression",
      "Export des données pour le suivi",
      "Support prioritaire et personnalisé",
      "Accès anticipé aux nouvelles fonctionnalités",
      "Contenu exclusif et avancé",
      "Accompagnement personnalisé",
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
        >
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 dark:text-blue-400" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-purple-400 dark:text-purple-300 animate-pulse" />
          </div>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-200 font-medium">
            Préparation de votre espace d'apprentissage...
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Nous adaptons tout spécialement pour vous
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
        >
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900/50 rounded-full w-fit border border-red-200 dark:border-red-700">
                <Heart className="h-8 w-8 text-red-500 dark:text-red-400" />
              </div>
              <CardTitle className="text-red-700 dark:text-red-300">
                Oups ! Une petite difficulté
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
                onClick={() => window.location.reload()}
              >
                Réessayer avec bienveillance
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header avec philosophie du site */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
        >
          <BackButton />
          <div className="mt-8">
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
              className="inline-flex items-center gap-2 mb-4"
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Choisissez votre chemin d'apprentissage
              </h1>
              <Sparkles className="h-8 w-8 text-purple-500 dark:text-purple-400" />
            </motion.div>
            <p className="text-xl text-gray-700 dark:text-gray-200 mt-4 max-w-3xl mx-auto">
              Chez AutiStudy, nous croyons que chaque enfant mérite un
              apprentissage adapté à ses besoins. Choisissez le plan qui
              correspond le mieux à votre situation familiale.
            </p>
            <div className="flex justify-center items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Heart className="h-4 w-4 text-red-500 dark:text-red-400" />
                <span>Bienveillance</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                <span>Inclusion</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                <span>Adaptation</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statut actuel de l'abonnement */}
        {subscriptionInfo && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2 border-blue-200 dark:border-blue-700 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                      {subscriptionInfo.subscription.type === "premium" ? (
                        <Crown className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
                      ) : (
                        <Heart className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-800 dark:text-gray-100 mb-2">
                        Votre accompagnement actuel
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                        {subscriptionInfo.subscription.type === "premium"
                          ? "Vous bénéficiez de notre accompagnement Premium"
                          : "Vous utilisez notre version d'essai bienveillante"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    className="text-lg px-4 py-2"
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
                  <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Gift className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      <p>
                        Prochain renouvellement :{" "}
                        {subscriptionInfo.subscription.endDate &&
                        subscriptionInfo.subscription.endDate !==
                          "1970-01-01T00:00:00.000Z"
                          ? new Date(
                              subscriptionInfo.subscription.endDate,
                            ).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "31 décembre 3000"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Message spécial pour les administrateurs */}
        {subscriptionInfo?.role === "admin" ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 border-2 border-yellow-200 dark:border-yellow-700 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Crown className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                  <CardTitle className="text-2xl text-gray-800 dark:text-gray-100">
                    Accès Premium Administrateur
                  </CardTitle>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  En tant qu'administrateur de notre communauté bienveillante,
                  vous avez automatiquement accès à toutes les fonctionnalités
                  Premium pour accompagner au mieux les familles.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Plans d'abonnement */
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Plan Gratuit - Bienveillant */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-700 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full w-fit border border-blue-200 dark:border-blue-700">
                    <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-3xl text-gray-800 dark:text-gray-100">
                    Découverte Bienveillante
                  </CardTitle>
                  <CardDescription className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    0€
                    <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-2">
                      pour toujours
                    </span>
                  </CardDescription>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Parfait pour commencer votre voyage d'apprentissage
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {features.free.map((feature, index) => (
                      <motion.li
                        key={index}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800"
                        initial={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-200">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-3"
                    disabled={subscriptionInfo?.subscription.type === "free"}
                    variant={
                      subscriptionInfo?.subscription.type === "free"
                        ? "outline"
                        : "default"
                    }
                  >
                    {subscriptionInfo?.subscription.type === "free" ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Plan actuel
                      </>
                    ) : (
                      "Plan actuel"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Plan Premium - Accompagnement complet */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-2 border-purple-300 dark:border-purple-600 shadow-xl relative">
                <div className="absolute -top-3 right-6">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 text-white dark:text-gray-900 px-4 py-1">
                    Recommandé par les familles
                  </Badge>
                </div>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full w-fit border border-purple-200 dark:border-purple-700">
                    <Crown className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-3xl text-gray-800 dark:text-gray-100">
                    Accompagnement Complet
                  </CardTitle>
                  <CardDescription className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                    5€
                    <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-2">
                      par mois
                    </span>
                  </CardDescription>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Pour un apprentissage sans limites et un soutien
                    personnalisé
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {features.premium.map((feature, index) => (
                      <motion.li
                        key={index}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
                        initial={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-200">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 text-white font-medium py-3"
                    disabled={subscriptionInfo?.subscription.type === "premium"}
                    onClick={handleSubscribe}
                  >
                    {processingPayment && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {subscriptionInfo?.subscription.type === "premium" ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Plan actuel
                      </>
                    ) : (
                      <>
                        Commencer l'accompagnement
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Section valeurs et engagement */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 border-2 border-green-200 dark:border-green-700 shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-green-500 dark:text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Paiement Sécurisé
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Vos données sont protégées par Stripe, leader mondial du
                    paiement en ligne
                  </p>
                </div>
                <div className="text-center">
                  <Heart className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Annulation Libre
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Arrêtez quand vous voulez, sans engagement ni frais cachés
                  </p>
                </div>
                <div className="text-center">
                  <Users className="h-12 w-12 text-blue-500 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Communauté Bienveillante
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Rejoignez une communauté de familles qui se soutiennent
                    mutuellement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appel à l'action final */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border-2 border-purple-200 dark:border-purple-700">
            <Sparkles className="h-12 w-12 text-purple-500 dark:text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Une question ? Nous sommes là pour vous accompagner
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Notre équipe familiale est disponible pour répondre à toutes vos
              questions et vous guider dans le choix du plan le plus adapté à
              vos besoins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20"
                variant="outline"
                onClick={() => router.push("/contact")}
              >
                Nous contacter
              </Button>
              <Button
                className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                onClick={() => router.push("/faq")}
              >
                Voir les questions fréquentes
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

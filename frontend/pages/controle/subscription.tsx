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
      
      // Vérifier le token directement depuis localStorage
      const token = localStorage.getItem("userToken");
      
      // Utiliser le contexte d'authentification comme fallback
      if (!token && !isAuthenticated()) {
        console.log("Redirection vers login - Utilisateur non authentifié");
        router.push("/users/login");

        return;
      }

      try {
        // Vérifier si l'utilisateur est admin via le contexte ou localStorage
        const userRole = localStorage.getItem("userRole");
        const isUserAdmin =
          userRole === "admin" ||
          (user &&
            typeof user === "object" &&
            (("role" in user && (user as { role: string }).role === "admin") ||
              ("isAdmin" in user && (user as { isAdmin: boolean }).isAdmin)));

        if (isUserAdmin) {
          // Si admin, définir automatiquement comme premium
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

        // Initialiser Stripe une seule fois (pour les non-admins)
        const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

        console.log("Clé Stripe:", stripeKey ? "Présente" : "Absente");

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
    try {
      const response = await authenticatedGet(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/info`,
      );

      setSubscriptionInfo(response.data);
      setLoading(false);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des informations d'abonnement:",
        err,
      );

      // Si l'erreur est liée à l'authentification, l'intercepteur s'en chargera
      // Sinon, afficher l'erreur
      if ((err as any).response?.status !== 401) {
        setError("Erreur lors du chargement des informations d'abonnement");
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
          <Loader2 className="h-8 w-8 animate-spin" />
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

"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Chip, Spinner } from "@nextui-org/react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<UserSubscription | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Vérifier toutes les sources possibles d'authentification
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      const userInfo = localStorage.getItem("userInfo");
      const user = localStorage.getItem("user");
      
      console.log("Vérification auth:", {
        token: token ? "Présent" : "Absent",
        userId: userId ? "Présent" : "Absent",
        userInfo: userInfo ? "Présent" : "Absent",
        user: user ? "Présent" : "Absent"
      });

      // Vérifier si l'utilisateur est connecté d'une manière ou d'une autre
      let isAuthenticated = false;
      
      // Méthode 1: Token et userId
      if (token && userId) {
        isAuthenticated = true;
      }
      
      // Méthode 2: userInfo contient un ID
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          if (parsedUserInfo && parsedUserInfo._id) {
            isAuthenticated = true;
          }
        } catch (e) {
          console.error("Erreur parsing userInfo:", e);
        }
      }
      
      // Méthode 3: user contient un ID
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          if (parsedUser && (parsedUser._id || parsedUser.id)) {
            isAuthenticated = true;
          }
        } catch (e) {
          console.error("Erreur parsing user:", e);
        }
      }
      
      if (!isAuthenticated) {
        console.log("Redirection vers login - Aucune authentification trouvée");
        router.push("/users/login");
        return;
      }

      try {
        // Initialiser Stripe une seule fois
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

    checkAuth();
  }, [router]);

  const fetchSubscriptionInfo = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSubscriptionInfo(response.data);
      setLoading(false);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des informations d&apos;abonnement:",
        err,
      );
      setError("Erreur lors du chargement des informations d&apos;abonnement");
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
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/create-checkout-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      console.error("Erreur lors de la création de la session de paiement:", err);
      setError("Erreur lors du traitement du paiement");
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner color="primary" size="lg" />
          <p className="mt-4 text-gray-600">
            Chargement des informations d&rsquo;abonnement...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 p-4 rounded-lg text-red-700 max-w-md text-center">
          <p className="font-bold mb-2">⚠️ Erreur</p>
          <p>{error}</p>
        </div>
        <Button
          className="mt-4"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900">Abonnements</h1>
        </div>

        {subscriptionInfo && (
          <div className="mb-8">
            <Card className="bg-white shadow-lg">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Votre abonnement actuel
                    </h2>
                    <p className="text-gray-600">
                      {subscriptionInfo.subscription.type === "premium"
                        ? "Premium"
                        : "Gratuit"}
                    </p>
                  </div>
                  <Chip
                    color={
                      subscriptionInfo.subscription.type === "premium"
                        ? "success"
                        : "default"
                    }
                    variant="flat"
                  >
                    {subscriptionInfo.subscription.type === "premium"
                      ? "Actif"
                      : "Gratuit"}
                  </Chip>
                </div>
                {subscriptionInfo.subscription.type === "premium" && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      Prochain renouvellement :{" "}
                      {new Date(
                        subscriptionInfo.subscription.endDate!,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Gratuit */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardBody className="flex flex-col">
                <h3 className="text-2xl font-bold text-center mb-4">Gratuit</h3>
                <div className="text-4xl font-bold text-center mb-6">
                  0€<span className="text-lg font-normal">/mois</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {features.free.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  color="default"
                  isDisabled={subscriptionInfo?.subscription.type === "free"}
                  variant="bordered"
                >
                  Plan actuel
                </Button>
              </CardBody>
            </Card>
          </motion.div>

          {/* Plan Premium */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full border-2 border-primary">
              <CardBody className="flex flex-col">
                <div className="absolute top-0 right-0">
                  <Chip color="primary" variant="flat">
                    Recommandé
                  </Chip>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">Premium</h3>
                <div className="text-4xl font-bold text-center mb-6">
                  5€<span className="text-lg font-normal">/mois</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {features.premium.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  color="primary"
                  isDisabled={subscriptionInfo?.subscription.type === "premium"}
                  isLoading={processingPayment}
                  onClick={handleSubscribe}
                >
                  {subscriptionInfo?.subscription.type === "premium"
                    ? "Plan actuel"
                    : "Passer à Premium"}
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>Paiement sécurisé par Stripe. Annulez à tout moment.</p>
          <p className="mt-2">
            Besoin d&apos;aide ?{" "}
            <Button
              className="text-primary p-0 min-w-0 h-auto"
              variant="light"
              onClick={() => router.push("/contact")}
            >
              Contactez-nous
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

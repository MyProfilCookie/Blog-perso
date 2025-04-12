"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Chip, Spinner } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import * as Icons from "react-icons/fa";

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
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/info`,
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-default-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Spinner size="lg" className="text-primary" />
          <p className="mt-4 text-gray-600 animate-pulse">
            Chargement de vos options d&rsquo;abonnement...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-default-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-danger-50 p-6 rounded-xl shadow-xl border border-danger-200 max-w-md text-center"
        >
          <p className="font-bold mb-2 text-danger text-xl">⚠️ Erreur</p>
          <p className="text-danger-600">{error}</p>
          <Button 
            className="mt-6 bg-gradient-to-r from-danger to-danger-500 text-white shadow-lg hover:opacity-90"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-default-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Cercles décoratifs en arrière-plan */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <BackButton />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
            Choisissez votre plan
          </h1>
          <div className="w-[100px]" />
        </motion.div>

        {subscriptionInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border border-primary/20 overflow-hidden">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {subscriptionInfo.subscription.type === "premium" ? (
                      <Icons.FaCrown className="w-6 h-6 text-primary" />
                    ) : (
                      <Icons.FaRegClock className="w-6 h-6 text-gray-400" />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Votre abonnement actuel
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {subscriptionInfo.subscription.type === "premium" ? "Premium" : "Gratuit"}
                      </p>
                    </div>
                  </div>
                  <Chip
                    className={subscriptionInfo.subscription.type === "premium" 
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "border-2 border-primary/30"}
                    size="lg"
                  >
                    {subscriptionInfo.subscription.type === "premium" ? "Premium" : "Gratuit"}
                  </Chip>
                </div>
                {subscriptionInfo.subscription.type === "premium" && (
                  <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                    <Icons.FaRegClock className="w-4 h-4 text-primary" />
                    <p>Prochain renouvellement : {new Date(subscriptionInfo.subscription.endDate!).toLocaleDateString()}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Plan Gratuit */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-2 border-default-200 hover:border-primary/50 transition-all duration-300">
              <CardBody className="p-8">
                <h3 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Gratuit
                </h3>
                <div className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  0€<span className="text-lg font-normal text-gray-600">/mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {features.free.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center text-gray-700 bg-default-50 p-3 rounded-lg"
                    >
                      <Icons.FaCheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                  size="lg"
                  isDisabled={subscriptionInfo?.subscription.type === "free"}
                >
                  Plan actuel
                </Button>
              </CardBody>
            </Card>
          </motion.div>

          {/* Plan Premium */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-2 border-primary relative overflow-visible">
              <div className="absolute -top-4 right-4 z-10">
                <Chip className="bg-gradient-to-r from-primary to-secondary text-white shadow-xl">
                  Recommandé
                </Chip>
              </div>
              <CardBody className="p-8">
                <h3 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Premium
                </h3>
                <div className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  5€<span className="text-lg font-normal text-gray-600">/mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {features.premium.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center text-gray-700 bg-primary/5 p-3 rounded-lg"
                    >
                      <Icons.FaCheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                  size="lg"
                  isDisabled={subscriptionInfo?.subscription.type === "premium"}
                  isLoading={processingPayment}
                  onClick={handleSubscribe}
                >
                  {subscriptionInfo?.subscription.type === "premium" ? "Plan actuel" : "Passer à Premium"}
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-600 text-lg">
            🔒 Paiement sécurisé par Stripe • Annulation à tout moment
          </p>
          <p className="mt-4 text-gray-600">
            Une question ? {" "}
            <Button
              className="text-primary hover:text-secondary transition-colors inline-flex items-center gap-2"
              variant="light"
              onClick={() => router.push("/contact")}
            >
              Contactez-nous
            </Button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

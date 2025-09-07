import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Crown,
  Star,
  ArrowLeft,
  CheckCircle,
  Sun,
  Moon,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SubscriptionInfo {
  type: string;
  status: string;
  expiresAt?: string;
  role?: string;
  subscription?: {
    type: string;
    status: string;
  };
}

// Définition du type pour les composants React
type ReactComponent = React.ComponentType<any>;

export function withPremiumGuard<P extends object>(
  WrappedComponent: ReactComponent,
) {
  return function WithPremiumGuardComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [subscriptionInfo, setSubscriptionInfo] =
      useState<SubscriptionInfo | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // Check for dark mode preference
    useEffect(() => {
      const darkMode =
        localStorage.getItem("darkMode") === "true" ||
        (!localStorage.getItem("darkMode") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDarkMode(darkMode);

      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, []);

    const toggleDarkMode = () => {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      localStorage.setItem("darkMode", newDarkMode.toString());

      if (newDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    useEffect(() => {
      const checkAccess = async () => {
        try {
          const token = localStorage.getItem("userToken");
          const userRole = localStorage.getItem("userRole");

          if (!token) {
            router.push("/users/login");
            return;
          }

          // Vérifier l'abonnement et le rôle via l'API
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/info`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const info = response.data;
          setSubscriptionInfo(info);

          // Accès si admin (soit dans localStorage soit dans la réponse API)
          if (userRole === "admin" || info.role === "admin") {
            setHasAccess(true);
            setIsLoading(false);
            return;
          }

          // Sinon, accès si l'abonnement est premium et actif
          if (
            info.subscription?.type === "premium" &&
            info.subscription?.status === "active"
          ) {
            setHasAccess(true);
          }
        } catch (error) {
          // console.error("Erreur lors de la vérification de l'abonnement:", error);
        } finally {
          setIsLoading(false);
        }
      };

      checkAccess();
    }, [router]);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
            />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Vérification de votre abonnement...
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Veuillez patienter un instant
            </p>
          </motion.div>
        </div>
      );
    }

    if (!hasAccess) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
          {/* Hero Section */}
          <section className="relative py-12 md:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
            <div className="relative w-full px-4 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-end mb-8">
                  <Button
                    onClick={toggleDarkMode}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
                  >
                    {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                  </Button>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Accès Premium Requis
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
                    Débloquez tout le potentiel d&apos;AutiStudy ! ✨
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cette fonctionnalité est réservée aux membres premium
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Contenu principal */}
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
              >
                {/* Avantages Premium */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        Avantages Premium
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Découvrez tous les bénéfices d&apos;un abonnement premium
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { icon: <Shield className="w-5 h-5" />, text: "Accès à tous les exercices avancés" },
                      { icon: <Zap className="w-5 h-5" />, text: "Progression personnalisée" },
                      { icon: <Sparkles className="w-5 h-5" />, text: "Contenu exclusif et nouveautés" },
                      { icon: <CheckCircle className="w-5 h-5" />, text: "Support prioritaire" },
                    ].map((advantage, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="text-blue-600 dark:text-blue-400">
                          {advantage.icon}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {advantage.text}
                        </span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Informations abonnement */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        Votre Abonnement
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Informations sur votre abonnement actuel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {subscriptionInfo && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-300">Type d&apos;abonnement:</span>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {subscriptionInfo.type}
                          </Badge>
                        </div>
                        {subscriptionInfo.expiresAt && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-300">Expire le:</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {new Date(subscriptionInfo.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                        💡 Mettez à niveau votre abonnement pour débloquer toutes les fonctionnalités premium d&apos;AutiStudy !
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  onClick={() => router.push("/controle/subscription")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Mettre à niveau
                </Button>
                <Button
                  onClick={() => router.push("/controle")}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 text-lg font-semibold"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour au tableau de bord
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Section d'encouragement */}
          <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Rejoignez la communauté AutiStudy Premium
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Accédez à des outils d&apos;apprentissage avancés et personnalisés pour maximiser le potentiel de chaque enfant.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2">
                    <Star className="w-4 h-4 mr-2" />
                    Contenu exclusif
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2">
                    <Shield className="w-4 h-4 mr-2" />
                    Accès prioritaire
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-4 py-2">
                    <Zap className="w-4 h-4 mr-2" />
                    Progression rapide
                  </Badge>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      );
    }

    // Si l'utilisateur a accès, afficher le composant enveloppé
    return <WrappedComponent {...props} />;
  };
}
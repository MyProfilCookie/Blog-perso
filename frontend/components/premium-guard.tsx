import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
const motion = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion })), { ssr: false });

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          if (info.subscription?.type === "premium" && info.subscription?.status === "active") {
            setHasAccess(true);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la vérification de l'abonnement:",
            error,
          );
        } finally {
          setIsLoading(false);
        }
      };

      checkAccess();
    }, [router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-cream">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="mt-4 text-muted-foreground">
              Vérification de votre abonnement...
            </p>
          </motion.div>
        </div>
      );
    }

    if (!hasAccess) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-cream p-4 dark:bg-background">
          <Card className="w-full max-w-md bg-cream dark:bg-background">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Accès Premium Requis
              </CardTitle>
              <CardDescription className="text-center">
                Cette fonctionnalité est réservée aux membres premium.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Pour accéder à cette fonctionnalité, veuillez mettre à niveau
                votre abonnement.
              </p>
              {subscriptionInfo && (
                <div className="text-center text-sm text-muted-foreground">
                  Votre abonnement actuel: {subscriptionInfo.type}
                  {subscriptionInfo.expiresAt && (
                    <div>
                      Expire le:{" "}
                      {new Date(
                        subscriptionInfo.expiresAt,
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full"
                onClick={() => router.push("/controle/subscription")}
              >
                Mettre à niveau
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => router.push("/controle")}
              >
                Retour au tableau de bord
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    // Si l'utilisateur a accès, afficher le composant enveloppé
    return <WrappedComponent {...props} />;
  };
}

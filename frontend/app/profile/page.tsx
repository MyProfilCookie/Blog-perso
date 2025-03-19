/* eslint-disable no-console */
/* eslint-disable import/order */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import axios from "axios";
import Image from "next/image";

// ShadCN UI Components
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Charts

// Original components
import ProgressionCommande from "@/components/ProgressionCommande";

// Define TypeScript interfaces
interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface User {
  _id: string;
  pseudo: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  deliveryAddress?: Address;
  createdAt: string;
  image?: string;
  prenom?: string;
  nom?: string;
}

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  date?: string;
  createdAt?: string;
  total?: number;
  totalAmount?: number;
  status: string;
  items?: OrderItem[];
  deliveryCost?: number;
  paymentMethod?: string;
  paymentStatus?: string;
}

interface CourseItem {
  title: string;
  progress: number;
  lastViewed: string;
}

interface EvaluationItem {
  title: string;
  score: number;
  date: string;
}

interface CardSectionProps {
  title: string;
  data: CourseItem[] | EvaluationItem[];
  isEvaluation?: boolean;
}

const mockData = {
  courses: [
    { title: "Cours de Mathématiques", progress: 80, lastViewed: "2024-09-20" },
    { title: "Cours de Français", progress: 50, lastViewed: "2024-09-21" },
  ],
  evaluations: [
    { title: "Évaluation de Mathématiques", score: 75, date: "2024-09-15" },
    { title: "Évaluation de Français", score: 88, date: "2024-09-17" },
  ],
  articles: [
    { title: "Article sur l'autisme", progress: 60, lastViewed: "2024-09-19" },
    {
      title: "Article sur la pédagogie",
      progress: 30,
      lastViewed: "2024-09-18",
    },
  ],
};

const countries = [
  "France",
  "Belgique",
  "Suisse",
  "Canada",
  "États-Unis",
  "Royaume-Uni",
];

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
  </div>
);

// Activity Card Component
const ActivityCard = ({
  title,
  data,
  isEvaluation = false,
}: CardSectionProps) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <ScrollArea className="h-[200px]">
        {data.map((item, index) => (
          <div key={index} className="mb-4 pb-3 border-b last:border-0">
            <p className="font-medium">{item.title}</p>
            {isEvaluation ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>Score</span>
                  <Badge
                    variant={
                      (item as EvaluationItem).score >= 75
                        ? "default"
                        : (item as EvaluationItem).score >= 50
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {(item as EvaluationItem).score}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Date: {(item as EvaluationItem).date}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {(item as CourseItem).progress}%
                  </span>
                </div>
                <Progress
                  className="h-2"
                  value={(item as CourseItem).progress}
                />
                <p className="text-xs text-muted-foreground">
                  Dernière consultation: {(item as CourseItem).lastViewed}
                </p>
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
    </CardContent>
  </Card>
);

// Orders Section Component
const OrdersSection = ({
  orders,
  user,
}: {
  orders: Order[];
  user: User | null;
}) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Vos Commandes</h3>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Vous n&apos;avez pas encore passé de commande.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Vos Commandes</h3>
        <Badge className="text-base font-normal" variant="outline">
          {orders.length}
        </Badge>
      </div>

      <Accordion className="w-full space-y-4" type="multiple">
        {orders.map((order) => (
          <AccordionItem
            key={order._id}
            className="border rounded-lg overflow-hidden"
            value={order._id}
          >
            <Card>
              <CardHeader className="p-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-all">
                  <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between w-full overflow-hidden">
                    <div className="space-y-1 text-left">
                      <p className="font-medium">
                        Commande #{order._id.substring(0, 8)}...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dayjs(order.date || order.createdAt).format(
                          "DD/MM/YYYY",
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                      <Badge
                        variant={
                          order.status === "Delivered" ||
                          order.status === "Livrée"
                            ? "default"
                            : order.status === "Processed" ||
                                order.status === "En cours"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>

                      {user && user.role === "admin" ? (
                        <div className="flex items-center">
                          <span className="line-through text-sm mr-2">
                            {order.total || order.totalAmount || 0}€
                          </span>
                          <Badge
                            className="bg-primary/10 text-primary"
                            variant="outline"
                          >
                            Gratuit • Admin
                          </Badge>
                        </div>
                      ) : (
                        <span className="font-medium">
                          {order.total || order.totalAmount || 0}€
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
              </CardHeader>

              <AccordionContent>
                <CardContent className="pt-0">
                  <div className="my-4">
                    <ProgressionCommande statut={order.status} />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h4 className="font-medium">Articles commandés</h4>

                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-3">
                        {order.items.map((item, idx) => {
                          // Get image URL from various possible properties
                          const imageUrl =
                            item.image ||
                            (item as any).imageUrl ||
                            (item as any).img ||
                            (item as any).photo ||
                            (item as any).thumbnail;

                          return (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row gap-4 p-3 bg-muted/50 rounded-md"
                            >
                              {/* Product image */}
                              <div className="flex-shrink-0 flex justify-center">
                                {imageUrl ? (
                                  <div className="relative h-24 w-24 rounded-md overflow-hidden border">
                                    <Image
                                      alt={`Image de ${item.title}`}
                                      className="object-contain"
                                      src={imageUrl}
                                      onError={(e) => {
                                        (
                                          e.target as HTMLImageElement
                                        ).style.display = "none";
                                        (
                                          e.target as HTMLImageElement
                                        ).parentElement!.innerHTML =
                                          '<div class="h-24 w-24 flex items-center justify-center bg-muted"><span class="text-xs text-muted-foreground">Image indisponible</span></div>';
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="h-24 w-24 flex items-center justify-center bg-muted rounded-md border">
                                    <span className="text-xs text-muted-foreground">
                                      Pas d&apos;image
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Product info */}
                              <div className="flex-1 space-y-1 min-w-0">
                                <p className="font-medium break-words">
                                  {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground break-all">
                                  Réf: {item.productId}
                                </p>
                                <div className="flex flex-wrap gap-2 items-center">
                                  <span className="text-sm">
                                    {item.quantity} × {item.price}€
                                  </span>

                                  {user && user.role === "admin" ? (
                                    <div className="flex items-center gap-2">
                                      <span className="line-through font-medium">
                                        {(item.quantity * item.price).toFixed(
                                          2,
                                        )}
                                        €
                                      </span>
                                      <Badge
                                        className="text-xs bg-primary/10 text-primary"
                                        variant="outline"
                                      >
                                        Gratuit
                                      </Badge>
                                    </div>
                                  ) : (
                                    <span className="font-medium">
                                      {(item.quantity * item.price).toFixed(2)}€
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucun détail d&apos;article disponible pour cette commande.
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Order summary */}
                  <div className="space-y-2">
                    {order.deliveryCost && (
                      <div className="flex justify-between items-center flex-wrap">
                        <span className="text-sm">Frais de livraison:</span>
                        {user && user.role === "admin" ? (
                          <div className="flex items-center gap-2">
                            <span className="line-through">
                              {order.deliveryCost}€
                            </span>
                            <Badge
                              className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              variant="outline"
                            >
                              Gratuit
                            </Badge>
                          </div>
                        ) : (
                          <span>{order.deliveryCost}€</span>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center flex-wrap font-medium">
                      <span>Total:</span>
                      {user && user.role === "admin" ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through">
                            {order.total || order.totalAmount || 0}€
                          </span>
                          <Badge
                            className="bg-primary/10 text-primary"
                            variant="outline"
                          >
                            Gratuit • Admin
                          </Badge>
                        </div>
                      ) : (
                        <span>{order.total || order.totalAmount || 0}€</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

const ProfilePage = () => {
  // User state
  const [user, setUser] = useState<User | null>(null);
  const [createdAt, setCreatedAt] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch user data and orders
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        // Récupérer le token du localStorage
        const token = localStorage.getItem("userToken");

        console.log(
          "🔍 Token extrait du localStorage:",
          token ? `${token.substring(0, 15)}...` : "AUCUN TOKEN",
        );

        if (!token) {
          console.error("Token non trouvé dans localStorage");
          Swal.fire({
            title: "Erreur d'authentification",
            text: "Vous devez être connecté pour accéder à cette page.",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => router.push("/users/login"));

          return;
        }

        // Construire l'URL de l'API
        const apiUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
        ).replace(/\/$/, "");

        console.log("🔍 URL de l'API utilisée:", apiUrl);

        // Configurer les headers avec le token
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        console.log("🔍 Headers envoyés:", headers);

        // Fetch user data
        const userResponse = await axios
          .get(`${apiUrl}/users/me`, { headers })
          .catch((error) => {
            console.error(
              "❌ Erreur de requête utilisateur:",
              error.response?.status,
              error.response?.data,
            );
            throw error;
          });

        console.log(
          "✅ Réponse API:",
          userResponse?.status,
          userResponse?.statusText,
        );
        const userData = userResponse.data.user;

        if (userData) {
          console.log("✅ Données utilisateur reçues:", userData._id);
          setUser(userData);

          // Set profile form fields
          setFirstName(userData.firstName || userData.prenom || "");
          setLastName(userData.lastName || userData.nom || "");
          setPhone(userData.phone || "");
          setAddress(
            userData.deliveryAddress || {
              street: "",
              city: "",
              postalCode: "",
              country: "France",
            },
          );

          setCreatedAt(dayjs(userData.createdAt).format("DD/MM/YYYY"));

          // Stocker les données utilisateur à jour
          localStorage.setItem("user", JSON.stringify(userData));

          // Fetch user orders
          if (userData._id) {
            fetchUserOrders(userData._id, token);
          }
        }
      } catch (error) {
        console.error("❌ Erreur dans fetchUserData:", error);
        // Vérifier si c'est une erreur d'authentification
        if ((error as any).response?.status === 401) {
          console.log(
            "❌ Token expiré ou invalide, redirection vers la page de connexion",
          );
          // Supprimer le token invalide
          localStorage.removeItem("userToken");

          Swal.fire({
            title: "Session expirée",
            text: "Votre session a expiré. Veuillez vous reconnecter.",
            icon: "warning",
            confirmButtonText: "OK",
          }).then(() => router.push("/users/login"));
        } else {
          Swal.fire({
            title: "Erreur",
            text: "Impossible de récupérer vos informations. Veuillez réessayer.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const fetchUserOrders = async (userId: string, token: string) => {
    try {
      console.log("Fetching orders for user:", userId);
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      ).replace(/\/$/, "");

      const ordersResponse = await axios.get(
        `${apiUrl}/orders/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("Orders response:", ordersResponse.data);

      if (ordersResponse.data) {
        if (Array.isArray(ordersResponse.data.orders)) {
          setOrders(ordersResponse.data.orders);
        } else if (Array.isArray(ordersResponse.data)) {
          setOrders(ordersResponse.data);
        } else {
          console.warn(
            "Unexpected orders response format:",
            ordersResponse.data,
          );
          setOrders([]);
        }
      }
    } catch (orderError) {
      console.error(
        "Erreur lors de la récupération des commandes:",
        orderError,
      );
    }
  };

  // Profile update handler
  const handleSaveProfile = async () => {
    if (!user || !user._id) {
      Swal.fire({
        title: "Erreur",
        text: "Utilisateur non défini ou sans identifiant",
        icon: "error",
        confirmButtonText: "OK",
      });

      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("userToken");
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      ).replace(/\/$/, "");

      await axios.put(
        `${apiUrl}/users/${user._id}`,
        { firstName, lastName, phone, deliveryAddress: address },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedUser = {
        ...user,
        firstName,
        lastName,
        phone,
        deliveryAddress: address,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      Swal.fire({
        title: "Profil mis à jour",
        text: "Vos informations ont été enregistrées avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de la mise à jour.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl overflow-x-hidden">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
              {user?.role === "admin"
                ? `Bonjour à vous Admin 👑`
                : `Bonjour ${user?.pseudo || "Utilisateur"} 👋`}
            </h1>
            <p className="mt-2 text-muted-foreground text-center md:text-left">
              Il est : {currentTime} | Date de création de ton compte :{" "}
              {createdAt}
            </p>
          </div>

          {user && (
            <div className="mt-4 md:mt-0 self-center md:self-auto">
              <Badge
                className="text-sm"
                variant={user.role === "admin" ? "default" : "secondary"}
              >
                {user.role === "admin" ? "Administrateur" : "Utilisateur"}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs className="w-full" defaultValue="profile">
        <TabsList className="mb-6 w-full md:w-auto">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent className="mt-0 space-y-4" value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Modifier votre profil</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles et votre adresse de
                livraison.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* User info summary */}
              <div className="flex items-start md:items-center gap-4 flex-wrap md:flex-nowrap">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    alt={`Avatar de ${user?.pseudo}`}
                    src={user?.image || "/assets/default-avatar.webp"}
                  />
                  <AvatarFallback>
                    {user?.pseudo?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1 flex-1 min-w-0">
                  <p className="font-medium text-lg">@{user?.pseudo}</p>
                  <p className="text-muted-foreground break-all">
                    {user?.email}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Personal information form */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">
                  Informations personnelles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      placeholder="Votre prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      placeholder="Votre nom"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    placeholder="Votre numéro de téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Delivery address form */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Adresse de livraison</h3>

                <div className="space-y-2">
                  <Label htmlFor="street">Adresse</Label>
                  <Input
                    id="street"
                    placeholder="Numéro et nom de rue"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      placeholder="Votre ville"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      placeholder="Code postal"
                      value={address.postalCode}
                      onChange={(e) =>
                        setAddress({ ...address, postalCode: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Select
                    value={address.country}
                    onValueChange={(value) =>
                      setAddress({ ...address, country: value })
                    }
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full md:w-auto"
                disabled={saving}
                onClick={handleSaveProfile}
              >
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent className="mt-0" value="orders">
          <OrdersSection orders={orders} user={user} />
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent className="mt-0 space-y-6" value="activities">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActivityCard data={mockData.courses} title="Cours Consultés" />
            <ActivityCard
              isEvaluation
              data={mockData.evaluations}
              title="Évaluations"
            />
            <ActivityCard data={mockData.articles} title="Articles Consultés" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progression des activités</CardTitle>
              <CardDescription>
                Visualisation graphique de votre progression dans les différents
                cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart
                    data={mockData.courses}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      stroke="#888"
                      strokeDasharray="3 3"
                      strokeOpacity={0.2}
                    />
                    <XAxis
                      dataKey="title"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Line
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      dataKey="progress"
                      dot={{ strokeWidth: 2, r: 4 }}
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      type="monotone"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;

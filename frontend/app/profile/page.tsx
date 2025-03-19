/* eslint-disable import/order */
/* eslint-disable no-console */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Swal from "sweetalert2";

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
import { ScrollArea } from "@/components/ui/scroll-area";

// Charts

// Custom Components
import AutiStudyHeader from "@/components/AutiStudyHeader";
import OrdersSection from "@/components/OrdersSection";

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
}: {
  title: string;
  data: CourseItem[] | EvaluationItem[];
  isEvaluation?: boolean;
}) => (
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
        // Get token from localStorage
        const token = localStorage.getItem("userToken");

        console.log(
          "🔍 Token extrait du localStorage:",
          token ? `${token.substring(0, 15)}...` : "AUCUN TOKEN",
        );

        if (!token) {
          console.error("Token not found in localStorage");
          Swal.fire({
            title: "Erreur d'authentification",
            text: "Vous devez être connecté pour accéder à cette page.",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => router.push("/users/login"));

          return;
        }

        // Build API URL
        const apiUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
        ).replace(/\/$/, "");

        console.log("🔍 URL de l'API utilisée:", apiUrl);

        // Configure headers with token
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        console.log("🔍 Headers envoyés:", headers);

        // Fetch user data with fetch API
        const userResponse = await fetch(`${apiUrl}/users/me`, {
          method: "GET",
          headers,
        });

        // Check for error response
        if (!userResponse.ok) {
          const errorData = await userResponse.json().catch(() => ({}));

          console.error(
            "❌ Erreur de requête utilisateur:",
            userResponse.status,
            errorData,
          );
          throw new Error(`HTTP error! Status: ${userResponse.status}`);
        }

        const userData = await userResponse.json();

        console.log(
          "✅ Réponse API:",
          userResponse.status,
          userResponse.statusText,
        );

        if (userData.user) {
          console.log("✅ Données utilisateur reçues:", userData.user._id);
          setUser(userData.user);

          // Set profile form fields
          setFirstName(userData.user.firstName || userData.user.prenom || "");
          setLastName(userData.user.lastName || userData.user.nom || "");
          setPhone(userData.user.phone || "");
          setAddress(
            userData.user.deliveryAddress || {
              street: "",
              city: "",
              postalCode: "",
              country: "France",
            },
          );

          setCreatedAt(dayjs(userData.user.createdAt).format("DD/MM/YYYY"));

          // Store updated user data
          localStorage.setItem("user", JSON.stringify(userData.user));

          // Fetch user orders
          if (userData.user._id) {
            fetchUserOrders(userData.user._id, token);
          }
        }
      } catch (error) {
        console.error("❌ Erreur dans fetchUserData:", error);
        // Check if it's an authentication error (401)
        if (error instanceof Error && error.message.includes("401")) {
          console.log(
            "❌ Token expiré ou invalide, redirection vers la page de connexion",
          );
          // Remove invalid token
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

      const ordersResponse = await fetch(`${apiUrl}/orders/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!ordersResponse.ok) {
        throw new Error(`HTTP error! Status: ${ordersResponse.status}`);
      }

      const ordersData = await ordersResponse.json();

      console.log("Orders response:", ordersData);

      if (ordersData) {
        if (Array.isArray(ordersData.orders)) {
          setOrders(ordersData.orders);
        } else if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else {
          console.warn("Unexpected orders response format:", ordersData);
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

      const updateResponse = await fetch(`${apiUrl}/users/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          deliveryAddress: address,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`HTTP error! Status: ${updateResponse.status}`);
      }

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
    <div className="min-h-screen bg-background">
      <AutiStudyHeader user={user} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
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
          </div>
        </div>

        {/* Profile Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Modifier votre profil</CardTitle>
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
                <p className="font-medium text-lg">Pseudo: {user?.pseudo}</p>
                <p className="text-muted-foreground break-all">
                  Email: {user?.email}
                </p>
                <p className="text-muted-foreground">Role: {user?.role}</p>
              </div>
            </div>

            <Separator />

            {/* Personal information form */}
            <div className="space-y-4">
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
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardFooter>
        </Card>

        {/* Orders Section */}
        <OrdersSection orders={orders} user={user} />

        {/* Activities Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Vos Activités</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActivityCard data={mockData.courses} title="Cours Consultés" />
            <ActivityCard
              isEvaluation
              data={mockData.evaluations}
              title="Évaluations"
            />
            <ActivityCard data={mockData.articles} title="Articles Consultés" />
          </div>

          <Card className="mt-8">
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
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

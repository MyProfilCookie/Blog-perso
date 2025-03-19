"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import Image from "next/image";

// Components
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
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full overflow-hidden">
    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
      {data.map((item, index) => (
        <div
          key={index}
          className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
        >
          <p className="font-medium">{item.title}</p>
          {isEvaluation ? (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Score:
                </span>
                <span
                  className={`text-sm px-2 py-0.5 rounded-full font-medium ${
                    (item as EvaluationItem).score >= 75
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : (item as EvaluationItem).score >= 50
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  }`}
                >
                  {(item as EvaluationItem).score}%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Date: {(item as EvaluationItem).date}
              </p>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(item as CourseItem).progress}%` }}
                />
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Progression: {(item as CourseItem).progress}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(item as CourseItem).lastViewed}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
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
  const [activeTab, setActiveTab] = useState("profile");

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

        // Configure headers with token
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch user data with fetch API
        const userResponse = await fetch(`${apiUrl}/users/me`, {
          method: "GET",
          headers,
        });

        // Check for error response
        if (!userResponse.ok) {
          throw new Error(`HTTP error! Status: ${userResponse.status}`);
        }

        const userData = await userResponse.json();

        if (userData.user) {
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
        console.error("Error in fetchUserData:", error);
        // Check if it's an authentication error (401)
        if (error instanceof Error && error.message.includes("401")) {
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
      console.error("Error fetching orders:", orderError);
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
      console.error("Error updating profile:", error);
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
    <div className="pb-16">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
              {user?.role === "admin"
                ? `Bonjour à vous Admin 👑`
                : `Bonjour ${user?.pseudo || "Utilisateur"} 👋`}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-center md:text-left">
              Il est : {currentTime} | Date de création de ton compte :{" "}
              {createdAt}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "profile"
                  ? "text-primary border-b-2 border-primary"
                  : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profil
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "orders"
                  ? "text-primary border-b-2 border-primary"
                  : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              Commandes
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "activities"
                  ? "text-primary border-b-2 border-primary"
                  : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("activities")}
            >
              Activités
            </button>
          </li>
        </ul>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Modifier votre profil</h2>

          {/* User info summary */}
          <div className="flex items-start md:items-center gap-4 flex-wrap md:flex-nowrap mb-6">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
              <Image
                alt={`Avatar de ${user?.pseudo}`}
                className="rounded-full"
                layout="fill"
                objectFit="cover"
                src={user?.image || "/assets/default-avatar.webp"}
              />
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <p className="font-medium text-lg">Pseudo: {user?.pseudo}</p>
              <p className="text-gray-600 dark:text-gray-400 break-all">
                Email: {user?.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Role: {user?.role}
              </p>
            </div>
          </div>

          <hr className="my-6 border-gray-200 dark:border-gray-700" />

          {/* Personal information form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium"
                  htmlFor="firstName"
                >
                  Prénom
                </label>
                <input
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  id="firstName"
                  placeholder="Votre prénom"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium" htmlFor="lastName">
                  Nom
                </label>
                <input
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  id="lastName"
                  placeholder="Votre nom"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="phone">
                Numéro de téléphone
              </label>
              <input
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                id="phone"
                placeholder="Votre numéro de téléphone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <hr className="my-6 border-gray-200 dark:border-gray-700" />

          {/* Delivery address form */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Adresse de livraison</h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="street">
                Adresse
              </label>
              <input
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                id="street"
                placeholder="Numéro et nom de rue"
                type="text"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium" htmlFor="city">
                  Ville
                </label>
                <input
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  id="city"
                  placeholder="Votre ville"
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-medium"
                  htmlFor="postalCode"
                >
                  Code postal
                </label>
                <input
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  id="postalCode"
                  placeholder="Code postal"
                  type="text"
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress({ ...address, postalCode: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="country">
                Pays
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                id="country"
                value={address.country}
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
              onClick={handleSaveProfile}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && <OrdersSection orders={orders} user={user} />}

      {/* Activities Tab */}
      {activeTab === "activities" && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Vos Activités</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActivityCard data={mockData.courses} title="Cours Consultés" />
            <ActivityCard
              isEvaluation
              data={mockData.evaluations}
              title="Évaluations"
            />
            <ActivityCard data={mockData.articles} title="Articles Consultés" />
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">
              Progression des activités
            </h3>
            <div className="h-[300px] w-full">
              <div className="text-center text-gray-600 dark:text-gray-400 py-6">
                [Graphique de progression ici]
                <p className="mt-2">Fonctionnalité en cours de développement</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

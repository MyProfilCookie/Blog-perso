/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Progress, Avatar, Input } from "@nextui-org/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import axios from "axios";

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
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
  </div>
);

// Card Section Component
const CardSection = ({
  title,
  data,
  isEvaluation = false,
}: CardSectionProps) => (
  <Card className="dark:bg-gray-800">
    <div className="card-header p-4">
      <h3 className="text-xl font-bold dark:text-gray-100">{title}</h3>
    </div>
    <div className="p-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
        >
          <p className="font-bold dark:text-gray-100">{item.title}</p>
          {isEvaluation ? (
            <>
              <p className="dark:text-gray-300">
                Score : {(item as EvaluationItem).score}%
              </p>
              <p className="dark:text-gray-300">
                Date : {(item as EvaluationItem).date}
              </p>
            </>
          ) : (
            <Progress
              aria-label={`Progression de ${item.title}`}
              className="my-2"
              color="primary"
              value={(item as CourseItem).progress}
            />
          )}
          {!isEvaluation && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dernière consultation : {(item as CourseItem).lastViewed}
            </p>
          )}
        </div>
      ))}
    </div>
  </Card>
);

// Orders Section Component avec frais de livraison gratuits pour admin
const SectionCommandes = ({
  orders,
  user,
}: {
  orders: Order[];
  user: User | null;
}) => {
  // State to track which orders are expanded
  const [commandesDeveloppees, setCommandesDeveloppees] = useState<{
    [key: string]: boolean;
  }>({});

  // Toggle expansion for a specific order
  const basculerDeveloppementCommande = (orderId: string) => {
    setCommandesDeveloppees((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="mb-4 text-2xl font-bold dark:text-gray-100">
          Vos Commandes
        </h3>
        <div className="bg-cream dark:bg-gray-800 p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Vous n'avez pas encore passé de commande.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-2xl font-bold dark:text-gray-100">
        Vos Commandes ({orders.length})
      </h3>
      <ul className="bg-cream dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-100 dark:divide-gray-700">
        {orders.map((commande) => (
          <li
            key={commande._id}
            className="p-4 transition-all duration-200 hover:bg-cream500 dark:hover:bg-gray-700"
          >
            <div
              className="flex justify-between items-center flex-wrap cursor-pointer"
              onClick={() => basculerDeveloppementCommande(commande._id)}
            >
              <div>
                <p className="font-semibold dark:text-gray-100">
                  Commande #{commande._id.substring(0, 8)}...
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium dark:text-gray-300">Date:</span>{" "}
                  {dayjs(commande.date || commande.createdAt).format(
                    "DD/MM/YYYY",
                  )}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium dark:text-gray-300">Total:</span>{" "}
                  {user && user.role === "admin" ? (
                    <span className="flex items-center gap-2">
                      <span className="line-through">
                        {commande.total || commande.totalAmount || 0} €
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full">
                        Gratuit • Admin
                      </span>
                    </span>
                  ) : (
                    `${commande.total || commande.totalAmount || 0} €`
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${
                    commande.status === "Delivered" ||
                    commande.status === "Livrée"
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                      : commande.status === "Processed" ||
                          commande.status === "En cours"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                  }`}
                >
                  {commande.status}
                </span>
                <div className="text-gray-500 dark:text-gray-400">
                  {commandesDeveloppees[commande._id] ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.5 15.75l7.5-7.5 7.5 7.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Barre de progression de la commande */}
            <div className="mt-3">
              <ProgressionCommande statut={commande.status} />
            </div>

            {/* Order Items - Expanded View */}
            {commandesDeveloppees[commande._id] && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <h4 className="text-md font-medium mb-2 dark:text-gray-100">
                  Articles commandés
                </h4>
                {commande.items && commande.items.length > 0 ? (
                  <div className="space-y-4">
                    {commande.items.map((article, idx) => {
                      // Chercher l'image dans différentes propriétés possibles
                      const urlImage =
                        article.image ||
                        (article as any).imageUrl ||
                        (article as any).img ||
                        (article as any).photo ||
                        (article as any).thumbnail;

                      return (
                        <div
                          key={idx}
                          className="flex flex-col md:flex-row md:items-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                          {/* Informations de l'article */}
                          <div className="md:flex-grow mb-2 md:mb-0">
                            <p className="font-medium dark:text-gray-100">
                              {article.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Réf: {article.productId}
                            </p>
                            <div className="mt-1">
                              <p className="text-sm dark:text-gray-300">
                                {article.quantity} x {article.price} €
                              </p>
                              {user && user.role === "admin" ? (
                                <div className="flex items-center gap-2">
                                  <p className="font-medium line-through dark:text-gray-100">
                                    {(article.quantity * article.price).toFixed(
                                      2,
                                    )}{" "}
                                    €
                                  </p>
                                  <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full">
                                    Gratuit
                                  </span>
                                </div>
                              ) : (
                                <p className="font-medium dark:text-gray-100">
                                  {(article.quantity * article.price).toFixed(
                                    2,
                                  )}{" "}
                                  €
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Image de l'article avec gestion améliorée */}
                          <div className="flex justify-center md:ml-4">
                            {urlImage ? (
                              <div className="relative h-24 w-24">
                                <img
                                  alt={`Image de ${article.title}`}
                                  className="h-24 w-24 object-contain rounded border border-gray-200 dark:border-gray-600"
                                  src={urlImage}
                                  onError={(e) => {
                                    console.log(
                                      "Erreur de chargement d'image:",
                                      urlImage,
                                    );
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                    (
                                      e.target as HTMLImageElement
                                    ).parentElement!.innerHTML =
                                      '<div class="h-24 w-24 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-600">' +
                                      '<span class="text-xs text-gray-400 dark:text-gray-300">Image indisponible</span></div>';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-24 w-24 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-600">
                                <span className="text-xs text-gray-400 dark:text-gray-300">
                                  Pas d'image
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aucun détail d'article disponible pour cette commande.
                  </p>
                )}

                {/* Order Summary */}
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium dark:text-gray-300">
                      Total:
                    </span>
                    {user && user.role === "admin" ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold line-through dark:text-gray-100">
                          {commande.total || commande.totalAmount || 0} €
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full">
                          Gratuit • Admin
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold dark:text-gray-100">
                        {commande.total || commande.totalAmount || 0} €
                      </span>
                    )}
                  </div>
                  {commande.deliveryCost && (
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Frais de livraison:</span>
                      {user && user.role === "admin" ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through">
                            {commande.deliveryCost} €
                          </span>
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                            Gratuit
                          </span>
                        </div>
                      ) : (
                        <span>{commande.deliveryCost} €</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
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
      const token = localStorage.getItem("userToken");

      if (!token) {
        console.error("Token non trouvé");
        Swal.fire({
          title: "Erreur",
          text: "Vous devez être connecté pour accéder à cette page.",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => router.push("/users/login"));

        return;
      }

      try {
        // Fetch user data
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const userData = userResponse.data.user;

        if (userData) {
          console.log("User data:", userData);
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
          localStorage.setItem("user", JSON.stringify(userData));

          // Fetch user orders
          if (userData._id) {
            try {
              console.log("Fetching orders for user:", userData._id);
              const ordersResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userData._id}`,
                { headers: { Authorization: `Bearer ${token}` } },
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
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          error,
        );

        Swal.fire({
          title: "Erreur",
          text: "Impossible de récupérer les informations utilisateur. Veuillez vous reconnecter.",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => router.push("/users/login"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

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

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`,
        {
          firstName,
          lastName,
          phone,
          deliveryAddress: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
    <div className="container mx-auto mt-6 px-4">
      {/* center le titre en version mobile mais laisser le titre a gauche en version desktop */}
      <h1
        className="mb-4 text-4xl font-bold text-center md:text-left dark:text-gray-100"
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        {/* si la personne est un admin cela affiche "Bonjour à vous Admin 👑" sinon cela affiche "Bonjour à vous avec le pseudo de la personne" */}
        {user?.role === "admin"
          ? `Bonjour à vous Admin 👑`
          : `Bonjour ${user?.pseudo || "Utilisateur"} 👋`}
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400 text-center md:text-left">
        Il est : {currentTime} | Date de création de ton compte : {createdAt}
      </p>

      {/* Profile Form Section */}
      <div className="bg-cream dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-3xl font-bold mb-4 dark:text-gray-100">
          Modifier votre profil
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <Avatar
            isBordered
            alt={`Avatar de ${user?.pseudo}`}
            aria-label={`Avatar de ${user?.pseudo}`}
            size="lg"
            src={user?.image || "/assets/default-avatar.webp"}
          />
          <div>
            <p className="text-lg dark:text-gray-100">Pseudo: {user?.pseudo}</p>
            <p className="text-lg dark:text-gray-100">Email: {user?.email}</p>
            <p className="text-lg dark:text-gray-100">Role: {user?.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            fullWidth
            aria-label="Modifier votre prénom"
            className="mb-4"
            label="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <Input
            fullWidth
            aria-label="Modifier votre nom"
            className="mb-4"
            label="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <Input
          fullWidth
          aria-label="Modifier votre numéro de téléphone"
          className="mb-4"
          label="Numéro de téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <h3 className="text-xl font-semibold mt-4 mb-3 dark:text-gray-100">
          Adresse de livraison
        </h3>

        <Input
          fullWidth
          aria-label="Modifier votre adresse"
          className="mb-4"
          label="Adresse"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            fullWidth
            aria-label="Modifier votre ville"
            className="mb-4"
            label="Ville"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />

          <Input
            fullWidth
            aria-label="Modifier votre code postal"
            className="mb-4"
            label="Code postal"
            value={address.postalCode}
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <label
            className="block mb-2 font-medium dark:text-gray-100"
            htmlFor="country-select"
          >
            Pays
          </label>
          <select
            aria-label="Sélectionnez votre pays"
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            id="country-select"
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

        <Button
          aria-label="Enregistrer les modifications"
          className="mt-4"
          color="primary"
          disabled={saving}
          onClick={handleSaveProfile}
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {/* Orders Section */}
      <SectionCommandes orders={orders} user={user} />

      {/* Activity Sections */}
      <h2 className="text-3xl font-bold mt-12 mb-6 dark:text-gray-100">
        Vos Activités
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <CardSection data={mockData.courses} title="Cours Consultés" />
        <CardSection
          isEvaluation
          data={mockData.evaluations}
          title="Évaluations"
        />
        <CardSection data={mockData.articles} title="Articles Consultés" />
      </div>

      <div className="mt-12 mb-16">
        <h3 className="mb-4 text-2xl font-bold dark:text-gray-100">
          Progression des activités
        </h3>
        <div className="bg-cream dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <ResponsiveContainer height={300} width="100%">
            <LineChart
              data={mockData.courses}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Line dataKey="progress" stroke="#82ca9d" type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

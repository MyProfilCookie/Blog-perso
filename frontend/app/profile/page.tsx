"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import Image from "next/image";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faMapMarkerAlt,
  faGlobe,
  faCity,
  faMailBulk,
  faShoppingBag,
  faCalendarAlt,
  faClock,
  faExclamationCircle,
  faCheck,
  faSpinner,
  faBook,
  faGraduationCap,
  faNewspaper,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

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
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400" />
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = "bg-yellow-500";
  let textColor = "text-white";

  if (status === "Pending" || status === "En attente") {
    bgColor = "bg-red-400";
  } else if (status === "Shipped" || status === "Expédié") {
    bgColor = "bg-red-500";
  } else if (status === "Delivered" || status === "Livrée") {
    bgColor = "bg-black dark:bg-gray-800";
  } else if (status === "Processed" || status === "En cours") {
    bgColor = "bg-blue-500";
  }

  return (
    <span
      className={`${bgColor} ${textColor} py-1 px-4 rounded-full text-sm font-medium`}
    >
      {status}
    </span>
  );
};

// Order Progress tracker component
const OrderProgress = ({ status }: { status: string }) => {
  const isRegistered = true; // First step is always completed
  const isProcessed = [
    "Processed",
    "En cours",
    "Shipped",
    "Expédié",
    "Delivered",
    "Livrée",
  ].includes(status);
  const isShipped = ["Shipped", "Expédié", "Delivered", "Livrée"].includes(
    status,
  );
  const isDelivered = ["Delivered", "Livrée"].includes(status);

  return (
    <div className="mt-4 w-full">
      {/* Step indicators */}
      <div className="flex justify-between mb-2">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              isRegistered
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <span
            className={`text-sm text-center ${
              isRegistered
                ? "text-indigo-500 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Enregistrement
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              isProcessed
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            {isProcessed ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faSpinner} />
            )}
          </div>
          <span
            className={`text-sm text-center ${
              isProcessed
                ? "text-indigo-500 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Préparation
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              isShipped
                ? "bg-pink-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            {isShipped ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faSpinner} />
            )}
          </div>
          <span
            className={`text-sm text-center ${
              isShipped
                ? "text-pink-500 dark:text-pink-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Expédition
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              isDelivered
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            {isDelivered ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faSpinner} />
            )}
          </div>
          <span
            className={`text-sm text-center ${
              isDelivered
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Livraison
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 flex w-full rounded-full overflow-hidden">
        <div className="bg-indigo-500 h-full" style={{ width: "25%" }} />
        <div
          className={`h-full ${isProcessed ? "bg-indigo-500" : "bg-gray-200 dark:bg-gray-700"}`}
          style={{ width: "25%" }}
        />
        <div
          className={`h-full ${isShipped ? "bg-pink-500" : "bg-gray-200 dark:bg-gray-700"}`}
          style={{ width: "25%" }}
        />
        <div
          className={`h-full ${isDelivered ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}
          style={{ width: "25%" }}
        />
      </div>

      {/* Percentage display */}
      {isDelivered && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
            Livraison
          </span>
          <span className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
            100%
          </span>
        </div>
      )}
    </div>
  );
};

// Activity Card Component
const ActivityCard = ({
  title,
  data,
  isEvaluation = false,
  icon,
}: {
  title: string;
  data: CourseItem[] | EvaluationItem[];
  isEvaluation?: boolean;
  icon: any;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full overflow-hidden">
    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center">
      <FontAwesomeIcon
        className="mr-2 text-blue-600 dark:text-blue-400"
        icon={icon}
      />
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <FontAwesomeIcon
                  className="mr-1 text-xs"
                  icon={faCalendarAlt}
                />
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
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <FontAwesomeIcon className="mr-1" icon={faChartBar} />
                  {(item as CourseItem).progress}%
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon className="mr-1" icon={faClock} />
                  {(item as CourseItem).lastViewed}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Main OrdersSection Component
const OrdersSection = ({
  orders,
  user,
}: {
  orders: Order[];
  user: User | null;
}) => {
  // State to track which orders are expanded
  const [expandedOrders, setExpandedOrders] = useState<{
    [key: string]: boolean;
  }>({});

  // Toggle expansion for a specific order
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 flex items-center">
          <FontAwesomeIcon
            className="mr-2 text-blue-600 dark:text-blue-400"
            icon={faShoppingBag}
          />
          Vos Commandes
        </h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
          <div className="flex flex-col items-center justify-center">
            <FontAwesomeIcon
              className="text-4xl mb-3 text-gray-400 dark:text-gray-500"
              icon={faExclamationCircle}
            />
            <p className="text-gray-600 dark:text-gray-400">
              Vous n&apos;avez pas encore passé de commande.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-2xl font-bold mb-4 flex items-center">
        <FontAwesomeIcon
          className="mr-2 text-blue-600 dark:text-blue-400"
          icon={faShoppingBag}
        />
        Vos Commandes
      </h3>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            {/* Order Header */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300"
              onClick={() => toggleOrderExpansion(order._id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleOrderExpansion(order._id);
                }
              }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center w-full">
                  <p className="font-semibold text-base flex items-center">
                    <FontAwesomeIcon
                      className="mr-2 text-blue-600 dark:text-blue-400"
                      icon={faShoppingBag}
                    />
                    Commande #{order._id.substring(0, 8)}...
                  </p>
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    style={{
                      transform: expandedOrders[order._id]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                    />
                  </svg>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                  <FontAwesomeIcon className="mr-2" icon={faCalendarAlt} />
                  {dayjs(order.date || order.createdAt).format("DD/MM/YYYY")}
                </p>

                <div className="flex justify-between items-center w-full flex-wrap">
                  <StatusBadge status={order.status} />

                  {user && user.role === "admin" ? (
                    <div className="flex items-center">
                      <span className="line-through mr-2 text-gray-600 dark:text-gray-400">
                        {order.total || order.totalAmount || 0}€
                      </span>
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-4 py-1 text-sm font-medium">
                        Gratuit • Admin
                      </span>
                    </div>
                  ) : (
                    <span className="font-medium">
                      {order.total || order.totalAmount || 0}€
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            {expandedOrders[order._id] && (
              <div className="px-4 pb-6 border-t border-gray-100 dark:border-gray-700">
                {/* Order Progress */}
                <OrderProgress status={order.status} />

                <hr className="my-6 border-gray-200 dark:border-gray-700" />

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <>
                    <h4 className="font-medium text-lg mb-4 flex items-center">
                      <FontAwesomeIcon
                        className="mr-2 text-blue-600 dark:text-blue-400"
                        icon={faShoppingBag}
                      />
                      Articles commandés
                    </h4>
                    <div className="space-y-4">
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
                            className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                          >
                            <div className="flex gap-4">
                              {/* Product image */}
                              <div className="flex-shrink-0">
                                {imageUrl ? (
                                  <div className="relative h-24 w-24 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                                    <Image
                                      fill
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
                                          '<div class="h-24 w-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md"><span class="text-xs text-gray-400 dark:text-gray-500">Image indisponible</span></div>';
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="h-24 w-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
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
                                <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                                  Réf: {item.productId}
                                </p>
                                <div className="flex flex-wrap gap-2 items-center mt-2">
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {item.quantity} × {item.price}€
                                  </span>

                                  {user && user.role === "admin" ? (
                                    <div className="flex items-center gap-2">
                                      <span className="line-through font-medium text-gray-600 dark:text-gray-400">
                                        {(item.quantity * item.price).toFixed(
                                          2,
                                        )}
                                        €
                                      </span>
                                      <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs px-2 py-1 rounded-full">
                                        Gratuit
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="font-medium">
                                      {(item.quantity * item.price).toFixed(2)}€
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Order Summary */}
                <div className="mt-6 space-y-2">
                  {order.deliveryCost && (
                    <div className="flex justify-between items-center flex-wrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Frais de livraison:
                      </span>
                      {user && user.role === "admin" ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through text-gray-600 dark:text-gray-400">
                            {order.deliveryCost}€
                          </span>
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                            Gratuit
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300">
                          {order.deliveryCost}€
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center flex-wrap font-medium">
                    <span>Total:</span>
                    {user && user.role === "admin" ? (
                      <div className="flex items-center gap-2">
                        <span className="line-through text-gray-600 dark:text-gray-400">
                          {order.total || order.totalAmount || 0}€
                        </span>
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-sm">
                          Gratuit • Admin
                        </span>
                      </div>
                    ) : (
                      <span>{order.total || order.totalAmount || 0}€</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
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
  const [activeTab, setActiveTab] = useState("profile");

  // Theme handling
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme(); // This is still useful for some operations
  const [isDarkMode, setIsDarkMode] = useState(false);

  const router = useRouter();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    // Check if dark mode is enabled using document.documentElement.classList
    const isDark = document.documentElement.classList.contains("dark");

    setIsDarkMode(isDark);
  }, []);

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          const isDark = document.documentElement.classList.contains("dark");

          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
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

  if (!mounted || loading) {
    return <Loading />;
  }

  return (
    <div className="pb-16 transition-colors duration-300">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
              {user?.role === "admin"
                ? `Bonjour à vous Admin 👑`
                : `Bonjour ${user?.pseudo || "Utilisateur"} 👋`}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-center md:text-left flex items-center justify-center md:justify-start">
              <FontAwesomeIcon className="mr-2" icon={faClock} />
              {currentTime} |{" "}
              <FontAwesomeIcon className="mx-2" icon={faCalendarAlt} /> Compte
              créé le: {createdAt}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 transition-colors duration-300 ${
                activeTab === "profile"
                  ? "text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <FontAwesomeIcon className="mr-2" icon={faUser} />
              Profil
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 transition-colors duration-300 ${
                activeTab === "orders"
                  ? "text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <FontAwesomeIcon className="mr-2" icon={faShoppingBag} />
              Commandes
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 transition-colors duration-300 ${
                activeTab === "activities"
                  ? "text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("activities")}
            >
              <FontAwesomeIcon className="mr-2" icon={faGraduationCap} />
              Activités
            </button>
          </li>
        </ul>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FontAwesomeIcon
              className="mr-2 text-blue-600 dark:text-blue-400"
              icon={faUser}
            />
            Modifier votre profil
          </h2>

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
                  className="block text-sm font-medium flex items-center"
                  htmlFor="firstName"
                >
                  <FontAwesomeIcon
                    className="mr-2 text-blue-600 dark:text-blue-400"
                    icon={faUser}
                  />
                  Prénom
                </label>
                <input
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                  id="firstName"
                  placeholder="Votre prénom"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-medium flex items-center"
                  htmlFor="lastName"
                >
                  <FontAwesomeIcon
                    className="mr-2 text-blue-600 dark:text-blue-400"
                    icon={faUser}
                  />
                  Nom
                </label>
                <input
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                  id="lastName"
                  placeholder="Votre nom"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium flex items-center"
                htmlFor="phone"
              >
                <FontAwesomeIcon
                  className="mr-2 text-blue-600 dark:text-blue-400"
                  icon={faPhone}
                />
                Numéro de téléphone
              </label>
              <input
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
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
            <h3 className="font-medium text-lg flex items-center">
              <FontAwesomeIcon
                className="mr-2 text-blue-600 dark:text-blue-400"
                icon={faMapMarkerAlt}
              />
              Adresse de livraison
            </h3>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium flex items-center"
                htmlFor="street"
              >
                <FontAwesomeIcon
                  className="mr-2 text-blue-600 dark:text-blue-400"
                  icon={faMapMarkerAlt}
                />
                Adresse
              </label>
              <input
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
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
                <label
                  className="block text-sm font-medium flex items-center"
                  htmlFor="city"
                >
                  <FontAwesomeIcon
                    className="mr-2 text-blue-600 dark:text-blue-400"
                    icon={faCity}
                  />
                  Ville
                </label>
                <input
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
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
                  className="block text-sm font-medium flex items-center"
                  htmlFor="postalCode"
                >
                  <FontAwesomeIcon
                    className="mr-2 text-blue-600 dark:text-blue-400"
                    icon={faMailBulk}
                  />
                  Code postal
                </label>
                <input
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
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
              <label
                className="block text-sm font-medium flex items-center"
                htmlFor="country"
              >
                <FontAwesomeIcon
                  className="mr-2 text-blue-600 dark:text-blue-400"
                  icon={faGlobe}
                />
                Pays
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
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
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 flex items-center ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={saving}
              onClick={handleSaveProfile}
            >
              {saving ? (
                <>
                  <FontAwesomeIcon
                    className="mr-2 animate-spin"
                    icon={faSpinner}
                  />
                  Enregistrement...
                </>
              ) : (
                <>
                  <FontAwesomeIcon className="mr-2" icon={faCheck} />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && <OrdersSection orders={orders} user={user} />}

      {/* Activities Tab */}
      {activeTab === "activities" && (
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FontAwesomeIcon
              className="mr-2 text-blue-600 dark:text-blue-400"
              icon={faGraduationCap}
            />
            Vos Activités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActivityCard
              data={mockData.courses}
              icon={faBook}
              title="Cours Consultés"
            />
            <ActivityCard
              isEvaluation
              data={mockData.evaluations}
              icon={faGraduationCap}
              title="Évaluations"
            />
            <ActivityCard
              data={mockData.articles}
              icon={faNewspaper}
              title="Articles Consultés"
            />
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon
                className="mr-2 text-blue-600 dark:text-blue-400"
                icon={faChartBar}
              />
              Progression des activités
            </h3>
            <div className="h-[300px] w-full">
              <div className="text-center text-gray-600 dark:text-gray-400 py-6 flex flex-col items-center justify-center h-full">
                <FontAwesomeIcon
                  className="text-5xl mb-4 text-gray-400 dark:text-gray-600"
                  icon={faChartBar}
                />
                <p className="text-lg">[Graphique de progression ici]</p>
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

/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faChevronRight,
    faBox,
    faCalendarAlt,
    faMapMarkerAlt,
    faTruck,
    faEuroSign,
    faBarcode,
    faTags
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define types
interface OrderItem {
    productId?: string;
    name?: string;
    title?: string;
    quantity: number;
    price: number;
}

interface OrderSummary {
    _id: string;
    orderDate: string | Date;
    status: string;
    totalAmount: number;
    deliveryCost?: number;
    items: OrderItem[];
    deliveryMethod?: string;
    deliveryAddress?: {
        street?: string;
        city?: string;
        postalCode?: string;
        country?: string;
    };
    trackingNumber?: string;
    carrierInfo?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}

// Map order status to appropriate color classes
const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
        Pending: "bg-yellow-200 text-yellow-800",
        Processing: "bg-blue-200 text-blue-800",
        Shipped: "bg-purple-200 text-purple-800",
        Delivered: "bg-green-200 text-green-800",
        Cancelled: "bg-red-200 text-red-800",
        // Add frontend status mappings
        Enregistree: "bg-yellow-200 text-yellow-800",
        Validee: "bg-blue-200 text-blue-800",
        Preparation: "bg-blue-200 text-blue-800",
        Expedition: "bg-purple-200 text-purple-800",
        Livree: "bg-green-200 text-green-800",
    };

    return statusMap[status] || "bg-gray-200 text-gray-800";
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const router = useRouter();

    // Toggle expanded state for an order
    const toggleOrder = (orderId: string) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    // Format price with currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
    };

    // Calculate totals with correction for free shipping
    const calculateTotals = (order: OrderSummary) => {
        const subtotal = order.items.reduce((total, item) =>
            total + (item.price * item.quantity), 0);

        // For display purposes
        const shippingCost = order.deliveryCost || 0;

        // Calculate the actual total based on admin status
        let actualTotal;

        if (isAdmin) {
            // For admin, everything is free (0€)
            actualTotal = 0;
        } else {
            // For regular users, apply normal calculation
            actualTotal = subtotal + shippingCost;
        }

        return {
            subtotal,
            shippingCost,
            displayTotal: order.totalAmount, // Original total from API
            actualTotal   // Corrected total based on admin status
        };
    };

    // Fixed user data and token retrieval function
    function getUserData() {
        if (typeof window === 'undefined') return null;

        try {
            // Try all possible token locations
            const userStr = localStorage.getItem("user");
            const directToken = localStorage.getItem("token");
            const userToken = localStorage.getItem("userToken");

            let userData = null;
            let token = directToken || userToken;

            // Parse user data if available
            if (userStr) {
                try {
                    userData = JSON.parse(userStr);
                    // Check if user is admin
                    if (userData.role === 'admin') {
                        setIsAdmin(true);
                    }
                    // If user data has token, use it (priority)
                    if (userData.token) {
                        token = userData.token;
                    }
                } catch (e) {
                    console.error("Error parsing user data:", e);
                }
            }

            // If no user data but we have a token, create minimal user object
            if (!userData && token) {
                userData = { token };
            }

            // If we have user data but no token, add the token
            if (userData && !userData.token && token) {
                userData.token = token;
            }

            // Extract user ID from various sources
            let userId = userData?.id || userData?._id || userData?.userId;

            // Try to get user ID from JWT if not found in user data
            if (!userId && token && token.split('.').length === 3) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));

                    userId = payload.id || payload.userId || payload.sub || payload._id;
                    if (userId && userData) {
                        userData.id = userId;
                    }
                } catch (e) {
                    console.error("Error extracting ID from JWT:", e);
                }
            }

            return userData;
        } catch (e) {
            console.error("Error getting user data:", e);

            return null;
        }
    }

    // Fetch orders with enhanced error handling and endpoint testing
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);

            const userData = getUserData();

            if (!userData) {
                setError("Vous devez être connecté pour voir vos commandes");
                setLoading(false);

                return;
            }

            const token = userData.token;

            if (!token) {
                setError("Problème d'authentification. Veuillez vous reconnecter.");
                setLoading(false);

                return;
            }

            let userId = userData.id;

            if (!userId && token.split('.').length === 3) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));

                    userId = payload.id || payload.userId || payload.sub;
                } catch (e) {
                    console.error("Failed to extract user ID from token:", e);
                }
            }

            if (!userId) {
                setError("Impossible d'identifier votre compte. Veuillez vous reconnecter.");
                setLoading(false);

                return;
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            try {
                // Try different API endpoints
                let response = null;
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const endpoints = [
                    `/orders/user/${userId}`,
                    `/orders/users/${userId}`,
                    `/user/${userId}/orders`,
                    `/users/${userId}/orders`
                ];

                for (const endpoint of endpoints) {
                    try {
                        const tempResponse = await fetch(`${apiUrl}${endpoint}`, {
                            method: 'GET',
                            headers
                        });

                        if (tempResponse.ok) {
                            response = tempResponse;
                            break;
                        }
                    } catch (e) {
                        // Continue to next endpoint
                    }
                }

                if (!response) {
                    throw new Error("Impossible d'accéder à vos commandes. Veuillez réessayer plus tard.");
                }

                const data = await response.json();

                // Handle different response formats
                if (data && data.orders) {
                    setOrders(data.orders);
                } else if (data && Array.isArray(data)) {
                    setOrders(data);
                } else if (data && data.data && Array.isArray(data.data)) {
                    setOrders(data.data);
                } else {
                    setOrders([]);
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Impossible de charger vos commandes. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    // Render loading state
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold mb-6">Mes commandes</h1>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full mb-4" />
                ))}
            </div>
        );
    }

    // Render error state with login button
    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Mes commandes</h1>
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="pt-6">
                        <div className="text-red-500 dark:text-red-400 font-medium mb-4">{error}</div>
                        <div className="flex space-x-4">
                            <Link
                                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 rounded-md transition-colors"
                                href="/users/login"
                            >
                                Se connecter
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Render empty state
    if (orders.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Mes commandes</h1>
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="pt-6">
                        <div className="text-gray-500 dark:text-gray-400 font-medium mb-4">Vous n'avez pas encore de commandes.</div>
                        <Link
                            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 rounded-md transition-colors inline-block"
                            href="/shop"
                        >
                            Découvrir nos produits
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Render orders list with expandable details
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Mes commandes</h1>
            {isAdmin && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md">
                    <p className="text-green-700 dark:text-green-400 font-medium flex items-center">
                        <FontAwesomeIcon className="mr-2" icon={faTags} />
                        Mode administrateur : Tous les produits sont gratuits pour vous !
                    </p>
                </div>
            )}
            <div className="space-y-4">
                {orders.map((order) => {
                    const totals = calculateTotals(order);
                    // eslint-disable-next-line padding-line-between-statements
                    return (
                        <Card
                            key={order._id}
                            className="overflow-hidden transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                            {/* Order Header - Always visible */}
                            <CardHeader
                                className="pb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                onClick={() => toggleOrder(order._id)}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon
                                            className="text-blue-500 dark:text-blue-400 transition-transform duration-300"
                                            icon={expandedOrders[order._id] ? faChevronDown : faChevronRight}
                                        />
                                        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                                            Commande #{order._id.substring(0, 8).toUpperCase()}
                                        </CardTitle>
                                    </div>
                                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                </div>

                                {/* Order Summary - Always visible */}
                                <div className="flex justify-between items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon className="mr-2" icon={faCalendarAlt} />
                                        {dayjs(order.orderDate).format("DD/MM/YYYY")}
                                    </div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        <FontAwesomeIcon className="mr-1" icon={faEuroSign} />
                                        {isAdmin ? (
                                            <span>
                                                <span className="line-through mr-2">{formatPrice(order.totalAmount)}</span>
                                                <span className="text-green-600 dark:text-green-400 font-medium">Gratuit</span>
                                            </span>
                                        ) : (
                                            formatPrice(order.totalAmount)
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            {/* Expandable Details Section */}
                            <AnimatePresence>
                                {expandedOrders[order._id] && (
                                    <motion.div
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        initial={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CardContent className="pt-0">
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                                                {/* Order Details */}
                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    <div className="space-y-2">
                                                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Informations client</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {order.firstName} {order.lastName}
                                                        </p>
                                                        {order.email && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.email}</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Livraison</h3>
                                                        {order.deliveryMethod && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <FontAwesomeIcon className="mr-2" icon={faTruck} />
                                                                {order.deliveryMethod}
                                                            </p>
                                                        )}
                                                        {order.deliveryAddress && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <FontAwesomeIcon className="mr-2" icon={faMapMarkerAlt} />
                                                                {order.deliveryAddress.street}{', '}
                                                                {order.deliveryAddress.postalCode}{' '}
                                                                {order.deliveryAddress.city}{', '}
                                                                {order.deliveryAddress.country}
                                                            </p>
                                                        )}
                                                        {order.trackingNumber && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <FontAwesomeIcon className="mr-2" icon={faBarcode} />
                                                                <span className="font-medium">Suivi:</span> {order.trackingNumber}
                                                                {order.carrierInfo && ` (${order.carrierInfo})`}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Order Items */}
                                                <div className="mt-4">
                                                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Articles commandés</h3>
                                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                            <thead className="bg-gray-100 dark:bg-gray-700">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" scope="col">
                                                                        Produit
                                                                    </th>
                                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" scope="col">
                                                                        Quantité
                                                                    </th>
                                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" scope="col">
                                                                        Prix unitaire
                                                                    </th>
                                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" scope="col">
                                                                        Total
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                                {order.items.map((item, index) => (
                                                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                                                            <div className="flex items-center">
                                                                                <FontAwesomeIcon className="mr-2 text-gray-400 dark:text-gray-500" icon={faBox} />
                                                                                {item.title || item.name || "Produit"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 text-right">
                                                                            {item.quantity}
                                                                        </td>
                                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 text-right">
                                                                            {isAdmin ? (
                                                                                <span>
                                                                                    <span className="line-through mr-2">{formatPrice(item.price)}</span>
                                                                                    <span className="text-green-600 dark:text-green-400 font-medium">Gratuit</span>
                                                                                </span>
                                                                            ) : (
                                                                                formatPrice(item.price)
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200 text-right">
                                                                            {isAdmin ? (
                                                                                <span>
                                                                                    <span className="line-through mr-2">{formatPrice(item.price * item.quantity)}</span>
                                                                                    <span className="text-green-600 dark:text-green-400 font-medium">Gratuit</span>
                                                                                </span>
                                                                            ) : (
                                                                                formatPrice(item.price * item.quantity)
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                            <tfoot className="bg-gray-50 dark:bg-gray-700">
                                                                {/* Subtotal Row */}
                                                                <tr>
                                                                    <td className="px-4 py-2 text-sm font-medium text-right text-gray-700 dark:text-gray-300" colSpan={3}>
                                                                        Sous-total
                                                                    </td>
                                                                    <td className="px-4 py-2 text-sm font-medium text-right text-gray-800 dark:text-white">
                                                                        {isAdmin ? (
                                                                            <span>
                                                                                <span className="line-through mr-2">{formatPrice(totals.subtotal)}</span>
                                                                                <span className="text-green-600 dark:text-green-400 font-medium">Gratuit</span>
                                                                            </span>
                                                                        ) : (
                                                                            formatPrice(totals.subtotal)
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                                {/* Shipping Cost Row */}
                                                                <tr>
                                                                    <td className="px-4 py-2 text-sm font-medium text-right text-gray-700 dark:text-gray-300" colSpan={3}>
                                                                        Frais de livraison
                                                                    </td>
                                                                    <td className="px-4 py-2 text-sm font-medium text-right text-gray-800 dark:text-white">
                                                                        {isAdmin ? (
                                                                            <span>
                                                                                <span className="line-through mr-2">{formatPrice(order.deliveryCost || 0)}</span>
                                                                                <span className="text-green-600 dark:text-green-400 font-medium">Gratuit</span>
                                                                            </span>
                                                                        ) : (
                                                                            formatPrice(order.deliveryCost || 0)
                                                                        )}
                                                                    </td>
                                                                </tr>

                                                                {/* Total Row */}
                                                                <tr className="border-t border-gray-200 dark:border-gray-600">
                                                                    <td className="px-4 py-3 text-sm font-bold text-right text-gray-700 dark:text-gray-300" colSpan={3}>
                                                                        Total
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm font-bold text-right text-gray-800 dark:text-white">
                                                                        {isAdmin ? (
                                                                            <span>
                                                                                <span className="line-through mr-2">{formatPrice(order.totalAmount)}</span>
                                                                                <span className="text-green-600 dark:text-green-400 font-medium">Gratuit</span>
                                                                            </span>
                                                                        ) : (
                                                                            formatPrice(order.totalAmount)
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </div>

                                                {/* Tracking information */}
                                                {order.status === "Shipped" && order.trackingNumber && (
                                                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                                                        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Information de suivi</h3>
                                                        <div className="flex items-start">
                                                            <FontAwesomeIcon className="mt-1 mr-2 text-blue-500 dark:text-blue-400" icon={faTruck} />
                                                            <div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                                    <span className="font-medium">Transporteur:</span> {order.carrierInfo || order.deliveryMethod || "Transporteur"}
                                                                </p>
                                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                                    <span className="font-medium">Numéro de suivi:</span> {order.trackingNumber}
                                                                </p>
                                                                {/* Add tracking link if available */}
                                                                <a
                                                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1 inline-block"
                                                                    href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                                                                    rel="noopener noreferrer"
                                                                    target="_blank"
                                                                >
                                                                    Suivre mon colis →
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Action buttons */}
                                                <div className="mt-6 flex justify-end">
                                                    <Link
                                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                                                        href={`/orders/${order._id}`}
                                                    >
                                                        Voir le détail complet
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

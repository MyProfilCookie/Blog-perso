/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
/* eslint-disable padding-line-between-statements */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Swal from "sweetalert2";

// const OrderConfirmationPage = () => {
//     const [order, setOrder] = useState<any>(null);
//     const [user, setUser] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const router = useRouter();


//     useEffect(() => {
//         const fetchOrderData = async () => {
//             try {
//                 const orderId = localStorage.getItem("orderId");
//                 const token = localStorage.getItem("userToken");

//                 if (!orderId) {
//                     throw new Error("Aucun ID de commande trouvé. Veuillez passer une commande.");
//                 }

//                 if (!token) {
//                     throw new Error("Utilisateur non authentifié. Veuillez vous reconnecter.");
//                 }

//                 // Récupération des données de la commande
//                 const orderResponse = await fetch(
//                     `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
//                     {
//                         method: "GET",
//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 if (!orderResponse.ok) {
//                     const errorData = await orderResponse.json();
//                     throw new Error(errorData.message || "Erreur lors de la récupération des données de commande.");
//                 }

//                 const orderData = await orderResponse.json();
//                 setOrder(orderData);

//                 // Récupération des informations utilisateur
//                 const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (!userResponse.ok) {
//                     const userErrorData = await userResponse.json();
//                     throw new Error(userErrorData.message || "Erreur lors de la récupération des informations utilisateur.");
//                 }

//                 const userData = await userResponse.json();
//                 setUser(userData.user);

//             } catch (error: any) {
//                 console.error("Erreur lors de la récupération des données :", error.message);
//                 Swal.fire({
//                     title: "Erreur",
//                     text: error.message || "Une erreur inattendue s'est produite.",
//                     icon: "error",
//                     confirmButtonText: "Retourner à l'accueil",
//                 }).then(() => router.push("/"));
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrderData();
//     }, [router]);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p>Chargement en cours...</p>
//             </div>
//         );
//     }

//     if (!order || !user) {
//         return (
//             <div className="container mx-auto my-12 text-center">
//                 <p className="text-red-500">
//                     {order ? "Utilisateur introuvable. Veuillez vous reconnecter." : "Commande introuvable. Assurez-vous d'avoir passé une commande valide."}
//                 </p>
//             </div>
//         );
//     }


//     const {
//         items = [],
//         deliveryAddress = { street: "Adresse inconnue", city: "Ville inconnue", postalCode: "Code postal inconnu", country: "Pays inconnu" },
//         deliveryCost = 0,
//         totalAmount = 0,
//         paymentMethod = "Non spécifiée",
//         paymentStatus = "Inconnu",
//     } = order;

//     return (
//         <div className="container mx-auto my-12 bg-white p-6 rounded-lg shadow-md">
//             <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">Confirmation de Commande</h1>

//             {/* Informations Client */}
//             <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations Client</h2>
//                 <p><strong>Prénom :</strong> {user.prenom || "Non spécifié"}</p>
//                 <p><strong>Nom :</strong> {user.nom || "Non spécifié"}</p>
//                 <p><strong>Email :</strong> {user.email || "Non spécifié"}</p>
//                 <p><strong>Téléphone :</strong> {user.phone || "Non spécifié"}</p>
//             </div>

//             {/* Adresse de Livraison */}
//             <div className="p-6 bg-indigo-50 rounded-lg shadow-md mt-6">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Adresse de Livraison</h2>
//                 <p>
//                     {user.deliveryAddress.street},{" "}
//                     {user.deliveryAddress.city},{" "}
//                     {user.deliveryAddress.postalCode},{" "}
//                     {user.deliveryAddress.country}
//                 </p>
//             </div>

//             {/* Détails de la Commande */}
//             <div className="p-6 bg-indigo-50 rounded-lg shadow-md mt-6">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Détails de la Commande</h2>
//                 <ul>
//                     {items.length > 0 ? (
//                         items.map((item: any) => (
//                             <li key={item._id} className="mb-2">

//                                 <strong>{item.quantity}</strong> x {item.title || "Article"} - {item.price?.toFixed(2) || "0.00"} €
//                             </li>
//                         ))
//                     ) : (
//                         <li className="text-red-500">Aucun article trouvé dans la commande.</li>
//                     )}
//                 </ul>
//                 <p><strong>Méthode de Livraison :</strong> {order.deliveryMethod || "Standard"}</p>
//                 <p><strong>Frais de Livraison :</strong> {deliveryCost.toFixed(2)} €</p>
//                 <p><strong>Méthode de Paiement :</strong> {paymentMethod}</p>
//                 <p><strong>Statut du Paiement :</strong> {paymentStatus}</p>
//                 <p className="font-bold text-lg mt-4 text-blue-500">
//                     <strong>Total :</strong> {totalAmount.toFixed(2)} €
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default OrderConfirmationPage;
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const OrderConfirmationPage = () => {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const orderId = localStorage.getItem("orderId");
                const token = localStorage.getItem("userToken");

                if (!orderId) {
                    throw new Error("Aucun ID de commande trouvé. Veuillez passer une commande.");
                }

                if (!token) {
                    throw new Error("Utilisateur non authentifié. Veuillez vous reconnecter.");
                }

                console.log("Fetching order with ID:", orderId);

                // Récupération des données de la commande
                const orderResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!orderResponse.ok) {
                    const errorData = await orderResponse.json();
                    throw new Error(errorData.message || "Erreur lors de la récupération des données de commande.");
                }

                const orderData = await orderResponse.json();
                console.log("Order data fetched successfully:", orderData);
                setOrder(orderData);
            } catch (error: any) {
                console.error("Erreur lors de la récupération des données :", error.message);
                Swal.fire({
                    title: "Erreur",
                    text: error.message || "Une erreur inattendue s'est produite.",
                    icon: "error",
                    confirmButtonText: "Retourner à l'accueil",
                }).then(() => router.push("/"));
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Chargement en cours...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto my-12 text-center">
                <p className="text-red-500">Commande introuvable. Assurez-vous d'avoir passé une commande valide.</p>
            </div>
        );
    }

    // Extraire les informations nécessaires
    const {
        firstName = "Non spécifié",
        lastName = "Non spécifié",
        email = "Non spécifié",
        phone = "Non spécifié",
        deliveryAddress = {
            street: "Adresse inconnue",
            city: "Ville inconnue",
            postalCode: "Code postal inconnu",
            country: "Pays inconnu",
        },
        items = [],
        deliveryCost = 0,
        totalAmount = 0,
        deliveryMethod = "Standard",
        paymentMethod = "Non spécifiée",
        paymentStatus = "Inconnu",
    } = order;

    return (
        <div className="container mx-auto my-12 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">Confirmation de Commande</h1>

            {/* Informations Client */}
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations Client</h2>
                <p><strong>Prénom :</strong> {firstName}</p>
                <p><strong>Nom :</strong> {lastName}</p>
                <p><strong>Email :</strong> {email}</p>
                <p><strong>Téléphone :</strong> {phone}</p>
            </div>

            {/* Adresse de Livraison */}
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Adresse de Livraison</h2>
                <p>
                    {deliveryAddress.street},{" "}
                    {deliveryAddress.city},{" "}
                    {deliveryAddress.postalCode},{" "}
                    {deliveryAddress.country}
                </p>
            </div>

            {/* Détails de la Commande */}
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Détails de la Commande</h2>
                <ul>
                    {items.length > 0 ? (
                        items.map((item: any) => (
                            <li key={item._id} className="mb-2">
                                <strong>{item.quantity}</strong> x {item.title || "Article"} - {item.price?.toFixed(2) || "0.00"} €
                            </li>
                        ))
                    ) : (
                        <li className="text-red-500">Aucun article trouvé dans la commande.</li>
                    )}
                </ul>
                <p><strong>Méthode de Livraison :</strong> {deliveryMethod}</p>
                <p><strong>Frais de Livraison :</strong> {deliveryCost.toFixed(2)} €</p>
                <p><strong>Méthode de Paiement :</strong> {paymentMethod}</p>
                <p><strong>Statut du Paiement :</strong> {paymentStatus}</p>
                <p className="font-bold text-lg mt-4 text-blue-500">
                    <strong>Total :</strong> {totalAmount.toFixed(2)} €
                </p>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;

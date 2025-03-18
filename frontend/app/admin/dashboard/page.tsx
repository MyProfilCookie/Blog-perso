/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-console */
"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Textarea,
  TableRow,
  TableCell,
  TableColumn,
  TableHeader,
  Table,
  TableBody,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faCrown,
  faReply,
  faCheck,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { motion } from "framer-motion";

import OrderHistoryDialog from "@/components/OrderHistoryDialog";
import articlesData from "@/public/dataarticles.json";
import ProgressionCommande from "@/components/ProgressionCommande";

// Fonction pour vérifier si l'utilisateur est admin
const fetchUserData = () => {
  const storedUser = localStorage.getItem("user");

  return storedUser ? JSON.parse(storedUser) : null;
};

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [, setTransactionId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    date: "",
  });
  const [currentTime, setCurrentTime] = useState("");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [, setArticles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const [banReason, setBanReason] = useState("Violation des règles");
  const [showContent, setShowContent] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTransaction = async () => {
      // Vérifier silencieusement sans log si aucun ID n'est fourni
      if (!paymentId || paymentId === "null") {
        // Log uniquement en environnement de développement
        if (process.env.NODE_ENV === "development") {
          console.debug("Aucun ID de paiement disponible pour cette commande");
        }

        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment-confirmations/${paymentId}`,
        );

        if (!response.ok) throw new Error("Erreur lors de la récupération");

        const data = await response.json();

        console.log("✅ Transaction récupérée :", data);
        setTransactionId(data.transactionId);
      } catch (error) {
        console.error("❌ Erreur :", error);
        setTransactionId(null);
      }
    };

    fetchTransaction();
  }, [paymentId]);

  useEffect(() => {
    const fetchedUser = fetchUserData();

    if (fetchedUser && fetchedUser.role === "admin") {
      setUser(fetchedUser);
      fetchLessons();
      fetchUsers();
      fetchArticles();
      fetchMessages();
      fetchOrders();
    } else {
      router.push("/"); // Redirige si l'utilisateur n'est pas admin
    }

    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  // Fonction pour récupérer toutes les leçons
  const fetchLessons = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setLessons(data);
    } catch (error) {
      // afficher un message d'erreur
      alert(`Erreur lors de la récupération des leçons : ${error}`);
    }
  };

  // Fonction pour récupérer tous les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      alert(`Erreur lors de la récupération des utilisateurs : ${error}`);
    }
  };

  // Fonction pour récupérer les articles
  const fetchArticles = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setArticles(data);
    } catch (error) {
      alert(`Erreur lors de la récupération des articles : ${error}`);
    }
  };

  // Fonction pour récupérer les messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setMessages(data);
    } catch (error) {
      alert(`Erreur lors de la récupération des messages : ${error}`);
    }
  };

  // Fonction pour ajouter une leçon
  const addLesson = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLesson),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setNewLesson({ title: "", content: "", date: "" });
      fetchLessons(); // Recharger les leçons après l'ajout
    } catch (error) {
      alert(`Erreur lors de l'ajout de la leçon : ${error}`);
    }
  };

  // Fonction pour mettre à jour une leçon
  const updateLesson = async (id: any, updatedData: never) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchLessons(); // Recharger les leçons après la mise à jour
    } catch (error) {
      alert(`Erreur lors de la mise à jour de la leçon : ${error}`);
    }
  };

  // Fonction pour supprimer une leçon
  const deleteLesson = async (id: any) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez supprimer cette leçon.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/lessons/${id}`,
            {
              method: "DELETE",
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          fetchLessons(); // Recharger les leçons après suppression
        } catch (error) {
          alert(`Erreur lors de la suppression de la leçon : ${error}`);
        }
      }
    });
  };

  // ✅ Récupérer les messages de contact
  const getContactMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contact`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setMessages(data);
    } catch (error) {
      Swal.fire(
        "Erreur",
        "Erreur lors de la récupération des messages.",
        "error",
      );
    }
  };

  // ✅ Marquer un message comme lu
  const markContactMessageAsRead = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contact/${id}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      Swal.fire("Succès", "Le message a été marqué comme lu.", "success");
      getContactMessages();
    } catch (error) {
      Swal.fire(
        "Erreur",
        "Impossible de marquer le message comme lu.",
        "error",
      );
    }
  };

  // ✅ Répondre à un message
  const replyToContactMessage = async (id: string) => {
    const { value: reply } = await Swal.fire({
      title: "Répondre au message",
      input: "textarea",
      inputPlaceholder: "Écrivez votre réponse ici...",
      showCancelButton: true,
    });

    if (reply) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/contact/${id}/reply`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reponse: reply }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        Swal.fire("Succès", "Votre réponse a été envoyée.", "success");
        getContactMessages();
      } catch (error) {
        Swal.fire("Erreur", "Impossible d'envoyer la réponse.", "error");
      }
    }
  };

  // ✅ Supprimer un message
  const deleteContactMessage = async (id: string) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera définitivement le message.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/contact/${id}`,
            {
              method: "DELETE",
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          Swal.fire("Supprimé !", "Le message a été supprimé.", "success");
          getContactMessages();
        } catch (error) {
          Swal.fire("Erreur", "Impossible de supprimer le message.", "error");
        }
      }
    });
  };

  // Fonction pour supprimer un utilisateur avec motif
  const deleteUser = async (id: any, email: string) => {
    if (email === "virginie.ayivor@yahoo.fr") {
      Swal.fire({
        title: "Action interdite",
        text: "Vous ne pouvez pas supprimer cet utilisateur.",
        icon: "error",
        confirmButtonText: "OK",
      });

      return;
    }

    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Motif : ${banReason}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/ban`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: id,
                reason: banReason,
              }),
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          fetchUsers(); // Recharger la liste des utilisateurs après suppression
        } catch (error) {
          alert(`Erreur lors de la suppression de l'utilisateur : ${error}`);
        }
      }
    });
  };

  const promoteToAdminOrUser = async (id: any, role: string) => {
    try {
      let url = "";

      if (role === "admin") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/users/demote/${id}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/users/promote/${id}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchUsers(); // Recharger la liste des utilisateurs après modification
    } catch (error) {
      alert(`Erreur lors de la modification du rôle : ${error}`);
    }
  };

  // Fonction pour ajouter un article
  const addArticle = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newArticle),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setNewArticle({ title: "", content: "" });
      fetchArticles();
    } catch (error) {
      alert(`Erreur lors de l'ajout de l'article : ${error}`);
    }
  };

  // Fonction pour mettre à jour un article
  const updateArticle = async (
    id: string,
    updatedData: {
      id: number;
      title: string;
      subtitle: string;
      image: string;
      content: string;
    },
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchArticles();
    } catch (error) {
      alert(`Erreur lors de la mise à jour de l'article : ${error}`);
    }
  };

  const markMessageAsRead = async (messageId: string | undefined) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        Swal.fire("Succès", "Le message a été marqué comme lu.", "success");
        // Optionnel : rafraîchir la liste des messages après la mise à jour
        fetchMessages();
      } else {
        Swal.fire(
          "Erreur",
          "Impossible de marquer le message comme lu.",
          "error",
        );
      }
    } catch (error) {
      alert(`Erreur lors de la mise à jour du message : ${error}`);
      Swal.fire("Erreur", "Une erreur est survenue.", "error");
    }
  };

  // Cette fonction a été renommée pour éviter les conflits d'identifiants
  const initiateReplyToMessage = async (messageId: string | undefined) => {
    try {
      // Afficher une boîte de dialogue pour saisir une réponse
      const { value: reply } = await Swal.fire({
        title: "Répondre au message",
        input: "textarea",
        inputLabel: "Votre réponse",
        inputPlaceholder: "Écrivez votre réponse ici...",
        showCancelButton: true,
      });

      if (reply) {
        // Envoyer une requête pour enregistrer la réponse
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}/reply`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reply }),
          },
        );

        if (response.ok) {
          Swal.fire("Succès", "Votre réponse a été envoyée.", "success");
          // Optionnel : rafraîchir la liste des messages ou des réponses
          fetchMessages(); // Si vous souhaitez mettre à jour les messages après la réponse
        } else {
          Swal.fire("Erreur", "Impossible d'envoyer la réponse.", "error");
        }
      }
    } catch (error) {
      alert(`Erreur lors de la réponse au message : ${error}`);
      Swal.fire("Erreur", "Une erreur est survenue.", "error");
    }
  };

  const deleteMessage = async (messageId: string | undefined) => {
    try {
      // Confirmation avant de supprimer le message
      const confirmation = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Cette action supprimera définitivement le message.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer !",
        cancelButtonText: "Annuler",
      });

      if (confirmation.isConfirmed) {
        // Suppression du message via l'API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          Swal.fire("Supprimé !", "Le message a été supprimé.", "success");
          // Optionnel : rafraîchir la liste des messages après la suppression
          fetchMessages(); // Appel à cette fonction si vous voulez mettre à jour la liste des messages
        } else {
          Swal.fire("Erreur", "Impossible de supprimer le message.", "error");
        }
      }
    } catch (error) {
      alert(`Erreur lors de la suppression du message : ${error}`);
      Swal.fire(
        "Erreur",
        "Une erreur est survenue lors de la suppression.",
        "error",
      );
    }
  };

  // Fonction pour supprimer un article
  const deleteArticle = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchArticles();
    } catch (error) {
      alert(`Erreur lors de la suppression de l'article : ${error}`);
    }
  };

  // Fonction pour récupérer les commandes
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      const ordersData = responseData.orders || [];

      const ordersWithPayments = await Promise.all(
        ordersData.map(async (order: { paymentId: any }) => {
          // Utiliser le bon champ pour l'ID de paiement
          const paymentId = order.paymentId; // Si le champ s'appelle autrement, adaptez ici (ex: order.payment_id)

          const paymentDetails = paymentId
            ? await fetchPaymentDetails(paymentId)
            : null;

          return { ...order, payment: paymentDetails };
        }),
      );

      // Set orders directly instead of using a nested function
      setOrders(ordersWithPayments as any);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      Swal.fire("Erreur", "Impossible de récupérer les commandes.", "error");
    }
  };

  async function fetchPaymentDetails(paymentId: any) {
    if (!paymentId) {
      console.warn("⚠️ ID de paiement invalide:", paymentId);

      return null;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment-confirmations/${paymentId}`,
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      return response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de paiement:",
        error,
      );

      return null;
    }
  }

  // Fonction pour afficher l'historique des statuts
  const showStatusHistory = (orderId: React.SetStateAction<null>) => {
    setSelectedOrderId(orderId);
    setIsHistoryDialogOpen(true);
  };

  // Fonction pour mettre à jour le statut d'une commande
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      console.log(
        `Tentative de mise à jour du statut pour la commande ${id} vers ${status}`,
      );

      // Demander une note optionnelle pour le changement de statut
      const { value: notes, isConfirmed } = await Swal.fire({
        title: "Mise à jour du statut",
        text: `Voulez-vous changer le statut en "${status}" ?`,
        icon: "question",
        input: "textarea",
        inputLabel: "Notes (optionnel)",
        inputPlaceholder: "Ajoutez des notes pour ce changement de statut...",
        showCancelButton: true,
        confirmButtonText: "Confirmer",
        cancelButtonText: "Annuler",
      });

      if (!isConfirmed) {
        console.log("Mise à jour annulée par l'utilisateur");

        return;
      }

      console.log(
        `Envoi de la requête avec statut=${status} et notes=${notes || "aucune"}`,
      );

      // Utiliser l'endpoint spécifique pour la mise à jour du statut
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, notes }),
        },
      );

      const responseData = await response.json();

      console.log("Réponse du serveur:", responseData);

      if (response.ok) {
        // Afficher un message de succès
        Swal.fire({
          title: "Statut mis à jour !",
          text: `La commande est maintenant en statut : ${status}`,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Rafraîchir les commandes
        fetchOrders();
      } else {
        console.warn("Réponse inattendue du serveur:", response);
        throw new Error(`Réponse inattendue: ${response.status}`);
      }
    } catch (error) {
      console.error(
        "Erreur détaillée lors de la mise à jour du statut:",
        error,
      );

      // Extraire les détails de l'erreur pour un message plus informatif
      let errorMessage =
        "Une erreur s'est produite lors de la mise à jour du statut.";

      Swal.fire({
        title: "Erreur",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Fonction pour supprimer une commande
  const deleteOrder = async (id: string) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez supprimer cette commande.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
            {
              method: "DELETE",
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          fetchOrders();
        } catch (error) {
          alert(`Erreur lors de la suppression de la commande : ${error}`);
        }
      }
    });
  };

  if (!user) return null;

  return (
    <div className="container mx-auto mt-6 px-2 sm:px-4">
      {/* Styles responsifs */}
      <style>{`
        .text-ellipsis {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        
        .id-field {
          font-size: 0.75rem;
          word-break: break-all;
          max-width: 100%;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .scrollable-content {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          max-width: 100%;
          scrollbar-width: thin;
        }
        
        .scrollable-content::-webkit-scrollbar {
          height: 4px;
        }
        
        .scrollable-content::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        /* Réorganisation des cartes pour mobile */
        @media (max-width: 640px) {
          .card-content {
            flex-direction: column;
          }
          
          .admin-table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
          
          .order-card {
            padding: 0.75rem !important;
          }
          
          .order-details {
            font-size: 0.75rem !important;
          }
          
          .user-actions {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          
          .user-card,
          .lesson-card {
            padding: 0.75rem !important;
          }
          
          /* Ajustement pour les longs textes */
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
    
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
    
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
    
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
    
        .animate-slide-in {
          animation: slide-in 1.5s ease-out;
        }
    
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
    
        .card-hover:hover {
          transform: scale(1.02);
          transition: transform 0.3s ease-in-out;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <h1 className="mb-4 text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse text-center">
        Dashboard Admin
      </h1>

      <p className="mb-3 sm:mb-6 text-gray-600 dark:text-white text-base sm:text-lg animate-bounce text-center">
        Heure actuelle : {currentTime}
      </p>

      <h2 className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center animate-slide-in">
        Bonjour,{" "}
        {(user as { prenom?: string })?.prenom ||
          (user as { pseudo: string }).pseudo}{" "}
        <FontAwesomeIcon
          className="text-yellow-400 animate-spin-slow"
          icon={faCrown}
          size="sm"
        />
      </h2>

      {/* Gestion des commandes */}
      <div className="mt-6 sm:mt-8">
        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-center sm:text-left">
          Gestion des commandes
        </h3>
        <div className="space-y-3 sm:space-y-3">
          {orders.map((order) => (
            <div
              key={
                order && typeof order === "object" && "_id" in order
                  ? (order as { _id: string })._id
                  : undefined
              }
              className="border rounded-lg shadow-md p-2 sm:p-4 bg-cream dark:bg-black dark:text-white flex flex-col gap-2 order-card card-hover"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                {/* Informations sur la commande */}
                <div className="flex-1 text-left overflow-hidden">
                  <p className="id-field font-bold text-sm">
                    ID : {(order as { _id: string })._id}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400 truncate">
                    Client :{" "}
                    {(order as { lastName?: string; firstName?: string })
                      .lastName
                      ? `${(order as { firstName?: string }).firstName} ${
                          (order as { lastName?: string }).lastName
                        }`
                      : "Inconnu"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
                    Email : {(order as { email: string }).email}
                  </p>
                  <div className="scrollable-content order-details">
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      Produit :{" "}
                      {(order as { items?: Array<{ title: string }> }).items
                        ?.map((item) => item.title)
                        .join(" • ") || "Aucun"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Date :{" "}
                    {dayjs((order as { orderDate: string }).orderDate).format(
                      "DD/MM/YYYY",
                    )}
                  </p>
                  <p className="text-sm text-blue-500 dark:text-blue-300">
                    Paiement :{" "}
                    {(order as { paymentStatus?: string }).paymentStatus} (
                    {(order as { paymentMethod?: string }).paymentMethod})
                  </p>
                  {(order as { trackingNumber?: string }).trackingNumber && (
                    <p className="text-sm text-green-600 dark:text-green-400 truncate">
                      N° de suivi :{" "}
                      {(order as { trackingNumber?: string }).trackingNumber}
                    </p>
                  )}
                </div>

                {/* Actions pour les commandes */}
                <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[180px]">
                  <Button
                    className="w-full"
                    color="secondary"
                    size="sm"
                    onClick={() =>
                      showStatusHistory(
                        (order as { _id: string })._id as unknown as null,
                      )
                    }
                  >
                    <FontAwesomeIcon className="mr-2" icon={faHistory} />{" "}
                    Historique
                  </Button>
                  {(order as { status?: string }).status === "Shipped" && (
                    <div className="mt-1 w-full">
                      <Input
                        placeholder="N° de suivi"
                        size="sm"
                        value={
                          (order as { trackingNumber?: string })
                            .trackingNumber || ""
                        }
                        onChange={(e) => {
                          const updatedOrder = {
                            ...(order as {
                              _id: string;
                              trackingNumber?: string;
                            }),
                            trackingNumber: e.target.value,
                          };

                          console.log(
                            "Order update requested:",
                            (order as { _id: string })._id,
                            updatedOrder,
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Composant de progression */}
              <div className="mt-2 mb-2 w-full">
                <ProgressionCommande
                  statut={
                    (order as { status?: string }).status || "Enregistree"
                  }
                />
              </div>

              {/* Actions pour les statuts */}
              <div className="flex flex-wrap gap-2 mt-2">
                <select
                  className="p-2 border rounded-md bg-cream dark:bg-gray-800 text-gray-800 dark:text-white flex-grow text-sm"
                  value="" // Reset à chaque changement
                  onChange={(e) => {
                    if (e.target.value) {
                      updateOrderStatus(
                        (order as { _id: string })._id,
                        e.target.value,
                      );
                      e.target.value = ""; // Reset après sélection
                    }
                  }}
                >
                  <option value="">Changer le statut...</option>
                  {(order as { status?: string }).status !== "Pending" && (
                    <option value="Pending">Enregistrée</option>
                  )}
                  {(order as { status?: string }).status !== "Processing" && (
                    <option value="Processing">En préparation</option>
                  )}
                  {(order as { status?: string }).status !== "Shipped" && (
                    <option value="Shipped">Expédiée</option>
                  )}
                  {(order as { status?: string }).status !== "Delivered" && (
                    <option value="Delivered">Livrée</option>
                  )}
                  {(order as { status?: string }).status !== "Cancelled" && (
                    <option value="Cancelled">Annulée</option>
                  )}
                </select>

                <Button
                  color="danger"
                  size="sm"
                  onClick={() => deleteOrder((order as { _id: string })._id)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gestion des messages de contact */}
      <div className="mt-6 sm:mt-8">
        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-center sm:text-left">
          Gestion des messages de contact
        </h3>

        <div className="scrollable-content admin-table">
          <Table
            aria-label="Liste des messages de contact"
            className="min-w-full"
          >
            <TableHeader>
              <TableColumn>Nom</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Message</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {messages.map((contactMsg, index) => (
                <TableRow key={(contactMsg as { _id?: string })._id || index}>
                  <TableCell className="max-w-[100px] truncate">
                    {(contactMsg as { nom?: string }).nom || "Unknown"}
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate">
                    {(contactMsg as { email?: string }).email}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="line-clamp-2">
                      {(contactMsg as { message?: string }).message}
                    </div>
                  </TableCell>
                  <TableCell>
                    {dayjs(
                      (contactMsg as { date?: string }).date || new Date(),
                    ).format("DD/MM/YY")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Button
                        color={
                          (contactMsg as { lu?: boolean }).lu
                            ? "success"
                            : "secondary"
                        }
                        size="sm"
                        onClick={() =>
                          markContactMessageAsRead(
                            (contactMsg as { _id: string })._id,
                          )
                        }
                      >
                        {(contactMsg as { lu?: boolean }).lu ? "✓" : "📩"}
                      </Button>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() =>
                          replyToContactMessage(
                            (contactMsg as { _id: string })._id,
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faReply} />
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() =>
                          deleteContactMessage(
                            (contactMsg as { _id: string })._id,
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Gestion des utilisateurs */}
      <div className="mt-6 sm:mt-8">
        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-center sm:text-left">
          Gestion des utilisateurs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.map((user) => (
            <div
              key={
                user && typeof user === "object" && "_id" in user
                  ? (user as { _id: string })._id
                  : undefined
              }
              className="border rounded-lg shadow-md p-3 sm:p-4 bg-cream dark:bg-black dark:text-white flex flex-col gap-2 user-card card-hover"
            >
              <div className="flex flex-col items-center text-center overflow-hidden">
                <p className="id-field font-bold text-sm">
                  ID : {(user as { _id: string })._id}
                </p>
                <p className="font-bold text-lg truncate max-w-full">
                  Pseudo : {(user as { pseudo: string }).pseudo}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 truncate max-w-full">
                  Email : {(user as { email: string }).email}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Rôle : {(user as { role: string }).role}
                </p>
              </div>
              <div className="grid user-actions gap-2 w-full grid-cols-1 sm:grid-cols-2 mt-2">
                {(user as { email: string }).email !==
                  "virginie.ayivor@yahoo.fr" && (
                  <Button
                    className="w-full col-span-full"
                    color={
                      (user as { role: string }).role === "admin"
                        ? "warning"
                        : "success"
                    }
                    size="sm"
                    onClick={() =>
                      promoteToAdminOrUser(
                        (user as any)._id,
                        (user as any).role,
                      )
                    }
                  >
                    {(user as { role: string }).role === "admin"
                      ? "Rétrograder"
                      : "Promouvoir"}
                  </Button>
                )}

                {["Violation", "Spam", "Harcèlement", "Autre"].map((reason) => (
                  <Button
                    key={reason}
                    className="w-full"
                    color="secondary"
                    size="sm"
                    onClick={() =>
                      setBanReason(
                        reason === "Violation"
                          ? "Violation des règles"
                          : reason,
                      )
                    }
                  >
                    {reason}
                  </Button>
                ))}

                <Button
                  className="w-full col-span-full"
                  color="danger"
                  disabled={
                    typeof user === "object" &&
                    "email" in user &&
                    (user as { email: string }).email ===
                      "virginie.ayivor@yahoo.fr"
                  }
                  size="sm"
                  onClick={() =>
                    deleteUser(
                      (user as any)._id,
                      (user as { email: string }).email,
                    )
                  }
                >
                  <FontAwesomeIcon icon={faTrash} /> Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gestion des leçons */}
      <div className="mt-6 sm:mt-8">
        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-center sm:text-left">
          Gestion des leçons
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {lessons.map((lesson) => (
            <div
              key={(lesson as any)._id}
              className="border rounded-lg shadow-md p-3 sm:p-4 bg-cream dark:bg-black dark:text-white 
                flex flex-col lesson-card card-hover"
            >
              <div className="card-header mb-2 text-center">
                <p className="font-bold text-lg truncate max-w-full">
                  {(lesson as { title: string }).title}
                </p>
                <p className="id-field text-gray-500 dark:text-gray-300">
                  ID : {(lesson as any)._id}
                </p>
              </div>
              <div className="card-body mb-2 text-center">
                <p className="text-sm text-gray-700 dark:text-gray-400 mb-2 line-clamp-2">
                  {(lesson as { content: string }).content}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Date: {dayjs((lesson as any).date).format("DD/MM/YYYY")}
                </p>
              </div>
              <div className="card-footer mt-auto pt-2 flex gap-2">
                <Button
                  className="flex-1"
                  color="primary"
                  size="sm"
                  onClick={() =>
                    updateLesson((lesson as any)._id?.toString() || "", lesson)
                  }
                >
                  <FontAwesomeIcon icon={faEdit} /> Modifier
                </Button>
                <Button
                  className="flex-1"
                  color="danger"
                  size="sm"
                  onClick={() =>
                    deleteLesson((lesson as any)._id?.toString() || "")
                  }
                >
                  <FontAwesomeIcon icon={faTrash} /> Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ajouter une nouvelle leçon */}
      <div className="mt-6 sm:mt-8">
        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">
          Ajouter une nouvelle leçon
        </h3>
        <Input
          key="title"
          className="mb-3"
          label="Titre de la leçon"
          value={newLesson.title}
          onChange={(e) =>
            setNewLesson({ ...newLesson, title: e.target.value })
          }
        />
        <Textarea
          key="content"
          className="mb-3"
          label="Contenu de la leçon"
          value={newLesson.content}
          onChange={(e) =>
            setNewLesson({ ...newLesson, content: e.target.value })
          }
        />
        <Input
          key="date"
          className="mb-3"
          label="Date de la leçon"
          type="date"
          value={newLesson.date}
          onChange={(e) => setNewLesson({ ...newLesson, date: e.target.value })}
        />
        <Button className="mt-3" size="sm" onClick={addLesson}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter une leçon
        </Button>
      </div>

      {/* Gestion des articles */}
      <motion.div
        animate={{ opacity: 1 }}
        className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold col-span-full text-center sm:text-left">
          Gestion des articles
        </h3>
        {articlesData.articles.map((article) => (
          <div
            key={article.id}
            className="col-span-1 border rounded-lg shadow-md p-3 sm:p-4 bg-cream dark:bg-black 
              flex flex-col card-hover"
          >
            <div className="card-header mb-2 text-center">
              <img
                alt={article.title}
                className="w-full h-32 sm:h-40 object-cover rounded-md mb-2"
                src={article.image}
              />
              <p className="font-bold text-lg truncate">{article.title}</p>
            </div>
            <div className="card-body mb-2 text-center">
              <Button
                className="mb-3 mx-auto"
                size="sm"
                onClick={() =>
                  setShowContent((prev) => ({
                    ...prev,
                    [article.id.toString()]: !Boolean(
                      prev[article.id.toString() as keyof typeof prev],
                    ),
                  }))
                }
              >
                {showContent[article.id as keyof typeof showContent]
                  ? "Masquer le contenu"
                  : "Voir le contenu"}
              </Button>
              {showContent[article.id as keyof typeof showContent] && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {article.content}
                </p>
              )}
            </div>
            <div className="card-footer mt-auto pt-2 flex gap-2">
              <Button
                className="flex-1"
                color="primary"
                size="sm"
                onClick={() => updateArticle(article.id.toString(), article)}
              >
                <FontAwesomeIcon icon={faEdit} /> Modifier
              </Button>
              <Button
                className="flex-1"
                color="danger"
                size="sm"
                onClick={() => deleteArticle(article.id.toString())}
              >
                <FontAwesomeIcon icon={faTrash} /> Supprimer
              </Button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Ajouter un nouvel article */}
      <motion.div
        animate={{ opacity: 1 }}
        className="mt-4"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Input
          key="title"
          className="mb-3"
          label="Titre de l'article"
          value={newArticle.title}
          onChange={(e) =>
            setNewArticle({ ...newArticle, title: e.target.value })
          }
        />
        <Textarea
          key="content"
          className="mb-3"
          label="Contenu de l'article"
          value={newArticle.content}
          onChange={(e) =>
            setNewArticle({ ...newArticle, content: e.target.value })
          }
        />
        <Button size="sm" onClick={addArticle}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter un article
        </Button>
      </motion.div>

      {/* Visualisation des messages */}
      <motion.div
        animate={{ opacity: 1 }}
        className="mt-6 sm:mt-8"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">
          Messages des utilisateurs
        </h3>
        <div className="scrollable-content admin-table">
          <Table aria-label="Liste des messages" className="min-w-full">
            <TableHeader>
              <TableColumn>Pseudo</TableColumn>
              <TableColumn>Message</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>

            <TableBody>
              {messages.map((message, index) => (
                <TableRow key={(message as { _id?: string })?._id || index}>
                  <TableCell className="max-w-[100px] truncate">
                    {(message as { pseudo?: string }).pseudo || "Unknown"}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="line-clamp-2">
                      {(message as { message?: string }).message ||
                        "No message"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {dayjs(
                      (message as { date?: string }).date || new Date(),
                    ).format("DD/MM/YY")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() =>
                          deleteMessage((message as { _id?: string })?._id)
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() =>
                          initiateReplyToMessage(
                            (message as { _id?: string })?._id,
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faReply} />
                      </Button>
                      <Button
                        color="success"
                        size="sm"
                        onClick={() =>
                          markMessageAsRead((message as { _id?: string })?._id)
                        }
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Intégration du composant de dialogue pour l'historique des commandes */}
      <OrderHistoryDialog
        isOpen={isHistoryDialogOpen}
        orderId={selectedOrderId || ""}
        onClose={() => setIsHistoryDialogOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;

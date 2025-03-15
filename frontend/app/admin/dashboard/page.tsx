/* eslint-disable import/order */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

// Import shadcn components
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
import Swal from "sweetalert2";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import FontAwesome

// Import components

import OrderHistoryDialog from "@/components/OrderHistoryDialog";
import articlesData from "@/public/dataarticles.json";
import ProgressionCommande from "@/components/ProgressionCommande";

// TypeScript interfaces
interface User {
  _id: string;
  pseudo: string;
  email: string;
  role: string;
  prenom?: string;
}

interface Lesson {
  _id: string;
  title: string;
  content: string;
  date: string;
}

interface Message {
  _id: string;
  nom?: string;
  pseudo?: string;
  email?: string;
  message?: string;
  date?: string;
  lu?: boolean;
}

interface OrderItem {
  title: string;
}

interface Order {
  _id: string;
  items?: OrderItem[];
  lastName?: string;
  firstName?: string;
  email: string;
  orderDate: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  trackingNumber?: string;
  payment?: any;
}

interface Article {
  id: number;
  title: string;
  content: string;
  subtitle?: string;
  image?: string;
}

// Function to check if user is admin
const fetchUserData = () => {
  if (typeof window === "undefined") return null;
  const storedUser = localStorage.getItem("user");

  return storedUser ? JSON.parse(storedUser) : null;
};

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [, setTransactionId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLesson, setNewLesson] = useState<{
    title: string;
    content: string;
    date: string;
  }>({
    title: "",
    content: "",
    date: "",
  });
  const [currentTime, setCurrentTime] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [, setArticles] = useState<Article[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newArticle, setNewArticle] = useState<{
    title: string;
    content: string;
  }>({ title: "", content: "" });
  const [banReason, setBanReason] = useState<string>("Violation des règles");
  const [showContent, setShowContent] = useState<Record<string, boolean>>({});
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("orders");
  const router = useRouter();

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!paymentId || paymentId === "null") {
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
      router.push("/"); // Redirect if user is not admin
    }

    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  // Function to fetch all lessons
  const fetchLessons = async () => {
    try {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/lessons`,
        );

        setLessons(response.data);
      } catch (apiError) {
        console.warn("API lessons unavailable, using fallback data:", apiError);

        // Fallback data if API fails
        const fallbackLessons: Lesson[] = [
          {
            _id: "lesson1",
            title: "Introduction à l'autisme",
            content:
              "L'autisme est un trouble du développement qui affecte la façon dont une personne communique et interagit avec les autres...",
            date: new Date().toISOString(),
          },
          {
            _id: "lesson2",
            title: "Techniques de communication",
            content:
              "Dans cette leçon, nous allons explorer les différentes techniques de communication qui peuvent être utilisées avec les personnes autistes...",
            date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          },
          {
            _id: "lesson3",
            title: "Soutien aux parents",
            content:
              "Le rôle des parents est essentiel dans le soutien des enfants atteints d'autisme. Cette leçon fournit des stratégies et des ressources...",
            date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
          },
        ];

        setLessons(fallbackLessons);
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: `Erreur lors de la récupération des leçons : ${error}`,
        icon: "error",
      });
    }
  };

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
        );

        setUsers(response.data);
      } catch (apiError) {
        console.warn("API users unavailable, using fallback data:", apiError);

        // Fallback data if API fails
        const fallbackUsers: User[] = [
          {
            _id: "user1",
            pseudo: "Virginie",
            email: "virginie.ayivor@yahoo.fr",
            role: "admin",
          },
          {
            _id: "user2",
            pseudo: "JeanDupont",
            email: "jean.dupont@example.com",
            role: "user",
          },
          {
            _id: "user3",
            pseudo: "MarieLambert",
            email: "marie.lambert@example.com",
            role: "user",
          },
        ];

        setUsers(fallbackUsers);
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: `Erreur lors de la récupération des utilisateurs : ${error}`,
        icon: "error",
      });
    }
  };

  // Function to fetch articles
  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
      );

      setArticles(response.data);
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: `Erreur lors de la récupération des articles : ${error}`,
        icon: "error",
      });
    }
  };

  // Function to fetch messages
  const fetchMessages = async () => {
    try {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/messages`,
        );

        setMessages(response.data);
      } catch (apiError) {
        console.warn(
          "API messages unavailable, using fallback data:",
          apiError,
        );

        // Fallback data if API fails
        const fallbackMessages: Message[] = [
          {
            _id: "msg1",
            nom: "Sophie Martin",
            email: "sophie.martin@example.com",
            message:
              "Bonjour, j'ai une question concernant votre formation sur l'autisme.",
            date: new Date().toISOString(),
            lu: false,
          },
          {
            _id: "msg2",
            nom: "Thomas Bernard",
            email: "thomas.bernard@example.com",
            message:
              "Je souhaiterais avoir plus d'informations sur les modalités de paiement.",
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            lu: true,
          },
        ];

        setMessages(fallbackMessages);
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: `Erreur lors de la récupération des messages : ${error}`,
        icon: "error",
      });
    }
  };

  // Function to add a lesson
  const addLesson = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/lessons`, newLesson);
      setNewLesson({ title: "", content: "", date: "" });
      fetchLessons(); // Reload lessons after addition
      Swal.fire({
        title: "Succès",
        text: "Leçon ajoutée avec succès",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: `Erreur lors de l'ajout de la leçon : ${error}`,
        icon: "error",
      });
    }
  };

  // Function to update a lesson
  const updateLesson = async (id: any, updatedData: never) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/${id}`,
        updatedData,
      );
      fetchLessons();
      Swal.fire({
        title: "Succès",
        text: "Leçon mise à jour avec succès",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: `Erreur lors de la mise à jour de la leçon : ${error}`,
        icon: "error",
      });
    }
  };

  // Function to delete a lesson
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
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/lessons/${id}`,
          );
          fetchLessons();
          Swal.fire({
            title: "Supprimé !",
            text: "La leçon a été supprimée.",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "Erreur",
            text: `Erreur lors de la suppression de la leçon : ${error}`,
            icon: "error",
          });
        }
      }
    });
  };

  // Get contact messages
  const getContactMessages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/contact`,
      );

      setMessages(response.data);
    } catch (error) {
      Swal.fire(
        "Erreur",
        "Erreur lors de la récupération des messages.",
        "error",
      );
    }
  };

  // Mark a message as read
  const markContactMessageAsRead = async (id: any) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/contact/${id}/read`);
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

  // Reply to a message
  const replyToContactMessage = async (id: any) => {
    const { value: reply } = await Swal.fire({
      title: "Répondre au message",
      input: "textarea",
      inputPlaceholder: "Écrivez votre réponse ici...",
      showCancelButton: true,
    });

    if (reply) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/contact/${id}/reply`,
          { reponse: reply },
        );
        Swal.fire("Succès", "Votre réponse a été envoyée.", "success");
        getContactMessages();
      } catch (error) {
        Swal.fire("Erreur", "Impossible d'envoyer la réponse.", "error");
      }
    }
  };

  // Delete a contact message
  const deleteContactMessage = async (id: any) => {
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
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/contact/${id}`,
          );
          Swal.fire("Supprimé !", "Le message a été supprimé.", "success");
          getContactMessages();
        } catch (error) {
          Swal.fire("Erreur", "Impossible de supprimer le message.", "error");
        }
      }
    });
  };

  // Delete a user with reason
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
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/ban`, {
            userId: id,
            reason: banReason,
          });
          fetchUsers();
          Swal.fire({
            title: "Supprimé !",
            text: "L'utilisateur a été supprimé.",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "Erreur",
            text: `Erreur lors de la suppression de l'utilisateur : ${error}`,
            icon: "error",
          });
        }
      }
    });
  };

  // Promote or demote a user
  const promoteToAdminOrUser = async (id: any, role: string) => {
    try {
      if (role === "admin") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/demote/${id}`,
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/promote/${id}`,
        );
      }
      fetchUsers();
      Swal.fire({
        title: "Succès",
        text: "Le rôle de l'utilisateur a été modifié avec succès",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: `Erreur lors de la modification du rôle : ${error}`,
        icon: "error",
      });
    }
  };

  // Add an article
  const addArticle = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
        newArticle,
      );
      setNewArticle({ title: "", content: "" });
      fetchArticles();
      Swal.fire({
        title: "Succès",
        text: "Article ajouté avec succès",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: `Erreur lors de l'ajout de l'article : ${error}`,
        icon: "error",
      });
    }
  };

  // Update an article
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
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
        updatedData,
      );
      fetchArticles();
      Swal.fire({
        title: "Succès",
        text: "Article mis à jour avec succès",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: `Erreur lors de la mise à jour de l'article : ${error}`,
        icon: "error",
      });
    }
  };

  // Mark a message as read
  const markMessageAsRead = async (messageId: any) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}/read`,
        {},
      );

      if (response.status === 200) {
        Swal.fire("Succès", "Le message a été marqué comme lu.", "success");
        fetchMessages();
      } else {
        Swal.fire(
          "Erreur",
          "Impossible de marquer le message comme lu.",
          "error",
        );
      }
    } catch (error) {
      Swal.fire("Erreur", "Une erreur est survenue.", "error");
    }
  };

  // Reply to a message
  const initiateReplyToMessage = async (messageId: any) => {
    try {
      const { value: reply } = await Swal.fire({
        title: "Répondre au message",
        input: "textarea",
        inputLabel: "Votre réponse",
        inputPlaceholder: "Écrivez votre réponse ici...",
        showCancelButton: true,
      });

      if (reply) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}/reply`,
          { reply },
        );

        if (response.status === 200) {
          Swal.fire("Succès", "Votre réponse a été envoyée.", "success");
          fetchMessages();
        } else {
          Swal.fire("Erreur", "Impossible d'envoyer la réponse.", "error");
        }
      }
    } catch (error) {
      Swal.fire("Erreur", "Une erreur est survenue.", "error");
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: any) => {
    try {
      const confirmation = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Cette action supprimera définitivement le message.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer !",
        cancelButtonText: "Annuler",
      });

      if (confirmation.isConfirmed) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}`,
        );

        if (response.status === 200) {
          Swal.fire("Supprimé !", "Le message a été supprimé.", "success");
          fetchMessages();
        } else {
          Swal.fire("Erreur", "Impossible de supprimer le message.", "error");
        }
      }
    } catch (error) {
      Swal.fire(
        "Erreur",
        "Une erreur est survenue lors de la suppression.",
        "error",
      );
    }
  };

  // Delete an article
  const deleteArticle = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`);
      fetchArticles();
      Swal.fire({
        title: "Supprimé !",
        text: "L'article a été supprimé.",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: `Erreur lors de la suppression de l'article : ${error}`,
        icon: "error",
      });
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      // Try to get data from the API first
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        );
        const ordersData = response.data.orders || [];

        const ordersWithPayments = await Promise.all(
          ordersData.map(async (order: { paymentId: any }) => {
            const paymentId = order.paymentId;
            const paymentDetails = paymentId
              ? await fetchPaymentDetails(paymentId)
              : null;

            return { ...order, payment: paymentDetails };
          }),
        );

        setOrders(ordersWithPayments);
      } catch (apiError) {
        console.warn("API unavailable, using fallback data:", apiError);

        // Fallback data if API fails
        const fallbackOrders: Order[] = [
          {
            _id: "order123",
            items: [{ title: "Veste testée" }],
            lastName: "Ayivor",
            firstName: "Virginie",
            email: "virginie.ayivor@yahoo.fr",
            orderDate: new Date().toISOString(),
            status: "Delivered",
            paymentStatus: "Paid",
            paymentMethod: "Card",
            trackingNumber: "ABC123456789",
          },
          {
            _id: "order456",
            items: [{ title: "Article de formation" }],
            lastName: "Dubois",
            firstName: "Jean",
            email: "jean.dubois@example.com",
            orderDate: new Date().toISOString(),
            status: "Processing",
            paymentStatus: "Paid",
            paymentMethod: "PayPal",
          },
        ];

        setOrders(fallbackOrders);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      Swal.fire("Erreur", "Impossible de récupérer les commandes.", "error");
    }
  };

  // Fetch payment details
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

  // Show status history
  const showStatusHistory = (orderId: string | null) => {
    setSelectedOrderId(orderId);
    setIsHistoryDialogOpen(true);
  };

  // Update order status
  const updateOrderStatus = async (id: any, status: string) => {
    try {
      console.log(
        `Tentative de mise à jour du statut pour la commande ${id} vers ${status}`,
      );

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

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/status`,
        { status, notes },
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Statut mis à jour !",
          text: `La commande est maintenant en statut : ${status}`,
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchOrders();
      } else {
        throw new Error(`Réponse inattendue: ${response.status}`);
      }
    } catch (error) {
      console.error(
        "Erreur détaillée lors de la mise à jour du statut:",
        error,
      );

      let errorMessage =
        "Une erreur s'est produite lors de la mise à jour du statut.";

      if (axios.isAxiosError(error)) {
        errorMessage = `Erreur serveur: ${error.response?.status} - ${error.response?.data?.message || "Erreur inconnue"}`;
      } else if ((error as any).request) {
        errorMessage =
          "Aucune réponse du serveur. Vérifiez votre connexion réseau.";
      } else {
        const err = error as Error;

        errorMessage = `Erreur: ${err.message}`;
      }

      Swal.fire({
        title: "Erreur",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Delete an order
  const deleteOrder = async (id: any) => {
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
          await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`);
          fetchOrders();
          Swal.fire({
            title: "Supprimé !",
            text: "La commande a été supprimée.",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "Erreur",
            text: `Erreur lors de la suppression de la commande : ${error}`,
            icon: "error",
          });
        }
      }
    });
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-2">
          Dashboard Admin {(user as { pseudo: string }).pseudo}
        </h1>

        <p className="text-sm md:text-base text-muted-foreground">
          Heure actuelle : {currentTime}
        </p>

        <h2 className="text-xl md:text-2xl font-medium mt-4 flex items-center justify-center gap-2">
          <span>
            Bonjour,{" "}
            {(user as { prenom?: string })?.prenom ||
              (user as { pseudo: string }).pseudo}
          </span>
          <FontAwesomeIcon className="text-yellow-400" icon={faCrown} />
        </h2>
      </div>

      <Tabs
        className="w-full"
        defaultValue="orders"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6 bg-card border border-border rounded-lg p-1">
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:ring-2 data-[state=active]:ring-primary-foreground/20 font-semibold text-md"
            value="orders"
          >
            Commandes
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:ring-2 data-[state=active]:ring-primary-foreground/20 font-semibold text-md"
            value="contact"
          >
            Messages
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:ring-2 data-[state=active]:ring-primary-foreground/20 font-semibold text-md"
            value="users"
          >
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:ring-2 data-[state=active]:ring-primary-foreground/20 font-semibold text-md"
            value="lessons"
          >
            Leçons
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:ring-2 data-[state=active]:ring-primary-foreground/20 font-semibold text-md"
            value="articles"
          >
            Articles
          </TabsTrigger>
        </TabsList>

        {/* ORDERS TAB */}
        <TabsContent value="orders">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-primary/20 pb-2 text-primary">
              Gestion des commandes
            </h3>

            {orders.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">
                Aucune commande disponible
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card
                    key={(order as { _id: string })._id}
                    className="overflow-hidden"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <CardTitle className="text-sm md:text-base">
                            {(
                              order as { items?: Array<{ title: string }> }
                            ).items
                              ?.map((item) => item.title)
                              .join(" • ") || "Produit inconnu"}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground truncate max-w-[250px] md:max-w-none">
                            ID : {(order as { _id: string })._id}
                          </p>
                        </div>
                        <Badge className="md:ml-2 self-start mt-2 md:mt-0">
                          {(order as { status?: string }).status ||
                            "Enregistrée"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-medium">Client:</p>
                          <p className="text-muted-foreground text-xs">
                            {(
                              order as { lastName?: string; firstName?: string }
                            ).lastName
                              ? `${(order as { firstName?: string }).firstName} ${(order as { lastName?: string }).lastName}`
                              : "Inconnu"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Email:</p>
                          <p className="text-muted-foreground text-xs truncate">
                            {(order as { email: string }).email}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Date:</p>
                          <p className="text-muted-foreground text-xs">
                            {dayjs(
                              (order as { orderDate: string }).orderDate,
                            ).format("DD/MM/YYYY")}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Paiement:</p>
                          <p className="text-muted-foreground text-xs">
                            {
                              (order as { paymentStatus?: string })
                                .paymentStatus
                            }
                            (
                            {
                              (order as { paymentMethod?: string })
                                .paymentMethod
                            }
                            )
                          </p>
                        </div>
                      </div>

                      {(order as { trackingNumber?: string })
                        .trackingNumber && (
                        <div className="text-sm">
                          <p className="font-medium">N° de suivi:</p>
                          <p className="text-green-600 dark:text-green-400 text-xs">
                            {
                              (order as { trackingNumber?: string })
                                .trackingNumber
                            }
                          </p>
                        </div>
                      )}

                      <div className="mt-2">
                        <ProgressionCommande
                          statut={
                            (order as { status?: string }).status ||
                            "Enregistree"
                          }
                        />
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-2 pt-0">
                      <Select
                        onValueChange={(value) => {
                          if (value) {
                            updateOrderStatus(
                              (order as { _id: string })._id,
                              value,
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="w-full sm:w-auto">
                          <SelectValue placeholder="Changer le statut" />
                        </SelectTrigger>
                        <SelectContent>
                          {(order as { status?: string }).status !==
                            "Pending" && (
                            <SelectItem value="Pending">Enregistrée</SelectItem>
                          )}
                          {(order as { status?: string }).status !==
                            "Processing" && (
                            <SelectItem value="Processing">
                              En préparation
                            </SelectItem>
                          )}
                          {(order as { status?: string }).status !==
                            "Shipped" && (
                            <SelectItem value="Shipped">Expédiée</SelectItem>
                          )}
                          {(order as { status?: string }).status !==
                            "Delivered" && (
                            <SelectItem value="Delivered">Livrée</SelectItem>
                          )}
                          {(order as { status?: string }).status !==
                            "Cancelled" && (
                            <SelectItem value="Cancelled">Annulée</SelectItem>
                          )}
                        </SelectContent>
                      </Select>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          className="w-full sm:w-auto"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            showStatusHistory(
                              (order as { _id: string })._id as unknown as null,
                            )
                          }
                        >
                          <FontAwesomeIcon className="mr-2" icon={faHistory} />
                          <span className="sm:inline hidden">Historique</span>
                        </Button>

                        <Button
                          className="w-full sm:w-auto"
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            deleteOrder((order as { _id: string })._id)
                          }
                        >
                          <FontAwesomeIcon className="mr-2" icon={faTrash} />
                          <span className="sm:inline hidden">Supprimer</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* CONTACT MESSAGES TAB */}
        <TabsContent value="contact">
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Messages de contact
            </h3>

            {messages.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">
                Aucun message disponible
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">État</TableHead>
                      <TableHead>De</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((contactMsg, index) => (
                      <TableRow
                        key={(contactMsg as { _id?: string })._id || index}
                      >
                        <TableCell>
                          <Badge
                            variant={
                              (contactMsg as { lu?: boolean }).lu
                                ? "outline"
                                : "default"
                            }
                          >
                            {(contactMsg as { lu?: boolean }).lu
                              ? "Lu"
                              : "Non lu"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {(contactMsg as { nom?: string }).nom ||
                                "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {(contactMsg as { email?: string }).email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="truncate max-w-[200px] md:max-w-[300px]">
                            {(contactMsg as { message?: string }).message}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs whitespace-nowrap">
                            {dayjs(
                              (contactMsg as { date?: string }).date ||
                                new Date(),
                            ).format("DD/MM/YY")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {dayjs(
                              (contactMsg as { date?: string }).date ||
                                new Date(),
                            ).format("HH:mm")}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col sm:flex-row gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                markContactMessageAsRead(
                                  (contactMsg as { _id: string })._id,
                                )
                              }
                            >
                              <FontAwesomeIcon
                                className="mr-2"
                                icon={faCheck}
                              />
                              <span className="sm:inline hidden">Lu</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                replyToContactMessage(
                                  (contactMsg as { _id: string })._id,
                                )
                              }
                            >
                              <FontAwesomeIcon
                                className="mr-2"
                                icon={faReply}
                              />
                              <span className="sm:inline hidden">Répondre</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
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
            )}
          </div>
        </TabsContent>

        {/* USERS TAB */}
        <TabsContent value="users">
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Gestion des utilisateurs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <Card
                  key={(user as { _id: string })._id}
                  className="overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center">
                      {(user as { pseudo: string }).pseudo}
                    </CardTitle>
                    <Badge className="mx-auto">
                      {(user as { role: string }).role}
                    </Badge>
                  </CardHeader>

                  <CardContent className="text-center space-y-1">
                    <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis">
                      Email: {(user as { email: string }).email}
                    </p>
                    <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis">
                      ID: {(user as { _id: string })._id}
                    </p>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2">
                    {(user as { email: string }).email !==
                      "virginie.ayivor@yahoo.fr" && (
                      <Button
                        className="w-full"
                        variant={
                          (user as { role: string }).role === "admin"
                            ? "destructive"
                            : "default"
                        }
                        onClick={() =>
                          promoteToAdminOrUser(
                            (user as any)._id,
                            (user as any).role,
                          )
                        }
                      >
                        {(user as { role: string }).role === "admin"
                          ? "Rétrograder en User"
                          : "Promouvoir"}
                      </Button>
                    )}

                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Select onValueChange={(value) => setBanReason(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Motif..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Violation des règles">
                            Violation
                          </SelectItem>
                          <SelectItem value="Spam">Spam</SelectItem>
                          <SelectItem value="Harcèlement">
                            Harcèlement
                          </SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        disabled={
                          (user as { email: string }).email ===
                          "virginie.ayivor@yahoo.fr"
                        }
                        variant="destructive"
                        onClick={() =>
                          deleteUser(
                            (user as any)._id,
                            (user as { email: string }).email,
                          )
                        }
                      >
                        <FontAwesomeIcon className="mr-2" icon={faTrash} />
                        Supprimer
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* LESSONS TAB */}
        <TabsContent value="lessons">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium border-b pb-2 mb-4">
                Gestion des leçons
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessons.map((lesson) => (
                  <Card key={(lesson as any)._id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {(lesson as { title: string }).title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Date: {dayjs((lesson as any).date).format("DD/MM/YYYY")}
                      </p>
                    </CardHeader>

                    <CardContent>
                      <ScrollArea className="h-24">
                        <p className="text-sm">
                          {(lesson as { content: string }).content}
                        </p>
                      </ScrollArea>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button
                        className="w-full sm:w-auto"
                        variant="outline"
                        onClick={() =>
                          updateLesson(
                            (lesson as any)._id?.toString() || "",
                            lesson as never,
                          )
                        }
                      >
                        <FontAwesomeIcon className="mr-2" icon={faEdit} />
                        Modifier
                      </Button>
                      <Button
                        className="w-full sm:w-auto"
                        variant="destructive"
                        onClick={() =>
                          deleteLesson((lesson as any)._id?.toString() || "")
                        }
                      >
                        <FontAwesomeIcon className="mr-2" icon={faTrash} />
                        Supprimer
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-4">
                Ajouter une nouvelle leçon
              </h3>

              <div className="space-y-4">
                <Input
                  placeholder="Titre de la leçon"
                  value={newLesson.title}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, title: e.target.value })
                  }
                />

                <Textarea
                  className="min-h-[100px]"
                  placeholder="Contenu de la leçon"
                  value={newLesson.content}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, content: e.target.value })
                  }
                />

                <Input
                  type="date"
                  value={newLesson.date}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, date: e.target.value })
                  }
                />

                <Button className="w-full sm:w-auto" onClick={addLesson}>
                  <FontAwesomeIcon className="mr-2" icon={faPlus} />
                  Ajouter une leçon
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ARTICLES TAB */}
        <TabsContent value="articles">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium border-b pb-2 mb-4">
                Gestion des articles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articlesData.articles.map((article) => (
                  <Card key={article.id} className="overflow-hidden">
                    <div className="relative h-40 w-full">
                      <img
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        src={article.image}
                      />
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg truncate">
                        {article.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <Button
                        className="w-full mb-2"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setShowContent((prev) => ({
                            ...prev,
                            [article.id.toString()]: !Boolean(
                              prev[article.id.toString() as keyof typeof prev],
                            ),
                          }))
                        }
                      >
                        {showContent[
                          article.id as unknown as keyof typeof showContent
                        ]
                          ? "Masquer le contenu"
                          : "Voir le contenu"}
                      </Button>

                      {showContent[
                        article.id as unknown as keyof typeof showContent
                      ] && (
                        <ScrollArea className="h-24 mt-2">
                          <p className="text-sm">{article.content}</p>
                        </ScrollArea>
                      )}
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button
                        className="w-full sm:w-auto"
                        variant="outline"
                        onClick={() =>
                          updateArticle(article.id.toString(), article)
                        }
                      >
                        <FontAwesomeIcon className="mr-2" icon={faEdit} />
                        Modifier
                      </Button>
                      <Button
                        className="w-full sm:w-auto"
                        variant="destructive"
                        onClick={() => deleteArticle(article.id.toString())}
                      >
                        <FontAwesomeIcon className="mr-2" icon={faTrash} />
                        Supprimer
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-4">
                Ajouter un nouvel article
              </h3>

              <div className="space-y-4">
                <Input
                  placeholder="Titre de l'article"
                  value={newArticle.title}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, title: e.target.value })
                  }
                />

                <Textarea
                  className="min-h-[100px]"
                  placeholder="Contenu de l'article"
                  value={newArticle.content}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, content: e.target.value })
                  }
                />

                <Button className="w-full sm:w-auto" onClick={addArticle}>
                  <FontAwesomeIcon className="mr-2" icon={faPlus} />
                  Ajouter un article
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Order History Dialog */}
      <OrderHistoryDialog
        isOpen={isHistoryDialogOpen}
        orderId={selectedOrderId || ""}
        onClose={() => setIsHistoryDialogOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;

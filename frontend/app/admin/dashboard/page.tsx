/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faCrown,
  faReply,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { motion } from "framer-motion";

import articlesData from "@/public/dataarticles.json";
// Fonction pour vérifier si l'utilisateur est admin
const fetchUserData = () => {
  const storedUser = localStorage.getItem("user");

  return storedUser ? JSON.parse(storedUser) : null;
};

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    date: "",
  });
  const [currentTime, setCurrentTime] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [, setArticles] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const [banReason, setBanReason] = useState("Violation des règles");
  const [showContent, setShowContent] = useState<{ [key: string]: boolean }>(
    {},
  );
  const router = useRouter();

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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons`,
      );

      setLessons(response.data);
    } catch (error) {
      // afficher un message d'erreur
      alert(`Erreur lors de la récupération des leçons : ${error}`);
    }
  };

  // Fonction pour récupérer tous les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
      );

      setUsers(response.data);
    } catch (error) {
      alert(`Erreur lors de la récupération des utilisateurs : ${error}`);
    }
  };

  // Fonction pour récupérer les articles
  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
      );

      setArticles(response.data);
    } catch (error) {
      alert(`Erreur lors de la récupération des articles : ${error}`);
    }
  };

  // Fonction pour récupérer les messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/messages`,
      );

      setMessages(response.data);
    } catch (error) {
      alert(`Erreur lors de la récupération des messages : ${error}`);
    }
  };

  // Fonction pour ajouter une leçon
  const addLesson = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/lessons`, newLesson);
      setNewLesson({ title: "", content: "", date: "" });
      fetchLessons(); // Recharger les leçons après l'ajout
    } catch (error) {
      alert(`Erreur lors de l'ajout de la leçon : ${error}`);
    }
  };

  // Fonction pour mettre à jour une leçon
  const updateLesson = async (id: string, updatedData: any) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/${id}`,
        updatedData,
      );
      fetchLessons(); // Recharger les leçons après la mise à jour
    } catch (error) {
      alert(`Erreur lors de la mise à jour de la leçon : ${error}`);
    }
  };

  // Fonction pour supprimer une leçon
  const deleteLesson = async (id: string) => {
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
          fetchLessons(); // Recharger les leçons après suppression
        } catch (error) {
          alert(`Erreur lors de la suppression de la leçon : ${error}`);
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
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/ban`, {
            userId: id,
            reason: banReason,
          });
          fetchUsers(); // Recharger la liste des utilisateurs après suppression
        } catch (error) {
          alert(`Erreur lors de la suppression de l'utilisateur : ${error}`);
        }
      }
    });
  };

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
      fetchUsers(); // Recharger la liste des utilisateurs après modification
    } catch (error) {
      alert(`Erreur lors de la modification du rôle : ${error}`);
    }
  };

  // Fonction pour ajouter un article
  const addArticle = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
        newArticle,
      );
      setNewArticle({ title: "", content: "" });
      fetchArticles();
    } catch (error) {
      alert(`Erreur lors de l'ajout de l'article : ${error}`);
    }
  };

  // Fonction pour mettre à jour un article
  const updateArticle = async (id: string, updatedData: any) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
        updatedData,
      );
      fetchArticles();
    } catch (error) {
      alert(`Erreur lors de la mise à jour de l'article : ${error}`);
    }
  };

  const markMessageAsRead = async (messageId: any) => {
    try {
      // Envoyer une requête pour marquer le message comme lu (ici on utilise une requête PUT)
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}/read`,
        {},
      );

      if (response.status === 200) {
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
  const initiateReplyToMessage = async (messageId: string) => {
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
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}/reply`,
          { reply },
        );

        if (response.status === 200) {
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

  const deleteMessage = async (messageId: string) => {
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
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}`,
        );

        if (response.status === 200) {
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
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`);
      fetchArticles();
    } catch (error) {
      alert(`Erreur lors de la suppression de l'article : ${error}`);
    }
  };
  // Fonction pour récupérer les commandes
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`
      );

      // Si l'API retourne un objet contenant un tableau, mettez à jour en conséquence.
      setOrders(response.data.orders || []);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Erreur lors de la récupération des commandes : ${error}`);
      setOrders([]); // Définit un tableau vide en cas d'erreur
    }
  };


  // Fonction pour mettre à jour le statut d'une commande
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
        status,
      });
      fetchOrders();
    } catch (error) {
      alert(`Erreur lors de la mise à jour de la commande : ${error}`);
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
          await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`);
          fetchOrders();
        } catch (error) {
          alert(`Erreur lors de la suppression de la commande : ${error}`);
        }
      }
    });
  };

  if (!user) return null;

  return (
    <div className="container mx-auto mt-6">
      <h1 className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse text-center">
        Dashboard Admin {user.pseudo}
      </h1>

      <p className="mb-6 text-gray-600 dark:text-white text-lg animate-bounce text-center">
        Heure actuelle : {currentTime}
      </p>

      <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center animate-slide-in">
        Bonjour, {user?.prenom || user.pseudo}{' '}
        <FontAwesomeIcon icon={faCrown} className="text-yellow-400 animate-spin-slow" />
      </h2>
      <style>{`
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
      transform: scale(1.05);
      transition: transform 0.3s ease-in-out;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
  `}</style>

      {/* Gestion des commandes */}
      <div className="mt-8 px-4">
        <h3 className="mb-4 text-xl font-semibold text-center sm:text-left">Gestion des commandes</h3>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow-md p-4 bg-white dark:bg-black dark:text-white flex flex-col gap-2"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex-1 text-center sm:text-left break-words">
                  <p className="font-bold text-sm break-words max-w-full overflow-hidden text-ellipsis">ID : {order._id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 break-words max-w-full">
                    Client : {order.LastName}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400 break-words max-w-full">
                    Produit : {order.productName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Date : {dayjs(order.date).format("DD/MM/YYYY")}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400">Statut actuel : {order.status}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {['En cours', 'Expédiée', 'Livrée'].map((status) => (
                    order.status !== status && (
                      <Button
                        key={status}
                        color="primary"
                        className="w-full sm:w-auto"
                        onClick={() => updateOrderStatus(order._id, status)}
                      >
                        {status}
                      </Button>
                    )
                  ))}
                  <Button
                    color="danger"
                    className="w-full sm:w-auto"
                    onClick={() => deleteOrder(order._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gestion des utilisateurs */}
      <div className="mt-8 px-4">
        <h3 className="mb-4 text-xl font-semibold text-center sm:text-left">Gestion des utilisateurs</h3>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border rounded-lg shadow-md p-4 bg-white dark:bg-black dark:text-white flex flex-col gap-4"
            >
              <div className="flex flex-col items-center text-center break-words">
                <p className="font-bold text-sm break-words max-w-full overflow-hidden text-ellipsis">ID : {user._id}</p>
                <p className="font-bold text-lg truncate">Pseudo : {user.pseudo}</p>
                <p className="text-sm text-gray-500 dark:text-gray-300 break-words max-w-full">
                  Email : {user.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 break-words max-w-full">
                  Courriel: {user.email}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-400">Rôle : {user.role}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full sm:justify-center">
                {user.email !== "virginie.ayivor@yahoo.fr" && (
                  <Button
                    color={user.role === "admin" ? "warning" : "success"}
                    className="w-full sm:w-auto"
                    onClick={() => promoteToAdminOrUser(user._id, user.role)}
                  >
                    {user.role === "admin" ? "Rétrograder en User" : "Promouvoir"}
                  </Button>
                )}

                {['Violation des règles', 'Spam', 'Harcèlement', 'Autre'].map((reason) => (
                  <Button
                    key={reason}
                    color="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => setBanReason(reason)}
                  >
                    {reason}
                  </Button>
                ))}

                <Button
                  color="danger"
                  className="w-full sm:w-auto"
                  disabled={user.email === "virginie.ayivor@yahoo.fr"}
                  onClick={() => deleteUser(user._id, user.email)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Gestion des leçons */}
      <div className="mt-8 px-4">
        <h3 className="mb-4 text-xl font-semibold text-center sm:text-left">Gestion des leçons</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="col-span-1 border rounded-lg shadow-md p-4 bg-white dark:bg-black dark:text-white flex flex-col"
            >
              <div className="card-header mb-2 text-center">
                <p className="font-bold text-lg truncate">{lesson.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-300 truncate max-w-full overflow-hidden">
                  ID : {lesson._id}
                </p>
              </div>
              <div className="card-body mb-2 text-center">
                <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">{lesson.content}</p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Date: {dayjs(lesson.date).format("DD/MM/YYYY")}
                </p>
              </div>
              <div className="card-footer mt-4 flex flex-col sm:flex-row justify-between gap-2">
                <Button
                  color="primary"
                  className="w-full sm:w-auto"
                  onClick={() => updateLesson(lesson._id, lesson)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Modifier
                </Button>
                <Button
                  color="danger"
                  className="w-full sm:w-auto"
                  onClick={() => deleteLesson(lesson._id)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ajouter une nouvelle leçon */}
      <div className="mt-8 px-4">
        <h3 className="mb-4 text-xl font-semibold">
          Ajouter une nouvelle leçon
        </h3>
        <Input
          key="title"
          className="mb-4"
          label="Titre de la leçon"
          value={newLesson.title}
          onChange={(e) =>
            setNewLesson({ ...newLesson, title: e.target.value })
          }
        />
        <Textarea
          key="content"
          className="mb-4"
          label="Contenu de la leçon"
          value={newLesson.content}
          onChange={(e) =>
            setNewLesson({ ...newLesson, content: e.target.value })
          }
        />
        <Input
          key="date"
          className="mb-4"
          label="Date de la leçon"
          type="date"
          value={newLesson.date}
          onChange={(e) => setNewLesson({ ...newLesson, date: e.target.value })}
        />
        <Button className="mt-4" onClick={addLesson}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter une leçon
        </Button>
      </div>

      {/* Gestion des articles */}
      <motion.div
        animate={{ opacity: 1 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className="mb-4 text-xl font-semibold col-span-full text-center sm:text-left">
          Gestion des articles
        </h3>
        {articlesData.articles.map((article) => (
          <div
            key={article.id}
            className="col-span-1 border rounded-lg shadow-md p-4 bg-white dark:bg-black flex flex-col"
          >
            <div className="card-header mb-2 text-center">
              <img
                alt={article.title}
                className="w-full h-40 object-cover rounded-md mb-2"
                src={article.image}
              />
              <p className="font-bold text-lg truncate">{article.title}</p>
            </div>
            <div className="card-body mb-2 text-center">
              <Button
                className="mb-4 mx-auto"
                onClick={() =>
                  setShowContent((prev) => ({
                    ...prev,
                    [article.id]: !prev[article.id],
                  }))
                }
              >
                {showContent[article.id]
                  ? "Masquer le contenu"
                  : "Voir le contenu"}
              </Button>
              {showContent[article.id] && <p className="text-sm text-gray-600">{article.content}</p>}
            </div>
            <div className="card-footer mt-4 flex flex-col sm:flex-row justify-between gap-2">
              <Button
                color="primary"
                className="w-full sm:w-auto"
                onClick={() => updateArticle(article.id.toString(), article)}
              >
                <FontAwesomeIcon icon={faEdit} /> Modifier
              </Button>
              <Button
                color="danger"
                className="w-full sm:w-auto"
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
        transition={{ duration: 0.6, delay: 3 }}
      >
        <Input
          key="title"
          className="mb-4"
          label="Titre de l'article"
          value={newArticle.title}
          onChange={(e) =>
            setNewArticle({ ...newArticle, title: e.target.value })
          }
        />
        <Textarea
          key="content"
          className="mb-4"
          label="Contenu de l'article"
          value={newArticle.content}
          onChange={(e) =>
            setNewArticle({ ...newArticle, content: e.target.value })
          }
        />
        <Button onClick={addArticle}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter un article
        </Button>
      </motion.div>

      {/* Visualisation des messages */}
      <motion.div
        animate={{ opacity: 1 }}
        className="mt-8"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 3 }}
      >
        <h3 className="mb-4 text-xl font-semibold">
          Messages des utilisateurs
        </h3>
        <Table aria-label="Liste des messages" className="mb-4">
          <TableHeader>
            <TableColumn>Pseudo</TableColumn>
            <TableColumn>Message</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Supprimer</TableColumn>
            <TableColumn>Répondre</TableColumn>
            <TableColumn>Lu</TableColumn>
          </TableHeader>

          <TableBody>
            {messages.map((message, index) => (
              <TableRow key={message._id || index}>
                <TableCell>{message.pseudo}</TableCell>
                <TableCell>{message.message}</TableCell>
                <TableCell>
                  {dayjs(message.date).format("DD/MM/YYYY HH:mm")}
                </TableCell>
                <TableCell>
                  <Button
                    color="danger"
                    onClick={() => deleteMessage(message._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => initiateReplyToMessage(message._id)}
                  >
                    <FontAwesomeIcon icon={faReply} /> Répondre
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    color="success"
                    onClick={() => markMessageAsRead(message._id)}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Lu
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Footer */}
      <motion.footer
        animate={{ opacity: 1 }}
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        style={{ paddingBottom: "2rem", zIndex: 10 }}
        transition={{ duration: 0.6, delay: 3 }}
      >
        <p className="text-sm text-gray-500">
          © 2024 AutiStudy - Tous droits réservés. Créé par la famille Ayivor.
        </p>
      </motion.footer>
    </div>
  );
};

export default AdminDashboard;

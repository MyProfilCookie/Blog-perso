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
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { motion } from "framer-motion";

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
  const [articles, setArticles] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const [banReason, setBanReason] = useState("Violation des règles");
  const router = useRouter();

  useEffect(() => {
    const fetchedUser = fetchUserData();

    if (fetchedUser && fetchedUser.role === "admin") {
      setUser(fetchedUser);
      fetchLessons();
      fetchUsers();
      fetchArticles();
      fetchMessages();
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
      console.error("Erreur lors de la récupération des leçons :", error);
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
      console.error("Erreur lors de la récupération des utilisateurs :", error);
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
      console.error("Erreur lors de la récupération des articles :", error);
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
      console.error("Erreur lors de la récupération des messages :", error);
    }
  };

  // Fonction pour ajouter une leçon
  const addLesson = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/lessons`, newLesson);
      setNewLesson({ title: "", content: "", date: "" });
      fetchLessons(); // Recharger les leçons après l'ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout de la leçon :", error);
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
      console.error("Erreur lors de la mise à jour de la leçon :", error);
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
          console.error("Erreur lors de la suppression de la leçon :", error);
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
          console.error(
            "Erreur lors de la suppression de l'utilisateur :",
            error,
          );
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
      console.error("Erreur lors de la modification du rôle :", error);
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
      console.error("Erreur lors de l'ajout de l'article :", error);
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
      console.error("Erreur lors de la mise à jour de l'article :", error);
    }
  };

  // Fonction pour supprimer un article
  const deleteArticle = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`);
      fetchArticles();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto mt-6">
      <h1 className="mb-4 text-4xl font-bold">Dashboard Admin {user.pseudo}</h1>
      <p className="mb-6 text-gray-600">Heure actuelle : {currentTime}</p>
      <h2 className="text-2xl font-semibold">
        Bonjour, {user?.prenom || user.pseudo}{" "}
        <FontAwesomeIcon icon={faCrown} />
      </h2>

      {/* Gestion des utilisateurs */}
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold">Gestion des utilisateurs</h3>
        <Table aria-label="Liste des utilisateurs">
          <TableHeader>
            <TableColumn>Pseudo</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Rôle</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.pseudo}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.email !== "virginie.ayivor@yahoo.fr" && (
                    <Button
                      color={user.role === "admin" ? "warning" : "success"}
                      onClick={() => promoteToAdminOrUser(user._id, user.role)}
                    >
                      {user.role === "admin"
                        ? "Rétrograder en User"
                        : "Promouvoir Admin"}
                    </Button>
                  )}
                  <Select
                    aria-label="Motif de bannissement"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                  >
                    <SelectItem key="violation" value="Violation des règles">
                      Violation des règles
                    </SelectItem>
                    <SelectItem key="spam" value="Spam">
                      Spam
                    </SelectItem>
                    <SelectItem key="harcelement" value="Harcèlement">
                      Harcèlement
                    </SelectItem>
                    <SelectItem key="autre" value="Autre">
                      Autre
                    </SelectItem>
                  </Select>

                  <Button
                    color="danger"
                    disabled={user.email === "virginie.ayivor@yahoo.fr"}
                    onClick={() => deleteUser(user._id, user.email)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Gestion des leçons */}
      <h3 className="mb-4 text-xl font-semibold">Gestion des leçons</h3>
      <div className="grid grid-cols-3 gap-4 justify-center">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="col-span-1 border rounded-lg shadow-md p-4 bg-white"
          >
            <div className="card-header mb-2">
              <p className="font-bold text-lg">{lesson.title}</p>
              <p className="text-sm text-gray-500">ID : {lesson._id}</p>{" "}
              {/* Affichage de l'ID */}
            </div>
            <div className="card-body mb-2">
              <p>{lesson.content}</p>
              <p className="text-sm text-gray-500">
                Date: {dayjs(lesson.date).format("DD/MM/YYYY")}{" "}
                {/* Formatage de la date */}
              </p>
            </div>
            <div className="card-footer mt-4 flex justify-between">
              <Button
                color="primary"
                onClick={() => updateLesson(lesson._id, lesson)}
              >
                <FontAwesomeIcon icon={faEdit} /> Modifier
              </Button>
              <Button color="danger" onClick={() => deleteLesson(lesson._id)}>
                <FontAwesomeIcon icon={faTrash} /> Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Ajouter une nouvelle leçon */}
      <div className="mt-8">
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
        className="mt-8"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 3 }}
      >
        <h3 className="mb-4 text-xl font-semibold">Gestion des articles</h3>
        <Table aria-label="Liste des articles">
          <TableHeader>
            <TableColumn>Titre</TableColumn>
            <TableColumn>Contenu</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article._id}>
                <TableCell>{article.title}</TableCell>
                <TableCell>{article.content}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => updateArticle(article._id, article)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Modifier
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => deleteArticle(article._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            <TableColumn>Utilisateur</TableColumn>
            <TableColumn>Message</TableColumn>
            <TableColumn>Date</TableColumn>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message._id}>
                <TableCell>{message.user.pseudo}</TableCell>
                <TableCell>{message.content}</TableCell>
                <TableCell>{message.date}</TableCell>
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

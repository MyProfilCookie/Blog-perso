"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Input, Textarea } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faTrash,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import dayjs from "dayjs";

// Fonction pour vérifier si l'utilisateur est admin
const fetchUserData = () => {
  const storedUser = localStorage.getItem("user");

  return storedUser ? JSON.parse(storedUser) : null;
};

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);

  interface User {
    _id: string;
    pseudo: string;
    email: string;
    role: string;
  }
  const [users, setUsers] = useState<User[]>([]);

  interface Course {
    _id: string;
    title: string;
    content: string;
  }

  const [courses, setCourses] = useState<Course[]>([]);

  interface Article {
    _id: string;
    title: string;
    content: string;
  }

  const [articles, setArticles] = useState<Article[]>([]);

  interface Message {
    _id: string;
    user: { pseudo: string };
    content: string;
    date: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [newCourse, setNewCourse] = useState({ title: "", content: "" });
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const [currentTime, setCurrentTime] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchedUser = fetchUserData();

    if (fetchedUser && fetchedUser.role === "admin") {
      setUser(fetchedUser);
      fetchUsers();
      fetchCourses();
      fetchArticles();
      fetchMessages();
    } else {
      router.push("/"); // Redirige si l'utilisateur n'est pas admin
    }

    const updateCurrentTime = () => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    };
    const interval = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(interval);
  }, [router]);

  const fetchUsers = async () => {
    const response = await axios.get("/api/users");

    setUsers(response.data);
  };

  const fetchCourses = async () => {
    const response = await axios.get("/api/courses");

    setCourses(response.data);
  };

  const fetchArticles = async () => {
    const response = await axios.get("/api/articles");

    setArticles(response.data);
  };

  const fetchMessages = async () => {
    const response = await axios.get("/api/messages");

    setMessages(response.data);
  };

  const deleteUser = async (id: any, reason: string) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Motif : " + reason,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/api/users/${id}`);
        fetchUsers();
      }
    });
  };

  const promoteToAdmin = async (id: any) => {
    await axios.post(`/api/users/promote/${id}`);
    fetchUsers();
  };

  const deleteCourse = async (id: any) => {
    await axios.delete(`/api/courses/${id}`);
    fetchCourses();
  };

  const updateCourse = async (id: any, updatedData: Course) => {
    await axios.put(`/api/courses/${id}`, updatedData);
    fetchCourses();
  };

  const addCourse = async () => {
    await axios.post("/api/courses", newCourse);
    setNewCourse({ title: "", content: "" });
    fetchCourses();
  };

  const deleteArticle = async (id: any) => {
    await axios.delete(`/api/articles/${id}`);
    fetchArticles();
  };

  const updateArticle = async (id: any, updatedData: Article) => {
    await axios.put(`/api/articles/${id}`, updatedData);
    fetchArticles();
  };

  const addArticle = async () => {
    await axios.post("/api/articles", newArticle);
    setNewArticle({ title: "", content: "" });
    fetchArticles();
  };

  if (!user) return null;

  return (
    <div className="container mx-auto mt-6">
      <h1 className="mb-4 text-4xl font-bold">
        Dashboard Admin {user.pseudo}{" "}
      </h1>
      <p className="mb-6 text-gray-600">Heure actuelle : {currentTime}</p>
      <h2 className="text-2xl font-semibold">
        Bonjour, {user.prenom} <FontAwesomeIcon icon={faCrown} />
      </h2>

      {/* Gestion des utilisateurs */}
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold">Gestion des utilisateurs</h3>
        <Table aria-label="Liste des utilisateurs" shadow="none">
          <thead>
            <tr>
              <th>Pseudo</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.pseudo}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    color="success"
                    onClick={() => promoteToAdmin(user._id)}
                  >
                    Promouvoir Admin
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => deleteUser(user._id, "Violation des règles")}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Gestion des cours */}
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold">Gestion des cours</h3>
        <Table aria-label="Liste des cours" shadow="none">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Contenu</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.content}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => updateCourse(course._id, course)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Modifier
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => deleteCourse(course._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-4">
          <Input
            label="Titre du cours"
            value={newCourse.title}
            onChange={(e) =>
              setNewCourse({ ...newCourse, title: e.target.value })
            }
          />
          <Textarea
            label="Contenu du cours"
            value={newCourse.content}
            onChange={(e) =>
              setNewCourse({ ...newCourse, content: e.target.value })
            }
          />
          <Button onClick={addCourse}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter un cours
          </Button>
        </div>
      </div>

      {/* Gestion des articles */}
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold">Gestion des articles</h3>
        <Table aria-label="Liste des articles" shadow="none">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Contenu</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.content}</td>
                <td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-4">
          <Input
            label="Titre de l'article"
            value={newArticle.title}
            onChange={(e) =>
              setNewArticle({ ...newArticle, title: e.target.value })
            }
          />
          <Textarea
            label="Contenu de l'article"
            value={newArticle.content}
            onChange={(e) =>
              setNewArticle({ ...newArticle, content: e.target.value })
            }
          />
          <Button onClick={addArticle}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter un article
          </Button>
        </div>
      </div>

      {/* Visualisation des messages */}
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold">
          Messages des utilisateurs
        </h3>
        <Table aria-label="Liste des messages" shadow="none">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message._id}>
                <td>{message.user.pseudo}</td>
                <td>{message.content}</td>
                <td>{message.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;

/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
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

import Loading from "@/components/loading";

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
    { title: "Article sur la pédagogie", progress: 30, lastViewed: "2024-09-18" },
  ],
};

const countries = [
  "France", "Belgique", "Suisse", "Canada", "États-Unis", "Royaume-Uni"
];

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [createdAt, setCreatedAt] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Utilisateur non trouvé");
          }
          throw new Error("Échec de la récupération des données utilisateur");
        }

        const { user } = await response.json();

        if (user) {
          setUser(user);
          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
          setPhone(user.phone || "");
          setAddress(user.deliveryAddress || {
            street: "",
            city: "",
            postalCode: "",
            country: "France",
          });
          setCreatedAt(dayjs(user.createdAt).format("DD/MM/YYYY"));

          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
        Swal.fire({
          title: "Erreur",
          text: "Impossible de récupérer les informations utilisateur. Veuillez vous reconnecter.",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => router.push("/users/login"));
      }
    };

    fetchUserData();

    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  const handleSaveProfile = async () => {
    if (!user || !user._id) {
      alert("Utilisateur non défini ou sans identifiant");
      return;
    }

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
        }
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
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto mt-6">
      <h1 className="mb-4 text-4xl font-bold">Bonjour {user.pseudo || "Utilisateur"} 👋</h1>
      <p className="mb-6 text-gray-600">
        Il est : {currentTime} | Date de création de ton compte : {createdAt}
      </p>

      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-4">Modifier votre profil</h2>

        <div className="flex items-center gap-4 mb-4">
          <Avatar
            isBordered
            alt={`Avatar de ${user.pseudo}`}
            aria-label={`Avatar de ${user.pseudo}`}
            size="lg"
            src={user.image || "/assets/default-avatar.webp"}
          />
          <div>
            <p className="text-lg">Pseudo: {user.pseudo}</p>
            <p className="text-lg">Email: {user.email}</p>
            <p className="text-lg">Role: {user.role}</p>
          </div>
        </div>

        <Input
          fullWidth
          aria-label="Modifier votre prénom"
          className="mb-4"
          label="Prénom"
          value={user.prenom}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <Input
          fullWidth
          aria-label="Modifier votre nom"
          className="mb-4"
          label="Nom"
          value={user.nom}
          onChange={(e) => setLastName(e.target.value)}
        />

        <Input
          fullWidth
          aria-label="Modifier votre numéro de téléphone"
          className="mb-4"
          label="Numéro de téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Input
          fullWidth
          aria-label="Modifier votre adresse"
          className="mb-4"
          label="Adresse"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />

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
          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
        />

        <label className="block mb-2" htmlFor="country-select">
          Pays
        </label>
        <select
          aria-label="Sélectionnez votre pays"
          className="p-3 mb-4 border rounded-md"
          id="country-select"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <Button
          aria-label="Enregistrer les modifications"
          className="mt-8"
          onClick={handleSaveProfile}
        >
          Enregistrer
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CardSection data={mockData.courses} title="Cours Consultés" />
        <CardSection isEvaluation data={mockData.evaluations} title="Évaluations" />
        <CardSection data={mockData.articles} title="Articles Consultés" />
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-2xl font-bold">Progression des activités</h3>
        <ResponsiveContainer height={300} width="100%">
          <LineChart data={mockData.courses} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Line dataKey="progress" stroke="#82ca9d" type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CardSection = ({
  title,
  data,
  isEvaluation = false,
}: {
  title: string;
  data: any[];
  isEvaluation?: boolean;
}) => (
  <Card>
    <div className="card-header">
      <h3>{title}</h3>
    </div>
    <div style={{ padding: "20px" }}>
      {data.map((item, index) => (
        <div key={index}>
          <p className="font-bold">{item.title}</p>
          {isEvaluation ? (
            <>
              <p>Score : {item.score}%</p>
              <p>Date : {item.date}</p>
            </>
          ) : (
            <Progress aria-label={`Progression de ${item.title}`} color="primary" value={item.progress} />
          )}
          <p>Dernière consultation : {item.lastViewed}</p>
        </div>
      ))}
    </div>
  </Card>
);

export default ProfilePage;


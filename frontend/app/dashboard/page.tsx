"use client";
import React, { useState, useEffect } from "react";
import { Card, Button, Progress } from "@nextui-org/react";
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

// Exemple de données pour les cours, évaluations et articles
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

// Fonction de récupération des données utilisateur stockées
const fetchUserData = () => {
  const storedUser = localStorage.getItem("user");

  return storedUser ? JSON.parse(storedUser) : null;
};

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [lastLogin, setLastLogin] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchedUser = fetchUserData();

    if (fetchedUser) {
      setUser(fetchedUser);
      setLastLogin(fetchedUser.lastLogin || "Non disponible");
    } else {
      router.push("/users/login");
    }

    const updateCurrentTime = () => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    };
    const interval = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(interval);
  }, [router]);

  if (!user) {
    return null; // Attendre que l'utilisateur soit chargé
  }

  return (
    <div className="container mx-auto mt-6">
      <h1 className="mb-4 text-4xl font-bold">Bonjour, {user.pseudo} 👋</h1>
      <p className="mb-6 text-gray-600">
        Heure actuelle : {currentTime} | Dernière connexion : {lastLogin}
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Cours Consultés */}
        <div>
          <Card aria-labelledby="course-title">
            <div className="card-header">
              <h3 id="course-title">Cours Consultés</h3>
            </div>
            <div style={{ padding: "20px" }}>
              {mockData.courses.map((course, index) => (
                <div key={index}>
                  <p className="font-bold" id={`course-title-${index}`}>
                    {course.title}
                  </p>
                  <Progress
                    aria-label={`Progression du cours ${course.title}`}
                    color="primary"
                    value={course.progress}
                  />
                  <p>Dernière consultation : {course.lastViewed}</p>
                  <Button
                    aria-label={`Reprendre ${course.title}`}
                    className="mt-2"
                  >
                    Reprendre
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Évaluations faites */}
        <div>
          <Card aria-labelledby="evaluations-title">
            <div className="card-header">
              <h3 id="evaluations-title">Évaluations</h3>
            </div>
            <div style={{ padding: "20px" }}>
              {mockData.evaluations.map((evaluation, index) => (
                <div key={index}>
                  <p className="font-bold">{evaluation.title}</p>
                  <p>Score : {evaluation.score}%</p>
                  <p>Date : {evaluation.date}</p>
                  <Button
                    aria-label={`Voir l'évaluation de ${evaluation.title}`}
                    className="mt-2"
                  >
                    Voir l&apos;évaluation
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Articles Consultés */}
        <div>
          <Card aria-labelledby="articles-title">
            <div className="card-header">
              <h3 id="articles-title">Articles Consultés</h3>
            </div>
            <div style={{ padding: "20px" }}>
              {mockData.articles.map((article, index) => (
                <div key={index}>
                  <p className="font-bold">{article.title}</p>
                  <Progress
                    aria-label={`Progression de l'article ${article.title}`}
                    color="success"
                    value={article.progress}
                  />
                  <p>Dernière consultation : {article.lastViewed}</p>
                  <Button
                    aria-label={`Reprendre ${article.title}`}
                    className="mt-2"
                  >
                    Reprendre
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Diagramme de progression */}
      <div className="mt-8">
        <h3 className="mb-4 text-2xl font-bold">Progression des activités</h3>
        <ResponsiveContainer height={300} width="100%">
          <LineChart
            data={[
              { name: "Mathématiques", progress: 80 },
              { name: "Français", progress: 50 },
              { name: "Évaluation Math", progress: 75 },
              { name: "Évaluation Français", progress: 88 },
              { name: "Article Autisme", progress: 60 },
              { name: "Article Pédagogie", progress: 30 },
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line dataKey="progress" stroke="#82ca9d" type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfilePage;

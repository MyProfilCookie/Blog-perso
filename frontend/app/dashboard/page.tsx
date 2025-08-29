"use client";

import React, { useState, useEffect } from "react";
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

// Import shadcn components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Loading from "@/components/loading";

// Example data for courses, evaluations, and articles
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

// Function to retrieve user data stored in localStorage
const fetchUserData = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  }

  return null;
};

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Retrieve user data from localStorage
    const fetchedUser = fetchUserData();

    if (fetchedUser) {
      setUser(fetchedUser);
      const formattedCreatedAt = fetchedUser.createdAt
        ? dayjs(fetchedUser.createdAt).format("DD/MM/YYYY")
        : "Non disponible";

      setCreatedAt(formattedCreatedAt);
    } else {
      router.push("/users/login"); // Redirect to login page if user is not logged in
    }

    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    // Clean up interval to avoid memory leaks
    return () => clearInterval(interval);
  }, [router]);

  if (!user) {
    return <Loading />; // Wait for user to load
  }

  return (
    <div className="container px-4 mx-auto mt-6 performance-optimized" style={{ minHeight: '200px', contain: 'layout style paint' }}>
      <h1 className="mb-4 text-3xl font-bold text-center md:text-4xl performance-optimized">
        Bonjour à toi, {user.pseudo} 👋
      </h1>
      <p className="mb-6 text-sm text-center text-muted-foreground md:text-base performance-optimized">
        Heure actuelle : {currentTime} | Date de création du compte :{" "}
        {createdAt}
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 grid-cls-optimized performance-optimized">
        {/* Cours Consultés */}
        <Card className="overflow-hidden shadow-md performance-optimized">
          <CardHeader className="bg-primary p-3 performance-optimized">
            <CardTitle className="text-lg text-center text-primary-foreground md:text-xl performance-optimized">
              Cours Consultés
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 performance-optimized">
            {mockData.courses.map((course, index) => (
              <div key={index} className="mb-4 performance-optimized">
                <p className="mb-1 font-medium performance-optimized">{course.title}</p>
                <Progress
                  aria-label={`Progression du cours ${course.title}`}
                  className="h-2 mb-1 performance-optimized"
                  value={course.progress}
                />
                <p className="mb-2 text-sm text-muted-foreground performance-optimized">
                  Dernière consultation : {course.lastViewed}
                </p>
                <Button
                  aria-label={`Reprendre ${course.title}`}
                  className="w-full mt-1 button-cls-optimized performance-optimized"
                  size="sm"
                >
                  Reprendre
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Évaluations faites */}
        <Card className="overflow-hidden shadow-md performance-optimized">
          <CardHeader className="bg-primary p-3 performance-optimized">
            <CardTitle className="text-lg text-center text-primary-foreground md:text-xl performance-optimized">
              Évaluations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 performance-optimized">
            {mockData.evaluations.map((evaluation, index) => (
              <div key={index} className="mb-4 performance-optimized">
                <p className="mb-1 font-medium performance-optimized">{evaluation.title}</p>
                <p className="text-sm performance-optimized">Score : {evaluation.score}%</p>
                <p className="mb-2 text-sm text-muted-foreground performance-optimized">
                  Date : {evaluation.date}
                </p>
                <Button
                  aria-label={`Voir l'évaluation de ${evaluation.title}`}
                  className="w-full mt-1 button-cls-optimized performance-optimized"
                  size="sm"
                >
                  Voir l&apos;évaluation
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Articles Consultés */}
        <Card className="overflow-hidden shadow-md performance-optimized">
          <CardHeader className="bg-primary p-3 performance-optimized">
            <CardTitle className="text-lg text-center text-primary-foreground md:text-xl performance-optimized">
              Articles Consultés
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 performance-optimized">
            {mockData.articles.map((article, index) => (
              <div key={index} className="mb-4 performance-optimized">
                <p className="mb-1 font-medium performance-optimized">{article.title}</p>
                <Progress
                  aria-label={`Progression de l'article ${article.title}`}
                  className="h-2 mb-1 performance-optimized"
                  value={article.progress}
                />
                <p className="mb-2 text-sm text-muted-foreground performance-optimized">
                  Dernière consultation : {article.lastViewed}
                </p>
                <Button
                  aria-label={`Reprendre ${article.title}`}
                  className="w-full mt-1 button-cls-optimized performance-optimized"
                  size="sm"
                >
                  Reprendre
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Diagramme de progression */}
      <Card className="mt-8 overflow-hidden shadow-md performance-optimized">
        <CardHeader className="bg-primary p-3 performance-optimized">
          <CardTitle className="text-lg text-center text-primary-foreground md:text-xl performance-optimized">
            Progression des activités
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 performance-optimized">
          <div className="w-full performance-optimized" style={{ height: "300px" }}>
            <ResponsiveContainer height="100%" width="100%">
              <LineChart
                data={[
                  { name: "Math", progress: 80 },
                  { name: "Français", progress: 50 },
                  { name: "Éval Math", progress: 75 },
                  { name: "Éval FR", progress: 88 },
                  { name: "Art Autisme", progress: 60 },
                  { name: "Art Péda", progress: 30 },
                ]}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickSize={8} />
                <YAxis tick={{ fontSize: 12 }} tickSize={8} />
                <Tooltip />
                <Line
                  dataKey="progress"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

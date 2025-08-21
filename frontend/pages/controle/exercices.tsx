"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { Spinner } from '@nextui-org/react'
import { Chip } from '@nextui-org/react'
import { Pagination } from '@nextui-org/react'
import {  } from '@nextui-org/react';
import { LightAnimation } from "@/components/DynamicMotion";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Exercise {
  _id: string;
  title: string;
  description: string;
  difficulty: "facile" | "moyen" | "difficile";
  category: string;
  completed: boolean;
  score?: number;
}

const ExercicesPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [remainingExercises, setRemainingExercises] = useState(3);

  useEffect(() => {
    fetchExercises();
  }, [currentPage]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      if (!token) {
        throw new Error("Token d'authentification non trouvé");
      }

      // Vérifier d'abord le localStorage
      const savedExercises = localStorage.getItem("exercices_list");
      const savedRemainingExercises = localStorage.getItem(
        "exercices_remaining",
      );

      if (savedExercises && savedRemainingExercises) {
        setExercises(JSON.parse(savedExercises));
        setRemainingExercises(parseInt(savedRemainingExercises));
        setLoading(false);

        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exercises?page=${currentPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.upgradeRequired) {
        setDailyLimitReached(true);

        return;
      }

      const exercisesData = response.data.exercises || [];

      setExercises(exercisesData);
      setTotalPages(response.data.totalPages || 1);
      setRemainingExercises(response.data.remainingExercises || 3);

      // Sauvegarder dans le localStorage
      localStorage.setItem("exercices_list", JSON.stringify(exercisesData));
      localStorage.setItem(
        "exercices_remaining",
        response.data.remainingExercises.toString(),
      );

      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des exercices:", err);
      if (axios.isAxiosError(err) && err.response?.data?.upgradeRequired) {
        setDailyLimitReached(true);
      } else {
        setError("Erreur lors du chargement des exercices");
      }
      setLoading(false);
    }
  };

  const handleStartExercise = async (exerciseId: string) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/exercises/${exerciseId}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Mettre à jour l'état de l'exercice dans le localStorage
      const savedExercises = localStorage.getItem("exercices_list");

      if (savedExercises) {
        const exercises = JSON.parse(savedExercises);
        const updatedExercises = exercises.map((ex: Exercise) =>
          ex._id === exerciseId ? { ...ex, completed: true } : ex,
        );

        localStorage.setItem(
          "exercices_list",
          JSON.stringify(updatedExercises),
        );
        setExercises(updatedExercises);
      }

      // Mettre à jour le nombre d'exercices restants
      const currentRemaining = parseInt(
        localStorage.getItem("exercices_remaining") || "3",
      );
      const newRemaining = Math.max(0, currentRemaining - 1);

      localStorage.setItem("exercices_remaining", newRemaining.toString());
      setRemainingExercises(newRemaining);

      router.push(`/controle/exercices/${exerciseId}`);
    } catch (err) {
      console.error("Erreur lors du démarrage de l'exercice:", err);
      if (axios.isAxiosError(err) && err.response?.data?.upgradeRequired) {
        setDailyLimitReached(true);
      } else {
        setError("Erreur lors du démarrage de l'exercice");
      }
    }
  };

  // Ajouter un nouvel useEffect pour charger les données du localStorage au démarrage
  useEffect(() => {
    const savedExercises = localStorage.getItem("exercices_list");
    const savedRemainingExercises = localStorage.getItem("exercices_remaining");

    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    }

    if (savedRemainingExercises) {
      setRemainingExercises(parseInt(savedRemainingExercises));
    }
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facile":
        return "success";
      case "moyen":
        return "warning";
      case "difficile":
        return "danger";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner color="primary" size="lg" />
          <p className="mt-4 text-gray-600">Chargement des exercices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 p-4 rounded-lg text-red-700 max-w-md text-center">
          <p className="font-bold mb-2">⚠️ Erreur</p>
          <p>{error}</p>
        </div>
        <Button
          className="mt-4"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (dailyLimitReached) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardBody className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Limite quotidienne atteinte
            </h2>
            <p className="mb-6">
              Vous avez atteint votre limite d'exercices gratuits pour
              aujourd'hui.
            </p>
            <div className="flex flex-col gap-4">
              <Button
                color="primary"
                onClick={() => router.push("/controle/subscription")}
              >
                Passer à Premium
              </Button>
              <Button
                variant="bordered"
                onClick={() => router.push("/controle")}
              >
                Retour au tableau de bord
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exercices</h1>
          <Chip color="primary" variant="flat">
            {remainingExercises} exercices restants aujourd'hui
          </Chip>
        </div>

        {exercises.length === 0 ? (
          <Card className="bg-white shadow-lg">
            <CardBody className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">
                Aucun exercice disponible
              </h3>
              <p className="text-gray-600 mb-6">
                Revenez plus tard pour de nouveaux exercices.
              </p>
              <Button color="primary" onClick={() => router.push("/controle")}>
                Retour au tableau de bord
              </Button>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {exercises.map((exercise, index) => (
                <LightAnimation 
                  animation="slideUp"
                  key={exercise._id}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardBody>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">
                          {exercise.title}
                        </h3>
                        <Chip
                          color={getDifficultyColor(exercise.difficulty)}
                          size="sm"
                          variant="flat"
                        >
                          {exercise.difficulty}
                        </Chip>
                      </div>
                      <p className="text-gray-600 mb-6 flex-grow">
                        {exercise.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Chip size="sm" variant="flat">
                          {exercise.category}
                        </Chip>
                        <Button
                          color="primary"
                          isDisabled={exercise.completed}
                          size="sm"
                          onClick={() => handleStartExercise(exercise._id)}
                        >
                          {exercise.completed ? "Terminé" : "Commencer"}
                        </Button>
                      </div>
                      {exercise.completed && exercise.score !== undefined && (
                        <div className="mt-4 text-center">
                          <Chip
                            color={exercise.score >= 70 ? "success" : "warning"}
                            variant="flat"
                          >
                            Score: {exercise.score}%
                          </Chip>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </LightAnimation>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  color="primary"
                  page={currentPage}
                  total={totalPages}
                  onChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExercicesPage;
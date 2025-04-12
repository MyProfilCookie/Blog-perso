"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Spinner, Chip, Pagination } from "@nextui-org/react";
import { motion } from "framer-motion";
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
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      
      if (!token) {
        throw new Error("Token d&apos;authentification non trouvé");
      }
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exercises?page=${currentPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.upgradeRequired) {
        setDailyLimitReached(true);
        return;
      }
      
      setExercises(response.data.exercises || []);
      setTotalPages(response.data.totalPages || 1);
      setRemainingExercises(response.data.remainingExercises || 3);
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
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/exercises/${exerciseId}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      router.push(`/controle/exercices/${exerciseId}`);
    } catch (err) {
      console.error("Erreur lors du démarrage de l&apos;exercice:", err);
      if (axios.isAxiosError(err) && err.response?.data?.upgradeRequired) {
        setDailyLimitReached(true);
      } else {
        setError("Erreur lors du démarrage de l&apos;exercice");
      }
    }
  };

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
          <Spinner size="lg" color="primary" />
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
          color="primary" 
          className="mt-4"
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
            <h2 className="text-2xl font-bold mb-4">Limite quotidienne atteinte</h2>
            <p className="mb-6">Vous avez atteint votre limite d&apos;exercices gratuits pour aujourd&apos;hui.</p>
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
            {remainingExercises} exercices restants aujourd&apos;hui
          </Chip>
        </div>

        {exercises.length === 0 ? (
          <Card className="bg-white shadow-lg">
            <CardBody className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Aucun exercice disponible</h3>
              <p className="text-gray-600 mb-6">Revenez plus tard pour de nouveaux exercices.</p>
              <Button 
                color="primary" 
                onClick={() => router.push("/controle")}
              >
                Retour au tableau de bord
              </Button>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {exercises.map((exercise, index) => (
                <motion.div
                  key={exercise._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardBody>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">{exercise.title}</h3>
                        <Chip 
                          color={getDifficultyColor(exercise.difficulty)} 
                          variant="flat"
                          size="sm"
                        >
                          {exercise.difficulty}
                        </Chip>
                      </div>
                      <p className="text-gray-600 mb-6 flex-grow">{exercise.description}</p>
                      <div className="flex justify-between items-center">
                        <Chip variant="flat" size="sm">
                          {exercise.category}
                        </Chip>
                        <Button 
                          color="primary" 
                          size="sm"
                          onClick={() => handleStartExercise(exercise._id)}
                          isDisabled={exercise.completed}
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
                </motion.div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                  color="primary"
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
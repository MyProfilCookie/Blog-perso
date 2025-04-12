"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Spinner, Chip, Tabs, Tab, Progress } from "@nextui-org/react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface SubjectStats {
  subject: string;
  totalExercises: number;
  correctAnswers: number;
  averageScore: number;
  progress: number;
}

interface DailyStats {
  date: string;
  exercisesCompleted: number;
  averageScore: number;
}

interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
}

interface UserStats {
  totalExercises: number;
  totalCorrect: number;
  averageScore: number;
  subjects: SubjectStats[];
  dailyStats: DailyStats[];
  categoryStats: CategoryStats[];
  subscriptionType: string;
}

const StatsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      
      if (!token) {
        throw new Error("Token d&apos;authentification non trouvé");
      }
      
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("ID utilisateur non trouvé");
      }
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.upgradeRequired) {
        setUpgradeRequired(true);
        setLoading(false);
        return;
      }
      
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques:", err);
      if (axios.isAxiosError(err) && err.response?.data?.upgradeRequired) {
        setUpgradeRequired(true);
      } else {
        setError("Erreur lors du chargement des statistiques");
      }
      setLoading(false);
    }
  };

  const prepareLineChartData = () => {
    if (!stats) return null;
    
    return {
      labels: stats.dailyStats.map(stat => new Date(stat.date).toLocaleDateString()),
      datasets: [
        {
          label: "Score moyen",
          data: stats.dailyStats.map(stat => stat.averageScore),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
        {
          label: "Exercices complétés",
          data: stats.dailyStats.map(stat => stat.exercisesCompleted),
          borderColor: "rgb(255, 99, 132)",
          tension: 0.1,
        },
      ],
    };
  };

  const prepareBarChartData = () => {
    if (!stats) return null;
    
    return {
      labels: stats.subjects.map(subject => subject.subject),
      datasets: [
        {
          label: "Score moyen",
          data: stats.subjects.map(subject => subject.averageScore),
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
        },
      ],
    };
  };

  const prepareDoughnutChartData = () => {
    if (!stats) return null;
    
    return {
      labels: stats.categoryStats.map(category => category.category),
      datasets: [
        {
          data: stats.categoryStats.map(category => category.count),
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
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

  if (upgradeRequired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardBody className="text-center">
            <h2 className="text-2xl font-bold mb-4">Fonctionnalité Premium</h2>
            <p className="mb-6">Les statistiques détaillées sont disponibles uniquement pour les abonnés premium.</p>
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

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardBody className="text-center">
            <h2 className="text-2xl font-bold mb-4">Aucune donnée disponible</h2>
            <p className="mb-6">Vous n&apos;avez pas encore de statistiques à afficher.</p>
            <Button 
              color="primary" 
              onClick={() => router.push("/controle/exercices")}
            >
              Faire un exercice
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
          <Button 
            color="primary" 
            onClick={() => router.push("/controle/exercices")}
          >
            Nouvel exercice
          </Button>
        </div>

        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(key.toString())}
          className="mb-8"
        >
          <Tab key="overview" title="Vue d'ensemble" />
          <Tab key="subjects" title="Par matière" />
          <Tab key="categories" title="Par catégorie" />
          <Tab key="progress" title="Progression" />
        </Tabs>

        {/* Vue d'ensemble */}
        {selectedTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white shadow-lg">
              <CardBody>
                <h3 className="text-lg font-semibold mb-2">Total des exercices</h3>
                <p className="text-3xl font-bold">{stats.totalExercises}</p>
              </CardBody>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardBody>
                <h3 className="text-lg font-semibold mb-2">Réponses correctes</h3>
                <p className="text-3xl font-bold">{stats.totalCorrect}</p>
                <p className="text-sm text-gray-500">
                  {((stats.totalCorrect / stats.totalExercises) * 100).toFixed(1)}% de réussite
                </p>
              </CardBody>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardBody>
                <h3 className="text-lg font-semibold mb-2">Score moyen</h3>
                <p className="text-3xl font-bold">{stats.averageScore.toFixed(1)}%</p>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Par matière */}
        {selectedTab === "subjects" && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            {stats.subjects.map((subject, index) => (
              <motion.div
                key={subject.subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-white shadow-lg">
                  <CardBody>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">{subject.subject}</h3>
                      <Chip 
                        color={subject.averageScore >= 70 ? "success" : "warning"} 
                        variant="flat"
                      >
                        {subject.averageScore.toFixed(1)}%
                      </Chip>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression</span>
                        <span>{subject.progress}%</span>
                      </div>
                      <Progress 
                        value={subject.progress} 
                        color={subject.progress >= 70 ? "success" : "primary"}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Exercices complétés</p>
                        <p className="font-medium">{subject.totalExercises}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Réponses correctes</p>
                        <p className="font-medium">{subject.correctAnswers}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Par catégorie */}
        {selectedTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white shadow-lg">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">Répartition par catégorie</h3>
                {stats.categoryStats.length > 0 ? (
                  <div className="h-64">
                    <Doughnut 
                      data={prepareDoughnutChartData()!} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Aucune donnée disponible</p>
                )}
              </CardBody>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">Détails par catégorie</h3>
                <div className="space-y-4">
                  {stats.categoryStats.map((category, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{category.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{category.count} exercices</span>
                        <Chip size="sm" variant="flat">
                          {category.percentage.toFixed(1)}%
                        </Chip>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Progression */}
        {selectedTab === "progress" && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            <Card className="bg-white shadow-lg">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">Évolution des scores</h3>
                {stats.dailyStats.length > 0 ? (
                  <div className="h-64">
                    <Line 
                      data={prepareLineChartData()!} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Aucune donnée disponible</p>
                )}
              </CardBody>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">Comparaison par matière</h3>
                {stats.subjects.length > 0 ? (
                  <div className="h-64">
                    <Bar 
                      data={prepareBarChartData()!} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Aucune donnée disponible</p>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage; 
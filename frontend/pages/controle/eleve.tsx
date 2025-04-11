"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination } from "@nextui-org/react";
import { motion } from "framer-motion";
import BackButton from "@/components/back";
import axios from "axios";
import { useRouter } from "next/navigation";

// Interface pour les notes par page
interface PageScore {
  pageNumber: number;
  score: number;
  completedAt: string;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}

// Interface pour les notes par matière
interface SubjectScore {
  subjectName: string;
  pages: PageScore[];
  averageScore: number;
  lastUpdated: string;
}

// Interface pour le profil d'élève
interface EleveProfile {
  _id: string;
  userId: string;
  subjects: SubjectScore[];
  overallAverage: number;
  totalPagesCompleted: number;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les statistiques détaillées
interface DetailedStats {
  subjectName: string;
  totalPages: number;
  averageScore: number;
  bestPage: number;
  worstPage: number;
  completionRate: number;
}

const ElevePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eleveProfile, setEleveProfile] = useState<EleveProfile | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [detailedStats, setDetailedStats] = useState<DetailedStats[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  // Récupérer l'ID de l'utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.id);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
      }
    }
  }, []);

  // Récupérer le profil de l'élève
  useEffect(() => {
    const fetchEleveProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/eleves/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setEleveProfile(response.data);
        calculateDetailedStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération du profil:", err);
        setError("Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    fetchEleveProfile();
  }, [userId]);

  // Calculer les statistiques détaillées
  const calculateDetailedStats = (profile: EleveProfile) => {
    if (!profile || !profile.subjects) return;
    
    const stats: DetailedStats[] = profile.subjects.map(subject => {
      const pages = subject.pages || [];
      const scores = pages.map(page => page.score);
      
      return {
        subjectName: subject.subjectName,
        totalPages: pages.length,
        averageScore: subject.averageScore,
        bestPage: Math.max(...scores, 0),
        worstPage: Math.min(...scores, 100),
        completionRate: pages.length > 0 ? (pages.filter(p => p.score >= 70).length / pages.length) * 100 : 0
      };
    });
    
    setDetailedStats(stats);
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Formater le temps en minutes et secondes
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  // Obtenir la couleur en fonction du score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  // Obtenir l'emoji en fonction du score
  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🌟";
    if (score >= 70) return "😊";
    if (score >= 50) return "😐";
    return "😢";
  };

  // Supprimer une note
  const handleDeleteScore = async (subjectName: string, pageNumber: number) => {
    if (!userId || !eleveProfile) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/score/${userId}/${subjectName}/${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Mettre à jour le profil après suppression
      const updatedResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/eleves/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setEleveProfile(updatedResponse.data);
      calculateDetailedStats(updatedResponse.data);
    } catch (err) {
      console.error("Erreur lors de la suppression de la note:", err);
      setError("Erreur lors de la suppression de la note");
    }
  };

  // Pagination pour les pages de notes
  const getPaginatedPages = () => {
    if (!eleveProfile || !selectedSubject) return [];
    
    const subject = eleveProfile.subjects.find(s => s.subjectName === selectedSubject);
    if (!subject) return [];
    
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    
    setTotalPages(Math.ceil(subject.pages.length / 10));
    return subject.pages.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <motion.div 
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Spinner size="lg" color="primary" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen gap-4"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-2xl text-red-600">⚠️</div>
        <p className="text-lg text-gray-600">Erreur: {error}</p>
        <Button color="primary" onClick={() => router.push("/controle")}>
          Retour
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Profil Élève 📚
        </h1>
      </div>

      {eleveProfile ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {/* Résumé général */}
          <Card className="w-full border border-blue-200">
            <CardBody className="p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                Résumé Général
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Moyenne Globale</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {eleveProfile.overallAverage.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pages Complétées</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {eleveProfile.totalPagesCompleted}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Matières Étudiées</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {eleveProfile.subjects.length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Statistiques détaillées */}
          <Card className="w-full border border-blue-200">
            <CardBody className="p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                Statistiques par Matière
              </h2>
              <Table aria-label="Statistiques par matière">
                <TableHeader>
                  <TableColumn>Matière</TableColumn>
                  <TableColumn>Pages</TableColumn>
                  <TableColumn>Moyenne</TableColumn>
                  <TableColumn>Meilleure Note</TableColumn>
                  <TableColumn>Note Minimale</TableColumn>
                  <TableColumn>Taux de Réussite</TableColumn>
                </TableHeader>
                <TableBody>
                  {detailedStats.map((stat) => (
                    <TableRow key={stat.subjectName}>
                      <TableCell className="font-medium">{stat.subjectName}</TableCell>
                      <TableCell>{stat.totalPages}</TableCell>
                      <TableCell className={getScoreColor(stat.averageScore)}>
                        {stat.averageScore.toFixed(1)}% {getScoreEmoji(stat.averageScore)}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {stat.bestPage}% 🌟
                      </TableCell>
                      <TableCell className="text-red-600">
                        {stat.worstPage}% 😢
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${stat.completionRate}%` }}
                            ></div>
                          </div>
                          <span>{stat.completionRate.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>

          {/* Détails des notes par matière */}
          <Card className="w-full border border-blue-200">
            <CardBody className="p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                Détails des Notes
              </h2>
              
              <Tabs 
                aria-label="Matières" 
                className="mb-4"
                onSelectionChange={(key) => {
                  setSelectedSubject(key as string);
                  setCurrentPage(1);
                }}
              >
                {eleveProfile.subjects.map((subject) => (
                  <Tab 
                    key={subject.subjectName} 
                    title={
                      <div className="flex items-center gap-2">
                        <span>{subject.subjectName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getScoreColor(subject.averageScore)}`}>
                          {subject.averageScore.toFixed(1)}%
                        </span>
                      </div>
                    }
                  >
                    <div className="mt-4">
                      {subject.pages.length > 0 ? (
                        <>
                          <Table aria-label={`Notes pour ${subject.subjectName}`}>
                            <TableHeader>
                              <TableColumn>Page</TableColumn>
                              <TableColumn>Score</TableColumn>
                              <TableColumn>Réponses Correctes</TableColumn>
                              <TableColumn>Temps</TableColumn>
                              <TableColumn>Date</TableColumn>
                              <TableColumn>Actions</TableColumn>
                            </TableHeader>
                            <TableBody>
                              {getPaginatedPages().map((page) => (
                                <TableRow key={page.pageNumber}>
                                  <TableCell>Page {page.pageNumber}</TableCell>
                                  <TableCell className={getScoreColor(page.score)}>
                                    {page.score}% {getScoreEmoji(page.score)}
                                  </TableCell>
                                  <TableCell>
                                    {page.correctAnswers}/{page.totalQuestions}
                                  </TableCell>
                                  <TableCell>{formatTime(page.timeSpent)}</TableCell>
                                  <TableCell>{formatDate(page.completedAt)}</TableCell>
                                  <TableCell>
                                    <Button 
                                      color="danger" 
                                      size="sm"
                                      onClick={() => handleDeleteScore(subject.subjectName, page.pageNumber)}
                                    >
                                      Supprimer
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          
                          <div className="flex justify-center mt-4">
                            <Pagination
                              total={totalPages}
                              page={currentPage}
                              onChange={setCurrentPage}
                              showControls
                            />
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Aucune note disponible pour cette matière
                        </div>
                      )}
                    </div>
                  </Tab>
                ))}
              </Tabs>
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">
            Aucun profil d&apos;élève trouvé. Commencez à répondre aux questions pour créer votre profil.
          </p>
          <Button 
            color="primary" 
            className="mt-4"
            onClick={() => router.push("/controle")}
          >
            Retour aux exercices
          </Button>
        </div>
      )}
    </div>
  );
};

export default ElevePage; 
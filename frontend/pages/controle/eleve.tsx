"use client";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Tabs,
  Tab,
  Spinner,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Sparkles } from "lucide-react";

import BackButton from "@/components/back";
import EleveOverview from "@/components/eleve/EleveOverview";
import EleveStatsCard from "@/components/eleve/EleveStatsCard";
import EleveCharts from "@/components/eleve/EleveCharts";
import EleveLoadingSkeleton from "../../components/eleve/EleveLoadingSkeleton";
import { useEleveData } from "../../hooks/useEleveData";
import type { UserInfo, UserStats } from "../../types/eleve";

const ElevePage: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const {
    loading,
    error,
    userId,
    userInfo,
    advancedStats,
  } = useEleveData();

  // Affichage du chargement optimisé
  if (loading) {
    return <EleveLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardBody className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button
              color="primary"
              onPress={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardBody className="text-center">
            <FontAwesomeIcon icon={faUser} className="text-6xl text-gray-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Aucun profil trouvé</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Aucun profil d&apos;élève n&apos;a été trouvé pour cet utilisateur.
            </p>
            <Button
              color="primary"
              onPress={() => router.push("/dashboard")}
            >
              Retour au tableau de bord
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tableau de Bord Élève
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Suivez vos progrès et performances
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          className="mb-6"
          variant="bordered"
        >
          <Tab key="overview" title="Vue d'ensemble">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {advancedStats && <EleveOverview userInfo={userInfo} userStats={advancedStats} />}
            </motion.div>
          </Tab>
          
          <Tab key="subjects" title="Matières">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {advancedStats?.subjects?.map((subject, index) => (
                <EleveStatsCard
                  key={subject.subject}
                  stats={subject}
                />
              ))}
            </motion.div>
          </Tab>
          
          <Tab key="analytics" title="Analyses">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <EleveCharts
                subjects={advancedStats?.subjects || []}
                categoryStats={advancedStats?.categoryStats || []}
                dailyStats={advancedStats?.dailyStats || []}
              />
            </motion.div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ElevePage;

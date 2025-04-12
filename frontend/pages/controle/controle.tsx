"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, Spinner, Button } from "@nextui-org/react";

import ExercicesPage from "./exercices";
import RevisionPage from "./revision";
import StatsPage from "./stats";

interface TabItem {
  key: string;
  label: string;
}

const tabs: TabItem[] = [
  { key: "exercices", label: "Exercices" },
  { key: "revision", label: "Révision" },
  { key: "stats", label: "Statistiques" },
  { key: "subscription", label: "Abonnement" },
];

const Controle: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("exercices");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        router.push("/auth/login");

        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleTabChange = (key: string) => {
    setSelectedTab(key);
    if (key === "subscription") {
      router.push("/controle/subscription");
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "exercices":
        return <ExercicesPage />;
      case "revision":
        return <RevisionPage />;
      case "stats":
        return <StatsPage />;
      default:
        return <ExercicesPage />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner color="primary" size="lg" />
          <p className="mt-4 text-gray-600">Chargement...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          className="mb-8"
          selectedKey={selectedTab}
          onSelectionChange={(key) => handleTabChange(key.toString())}
        >
          {tabs.map((tab) => (
            <Tab key={tab.key} title={tab.label} />
          ))}
        </Tabs>
        {renderContent()}
      </div>
    </div>
  );
};

export default Controle;

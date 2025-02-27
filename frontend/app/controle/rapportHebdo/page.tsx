"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Input, Checkbox, Button } from "@nextui-org/react";
import Swal from "sweetalert2"; // Importation de sweetalert2

const subjects = [
  { name: "Mathématiques", color: "bg-red-200" },
  { name: "Sciences", color: "bg-green-200" },
  { name: "Français", color: "bg-blue-200" },
  { name: "Histoire", color: "bg-yellow-200" },
  { name: "Géographie", color: "bg-purple-200" },
  { name: "Langues", color: "bg-pink-200" },
  { name: "Arts Plastiques", color: "bg-indigo-200" },
  { name: "Leçons du jour", color: "bg-teal-200" },
];

// Méthode pour obtenir le numéro de la semaine actuelle
declare global {
  interface Date {
    getWeekNumber(): number;
  }
}

Date.prototype.getWeekNumber = function () {
  const startOfYear = new Date(this.getFullYear(), 0, 1);
  const pastDaysOfYear = (this.getTime() - startOfYear.getTime()) / 86400000;

  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

// Fonction pour générer les semaines de l'année
const generateWeeksOfYear = () => {
  const weeks = [];
  const currentWeek = new Date().getWeekNumber();
  const totalWeeks = 52; // Nombre de semaines dans l'année

  for (let i = currentWeek; i <= totalWeeks; i++) {
    weeks.push(`Semaine ${i}`);
  }

  return weeks;
};

interface ReportItem {
  subject: string;
  activity: string;
  hours: string;
  progress: string;
}

type ReportList = ReportItem[];

const WeeklyReport = () => {
  const [selectedWeek, setSelectedWeek] = useState(
    `Semaine ${new Date().getWeekNumber()}`,
  );
  const [weeks] = useState(generateWeeksOfYear); // Générer les semaines de l'année
  const [showWeeks, setShowWeeks] = useState(false); // État pour afficher ou masquer la liste des semaines
  const [report, setReport] = useState<ReportList>(
    subjects.map((subject) => ({
      subject: subject.name,
      activity: "",
      hours: "",
      progress: "",
    })),
  );

  // Charger le rapport pour la semaine sélectionnée depuis localStorage lors du chargement du composant
  useEffect(() => {
    const savedReport = JSON.parse(localStorage.getItem(selectedWeek) || "[]");

    if (savedReport.length) {
      setReport(savedReport);
    } else {
      // Réinitialiser si aucun rapport n'est trouvé
      setReport(
        subjects.map((subject) => ({
          subject: subject.name,
          activity: "",
          hours: "",
          progress: "",
        })),
      );
    }
  }, [selectedWeek]); // Charger les données chaque fois que la semaine sélectionnée change

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (
    index: number,
    field: keyof ReportItem,
    value: string,
  ) => {
    const updatedReport = [...report];

    updatedReport[index][field] = value;
    setReport(updatedReport);
  };

  // Fonction pour vérifier si le rapport est complet
  const isReportComplete = () => {
    for (let item of report) {
      if (!item.activity || !item.hours || !item.progress) {
        return false;
      }
    }

    return true;
  };

  // Fonction pour sauvegarder le rapport dans localStorage
  const saveReport = () => {
    if (!isReportComplete()) {
      Swal.fire({
        icon: "warning",
        title: "Rapport incomplet",
        text: "Veuillez remplir toutes les activités, les heures et les statuts de progression pour chaque matière.",
        confirmButtonText: "Ok",
      });

      return;
    }

    localStorage.setItem(selectedWeek, JSON.stringify(report));
    Swal.fire({
      icon: "success",
      title: "Sauvegarde réussie",
      text: `Le rapport pour ${selectedWeek} a été sauvegardé avec succès !`,
      confirmButtonText: "Super",
    });
  };

  // Fonction pour télécharger le rapport en tant que fichier JSON
  const downloadReport = () => {
    if (!isReportComplete()) {
      Swal.fire({
        icon: "warning",
        title: "Rapport incomplet",
        text: "Le rapport est incomplet. Veuillez remplir toutes les informations avant de le télécharger.",
        confirmButtonText: "Ok",
      });

      return;
    }

    const dataStr = JSON.stringify(report, null, 2); // Convertir le rapport en JSON
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${selectedWeek}-weeklyReport.json`; // Nom du fichier basé sur la semaine
    a.click();
    URL.revokeObjectURL(url); // Libérer la mémoire
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 py-8 md:py-10">
      <h1 className="mb-4 text-4xl font-bold text-center text-blue-700">
        Rapport Hebdomadaire
      </h1>

      {/* Sélecteur de semaine */}
      <div className="relative mb-4">
        <Button onClick={() => setShowWeeks((prev) => !prev)}>
          {selectedWeek}
        </Button>
        {showWeeks && (
          <div className="absolute z-10 mt-2 bg-cream border border-gray-300 rounded-md shadow-lg">
            {weeks.map((week) => (
              <div
                key={week}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedWeek(week);
                  setShowWeeks(false); // Masquer la liste après sélection
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedWeek(week);
                    setShowWeeks(false); // Masquer la liste après sélection
                  }
                }}
              >
                {week}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {report.map((item, index) => (
          <Card
            key={index}
            className={`p-6 w-full max-w-[400px] ${subjects[index].color} rounded-lg shadow-md hover:shadow-lg`}
          >
            <CardBody>
              <h4 className="mb-4 text-xl font-bold text-center text-gray-800">
                {item.subject}
              </h4>
              <Input
                fullWidth
                className="mb-4"
                placeholder="Activité réalisée"
                value={item.activity}
                onChange={(e) =>
                  handleInputChange(index, "activity", e.target.value)
                }
              />
              <Input
                fullWidth
                className="mb-4"
                placeholder="Heures passées"
                type="number"
                value={item.hours}
                onChange={(e) =>
                  handleInputChange(index, "hours", e.target.value)
                }
              />
              <div className="flex flex-col gap-2 mt-4">
                <Checkbox
                  isSelected={item.progress === "in-progress"}
                  onChange={() =>
                    handleInputChange(index, "progress", "in-progress")
                  }
                >
                  En cours d&apos;apprentissage
                </Checkbox>
                <Checkbox
                  isSelected={item.progress === "completed"}
                  onChange={() =>
                    handleInputChange(index, "progress", "completed")
                  }
                >
                  Apprentissage fait
                </Checkbox>
                <Checkbox
                  isSelected={item.progress === "not-acquired"}
                  onChange={() =>
                    handleInputChange(index, "progress", "not-acquired")
                  }
                >
                  Pas acquis
                </Checkbox>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <Button
        className="px-6 py-2 mt-8 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        onClick={saveReport}
      >
        Enregistrer le rapport
      </Button>
      <Button
        className="px-6 py-2 mt-4 text-white bg-green-600 rounded-md hover:bg-green-700"
        onClick={downloadReport}
      >
        Télécharger le rapport
      </Button>
    </div>
  );
};

export default WeeklyReport;

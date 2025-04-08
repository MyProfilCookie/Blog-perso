// scripts/import-subjects.js
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Ajustez ces chemins selon votre structure de projet
const DBConnectionHandler = require("../api/utils/DBconnect");

// Importer le modèle Subject, RapportHebdo et Trimestre
const { Subject, RapportHebdo } = require("../api/models/Subject");
const Trimestre = require("../api/models/Trimestre");

// Données des matières
const subjects = [
  {
    name: "art",
    displayName: "Art",
    description: "Questions sur l'art, les artistes et les mouvements artistiques",
    icon: "palette"
  },
  {
    name: "french",
    displayName: "Français",
    description: "Grammaire, orthographe, conjugaison et littérature française",
    icon: "book-open"
  },
  {
    name: "geography",
    displayName: "Géographie",
    description: "Pays, capitales, cartes et phénomènes géographiques",
    icon: "globe"
  },
  {
    name: "history",
    displayName: "Histoire",
    description: "Événements historiques, personnages importants et chronologie",
    icon: "clock"
  },
  {
    name: "language",
    displayName: "Langues",
    description: "Apprentissage et pratique des langues étrangères",
    icon: "message-circle"
  },
  {
    name: "math",
    displayName: "Mathématiques",
    description: "Calcul, géométrie, algèbre et problèmes mathématiques",
    icon: "calculator"
  },
  {
    name: "music",
    displayName: "Musique",
    description: "Instruments, théorie musicale, compositeurs et genres musicaux",
    icon: "music"
  },
  {
    name: "rapportHebdo",
    displayName: "Rapport Hebdomadaire",
    description: "Rapports hebdomadaires et suivis d'activités",
    icon: "file-text"
  },
  {
    name: "sciences",
    displayName: "Sciences",
    description: "Biologie, chimie, physique et découvertes scientifiques",
    icon: "flask"
  },
  {
    name: "technology",
    displayName: "Technologie",
    description: "Informatique, programmation et nouvelles technologies",
    icon: "cpu"
  },
  {
    name: "trimestres",
    displayName: "Trimestres",
    description: "Organisation et contenu des trimestres scolaires",
    icon: "calendar"
  }
];

// Fonction pour charger les questions depuis un fichier JSON
const loadQuestions = (subjectName) => {
  try {
    const filePath = path.join(__dirname, `../data/${subjectName}-questions.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      const questions = JSON.parse(data);
      console.log(`✅ Fichier ${subjectName}-questions.json trouvé`);
      return questions;
    }
    console.log(`⚠️ Fichier ${subjectName}-questions.json non trouvé`);
    return [];
  } catch (error) {
    console.error(`❌ Erreur lors du chargement des questions pour ${subjectName}:`, error.message);
    return [];
  }
};

async function importSubjects() {
  try {
    if (typeof DBConnectionHandler === 'function') {
      await DBConnectionHandler();
    } else {
      await mongoose.connect(process.env.DB_STRING || process.env.DB);
      console.log("✅ Connecté à MongoDB");
    }

    for (const subject of subjects) {
      if (subject.name === "rapportHebdo") {
        const weekFilePath = path.join(__dirname, `../data/rapportHebdo-questions.json`);
        if (fs.existsSync(weekFilePath)) {
          const data = fs.readFileSync(weekFilePath, 'utf8');
          const weeks = JSON.parse(data);

          for (const weekEntry of weeks) {
            const result = await RapportHebdo.findOneAndUpdate(
              { week: weekEntry.week },
              { ...weekEntry, createdAt: new Date() },
              { upsert: true, new: true }
            );
            console.log(`📘 Rapport semaine ${weekEntry.week} importé (${result.subjects.length} matières)`);
          }
        } else {
          console.warn("⚠️ Fichier rapportHebdo-questions.json introuvable");
        }
        continue;
      }

      if (subject.name === "trimestres") {
        const trimestreFilePath = path.join(__dirname, `../data/trimestres-questions.json`);
        if (fs.existsSync(trimestreFilePath)) {
          const data = fs.readFileSync(trimestreFilePath, 'utf8');
          const trimestres = JSON.parse(data);

          for (const trimestreEntry of trimestres) {
            const result = await Trimestre.findOneAndUpdate(
              { numero: trimestreEntry.trimestre },
              {
                numero: trimestreEntry.trimestre,
                subjects: trimestreEntry.subjects,
                updatedAt: new Date()
              },
              { upsert: true, new: true }
            );
            console.log(`📘 Trimestre ${trimestreEntry.trimestre} importé (${result.subjects.length} matières)`);
          }
        } else {
          console.warn("⚠️ Fichier trimestres-questions.json introuvable");
        }
        continue;
      }

      const questions = loadQuestions(subject.name);

      try {
        const result = await Subject.findOneAndUpdate(
          { name: subject.name },
          {
            ...subject,
            questions: questions.length > 0 ? questions : [],
            updatedAt: new Date()
          },
          { upsert: true, new: true }
        );

        if (questions.length > 0) {
          console.log(`✅ Matière "${subject.displayName}" importée avec ${questions.length} questions`);
        } else {
          console.log(`✅ Matière "${subject.displayName}" importée sans questions`);
        }
      } catch (subjectError) {
        console.error(`❌ Erreur lors de l'importation de la matière ${subject.name}:`, subjectError.message);
      }
    }

    console.log("🎉 Import terminé avec succès");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Erreur lors de l'importation: ${error.message}`);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

importSubjects();

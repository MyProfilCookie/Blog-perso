const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schéma pour les objectifs d'une leçon
const ObjectiveSchema = new Schema({
  description: { type: String, required: true },
});

// Schéma pour les étapes d'une leçon
const StepSchema = new Schema({
  step: { type: String, required: true },
});

// Schéma pour une activité dans une leçon
const ActivitySchema = new Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  materials: [String],
  steps: [StepSchema],
  explanations: [String],
});

// Schéma pour une leçon
const LessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  objectives: [ObjectiveSchema],
  introduction: {
    duration: { type: String, required: true },
    steps: [StepSchema],
  },
  activities: [ActivitySchema],
  explanation: {
    duration: String,
    concepts: [String],
  },
  final_activity: {
    title: String,
    duration: String,
    description: String,
  },
  conclusion: {
    steps: [StepSchema],
  },
});

// Schéma principal pour les cours classés par mois
const MonthlyCourseSchema = new Schema({
  month: { type: String, required: true }, // Exemple: "September"
  year: { type: Number, required: true }, // Exemple: 2024
  lessons: [
    {
      date: { type: Date, required: true }, // Date précise de la leçon
      lessons: [LessonSchema], // Liste des leçons pour cette journée
    },
  ],
});

// Création du modèle pour les cours classés par mois
const MonthlyCourse = mongoose.model("MonthlyCourse", MonthlyCourseSchema);

module.exports = MonthlyCourse;



const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    pageNumber: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    timeSpent: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches
scoreSchema.index({ userId: 1, subjectName: 1, pageNumber: 1 }, { unique: true });

// Méthode pour calculer la moyenne d'un élève dans une matière
scoreSchema.statics.calculateAverage = async function (userId, subjectName) {
  const scores = await this.find({ userId, subjectName });
  
  if (scores.length === 0) {
    return 0;
  }
  
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  return totalScore / scores.length;
};

// Méthode pour calculer la moyenne globale d'un élève
scoreSchema.statics.calculateOverallAverage = async function (userId) {
  const scores = await this.find({ userId });
  
  if (scores.length === 0) {
    return 0;
  }
  
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  return totalScore / scores.length;
};

// Méthode pour obtenir les statistiques d'un élève
scoreSchema.statics.getStudentStats = async function (userId) {
  const scores = await this.find({ userId });
  
  if (scores.length === 0) {
    return {
      overallAverage: 0,
      totalPagesCompleted: 0,
      subjects: []
    };
  }
  
  // Grouper les scores par matière
  const subjectScores = {};
  
  scores.forEach(score => {
    if (!subjectScores[score.subjectName]) {
      subjectScores[score.subjectName] = [];
    }
    subjectScores[score.subjectName].push(score);
  });
  
  // Calculer les statistiques par matière
  const subjects = Object.keys(subjectScores).map(subjectName => {
    const subjectScoresList = subjectScores[subjectName];
    const totalScore = subjectScoresList.reduce((sum, score) => sum + score.score, 0);
    const averageScore = totalScore / subjectScoresList.length;
    
    return {
      subjectName,
      pages: subjectScoresList.map(score => ({
        pageNumber: score.pageNumber,
        score: score.score,
        completedAt: score.completedAt,
        timeSpent: score.timeSpent,
        correctAnswers: score.correctAnswers,
        totalQuestions: score.totalQuestions
      })),
      averageScore,
      lastUpdated: subjectScoresList.reduce((latest, score) => 
        new Date(score.completedAt) > new Date(latest) ? score.completedAt : latest, 
        new Date(0)
      )
    };
  });
  
  // Calculer la moyenne globale
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  const overallAverage = totalScore / scores.length;
  
  return {
    overallAverage,
    totalPagesCompleted: scores.length,
    subjects
  };
};

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score; 
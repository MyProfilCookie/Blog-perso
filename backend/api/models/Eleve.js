const mongoose = require('mongoose');

// Schéma pour les notes par page
const NotePageSchema = new mongoose.Schema({
  pageNumber: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number, // en secondes
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  }
});

// Schéma pour les notes par matière
const NoteSubjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true
  },
  pages: [NotePageSchema],
  averageScore: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Schéma principal pour l'élève
const EleveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjects: [NoteSubjectSchema],
  overallAverage: {
    type: Number,
    default: 0
  },
  totalPagesCompleted: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour la date de modification
EleveSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour calculer la moyenne globale
EleveSchema.methods.calculateOverallAverage = function() {
  if (this.subjects.length === 0) return 0;
  
  const totalScore = this.subjects.reduce((sum, subject) => sum + subject.averageScore, 0);
  this.overallAverage = totalScore / this.subjects.length;
  return this.overallAverage;
};

// Méthode pour ajouter une note à une page
EleveSchema.methods.addPageScore = function(subjectName, pageData) {
  // Trouver la matière
  let subject = this.subjects.find(s => s.subjectName === subjectName);
  
  // Si la matière n'existe pas, la créer
  if (!subject) {
    subject = {
      subjectName: subjectName,
      pages: [],
      averageScore: 0
    };
    this.subjects.push(subject);
  }
  
  // Ajouter la note de la page
  subject.pages.push(pageData);
  
  // Recalculer la moyenne de la matière
  const totalScore = subject.pages.reduce((sum, page) => sum + page.score, 0);
  subject.averageScore = totalScore / subject.pages.length;
  subject.lastUpdated = Date.now();
  
  // Mettre à jour le nombre total de pages complétées
  this.totalPagesCompleted = this.subjects.reduce((sum, s) => sum + s.pages.length, 0);
  
  // Recalculer la moyenne globale
  this.calculateOverallAverage();
  
  return subject;
};

// Méthode statique pour calculer les statistiques
EleveSchema.statics.getStats = async function() {
  // Calculer la moyenne générale de tous les élèves
  const allEleves = await this.find();
  const totalAverage = allEleves.reduce((sum, eleve) => sum + (eleve.overallAverage || 0), 0);
  const averageScore = allEleves.length > 0 ? totalAverage / allEleves.length : 0;

  // Calculer la progression (comparaison avec le mois précédent)
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const previousCount = await this.countDocuments({
    createdAt: { $lt: oneMonthAgo }
  });
  
  const currentCount = allEleves.length;
  const progression = previousCount > 0 
    ? ((currentCount - previousCount) / previousCount) * 100 
    : 100;

  return {
    averageScore: averageScore.toFixed(2),
    progression: progression.toFixed(2)
  };
};

// Middleware pour créer automatiquement un élève pour les admins
EleveSchema.statics.createForAdmin = async function(userId) {
  const existingEleve = await this.findOne({ userId });
  if (!existingEleve) {
    const newEleve = new this({
      userId,
      subjects: [],
      overallAverage: 0,
      totalPagesCompleted: 0
    });
    await newEleve.save();
    return newEleve;
  }
  return existingEleve;
};

const Eleve = mongoose.model('Eleve', EleveSchema);

module.exports = Eleve; 
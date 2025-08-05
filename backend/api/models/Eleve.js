const mongoose = require('mongoose');

// Schéma pour les notes par page (existant amélioré)
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
  },
  // NOUVEAU: Données détaillées de l'exercice
  exerciseData: {
    userAnswers: { type: Map, of: mongoose.Schema.Types.Mixed },
    validatedExercises: { type: Map, of: Boolean },
    exerciseType: { type: String, enum: ['standard', 'trimestre', 'rapportHebdo', 'lesson'], default: 'standard' }
  }
});

// Schéma pour les notes par matière (existant amélioré)
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
  },
  // NOUVEAU: Statistiques avancées
  stats: {
    totalExercises: { type: Number, default: 0 },
    exercisesCompleted: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    worstScore: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  }
});

// Schéma principal pour l'élève (existant amélioré)
const EleveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Un seul profil par utilisateur
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
  // NOUVEAU: Statistiques quotidiennes
  dailyStats: [{
    date: { type: String, required: true }, // Format YYYY-MM-DD
    exercisesCompleted: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 } // en secondes
  }],
  // NOUVEAU: Statistiques globales
  globalStats: {
    totalExercises: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 },
    streak: { type: Number, default: 0 }, // Jours consécutifs d'exercices
    lastStreakDate: { type: Date }
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

// Middleware pour mettre à jour les stats (existant amélioré)
EleveSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculer les statistiques globales
  this.calculateGlobalStats();
  
  // Mettre à jour les statistiques quotidiennes
  this.updateDailyStats();
  
  next();
});

// NOUVELLE méthode pour calculer les statistiques globales
EleveSchema.methods.calculateGlobalStats = function() {
  let totalExercises = 0;
  let totalCorrect = 0;
  let totalTimeSpent = 0;
  let totalScore = 0;
  let exerciseCount = 0;

  this.subjects.forEach(subject => {
    subject.pages.forEach(page => {
      totalExercises++;
      totalCorrect += page.correctAnswers;
      totalTimeSpent += page.timeSpent;
      totalScore += page.score;
      exerciseCount++;
      
      // Mettre à jour les stats de la matière
      subject.stats.totalExercises = subject.pages.length;
      subject.stats.exercisesCompleted = subject.pages.length;
      subject.stats.bestScore = Math.max(...subject.pages.map(p => p.score));
      subject.stats.worstScore = Math.min(...subject.pages.map(p => p.score));
      subject.stats.completionRate = subject.pages.length > 0 ? 
        (subject.pages.reduce((sum, p) => sum + p.correctAnswers, 0) / 
         subject.pages.reduce((sum, p) => sum + p.totalQuestions, 0)) * 100 : 0;
      subject.stats.lastActivity = new Date();
    });
  });

  this.globalStats.totalExercises = totalExercises;
  this.globalStats.totalCorrect = totalCorrect;
  this.globalStats.averageScore = exerciseCount > 0 ? totalScore / exerciseCount : 0;
  this.globalStats.totalTimeSpent = totalTimeSpent;
  
  // Calculer la moyenne globale
  this.overallAverage = this.globalStats.averageScore;
  this.totalPagesCompleted = totalExercises;
};

// NOUVELLE méthode pour mettre à jour les statistiques quotidiennes
EleveSchema.methods.updateDailyStats = function() {
  const today = new Date().toISOString().split('T')[0];
  
  // Chercher les stats d'aujourd'hui
  let todayStats = this.dailyStats.find(stat => stat.date === today);
  
  if (!todayStats) {
    todayStats = {
      date: today,
      exercisesCompleted: 0,
      averageScore: 0,
      timeSpent: 0
    };
    this.dailyStats.push(todayStats);
  }
  
  // Calculer les exercices d'aujourd'hui
  const todayExercises = this.subjects.reduce((count, subject) => {
    return count + subject.pages.filter(page => 
      page.completedAt.toISOString().split('T')[0] === today
    ).length;
  }, 0);
  
  if (todayExercises > 0) {
    const todayPages = [];
    this.subjects.forEach(subject => {
      subject.pages.forEach(page => {
        if (page.completedAt.toISOString().split('T')[0] === today) {
          todayPages.push(page);
        }
      });
    });
    
    todayStats.exercisesCompleted = todayExercises;
    todayStats.averageScore = todayPages.reduce((sum, page) => sum + page.score, 0) / todayPages.length;
    todayStats.timeSpent = todayPages.reduce((sum, page) => sum + page.timeSpent, 0);
  }
  
  // Garder seulement les 30 derniers jours
  this.dailyStats = this.dailyStats
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 30);
};

// NOUVELLE méthode pour synchroniser les données localStorage
EleveSchema.methods.syncLocalStorageData = function(subject, localData) {
  console.log(`🔄 Synchronisation des données localStorage pour ${subject}`);
  
  // Trouver ou créer la matière
  let subjectDoc = this.subjects.find(s => s.subjectName === subject);
  if (!subjectDoc) {
    const subjectConfig = {
      'math': 'Mathématiques',
      'french': 'Français', 
      'sciences': 'Sciences',
      'art': 'Arts Plastiques',
      'history': 'Histoire',
      'geography': 'Géographie'
    };
    
    subjectDoc = {
      subjectName: subjectConfig[subject] || subject,
      pages: [],
      averageScore: 0,
      stats: {
        totalExercises: 0,
        exercisesCompleted: 0,
        bestScore: 0,
        worstScore: 0,
        completionRate: 0,
        lastActivity: new Date()
      }
    };
    this.subjects.push(subjectDoc);
  }
  
  // Synchroniser les exercices validés
  if (localData.validatedExercises) {
    Object.entries(localData.validatedExercises).forEach(([pageId, isValidated]) => {
      if (isValidated) {
        const pageNumber = parseInt(pageId.replace('page-', '')) || parseInt(pageId);
        
        // Vérifier si cette page existe déjà
        const existingPage = subjectDoc.pages.find(p => p.pageNumber === pageNumber);
        if (!existingPage) {
          // Créer une nouvelle page avec des données par défaut
          const newPage = {
            pageNumber,
            score: 80, // Score par défaut pour exercice validé
            completedAt: new Date(),
            timeSpent: 120, // 2 minutes par défaut
            correctAnswers: 4, // Estimation
            totalQuestions: 5, // Estimation
            exerciseData: {
              userAnswers: new Map(Object.entries(localData.userAnswers || {})),
              validatedExercises: new Map(Object.entries(localData.validatedExercises || {})),
              exerciseType: 'standard'
            }
          };
          subjectDoc.pages.push(newPage);
        }
      }
    });
  }
  
  // Synchroniser les résultats détaillés
  if (localData.results && Array.isArray(localData.results)) {
    localData.results.forEach((result, index) => {
      const pageNumber = index + 1;
      const existingPage = subjectDoc.pages.find(p => p.pageNumber === pageNumber);
      
      if (!existingPage && result.isCorrect !== undefined) {
        const newPage = {
          pageNumber,
          score: result.score || (result.isCorrect ? 100 : 0),
          completedAt: new Date(result.completedAt || Date.now()),
          timeSpent: result.timeSpent || 120,
          correctAnswers: result.isCorrect ? 1 : 0,
          totalQuestions: 1,
          exerciseData: {
            userAnswers: new Map(Object.entries(localData.userAnswers || {})),
            validatedExercises: new Map(Object.entries(localData.validatedExercises || {})),
            exerciseType: 'standard'
          }
        };
        subjectDoc.pages.push(newPage);
      }
    });
  }
  
  // Recalculer la moyenne de la matière
  if (subjectDoc.pages.length > 0) {
    const totalScore = subjectDoc.pages.reduce((sum, page) => sum + page.score, 0);
    subjectDoc.averageScore = totalScore / subjectDoc.pages.length;
    subjectDoc.lastUpdated = new Date();
  }
  
  console.log(`✅ ${subjectDoc.pages.length} pages synchronisées pour ${subject}`);
};

// Méthode existante améliorée
EleveSchema.methods.calculateOverallAverage = function() {
  if (this.subjects.length === 0) return 0;
  
  const totalScore = this.subjects.reduce((sum, subject) => sum + subject.averageScore, 0);
  this.overallAverage = totalScore / this.subjects.length;
  return this.overallAverage;
};

// Méthode existante améliorée
EleveSchema.methods.addPageScore = function(subjectName, pageData) {
  // Trouver la matière
  let subject = this.subjects.find(s => s.subjectName === subjectName);
  
  // Si la matière n'existe pas, la créer
  if (!subject) {
    subject = {
      subjectName: subjectName,
      pages: [],
      averageScore: 0,
      stats: {
        totalExercises: 0,
        exercisesCompleted: 0,
        bestScore: 0,
        worstScore: 0,
        completionRate: 0,
        lastActivity: new Date()
      }
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

// NOUVELLE méthode statique pour synchroniser les données localStorage
EleveSchema.statics.syncUserData = async function(userId, allSubjectsData) {
  try {
    let eleve = await this.findOne({ userId });
    
    if (!eleve) {
      eleve = new this({
        userId,
        subjects: [],
        overallAverage: 0,
        totalPagesCompleted: 0,
        dailyStats: [],
        globalStats: {
          totalExercises: 0,
          totalCorrect: 0,
          averageScore: 0,
          totalTimeSpent: 0,
          streak: 0
        }
      });
    }
    
    // Synchroniser chaque matière
    Object.entries(allSubjectsData).forEach(([subject, data]) => {
      eleve.syncLocalStorageData(subject, data);
    });
    
    await eleve.save();
    return eleve;
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
    throw error;
  }
};

// Méthode existante améliorée
EleveSchema.statics.getStats = async function() {
  const allEleves = await this.find();
  const totalAverage = allEleves.reduce((sum, eleve) => sum + (eleve.overallAverage || 0), 0);
  const averageScore = allEleves.length > 0 ? totalAverage / allEleves.length : 0;

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
    progression: progression.toFixed(2),
    totalStudents: currentCount,
    totalExercises: allEleves.reduce((sum, eleve) => sum + eleve.globalStats.totalExercises, 0)
  };
};

// Index pour optimiser les requêtes
EleveSchema.index({ userId: 1 });
EleveSchema.index({ 'subjects.subjectName': 1 });
EleveSchema.index({ 'dailyStats.date': 1 });

const Eleve = mongoose.model('Eleve', EleveSchema);

module.exports = Eleve;
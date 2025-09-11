const mongoose = require('mongoose');

// Schéma pour une question individuelle
const questionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['Mathématiques', 'Français', 'Sciences', 'Histoire', 'Géographie', 'Arts', 'Musique']
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  answer: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['facile', 'moyen', 'difficile'],
    default: 'facile'
  },
  ageRange: {
    min: {
      type: Number,
      min: 6,
      max: 18,
      default: 6
    },
    max: {
      type: Number,
      min: 6,
      max: 18,
      default: 18
    }
  },
  imageUrl: {
    type: String,
    default: null
  },
  explanation: {
    type: String,
    default: null
  }
});

// Schéma pour un quiz hebdomadaire
const quizSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 52
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  questions: [questionSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

// Schéma pour les résultats de quiz
const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  week: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  answers: [{
    questionId: {
      type: Number,
      required: true
    },
    selectedAnswer: {
      type: String,
      required: true
    },
    correctAnswer: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    timeSpent: {
      type: Number, // en secondes
      default: 0
    }
  }],
  timeSpent: {
    type: Number, // en secondes
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  attempts: {
    type: Number,
    default: 1
  }
});

// Index pour optimiser les requêtes
quizSchema.index({ week: 1, isActive: 1 });
quizResultSchema.index({ userId: 1, quizId: 1 });
quizResultSchema.index({ userId: 1, week: 1 });

// Middleware pour mettre à jour updatedAt
quizSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthodes virtuelles
quizSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

quizSchema.virtual('subjects').get(function() {
  return [...new Set(this.questions.map(q => q.subject))];
});

// Méthodes statiques
quizSchema.statics.findByWeek = function(week) {
  return this.findOne({ week, isActive: true });
};

quizSchema.statics.findActiveQuizzes = function() {
  return this.find({ isActive: true }).sort({ week: 1 });
};

quizSchema.statics.getQuizStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalQuizzes: { $sum: 1 },
        totalQuestions: { $sum: { $size: '$questions' } },
        averageQuestionsPerQuiz: { $avg: { $size: '$questions' } }
      }
    }
  ]);
};

// Méthodes d'instance
quizSchema.methods.getQuestionsBySubject = function(subject) {
  return this.questions.filter(q => q.subject === subject);
};

quizSchema.methods.getQuestionsByDifficulty = function(difficulty) {
  return this.questions.filter(q => q.difficulty === difficulty);
};

quizSchema.methods.getQuestionsByAgeRange = function(minAge, maxAge) {
  return this.questions.filter(q => 
    q.ageRange.min <= maxAge && q.ageRange.max >= minAge
  );
};

// Méthodes pour les résultats
quizResultSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).populate('quizId').sort({ completedAt: -1 });
};

quizResultSchema.statics.findByUserAndWeek = function(userId, week) {
  return this.find({ userId, week }).populate('quizId');
};

quizResultSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalQuizzes: { $sum: 1 },
        averageScore: { $avg: '$percentage' },
        bestScore: { $max: '$percentage' },
        totalTimeSpent: { $sum: '$timeSpent' }
      }
    }
  ]);
};

quizResultSchema.statics.getWeeklyStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$week',
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$percentage' },
        completionRate: {
          $avg: {
            $cond: [{ $gte: ['$percentage', 70] }, 1, 0]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

const Quiz = mongoose.model('Quiz', quizSchema);
const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = { Quiz, QuizResult };

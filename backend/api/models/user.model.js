const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // ... existing code ...
  
  role: {
    type: String,
    enum: ['admin', 'eleve'],
    default: 'eleve'
  },
  
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active'
    }
  },
  
  dailyExerciseCount: {
    type: Number,
    default: 0
  },
  
  lastExerciseDate: {
    type: Date
  },
  
  // ... existing code ...
}, {
  timestamps: true
});

// Méthode pour vérifier si l'utilisateur peut accéder à un exercice
userSchema.methods.canAccessExercise = function() {
  if (this.role === 'admin') return true;
  if (this.subscription.type === 'premium' && this.subscription.status === 'active') return true;
  
  // Pour les utilisateurs gratuits
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!this.lastExerciseDate || this.lastExerciseDate < today) {
    this.dailyExerciseCount = 0;
  }
  
  return this.dailyExerciseCount < 3;
};

// Méthode pour incrémenter le compteur d'exercices
userSchema.methods.incrementExerciseCount = function() {
  if (this.role === 'admin' || (this.subscription.type === 'premium' && this.subscription.status === 'active')) {
    return true;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!this.lastExerciseDate || this.lastExerciseDate < today) {
    this.dailyExerciseCount = 0;
  }
  
  if (this.dailyExerciseCount < 3) {
    this.dailyExerciseCount += 1;
    this.lastExerciseDate = today;
    return true;
  }
  
  return false;
};

module.exports = mongoose.model('User', userSchema); 
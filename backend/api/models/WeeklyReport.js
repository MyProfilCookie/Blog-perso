const mongoose = require('mongoose');

// Report Item Schema (sub-document)
const ReportItemSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "Le nom de la matière est requis"]
  },
  activity: {
    type: String,
    required: [true, "La description de l'activité est requise"]
  },
  hours: {
    type: String,
    required: [true, "Le temps passé est requis"]
  },
  progress: {
    type: String,
    enum: ["not-started", "in-progress", "completed", "not-acquired"],
    default: "not-started"
  }
}, { _id: false });

// Main Weekly Report Schema
const WeeklyReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "L'ID de l'utilisateur est requis"]
  },
  weekNumber: {
    type: String,
    required: [true, "Le numéro de la semaine est requis"]
  },
  items: [ReportItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt parameter when the document is modified
WeeklyReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update the timestamp on findOneAndUpdate operations
WeeklyReportSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Index for optimizing queries by user and week
WeeklyReportSchema.index({ userId: 1, weekNumber: 1 }, { unique: true });

const WeeklyReport = mongoose.model('WeeklyReport', WeeklyReportSchema);

module.exports = WeeklyReport;
const mongoose = require('mongoose');

// Question Schema (sub-document)
const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayMinLength, 'At least 2 options are required']
  },
  answer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Facile', 'Moyen', 'Difficile'],
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

// Validator for array minimum length
function arrayMinLength(val) {
  return val.length >= 2;
}

// Main Subject Schema
const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['art', 'french', 'geography', 'history', 'language', 'math', 'music', 'rapportHebdo', 'sciences', 'technology', 'trimestres']
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'default-icon'
  },
  active: {
    type: Boolean,
    default: true
  },
  questions: [QuestionSchema],
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
SubjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;
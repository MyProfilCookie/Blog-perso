const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @typedef {Object} IRevisionError
 * @property {string} userId
 * @property {string} questionId
 * @property {string} questionText
 * @property {string} selectedAnswer
 */

const revisionErrorSchema = new Schema({
  userId: { type: String, required: true },
  questionId: { type: String, required: true },
  questionText: String,
  selectedAnswer: String,
  correctAnswer: String,
  category: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.models.RevisionError || mongoose.model("RevisionError", revisionErrorSchema);
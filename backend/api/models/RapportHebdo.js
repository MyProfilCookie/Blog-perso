const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
  difficulty: { type: String, required: true },
}, { _id: false });

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  color: { type: String },
  questions: [QuestionSchema],
}, { _id: false });

const RapportHebdoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  week: { type: Number, required: true },
  subjects: [SubjectSchema],
}, { timestamps: true });

module.exports = mongoose.model("RapportHebdo", RapportHebdoSchema);

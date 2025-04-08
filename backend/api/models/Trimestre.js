const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  difficulty: String,
});

const subjectSchema = new mongoose.Schema({
  name: String,
  icon: String,
  color: String,
  questions: [questionSchema],
});

const trimestreSchema = new mongoose.Schema(
  {
    trimestre: { type: Number, required: true },
    subjects: [subjectSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trimestre", trimestreSchema);

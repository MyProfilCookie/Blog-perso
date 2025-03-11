const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', ContactSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  nom: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    match: /^\S+@\S+\.\S+$/, // Validation de base de l'email
  },
  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000,
  },
  date: {
    type: Date,
    default: Date.now, // Enregistre automatiquement la date d'envoi
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);


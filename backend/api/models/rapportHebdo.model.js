const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    _id: {
        type: String
    }
}, { _id: false });

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    color: {
        type: String
    },
    questions: [questionSchema]
}, { _id: false });

const rapportHebdoSchema = new mongoose.Schema({
    week: {
        type: Number,
        required: true
    },
    subjects: [subjectSchema],
    __v: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index pour améliorer les performances des requêtes
rapportHebdoSchema.index({ week: 1 });

// Vérifier si le modèle existe déjà avant de le créer
module.exports = mongoose.models.RapportHebdo || mongoose.model('RapportHebdo', rapportHebdoSchema); 
const mongoose = require('mongoose');

const rapportHebdoSchema = new mongoose.Schema({
    week: {
        type: Number,
        required: [true, 'Le numéro de la semaine est requis']
    },
    subjects: [{
        type: String,
        required: [true, 'Au moins une matière est requise']
    }],
    titre: {
        type: String,
        required: [true, 'Le titre est requis'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La description est requise']
    },
    dateDebut: {
        type: Date,
        required: [true, 'La date de début est requise']
    },
    dateFin: {
        type: Date,
        required: [true, 'La date de fin est requise']
    },
    objectifs: [{
        type: String,
        required: [true, 'Au moins un objectif est requis']
    }],
    realisations: [{
        type: String,
        required: [true, 'Au moins une réalisation est requise']
    }],
    difficultes: [{
        type: String
    }],
    solutions: [{
        type: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['brouillon', 'en_revision', 'approuve', 'rejete'],
        default: 'brouillon'
    }
}, {
    timestamps: true
});

// Index pour améliorer les performances des requêtes
rapportHebdoSchema.index({ createdBy: 1, dateDebut: -1 });
rapportHebdoSchema.index({ status: 1 });
rapportHebdoSchema.index({ week: 1 });

// Vérifier si le modèle existe déjà avant de le créer
module.exports = mongoose.models.RapportHebdo || mongoose.model('RapportHebdo', rapportHebdoSchema); 
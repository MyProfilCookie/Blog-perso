const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    weight: { 
        type: Number, 
        required: false // ✅ Optionnel
    },
    category: { 
        type: String, 
        required: false // ✅ Optionnel
    },
    dimensions: { 
        type: String, 
        required: false // ✅ Optionnel
    },
    features: [{ 
        type: String, 
        required: false // ✅ Liste de caractéristiques optionnelles
    }]
});

const Produit = mongoose.model('Produit', produitSchema);

module.exports = Produit;

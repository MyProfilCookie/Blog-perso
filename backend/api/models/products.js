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
    }
});

const Produit = mongoose.model('Produit', produitSchema);

module.exports = Produit;

const PaymentConfirmation = require('../models/paymentConfirmation');
const Order = require('../models/order');
const User = require('../models/User'); // Assurez-vous d'avoir le modèle User
const mongoose = require('mongoose');

// Créer une nouvelle confirmation de paiement
exports.createPaymentConfirmation = async (req, res) => {
    try {
        console.log("📥 Données reçues :", req.body);
        const { orderId, userId, transactionId, paymentMethod, paymentStatus, amount } = req.body;

        // Vérification des champs obligatoires
        if (!orderId || !userId || !transactionId || !amount || !paymentMethod) {
            return res.status(400).json({ message: "❗ Tous les champs obligatoires doivent être fournis." });
        }

        // Validation des IDs MongoDB
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "❌ ID de commande invalide." });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "❌ ID utilisateur invalide." });
        }

        // Vérification de l'existence de la commande
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "🚫 Commande non trouvée." });
        }

        // Vérification de l'existence de l'utilisateur
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "🚫 Utilisateur non trouvé." });
        }

        // Vérification de la duplication de la confirmation de paiement
        const existingConfirmation = await PaymentConfirmation.findOne({ transactionId });
        if (existingConfirmation) {
            return res.status(409).json({ message: "⚠️ Cette transaction a déjà été confirmée." });
        }

        // Création et sauvegarde de la confirmation de paiement
        const confirmation = new PaymentConfirmation({
            orderId,
            userId,
            transactionId,
            paymentMethod,
            paymentStatus: paymentStatus || 'Pending',
            amount,
        });

        const savedConfirmation = await confirmation.save();

        // Mise à jour du statut de paiement de la commande
        order.paymentStatus = 'Paid';
        await order.save();

        console.log("✅ Confirmation de paiement enregistrée avec succès :", savedConfirmation);

        res.status(201).json({
            message: "✔️ Confirmation de paiement enregistrée avec succès.",
            confirmation: savedConfirmation,
        });
    } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement de la confirmation de paiement :", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de l'enregistrement de la confirmation de paiement.",
            error: error.message // Détails de l'erreur
        });
    }
};

// Obtenir une confirmation de paiement par ID
exports.getPaymentConfirmation = async (req, res) => {
    try {
        const { id } = req.params;

        // Validation de l'ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID invalide. Veuillez fournir un ID valide." });
        }

        // Recherche de la confirmation de paiement
        const confirmation = await PaymentConfirmation.findById(id)
            .populate('orderId')
            .populate('userId');

        if (!confirmation) {
            return res.status(404).json({ message: "Confirmation de paiement introuvable." });
        }

        // Réponse réussie avec les données
        res.status(200).json(confirmation);
    } catch (error) {
        console.error("Erreur lors de la récupération de la confirmation de paiement :", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération de la confirmation de paiement." });
    }
};

// Supprimer une confirmation de paiement
exports.deletePaymentConfirmation = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedConfirmation = await PaymentConfirmation.findByIdAndDelete(id);

        if (!deletedConfirmation) {
            return res.status(404).json({ message: "Confirmation de paiement introuvable." });
        }

        res.status(200).json({ message: "Confirmation de paiement supprimée avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de la confirmation de paiement :", error);
        res.status(500).json({ message: "Erreur serveur lors de la suppression de la confirmation de paiement." });
    }
};


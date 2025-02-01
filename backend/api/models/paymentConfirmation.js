const mongoose = require('mongoose');

// Schéma de confirmation de paiement
const paymentConfirmationSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: [true, 'L\'ID de la commande est requis'],
            validate: {
                validator: mongoose.Types.ObjectId.isValid,
                message: 'ID de commande invalide',
            },
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'L\'ID de l\'utilisateur est requis'],
            validate: {
                validator: mongoose.Types.ObjectId.isValid,
                message: 'ID d\'utilisateur invalide',
            },
        },
        transactionId: {
            type: String,
            required: [true, 'L\'ID de la transaction est requis'],
            unique: true, // Empêche les doublons de transaction
        },
        paymentMethod: {
            type: String,
            enum: {
                values: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'],
                message: 'Méthode de paiement invalide',
            },
            required: [true, 'La méthode de paiement est requise'],
        },
        paymentStatus: {
            type: String,
            enum: {
                values: ['Pending', 'Paid', 'Failed'],
                message: 'Statut de paiement invalide',
            },
            default: 'Pending',
        },
        amount: {
            type: Number,
            required: [true, 'Le montant est requis'],
            min: [0, 'Le montant doit être supérieur à zéro'],
        },
    },
    { timestamps: true }
);

const PaymentConfirmation = mongoose.model('PaymentConfirmation', paymentConfirmationSchema);

module.exports = PaymentConfirmation;

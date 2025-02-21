const mongoose = require('mongoose');

// Schéma de confirmation de paiement
const paymentConfirmationSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: false, // 🔹 Rendre orderId facultatif pour éviter les erreurs
            validate: {
                validator: function (value) {
                    return value ? mongoose.Types.ObjectId.isValid(value) : true; // Accepte null ou un ObjectId valide
                },
                message: '❌ ID de commande invalide',
            },
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, '❗ L\'ID de l\'utilisateur est requis'],
            validate: {
                validator: mongoose.Types.ObjectId.isValid,
                message: '❌ ID utilisateur invalide',
            },
        },
        transactionId: {
            type: String, // ✅ Garde transactionId comme une chaîne et empêche toute conversion en ObjectId
            required: [true, '❗ L\'ID de la transaction est requis'],
            unique: true, // ✅ Empêche les doublons de transaction
            index: true,  // ✅ Améliore la recherche dans la base de données
        },
        paymentMethod: {
            type: String,
            enum: {
                values: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'],
                message: '❌ Méthode de paiement invalide',
            },
            required: [true, '❗ La méthode de paiement est requise'],
        },
        paymentStatus: {
            type: String,
            enum: {
                values: ['Pending', 'Paid', 'Failed'],
                message: '❌ Statut de paiement invalide',
            },
            default: 'Pending',
        },
        amount: {
            type: Number,
            required: [true, '❗ Le montant est requis'],
            min: [0, '❌ Le montant doit être supérieur à zéro'],
        },
    },
    { timestamps: true }
);

// ✅ Vérification que transactionId reste bien une chaîne
paymentConfirmationSchema.pre('validate', function (next) {
    if (typeof this.transactionId !== 'string') {
        return next(new Error('❌ transactionId doit être une chaîne valide.'));
    }
    next();
});

const PaymentConfirmation = mongoose.model('PaymentConfirmation', paymentConfirmationSchema);

module.exports = PaymentConfirmation;
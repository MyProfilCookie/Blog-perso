const mongoose = require('mongoose');

// Schéma de confirmation de paiement
const paymentConfirmationSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed'],
            default: 'Pending',
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const PaymentConfirmation = mongoose.model('PaymentConfirmation', paymentConfirmationSchema);

module.exports = PaymentConfirmation;

// Import de mongoose
const mongoose = require('mongoose');

// Définition du schéma de commande
const orderSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    deliveryAddress: {
        street: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        postalCode: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            title: {
                type: String,
                required: true,
                trim: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    deliveryMethod: {
        type: String,
        required: true,
        enum: ["Mondial Relay", "Colissimo", "Chronopost"],
        default: "Mondial Relay",
    },
    deliveryCost: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    paymentMethod: {
        type: String,
        enum: ["card", "paypal", "bank_transfer"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    deliveryDate: {
        type: Date,
    },
    paymentConfirmation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentConfirmation", // Lien avec le modèle PaymentConfirmation
    },
}, { timestamps: true });

// Middleware : Calcul automatique du total avec livraison
orderSchema.pre("save", function (next) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + this.deliveryCost;
    next();
});

// Création du modèle
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;


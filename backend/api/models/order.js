const mongoose = require('mongoose');

// Définition du schéma de commande
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "L'ID utilisateur est obligatoire"],
        index: true
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: false, trim: true, default: "Non renseigné" },
    
    deliveryAddress: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
    },
    
    items: [
        {
            productId: { type: String, required: true, trim: true },
            title: { type: String, required: true, trim: true },
            quantity: { type: Number, required: true, default: 1, min: 1 },
            price: { type: Number, required: true, min: 0 },
        },
    ],
    
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryMethod: {
        type: String,
        required: true,
        enum: ["Mondial Relay", "Colissimo", "UPS", "DHL"],
    },
    deliveryCost: { type: Number, required: true, min: 0 },
    
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    
    statusHistory: [
        {
            status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], required: true },
            date: { type: Date, default: Date.now },
            notes: { type: String, default: '' },
            trackingNumber: { type: String, trim: true }, // Ajout du suivi colis dans l'historique
            read: { type: Boolean, default: false }, // NOUVEAU: Indique si cette mise à jour a été lue par l'utilisateur
            readDate: { type: Date } // NOUVEAU: Date à laquelle la mise à jour a été lue
        }
    ],
    
    paymentMethod: { type: String, enum: ["card", "paypal", "bank_transfer"], required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    
    orderDate: { type: Date, default: Date.now },
    shippingDate: { type: Date },
    deliveryDate: { type: Date },
    
    trackingNumber: { type: String, trim: true, default: '' }, // Numéro de suivi principal
    
    paymentId: { type: String, trim: true },
    transactionId: { type: String, trim: true }, // ID de transaction Stripe
    paymentConfirmation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentConfirmation",
    },
}, { timestamps: true });

// Middleware : Calcul automatique du total avec livraison
orderSchema.pre("save", function (next) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + this.deliveryCost;
    next();
});

// Middleware : Ajout du statut initial dans l'historique lors de la création
orderSchema.pre("save", function (next) {
    if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
        this.statusHistory = [{
            status: this.status,
            date: new Date(),
            notes: "Commande créée",
            trackingNumber: this.trackingNumber, // Ajout du trackingNumber initial si dispo
            read: false // Par défaut, non lu
        }];
    }
    next();
});

// Middleware : Ajout automatique du numéro de suivi lors de l'expédition et marquage comme non lu
orderSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status === "Shipped" && this.trackingNumber) {
        this.shippingDate = new Date();
        this.statusHistory.push({
            status: "Shipped",
            date: new Date(),
            notes: "Commande expédiée",
            trackingNumber: this.trackingNumber,
            read: false // Nouvelle mise à jour, non lue
        });
    }
    next();
});

// NOUVEAU: Middleware pour marquer comme non lu chaque fois qu'un statut est ajouté à l'historique
orderSchema.pre("updateOne", function (next) {
    // Vérifier si nous mettons à jour le statut
    const update = this.getUpdate();
    if (update && update.$push && update.$push.statusHistory) {
        // S'assurer que le nouveau statut est marqué comme non lu
        update.$push.statusHistory.read = false;
    }
    next();
});

// Ajout d'un index composé pour optimiser les recherches fréquentes
orderSchema.index({ userId: 1, orderDate: -1 });
// Ajouter un index pour les recherches d'historique de statut non lu
orderSchema.index({ 'statusHistory.read': 1, userId: 1 });

// Méthode statique pour compter les mises à jour non lues pour un utilisateur
orderSchema.statics.countUnreadUpdates = async function(userId) {
    const orders = await this.find({ userId });
    let count = 0;
    
    orders.forEach(order => {
        if (order.statusHistory && order.statusHistory.length > 0) {
            count += order.statusHistory.filter(history => !history.read).length;
        }
    });
    
    return count;
};

// Création du modèle
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
const Order = require("../models/order");
const PaymentConfirmation = require('../models/paymentConfirmation');
const Product = require("../models/products");


exports.checkout = async (req, res) => {
    try {
        const { orderId, paymentMethod, transactionId } = req.body;

        // 1. Trouver la commande
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        // 2. Vérifier si la commande a déjà été payée
        if (order.paymentStatus === "Completed") {
            return res.status(400).json({ message: "Commande déjà payée" });
        }

        // 3. Mettre à jour la commande
        order.paymentStatus = "Completed";
        order.status = "Processed";
        order.updatedAt = Date.now();

        // 4. Enregistrer la confirmation de paiement
        const paymentConfirmation = new PaymentConfirmation({
            orderId: order._id,
            userId: order.userId, // Assurez-vous que l'objet `Order` contient `userId`
            transactionId,
            paymentStatus: "Completed",
            amount: order.totalAmount,
            paymentMethod,
        });

        await paymentConfirmation.save();
        await order.save();

        res.status(200).json({
            message: "Paiement validé et confirmation enregistrée.",
            order,
            paymentConfirmation,
        });
    } catch (error) {
        console.error("Erreur lors de la validation du paiement :", error);
        res.status(500).json({ message: "Erreur serveur lors de la validation du paiement.", error });
    }
};

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  try {
    const { userId, ...orderData } = req.body;

    // Vérifier que l'ID utilisateur est fourni
    if (!userId) {
      return res.status(400).json({ 
        message: "L'ID utilisateur est requis pour créer une commande" 
      });
    }

    // Création de la commande avec l'userId explicitement spécifié
    const newOrder = new Order({
      ...orderData,
      userId: userId
    });

    // Sauvegarde de la commande
    const savedOrder = await newOrder.save();

    res.status(201).json({ 
      message: "Commande créée avec succès", 
      order: savedOrder 
    });
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    res.status(500).json({
      message: "Erreur lors de la création de la commande",
      error: error.message || error,
    });
  }
};

// Obtenir toutes les commandes
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ message: "Liste des commandes récupérée avec succès", orders });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes",
      error: error.message || error,
    });
  }
};

// Obtenir les commandes d'un utilisateur spécifique
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Log for debugging server-side
    console.log(`Fetching orders for user: ${userId}`);
    
    // Vérification de la validité de l'ID utilisateur
    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur requis" });
    }

    // Récupération des commandes de l'utilisateur
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance
    
    console.log(`Found ${orders.length} orders for user ${userId}`);
    
    // Enrichir les commandes avec les informations d'images des produits
    const enrichedOrders = await Promise.all(orders.map(async (order) => {
      // Vérifier si la commande a des items
      if (order.items && order.items.length > 0) {
        // Pour chaque item, récupérer l'information du produit correspondant
        const enrichedItems = await Promise.all(order.items.map(async (item) => {
          try {
            // Récupérer le produit à partir de l'ID
            const product = await Product.findById(item.productId).lean();
            
            // Si le produit existe, ajouter l'URL de l'image à l'item
            if (product) {
              return {
                ...item,
                image: product.image || product.imageUrl || product.img || product.photos?.[0] || null
              };
            }
            
            return item; // Retourner l'item inchangé si le produit n'est pas trouvé
          } catch (error) {
            console.error(`Erreur lors de la récupération du produit ${item.productId}:`, error);
            return item; // En cas d'erreur, retourner l'item inchangé
          }
        }));
        
        // Mettre à jour les items dans la commande
        order.items = enrichedItems;
      }
      
      return order;
    }));
    
    // Send response with enriched orders
    res.status(200).json({ 
      message: enrichedOrders.length ? "Commandes récupérées avec succès" : "Aucune commande trouvée", 
      orders: enrichedOrders
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes utilisateur:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes de l'utilisateur",
      error: error.message || error,
    });
  }
};

// Obtenir une commande spécifique par ID
exports.getOrderById = async (req, res) => {
  try {
      const order = await Order.findById(req.params.id).populate('paymentConfirmation');

      if (!order) {
          return res.status(404).json({ message: "Commande non trouvée" });
      }

      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération de la commande", error });
  }
};

// Mettre à jour une commande par ID
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(200).json({ message: "Commande mise à jour avec succès", order: updatedOrder });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la commande",
      error: error.message || error,
    });
  }
};

// Supprimer une commande par ID
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(200).json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la commande",
      error: error.message || error,
    });
  }
};

// Dans le contrôleur, modifier les constantes pour qu'elles correspondent
const VALID_ORDER_STATUSES = [
"Pending",     // Commande enregistrée dans le système
"Processing",  // Commande en cours de préparation
"Shipped",     // Commande expédiée
"Delivered",   // Commande livrée
"Cancelled"    // Commande annulée
];

// Et le mapping des statuts
const STATUS_MAPPING = {
"Enregistree": "Pending",
"Validee": "Processing",
"Preparation": "Processing",
"Expedition": "Shipped",
"Livree": "Delivered"
};
// Mettre à jour le statut d'une commande
exports.updateOrderStatus = async (req, res) => {
  try {
    // S'assurer que les modèles nécessaires sont importés
    const Order = require('../models/order');

    const { id } = req.params;
    let { status, notes } = req.body;

    // Ajouter des logs de débogage
    console.log(`Mise à jour du statut pour la commande ${id} : ${status}`);
    
    // Convertir du frontend vers le backend
    const STATUS_MAPPING = {
      "Enregistree": "Pending",
      "Validee": "Processing",
      "Preparation": "Processing",
      "Expedition": "Shipped",
      "Livree": "Delivered"
    };
    
    if (STATUS_MAPPING[status]) {
      console.log(`Conversion du statut ${status} vers ${STATUS_MAPPING[status]}`);
      status = STATUS_MAPPING[status];
    }

    // Vérifier si le statut est valide
    const VALID_ORDER_STATUSES = [
      "Pending",     // Commande enregistrée dans le système
      "Processing",  // Commande en cours de préparation
      "Shipped",     // Commande expédiée
      "Delivered",   // Commande livrée
      "Cancelled"    // Commande annulée
    ];
    
    if (!status || !VALID_ORDER_STATUSES.includes(status)) {
      console.log(`Statut invalide: ${status}`);
      return res.status(400).json({ 
        message: "Statut de commande invalide", 
        validStatuses: VALID_ORDER_STATUSES,
        providedStatus: status
      });
    }

    // Récupérer la commande
    const order = await Order.findById(id);
    
    if (!order) {
      console.log(`Commande non trouvée: ${id}`);
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    
    console.log(`Commande trouvée: ${order._id}, statut actuel: ${order.status}`);
    
    // ⚠️ SOLUTION - Utiliser updateOne au lieu de save pour éviter la validation complète
    const updateResult = await Order.updateOne(
      { _id: id },
      { 
        $set: { status: status },
        $push: { 
          statusHistory: {
            status: status,
            date: new Date(),
            notes: notes || ""
          }
        }
      }
    );
    
    console.log(`Résultat de la mise à jour:`, updateResult);
    
    // Mettre à jour les dates en fonction du statut
    if (status === "Shipped" || status === "Delivered") {
      const dateUpdate = {};
      
      if (status === "Shipped") {
        dateUpdate.shippingDate = new Date();
        console.log("Date d'expédition ajoutée");
      } else if (status === "Delivered") {
        dateUpdate.deliveryDate = new Date();
        console.log("Date de livraison ajoutée");
      }
      
      // Mise à jour distincte pour les dates
      if (Object.keys(dateUpdate).length > 0) {
        await Order.updateOne({ _id: id }, { $set: dateUpdate });
      }
    }
    
    // Récupérer la commande mise à jour
    const updatedOrder = await Order.findById(id);
    console.log(`Commande ${id} mise à jour avec succès, nouveau statut: ${status}`);

    res.status(200).json({ 
      message: "Statut de la commande mis à jour avec succès", 
      order: updatedOrder 
    });
  } catch (error) {
    console.error("Erreur détaillée lors de la mise à jour du statut de la commande:", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour du statut de la commande",
      error: error.message || error,
      stack: error.stack
    });
  }
};

// Récupérer l'historique des statuts d'une commande
exports.getOrderStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Récupération de l'historique pour la commande ${id}`);
    
    // Vérifier que l'ID est fourni
    if (!id) {
      return res.status(400).json({ message: "ID de commande requis" });
    }
    
    // Récupérer la commande
    const order = await Order.findById(id);
    
    if (!order) {
      console.log(`Commande non trouvée: ${id}`);
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    
    // Récupérer l'historique des statuts
    const statusHistory = order.statusHistory || [];
    
    console.log(`Historique récupéré pour la commande ${id}: ${statusHistory.length} entrées`);
    
    // Renvoyer l'historique des statuts
    res.status(200).json({
      success: true,
      statusHistory: statusHistory
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de l'historique des statuts",
      error: error.message || error
    });
  }
};

// Mise à jour de la fonction checkout pour gérer le nouveau système de statut
exports.checkout = async (req, res) => {
    try {
        const { orderId, paymentMethod, transactionId } = req.body;

        // 1. Trouver la commande
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        // 2. Vérifier si la commande a déjà été payée
        if (order.paymentStatus === "Paid") {
            return res.status(400).json({ message: "Commande déjà payée" });
        }

        // 3. Mettre à jour la commande
        order.paymentStatus = "Paid";
        order.status = "Validee"; // Utilisation du nouveau système de statut
        order.paymentId = transactionId;

        // 4. Enregistrer la confirmation de paiement
        const paymentConfirmation = new PaymentConfirmation({
            orderId: order._id,
            userId: order.userId,
            transactionId,
            paymentStatus: "Paid",
            amount: order.totalAmount,
            paymentMethod,
        });

        await paymentConfirmation.save();
        
        // Ajouter la référence à la confirmation de paiement
        order.paymentConfirmation = paymentConfirmation._id;
        await order.save();

        res.status(200).json({
            message: "Paiement validé et confirmation enregistrée.",
            order,
            paymentConfirmation,
        });
    } catch (error) {
        console.error("Erreur lors de la validation du paiement :", error);
        res.status(500).json({ message: "Erreur serveur lors de la validation du paiement.", error });
    }
};
// Ajouter ces nouvelles fonctions à votre fichier orderController.js

/**
 * Récupérer le nombre de mises à jour non lues pour un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getUnreadStatusUpdates = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Vérification de la validité de l'ID utilisateur
    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur requis" });
    }

    // Utilisation de la méthode statique pour compter les updates non lues
    const Order = require('../models/order');
    const count = await Order.countUnreadUpdates(userId);
    
    console.log(`Mises à jour non lues pour l'utilisateur ${userId}: ${count}`);
    
    // Renvoie le nombre de mises à jour non lues
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des mises à jour non lues:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des mises à jour non lues",
      error: error.message || error
    });
  }
};

/**
 * Marquer toutes les mises à jour comme lues pour un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.markStatusUpdatesAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const { orderId } = req.body; // Optionnel: pour marquer seulement les mises à jour d'une commande spécifique
    
    // Vérification de la validité de l'ID utilisateur
    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur requis" });
    }

    const Order = require('../models/order');
    let updateQuery = { userId };
    
    // Si un ID de commande est fourni, ne marquer que les mises à jour de cette commande
    if (orderId) {
      updateQuery._id = orderId;
    }
    
    const now = new Date();
    
    // Utiliser l'opérateur $[] pour mettre à jour tous les éléments du tableau
    // Ou filtrer avec $[element] pour ne mettre à jour que les éléments non lus
    const updateResult = await Order.updateMany(
      updateQuery,
      {
        $set: {
          "statusHistory.$[element].read": true,
          "statusHistory.$[element].readDate": now
        }
      },
      {
        arrayFilters: [{ "element.read": false }],
        multi: true
      }
    );
    
    console.log(`Mises à jour marquées comme lues pour l'utilisateur ${userId}:`, updateResult);
    
    res.status(200).json({
      success: true,
      message: "Mises à jour marquées comme lues",
      modifiedCount: updateResult.modifiedCount || 0
    });
  } catch (error) {
    console.error("Erreur lors du marquage des mises à jour comme lues:", error);
    res.status(500).json({
      message: "Erreur lors du marquage des mises à jour comme lues",
      error: error.message || error
    });
  }
};

// Modification de la fonction updateOrderStatus existante pour gérer le statut de lecture
exports.updateOrderStatus = async (req, res) => {
  try {
    // S'assurer que les modèles nécessaires sont importés
    const Order = require('../models/order');

    const { id } = req.params;
    let { status, notes } = req.body;

    // Ajouter des logs de débogage
    console.log(`Mise à jour du statut pour la commande ${id} : ${status}`);
    
    // Convertir du frontend vers le backend
    const STATUS_MAPPING = {
      "Enregistree": "Pending",
      "Validee": "Processing",
      "Preparation": "Processing",
      "Expedition": "Shipped",
      "Livree": "Delivered"
    };
    
    if (STATUS_MAPPING[status]) {
      console.log(`Conversion du statut ${status} vers ${STATUS_MAPPING[status]}`);
      status = STATUS_MAPPING[status];
    }

    // Vérifier si le statut est valide
    const VALID_ORDER_STATUSES = [
      "Pending",     // Commande enregistrée dans le système
      "Processing",  // Commande en cours de préparation
      "Shipped",     // Commande expédiée
      "Delivered",   // Commande livrée
      "Cancelled"    // Commande annulée
    ];
    
    if (!status || !VALID_ORDER_STATUSES.includes(status)) {
      console.log(`Statut invalide: ${status}`);
      return res.status(400).json({ 
        message: "Statut de commande invalide", 
        validStatuses: VALID_ORDER_STATUSES,
        providedStatus: status
      });
    }

    // Récupérer la commande
    const order = await Order.findById(id);
    
    if (!order) {
      console.log(`Commande non trouvée: ${id}`);
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    
    console.log(`Commande trouvée: ${order._id}, statut actuel: ${order.status}`);
    
    // ⚠️ Utiliser updateOne au lieu de save pour éviter la validation complète
    const updateResult = await Order.updateOne(
      { _id: id },
      { 
        $set: { status: status },
        $push: { 
          statusHistory: {
            status: status,
            date: new Date(),
            notes: notes || "",
            read: false // MODIFIÉ: Assurer que la nouvelle mise à jour est marquée comme non lue
          }
        }
      }
    );
    
    console.log(`Résultat de la mise à jour:`, updateResult);
    
    // Mettre à jour les dates en fonction du statut
    if (status === "Shipped" || status === "Delivered") {
      const dateUpdate = {};
      
      if (status === "Shipped") {
        dateUpdate.shippingDate = new Date();
        console.log("Date d'expédition ajoutée");
      } else if (status === "Delivered") {
        dateUpdate.deliveryDate = new Date();
        console.log("Date de livraison ajoutée");
      }
      
      // Mise à jour distincte pour les dates
      if (Object.keys(dateUpdate).length > 0) {
        await Order.updateOne({ _id: id }, { $set: dateUpdate });
      }
    }
    
    // Récupérer la commande mise à jour
    const updatedOrder = await Order.findById(id);
    console.log(`Commande ${id} mise à jour avec succès, nouveau statut: ${status}`);

    res.status(200).json({ 
      message: "Statut de la commande mis à jour avec succès", 
      order: updatedOrder 
    });
  } catch (error) {
    console.error("Erreur détaillée lors de la mise à jour du statut de la commande:", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour du statut de la commande",
      error: error.message || error,
      stack: error.stack
    });
  }
};

// Modification de la fonction getOrderStatusHistory pour gérer le marquage comme lu
exports.getOrderStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { markAsRead } = req.query; // Paramètre optionnel pour marquer comme lu
    
    console.log(`Récupération de l'historique pour la commande ${id}`);
    
    // Vérifier que l'ID est fourni
    if (!id) {
      return res.status(400).json({ message: "ID de commande requis" });
    }
    
    // Récupérer la commande
    const Order = require('../models/order');
    const order = await Order.findById(id);
    
    if (!order) {
      console.log(`Commande non trouvée: ${id}`);
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    
    // Récupérer l'historique des statuts
    const statusHistory = order.statusHistory || [];
    
    console.log(`Historique récupéré pour la commande ${id}: ${statusHistory.length} entrées`);
    
    // Si markAsRead est vrai, marquer toutes les entrées d'historique comme lues
    if (markAsRead === 'true') {
      const now = new Date();
      let updated = false;
      
      for (let i = 0; i < statusHistory.length; i++) {
        if (!statusHistory[i].read) {
          statusHistory[i].read = true;
          statusHistory[i].readDate = now;
          updated = true;
        }
      }
      
      if (updated) {
        await order.save();
        console.log(`Historique de statuts marqué comme lu pour la commande ${id}`);
      }
    }
    
    // Renvoyer l'historique des statuts
    res.status(200).json({
      success: true,
      statusHistory: statusHistory
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de l'historique des statuts",
      error: error.message || error
    });
  }
};

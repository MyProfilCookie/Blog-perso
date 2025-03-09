const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Créer une nouvelle commande
router.post("/", orderController.createOrder);

// Obtenir toutes les commandes
router.get("/", orderController.getAllOrders);

// Route spécifique pour mettre à jour le statut d'une commande
router.put("/:id/status", orderController.updateOrderStatus);

// Obtenir une commande spécifique par ID
router.get("/:id", orderController.getOrderById);

// Mettre à jour une commande par ID
router.put("/:id", orderController.updateOrder);

// Supprimer une commande par ID
router.delete("/:id", orderController.deleteOrder);

// Checkout
router.post("/checkout", orderController.checkout);

// Route pour obtenir les commandes d'un utilisateur spécifique
router.get('/user/:userId', orderController.getUserOrders);

// Route pour obtenir l'historique des statuts d'une commande
router.get('/:id/status-history', orderController.getOrderStatusHistory);

// NOUVELLE ROUTE: Récupérer le nombre de mises à jour non lues pour un utilisateur
router.get('/users/:userId/orders/status-history', orderController.getUnreadStatusUpdates);

// NOUVELLE ROUTE: Marquer les mises à jour comme lues pour un utilisateur
router.put('/users/:userId/orders/status-history/read', orderController.markStatusUpdatesAsRead);

module.exports = router;

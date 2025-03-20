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

// Route pour obtenir les commandes d'un utilisateur (compatible avec le frontend)
router.get('/users/:userId/orders', orderController.getUserOrders);

// Route pour obtenir les compteurs de commandes (en attente, expédiées, total)
router.get('/users/:userId/order-counts', orderController.getUserOrderCounts);

// Route pour récupérer le nombre de mises à jour non lues pour un utilisateur
router.get('/users/:userId/orders/status-updates', orderController.getUnreadStatusUpdates);

// Route pour obtenir les compteurs de commandes (en attente, expédiées, total)
router.get('/users/:userId/order-counts', orderController.getUserOrderCounts);

// Route pour marquer les mises à jour comme lues
router.post('/users/:userId/orders/updates/read', orderController.markOrderUpdatesAsRead);

module.exports = router;

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Créer une nouvelle commande
router.post("/", orderController.createOrder);

// Obtenir toutes les commandes
router.get("/", orderController.getAllOrders);

// Obtenir une commande spécifique par ID
router.get("/:id", orderController.getOrderById);

// Mettre à jour une commande par ID
router.put("/:id", orderController.updateOrder);

// Supprimer une commande par ID
router.delete("/:id", orderController.deleteOrder);

module.exports = router;

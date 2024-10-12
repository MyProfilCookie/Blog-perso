const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

// Route pour récupérer tous les produits
router.get("/", productsController.getAllProducts);

// Route pour récupérer un produit par ID
router.get("/:id", productsController.getProductById);

// Route pour créer un produit
router.post("/", productsController.createProduct);

// Route pour mettre à jour un produit
router.put("/:id", productsController.updateProduct);

// Route pour supprimer un produit
router.delete("/:id", productsController.deleteProduct);

module.exports = router;

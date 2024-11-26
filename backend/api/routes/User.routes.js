const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { extractUserIdFromToken } = require('../middlewares/authMiddleware');
const { signup, login, getUsers, deleteUser, makeAdmin, updateUser, getCurrentUser, getUserById } = require("../controllers/UserControllers"); // Importer les contrôleurs

// Route pour l'inscription d'un utilisateur
router.post("/signup", signup);

// Route pour la connexion d'un utilisateur
router.post("/login", login);

// Route pour recuperer tous les utilisateurs
router.get("/", getUsers);

// Route pour supprimer un utilisateur
router.delete("/:id", deleteUser);

// Route pour mettre à jour les informations d'un utilisateur
router.put("/:id", updateUser);

// Route pour obtenir les informations d'un utilisateur
router.get("/:id", getUserById);

// Route pour promouvoir un utilisateur en administrateur
router.post('/promote/:userId', makeAdmin);

// // Route pour obtenir les informations de l'utilisateur actuellement connecté
// router.get("/me", authMiddleware, getCurrentUser);

// Route pour obtenir les informations d'un utilisateur par son ID
router.get("/me", extractUserIdFromToken, getUserById);

module.exports = router;


const express = require("express");
const router = express.Router();
const { signup, login, getUsers, deleteUser, makeAdmin } = require("../controllers/UserControllers"); // Importer les contrôleurs

// Route pour l'inscription d'un utilisateur
router.post("/signup", signup);

// Route pour la connexion d'un utilisateur
router.post("/login", login);

// Route pour recuperer tous les utilisateurs
router.get("/", getUsers);

// Route pour supprimer un utilisateur
router.delete("/:id", deleteUser);

router.post('/promote/:userId', makeAdmin);


module.exports = router;


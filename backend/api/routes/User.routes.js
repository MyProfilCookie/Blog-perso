const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const UserController = require("../controllers/UserControllers");

console.log("📌 User.routes.js chargé");
console.log("🔍 Contrôleurs disponibles:", Object.keys(UserController));

// Attention à l'ordre des routes - les routes spécifiques doivent être placées avant les routes génériques
// Sinon, les routes comme /me pourraient être interprétées comme /:id

// Route pour obtenir les informations de l'utilisateur actuellement connecté
// Cette route doit être AVANT la route "/:id"
router.get("/me", authMiddleware, UserController.getCurrentUser);

// Route pour l'inscription d'un utilisateur
router.post("/signup", UserController.signup);

// Route pour la connexion d'un utilisateur
router.post("/login", UserController.login);

// Route pour récupérer tous les utilisateurs
router.get("/", UserController.getUsers);

// Route pour promouvoir un utilisateur en administrateur
router.post('/promote/:userId', UserController.makeAdmin);

// Route pour supprimer un utilisateur
router.delete("/:id", UserController.deleteUser);

// Route pour mettre à jour les informations d'un utilisateur
router.put("/:id", UserController.updateUser);

// Route pour obtenir les informations d'un utilisateur par son ID
// Cette route doit être APRÈS /me pour éviter les conflits
router.get("/:id", UserController.getUserById);

module.exports = router;


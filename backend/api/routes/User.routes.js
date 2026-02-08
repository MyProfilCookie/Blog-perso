const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const UserController = require("../controllers/UserControllers");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "..", "uploads", "avatars");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${req.params.id}-${Date.now()}${ext}`);
  },
});

const avatarFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Le fichier doit être une image."));
  }
  cb(null, true);
};

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

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

// Route pour la connexion via Google
router.post("/google-login", UserController.googleLogin);

// Route pour demander la réinitialisation du mot de passe
router.post("/forgot-password", UserController.forgotPassword);

// Route pour réinitialiser le mot de passe avec le token
router.post("/reset-password", UserController.resetPassword);

// Route pour récupérer tous les utilisateurs
router.get("/", UserController.getUsers);

// Route pour promouvoir un utilisateur en administrateur
router.post('/promote/:userId', authMiddleware, isAdmin, UserController.makeAdmin);

// Route pour supprimer un utilisateur
router.delete("/:id", authMiddleware, isAdmin, UserController.deleteUser);

// Route pour mettre à jour l'avatar
router.post(
  "/:id/avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  UserController.uploadAvatar,
);

// Route pour mettre à jour les informations d'un utilisateur
router.put("/:id", UserController.updateUser);

// Route pour obtenir les informations d'un utilisateur par son ID
// Cette route doit être APRÈS /me pour éviter les conflits
router.get("/:id", UserController.getUserById);

module.exports = router;

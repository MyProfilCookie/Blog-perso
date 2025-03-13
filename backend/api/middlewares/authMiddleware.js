const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

/**
 * Middleware pour vérifier l'authentification et attacher l'utilisateur à la requête
 */
exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("🚨 Aucun token trouvé !");
    return res.status(401).json({ message: "Accès refusé, token manquant." });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("🔍 Vérification du token...");
    console.log("JWT_SECRET disponible:", !!process.env.JWT_SECRET);
    console.log("Token brut reçu:", token);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé:", decoded);
    
    if (!decoded || !decoded.id) {
      console.log("🚨 ID manquant dans le token !");
      return res.status(401).json({ message: "Token invalide, ID utilisateur absent." });
    }

    console.log("🔍 ID extrait du token:", decoded.id);
    console.log("Type de l'ID:", typeof decoded.id);

    // Recherche de l'utilisateur sans validation stricte de l'ID
    const user = await User.findById(decoded.id).catch(err => {
      console.log("❌ Erreur lors de la recherche de l'utilisateur:", err.message);
      return null;
    });
    
    if (!user) {
      console.log("❌ Utilisateur non trouvé pour l'ID:", decoded.id);
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }
    
    // Convertir en objet JavaScript et s'assurer que l'ID est accessible
    const userObj = user.toObject();
    userObj.id = user._id.toString();
    
    req.user = userObj;
    console.log("✅ Utilisateur attaché à la requête:", req.user.pseudo);
    next();
  } catch (error) {
    console.log("🚨 Erreur de vérification du token:", error.message);
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est administrateur
 */
exports.isAdmin = async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    // Vérifier si l'utilisateur est administrateur
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Accès refusé, vous devez être administrateur." });
    }
    
    next();
  } catch (error) {
    console.log("🚨 Erreur dans le middleware isAdmin:", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
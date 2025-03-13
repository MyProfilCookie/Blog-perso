const jwt = require("jsonwebtoken");

// Générer un Access Token (valide 15 minutes)
const generateAccessToken = (userId) => {
  console.log("🔑 Génération Access Token pour l'ID :", userId);
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// Générer un Refresh Token (valide 7 jours)
const generateRefreshToken = (userId) => {
  console.log("🔑 Génération Refresh Token pour l'ID :", userId);
  return jwt.sign({ id: userId.toString() }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

module.exports = { generateAccessToken, generateRefreshToken };
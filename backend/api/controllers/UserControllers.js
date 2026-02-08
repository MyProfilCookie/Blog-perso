const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

/**
 * Génère un access token (valide 15 minutes)
 * @param {string|Object} userId - L'ID de l'utilisateur
 * @returns {string} - Access token JWT
 */
const generateAccessToken = (userId) => {
  // S'assurer que l'ID est une chaîne
  const id = userId.toString();
  console.log("🔑 Génération Access Token pour l'ID:", id);
  
  // Vérification de la présence de JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error("⚠️ ATTENTION: JWT_SECRET n'est pas défini!");
  }
  
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" }); // Durée augmentée pour éviter les problèmes de session
};

/**
 * Génère un refresh token (valide 7 jours)
 * @param {string|Object} userId - L'ID de l'utilisateur
 * @returns {string} - Refresh token JWT
 */
const generateRefreshToken = (userId) => {
  // S'assurer que l'ID est une chaîne
  const id = userId.toString();
  console.log("🔑 Génération Refresh Token pour l'ID:", id);
  
  // Vérification de la présence de JWT_REFRESH_SECRET
  if (!process.env.JWT_REFRESH_SECRET) {
    console.error("⚠️ ATTENTION: JWT_REFRESH_SECRET n'est pas défini!");
    return jwt.sign({ id }, process.env.JWT_SECRET || "refresh_fallback_secret", { expiresIn: "7d" });
  }
  
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

/**
 * Inscription d'un nouvel utilisateur
 */
exports.signup = async (req, res) => {
  try {
    console.log("📝 Tentative d'inscription avec:", req.body.email);
    const { pseudo, nom, prenom, age, email, password, phone, deliveryAddress } = req.body;

    // Vérification des champs obligatoires
    if (!pseudo || !nom || !prenom || !age || !email || !password) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    // Vérifier si l'email existe déjà
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Vérifier si le pseudo existe déjà
    const pseudoExists = await User.findOne({ pseudo });
    if (pseudoExists) {
      return res.status(400).json({ message: "Ce pseudo est déjà utilisé." });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔒 Mot de passe hashé généré");

    // Création du nouvel utilisateur
    const newUser = new User({
      pseudo,
      nom,
      prenom,
      age,
      email,
      password: hashedPassword,
      phone,
      deliveryAddress
    });

    // Définir isAdmin si c'est un email administrateur
    const ADMIN_EMAILS = ["virginie.ayivor@yahoo.fr", "maevaayivor78500@gmail.com"];
    if (ADMIN_EMAILS.includes(email)) {
      newUser.role = "admin";
      newUser.isAdmin = true;
    }

    // Enregistrement de l'utilisateur
    const savedUser = await newUser.save();
    console.log("✅ Nouvel utilisateur créé:", savedUser._id);
    
    // Génération des tokens
    const accessToken = generateAccessToken(savedUser._id);
    const refreshToken = generateRefreshToken(savedUser._id);

    // Retourner la réponse sans le mot de passe
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Inscription réussie!",
      user: userResponse,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription:", error);
    
    // Erreurs de validation Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
};

/**
 * Connexion d'un utilisateur
 */
exports.login = async (req, res) => {
  try {
    console.log("🔑 Tentative de connexion avec:", req.body.email);
    const { email, password } = req.body;

    // Vérification des champs obligatoires
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }
    
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ Utilisateur non trouvé pour l'email:", email);
      return res.status(404).json({ message: "Email ou mot de passe incorrect" });
    }

    console.log("✅ Utilisateur trouvé:", user.pseudo, "ID:", user._id);
    console.log("💿 Hash stocké en BDD:", user.password);
    console.log("🔑 Mot de passe fourni (longueur):", password?.length || 0);
    
    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("🔒 Résultat de la comparaison de mot de passe:", isPasswordValid);
    
    if (!isPasswordValid) {
      console.log("❌ Mot de passe incorrect pour l'email:", email);
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    console.log("✅ Connexion réussie pour l'utilisateur:", user.pseudo);
    
    // Génération des tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    // Log du token généré pour débogage
    console.log("🔑 Token généré (premiers caractères):", accessToken.substring(0, 15) + "...");

    // Préparer la réponse utilisateur sans le mot de passe
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Connexion réussie!",
      user: userResponse,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
};

/**
 * Connexion via Google OAuth
 */
exports.googleLogin = async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(500).json({ message: "Google OAuth n'est pas configuré côté serveur." });
    }

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Token Google manquant." });
    }

    const ticket = await googleClient
      .verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID })
      .catch((error) => {
        console.error("❌ Erreur de vérification Google:", error);
        return null;
      });

    if (!ticket) {
      return res.status(401).json({ message: "Token Google invalide." });
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Impossible de récupérer votre email Google." });
    }

    if (payload.email_verified === false) {
      return res.status(400).json({ message: "Veuillez vérifier votre adresse email Google avant de continuer." });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
      const baseName = (payload.given_name || payload.name || "autistudy")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase() || "autistudy";

      let pseudo = baseName.length >= 8 ? baseName : `${baseName}${Math.random().toString(36).slice(2, 10)}`;
      pseudo = pseudo.slice(0, 20);

      let uniquePseudo = pseudo;
      let attempt = 0;
      // Garantir l'unicité du pseudo
      while (await User.findOne({ pseudo: uniquePseudo })) {
        attempt += 1;
        uniquePseudo = `${pseudo}${Math.floor(Math.random() * 1000)}`;
        if (attempt > 10) {
          uniquePseudo = `${baseName}${Date.now()}`;
        }
      }

      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        pseudo: uniquePseudo.slice(0, 30),
        nom: payload.family_name || payload.name || "Utilisateur",
        prenom: payload.given_name || payload.name || "Google",
        age: 18,
        email,
        password: hashedPassword,
        phone: "",
        deliveryAddress: {},
        image: payload.picture || "/assets/default-avatar.webp",
      });

      const ADMIN_EMAILS = ["virginie.ayivor@yahoo.fr", "maevaayivor78500@gmail.com"];
      if (ADMIN_EMAILS.includes(email)) {
        user.role = "admin";
        user.isAdmin = true;
      }

      await user.save();
    } else if (payload.picture && user.image !== payload.picture) {
      user.image = payload.picture;
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Connexion Google réussie",
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion Google:", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion Google" });
  }
};

/**
 * Récupération de tous les utilisateurs
 */
exports.getUsers = async (req, res) => {
  try {
    console.log("📋 Récupération de tous les utilisateurs");
    const users = await User.find().select("-password");
    console.log(`✅ ${users.length} utilisateurs trouvés`);
    
    res.status(200).json({ users });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Suppression d'un utilisateur
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Tentative de suppression de l'utilisateur:", id);
    
    const deletedUser = await User.findByIdAndDelete(id).catch(err => {
      console.log("❌ Erreur lors de la suppression:", err.message);
      return null;
    });
    
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    console.log("✅ Utilisateur supprimé:", deletedUser.pseudo);
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Promotion d'un utilisateur en administrateur
 */
exports.makeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("👑 Tentative de promotion en admin pour l'utilisateur:", userId);
    
    const user = await User.findById(userId).catch(err => {
      console.log("❌ Erreur lors de la recherche:", err.message);
      return null;
    });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    user.role = "admin";
    user.isAdmin = true;
    await user.save();
    
    console.log("✅ Utilisateur promu admin:", user.pseudo);
    res.status(200).json({ 
      message: "L'utilisateur a été promu administrateur avec succès.",
      user: {
        id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("❌ Erreur lors de la promotion de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Mise à jour des informations d'un utilisateur
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log("📝 Mise à jour de l'utilisateur:", id);
    
    // Si le mot de passe doit être mis à jour, le hasher
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
      console.log("🔒 Nouveau mot de passe hashé");
    }
    
    // Mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password").catch(err => {
      console.log("❌ Erreur lors de la mise à jour:", err.message);
      return null;
    });
    
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    console.log("✅ Utilisateur mis à jour:", updatedUser.pseudo);
    res.status(200).json({
      message: "Profil mis à jour avec succès!",
      user: updatedUser
    });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du profil:", error);
    
    // Erreurs de validation Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du profil" });
  }
};

/**
 * Upload / mise à jour de l'avatar utilisateur via Cloudinary
 */
exports.uploadAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUser = req.user;

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni." });
    }

    if (
      requestingUser &&
      requestingUser.id &&
      requestingUser.id.toString() !== id.toString() &&
      !requestingUser.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "Vous n'êtes pas autorisé à modifier cet avatar." });
    }

    const user = await User.findById(id);
    if (!user) {
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    let publicUrl;
    let cloudinaryPublicId = null;

    // Vérifier si Cloudinary est configuré (via CLOUDINARY_URL ou variables séparées)
    const isCloudinaryConfigured = process.env.CLOUDINARY_URL || 
                                    (process.env.CLOUDINARY_CLOUD_NAME && 
                                     process.env.CLOUDINARY_API_KEY && 
                                     process.env.CLOUDINARY_API_SECRET);

    if (isCloudinaryConfigured) {
      // Utiliser Cloudinary pour le stockage permanent
      const { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } = require('../../config/cloudinary');
      
      console.log("☁️ Upload vers Cloudinary...");
      
      try {
        // Upload vers Cloudinary
        const result = await uploadToCloudinary(req.file.path, {
          public_id: `avatar_${id}_${Date.now()}`,
          folder: 'avatars'
        });
        
        publicUrl = result.secure_url;
        cloudinaryPublicId = result.public_id;
        
        console.log("✅ Upload Cloudinary réussi:", publicUrl);
        
        // Supprimer l'ancienne image de Cloudinary si elle existe
        if (user.image && user.image.includes('cloudinary.com')) {
          const oldPublicId = extractPublicIdFromUrl(user.image);
          if (oldPublicId) {
            console.log("🗑️ Suppression ancienne image Cloudinary:", oldPublicId);
            await deleteFromCloudinary(oldPublicId).catch(err => {
              console.warn("⚠️ Erreur suppression ancienne image:", err.message);
            });
          }
        }
        
        // Supprimer le fichier temporaire local
        fs.unlink(req.file.path, () => {});
        
      } catch (cloudinaryError) {
        console.error("❌ Erreur Cloudinary:", cloudinaryError);
        fs.unlink(req.file.path, () => {});
        return res.status(500).json({ 
          message: "Erreur lors de l'upload de l'image. Veuillez réessayer." 
        });
      }
    } else {
      // Fallback: stockage local (pour développement local)
      console.log("⚠️ Cloudinary non configuré, utilisation du stockage local");
      
      const uploadRelativePath = path
        .join("uploads", "avatars", req.file.filename)
        .replace(/\\/g, "/");
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      publicUrl = `${baseUrl}/${uploadRelativePath}`;
      
      // Nettoyage de l'ancienne image locale
      const previousImage = user.image;
      if (
        previousImage &&
        !previousImage.startsWith("data:") &&
        !previousImage.includes("/assets/") &&
        !previousImage.includes("cloudinary.com")
      ) {
        let relativeOldPath = previousImage;
        try {
          if (previousImage.startsWith("http")) {
            const previousUrl = new URL(previousImage);
            relativeOldPath = previousUrl.pathname;
          }
        } catch (error) {
          relativeOldPath = previousImage;
        }

        relativeOldPath = relativeOldPath.replace(/^\//, "");

        if (relativeOldPath.startsWith("uploads/avatars")) {
          const oldPath = path.join(__dirname, "..", "..", relativeOldPath);
          fs.unlink(oldPath, () => {});
        }
      }
    }

    // Sauvegarder l'URL dans la base de données
    user.image = publicUrl;
    if (cloudinaryPublicId) {
      user.cloudinaryPublicId = cloudinaryPublicId; // Optionnel: pour référence future
    }
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Photo de profil mise à jour avec succès !",
      image: publicUrl,
      user: userResponse,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'upload avatar:", error);
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour de l'avatar." });
  }
};

/**
 * Récupération des informations de l'utilisateur actuel
 */
exports.getCurrentUser = async (req, res) => {
  try {
    console.log("🔍 Tentative de récupération de l'utilisateur actuel");
    
    if (!req.user) {
      console.log("🚨 Accès refusé: req.user est absent");
      return res.status(401).json({ message: "Non autorisé." });
    }
    
    const userId = req.user._id || req.user.id;
    console.log("🔍 ID utilisateur:", userId);
    
    const user = await User.findById(userId).select("-password").catch(err => {
      console.log("❌ Erreur lors de la recherche:", err.message);
      return null;
    });
    
    if (!user) {
      console.log("❌ Utilisateur non trouvé pour l'ID:", userId);
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    console.log("✅ Utilisateur trouvé:", user.pseudo);
    res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Récupération des informations d'un utilisateur par son ID
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Récupération de l'utilisateur par ID:", id);
    
    const user = await User.findById(id).select("-password").catch(err => {
      console.log("❌ Erreur lors de la recherche:", err.message);
      return null;
    });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    console.log("✅ Utilisateur trouvé:", user.pseudo);
    res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Rafraîchissement du token d'accès
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token requis" });
    }
    
    console.log("🔄 Tentative de rafraîchissement du token");
    
    // Vérification du refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
    
    if (!decoded.id) {
      console.log("❌ ID manquant dans le refresh token");
      return res.status(401).json({ message: "Token invalide" });
    }
    
    console.log("✅ Refresh token valide pour l'ID:", decoded.id);
    
    // Vérifier que l'utilisateur existe toujours
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("❌ Utilisateur non trouvé pour l'ID:", decoded.id);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    // Génération d'un nouveau access token
    const newAccessToken = generateAccessToken(decoded.id);
    console.log("✅ Nouveau token généré");
    
    res.status(200).json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error("❌ Erreur lors du rafraîchissement du token:", error);
    
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }
    
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Demande de réinitialisation du mot de passe
 * @route POST /users/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
    if (!user) {
      console.log("🔍 Tentative de reset pour email inexistant:", email);
      return res.status(200).json({ 
        message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation." 
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Sauvegarder le token hashé et sa date d'expiration (1 heure)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    // Construire l'URL de réinitialisation
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Envoyer l'email (si nodemailer est configuré)
    try {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@autistudy.fr',
        to: email,
        subject: '🔐 Réinitialisation de votre mot de passe - AutiStudy',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3b82f6;">Réinitialisation de votre mot de passe</h2>
            <p>Bonjour ${user.prenom || user.pseudo || 'cher utilisateur'},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe sur AutiStudy.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
              Réinitialiser mon mot de passe
            </a>
            <p style="color: #666; font-size: 14px;">Ce lien expirera dans 1 heure.</p>
            <p style="color: #666; font-size: 14px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">AutiStudy - Apprentissage adapté pour enfants autistes</p>
          </div>
        `
      });

      console.log("📧 Email de réinitialisation envoyé à:", email);
    } catch (emailError) {
      console.error("⚠️ Erreur envoi email:", emailError.message);
      // On continue quand même - l'email peut ne pas être configuré en dev
    }

    res.status(200).json({ 
      message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation." 
    });

  } catch (error) {
    console.error("❌ Erreur forgot-password:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Réinitialisation du mot de passe avec le token
 * @route POST /users/reset-password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ message: "Token, email et nouveau mot de passe requis" });
    }

    // Valider le nouveau mot de passe
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)" });
    }

    // Hasher le token reçu pour le comparer
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Chercher l'utilisateur avec ce token et vérifier l'expiration
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Lien de réinitialisation invalide ou expiré. Veuillez refaire une demande." 
      });
    }

    // Mettre à jour le mot de passe
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("✅ Mot de passe réinitialisé pour:", email);

    res.status(200).json({ 
      message: "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter." 
    });

  } catch (error) {
    console.error("❌ Erreur reset-password:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Exportation correcte des fonctions
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  signup: exports.signup,
  login: exports.login, 
  googleLogin: exports.googleLogin,
  getUsers: exports.getUsers,
  deleteUser: exports.deleteUser,
  makeAdmin: exports.makeAdmin,
  updateUser: exports.updateUser,
  uploadAvatar: exports.uploadAvatar,
  getCurrentUser: exports.getCurrentUser,
  getUserById: exports.getUserById,
  refreshToken: exports.refreshToken,
  forgotPassword: exports.forgotPassword,
  resetPassword: exports.resetPassword
};

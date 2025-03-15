const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const compression = require("compression");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Stripe

// ✅ Importation des routes
const userRoutes = require("./api/routes/User.routes");
const paymentRoutes = require("./api/routes/payment.routes");
const orderRoutes = require("./api/routes/order.routes");
const productRoutes = require("./api/routes/products.routes");
const Payment = require("./api/models/payments"); // Modèle de paiement
// 🔍 Vérification des variables d'environnement
console.log("🔍 Chargement des variables d'environnement...");
console.log("✅ JWT_SECRET:", process.env.JWT_SECRET ? "Chargé ✅" : "❌ Manquant");
console.log("✅ STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "Chargé ✅" : "❌ Manquant");
console.log("✅ DB:", process.env.DB ? "Chargé ✅" : "❌ Manquant");

// 🔗 Connexion à MongoDB
mongoose
  .connect(process.env.DB)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB:", err));


// ✅ Activer express.raw() AVANT express.json() pour Stripe Webhooks
app.post('/api/payments/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log("🔔 Webhook Stripe reçu !");
  
  const sig = req.headers['stripe-signature']; // Récupération de la signature
  let event;

  try {
      // ✅ Vérification de l'authenticité de la requête Stripe
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      console.log(`✅ Webhook validé avec succès : ${event.type}`);
  } catch (err) {
      console.error("❌ Erreur Webhook Stripe :", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const paymentIntent = event.data.object;

  console.log("🔍 ID du paiement :", paymentIntent.id);
  console.log("💰 Montant reçu :", paymentIntent.amount_received);
  console.log("💳 Devise :", paymentIntent.currency);
  console.log("📧 Email reçu :", paymentIntent.receipt_email);

  try {
      const newPayment = new Payment({
          stripePaymentId: paymentIntent.id,
          amount: paymentIntent.amount_received / 100,
          status: "Paid",
          currency: paymentIntent.currency,
          email: paymentIntent.receipt_email || "N/A"
      });

      await newPayment.save();  // Sauvegarde en base

      console.log("✅ Paiement enregistré en base :", JSON.stringify(newPayment, null, 2));
      res.status(200).json({ received: true });
  } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde en base :", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 🔧 Puis activer express.json() pour le reste de l'API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());

// 🔧 Configuration CORS
const allowedOrigins = [
  'https://autistudy.vercel.app',
  'https://autistudy-48mon62zt-myprofilcookies-projects.vercel.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("🚨 Origine non autorisée:", origin);
      callback(new Error("Accès refusé par CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


// ✅ Middleware de journalisation des requêtes
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// 📌 Déclaration des routes
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// ❌ Gestion des erreurs 404
app.use((req, res, next) => res.status(404).json({ message: "Ressource non trouvée" }));

// ⚠ Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("⚠️ Erreur globale :", err);
  res.status(err.status || 500).json({ error: { message: err.message } });
});

// 🚀 Lancement du serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Serveur en écoute sur le port ${PORT}`));
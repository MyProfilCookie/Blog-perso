// const express = require("express");
// const app = express();
// require("dotenv").config();
// const port = process.env.PORT || 3001;
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const compression = require("compression");
// const path = require("path");
// const bodyParser = require("body-parser");
// const { connect } = require("mongoose");
// const cookieParser = require("cookie-parser");
// const createError = require("http-errors");
// const bcrypt = require("bcrypt");
// const User = require("./api/models/User"); // Modèle utilisateur
// const userRoutes = require("./api/routes/User.routes"); // Routes utilisateur
// const monthlyCourseRoutes = require("./api/routes/monthly_courses.routes"); // Routes cours
// const messageRoutes = require("./api/routes/message.routes"); // Routes messages
// const lessonsRoutes = require("./api/routes/lessons.routes"); // Routes leçons
// const articleRoutes = require("./api/routes/article.routes"); // Routes articles
// const productRoutes = require("./api/routes/products.routes"); // Routes produits
// const paymentRoutes = require("./api/routes/payment.routes"); // Routes paiement
// const orderRoutes = require("./api/routes/order.routes"); // Routes commandes
// const paymentConfirmationRoutes = require("./api/routes/paymentConfirmation.routes"); // Routes 
// //confirmations de paiement
// const contactRoutes = require("./api/routes/contact.routes"); // Routes contact
// // confirmation de blog 
// const blogRoutes = require("./api/routes/blog.routes"); // Routes blog
// // Connexion à la base de données
// connect(process.env.DB)
//   .then(() => {
//     console.log("Connexion à la base réussie");
//   })
//   .catch((err) => {
//     console.error("Erreur de connexion à la base de données :", err.message);
//     process.exit(1);
//   });

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(compression());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );

// // Fonction pour générer des tokens
// const generateAccessToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
// };

// const generateRefreshToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
// };

// // Route pour se connecter et obtenir les tokens
// app.post("/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Mot de passe incorrect" });
//     }

//     const accessToken = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);

//     // Stocker le refresh token dans un cookie sécurisé
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "Strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
//     });

//     res.json({ accessToken });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Route pour renouveler l'access token
// app.post("/auth/refresh-token", (req, res) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({ message: "Refresh token manquant" });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const newAccessToken = generateAccessToken(decoded.id);

//     res.json({ accessToken: newAccessToken });
//   } catch (error) {
//     res.status(403).json({ message: "Refresh token invalide ou expiré" });
//   }
// });

// // Route pour se déconnecter et supprimer le refresh token
// app.post("/auth/logout", (req, res) => {
//   res.clearCookie("refreshToken");
//   res.status(200).json({ message: "Déconnexion réussie" });
// });

// // Middleware pour valider l'access token
// const authenticateToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ message: "Token manquant" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (error) {
//     res.status(403).json({ message: "Token invalide ou expiré" });
//   }
// };

// // Route pour récupérer le profil utilisateur
// app.get("/users/me", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     }
//     res.json({ user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Utiliser les routes utilisateur
// app.use("/users", userRoutes);
// app.use("/courses", monthlyCourseRoutes);
// app.use("/messages", messageRoutes);
// app.use("/lessons", lessonsRoutes);
// app.use("/articles", articleRoutes);
// app.use("/products", productRoutes);
// app.use("/payments", paymentRoutes);
// app.use("/orders", orderRoutes);
// app.use("/payment-confirmations", paymentConfirmationRoutes);
// app.use("/contact", contactRoutes);
// app.use("/blog", blogRoutes);

// // Gestion des erreurs 404
// app.use((req, res, next) => {
//   const error = createError(404, "Ressource non trouvée");
//   next(error);
// });

// // Gestion des erreurs globales
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.json({
//     error: {
//       message: err.message,
//     },
//   });
// });

// // Démarrer le serveur
// app.listen(port, () => {
//   console.log(`Application en écoute sur le port ${port}`);
// });


const express = require("express");
const app = express();
require("dotenv").config();
console.log("🔍 Chargement des variables d'environnement...");
console.log("✅ JWT_SECRET:", process.env.JWT_SECRET ? "Chargé ✅" : "❌ Manquant");
console.log("✅ JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET ? "Chargé ✅" : "❌ Manquant");
console.log("✅ DB:", process.env.DB ? "Chargé ✅" : "❌ Manquant");
console.log("✅ NODE_ENV:", process.env.NODE_ENV);
const cors = require("cors");
const jwt = require("jsonwebtoken");
const compression = require("compression");
const bodyParser = require("body-parser");
const { connect } = require("mongoose");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const path = require("path");
const { generateAccessToken, generateRefreshToken } = require("./api/utils/tokenUtils");

// Importation des modèles
const User = require("./api/models/User");
const Article = require("./api/models/Article"); // Ajout pour test MongoDB

// Importation des routes
const userRoutes = require("./api/routes/User.routes");
const monthlyCourseRoutes = require("./api/routes/monthly_courses.routes");
const messageRoutes = require("./api/routes/message.routes");
const lessonsRoutes = require("./api/routes/lessons.routes");
const articleRoutes = require("./api/routes/article.routes");
const productRoutes = require("./api/routes/products.routes");
const paymentRoutes = require("./api/routes/payment.routes");
const orderRoutes = require("./api/routes/order.routes");
const paymentConfirmationRoutes = require("./api/routes/paymentConfirmation.routes");
const contactRoutes = require("./api/routes/contact.routes");
const blogRoutes = require("./api/routes/blog.routes");

// 🔍 Connexion à MongoDB avec test
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB:", err));

// 🔧 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());

// Configuration CORS pour autoriser plusieurs origines
const allowedOrigins = [
  'https://autistudy.vercel.app',
  'https://autistudy-48mon62zt-myprofilcookies-projects.vercel.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme les appels API mobiles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Origine non autorisée:", origin);
      callback(null, true); // Temporairement autoriser toutes les origines pour déboguer
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Appliquer CORS avant toutes les autres middlewares
app.use(cors(corsOptions));

// Middleware de journalisation des requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers.authorization ? 'Auth: Présent' : 'Auth: Absent');
  
  // Ajouter manuellement les en-têtes CORS pour s'assurer qu'ils sont présents
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// 🔐 Routes d'authentification
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérifier si l'utilisateur est banni
    if (user.isBanned) {
      return res.status(403).json({ message: "Votre compte est banni." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Mot de passe incorrect" });

    // Générer les tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Stocker le refresh token dans un cookie sécurisé
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    res.status(200).json({
      message: "Connexion réussie",
      accessToken,
      user: {
        _id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        role: user.role,
        avatar: user.image || "/assets/default-avatar.webp",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

app.post("/api/auth/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token manquant" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Vérifier si l'utilisateur existe toujours
    User.findById(decoded.id)
      .then(user => {
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

        // Générer un nouvel accessToken
        const newAccessToken = generateAccessToken(user._id);
        res.json({ accessToken: newAccessToken });
      })
      .catch(error => res.status(500).json({ message: "Erreur serveur", error: error.message }));
  } catch (error) {
    res.status(403).json({ message: "Refresh token invalide ou expiré", error: error.message });
  }
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.cookies.refreshToken) {
    return res.status(400).json({ message: "Aucun refresh token trouvé" });
  }

  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Déconnexion réussie" });
});

// 🔒 Middleware pour vérifier l'authentification
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant. Veuillez vous reconnecter." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Ajout de `req.user` pour éviter les répétitions
    next();
  } catch (error) {
    res.status(403).json({ message: "Token invalide ou expiré", error: error.message });
  }
};

// ✅ Route test pour voir si l'API fonctionne
app.get("/api", (req, res) => {
  res.json({ message: "🚀 API is working!" });
});

// 📌 Déclaration des routes avec `/api/`
app.use("/api/users", userRoutes);
// app use pour /me
// app.use("/api/users/me", authenticateToken, userRoutes); // Middleware d'authentification pour /me
app.use("/api/courses", monthlyCourseRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment-confirmations", paymentConfirmationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blog", blogRoutes);

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
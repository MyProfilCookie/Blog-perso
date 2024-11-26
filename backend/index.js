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
// const paymentConfirmationRoutes = require("./api/routes/PaymentConfirmation.routes"); // Routes confirmations de paiement

// // Connexion à la base de données
// // Connexion à la base de données
// connect(process.env.DB)
//   .then(() => {
//     console.log("Connexion à la base réussie");
//   })
//   .catch((err) => {
//     console.error("Erreur de connexion à la base de données :", err.message);
//     process.exit(1); // Arrêter le serveur si la base de données ne se connecte pas
//   });


// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(compression());
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Modifier l'URL si besoin
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );

// // Forcer les réponses en JSON si ce n'est pas défini
// app.use((req, res, next) => {
//   res.setHeader("Content-Type", "application/json");
//   next();
// });

// // Servir les fichiers statiques (ex: images)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Route pour afficher le logo
// app.get("/logo", (req, res) => {
//   res.sendFile(path.join(__dirname, "uploads/logo/logo.webp"));
// });

// // Route pour récupérer le profil utilisateur
// app.get("/users/me", async (req, res) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     // renouveler le token
//     const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET,);
//     res.cookie("token", newToken, { httpOnly: true, secure: true, maxAge: 3600000 });

//     if (!user) {
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     }

//     res.json({ user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// // Route principale d'accueil avec le logo
// app.get("/", (req, res) => {
//   res.send(`
//     <html>
//       <body style="text-align: center; margin-top: 50px;">
//         <h1>Bienvenue sur notre API</h1>
//         <img src="/logo" alt="Logo de l'application" style="width: 200px;"/>
//       </body>
//     </html>
//   `);
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
const port = process.env.PORT || 3001;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const compression = require("compression");
const path = require("path");
const bodyParser = require("body-parser");
const { connect } = require("mongoose");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const User = require("./api/models/User"); // Modèle utilisateur
const userRoutes = require("./api/routes/User.routes"); // Routes utilisateur
const monthlyCourseRoutes = require("./api/routes/monthly_courses.routes"); // Routes cours
const messageRoutes = require("./api/routes/message.routes"); // Routes messages
const lessonsRoutes = require("./api/routes/lessons.routes"); // Routes leçons
const articleRoutes = require("./api/routes/article.routes"); // Routes articles
const productRoutes = require("./api/routes/products.routes"); // Routes produits
const paymentRoutes = require("./api/routes/payment.routes"); // Routes paiement
const orderRoutes = require("./api/routes/order.routes"); // Routes commandes
const paymentConfirmationRoutes = require("./api/routes/PaymentConfirmation.routes"); // Routes confirmations de paiement

// Connexion à la base de données
connect(process.env.DB)
  .then(() => {
    console.log("Connexion à la base réussie");
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données :", err.message);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Fonction pour générer des tokens
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// Route pour se connecter et obtenir les tokens
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Stocker le refresh token dans un cookie sécurisé
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour renouveler l'access token
app.post("/auth/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token manquant" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded.id);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Refresh token invalide ou expiré" });
  }
});

// Route pour se déconnecter et supprimer le refresh token
app.post("/auth/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Déconnexion réussie" });
});

// Middleware pour valider l'access token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token invalide ou expiré" });
  }
};

// Route pour récupérer le profil utilisateur
app.get("/users/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Utiliser les routes utilisateur
app.use("/users", userRoutes);
app.use("/courses", monthlyCourseRoutes);
app.use("/messages", messageRoutes);
app.use("/lessons", lessonsRoutes);
app.use("/articles", articleRoutes);
app.use("/products", productRoutes);
app.use("/payments", paymentRoutes);
app.use("/orders", orderRoutes);
app.use("/payment-confirmations", paymentConfirmationRoutes);

// Gestion des erreurs 404
app.use((req, res, next) => {
  const error = createError(404, "Ressource non trouvée");
  next(error);
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Application en écoute sur le port ${port}`);
});



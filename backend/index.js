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
const Produit = require("./api/models/products"); // Modèle produit

// Connexion à la base de données
// Connexion à la base de données
connect(process.env.DB)
  .then(() => {
    console.log("Connexion à la base réussie");
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données :", err.message);
    process.exit(1); // Arrêter le serveur si la base de données ne se connecte pas
  });


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());
app.use(
  cors({
    origin: "http://localhost:3000", // Modifier l'URL si besoin
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Forcer les réponses en JSON si ce n'est pas défini
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Servir les fichiers statiques (ex: images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route pour afficher le logo
app.get("/logo", (req, res) => {
  res.sendFile(path.join(__dirname, "uploads/logo/logo.webp"));
});

// Route pour récupérer le profil utilisateur
app.get("/users/profile", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route principale d'accueil avec le logo
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="text-align: center; margin-top: 50px;">
        <h1>Bienvenue sur notre API</h1>
        <img src="/logo" alt="Logo de l'application" style="width: 200px;"/>
      </body>
    </html>
  `);
});

// Utiliser les routes utilisateur
app.use("/users", userRoutes);
app.use("/courses", monthlyCourseRoutes);
app.use("/messages", messageRoutes);
app.use("/lessons", lessonsRoutes);
app.use("/articles", articleRoutes);
app.use("/products", productRoutes);

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



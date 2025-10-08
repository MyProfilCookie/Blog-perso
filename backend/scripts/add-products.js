const mongoose = require('mongoose');
const Produit = require('../api/models/products');
require('dotenv').config();

// Connexion à MongoDB (utilise la même variable que le backend principal)
const dbUri = process.env.DB || process.env.MONGODB_URI || 'mongodb://localhost:27017/autistudy';
console.log('🔗 Connexion à:', dbUri.includes('mongodb.net') ? 'MongoDB Atlas (Production)' : 'MongoDB Local');

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch((err) => console.error('❌ Erreur de connexion MongoDB:', err));

// Produits à ajouter
const products = [
  {
    title: "Balles Sensorielles Texturées - Set de 6",
    description: "Set de 6 balles aux textures variées pour stimuler le toucher et développer la motricité fine. Parfait pour les activités sensorielles.",
    price: 24.99,
    link: "https://www.amazon.fr/dp/B08XYZABC1",
    imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&q=80",
    category: "Sensoriel",
    weight: 0.5,
    dimensions: "Ø 7-10cm",
    features: [
      "6 textures différentes",
      "Matériaux non toxiques",
      "Facile à nettoyer",
      "Stimule le développement sensoriel"
    ]
  },
  {
    title: "Casque Anti-Bruit pour Enfants",
    description: "Casque de protection auditive confortable, idéal pour réduire les stimuli sonores et favoriser la concentration dans les environnements bruyants.",
    price: 34.99,
    link: "https://www.amazon.fr/dp/B07QRSTUVW",
    imageUrl: "https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=500&q=80",
    category: "Protection",
    weight: 0.3,
    dimensions: "Ajustable",
    features: [
      "Réduction jusqu'à 27dB",
      "Bandeau ajustable",
      "Léger et confortable",
      "Disponible en plusieurs couleurs"
    ]
  },
  {
    title: "Puzzle Encastrable en Bois - Alphabet",
    description: "Puzzle éducatif en bois naturel pour apprendre l'alphabet de manière ludique. Grandes pièces faciles à manipuler.",
    price: 19.99,
    link: "https://www.amazon.fr/dp/B089MNOPQR",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&q=80",
    category: "Éducatif",
    weight: 0.8,
    dimensions: "30x22cm",
    features: [
      "26 lettres colorées",
      "Bois naturel FSC",
      "Développe la motricité fine",
      "Peinture non toxique"
    ]
  },
  {
    title: "Coussin Lesté Apaisant 2kg",
    description: "Coussin lesté de haute qualité procurant une sensation de pression profonde pour calmer l'anxiété et favoriser la relaxation.",
    price: 44.99,
    link: "https://www.amazon.fr/dp/B08KLMNSTU",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80",
    category: "Sensoriel",
    weight: 2.2,
    dimensions: "40x40cm",
    features: [
      "Poids de 2kg",
      "Housse lavable en machine",
      "Billes de verre hypoallergéniques",
      "Effet calmant prouvé"
    ]
  },
  {
    title: "Time Timer Visuel - Gestion du Temps",
    description: "Timer visuel magnétique pour aider à comprendre le passage du temps. Parfait pour structurer les activités et les transitions.",
    price: 39.99,
    link: "https://www.amazon.fr/dp/B07VWXYZAB",
    imageUrl: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=500&q=80",
    category: "Organisation",
    weight: 0.4,
    dimensions: "18x18cm",
    features: [
      "Visualisation du temps restant",
      "Sans tic-tac",
      "Magnétique",
      "Durée jusqu'à 60 minutes"
    ]
  },
  {
    title: "Fidget Toys - Kit de 12 pièces",
    description: "Collection variée de jouets anti-stress pour améliorer la concentration et gérer l'anxiété. Discrets et silencieux.",
    price: 16.99,
    link: "https://www.amazon.fr/dp/B09CDEFGHI",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    category: "Sensoriel",
    weight: 0.3,
    dimensions: "Kit complet",
    features: [
      "12 fidgets différents",
      "Silencieux",
      "Portable",
      "Aide à la concentration"
    ]
  },
  {
    title: "Séquenceur Visuel Magnétique",
    description: "Tableau magnétique avec pictogrammes pour créer des routines visuelles et faciliter l'organisation quotidienne.",
    price: 29.99,
    link: "https://www.amazon.fr/dp/B08JKLMNOP",
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&q=80",
    category: "Organisation",
    weight: 1.0,
    dimensions: "35x25cm",
    features: [
      "40 pictogrammes inclus",
      "Tableau magnétique",
      "Facile à personnaliser",
      "Aide aux transitions"
    ]
  },
  {
    title: "Tapis Sensoriel d'Activités",
    description: "Grand tapis avec différentes zones texturées pour stimuler le sens tactile et développer l'exploration sensorielle.",
    price: 54.99,
    link: "https://www.amazon.fr/dp/B09QRSTUVW",
    imageUrl: "https://images.unsplash.com/photo-1595147389795-37094173bfd8?w=500&q=80",
    category: "Sensoriel",
    weight: 1.5,
    dimensions: "120x80cm",
    features: [
      "8 textures différentes",
      "Antidérapant",
      "Facile à nettoyer",
      "Stimule l'exploration"
    ]
  },
  {
    title: "Cube Lumineux Interactif",
    description: "Cube tactile avec lumières changeantes et sons apaisants. Stimule les sens et favorise le développement cognitif.",
    price: 42.99,
    link: "https://www.amazon.fr/dp/B08XYZABCD",
    imageUrl: "https://images.unsplash.com/photo-1587080266227-677cc2a4e76e?w=500&q=80",
    category: "Éducatif",
    weight: 0.6,
    dimensions: "15x15x15cm",
    features: [
      "Lumières LED colorées",
      "Sons apaisants",
      "Réagit au toucher",
      "Rechargeable USB"
    ]
  },
  {
    title: "Couverture Lestée Enfant 4kg",
    description: "Couverture lestée de qualité premium pour améliorer le sommeil et réduire l'anxiété. Pression profonde réconfortante.",
    price: 79.99,
    link: "https://www.amazon.fr/dp/B09EFGHIJK",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80",
    category: "Sensoriel",
    weight: 4.5,
    dimensions: "120x150cm",
    features: [
      "Poids de 4kg",
      "Housse en coton doux",
      "Billes de verre silencieuses",
      "Améliore le sommeil"
    ]
  },
  {
    title: "Jeu de Cartes Émotions",
    description: "52 cartes illustrées pour apprendre à identifier et exprimer les émotions. Outil pédagogique essentiel.",
    price: 14.99,
    link: "https://www.amazon.fr/dp/B07LMNOPQR",
    imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&q=80",
    category: "Éducatif",
    weight: 0.2,
    dimensions: "Cards 9x6cm",
    features: [
      "52 émotions illustrées",
      "Guide d'utilisation inclus",
      "Matériau durable",
      "Pour tous les âges"
    ]
  },
  {
    title: "Tunnel Sensoriel Pop-Up",
    description: "Tunnel de jeu portable pour ramper et explorer. Développe la motricité globale et offre un espace rassurant.",
    price: 34.99,
    link: "https://www.amazon.fr/dp/B08STUVWXY",
    imageUrl: "https://images.unsplash.com/photo-1560855792-6b0e75dccec5?w=500&q=80",
    category: "Motricité",
    weight: 1.2,
    dimensions: "180x48cm",
    features: [
      "Se plie en secondes",
      "Tissu résistant",
      "Facile à ranger",
      "Encourage le mouvement"
    ]
  }
];

// Fonction pour ajouter les produits
async function addProducts() {
  try {
    // Compter les produits existants
    const existingCount = await Produit.countDocuments();
    console.log(`📦 Produits existants: ${existingCount}`);

    // Option: Supprimer les anciens produits ? (décommentez la ligne suivante si nécessaire)
    // await Produit.deleteMany({});
    // console.log('🗑️  Tous les produits existants ont été supprimés');

    // Ajouter les nouveaux produits
    const result = await Produit.insertMany(products);
    console.log(`\n✅ ${result.length} nouveaux produits ajoutés avec succès !\n`);
    
    // Afficher les produits ajoutés
    result.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - ${product.price}€`);
    });

    const newTotal = await Produit.countDocuments();
    console.log(`\n📊 Total de produits dans la base: ${newTotal}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des produits:', error);
    if (error.code === 11000) {
      console.log('⚠️  Certains produits existent déjà (doublon détecté)');
    }
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Connexion fermée');
  }
}

// Exécuter le script
addProducts();

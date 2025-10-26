require('dotenv').config();
const mongoose = require('mongoose');
const Produit = require('./api/models/products');

const MONGODB_URI = process.env.DB;

// Mapping des produits vers des images cohérentes avec le matériel pour autisme/TSA
const productImageMapping = {
  // Images locales existantes
  "Tapis sensoriel": "/assets/shop/tapis-sensoriel.webp",
  "Veste lestée": "/assets/shop/veste-lestee.webp",
  "Cube Sensoriel": "/assets/shop/cube-sensoriel.webp",
  "Timer Visuel": "/assets/shop/timer-visuel.webp",
  "Classeur PECS": "/assets/shop/classeur-pecs.webp",
  "Sablier Sensoriel": "/assets/shop/sablier-sensoriel.webp",
  "Lumière d'Ambiance Sensorielle": "/assets/shop/lumiere-ambiance-sensorielle.webp",
  "Boule Anti-Stress": "/assets/shop/boule-anti-stress.webp",
  "Oreiller Lesté": "/assets/shop/oreiller-leste.webp",
  "Hamac à Bascule": "/assets/shop/hamac-bascule.webp",
  "Chaise à Bascule": "/assets/shop/chaise-bascule.webp",
  "Casque Anti-bruit": "/assets/shop/casque-anti-bruit.webp",
  "Balle Sensorielle Lumineuse": "/assets/shop/balle-sensorielle-lumineuse.webp",

  // Produits similaires utilisant les mêmes images
  "Balles Sensorielles Texturées - Set de 6": "/assets/shop/balle-sensorielle-lumineuse.webp",
  "Casque Anti-Bruit pour Enfants": "/assets/shop/casque-anti-bruit.webp",
  "Coussin Lesté Apaisant 2kg": "/assets/shop/oreiller-leste.webp",
  "Time Timer Visuel - Gestion du Temps": "/assets/shop/timer-visuel.webp",
  "Fidget Toys - Kit de 12 pièces": "/assets/shop/boule-anti-stress.webp",
  "Séquenceur Visuel Magnétique": "/assets/shop/classeur-pecs.webp",
  "Tapis Sensoriel d'Activités": "/assets/shop/tapis-sensoriel.webp",
  "Couverture Lestée Enfant 4kg": "/assets/shop/veste-lestee.webp",

  // Produits éducatifs - images spécifiques de matériel autisme
  "Puzzle Encastrable en Bois - Alphabet": "https://m.media-amazon.com/images/I/81QF+xK0jZL._AC_SL1500_.jpg",
  "Cube Lumineux Interactif": "/assets/shop/cube-sensoriel.webp",
  "Jeu de Cartes Émotions": "https://m.media-amazon.com/images/I/91eFvpVLN3L._AC_SL1500_.jpg",

  // Communication AAC
  "Tablette de Communication AAC": "https://m.media-amazon.com/images/I/61wK4CHSZPL._AC_SL1000_.jpg",
  "Système de Signalisation Visuelle": "https://m.media-amazon.com/images/I/81mKqJF3wLL._AC_SL1500_.jpg",
  "Système d'Assistance Vocale": "https://m.media-amazon.com/images/I/61Zy5QM2cbL._AC_SL1280_.jpg",

  // Mobilité et autonomie
  "Fauteuil Roulant Pédiatrique Léger": "https://m.media-amazon.com/images/I/71KdP3TYBLL._AC_SL1500_.jpg",
  "Canne Blanche Electronique": "https://m.media-amazon.com/images/I/61XU7sGMCYL._AC_SL1500_.jpg",
  "Bracelet de Géolocalisation Sécurisé": "https://m.media-amazon.com/images/I/71rCpZJXBsL._AC_SL1500_.jpg",
  "Coussin Adapté Posture": "/assets/shop/oreiller-leste.webp",

  // Matériel sensoriel TSA
  "Kit Sensoriel pour TSA": "https://m.media-amazon.com/images/I/91pOY+CQn5L._AC_SL1500_.jpg",
  "Tunnel Sensoriel Pop-Up": "https://m.media-amazon.com/images/I/81xD5Y0KJVL._AC_SL1500_.jpg",
  "Jeu de Motricité Fine Adapté": "https://m.media-amazon.com/images/I/91z5QrLQN0L._AC_SL1500_.jpg",

  // Éclairage et technologie
  "Système d'Éclairage Adapté": "https://m.media-amazon.com/images/I/71FGK9oOybL._AC_SL1500_.jpg",
  "Tablette d'Apprentissage Tactile": "https://m.media-amazon.com/images/I/71zNY0V0KWL._AC_SL1500_.jpg",

  // Autonomie quotidienne
  "Kit d'Autonomie Quotidienne": "https://m.media-amazon.com/images/I/81Vl0HNMKML._AC_SL1500_.jpg",
};

async function updateProductImages() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const products = await Produit.find({});
    console.log(`\n📦 ${products.length} produits trouvés\n`);

    let updated = 0;
    let notFound = 0;

    for (const product of products) {
      const newImageUrl = productImageMapping[product.title];

      if (newImageUrl) {
        await Produit.findByIdAndUpdate(product._id, {
          imageUrl: newImageUrl
        });
        console.log(`✅ ${product.title} - Image mise à jour`);
        updated++;
      } else {
        console.log(`⚠️  ${product.title} - Aucune image trouvée dans le mapping`);
        notFound++;
      }
    }

    console.log(`\n📊 Résumé:`);
    console.log(`   ✅ Images mises à jour: ${updated}`);
    console.log(`   ⚠️  Images non trouvées: ${notFound}`);
    console.log(`   📦 Total produits: ${products.length}`);

    await mongoose.connection.close();
    console.log('\n🔌 Déconnexion de MongoDB');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updateProductImages();

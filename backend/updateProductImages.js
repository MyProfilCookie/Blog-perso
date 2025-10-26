require('dotenv').config();
const mongoose = require('mongoose');
const Produit = require('./api/models/products');

const MONGODB_URI = process.env.DB;

// Mapping des produits vers des images locales uniquement (/assets/shop/)
const productImageMapping = {
  // Images locales existantes - Produits de base
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

  // Produits similaires - réutilisation d'images locales
  "Balles Sensorielles Texturées - Set de 6": "/assets/shop/balle-sensorielle-lumineuse.webp",
  "Casque Anti-Bruit pour Enfants": "/assets/shop/casque-anti-bruit.webp",
  "Coussin Lesté Apaisant 2kg": "/assets/shop/oreiller-leste.webp",
  "Time Timer Visuel - Gestion du Temps": "/assets/shop/timer-visuel.webp",
  "Fidget Toys - Kit de 12 pièces": "/assets/shop/boule-anti-stress.webp",
  "Séquenceur Visuel Magnétique": "/assets/shop/classeur-pecs.webp",
  "Tapis Sensoriel d'Activités": "/assets/shop/tapis-sensoriel.webp",
  "Couverture Lestée Enfant 4kg": "/assets/shop/veste-lestee.webp",
  "Coussin Adapté Posture": "/assets/shop/oreiller-leste.webp",

  // Produits éducatifs - réutilisation d'images locales cohérentes
  "Puzzle Encastrable en Bois - Alphabet": "/assets/shop/cube-sensoriel.webp",
  "Cube Lumineux Interactif": "/assets/shop/cube-sensoriel.webp",
  "Jeu de Cartes Émotions": "/assets/shop/classeur-pecs.webp",
  "Jeu de Motricité Fine Adapté": "/assets/shop/boule-anti-stress.webp",

  // Communication AAC - utilisation d'images locales appropriées
  "Tablette de Communication AAC": "/assets/shop/classeur-pecs.webp",
  "Système de Signalisation Visuelle": "/assets/shop/classeur-pecs.webp",
  "Système d'Assistance Vocale": "/assets/shop/timer-visuel.webp",
  "Tablette d'Apprentissage Tactile": "/assets/shop/cube-sensoriel.webp",

  // Mobilité et autonomie - images locales appropriées
  "Fauteuil Roulant Pédiatrique Léger": "/assets/shop/chaise-bascule.webp",
  "Canne Blanche Electronique": "/assets/shop/timer-visuel.webp",
  "Bracelet de Géolocalisation Sécurisé": "/assets/shop/timer-visuel.webp",

  // Matériel sensoriel TSA - images locales sensorielles
  "Kit Sensoriel pour TSA": "/assets/shop/balle-sensorielle-lumineuse.webp",
  "Tunnel Sensoriel Pop-Up": "/assets/shop/tapis-sensoriel.webp",

  // Éclairage et technologie - images locales appropriées
  "Système d'Éclairage Adapté": "/assets/shop/lumiere-ambiance-sensorielle.webp",

  // Autonomie quotidienne - images appropriées
  "Kit d'Autonomie Quotidienne": "/assets/shop/classeur-pecs.webp",
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

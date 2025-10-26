require('dotenv').config();
const mongoose = require('mongoose');
const Produit = require('./api/models/products');

const MONGODB_URI = process.env.DB;

// Mapping optimisé des produits vers les nouvelles images locales (/assets/shop/)
// Utilise les 19 images webp disponibles pour correspondre au mieux à chaque produit
const productImageMapping = {
  // Produits de base - images dédiées
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

  // Produits sensoriels - réutilisation d'images cohérentes
  "Balles Sensorielles Texturées - Set de 6": "/assets/shop/balle-sensorielle-lumineuse.webp",
  "Casque Anti-Bruit pour Enfants": "/assets/shop/casque-anti-bruit.webp",
  "Coussin Lesté Apaisant 2kg": "/assets/shop/oreiller-leste.webp",
  "Fidget Toys - Kit de 12 pièces": "/assets/shop/boule-anti-stress.webp",
  "Tapis Sensoriel d'Activités": "/assets/shop/tapis-sensoriel.webp",
  "Couverture Lestée Enfant 4kg": "/assets/shop/veste-lestee.webp",
  "Coussin Adapté Posture": "/assets/shop/oreiller-leste.webp",
  "Kit Sensoriel pour TSA": "/assets/shop/balle-sensorielle-lumineuse.webp",
  "Tunnel Sensoriel Pop-Up": "/assets/shop/tapis-sensoriel.webp",

  // Organisation et gestion du temps
  "Time Timer Visuel - Gestion du Temps": "/assets/shop/timer-visuel.webp",
  "Séquenceur Visuel Magnétique": "/assets/shop/classeur-pecs.webp",

  // Produits éducatifs
  "Puzzle Encastrable en Bois - Alphabet": "/assets/shop/cube-sensoriel.webp",
  "Cube Lumineux Interactif": "/assets/shop/cube-sensoriel.webp",
  "Jeu de Cartes Émotions": "/assets/shop/classeur-pecs.webp",
  "Jeu de Motricité Fine Adapté": "/assets/shop/jeu-de-motricite.webp", // ✨ NOUVELLE IMAGE

  // Communication AAC - utilisation des nouvelles images dédiées
  "Tablette de Communication AAC": "/assets/shop/tablette-apprentissage.webp", // ✨ NOUVELLE IMAGE
  "Système de Signalisation Visuelle": "/assets/shop/systeme-de-signalisation-visuelle.webp", // ✨ NOUVELLE IMAGE
  "Système d'Assistance Vocale": "/assets/shop/assistance-vocale.webp", // ✨ NOUVELLE IMAGE
  "Tablette d'Apprentissage Tactile": "/assets/shop/tablette-apprentissage.webp", // ✨ NOUVELLE IMAGE

  // Mobilité
  "Fauteuil Roulant Pédiatrique Léger": "/assets/shop/chaise-bascule.webp",
  "Canne Blanche Electronique": "/assets/shop/timer-visuel.webp",

  // Sécurité et autonomie - utilisation des nouvelles images dédiées
  "Bracelet de Géolocalisation Sécurisé": "/assets/shop/timer-visuel.webp",
  "Kit d'Autonomie Quotidienne": "/assets/shop/kit-autonomie.webp", // ✨ NOUVELLE IMAGE

  // Éclairage et technologie - utilisation de la nouvelle image dédiée
  "Système d'Éclairage Adapté": "/assets/shop/systeme-eclairage.webp", // ✨ NOUVELLE IMAGE
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

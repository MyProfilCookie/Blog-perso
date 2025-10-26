require('dotenv').config();
const mongoose = require('mongoose');
const Produit = require('./api/models/products');

const MONGODB_URI = process.env.DB;

// Mapping des produits vers des images Unsplash cohérentes
const productImageMapping = {
  // Bien-être
  "Tapis sensoriel": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
  "Veste lestée": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",

  // Développement sensoriel
  "Cube Sensoriel": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",

  // Gestion du temps
  "Timer Visuel": "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=800&q=80",
  "Time Timer Visuel - Gestion du Temps": "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&q=80",

  // Communication & Autonomie
  "Classeur PECS": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "Séquenceur Visuel Magnétique": "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80",

  // Apaisement & Relaxation
  "Sablier Sensoriel": "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80",
  "Lumière d'Ambiance Sensorielle": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",

  // Gestion du Stress
  "Boule Anti-Stress": "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=800&q=80",
  "Fidget Toys - Kit de 12 pièces": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",

  // Sommeil & Bien-être
  "Oreiller Lesté": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
  "Coussin Lesté Apaisant 2kg": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80",
  "Couverture Lestée Enfant 4kg": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
  "Coussin Adapté Posture": "https://images.unsplash.com/photo-1574534602447-14c7f0f4e0c6?w=800&q=80",

  // Relaxation & Stimulation
  "Hamac à Bascule": "https://images.unsplash.com/photo-1534759926787-89fdde38d19e?w=800&q=80",
  "Chaise à Bascule": "https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=800&q=80",

  // Protection Sensorielle
  "Casque Anti-bruit": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80",
  "Casque Anti-Bruit pour Enfants": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",

  // Stimulation Sensorielle
  "Balle Sensorielle Lumineuse": "https://images.unsplash.com/photo-1591462618704-4900f9616d4b?w=800&q=80",
  "Balles Sensorielles Texturées - Set de 6": "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=800&q=80",
  "Tapis Sensoriel d'Activités": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
  "Kit Sensoriel pour TSA": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
  "Tunnel Sensoriel Pop-Up": "https://images.unsplash.com/photo-1588731234159-8b9963143fcd?w=800&q=80",

  // Éducatif
  "Puzzle Encastrable en Bois - Alphabet": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
  "Cube Lumineux Interactif": "https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?w=800&q=80",
  "Jeu de Cartes Émotions": "https://images.unsplash.com/photo-1606503153255-59d2b10bc27c?w=800&q=80",
  "Tablette d'Apprentissage Tactile": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
  "Jeu de Motricité Fine Adapté": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",

  // Communication
  "Tablette de Communication AAC": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
  "Système de Signalisation Visuelle": "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=800&q=80",
  "Système d'Assistance Vocale": "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80",

  // Mobilité
  "Fauteuil Roulant Pédiatrique Léger": "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&q=80",
  "Canne Blanche Electronique": "https://images.unsplash.com/photo-1606914469633-84f58c62e8c5?w=800&q=80",

  // Sécurité
  "Bracelet de Géolocalisation Sécurisé": "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=800&q=80",

  // Vision & Éclairage
  "Système d'Éclairage Adapté": "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",

  // Autonomie
  "Kit d'Autonomie Quotidienne": "https://images.unsplash.com/photo-1594296657911-26fd56da95f6?w=800&q=80",
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

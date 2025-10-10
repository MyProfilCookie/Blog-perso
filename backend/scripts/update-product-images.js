const mongoose = require('mongoose');
const Produit = require('../api/models/products');
require('dotenv').config();

// Connexion à MongoDB
const dbUri = process.env.DB || process.env.MONGODB_URI || 'mongodb://localhost:27017/autistudy';
console.log('🔗 Connexion à:', dbUri.includes('mongodb.net') ? 'MongoDB Atlas (Production)' : 'MongoDB Local');

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch((err) => console.error('❌ Erreur de connexion MongoDB:', err));

// Mapping des mises à jour d'images
const imageUpdates = [
  {
    title: "Tapis sensoriel",
    newImageUrl: "/assets/shop/tapis-sensoriel.webp"
  },
  {
    title: "Veste lestée", 
    newImageUrl: "/assets/shop/veste-lestee.webp"
  },
  {
    title: "Cube Sensoriel",
    newImageUrl: "/assets/shop/cube-sensoriel.webp"
  },
  {
    title: "Timer Visuel",
    newImageUrl: "/assets/shop/timer-visuel.webp"
  },
  {
    title: "Classeur PECS",
    newImageUrl: "/assets/shop/classeur-pecs.webp"
  },
  {
    title: "Sablier Sensoriel",
    newImageUrl: "/assets/shop/sablier-sensoriel.webp"
  },
  {
    title: "Lumière d'Ambiance Sensorielle",
    newImageUrl: "/assets/shop/lumiere-ambiance-sensorielle.webp"
  },
  {
    title: "Boule Anti-Stress",
    newImageUrl: "/assets/shop/boule-anti-stress.webp"
  },
  {
    title: "Oreiller Lesté",
    newImageUrl: "/assets/shop/oreiller-leste.webp"
  },
  {
    title: "Hamac à Bascule",
    newImageUrl: "/assets/shop/hamac-bascule.webp"
  },
  {
    title: "Chaise à Bascule",
    newImageUrl: "/assets/shop/chaise-bascule.webp"
  },
  {
    title: "Casque Anti-bruit",
    newImageUrl: "/assets/shop/casque-anti-bruit.webp"
  },
  {
    title: "Balle Sensorielle Lumineuse",
    newImageUrl: "/assets/shop/balle-sensorielle-lumineuse.webp"
  }
];

// Fonction pour mettre à jour les images
async function updateProductImages() {
  try {
    console.log('🔄 Mise à jour des images des produits...\n');
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const update of imageUpdates) {
      try {
        const result = await Produit.updateMany(
          { title: update.title },
          { $set: { imageUrl: update.newImageUrl } }
        );
        
        if (result.matchedCount > 0) {
          console.log(`✅ ${update.title}: ${result.modifiedCount} produit(s) mis à jour`);
          console.log(`   Nouvelle image: ${update.newImageUrl}`);
          updatedCount += result.modifiedCount;
        } else {
          console.log(`⚠️  ${update.title}: Aucun produit trouvé avec ce titre`);
          notFoundCount++;
        }
        console.log('');
        
      } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour de ${update.title}:`, error.message);
      }
    }
    
    console.log('📊 Résumé des mises à jour:');
    console.log(`   ✅ Produits mis à jour: ${updatedCount}`);
    console.log(`   ⚠️  Produits non trouvés: ${notFoundCount}`);
    
    // Afficher quelques produits mis à jour pour vérification
    console.log('\n🔍 Vérification - Quelques produits mis à jour:');
    const sampleProducts = await Produit.find({
      imageUrl: { $regex: '/assets/shop/' }
    }).limit(5).select('title imageUrl');
    
    sampleProducts.forEach(product => {
      console.log(`   📦 ${product.title}: ${product.imageUrl}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des images:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Connexion fermée');
  }
}

// Exécuter le script
updateProductImages();

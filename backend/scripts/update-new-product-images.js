const mongoose = require('mongoose');
const Produit = require('../api/models/products');
require('dotenv').config();

const dbUri = process.env.DB || process.env.MONGODB_URI || 'mongodb://localhost:27017/autistudy';

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch((err) => console.error('❌ Erreur de connexion MongoDB:', err));

const productsToUpdate = [
  { 
    title: "Kit d'Autonomie Quotidienne", 
    newImageUrl: "/assets/Kit-d'Autonomie-Quotidienne.webp" 
  },
  { 
    title: "Puzzle Encastrable en Bois - Alphabet", 
    newImageUrl: "/assets/Puzzle Encastrable en Bois - Alphabet.webp" 
  },
  { 
    title: "Système d'Assistance Vocale", 
    newImageUrl: "/assets/Système-d'Assistance-Vocale.webp" 
  },
  { 
    title: "Tablette d'Apprentissage Tactile", 
    newImageUrl: "/assets/Tablette-Apprentissage-Tactile.webp" 
  }
];

async function updateProductImages() {
  console.log('🔄 Mise à jour des images des nouveaux produits...\n');
  let updatedCount = 0;
  let notFoundCount = 0;
  
  const timestamp = Date.now();

  for (const productData of productsToUpdate) {
    // Ajouter le paramètre de cache pour forcer le rafraîchissement
    const imageUrlWithCache = `${productData.newImageUrl}?v=${timestamp}`;
    
    const result = await Produit.updateOne(
      { title: productData.title },
      { $set: { imageUrl: imageUrlWithCache } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ ${productData.title}`);
      console.log(`   Ancienne: /assets/shop/...`);
      console.log(`   Nouvelle: ${imageUrlWithCache}\n`);
      updatedCount++;
    } else {
      console.log(`⚠️  ${productData.title}: Produit non trouvé ou image déjà à jour\n`);
      notFoundCount++;
    }
  }
  
  console.log(`\n📊 Résumé des mises à jour:`);
  console.log(`   ✅ Produits mis à jour: ${updatedCount}`);
  console.log(`   ⚠️  Produits non trouvés: ${notFoundCount}`);

  // Vérification des produits mis à jour
  console.log('\n🔍 Vérification - Produits mis à jour:');
  for (const productData of productsToUpdate) {
    const product = await Produit.findOne({ title: productData.title });
    if (product) {
      console.log(`   📦 ${product.title}`);
      console.log(`      ${product.imageUrl}\n`);
    }
  }
}

updateProductImages().finally(() => {
  mongoose.connection.close();
  console.log('👋 Connexion fermée');
});


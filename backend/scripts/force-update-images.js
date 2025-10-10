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

// Fonction pour forcer la mise à jour des images avec un paramètre de cache
async function forceUpdateImages() {
  try {
    console.log('🔄 Mise à jour forcée des images avec paramètre de cache...\n');
    
    // Récupérer tous les produits
    const products = await Produit.find({});
    console.log(`📦 ${products.length} produits trouvés`);
    
    let updatedCount = 0;
    const timestamp = Date.now();
    
    for (const product of products) {
      if (product.imageUrl && product.imageUrl.includes('/assets/shop/')) {
        // Ajouter un paramètre de version pour forcer le rechargement
        const newImageUrl = `${product.imageUrl}?v=${timestamp}`;
        
        await Produit.updateOne(
          { _id: product._id },
          { $set: { imageUrl: newImageUrl } }
        );
        
        console.log(`✅ ${product.title}: ${product.imageUrl} → ${newImageUrl}`);
        updatedCount++;
      }
    }
    
    console.log(`\n📊 ${updatedCount} images mises à jour avec paramètre de cache`);
    
    // Afficher quelques exemples
    console.log('\n🔍 Exemples d\'images mises à jour:');
    const sampleProducts = await Produit.find({}).limit(3).select('title imageUrl');
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
forceUpdateImages();

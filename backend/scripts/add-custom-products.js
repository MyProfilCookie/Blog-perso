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

// Nouveaux produits avec images personnalisées
const newProducts = [
  // Ajoutez ici vos nouveaux produits avec les nouvelles images
  {
    title: "Kit Sensoriel Complet",
    description: "Collection complète d'outils sensoriels pour stimuler tous les sens et favoriser le développement de l'enfant autiste.",
    price: 89.99,
    link: "https://www.amazon.fr/dp/B08SENSORIEL",
    imageUrl: "/assets/shop/tapis-sensoriel.webp", // Utilise une de vos nouvelles images
    category: "Sensoriel",
    weight: 2.5,
    dimensions: "30cm x 25cm x 15cm",
    features: [
      "Stimulation multi-sensorielle",
      "Matériaux non toxiques",
      "Facile à nettoyer",
      "Recommandé par les professionnels"
    ]
  },
  {
    title: "Bracelet Sensoriel Vibrant",
    description: "Bracelet discret avec vibrations apaisantes pour aider à la régulation sensorielle et réduire l'anxiété.",
    price: 34.99,
    link: "https://www.amazon.fr/dp/B08BRACELET",
    imageUrl: "/assets/shop/balle-sensorielle-lumineuse.webp",
    category: "Bien-être",
    weight: 0.1,
    dimensions: "18cm de circonférence",
    features: [
      "Vibrations réglables",
      "Discret et confortable",
      "Batterie longue durée",
      "Idéal pour l'autonomie"
    ]
  }
];

// Fonction pour ajouter les nouveaux produits
async function addNewProducts() {
  try {
    console.log('🔄 Ajout de nouveaux produits avec images personnalisées...\n');
    
    // Vérifier si les produits existent déjà
    for (const product of newProducts) {
      const existingProduct = await Produit.findOne({ title: product.title });
      if (existingProduct) {
        console.log(`⚠️  Le produit "${product.title}" existe déjà, ignoré.`);
        continue;
      }
      
      // Ajouter le nouveau produit
      const newProduct = new Produit(product);
      await newProduct.save();
      console.log(`✅ "${product.title}" ajouté avec succès !`);
      console.log(`   Image: ${product.imageUrl}`);
      console.log(`   Prix: ${product.price}€`);
      console.log('');
    }
    
    // Afficher le total des produits
    const totalProducts = await Produit.countDocuments();
    console.log(`📊 Total de produits dans la base: ${totalProducts}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des produits:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Connexion fermée');
  }
}

// Exécuter le script
addNewProducts();

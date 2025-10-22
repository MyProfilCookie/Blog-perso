const mongoose = require('mongoose');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Schéma Publication
const publicationSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  image: String,
  img: String,
  date: Date,
  author: String,
  category: String,
  content: mongoose.Schema.Types.Mixed,
  description: String,
});

const Publication = mongoose.model('Publication', publicationSchema);

// Nouvelles images différentes pour les publications (différentes des articles)
const publicationImages = [
  '/assets/couvertures/livre_11.webp',
  '/assets/couvertures/livre_12.webp',
  '/assets/couvertures/livre_13.webp',
  '/assets/couvertures/livre_14.webp',
  '/assets/couvertures/livre_15.webp',
  '/assets/couvertures/livre_16.webp',
  '/assets/couvertures/livre_17.webp',
  '/assets/couvertures/livre_18.webp',
  '/assets/couvertures/livre_19.webp',
  '/assets/couvertures/livre_20.webp',
  '/assets/couvertures/livre_21.webp',
  '/assets/couvertures/livre_22.webp',
  '/assets/couvertures/livre_23.webp',
  '/assets/couvertures/livre_24.webp',
  '/assets/couvertures/livre_25.webp',
  '/assets/couvertures/livre_26.webp',
  '/assets/couvertures/livre_27.webp',
  '/assets/couvertures/livre_28.webp',
  '/assets/couvertures/livre_29.webp',
  '/assets/couvertures/livre_30.webp',
  '/assets/couvertures/livre_31.webp',
  '/assets/couvertures/livre_32.webp',
  '/assets/couvertures/livre_33.webp',
  '/assets/couvertures/livre_34.webp',
  '/assets/couvertures/livre_35.webp',
  '/assets/couvertures/livre_36.webp',
  '/assets/couvertures/livre_37.webp',
  '/assets/couvertures/livre_38.webp',
  '/assets/couvertures/livre_39.webp',
  '/assets/couvertures/livre_40.webp',
  '/assets/couvertures/livre_41.webp',
  '/assets/couvertures/livre_42.webp',
  '/assets/couvertures/livre_43.webp',
  '/assets/couvertures/livre_44.webp',
  '/assets/couvertures/livre_45.webp',
  '/assets/couvertures/livre_46.webp',
  '/assets/couvertures/livre_47.webp',
  '/assets/couvertures/livre_48.webp',
  '/assets/couvertures/livre_49.webp',
  '/assets/couvertures/livre_50.webp',
  '/assets/couvertures/livre_51.webp',
  '/assets/couvertures/livre_52.webp',
  '/assets/couvertures/livre_53.webp',
  '/assets/couvertures/livre_54.webp',
  '/assets/couvertures/livre_55.webp',
];

async function updateImages() {
  try {
    console.log('📝 Récupération des publications...');
    const publications = await Publication.find().sort({ date: 1 });

    console.log(`✅ ${publications.length} publications trouvées`);
    console.log('🔄 Mise à jour des images...');

    let updated = 0;
    for (let i = 0; i < publications.length; i++) {
      const pub = publications[i];
      const newImage = publicationImages[i % publicationImages.length];

      await Publication.updateOne(
        { _id: pub._id },
        {
          $set: {
            image: newImage,
            img: newImage
          }
        }
      );

      updated++;
      console.log(`   ✓ ${updated}/${publications.length} - ${pub.title.substring(0, 50)}... → ${newImage}`);
    }

    console.log(`\n✅ ${updated} publications mises à jour avec des images différentes !`);
    console.log('📊 Les publications utilisent maintenant les images livre_11.webp à livre_55.webp');
    console.log('📊 Les articles utilisent toujours les images livre_1.webp à livre_10.webp');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour :', error);
    process.exit(1);
  }
}

updateImages();

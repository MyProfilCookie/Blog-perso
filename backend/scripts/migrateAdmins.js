const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../api/models/User');
const Eleve = require('../api/models/Eleve');
const DBConnectionHandler = require('../api/utils/DBconnect');

async function migrateAdmins() {
  try {
    // Utiliser le même gestionnaire de connexion que l'application
    await DBConnectionHandler();
    console.log('📦 Connecté à MongoDB');

    // Récupérer tous les admins
    const admins = await User.find({ role: 'admin' });
    console.log(`🔍 ${admins.length} administrateurs trouvés`);

    // Pour chaque admin, créer un profil élève s'il n'existe pas
    let created = 0;
    let existing = 0;

    for (const admin of admins) {
      const existingEleve = await Eleve.findOne({ userId: admin._id });
      
      if (!existingEleve) {
        const newEleve = new Eleve({
          userId: admin._id,
          subjects: [],
          overallAverage: 0,
          totalPagesCompleted: 0,
          createdAt: admin.createdAt || new Date(),
          updatedAt: new Date()
        });
        
        await newEleve.save();
        created++;
        console.log(`✅ Profil élève créé pour l'admin: ${admin.email}`);
      } else {
        existing++;
        console.log(`ℹ️ Profil élève existant pour l'admin: ${admin.email}`);
      }
    }

    console.log('\n📊 Résumé de la migration:');
    console.log(`🆕 Nouveaux profils créés: ${created}`);
    console.log(`📝 Profils existants: ${existing}`);
    console.log(`📈 Total traité: ${admins.length}`);

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    console.error('Details:', error.message);
  } finally {
    // Fermer la connexion à la base de données
    await mongoose.connection.close();
    console.log('\n🔌 Déconnexion de MongoDB');
  }
}

// Exécuter la migration
migrateAdmins().then(() => {
  console.log('\n✨ Migration terminée');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
}); 
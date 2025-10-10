const mongoose = require('mongoose');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schéma du produit
const produitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  weight: { 
    type: Number, 
    required: false
  },
  category: { 
    type: String, 
    required: false
  },
  dimensions: { 
    type: String, 
    required: false
  },
  features: [{ 
    type: String, 
    required: false
  }]
});

const Produit = mongoose.model('Produit', produitSchema);

// 12 nouveaux produits liés au handicap
const nouveauxProduits = [
  {
    title: "Tablette de Communication AAC",
    description: "Tablette de communication alternative et augmentée pour aider les personnes non verbales à s'exprimer. Interface intuitive avec pictogrammes personnalisables.",
    price: 299.99,
    link: "https://www.amazon.fr/dp/B08AACCOMM",
    imageUrl: "/assets/shop/classeur-pecs.webp",
    weight: 1.2,
    category: "Communication",
    dimensions: "25cm x 18cm x 2cm",
    features: [
      "🎤 **Synthèse vocale haute qualité** - Voix naturelle pour une communication claire",
      "📱 **Interface tactile intuitive** - Écran résistant optimisé pour tous les âges",
      "🎨 **Pictogrammes personnalisables** - Adaptez la tablette aux besoins spécifiques",
      "🔊 **Volume réglable et sortie audio** - Audible dans tous les environnements",
      "💾 **Mémoire extensible** - Sauvegardez des milliers de phrases et mots",
      "🔋 **Batterie longue durée** - 8h d'autonomie pour une utilisation quotidienne",
      "👥 **Multi-utilisateurs** - Profils personnalisés pour chaque utilisateur",
      "🌍 **Langues multiples** - Support de plusieurs langues et dialectes"
    ]
  },
  {
    title: "Fauteuil Roulant Pédiatrique Léger",
    description: "Fauteuil roulant ultra-léger spécialement conçu pour les enfants. Maniabilité optimale et confort maximal pour l'autonomie quotidienne.",
    price: 1299.99,
    link: "https://www.amazon.fr/dp/B08WHEELCHAIR",
    imageUrl: "/assets/shop/chaise-bascule.webp",
    weight: 8.5,
    category: "Mobilité",
    dimensions: "90cm x 60cm x 100cm",
    features: [
      "⚖️ **Ultra-léger** - Seulement 8.5kg pour faciliter le transport",
      "🔧 **Entièrement réglable** - S'adapte à la croissance de l'enfant",
      "🛞 **Roues avant pivotantes** - Maniabilité optimale en intérieur",
      "💺 **Siège ergonomique** - Confort et maintien optimal du dos",
      "🔄 **Frein de stationnement** - Sécurité maximale",
      "🎨 **Design coloré** - Plusieurs coloris pour plaire aux enfants",
      "📦 **Plie compactement** - Facile à transporter en voiture",
      "🛡️ **Certification médicale** - Conforme aux normes européennes"
    ]
  },
  {
    title: "Canne Blanche Electronique",
    description: "Canne blanche haute technologie avec détection d'obstacles par ultrasons et guidage vocal. Sécurité renforcée pour les déplacements autonomes.",
    price: 189.99,
    link: "https://www.amazon.fr/dp/B08CANEWHITE",
    imageUrl: "/assets/shop/timer-visuel.webp",
    weight: 0.6,
    category: "Mobilité",
    dimensions: "120cm x 2cm",
    features: [
      "📡 **Détection ultrasonique** - Détecte les obstacles jusqu'à 2 mètres",
      "🔊 **Guidage vocal** - Instructions audio pour naviguer en sécurité",
      "💡 **LED haute visibilité** - Améliore la visibilité de jour comme de nuit",
      "🔋 **Batterie longue durée** - 40h d'autonomie continue",
      "💧 **Résistant à l'eau** - Utilisation possible sous la pluie",
      "🎯 **Vibration tactile** - Alerte par vibration en plus du son",
      "📱 **App mobile** - Configuration et suivi via smartphone",
      "🛡️ **Certifiée CE** - Conforme aux standards médicaux européens"
    ]
  },
  {
    title: "Kit Sensoriel pour TSA",
    description: "Collection complète d'outils sensoriels spécialement sélectionnés pour les enfants avec troubles du spectre autistique. Stimulation contrôlée et apaisement.",
    price: 89.99,
    link: "https://www.amazon.fr/dp/B08TSAKIT",
    imageUrl: "/assets/shop/balle-sensorielle-lumineuse.webp",
    weight: 2.1,
    category: "Sensoriel",
    dimensions: "30cm x 20cm x 15cm",
    features: [
      "🧩 **12 outils sensoriels** - Sélection d'experts en TSA",
      "🌈 **Stimulation multi-sensorielle** - Visuelle, tactile et auditive",
      "😌 **Effet apaisant** - Aide à la régulation émotionnelle",
      "🎯 **Intensité réglable** - S'adapte aux besoins de chaque enfant",
      "📚 **Guide d'utilisation** - Manuel complet avec exercices",
      "🧼 **Facile à nettoyer** - Matériaux hygiéniques et durables",
      "🎒 **Transportable** - Boîte de rangement pratique",
      "👨‍⚕️ **Recommandé par des ergothérapeutes** - Validation professionnelle"
    ]
  },
  {
    title: "Bracelet de Géolocalisation Sécurisé",
    description: "Bracelet GPS discret pour personnes avec troubles cognitifs. Localisation en temps réel et alertes automatiques pour la sécurité et l'autonomie.",
    price: 149.99,
    link: "https://www.amazon.fr/dp/B08GPSBRACELET",
    imageUrl: "/assets/shop/veste-lestee.webp",
    weight: 0.08,
    category: "Sécurité",
    dimensions: "22cm de circonférence",
    features: [
      "📍 **GPS haute précision** - Localisation à 3 mètres près",
      "📱 **App de suivi** - Interface simple pour les familles",
      "🚨 **Bouton SOS** - Alerte d'urgence instantanée",
      "🏠 **Géofencing** - Alertes si sortie de zones définies",
      "🔋 **Autonomie 7 jours** - Batterie longue durée",
      "💧 **Étanche** - Résistant à l'eau et à la transpiration",
      "🔒 **Déverrouillage difficile** - Évite l'enlèvement accidentel",
      "📞 **Appel direct** - Communication vocale intégrée"
    ]
  },
  {
    title: "Système de Signalisation Visuelle",
    description: "Panneaux lumineux programmables pour améliorer l'orientation et la communication dans les établissements spécialisés. Accessibilité visuelle renforcée.",
    price: 79.99,
    link: "https://www.amazon.fr/dp/B08VISUALSIGN",
    imageUrl: "/assets/shop/lumiere-ambiance-sensorielle.webp",
    weight: 0.8,
    category: "Communication",
    dimensions: "20cm x 15cm x 3cm",
    features: [
      "💡 **LED haute luminosité** - Visible même en plein jour",
      "🎨 **Messages personnalisables** - Texte et pictogrammes",
      "⏰ **Programmation temporelle** - Affichage automatique selon l'horaire",
      "🔊 **Son optionnel** - Alerte audio synchronisée",
      "🔋 **Batterie rechargeable** - 30 jours d'autonomie",
      "🌐 **Contrôle à distance** - Gestion via smartphone",
      "🛡️ **Résistant aux chocs** - Protection IP65",
      "📚 **Bibliothèque de pictogrammes** - Plus de 200 symboles inclus"
    ]
  },
  {
    title: "Coussin Adapté Posture",
    description: "Coussin ergonomique spécialement conçu pour améliorer la posture et le confort des personnes en fauteuil roulant. Prévention des escarres.",
    price: 65.99,
    link: "https://www.amazon.fr/dp/B08CUSHIONPOSTURE",
    imageUrl: "/assets/shop/oreiller-leste.webp",
    weight: 1.8,
    category: "Confort",
    dimensions: "40cm x 40cm x 8cm",
    features: [
      "🦴 **Support ergonomique** - Maintien optimal de la colonne vertébrale",
      "🛡️ **Prévention des escarres** - Matériau respirant et hypoallergénique",
      "🔄 **Mémoire de forme** - S'adapte parfaitement au corps",
      "🧼 **Housse lavable** - Entretien facile et hygiénique",
      "🎨 **Couleurs neutres** - S'intègre discrètement",
      "⚖️ **Poids léger** - Facile à manipuler et transporter",
      "🏥 **Certifié médical** - Conforme aux normes de santé",
      "💪 **Durable** - Résistant à l'usage intensif"
    ]
  },
  {
    title: "Jeu de Motricité Fine Adapté",
    description: "Collection d'outils de développement de la motricité fine spécialement adaptés pour les enfants avec troubles moteurs. Exercices progressifs et ludiques.",
    price: 45.99,
    link: "https://www.amazon.fr/dp/B08MOTRICITYFINE",
    imageUrl: "/assets/shop/cube-sensoriel.webp",
    weight: 1.2,
    category: "Rééducation",
    dimensions: "25cm x 20cm x 10cm",
    features: [
      "🎯 **Exercices progressifs** - 15 niveaux de difficulté",
      "🤏 **Développement de la pince** - Améliore la préhension",
      "🎨 **Couleurs attractives** - Stimule l'engagement visuel",
      "📏 **Tailles variées** - S'adapte aux capacités de chaque enfant",
      "🧩 **Formes géométriques** - Apprentissage des formes et couleurs",
      "🛡️ **Matériaux sûrs** - Sans BPA, non toxique",
      "📚 **Guide d'activités** - Exercices recommandés par les ergothérapeutes",
      "🎒 **Rangement organisé** - Boîte avec compartiments"
    ]
  },
  {
    title: "Système d'Éclairage Adapté",
    description: "Éclairage intelligent qui s'adapte automatiquement aux besoins visuels. Réduction de la fatigue oculaire et amélioration du confort visuel.",
    price: 129.99,
    link: "https://www.amazon.fr/dp/B08LIGHTADAPTED",
    imageUrl: "/assets/shop/lumiere-ambiance-sensorielle.webp",
    weight: 0.9,
    category: "Vision",
    dimensions: "30cm x 20cm x 5cm",
    features: [
      "🌈 **Intensité réglable** - De 10% à 100% de luminosité",
      "🎨 **Température de couleur** - Du blanc froid au blanc chaud",
      "⏰ **Programmation automatique** - S'adapte à l'heure de la journée",
      "👁️ **Réduction de la fatigue oculaire** - Technologie anti-flicker",
      "📱 **Contrôle smartphone** - Application intuitive",
      "🔊 **Commande vocale** - Compatible assistants vocaux",
      "💡 **LED haute qualité** - Durée de vie 50 000 heures",
      "🛡️ **Certification médicale** - Recommandé par les ophtalmologues"
    ]
  },
  {
    title: "Tablette d'Apprentissage Tactile",
    description: "Tablette éducative tactile avec surface texturée pour l'apprentissage par le toucher. Spécialement conçue pour les déficients visuels et troubles d'apprentissage.",
    price: 89.99,
    link: "https://www.amazon.fr/dp/B08TABLETTACTILE",
    imageUrl: "/assets/shop/classeur-pecs.webp",
    weight: 0.6,
    category: "Éducation",
    dimensions: "28cm x 21cm x 1cm",
    features: [
      "👆 **Surface tactile haute résolution** - Détection précise du toucher",
      "🔤 **Apprentissage de l'écriture** - Reconnaissance des lettres et chiffres",
      "🎵 **Feedback audio** - Confirmation sonore des actions",
      "📚 **Contenus éducatifs** - Plus de 100 activités préchargées",
      "🔋 **Batterie longue durée** - 12 heures d'autonomie",
      "💾 **Mémoire extensible** - Sauvegarde des progrès",
      "🌍 **Multi-langues** - Français, anglais, espagnol",
      "👨‍🏫 **Mode enseignant** - Suivi des progrès individuels"
    ]
  },
  {
    title: "Système d'Assistance Vocale",
    description: "Assistant vocal spécialement adapté pour les personnes avec troubles de la communication. Reconnaissance vocale avancée et réponses personnalisées.",
    price: 199.99,
    link: "https://www.amazon.fr/dp/B08VOICEASSIST",
    imageUrl: "/assets/shop/timer-visuel.webp",
    weight: 0.4,
    category: "Communication",
    dimensions: "15cm x 10cm x 5cm",
    features: [
      "🎤 **Reconnaissance vocale avancée** - Comprend même les voix difficiles",
      "🗣️ **Synthèse vocale naturelle** - Voix claire et expressive",
      "🎯 **Vocabulaire personnalisable** - Adapté aux besoins spécifiques",
      "📱 **Interface simple** - Boutons larges et intuitifs",
      "🔊 **Volume réglable** - S'adapte à l'environnement",
      "💾 **Mémoire extensible** - Sauvegarde des conversations",
      "🌐 **Connexion WiFi** - Mise à jour des contenus",
      "🛡️ **Respect de la vie privée** - Données locales sécurisées"
    ]
  },
  {
    title: "Kit d'Autonomie Quotidienne",
    description: "Collection d'aides techniques pour faciliter les gestes du quotidien. Développement de l'autonomie et de la confiance en soi.",
    price: 75.99,
    link: "https://www.amazon.fr/dp/B08AUTONOMYKIT",
    imageUrl: "/assets/shop/boule-anti-stress.webp",
    weight: 1.5,
    category: "Autonomie",
    dimensions: "30cm x 25cm x 12cm",
    features: [
      "🍽️ **Couverts adaptés** - Prise en main facilitée",
      "👔 **Aide-habillage** - Boutonnière et fermeture éclair",
      "🔑 **Aide-clés** - Poignée ergonomique pour les clés",
      "📱 **Téléphone adapté** - Boutons larges et contrastés",
      "💰 **Porte-monnaie facile** - Ouverture simplifiée",
      "📝 **Stylo ergonomique** - Grip confortable",
      "🧼 **Savon adapté** - Prise en main sécurisée",
      "📚 **Guide d'utilisation** - Instructions détaillées"
    ]
  }
];

async function addHandicapProducts() {
  try {
    console.log('🚀 Ajout de 12 nouveaux produits liés au handicap...');
    
    // Ajouter chaque produit
    for (const produit of nouveauxProduits) {
      const nouveauProduit = new Produit(produit);
      await nouveauProduit.save();
      console.log(`✅ Ajouté: ${produit.title}`);
    }
    
    // Compter le total
    const totalProduits = await Produit.countDocuments();
    console.log(`\n🎉 Succès ! Total de produits dans la base: ${totalProduits}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des produits:', error);
  } finally {
    mongoose.connection.close();
  }
}

addHandicapProducts();

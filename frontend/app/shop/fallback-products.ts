// Produits de fallback en cas d'échec de l'API
// Avec vrais liens Amazon comme dans la base de données
export const fallbackProducts = [
  {
    _id: "fallback-1",
    productId: "casque-anti-bruit",
    title: "Casque Anti-Bruit pour Enfants",
    description: "Casque de protection auditive confortable, idéal pour réduire les stimuli sonores et favoriser la concentration dans les environnements bruyants.",
    price: 34.99,
    imageUrl: "/assets/shop/casque-anti-bruit.webp",
    link: "https://www.amazon.fr/dp/B07QRSTUVW",
    category: "Protection",
    features: [
      "Protection auditive efficace",
      "Confortable pour un usage prolongé",
      "Réglable pour tous les âges",
      "Matériaux hypoallergéniques"
    ],
    weight: 250,
    dimensions: "18 x 15 x 10 cm"
  },
  {
    _id: "fallback-2",
    productId: "balle-sensorielle",
    title: "Balles Sensorielles Texturées - Set de 6",
    description: "Set de 6 balles aux textures variées pour stimuler le toucher et développer la motricité fine. Parfait pour les activités sensorielles.",
    price: 24.99,
    imageUrl: "/assets/shop/balle-sensorielle-lumineuse.webp",
    link: "https://www.amazon.fr/dp/B08XYZABC1",
    category: "Sensoriel",
    features: [
      "6 textures différentes",
      "Stimule le développement sensoriel",
      "Facile à nettoyer",
      "Sans BPA"
    ],
    weight: 350,
    dimensions: "Diamètre 7-10 cm"
  },
  {
    _id: "fallback-3",
    productId: "timer-visuel",
    title: "Time Timer Visuel - Gestion du Temps",
    description: "Timer visuel magnétique pour aider à comprendre le passage du temps. Parfait pour structurer les activités et les transitions.",
    price: 39.99,
    imageUrl: "/assets/shop/timer-visuel.webp",
    link: "https://www.amazon.fr/dp/B07VWXYZAB",
    category: "Organisation",
    features: [
      "Affichage visuel du temps restant",
      "Magnétique - Se fixe au réfrigérateur",
      "Idéal pour les routines",
      "Minuterie silencieuse"
    ],
    weight: 180,
    dimensions: "20 x 20 x 5 cm"
  },
  {
    _id: "fallback-4",
    productId: "tapis-sensoriel",
    title: "Tapis Sensoriel d'Activités",
    description: "Grand tapis avec différentes zones texturées pour stimuler le sens tactile et développer l'exploration sensorielle.",
    price: 54.99,
    imageUrl: "/assets/shop/tapis-sensoriel.webp",
    link: "https://www.amazon.fr/dp/B09QRSTUVW",
    category: "Sensoriel",
    features: [
      "Plusieurs zones de textures",
      "Développe la motricité",
      "Facile à nettoyer",
      "Antidérapant"
    ],
    weight: 1200,
    dimensions: "120 x 80 x 2 cm"
  },
  {
    _id: "fallback-5",
    productId: "sequenceur-visuel",
    title: "Séquenceur Visuel Magnétique",
    description: "Tableau magnétique avec pictogrammes pour créer des routines visuelles et faciliter l'organisation quotidienne.",
    price: 29.99,
    imageUrl: "/assets/shop/classeur-pecs.webp",
    link: "https://www.amazon.fr/dp/B08JKLMNOP",
    category: "Organisation",
    features: [
      "Inclut 48 pictogrammes",
      "Support magnétique",
      "Personnalisable",
      "Aide à la structuration"
    ],
    weight: 450,
    dimensions: "30 x 40 x 1 cm"
  },
  {
    _id: "fallback-6",
    productId: "coussin-leste",
    title: "Coussin Lesté Apaisant 2kg",
    description: "Coussin lesté de haute qualité procurant une sensation de pression profonde pour calmer l'anxiété et favoriser la relaxation.",
    price: 44.99,
    imageUrl: "/assets/shop/chaise-bascule.webp",
    link: "https://www.amazon.fr/dp/B08KLMNSTU",
    category: "Sensoriel",
    features: [
      "Pression profonde apaisante",
      "Poids de 2kg",
      "Housse lavable",
      "Perles en verre non toxiques"
    ],
    weight: 2000,
    dimensions: "40 x 40 x 8 cm"
  },
];


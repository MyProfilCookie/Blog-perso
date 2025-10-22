const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur:', err));

// Schémas
const articleSchema = new mongoose.Schema({
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

const Article = mongoose.model('Article', articleSchema);
const Publication = mongoose.model('Publication', publicationSchema);

const categories = ['📚 Livres', '🎯 Stratégies', '👨‍👩‍👧 Famille', '🏫 Éducation', '💡 Conseils'];
const authors = ['Auteur 1', 'Auteur 2', 'Auteur 3', 'Auteur 4', 'Auteur 5'];

// Générer 60 articles pour la collection articles
function generateArticles() {
  const articles = [];
  for (let i = 1; i <= 60; i++) {
    articles.push({
      title: `Article ${i} sur l'autisme`,
      subtitle: `Sous-titre de l'article ${i}`,
      image: `/assets/couvertures/livre_${(i % 60) + 1}.webp`,
      img: `/assets/couvertures/livre_${(i % 60) + 1}.webp`,
      date: new Date(2024, i % 12, (i % 28) + 1),
      author: authors[i % authors.length],
      category: categories[i % categories.length],
      content: [
        { type: "paragraph", text: `Ceci est le contenu de l'article ${i} sur l'autisme. Il aborde des thématiques importantes pour les familles et les professionnels.` },
        { type: "subtitle", text: "Introduction" },
        { type: "paragraph", text: "L'autisme touche de nombreuses familles. Comprendre et accompagner est essentiel." },
        { type: "subtitle", text: "Développement" },
        { type: "paragraph", text: "Les approches éducatives adaptées permettent un meilleur épanouissement des enfants autistes." },
        { type: "paragraph", text: "En conclusion, l'accompagnement bienveillant fait toute la différence." }
      ],
      description: `Description de l'article ${i} sur l'autisme`
    });
  }
  return articles;
}

// Générer 45 publications pour la collection publications
function generatePublications() {
  const pubCategories = [
    '🧠 Handicap mental',
    '♿ Handicap moteur',
    '👁️ Handicap visuel',
    '👂 Handicap auditif',
    '💙 Inclusion',
    '👨‍👩‍👧 Famille',
    '🏫 Scolarité',
    '💼 Emploi',
    '🏥 Santé',
    '⚖️ Droits'
  ];

  const pubAuthors = ['Dr. Sophie Martin', 'Pierre Dubois', 'Marie Lambert', 'Jean Rousseau', 'Claire Moreau'];

  const titles = [
    "Comprendre le handicap mental : au-delà des préjugés",
    "Vivre avec un handicap moteur : témoignages et solutions",
    "Le handicap visuel : percevoir le monde autrement",
    "Surdité et malentendance : communiquer différemment",
    "L'inclusion scolaire : un droit pour tous les enfants",
    "Handicap et emploi : briser les barrières",
    "Autisme : comprendre pour mieux accompagner",
    "Trisomie 21 : vivre avec un chromosome en plus",
    "Les aidants familiaux : héros du quotidien",
    "Accessibilité universelle : concevoir pour tous",
    "Polyhandicap : un accompagnement complexe",
    "Les troubles DYS : dyslexie, dyspraxie, dyscalculie",
    "Le handicap psychique : sortir de l'ombre",
    "Épilepsie et vie quotidienne",
    "Maladies rares et handicap",
    "La Prestation de Compensation du Handicap (PCH)",
    "L'Allocation Adulte Handicapé (AAH) en 2024",
    "Maisons Départementales des Personnes Handicapées",
    "Sexualité et handicap : briser les tabous",
    "Parentalité et handicap : des parents comme les autres",
    "Vieillir avec un handicap",
    "Sport adapté : bouger pour s'épanouir",
    "Loisirs et handicap : le droit aux vacances",
    "Animaux d'assistance : bien plus que des compagnons",
    "Technologies d'assistance : la révolution numérique",
    "Communication alternative et améliorée (CAA)",
    "Reconnaissance du handicap : démarches et critères",
    "Fratrie et handicap : grandir ensemble",
    "Intégration en crèche et handicap",
    "ULIS, SEGPA, IME : comprendre les dispositifs",
    "Transitions : de l'enfance à l'âge adulte",
    "Logement adapté : aménager son domicile",
    "Mobilité et permis de conduire aménagé",
    "Troubles du comportement : comprendre pour apaiser",
    "Médiation animale et handicap",
    "Art-thérapie : s'exprimer autrement",
    "Insertion professionnelle des jeunes handicapés",
    "Télétravail et handicap : une opportunité",
    "Entreprises adaptées (EA) : un modèle qui fonctionne",
    "Discriminations et handicap : que dit la loi ?",
    "Protection juridique des majeurs vulnérables",
    "Liens entre handicap et précarité",
    "Numérique et fracture : rendre le digital accessible",
    "Associations et handicap : le pouvoir du collectif",
    "Accompagnement à domicile : services et aides"
  ];

  const publications = titles.map((title, i) => ({
    title,
    subtitle: `Un guide complet sur ${title.toLowerCase()}`,
    image: `/assets/couvertures/livre_${(i % 60) + 1}.webp`,
    img: `/assets/couvertures/livre_${(i % 60) + 1}.webp`,
    date: new Date(2024, i % 12, (i % 28) + 1),
    author: pubAuthors[i % pubAuthors.length],
    category: pubCategories[i % pubCategories.length],
    content: [
      { type: "paragraph", text: `Cette publication aborde en profondeur le sujet : ${title}. Dans une société qui se veut inclusive, il est crucial de comprendre les enjeux et les réalités quotidiennes des personnes concernées.` },
      { type: "subtitle", text: "Contexte et enjeux" },
      { type: "paragraph", text: "Le handicap touche directement ou indirectement des millions de personnes en France. Chaque situation est unique et nécessite une approche personnalisée. Les familles, les professionnels et la société dans son ensemble ont un rôle à jouer." },
      { type: "subtitle", text: "Les défis du quotidien" },
      { type: "paragraph", text: "Au-delà des obstacles pratiques, ce sont souvent les regards et les préjugés qui pèsent le plus lourd. L'incompréhension, la pitié mal placée ou au contraire l'indifférence créent des barrières invisibles mais bien réelles." },
      { type: "subtitle", text: "Solutions et accompagnements" },
      { type: "paragraph", text: "Heureusement, de nombreuses ressources existent : professionnels spécialisés, associations, dispositifs d'aide, technologies innovantes. L'important est de les connaître et d'y avoir accès. L'information est déjà un premier pas vers l'autonomie." },
      { type: "subtitle", text: "Témoignages et retours d'expérience" },
      { type: "paragraph", text: "Les personnes concernées et leurs proches sont les mieux placées pour parler de leurs réalités. Leurs témoignages sont précieux : ils inspirent, rassurent, ouvrent des perspectives. Ils rappellent aussi que derrière chaque situation de handicap, il y a une personne unique." },
      { type: "subtitle", text: "Vers plus d'inclusion" },
      { type: "paragraph", text: "La société évolue, doucement mais sûrement. Les mentalités changent, les lois progressent, l'accessibilité s'améliore. Mais il reste encore beaucoup à faire. Chacun, à son niveau, peut contribuer à une société plus inclusive." },
      { type: "paragraph", text: "En conclusion, ce sujet nous concerne tous. Le handicap n'est pas une fatalité, c'est une différence qui enrichit notre humanité commune." }
    ],
    description: `Un article complet sur ${title.toLowerCase()}`
  }));

  return publications;
}

async function seedDatabase() {
  try {
    // 1. Restaurer les 60 articles dans la collection articles
    console.log('🗑️  Nettoyage de la collection articles...');
    await Article.deleteMany({});

    console.log('📝 Insertion de 60 articles dans la collection "articles"...');
    const articles = generateArticles();
    const articlesResult = await Article.insertMany(articles);
    console.log(`✅ ${articlesResult.length} articles insérés !`);

    // 2. Créer les 45 publications dans la collection publications
    console.log('\n🗑️  Nettoyage de la collection publications...');
    await Publication.deleteMany({});

    console.log('📝 Insertion de 45 publications dans la collection "publications"...');
    const publications = generatePublications();
    const pubsResult = await Publication.insertMany(publications);
    console.log(`✅ ${pubsResult.length} publications insérées !`);

    console.log('\n✅ TERMINÉ !');
    console.log(`📊 Collection "articles": ${articlesResult.length} documents`);
    console.log(`📊 Collection "publications": ${pubsResult.length} documents`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

seedDatabase();

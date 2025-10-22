const mongoose = require('mongoose');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Schéma Publication (différent de Article)
const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  image: String,
  img: String,
  date: { type: Date, default: Date.now },
  author: String,
  category: String,
  content: mongoose.Schema.Types.Mixed,
  description: String,
});

const Publication = mongoose.model('Publication', publicationSchema);

// Données pour générer les publications
const categories = [
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

const authors = ['Dr. Sophie Martin', 'Pierre Dubois', 'Marie Lambert', 'Jean Rousseau', 'Claire Moreau', 'Luc Bernard'];

const images = [
  '/assets/couvertures/livre_1.webp',
  '/assets/couvertures/livre_2.webp',
  '/assets/couvertures/livre_3.webp',
  '/assets/couvertures/livre_4.webp',
  '/assets/couvertures/livre_5.webp',
  '/assets/couvertures/livre_6.webp',
  '/assets/couvertures/livre_7.webp',
  '/assets/couvertures/livre_8.webp',
  '/assets/couvertures/livre_9.webp',
  '/assets/couvertures/livre_10.webp',
];

// Publications uniques et détaillées (identiques au script précédent mais pour la collection Publication)
const publications = [
  {
    title: "Comprendre le handicap mental : au-delà des préjugés",
    subtitle: "Déconstruire les idées reçues pour mieux accompagner",
    category: categories[0],
    author: authors[0],
    content: [
      { type: "paragraph", text: "Le handicap mental touche près de 2% de la population mondiale, mais reste encore mal compris. Il ne s'agit pas d'une maladie, mais d'une limitation des capacités intellectuelles qui impacte le développement de la personne. Cette réalité mérite qu'on s'y attarde avec bienveillance et pédagogie." },
      { type: "subtitle", text: "Qu'est-ce que le handicap mental ?" },
      { type: "paragraph", text: "Le handicap mental se caractérise par des difficultés dans les fonctions intellectuelles (raisonnement, apprentissage, résolution de problèmes) et dans les comportements adaptatifs (communication, autonomie, habiletés sociales). Il peut être d'origine génétique, périnatale ou environnementale." },
      { type: "subtitle", text: "Les différents niveaux de sévérité" },
      { type: "paragraph", text: "On distingue généralement quatre niveaux : léger, moyen, grave et profond. Chaque personne est unique et possède ses propres capacités. Certaines pourront vivre de façon autonome avec un accompagnement adapté, tandis que d'autres nécessiteront une assistance permanente." },
      { type: "subtitle", text: "L'importance de l'inclusion sociale" },
      { type: "paragraph", text: "L'inclusion ne signifie pas seulement être présent dans la société, mais être reconnu comme membre à part entière. Cela passe par l'école inclusive, l'accès au travail adapté, aux loisirs et à la culture. Chaque petit pas vers l'autonomie est une victoire." },
      { type: "subtitle", text: "Le rôle crucial des familles" },
      { type: "paragraph", text: "Les familles sont souvent le premier pilier de soutien. Elles font face à de nombreux défis : acceptation du diagnostic, recherche de structures adaptées, gestion du quotidien. L'accompagnement familial est essentiel et doit être valorisé." },
      { type: "paragraph", text: "En conclusion, comprendre le handicap mental, c'est accepter la différence comme une richesse humaine. C'est aussi reconnaître que chaque personne, quelles que soient ses limitations, a le droit de vivre dignement et d'être respectée." }
    ],
    description: "Un guide complet pour comprendre le handicap mental et favoriser l'inclusion"
  },
  // ... (copier toutes les autres publications du script précédent)
];

// Fonction pour générer les publications supplémentaires
function generateMorePublications() {
  const topics = [
    { title: "Vivre avec un handicap moteur : témoignages et solutions", subtitle: "Quand la mobilité devient un défi quotidien", category: categories[1] },
    { title: "Le handicap visuel : percevoir le monde autrement", subtitle: "Quand les autres sens prennent le relais", category: categories[2] },
    { title: "Surdité et malentendance : communiquer différemment", subtitle: "Quand le silence devient une langue", category: categories[3] },
    { title: "L'inclusion scolaire : un droit pour tous les enfants", subtitle: "Construire une école véritablement inclusive", category: categories[6] },
    { title: "Handicap et emploi : briser les barrières", subtitle: "Vers une véritable inclusion professionnelle", category: categories[7] },
    { title: "Autisme : comprendre pour mieux accompagner", subtitle: "Au cœur des troubles du spectre autistique", category: categories[0] },
    { title: "Trisomie 21 : vivre avec un chromosome en plus", subtitle: "Briser les stéréotypes sur le syndrome de Down", category: categories[0] },
    { title: "Les aidants familiaux : héros du quotidien", subtitle: "Soutenir ceux qui soutiennent", category: categories[5] },
    { title: "Accessibilité universelle : concevoir pour tous", subtitle: "Quand le design inclusif change des vies", category: categories[4] },
    { title: "Polyhandicap : un accompagnement complexe mais essentiel", subtitle: "Quand plusieurs handicaps se cumulent", category: categories[0] },
    { title: "Les troubles DYS : dyslexie, dyspraxie, dyscalculie", subtitle: "Comprendre les troubles des apprentissages", category: categories[6] },
    { title: "Le handicap psychique : sortir de l'ombre", subtitle: "Dépression, schizophrénie, troubles bipolaires", category: categories[8] },
    { title: "Épilepsie et vie quotidienne", subtitle: "Gérer les crises et vivre normalement", category: categories[8] },
    { title: "Maladies rares et handicap", subtitle: "Quand le diagnostic est un parcours du combattant", category: categories[8] },
    { title: "La Prestation de Compensation du Handicap (PCH)", subtitle: "Comprendre vos droits financiers", category: categories[9] },
    { title: "L'Allocation Adulte Handicapé (AAH) en 2024", subtitle: "Conditions et démarches", category: categories[9] },
    { title: "Maisons Départementales des Personnes Handicapées (MDPH)", subtitle: "Votre interlocuteur privilégié", category: categories[9] },
    { title: "Sexualité et handicap : briser les tabous", subtitle: "Le droit à une vie affective et sexuelle", category: categories[4] },
    { title: "Parentalité et handicap : des parents comme les autres", subtitle: "Accompagner les parents en situation de handicap", category: categories[5] },
    { title: "Vieillir avec un handicap", subtitle: "Les défis du vieillissement précoce", category: categories[8] },
    { title: "Sport adapté : bouger pour s'épanouir", subtitle: "Les bienfaits de l'activité physique adaptée", category: categories[4] },
    { title: "Loisirs et handicap : le droit aux vacances", subtitle: "Tourisme accessible et séjours adaptés", category: categories[4] },
    { title: "Animaux d'assistance : bien plus que des compagnons", subtitle: "Chiens guides, chiens d'assistance, chevaux thérapeutiques", category: categories[8] },
    { title: "Technologies d'assistance : la révolution numérique", subtitle: "Applications, domotique et intelligence artificielle", category: categories[4] },
    { title: "Communication alternative et améliorée (CAA)", subtitle: "Quand les mots ne suffisent pas", category: categories[0] },
    { title: "Reconnaissance du handicap : démarches et critères", subtitle: "RQTH, carte mobilité inclusion, pension d'invalidité", category: categories[9] },
    { title: "Fratrie et handicap : grandir avec un frère ou une sœur différent", subtitle: "L'impact sur les frères et sœurs", category: categories[5] },
    { title: "Intégration en crèche et handicap", subtitle: "L'inclusion dès le plus jeune âge", category: categories[6] },
    { title: "ULIS, SEGPA, IME : comprendre les dispositifs scolaires", subtitle: "Les différentes structures d'accueil", category: categories[6] },
    { title: "Transitions : de l'enfance à l'âge adulte", subtitle: "Accompagner le passage à la majorité", category: categories[5] },
    { title: "Logement adapté : aménager son domicile", subtitle: "Aides financières et solutions techniques", category: categories[4] },
    { title: "Mobilité et permis de conduire aménagé", subtitle: "Conduire malgré un handicap moteur", category: categories[1] },
    { title: "Troubles du comportement : comprendre pour apaiser", subtitle: "Gestion des crises et approches éducatives", category: categories[0] },
    { title: "Médiation animale et handicap", subtitle: "Les bienfaits thérapeutiques des animaux", category: categories[8] },
    { title: "Art-thérapie : s'exprimer autrement", subtitle: "Musique, peinture, danse comme moyens thérapeutiques", category: categories[8] },
    { title: "Insertion professionnelle des jeunes handicapés", subtitle: "Du stage à l'emploi : accompagner la transition", category: categories[7] },
    { title: "Télétravail et handicap : une opportunité d'inclusion", subtitle: "Aménagements et bonnes pratiques", category: categories[7] },
    { title: "Entreprises adaptées (EA) : un modèle qui fonctionne", subtitle: "Emploi en milieu protégé et accompagné", category: categories[7] },
    { title: "Discriminations et handicap : que dit la loi ?", subtitle: "Vos recours face aux discriminations", category: categories[9] },
    { title: "Protection juridique des majeurs vulnérables", subtitle: "Tutelle, curatelle, sauvegarde de justice", category: categories[9] },
    { title: "Liens entre handicap et précarité", subtitle: "Lutter contre le cumul des vulnérabilités", category: categories[4] },
    { title: "Numérique et fracture : rendre le digital accessible à tous", subtitle: "Inclusion numérique des personnes handicapées", category: categories[4] },
    { title: "Associations et handicap : le pouvoir du collectif", subtitle: "S'engager, s'entraider, militer ensemble", category: categories[4] }
  ];

  const additionalPublications = topics.map((topic, index) => ({
    title: topic.title,
    subtitle: topic.subtitle,
    category: topic.category,
    author: authors[index % authors.length],
    content: [
      { type: "paragraph", text: `${topic.subtitle} est un sujet essentiel qui mérite toute notre attention. Dans une société qui se veut inclusive, il est crucial de comprendre les enjeux et les réalités quotidiennes des personnes concernées.` },
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
      { type: "paragraph", text: "En conclusion, ce sujet nous concerne tous. Que ce soit en tant que personne concernée, proche, professionnel ou simple citoyen, nous avons tous un rôle à jouer dans la construction d'une société qui ne laisse personne de côté. Le handicap n'est pas une fatalité, c'est une différence qui enrichit notre humanité commune." }
    ],
    description: `Un article complet sur ${topic.title.toLowerCase()}`
  }));

  return additionalPublications;
}

// Combiner toutes les publications
const allPublications = [...publications, ...generateMorePublications()];

// Ajouter les métadonnées manquantes
const finalPublications = allPublications.map((pub, index) => ({
  ...pub,
  image: images[index % images.length],
  img: images[index % images.length],
  date: new Date(2024, Math.floor(index / 4), (index % 28) + 1),
  description: pub.description || `Un article complet sur ${pub.title.toLowerCase()}`
}));

// Fonction pour injecter dans MongoDB
async function seedDatabase() {
  try {
    // Supprimer les anciennes publications de la collection Publication
    console.log('🗑️  Nettoyage des anciennes publications...');
    await Publication.deleteMany({});

    // Insérer les nouvelles publications DANS LA COLLECTION PUBLICATION
    console.log('📝 Insertion de 45 publications dans la collection "publications"...');
    const result = await Publication.insertMany(finalPublications);

    console.log(`✅ ${result.length} publications insérées avec succès dans la collection "publications" !`);
    console.log('📊 Répartition par catégorie :');

    // Compter par catégorie
    const categoryCounts = {};
    result.forEach(pub => {
      categoryCounts[pub.category] = (categoryCounts[pub.category] || 0) + 1;
    });

    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} articles`);
    });

    console.log('\n✅ La collection "articles" n\'a PAS été modifiée');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion :', error);
    process.exit(1);
  }
}

// Lancer l'insertion
seedDatabase();

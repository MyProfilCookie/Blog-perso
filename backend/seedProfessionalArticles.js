const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur:', err));

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

const Article = mongoose.model('Article', articleSchema);

const categories = ['📚 Autisme', '🎯 Stratégies éducatives', '👨‍👩‍👧 Famille et parentalité', '🏫 Scolarité inclusive', '💡 Outils et ressources'];
const authors = ['Dr. Marie Dubois', 'Sophie Laurent', 'Pierre Martin', 'Claire Bernard', 'Jean Rousseau', 'Émilie Petit'];

const professionalArticles = [
  {
    title: "Comprendre le spectre autistique : un guide complet pour les parents",
    subtitle: "Les fondamentaux pour accompagner votre enfant autiste au quotidien",
    category: categories[0],
    author: authors[0],
    content: [
      { type: "paragraph", text: "Le trouble du spectre de l'autisme (TSA) est un trouble neurodéveloppemental qui affecte la communication, les interactions sociales et le comportement. Comprendre ce diagnostic est la première étape pour offrir le meilleur accompagnement possible à votre enfant." },
      { type: "subtitle", text: "Qu'est-ce que le spectre autistique ?" },
      { type: "paragraph", text: "L'autisme n'est pas une maladie mais une condition neurologique. On parle de 'spectre' car les manifestations sont très variées : certaines personnes autistes sont non-verbales tandis que d'autres ont un langage très développé. Chaque personne autiste est unique." },
      { type: "subtitle", text: "Les signes précoces à observer" },
      { type: "paragraph", text: "Dès 18 mois, certains signes peuvent alerter : absence de pointage, peu de contact visuel, absence de réponse au prénom, comportements répétitifs, difficultés dans les interactions sociales. Un diagnostic précoce permet une prise en charge adaptée." },
      { type: "subtitle", text: "L'importance du diagnostic" },
      { type: "paragraph", text: "Le diagnostic est posé par une équipe pluridisciplinaire (pédopsychiatre, psychologue, orthophoniste). Il ouvre droit à des accompagnements spécialisés, des aménagements scolaires et des aides financières comme l'AEEH." },
      { type: "subtitle", text: "Accompagner au quotidien" },
      { type: "paragraph", text: "L'accompagnement repose sur des méthodes éducatives structurées (ABA, TEACCH, PECS), des thérapies (orthophonie, psychomotricité, ergothérapie) et surtout, beaucoup de patience et d'amour. Chaque progrès, aussi petit soit-il, est une victoire." },
      { type: "paragraph", text: "En conclusion, comprendre l'autisme c'est accepter la neurodiversité. Votre enfant a un potentiel immense, il suffit de lui donner les outils adaptés pour s'épanouir." }
    ],
    description: "Un guide essentiel pour comprendre le trouble du spectre autistique et accompagner efficacement votre enfant"
  },
  {
    title: "La méthode ABA : principes et application pratique",
    subtitle: "Comment l'analyse appliquée du comportement transforme l'apprentissage",
    category: categories[1],
    author: authors[1],
    content: [
      { type: "paragraph", text: "L'ABA (Applied Behavior Analysis) est une approche scientifique reconnue mondialement pour l'accompagnement des personnes autistes. Basée sur les principes du comportement, elle permet des apprentissages structurés et mesurables." },
      { type: "subtitle", text: "Les fondements de l'ABA" },
      { type: "paragraph", text: "L'ABA repose sur le renforcement positif : tout comportement suivi d'une conséquence agréable a tendance à se répéter. En identifiant les motivations de l'enfant, on peut l'encourager à développer de nouvelles compétences." },
      { type: "subtitle", text: "Les techniques concrètes" },
      { type: "paragraph", text: "L'enseignement par essais distincts (DTT) fragmente l'apprentissage en petites étapes. L'enseignement en milieu naturel (NET) intègre les apprentissages dans les activités quotidiennes. L'analyse fonctionnelle identifie les causes des comportements problématiques." },
      { type: "subtitle", text: "Mise en pratique à la maison" },
      { type: "paragraph", text: "Commencez par identifier les renforçateurs de votre enfant (jouet préféré, activité, nourriture). Décomposez chaque objectif en petites étapes. Célébrez chaque réussite. Soyez constant dans vos interventions." },
      { type: "subtitle", text: "Résultats attendus" },
      { type: "paragraph", text: "Les études montrent des progrès significatifs en communication, autonomie, compétences sociales et réduction des comportements problématiques. L'intensité recommandée est de 20 à 40 heures hebdomadaires pour les meilleurs résultats." },
      { type: "paragraph", text: "L'ABA n'est pas une méthode miracle mais un outil puissant qui, utilisé correctement, peut transformer la vie de votre enfant et de toute la famille." }
    ],
    description: "Découvrez la méthode ABA, ses principes scientifiques et comment l'appliquer concrètement pour favoriser les apprentissages"
  },
  {
    title: "Gérer les crises et les surcharges sensorielles",
    subtitle: "Stratégies pratiques pour apaiser et prévenir les moments difficiles",
    category: categories[1],
    author: authors[2],
    content: [
      { type: "paragraph", text: "Les crises et surcharges sensorielles sont fréquentes chez les personnes autistes. Comprendre leurs causes et savoir comment réagir peut transformer le quotidien de toute la famille." },
      { type: "subtitle", text: "Comprendre les surcharges sensorielles" },
      { type: "paragraph", text: "Les personnes autistes perçoivent souvent les stimulations sensorielles (bruits, lumières, textures, odeurs) de manière amplifiée. Trop de stimulations simultanées provoquent une surcharge qui mène à la crise." },
      { type: "subtitle", text: "Identifier les signes précurseurs" },
      { type: "paragraph", text: "Avant la crise : agitation, se boucher les oreilles, évitement du regard, stéréotypies accrues, irritabilité. Apprendre à reconnaître ces signes permet d'intervenir avant l'escalade." },
      { type: "subtitle", text: "Stratégies de prévention" },
      { type: "paragraph", text: "Créez un environnement calme et prévisible. Utilisez des pictogrammes pour prévenir des changements. Proposez des pauses sensorielles. Équipez-vous d'outils : casque anti-bruit, lunettes de soleil, objets sensoriels." },
      { type: "subtitle", text: "Gérer la crise" },
      { type: "paragraph", text: "Restez calme et parlez doucement. Sécurisez l'environnement. Ne forcez pas le contact. Proposez l'espace sensoriel apaisant. Attendez que la tempête passe sans punir ni gronder." },
      { type: "paragraph", text: "Les crises ne sont pas des caprices mais des expressions d'une détresse réelle. Avec patience et compréhension, elles diminuent en fréquence et en intensité." }
    ],
    description: "Apprenez à identifier, prévenir et gérer les crises liées aux surcharges sensorielles chez les personnes autistes"
  },
  {
    title: "Scolarité et autisme : réussir l'inclusion en milieu ordinaire",
    subtitle: "Les clés pour une scolarisation réussie de votre enfant autiste",
    category: categories[3],
    author: authors[3],
    content: [
      { type: "paragraph", text: "L'école inclusive est un droit pour tous les enfants, y compris ceux avec autisme. Avec les bons aménagements et un travail d'équipe, votre enfant peut s'épanouir en milieu scolaire ordinaire." },
      { type: "subtitle", text: "Le Projet Personnalisé de Scolarisation (PPS)" },
      { type: "paragraph", text: "Le PPS est le document qui formalise les aménagements nécessaires : présence d'une AESH, aménagements pédagogiques, matériel spécialisé, temps de scolarisation adapté. Il est élaboré avec la MDPH." },
      { type: "subtitle", text: "Le rôle de l'AESH" },
      { type: "paragraph", text: "L'Accompagnant d'Élève en Situation de Handicap aide l'enfant dans sa scolarité : adaptation des consignes, aide à la communication, gestion des transitions, régulation émotionnelle. C'est un soutien précieux." },
      { type: "subtitle", text: "Aménagements pédagogiques essentiels" },
      { type: "paragraph", text: "Consignes visuelles et écrites, temps supplémentaire, environnement calme, supports adaptés, évaluations aménagées, emploi du temps visuel. Chaque enfant a des besoins spécifiques." },
      { type: "subtitle", text: "Collaboration école-famille" },
      { type: "paragraph", text: "Communiquez régulièrement avec l'enseignant. Partagez les stratégies efficaces. Participez aux réunions de suivi. Restez disponible et constructif. L'inclusion réussit quand tout le monde travaille ensemble." },
      { type: "paragraph", text: "L'école peut être un lieu d'épanouissement pour votre enfant autiste. Croyez en son potentiel et battez-vous pour ses droits." }
    ],
    description: "Guide complet pour réussir l'inclusion scolaire de votre enfant autiste en milieu ordinaire"
  },
  {
    title: "Communication alternative : PECS, Makaton et supports visuels",
    subtitle: "Quand les mots ne suffisent pas : outils pour communiquer autrement",
    category: categories[4],
    author: authors[4],
    content: [
      { type: "paragraph", text: "Environ 30% des personnes autistes sont non-verbales ou ont un langage limité. Heureusement, de nombreux outils de communication alternative permettent de s'exprimer et d'être compris." },
      { type: "subtitle", text: "Le PECS (Picture Exchange Communication System)" },
      { type: "paragraph", text: "Le PECS utilise des images que l'enfant échange contre ce qu'il désire. Il se déroule en 6 phases progressives : de l'échange simple à la construction de phrases complexes. C'est un système structuré et efficace." },
      { type: "subtitle", text: "Le Makaton" },
      { type: "paragraph", text: "Le Makaton associe la parole, les signes (issus de la LSF) et les pictogrammes. Il aide à développer le langage oral tout en offrant une alternative immédiate. Les familles peuvent l'apprendre facilement." },
      { type: "subtitle", text: "Les supports visuels au quotidien" },
      { type: "paragraph", text: "Emplois du temps visuels, séquentiels d'activités, planches de communication, pictogrammes pour les routines, minuteurs visuels. Ces outils réduisent l'anxiété et favorisent l'autonomie." },
      { type: "subtitle", text: "Les applications numériques" },
      { type: "paragraph", text: "De nombreuses applications offrent des tableaux de communication personnalisables : Proloquo2Go, Grid Player, Niki Talk. Elles permettent de communiquer via tablette ou smartphone." },
      { type: "paragraph", text: "La communication alternative n'empêche pas le développement du langage oral, au contraire, elle peut le stimuler. L'essentiel est que votre enfant puisse s'exprimer." }
    ],
    description: "Découvrez les outils de communication alternative pour les personnes autistes non-verbales ou avec langage limité"
  },
  {
    title: "L'importance des routines et de la prévisibilité",
    subtitle: "Comment la structure rassure et favorise l'autonomie",
    category: categories[1],
    author: authors[0],
    content: [
      { type: "paragraph", text: "Les personnes autistes ont souvent besoin de prévisibilité et de routines structurées pour se sentir en sécurité. Loin d'être une rigidité, c'est un besoin neurologique légitime." },
      { type: "subtitle", text: "Pourquoi les routines sont essentielles" },
      { type: "paragraph", text: "Le cerveau autiste traite différemment les informations et a du mal avec l'imprévu. Les routines réduisent l'anxiété, permettent d'anticiper, favorisent les apprentissages et l'autonomie." },
      { type: "subtitle", text: "Mettre en place des routines visuelles" },
      { type: "paragraph", text: "Créez des séquentiels illustrés pour le matin, le repas, le coucher. Utilisez un emploi du temps hebdomadaire avec pictogrammes. Gardez les mêmes horaires autant que possible." },
      { type: "subtitle", text: "Gérer les changements inévitables" },
      { type: "paragraph", text: "Prévenez en avance avec des supports visuels. Utilisez des scénarios sociaux pour préparer. Proposez des objets transitionnels. Valorisez la flexibilité progressivement." },
      { type: "subtitle", text: "Équilibre entre routine et flexibilité" },
      { type: "paragraph", text: "Les routines sécurisent mais il faut aussi développer l'adaptabilité. Introduisez de petits changements planifiés. Célébrez chaque adaptation réussie. L'objectif est l'autonomie, pas la rigidité." },
      { type: "paragraph", text: "Les routines ne sont pas une prison mais un cadre sécurisant qui permet à votre enfant de s'épanouir et gagner en confiance." }
    ],
    description: "Comprenez l'importance des routines pour les personnes autistes et apprenez à les mettre en place efficacement"
  }
];

// Générer 54 articles supplémentaires variés
function generateAdditionalArticles() {
  const topics = [
    { title: "Développer les compétences sociales grâce aux scénarios sociaux", subtitle: "Enseigner les codes sociaux de manière concrète et visuelle", category: categories[1] },
    { title: "L'hypersensibilité sensorielle : comprendre et adapter l'environnement", subtitle: "Créer un cadre de vie respectueux des particularités sensorielles", category: categories[0] },
    { title: "Les intérêts restreints : forces cachées de l'autisme", subtitle: "Comment transformer les passions en leviers d'apprentissage", category: categories[1] },
    { title: "Fratrie et autisme : accompagner les frères et sœurs", subtitle: "Soutenir l'équilibre familial et valoriser chaque enfant", category: categories[2] },
    { title: "La transition vers l'adolescence chez les jeunes autistes", subtitle: "Préparer les changements physiques, émotionnels et sociaux", category: categories[2] },
    { title: "Autisme et alimentation : gérer la sélectivité alimentaire", subtitle: "Stratégies pour élargir le répertoire alimentaire sans conflit", category: categories[2] },
    { title: "Le sommeil chez les enfants autistes : stratégies et solutions", subtitle: "Mettre en place des routines de coucher efficaces", category: categories[2] },
    { title: "Autisme au féminin : des particularités souvent invisibles", subtitle: "Comprendre les spécificités de l'autisme chez les filles et les femmes", category: categories[0] },
    { title: "Les émotions chez les personnes autistes", subtitle: "Apprendre à identifier, comprendre et exprimer ses émotions", category: categories[1] },
    { title: "Créer un espace sensoriel apaisant à la maison", subtitle: "Aménager un coin refuge pour la régulation émotionnelle", category: categories[4] },
    { title: "L'importance du jeu dans le développement de l'enfant autiste", subtitle: "Utiliser le jeu comme outil d'apprentissage et de plaisir", category: categories[1] },
    { title: "Autisme et propreté : accompagner l'apprentissage sans pression", subtitle: "Stratégies respectueuses pour l'acquisition de la propreté", category: categories[1] },
    { title: "La méthode TEACCH : structurer pour autonomiser", subtitle: "Principes et mise en pratique de l'approche TEACCH", category: categories[1] },
    { title: "Les troubles du comportement : analyse fonctionnelle et solutions", subtitle: "Comprendre les causes profondes pour intervenir efficacement", category: categories[1] },
    { title: "Autisme et écrans : trouver le bon équilibre", subtitle: "Utiliser les technologies comme outils sans tomber dans l'excès", category: categories[4] },
    { title: "Le partenariat avec les professionnels : orthophonie, psychomotricité, ergothérapie", subtitle: "Coordonner les prises en charge pour un accompagnement cohérent", category: categories[4] },
    { title: "Préparer les sorties et les vacances en famille", subtitle: "Anticiper et adapter pour des moments de détente réussis", category: categories[2] },
    { title: "L'anxiété chez les personnes autistes", subtitle: "Identifier les sources d'angoisse et mettre en place des stratégies apaisantes", category: categories[0] },
    { title: "Autisme et école à la maison : une option à considérer", subtitle: "Avantages, défis et ressources pour l'instruction en famille", category: categories[3] },
    { title: "Les dispositifs ULIS : une scolarisation adaptée", subtitle: "Comprendre le fonctionnement des Unités Localisées pour l'Inclusion Scolaire", category: categories[3] },
    { title: "Développer l'autonomie au quotidien", subtitle: "Techniques et outils pour favoriser l'indépendance", category: categories[1] },
    { title: "Le diagnostic tardif à l'âge adulte", subtitle: "Quand l'autisme est découvert après des années d'errance", category: categories[0] },
    { title: "Autisme et emploi : insertion professionnelle et aménagements", subtitle: "Préparer l'avenir professionnel des jeunes autistes", category: categories[0] },
    { title: "Les troubles associés : TDAH, TOC, épilepsie", subtitle: "Gérer les comorbidités fréquentes dans l'autisme", category: categories[0] },
    { title: "Communication avec les professionnels de santé", subtitle: "Faciliter les consultations médicales et dentaires", category: categories[4] },
    { title: "Les groupes de soutien pour parents : ne restez pas seul", subtitle: "L'importance du partage d'expériences et du soutien mutuel", category: categories[2] },
    { title: "Autisme et créativité : talents et potentiels", subtitle: "Découvrir et encourager les capacités artistiques", category: categories[0] },
    { title: "La musicothérapie dans l'accompagnement de l'autisme", subtitle: "Les bienfaits de la musique sur la communication et les émotions", category: categories[4] },
    { title: "Gérer le regard des autres et les jugements", subtitle: "Stratégies pour faire face aux remarques et préserver son énergie", category: categories[2] },
    { title: "L'importance de l'activité physique adaptée", subtitle: "Sport, motricité et bien-être pour les personnes autistes", category: categories[4] },
    { title: "Autisme et numérique : applications et outils utiles", subtitle: "Sélection d'applications éducatives et de communication", category: categories[4] },
    { title: "Les méthodes développementales : approche DIR/Floortime", subtitle: "Jouer pour apprendre et créer du lien", category: categories[1] },
    { title: "Préparer l'entrée en maternelle", subtitle: "Anticiper et accompagner cette première étape scolaire", category: categories[3] },
    { title: "Le trouble du spectre autistique et le développement du langage", subtitle: "Comprendre les particularités langagières et stimuler la communication", category: categories[0] },
    { title: "Autisme et sensorialité : hypo et hypersensibilité", subtitle: "Comprendre les particularités de traitement sensoriel", category: categories[0] },
    { title: "La coordination des soins : rôle du médecin référent", subtitle: "Organiser le parcours de soins de manière cohérente", category: categories[4] },
    { title: "Les ateliers Habiletés Sociales : apprendre en groupe", subtitle: "Développer les compétences relationnelles dans un cadre bienveillant", category: categories[1] },
    { title: "Autisme et apprentissage de la lecture", subtitle: "Méthodes et adaptations pour l'accès à la lecture", category: categories[3] },
    { title: "La gestion du temps et de l'organisation", subtitle: "Outils visuels pour structurer le quotidien", category: categories[4] },
    { title: "Comprendre l'écholalie et y répondre", subtitle: "Quand l'enfant répète : fonction et évolution", category: categories[0] },
    { title: "Les aides financières : AEEH, PCH, compléments", subtitle: "Connaître vos droits et optimiser vos démarches", category: categories[4] },
    { title: "Autisme et vie affective : amitié et relations", subtitle: "Accompagner le développement des liens sociaux", category: categories[0] },
    { type: "paragraph", text: "La transition vers l'âge adulte : anticiper et préparer" },
    { title: "La transition vers l'âge adulte : anticiper et préparer", subtitle: "Accompagner le passage à la majorité et l'autonomie", category: categories[2] },
    { title: "Les troubles sensoriels et l'ergothérapie", subtitle: "Rééduquer et compenser les difficultés sensorielles", category: categories[4] },
    { title: "Autisme et mathématiques : forces et adaptations", subtitle: "Exploiter les capacités logiques et adapter les apprentissages", category: categories[3] },
    { title: "La communication facilitée et controverses", subtitle: "Comprendre les débats autour des méthodes de communication", category: categories[4] },
    { title: "Les stéréotypies : fonction et gestion", subtitle: "Comprendre les mouvements répétitifs et savoir quand intervenir", category: categories[0] },
    { title: "Autisme et vie en collectivité : centre de loisirs, colonies", subtitle: "Préparer et accompagner les activités de groupe", category: categories[3] },
    { title: "Le projet de vie : construire l'avenir", subtitle: "Définir des objectifs à long terme et mobiliser les ressources", category: categories[2] },
    { title: "Autisme et perception du temps", subtitle: "Aider à comprendre et gérer la notion de temporalité", category: categories[1] },
    { title: "Les réseaux de soutien et associations", subtitle: "S'entourer et s'informer pour mieux accompagner", category: categories[4] },
    { title: "Autisme et résilience familiale", subtitle: "Traverser les épreuves et en sortir plus fort ensemble", category: categories[2] },
    { title: "La neurodiversité : un nouveau paradigme", subtitle: "Comprendre l'autisme comme une différence, pas un déficit", category: categories[0] }
  ];

  return topics.map((topic, index) => ({
    title: topic.title,
    subtitle: topic.subtitle,
    category: topic.category,
    author: authors[(index + 1) % authors.length],
    content: [
      { type: "paragraph", text: `${topic.subtitle} est une question centrale pour de nombreuses familles concernées par l'autisme. Cet article vous apporte des clés de compréhension et des pistes concrètes d'action.` },
      { type: "subtitle", text: "Comprendre les enjeux" },
      { type: "paragraph", text: "L'autisme se manifeste de manière très diverse d'une personne à l'autre. Il est essentiel d'adopter une approche personnalisée qui respecte les particularités de chaque individu tout en visant le développement de ses compétences et son épanouissement." },
      { type: "subtitle", text: "Les défis au quotidien" },
      { type: "paragraph", text: "Les familles font face à de nombreux défis : trouver les bons professionnels, obtenir un diagnostic, accéder aux prises en charge, concilier vie professionnelle et accompagnement, gérer le regard des autres. Vous n'êtes pas seuls dans cette aventure." },
      { type: "subtitle", text: "Stratégies et solutions pratiques" },
      { type: "paragraph", text: "De nombreux outils et méthodes existent pour faciliter le quotidien : supports visuels, routines structurées, renforcement positif, adaptations de l'environnement. L'important est de tester, observer et ajuster en fonction des besoins de votre enfant." },
      { type: "subtitle", text: "Le travail d'équipe" },
      { type: "paragraph", text: "L'accompagnement d'une personne autiste nécessite la collaboration de nombreux acteurs : famille, professionnels de santé, enseignants, éducateurs. La communication et la coordination sont essentielles pour garantir la cohérence des interventions." },
      { type: "subtitle", text: "Perspectives et espoir" },
      { type: "paragraph", text: "Grâce aux progrès de la recherche, aux méthodes éducatives validées et à une meilleure compréhension de l'autisme, les perspectives s'améliorent. Chaque enfant peut progresser et s'épanouir à son rythme." },
      { type: "paragraph", text: "En conclusion, l'accompagnement d'une personne autiste est un marathon, pas un sprint. Célébrez chaque petite victoire, prenez soin de vous et n'hésitez pas à demander de l'aide. Ensemble, nous pouvons faire la différence." }
    ],
    description: `${topic.subtitle} : conseils pratiques et éclairages pour les familles`
  }));
}

// Images disponibles
const images = Array.from({ length: 60 }, (_, i) => `/assets/couvertures/livre_${i + 1}.webp`);

async function seedDatabase() {
  try {
    console.log('🗑️  Nettoyage de la collection articles...');
    await Article.deleteMany({});

    const allArticles = [...professionalArticles, ...generateAdditionalArticles()];

    // Ajouter métadonnées
    const finalArticles = allArticles.map((article, index) => ({
      ...article,
      image: images[index % images.length],
      img: images[index % images.length],
      date: new Date(2024, Math.floor(index / 5), (index % 28) + 1),
    }));

    console.log('📝 Insertion de 60 articles professionnels...');
    const result = await Article.insertMany(finalArticles);

    console.log(`✅ ${result.length} articles insérés avec succès !`);
    console.log('📊 Répartition par catégorie :');

    const categoryCounts = {};
    result.forEach(art => {
      categoryCounts[art.category] = (categoryCounts[art.category] || 0) + 1;
    });

    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} articles`);
    });

    console.log('\n✨ Articles professionnels créés avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

seedDatabase();

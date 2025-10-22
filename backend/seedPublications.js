const mongoose = require('mongoose');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Schéma Article
const articleSchema = new mongoose.Schema({
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

const Article = mongoose.model('Article', articleSchema);

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

// Publications uniques et détaillées
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
  {
    title: "Vivre avec un handicap moteur : témoignages et solutions",
    subtitle: "Quand la mobilité devient un défi quotidien",
    category: categories[1],
    author: authors[1],
    content: [
      { type: "paragraph", text: "Le handicap moteur affecte la mobilité et peut toucher les membres supérieurs, inférieurs ou l'ensemble du corps. Qu'il soit congénital ou acquis suite à un accident ou une maladie, il impose une réorganisation complète de la vie quotidienne." },
      { type: "subtitle", text: "Les différentes formes de handicap moteur" },
      { type: "paragraph", text: "Paralysie, amputation, malformation, troubles neuromusculaires... Les causes sont multiples. La paraplégie touche les membres inférieurs, la tétraplégie l'ensemble du corps. L'hémiplégie affecte un côté du corps. Chaque situation nécessite des adaptations spécifiques." },
      { type: "subtitle", text: "L'accessibilité : un combat permanent" },
      { type: "paragraph", text: "Malgré les lois sur l'accessibilité, de nombreux obstacles persistent : bâtiments non adaptés, transports inadéquats, voirie inaccessible. Chaque sortie peut devenir un parcours du combattant. Les associations militent pour faire évoluer les mentalités et les infrastructures." },
      { type: "subtitle", text: "Les aides techniques révolutionnaires" },
      { type: "paragraph", text: "Fauteuils roulants électriques intelligents, exosquelettes, prothèses bioniques, domotique adaptée... La technologie offre des solutions innovantes pour gagner en autonomie. Les progrès sont constants et ouvrent de nouvelles perspectives." },
      { type: "subtitle", text: "Sport et handicap moteur" },
      { type: "paragraph", text: "Le handisport démontre que le handicap n'empêche pas la performance. Basketball fauteuil, athlétisme, natation, escrime... Les disciplines sont nombreuses. Le sport apporte bien-être physique et mental, confiance en soi et lien social." },
      { type: "paragraph", text: "Vivre avec un handicap moteur, c'est affronter des obstacles, mais c'est aussi développer une force extraordinaire. C'est prouver chaque jour que la volonté peut surmonter bien des difficultés." }
    ],
    description: "Découvrez les réalités et les solutions pour vivre avec un handicap moteur"
  },
  {
    title: "Le handicap visuel : percevoir le monde autrement",
    subtitle: "Quand les autres sens prennent le relais",
    category: categories[2],
    author: authors[2],
    content: [
      { type: "paragraph", text: "La déficience visuelle concerne plus de 250 millions de personnes dans le monde. Elle va de la malvoyance à la cécité totale. Contrairement aux idées reçues, la plupart des personnes aveugles ne le sont pas de naissance." },
      { type: "subtitle", text: "Comprendre la déficience visuelle" },
      { type: "paragraph", text: "La malvoyance se caractérise par une vision réduite qui ne peut être corrigée par des lunettes. La cécité légale correspond à une acuité visuelle inférieure à 1/20. La cécité totale, rare, signifie l'absence complète de perception lumineuse." },
      { type: "subtitle", text: "Le braille : bien plus qu'un alphabet" },
      { type: "paragraph", text: "Inventé par Louis Braille au 19ème siècle, ce système d'écriture tactile permet l'accès à la lecture et à l'écriture. Aujourd'hui, le braille numérique et les plages braille connectées révolutionnent l'accès à l'information." },
      { type: "subtitle", text: "Les technologies d'assistance" },
      { type: "paragraph", text: "Lecteurs d'écran, synthèse vocale, loupes électroniques, cannes intelligentes, applications de reconnaissance d'objets... Les outils se multiplient pour faciliter l'autonomie. L'intelligence artificielle ouvre des perspectives prometteuses." },
      { type: "subtitle", text: "L'éducation des enfants déficients visuels" },
      { type: "paragraph", text: "Dès le plus jeune âge, l'apprentissage des techniques de locomotion, du braille et des aides informatiques est crucial. L'inclusion scolaire, avec un accompagnement adapté (AVS, matériel spécialisé), permet une scolarité réussie." },
      { type: "subtitle", text: "Chiens guides : des compagnons exceptionnels" },
      { type: "paragraph", text: "Après deux ans de formation, ces chiens permettent des déplacements sécurisés et apportent un soutien affectif précieux. Ils sont un véritable lien avec le monde extérieur." },
      { type: "paragraph", text: "Le handicap visuel impose d'autres façons de percevoir, mais n'empêche ni l'apprentissage ni l'épanouissement. De nombreuses personnes aveugles mènent des carrières brillantes et des vies riches." }
    ],
    description: "Explorer le quotidien et les ressources pour les personnes déficientes visuelles"
  },
  {
    title: "Surdité et malentendance : communiquer différemment",
    subtitle: "Quand le silence devient une langue",
    category: categories[3],
    author: authors[3],
    content: [
      { type: "paragraph", text: "La surdité touche environ 466 millions de personnes dans le monde. Elle peut être légère, moyenne, sévère ou profonde. Congénitale ou acquise, elle impacte la communication mais n'empêche pas une vie épanouie." },
      { type: "subtitle", text: "Les causes de la surdité" },
      { type: "paragraph", text: "Génétique, complications à la naissance, infections (méningite, oreillons), exposition prolongée au bruit, vieillissement... Les origines sont diverses. Un diagnostic précoce permet une prise en charge adaptée." },
      { type: "subtitle", text: "La langue des signes : une langue à part entière" },
      { type: "paragraph", text: "Contrairement à une idée reçue, la langue des signes n'est pas universelle. Chaque pays a la sienne (LSF en France, ASL aux États-Unis...). C'est une langue riche avec sa grammaire, sa syntaxe et ses nuances." },
      { type: "subtitle", text: "Les aides auditives modernes" },
      { type: "paragraph", text: "Appareils auditifs numériques, implants cochléaires, boucles magnétiques... Les technologies évoluent rapidement. L'implant cochléaire, notamment, peut restaurer une forme d'audition chez les personnes sourdes profondes." },
      { type: "subtitle", text: "L'éducation bilingue pour les enfants sourds" },
      { type: "paragraph", text: "L'approche bilingue (langue des signes et français écrit/oral) offre les meilleurs résultats. Elle permet le développement cognitif optimal et l'épanouissement dans les deux cultures : sourde et entendante." },
      { type: "subtitle", text: "Accessibilité et sous-titrage" },
      { type: "paragraph", text: "Le sous-titrage, la vélotypie (transcription en temps réel), les interprètes LSF... Ces services doivent se généraliser dans l'audiovisuel, l'éducation, les services publics. L'accessibilité est un droit fondamental." },
      { type: "paragraph", text: "La surdité n'est pas un handicap quand la société s'adapte. C'est une différence culturelle et linguistique qui mérite reconnaissance et respect. La communauté sourde possède une culture riche qu'il faut valoriser." }
    ],
    description: "Découvrir la surdité, la langue des signes et les moyens de communication adaptés"
  },
  {
    title: "L'inclusion scolaire : un droit pour tous les enfants",
    subtitle: "Construire une école véritablement inclusive",
    category: categories[6],
    author: authors[0],
    content: [
      { type: "paragraph", text: "Depuis la loi de 2005, l'école française s'est engagée dans une démarche d'inclusion. Mais entre les textes et la réalité du terrain, le chemin reste long. Pourtant, l'inclusion bénéficie à tous les élèves." },
      { type: "subtitle", text: "Qu'est-ce que l'école inclusive ?" },
      { type: "paragraph", text: "L'école inclusive ne se limite pas à accueillir des élèves handicapés dans des classes ordinaires. C'est repenser l'école pour qu'elle s'adapte à chaque enfant, quels que soient ses besoins spécifiques." },
      { type: "subtitle", text: "Les aménagements nécessaires" },
      { type: "paragraph", text: "Accompagnants d'élèves en situation de handicap (AESH), matériel pédagogique adapté, aménagements d'examens, enseignants formés, locaux accessibles... De nombreux éléments doivent être réunis pour une inclusion réussie." },
      { type: "subtitle", text: "Les bénéfices pour tous" },
      { type: "paragraph", text: "L'inclusion développe l'empathie, la tolérance et la coopération chez tous les élèves. Elle prépare à une société diverse. Les recherches montrent qu'elle ne pénalise pas les autres enfants, au contraire." },
      { type: "subtitle", text: "Les défis à relever" },
      { type: "paragraph", text: "Manque d'AESH, formation insuffisante des enseignants, classes surchargées, résistances culturelles... Les obstacles sont nombreux. Ils nécessitent une volonté politique forte et des moyens significatifs." },
      { type: "subtitle", text: "Témoignages de réussites" },
      { type: "paragraph", text: "De nombreuses expériences montrent que l'inclusion fonctionne quand les conditions sont réunies. Des enfants autistes épanouis en classe ordinaire, des élèves trisomiques qui obtiennent leur bac... Les exemples inspirants existent." },
      { type: "paragraph", text: "L'école inclusive n'est pas une utopie, c'est un projet de société. Elle demande des efforts, mais apporte tellement en retour : une société plus juste, plus humaine, plus riche de sa diversité." }
    ],
    description: "Comprendre les enjeux et les pratiques de l'inclusion scolaire"
  },
  {
    title: "Handicap et emploi : briser les barrières",
    subtitle: "Vers une véritable inclusion professionnelle",
    category: categories[7],
    author: authors[1],
    content: [
      { type: "paragraph", text: "Le taux de chômage des personnes handicapées est deux fois supérieur à la moyenne nationale. Pourtant, la loi oblige les entreprises de plus de 20 salariés à employer 6% de travailleurs handicapés. Entre obligations légales et réalité, l'écart reste important." },
      { type: "subtitle", text: "Les freins à l'emploi" },
      { type: "paragraph", text: "Préjugés des employeurs, difficultés d'accès aux locaux, manque de formation adaptée, problèmes de transport, fatigue liée au handicap... Les obstacles sont multiples et se cumulent souvent." },
      { type: "subtitle", text: "Les dispositifs d'aide existants" },
      { type: "paragraph", text: "Cap emploi, entreprises adaptées (EA), établissements et services d'aide par le travail (ESAT), aides financières pour l'adaptation des postes... Des structures accompagnent l'insertion professionnelle." },
      { type: "subtitle", text: "Les aménagements de poste" },
      { type: "paragraph", text: "Matériel ergonomique, logiciels spécialisés, adaptation des horaires, télétravail, interprètes en langue des signes... De nombreuses solutions existent. L'Agefiph finance une partie de ces adaptations." },
      { type: "subtitle", text: "Le télétravail : une opportunité" },
      { type: "paragraph", text: "La crise sanitaire a démontré la viabilité du télétravail. Pour les personnes handicapées, il peut supprimer des obstacles (transport, accessibilité) et favoriser la concentration." },
      { type: "subtitle", text: "Des compétences à valoriser" },
      { type: "paragraph", text: "Les personnes handicapées développent souvent des qualités exceptionnelles : persévérance, créativité dans la résolution de problèmes, empathie. Ces soft skills sont précieux pour les entreprises." },
      { type: "paragraph", text: "L'emploi des personnes handicapées n'est pas une contrainte mais une richesse. Les entreprises qui s'engagent réellement constatent les bénéfices : diversité des équipes, innovation, amélioration du climat social." }
    ],
    description: "Les clés pour favoriser l'accès et le maintien dans l'emploi des personnes handicapées"
  },
  {
    title: "Autisme : comprendre pour mieux accompagner",
    subtitle: "Au cœur des troubles du spectre autistique",
    category: categories[0],
    author: authors[2],
    content: [
      { type: "paragraph", text: "L'autisme touche environ 1 enfant sur 100. C'est un trouble neurodéveloppemental qui affecte la communication, les interactions sociales et le comportement. La diversité des profils est immense : on parle de spectre autistique." },
      { type: "subtitle", text: "Les signes de l'autisme" },
      { type: "paragraph", text: "Difficultés dans les interactions sociales, communication verbale et non-verbale atypique, intérêts restreints et répétitifs, sensibilités sensorielles particulières... Ces caractéristiques varient énormément d'une personne à l'autre." },
      { type: "subtitle", text: "Le diagnostic précoce" },
      { type: "paragraph", text: "Plus le diagnostic est posé tôt, plus l'accompagnement peut être mis en place rapidement. Les signes peuvent apparaître dès 18 mois. Un dépistage précoce améliore significativement le développement de l'enfant." },
      { type: "subtitle", text: "Les méthodes d'accompagnement" },
      { type: "paragraph", text: "ABA, TEACCH, Denver, Montessori adaptée... Plusieurs approches existent. L'important est de personnaliser l'accompagnement selon les besoins spécifiques de chaque enfant. La pluridisciplinarité est essentielle." },
      { type: "subtitle", text: "Scolarisation et autisme" },
      { type: "paragraph", text: "Avec un accompagnement adapté (AESH, adaptations pédagogiques, emploi du temps visuel), de nombreux enfants autistes peuvent suivre une scolarité en milieu ordinaire. Les UEMA et les UEEA facilitent l'inclusion." },
      { type: "subtitle", text: "Autisme et talents particuliers" },
      { type: "paragraph", text: "Certaines personnes autistes développent des capacités exceptionnelles dans des domaines spécifiques : mémoire, mathématiques, musique, arts visuels... Ces talents méritent d'être reconnus et valorisés." },
      { type: "paragraph", text: "L'autisme n'est pas une maladie à guérir mais une différence neurologique à comprendre et à accepter. Les personnes autistes ont leur place dans notre société et peuvent y apporter une contribution unique." }
    ],
    description: "Guide complet sur l'autisme, du diagnostic à l'accompagnement"
  },
  {
    title: "Trisomie 21 : vivre avec un chromosome en plus",
    subtitle: "Briser les stéréotypes sur le syndrome de Down",
    category: categories[0],
    author: authors[3],
    content: [
      { type: "paragraph", text: "La trisomie 21, ou syndrome de Down, est une anomalie chromosomique qui touche environ 1 naissance sur 700. Elle entraîne un handicap mental léger à modéré et des caractéristiques physiques spécifiques. Mais c'est avant tout une personne unique." },
      { type: "subtitle", text: "Comprendre la trisomie 21" },
      { type: "paragraph", text: "Elle résulte de la présence d'un chromosome 21 supplémentaire. Cette anomalie génétique n'est pas héréditaire dans la majorité des cas. Elle n'est pas liée au comportement des parents pendant la grossesse." },
      { type: "subtitle", text: "Le développement de l'enfant" },
      { type: "paragraph", text: "Les étapes du développement sont atteintes, mais souvent plus tardivement. Avec un accompagnement adapté (kinésithérapie, orthophonie, psychomotricité), les progrès sont constants. Chaque enfant avance à son rythme." },
      { type: "subtitle", text: "Santé et trisomie" },
      { type: "paragraph", text: "Des problèmes cardiaques, digestifs, thyroïdiens ou immunitaires peuvent être associés. Un suivi médical régulier est nécessaire. L'espérance de vie, autrefois limitée, atteint aujourd'hui 60 ans en moyenne." },
      { type: "subtitle", text: "Scolarité et apprentissages" },
      { type: "paragraph", text: "De plus en plus d'enfants trisomiques sont scolarisés en milieu ordinaire. Avec des adaptations pédagogiques et un accompagnement, ils peuvent apprendre à lire, écrire et compter. Certains obtiennent même le baccalauréat." },
      { type: "subtitle", text: "Autonomie et vie adulte" },
      { type: "paragraph", text: "Beaucoup de jeunes adultes trisomiques travaillent, en milieu ordinaire, adapté ou protégé. Certains vivent de façon autonome ou semi-autonome. La société évolue vers plus d'inclusion." },
      { type: "paragraph", text: "Les personnes trisomiques ont des capacités, des désirs, des projets. Elles ont leur place dans notre société. Leur joie de vivre et leur authenticité sont souvent une leçon pour tous." }
    ],
    description: "Tout savoir sur la trisomie 21 : santé, éducation et inclusion"
  },
  {
    title: "Les aidants familiaux : héros du quotidien",
    subtitle: "Soutenir ceux qui soutiennent",
    category: categories[5],
    author: authors[0],
    content: [
      { type: "paragraph", text: "En France, on estime à 11 millions le nombre d'aidants familiaux. Ils accompagnent au quotidien un proche en situation de handicap ou de dépendance. Ce rôle, souvent invisible, est pourtant crucial." },
      { type: "subtitle", text: "Qui sont les aidants ?" },
      { type: "paragraph", text: "Parents d'enfants handicapés, conjoints, enfants de personnes âgées, frères et sœurs... Les aidants ont tous profils et tous âges. Beaucoup cumulent cette responsabilité avec un emploi." },
      { type: "subtitle", text: "Les défis quotidiens" },
      { type: "paragraph", text: "Fatigue physique et psychologique, isolement social, difficultés financières, renoncement à sa carrière... Le fardeau peut être lourd. L'épuisement des aidants est un réel problème de santé publique." },
      { type: "subtitle", text: "Les droits des aidants" },
      { type: "paragraph", text: "Congé proche aidant, allocation journalière du proche aidant (AJPA), droit au répit, aides financières... Des dispositifs existent mais restent méconnus. Il est essentiel de les faire connaître." },
      { type: "subtitle", text: "L'importance du répit" },
      { type: "paragraph", text: "Prendre soin de soi pour mieux prendre soin de l'autre. L'accueil de jour, l'hébergement temporaire, la garde à domicile permettent aux aidants de souffler. Le répit n'est pas un luxe mais une nécessité." },
      { type: "subtitle", text: "Les groupes de parole" },
      { type: "paragraph", text: "Partager son expérience avec d'autres aidants, recevoir des conseils, sortir de l'isolement... Ces espaces d'échange sont précieux. De nombreuses associations proposent ce type de soutien." },
      { type: "paragraph", text: "Les aidants familiaux méritent reconnaissance et soutien. Leur dévouement ne doit pas se faire au prix de leur propre santé. Une société solidaire doit mieux les accompagner." }
    ],
    description: "Comprendre le rôle des aidants familiaux et les dispositifs de soutien"
  },
  {
    title: "Accessibilité universelle : concevoir pour tous",
    subtitle: "Quand le design inclusif change des vies",
    category: categories[4],
    author: authors[1],
    content: [
      { type: "paragraph", text: "L'accessibilité universelle ne concerne pas seulement les personnes handicapées. C'est concevoir des espaces, des produits et des services utilisables par tous, quels que soient l'âge, la taille ou les capacités. Un ascenseur profite à tous, pas seulement aux personnes en fauteuil." },
      { type: "subtitle", text: "Les 7 principes du design universel" },
      { type: "paragraph", text: "Usage équitable pour tous, flexibilité d'utilisation, utilisation simple et intuitive, information perceptible, tolérance à l'erreur, effort physique minimal, dimension appropriée... Ces principes guident la conception inclusive." },
      { type: "subtitle", text: "L'accessibilité du cadre bâti" },
      { type: "paragraph", text: "Rampes, ascenseurs, portes automatiques, toilettes adaptées, signalétique claire... De nombreux aménagements rendent les bâtiments accessibles. La loi impose des normes, mais leur application reste inégale." },
      { type: "subtitle", text: "L'accessibilité numérique" },
      { type: "paragraph", text: "Sites web compatibles avec les lecteurs d'écran, vidéos sous-titrées, applications à commande vocale... Le numérique offre des opportunités d'inclusion formidables, à condition d'être conçu de manière accessible." },
      { type: "subtitle", text: "Les transports accessibles" },
      { type: "paragraph", text: "Bus à plancher bas, métros équipés d'ascenseurs, annonces sonores et visuelles, services d'accompagnement... L'accessibilité des transports est un enjeu majeur de mobilité et d'autonomie." },
      { type: "subtitle", text: "La culture pour tous" },
      { type: "paragraph", text: "Audiodescription, visites tactiles, spectacles en langue des signes, concerts pour sourds (vibrations)... La culture s'ouvre progressivement à tous les publics. L'art est un droit universel." },
      { type: "paragraph", text: "Une société accessible est une société plus agréable pour tous. L'accessibilité universelle n'est pas un coût, c'est un investissement dans le vivre-ensemble." }
    ],
    description: "Les principes et pratiques de l'accessibilité universelle"
  }
];

// Fonction pour générer 35 publications supplémentaires
function generateMorePublications() {
  const topics = [
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
  description: pub.description || `Un article sur ${pub.title.toLowerCase()}`
}));

// Fonction pour injecter dans MongoDB
async function seedDatabase() {
  try {
    // Supprimer les anciennes publications (optionnel)
    console.log('🗑️  Nettoyage des anciennes publications...');
    await Article.deleteMany({});

    // Insérer les nouvelles publications
    console.log('📝 Insertion de 45 nouvelles publications...');
    const result = await Article.insertMany(finalPublications);

    console.log(`✅ ${result.length} publications insérées avec succès !`);
    console.log('📊 Répartition par catégorie :');

    // Compter par catégorie
    const categoryCounts = {};
    result.forEach(pub => {
      categoryCounts[pub.category] = (categoryCounts[pub.category] || 0) + 1;
    });

    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} articles`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion :', error);
    process.exit(1);
  }
}

// Lancer l'insertion
seedDatabase();

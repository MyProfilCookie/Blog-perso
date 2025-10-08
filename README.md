# Siteblog - Plateforme Éducative Interactive

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)

Siteblog est une plateforme éducative complète qui combine un système de gestion de contenu avec des outils d'apprentissage interactifs. Elle propose des quiz personnalisés, un système de suivi des progrès, une boutique en ligne et des outils de gestion pour les éducateurs.

## 🌟 Fonctionnalités Principales

### Pour les Étudiants
- **Apprentissage Interactif** : Quiz et exercices adaptés par matière (Mathématiques, Français, Sciences, Arts, etc.)
- **Suivi des Progrès** : Tableaux de bord personnalisés avec statistiques détaillées et graphiques
- **Système de Révision** : Suivi des erreurs et recommandations d'apprentissage
- **Rapports Hebdomadaires** : Analyses détaillées de la progression
- **Assistant IA** : Aide personnalisée pour l'apprentissage (mode premium)

### Pour les Enseignants/Administrateurs
- **Dashboard Complet** : Vue d'ensemble des progrès de tous les élèves
- **Gestion des Élèves** : Création et suivi de profils d'étudiants
- **Gestion des Contenus** : Création et modification de leçons, quiz et articles
- **Rapports Détaillés** : Analyses hebdomadaires et trimestrielles
- **Statistiques Avancées** : Suivi des performances par matière et par élève

### Plateforme de Contenu
- **Blog Éducatif** : Articles et ressources pédagogiques
- **Boutique en Ligne** : Vente de produits éducatifs et de cours
- **Système de Messagerie** : Communication entre utilisateurs et administration
- **Contact** : Formulaire de contact intégré

### Fonctionnalités Techniques
- **Authentification JWT** : Système de connexion sécurisé avec gestion des rôles
- **API RESTful** : Backend Node.js/Express avec MongoDB
- **Interface Moderne** : Frontend Next.js 14 avec NextUI et Tailwind CSS
- **Paiements Sécurisés** : Intégration Stripe pour les abonnements et achats
- **Performance Optimisée** : Optimisations d'images, lazy loading, bundle optimization
- **Responsive Design** : Adapté à tous les appareils (mobile, tablette, desktop)

## 🏗️ Architecture du Projet

```
Siteblog/
├── frontend/                    # Application Next.js 14
│   ├── app/                    # App Router (pages et layouts)
│   │   ├── admin/             # Interface d'administration
│   │   ├── ai-assistant/      # Assistant IA
│   │   ├── articles/          # Articles éducatifs
│   │   ├── blog/              # Blog
│   │   ├── dashboard/         # Tableaux de bord
│   │   ├── lessons/           # Leçons et cours
│   │   ├── profile/           # Profils utilisateurs
│   │   ├── shop/              # Boutique en ligne
│   │   └── users/             # Gestion des utilisateurs
│   ├── components/            # Composants React réutilisables
│   ├── hooks/                 # Hooks personnalisés
│   ├── lib/                   # Utilitaires et configurations
│   ├── public/                # Assets statiques
│   ├── scripts/               # Scripts d'optimisation
│   └── styles/                # Styles CSS globaux
├── backend/                    # API Node.js/Express
│   ├── api/
│   │   ├── controllers/       # Logique métier
│   │   ├── middlewares/       # Middlewares (auth, validation)
│   │   ├── models/            # Modèles MongoDB (20+ modèles)
│   │   ├── routes/            # Routes API (20+ endpoints)
│   │   ├── utils/             # Utilitaires
│   │   └── validation/        # Schémas de validation
│   ├── scripts/               # Scripts d'import/migration
│   ├── uploads/               # Fichiers uploadés
│   └── __tests__/             # Tests unitaires
├── docs/                       # Documentation technique
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS_DOCUMENTATION.md
│   └── CONTRIBUTING.md
└── cahier-des-charges/         # Spécifications du projet
```

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+
- MongoDB 5+
- npm ou yarn
- Compte Stripe (pour les paiements)

### Installation

1. **Cloner le repository**
```bash
git clone <votre-repo-url>
cd siteblog
```

2. **Configuration du Backend**
```bash
cd backend
npm install

# Créer le fichier .env
cp .env.example .env
# Configurer les variables d'environnement :
# - DB=mongodb://localhost:27017/siteblog
# - JWT_SECRET=votre_secret_jwt
# - STRIPE_SECRET_KEY=sk_test_...
# - STRIPE_WEBHOOK_SECRET=whsec_...
```

3. **Configuration du Frontend**
```bash
cd ../frontend
npm install

# Créer le fichier .env.local
cp .env.local.example .env.local
# Configurer les variables d'environnement :
# - NEXT_PUBLIC_API_URL=http://localhost:3001
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Démarrage en Développement

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
# Serveur disponible sur http://localhost:3001
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
# Application disponible sur http://localhost:3000
```

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React avec App Router
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **NextUI v2** - Bibliothèque de composants UI
- **Radix UI** - Composants UI accessibles
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides
- **Stripe** - Système de paiement
- **Chart.js / Recharts** - Graphiques et statistiques
- **Axios** - Client HTTP
- **SweetAlert2** - Modales et notifications
- **React Hot Toast** - Notifications toast

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hachage des mots de passe
- **Stripe** - Traitement des paiements
- **Nodemailer** - Envoi d'emails
- **express-validator** - Validation des données

### Outils de Développement
- **Jest** - Tests unitaires
- **ESLint** - Linting du code
- **Prettier** - Formatage du code
- **TypeScript** - Vérification de types
- **Nodemon** - Rechargement automatique (dev)

## 📊 Scripts Disponibles

### Frontend
```bash
npm run dev              # Développement avec warnings
npm run build            # Build de production
npm run postbuild        # Transformation Babel (compatibilité Safari)
npm run start            # Serveur de production
npm run test             # Tests unitaires
npm run test:coverage    # Tests avec couverture
npm run lint             # Vérification du code
npm run analyze          # Analyse du bundle

# Scripts d'optimisation
npm run images:optimize          # Optimisation des images
npm run bundle:optimize          # Optimisation du bundle
npm run performance:analyze      # Analyse de performance
npm run mobile:optimize          # Optimisation mobile
```

### Compatibilité Safari
Le script `postbuild` transforme automatiquement le code pour assurer la compatibilité avec Safari en retirant l'optional chaining et le nullish coalescing.

### Backend
```bash
npm run dev              # Développement avec nodemon
npm start                # Production
npm run test             # Tests unitaires
npm run test:coverage    # Tests avec couverture
npm run import-quizzes   # Import des données de quiz
```

## 🧪 Tests

Le projet inclut une suite complète de tests :

```bash
# Frontend
cd frontend
npm run test              # Tests unitaires
npm run test:coverage     # Tests avec couverture
npm run test:integration  # Tests d'intégration
npm run test:smoke        # Tests de fumée

# Backend
cd backend
npm run test              # Tests unitaires
npm run test:coverage     # Tests avec couverture
```

## 📋 Routes API Principales

### Authentification
- `POST /api/users/signup` - Inscription
- `POST /api/users/login` - Connexion
- `GET /api/users/me` - Profil utilisateur

### Étudiants & Apprentissage
- `GET /api/eleves` - Liste des élèves
- `POST /api/eleves` - Créer un élève
- `GET /api/lessons` - Leçons disponibles
- `POST /api/subjects/score` - Enregistrer un score
- `GET /api/rapportHebdos/:eleveId` - Rapports hebdomadaires

### Administration
- `GET /api/admin/stats` - Statistiques globales
- `GET /api/stats/eleve/:id` - Statistiques d'un élève
- `GET /api/trimestre/:eleveId` - Données trimestrielles

### Commerce
- `GET /api/products` - Liste des produits
- `POST /api/orders` - Créer une commande
- `POST /api/payments/create-payment-intent` - Créer un paiement
- `POST /api/payments/webhook/stripe` - Webhook Stripe

### Contenu
- `GET /api/articles` - Articles du blog
- `GET /api/blogs` - Posts de blog
- `POST /api/contact` - Formulaire de contact
- `GET /api/messages` - Messages

> Voir [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) pour la documentation complète de l'API.

## 🚀 Déploiement

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

Variables d'environnement requises :
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Backend (Render/Railway/Heroku)
Variables d'environnement requises :
- `DB` (MongoDB URI)
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NODE_ENV=production`

## 📈 Performance & Optimisations

Le projet inclut de nombreuses optimisations :
- **Images optimisées** : WebP, compression, responsive images
- **Bundle optimization** : Code splitting, tree-shaking
- **Lazy loading** : Composants et images chargés à la demande
- **Caching** : Stratégies de cache avancées
- **Mobile optimization** : Performance mobile optimisée
- **Core Web Vitals** : LCP, FID, CLS optimisés

## 🔒 Sécurité

- **Authentification JWT** avec tokens sécurisés
- **Validation des données** côté client et serveur (express-validator)
- **Hachage des mots de passe** avec bcryptjs
- **Protection CORS** configurée
- **Variables d'environnement** pour les secrets
- **Webhooks Stripe** sécurisés avec signatures

## 📚 Documentation

- [API Documentation](docs/API_DOCUMENTATION.md) - Documentation complète de l'API
- [Architecture](docs/ARCHITECTURE.md) - Architecture technique du projet
- [Components](docs/COMPONENTS_DOCUMENTATION.md) - Documentation des composants
- [Contributing](docs/CONTRIBUTING.md) - Guide de contribution
- [Cahier des Charges](cahier-des-charges/) - Spécifications du projet

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 👥 Support

Pour toute question ou support :
- 📧 Email : support@siteblog.com
- 🐛 Issues : Ouvrez une issue sur le repository
- 📖 Documentation : Consultez le dossier `docs/`

---

**⭐ N'hésitez pas à donner une étoile si ce projet vous aide !**

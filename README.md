# AutiStudy - Plateforme Éducative pour l'Autisme

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)

AutiStudy est une plateforme éducative interactive spécialement conçue pour accompagner les enfants autistes dans leur apprentissage. Elle propose des quiz personnalisés, un système de suivi des progrès, et des outils de gestion pour les éducateurs et parents.

## 🌟 Fonctionnalités Principales

### Pour les Élèves
- **Quiz Interactifs** : Questions adaptées par matière (Mathématiques, Français, Sciences, etc.)
- **Suivi des Progrès** : Tableaux de bord personnalisés avec statistiques détaillées
- **Interface Adaptée** : Design pensé pour les besoins spécifiques des enfants autistes
- **Système de Récompenses** : Badges et encouragements pour maintenir la motivation

### Pour les Éducateurs/Parents
- **Dashboard Administrateur** : Vue d'ensemble des progrès de tous les élèves
- **Rapports Détaillés** : Analyses hebdomadaires et trimestrielles
- **Gestion des Contenus** : Création et modification des quiz
- **Système de Paiement** : Intégration Stripe pour les abonnements

### Fonctionnalités Techniques
- **Authentification JWT** : Système de connexion sécurisé
- **API RESTful** : Backend Node.js/Express avec MongoDB
- **Interface Moderne** : Frontend Next.js 14 avec NextUI
- **Performance Optimisée** : Service Worker, lazy loading, optimisations d'images
- **Tests Automatisés** : Suite de tests unitaires et d'intégration

## 🏗️ Architecture du Projet

```
Siteblog/
├── frontend/          # Application Next.js 14
│   ├── app/          # App Router (pages et layouts)
│   ├── components/   # Composants React réutilisables
│   ├── hooks/        # Hooks personnalisés
│   ├── lib/          # Utilitaires et configurations
│   ├── pages/        # Pages Router (API routes)
│   ├── public/       # Assets statiques
│   └── styles/       # Styles CSS globaux
├── backend/          # API Node.js/Express
│   ├── api/          # Routes et contrôleurs
│   ├── models/       # Modèles MongoDB
│   ├── scripts/      # Scripts d'import/migration
│   └── uploads/      # Fichiers uploadés
└── docs/            # Documentation
```

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- MongoDB 5+
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/autistudy.git
cd autistudy
```

2. **Configuration du Backend**
```bash
cd backend
npm install

# Créer le fichier .env
cp .env.example .env
# Configurer les variables d'environnement :
# - MONGODB_URI
# - JWT_SECRET
# - STRIPE_SECRET_KEY
```

3. **Configuration du Frontend**
```bash
cd ../frontend
npm install

# Créer le fichier .env.local
cp .env.local.example .env.local
# Configurer les variables d'environnement :
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

### Démarrage en Développement

1. **Démarrer le Backend**
```bash
cd backend
npm run dev
# Serveur disponible sur http://localhost:5000
```

2. **Démarrer le Frontend**
```bash
cd frontend
npm run dev
# Application disponible sur http://localhost:3000
```

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React avec App Router
- **NextUI v2** - Bibliothèque de composants UI
- **Tailwind CSS** - Framework CSS utilitaire
- **TypeScript** - Typage statique
- **Framer Motion** - Animations fluides
- **Stripe** - Système de paiement
- **Chart.js/Recharts** - Graphiques et statistiques

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **Stripe** - Traitement des paiements
- **Nodemailer** - Envoi d'emails

### Outils de Développement
- **Jest** - Tests unitaires
- **ESLint** - Linting du code
- **Prettier** - Formatage du code
- **TypeScript** - Vérification de types

## 📊 Scripts Disponibles

### Frontend
```bash
npm run dev          # Développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run test         # Tests unitaires
npm run lint         # Vérification du code
npm run analyze      # Analyse du bundle
```

### Backend
```bash
npm run dev          # Développement avec nodemon
npm start            # Production
npm run import-quizzes # Import des données de quiz
```

## 🧪 Tests

Le projet inclut une suite complète de tests :

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage

# Tests d'intégration
npm run test:integration

# Tests de fumée
npm run test:smoke
```

## 🚀 Déploiement

### Production avec Vercel (Frontend)
```bash
npm run build:prod
vercel --prod
```

### Production avec Render/Railway (Backend)
```bash
# Variables d'environnement requises :
# - MONGODB_URI
# - JWT_SECRET
# - STRIPE_SECRET_KEY
# - NODE_ENV=production
```

## 📈 Performance

Le projet est optimisé pour les performances :
- **Lighthouse Score** : 95+ sur tous les critères
- **Core Web Vitals** : Optimisés
- **Bundle Size** : Minimisé avec tree-shaking
- **Images** : Optimisation automatique avec Next.js
- **Caching** : Service Worker et cache HTTP

## 🔒 Sécurité

- **Authentification JWT** avec refresh tokens
- **Validation des données** côté client et serveur
- **Headers de sécurité** (CSP, HSTS, XSS Protection)
- **Chiffrement des mots de passe** avec bcrypt
- **Protection CSRF** et rate limiting

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- **Développeur Principal** - [Votre Nom](https://github.com/votre-username)

## 📞 Support

Pour toute question ou support :
- 📧 Email : support@autistudy.com
- 🐛 Issues : [GitHub Issues](https://github.com/votre-username/autistudy/issues)
- 📖 Documentation : [Wiki](https://github.com/votre-username/autistudy/wiki)

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous aide !**
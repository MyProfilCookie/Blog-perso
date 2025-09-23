# Architecture du Projet AutiStudy

## Vue d'ensemble

AutiStudy suit une architecture **Full-Stack** moderne avec une séparation claire entre le frontend et le backend, permettant une scalabilité et une maintenabilité optimales.

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│                 │◄──────────────────►│                 │
│   Frontend      │                    │   Backend       │
│   (Next.js 14)  │                    │   (Node.js)     │
│                 │                    │                 │
└─────────────────┘                    └─────────────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌─────────────────┐                    ┌─────────────────┐
│   Browser       │                    │   MongoDB       │
│   (Client)      │                    │   (Database)    │
└─────────────────┘                    └─────────────────┘
```

## 🏗️ Structure Détaillée

### Frontend (`/frontend`)

#### App Router (`/app`)
Structure basée sur le nouveau App Router de Next.js 14 :

```
app/
├── layout.tsx              # Layout racine avec providers
├── page.tsx                # Page d'accueil
├── globals.css             # Styles globaux
├── providers.tsx           # Providers React (Auth, Theme, etc.)
├── not-found.tsx           # Page 404 personnalisée
├── error.tsx               # Page d'erreur globale
│
├── admin/                  # Interface administrateur
│   ├── layout.tsx
│   ├── page.tsx
│   └── [...sections]/
│
├── dashboard/              # Tableau de bord élève
│   ├── layout.tsx
│   ├── page.tsx
│   └── components/
│
├── shop/                   # Boutique et paiements
│   ├── page.tsx
│   └── checkout/
│
├── quiz/                   # Système de quiz
│   ├── [subject]/
│   └── results/
│
└── api/                    # API Routes (Next.js)
    ├── auth/
    ├── quiz/
    └── payments/
```

#### Composants (`/components`)
Organisation modulaire des composants React :

```
components/
├── ui/                     # Composants UI de base (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
│
├── quiz/                   # Composants spécifiques aux quiz
│   ├── QuestionCard.tsx
│   ├── Timer.tsx
│   └── ResultsDisplay.tsx
│
├── dashboard/              # Composants du tableau de bord
│   ├── StatsCard.tsx
│   ├── ProgressChart.tsx
│   └── RecentActivity.tsx
│
├── layout/                 # Composants de mise en page
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
│
└── common/                 # Composants réutilisables
    ├── Loading.tsx
    ├── ErrorBoundary.tsx
    └── Modal.tsx
```

#### Hooks Personnalisés (`/hooks`)
```
hooks/
├── useAuth.ts              # Gestion de l'authentification
├── useQuiz.ts              # Logique des quiz
├── useStats.ts             # Statistiques utilisateur
├── useLocalStorage.ts      # Persistance locale
└── useApi.ts               # Appels API optimisés
```

#### Configuration (`/lib` et `/config`)
```
lib/
├── utils.ts                # Utilitaires généraux
├── api.ts                  # Configuration API
├── auth.ts                 # Logique d'authentification
└── validations.ts          # Schémas de validation

config/
├── site.ts                 # Configuration du site
├── database.ts             # Configuration DB
└── stripe.ts               # Configuration paiements
```

### Backend (`/backend`)

#### Structure API
```
backend/
├── index.js                # Point d'entrée principal
├── package.json            # Dépendances et scripts
│
├── api/                    # Logique métier
│   ├── controllers/        # Contrôleurs des routes
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   ├── userController.js
│   │   └── paymentController.js
│   │
│   ├── middlewares/        # Middlewares Express
│   │   ├── auth.js         # Vérification JWT
│   │   ├── validation.js   # Validation des données
│   │   └── errorHandler.js # Gestion d'erreurs
│   │
│   ├── routes/             # Définition des routes
│   │   ├── auth.js
│   │   ├── quiz.js
│   │   ├── users.js
│   │   └── payments.js
│   │
│   └── utils/              # Utilitaires backend
│       ├── jwt.js
│       ├── email.js
│       └── encryption.js
│
├── models/                 # Modèles MongoDB (Mongoose)
│   ├── User.js
│   ├── Quiz.js
│   ├── Question.js
│   ├── Result.js
│   └── Payment.js
│
└── scripts/                # Scripts d'administration
    ├── import-quizzes.js
    ├── migrate-data.js
    └── backup-db.js
```

## 🔄 Flux de Données

### Authentification
```
1. Login Request → Backend Auth Controller
2. JWT Token Generation → Response to Frontend
3. Token Storage → LocalStorage/Cookies
4. Protected Route Access → JWT Verification Middleware
5. User Data Retrieval → Database Query
```

### Quiz Flow
```
1. Quiz Selection → Frontend Quiz Component
2. Questions Fetch → API Call to Backend
3. Answer Submission → Real-time Validation
4. Score Calculation → Backend Processing
5. Results Storage → MongoDB Database
6. Statistics Update → Dashboard Refresh
```

### Payment Flow
```
1. Product Selection → Stripe Checkout
2. Payment Processing → Stripe Webhook
3. Order Confirmation → Database Update
4. Access Grant → User Permissions Update
```

## 🗄️ Base de Données (MongoDB)

### Collections Principales

#### Users
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String, // 'student', 'teacher', 'admin'
  profile: {
    firstName: String,
    lastName: String,
    age: Number,
    preferences: Object
  },
  subscription: {
    type: String,
    expiresAt: Date,
    stripeCustomerId: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Quizzes
```javascript
{
  _id: ObjectId,
  title: String,
  subject: String, // 'math', 'french', 'science', etc.
  difficulty: String, // 'easy', 'medium', 'hard'
  questions: [ObjectId], // References to Question documents
  timeLimit: Number, // in minutes
  isActive: Boolean,
  createdBy: ObjectId, // Reference to User
  createdAt: Date
}
```

#### Questions
```javascript
{
  _id: ObjectId,
  question: String,
  type: String, // 'multiple-choice', 'true-false', 'open'
  options: [String], // For multiple choice
  correctAnswer: String,
  explanation: String,
  difficulty: Number, // 1-5
  subject: String,
  tags: [String]
}
```

#### Results
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  quizId: ObjectId,
  answers: [{
    questionId: ObjectId,
    userAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number
  }],
  score: Number,
  totalQuestions: Number,
  completedAt: Date,
  timeSpent: Number // Total time in seconds
}
```

## 🔐 Sécurité

### Frontend
- **CSP Headers** : Protection contre XSS
- **Input Validation** : Validation côté client avec Zod
- **Token Management** : Stockage sécurisé des JWT
- **Route Protection** : Guards pour les routes protégées

### Backend
- **JWT Authentication** : Tokens avec expiration
- **Password Hashing** : bcrypt avec salt
- **Rate Limiting** : Protection contre les attaques par force brute
- **Input Sanitization** : Validation et nettoyage des données
- **CORS Configuration** : Contrôle des origines autorisées

## 🚀 Performance

### Frontend Optimizations
- **Code Splitting** : Chargement lazy des composants
- **Image Optimization** : Next.js Image component
- **Bundle Analysis** : Webpack Bundle Analyzer
- **Service Worker** : Cache des assets statiques
- **Memoization** : React.memo et useMemo

### Backend Optimizations
- **Database Indexing** : Index sur les champs fréquemment requêtés
- **Query Optimization** : Aggregation pipelines MongoDB
- **Caching** : Redis pour les données fréquemment accédées
- **Compression** : Gzip compression des réponses
- **Connection Pooling** : Mongoose connection pooling

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: '640px',   // Small devices
md: '768px',   // Medium devices  
lg: '1024px',  // Large devices
xl: '1280px',  // Extra large devices
2xl: '1536px'  // 2X Extra large devices
```

### Adaptive Components
- **Navigation** : Hamburger menu sur mobile
- **Tables** : Scroll horizontal sur petits écrans
- **Charts** : Redimensionnement automatique
- **Forms** : Stack vertical sur mobile

## 🧪 Testing Strategy

### Frontend Tests
```
__tests__/
├── components/         # Tests des composants
├── hooks/             # Tests des hooks
├── pages/             # Tests des pages
├── integration/       # Tests d'intégration
└── e2e/              # Tests end-to-end
```

### Backend Tests
```
tests/
├── unit/              # Tests unitaires
├── integration/       # Tests d'intégration API
└── fixtures/          # Données de test
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/ci.yml
- Lint & Format Check
- Unit Tests
- Integration Tests
- Build Verification
- Security Scan
- Deploy to Staging
- Deploy to Production
```

Cette architecture garantit une séparation claire des responsabilités, une scalabilité optimale et une maintenance facilitée du projet AutiStudy.
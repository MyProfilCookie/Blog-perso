# Guide de Contribution - AutiStudy

## 🤝 Bienvenue dans la communauté AutiStudy

Merci de votre intérêt pour contribuer à AutiStudy ! Ce guide vous aidera à comprendre comment participer au développement de cette plateforme éducative dédiée aux enfants autistes.

---

## 📋 Table des Matières

1. [Code de Conduite](#code-de-conduite)
2. [Comment Contribuer](#comment-contribuer)
3. [Configuration de l'Environnement](#configuration-de-lenvironnement)
4. [Standards de Code](#standards-de-code)
5. [Processus de Pull Request](#processus-de-pull-request)
6. [Tests](#tests)
7. [Déploiement](#déploiement)
8. [Ressources](#ressources)

---

## 🤝 Code de Conduite

### Notre Engagement

Nous nous engageons à faire de la participation à notre projet une expérience sans harcèlement pour tous, indépendamment de l'âge, de la taille corporelle, du handicap visible ou invisible, de l'origine ethnique, des caractéristiques sexuelles, de l'identité et de l'expression de genre, du niveau d'expérience, de l'éducation, du statut socio-économique, de la nationalité, de l'apparence personnelle, de la race, de la religion ou de l'identité et de l'orientation sexuelles.

### Standards Attendus

**Comportements encouragés :**
- Utiliser un langage accueillant et inclusif
- Respecter les différents points de vue et expériences
- Accepter gracieusement les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté
- Faire preuve d'empathie envers les autres membres

**Comportements inacceptables :**
- Langage ou imagerie sexualisés et attention sexuelle non désirée
- Trolling, commentaires insultants/désobligeants et attaques personnelles
- Harcèlement public ou privé
- Publication d'informations privées sans permission explicite
- Autres conduites inappropriées dans un cadre professionnel

---

## 🚀 Comment Contribuer

### Types de Contributions

Nous accueillons plusieurs types de contributions :

#### 🐛 Signalement de Bugs
- Utilisez les templates d'issues GitHub
- Fournissez des étapes de reproduction claires
- Incluez des captures d'écran si pertinent
- Mentionnez votre environnement (OS, navigateur, version)

#### ✨ Nouvelles Fonctionnalités
- Discutez d'abord dans une issue
- Proposez un design ou mockup si applicable
- Considérez l'impact sur l'accessibilité
- Pensez aux enfants autistes comme utilisateurs principaux

#### 📚 Documentation
- Améliorations de la documentation existante
- Traductions
- Tutoriels et guides
- Exemples de code

#### 🎨 Design et UX
- Améliorations de l'interface utilisateur
- Optimisations d'accessibilité
- Designs adaptatifs
- Expérience utilisateur pour enfants autistes

---

## ⚙️ Configuration de l'Environnement

### Prérequis

**Logiciels requis :**
```bash
Node.js >= 18.0.0
npm >= 9.0.0 ou pnpm >= 8.0.0
Git >= 2.30.0
MongoDB >= 6.0.0 (local ou Atlas)
```

**Outils recommandés :**
- VS Code avec extensions ESLint, Prettier, TypeScript
- MongoDB Compass pour la base de données
- Postman pour tester l'API
- Chrome DevTools pour le débogage

### Installation

1. **Fork et Clone**
```bash
# Fork le repository sur GitHub
git clone https://github.com/votre-username/autistudy.git
cd autistudy
```

2. **Installation des Dépendances**
```bash
# Frontend
cd frontend
npm install
# ou
pnpm install

# Backend
cd ../backend
npm install
```

3. **Configuration des Variables d'Environnement**

**Frontend (.env.local) :**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend (.env) :**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/autistudy
JWT_SECRET=votre_jwt_secret_super_securise
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_USER=votre@email.com
EMAIL_PASS=votre_mot_de_passe_app
```

4. **Base de Données**
```bash
# Démarrer MongoDB localement
mongod

# Ou utiliser Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Importer les données de test (optionnel)
cd backend
npm run import-quizzes
```

5. **Démarrage des Serveurs**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:3001

---

## 📝 Standards de Code

### Structure des Fichiers

```
frontend/
├── app/                    # Pages Next.js 14 (App Router)
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   └── [feature]/        # Composants par fonctionnalité
├── lib/                  # Utilitaires et configurations
├── hooks/                # Hooks React personnalisés
├── context/              # Contextes React
├── types/                # Types TypeScript
└── public/               # Assets statiques

backend/
├── controllers/          # Logique métier
├── models/              # Modèles MongoDB
├── routes/              # Routes Express
├── middleware/          # Middlewares personnalisés
├── utils/               # Utilitaires
└── config/              # Configurations
```

### Conventions de Nommage

**Fichiers et Dossiers :**
- `kebab-case` pour les fichiers et dossiers
- `PascalCase` pour les composants React
- `camelCase` pour les fonctions et variables

**Composants React :**
```typescript
// ✅ Bon
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  return <div>...</div>;
};

// ❌ Éviter
const userprofile = (props) => {
  return <div>...</div>;
};
```

**Hooks personnalisés :**
```typescript
// ✅ Bon
const useUserData = (userId: string) => {
  // logique du hook
};

// ❌ Éviter
const getUserData = (userId: string) => {
  // logique du hook
};
```

### TypeScript

**Interfaces et Types :**
```typescript
// ✅ Interfaces pour les objets
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// ✅ Types pour les unions et primitives
type UserRole = 'student' | 'teacher' | 'admin';
type LoadingState = boolean;

// ✅ Props des composants
interface UserCardProps {
  user: User;
  onEdit?: (userId: string) => void;
  className?: string;
}
```

**Gestion des Erreurs :**
```typescript
// ✅ Bon
try {
  const response = await api.getUser(userId);
  return response.data;
} catch (error) {
  console.error('Erreur lors de la récupération de l\'utilisateur:', error);
  throw new Error('Impossible de récupérer les données utilisateur');
}
```

### CSS et Styling

**Tailwind CSS :**
```tsx
// ✅ Classes organisées par catégorie
<div className="
  flex items-center justify-between
  p-4 m-2
  bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  rounded-lg shadow-sm
  hover:shadow-md transition-shadow
">
```

**Responsive Design :**
```tsx
// ✅ Mobile-first approach
<div className="
  w-full
  sm:w-1/2
  md:w-1/3
  lg:w-1/4
">
```

---

## 🔄 Processus de Pull Request

### Avant de Commencer

1. **Créer une Issue** (si elle n'existe pas)
2. **Assigner l'issue** à vous-même
3. **Créer une branche** depuis `main`

```bash
git checkout main
git pull origin main
git checkout -b feature/nom-de-la-fonctionnalite
# ou
git checkout -b fix/nom-du-bug
```

### Développement

1. **Commits Atomiques**
```bash
# ✅ Bon commit
git commit -m "feat: ajouter validation email dans le formulaire d'inscription"

# ✅ Bon commit
git commit -m "fix: corriger l'affichage des statistiques sur mobile"

# ❌ Éviter
git commit -m "corrections diverses"
```

2. **Convention des Messages de Commit**
```
type(scope): description

Types:
- feat: nouvelle fonctionnalité
- fix: correction de bug
- docs: documentation
- style: formatage, point-virgules manquants, etc.
- refactor: refactoring du code
- test: ajout ou modification de tests
- chore: maintenance, dépendances, etc.

Exemples:
feat(auth): ajouter authentification à deux facteurs
fix(quiz): corriger le calcul des scores
docs(api): mettre à jour la documentation des endpoints
```

3. **Tests Avant Push**
```bash
# Frontend
npm run lint
npm run type-check
npm run test
npm run build

# Backend
npm run lint
npm run test
npm start # vérifier que le serveur démarre
```

### Soumission de la PR

1. **Push de la Branche**
```bash
git push origin feature/nom-de-la-fonctionnalite
```

2. **Créer la Pull Request**
- Titre descriptif et clair
- Description détaillée des changements
- Référencer l'issue liée (`Closes #123`)
- Ajouter des captures d'écran si pertinent
- Marquer comme draft si en cours

3. **Template de PR**
```markdown
## Description
Brève description des changements apportés.

## Type de Changement
- [ ] Bug fix (changement non-breaking qui corrige un problème)
- [ ] Nouvelle fonctionnalité (changement non-breaking qui ajoute une fonctionnalité)
- [ ] Breaking change (correction ou fonctionnalité qui casserait la fonctionnalité existante)
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests d'intégration ajoutés/mis à jour
- [ ] Tests manuels effectués

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai effectué une auto-review de mon code
- [ ] J'ai commenté mon code, particulièrement dans les zones difficiles
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai ajouté des tests qui prouvent que ma correction est efficace ou que ma fonctionnalité fonctionne
- [ ] Les tests unitaires nouveaux et existants passent localement

## Captures d'écran (si applicable)
Ajouter des captures d'écran pour montrer les changements visuels.

## Issues Liées
Closes #(numéro de l'issue)
```

### Review Process

1. **Auto-Review** : Relisez votre code avant de soumettre
2. **Peer Review** : Au moins une approbation requise
3. **Tests CI/CD** : Tous les tests doivent passer
4. **Merge** : Squash and merge recommandé

---

## 🧪 Tests

### Frontend (Jest + React Testing Library)

**Tests de Composants :**
```typescript
// components/__tests__/UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from '../UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe'
  };

  it('affiche les informations utilisateur', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('appelle onEdit quand le bouton est cliqué', async () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);
    
    const editButton = screen.getByRole('button', { name: /modifier/i });
    await userEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });
});
```

**Tests de Hooks :**
```typescript
// hooks/__tests__/useUserData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useUserData } from '../useUserData';

describe('useUserData', () => {
  it('charge les données utilisateur', async () => {
    const { result } = renderHook(() => useUserData('1'));
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeDefined();
    });
  });
});
```

### Backend (Jest + Supertest)

**Tests d'API :**
```javascript
// routes/__tests__/users.test.js
const request = require('supertest');
const app = require('../../app');

describe('Users API', () => {
  describe('POST /api/users/signup', () => {
    it('crée un nouvel utilisateur', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/users/signup')
        .send(userData)
        .expect(201);

      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.token).toBeDefined();
    });
  });
});
```

### Commandes de Test

```bash
# Frontend
npm run test              # Tests unitaires
npm run test:watch        # Mode watch
npm run test:coverage     # Avec couverture
npm run test:e2e          # Tests end-to-end (Playwright)

# Backend
npm run test              # Tests unitaires
npm run test:integration  # Tests d'intégration
npm run test:coverage     # Avec couverture
```

---

## 🚀 Déploiement

### Environnements

1. **Development** : `localhost:3000` (local)
2. **Staging** : `staging.autistudy.com` (pré-production)
3. **Production** : `autistudy.com` (production)

### Pipeline CI/CD

**GitHub Actions Workflow :**

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # Frontend Tests
      - name: Install Frontend Dependencies
        run: cd frontend && npm ci
      
      - name: Run Frontend Tests
        run: cd frontend && npm run test:ci
      
      - name: Run Frontend Build
        run: cd frontend && npm run build
      
      # Backend Tests
      - name: Install Backend Dependencies
        run: cd backend && npm ci
      
      - name: Run Backend Tests
        run: cd backend && npm run test:ci

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to Staging
        run: echo "Deploying to staging..."

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production
        run: echo "Deploying to production..."
```

### Déploiement Manuel

**Frontend (Vercel) :**
```bash
# Installation de Vercel CLI
npm i -g vercel

# Déploiement
cd frontend
vercel --prod
```

**Backend (Render/Railway) :**
```bash
# Variables d'environnement requises
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
```

### Checklist de Déploiement

**Avant le Déploiement :**
- [ ] Tous les tests passent
- [ ] Build frontend réussit
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée si nécessaire
- [ ] Documentation mise à jour

**Après le Déploiement :**
- [ ] Vérifier que l'application démarre
- [ ] Tester les fonctionnalités critiques
- [ ] Vérifier les logs d'erreur
- [ ] Tester sur différents navigateurs
- [ ] Vérifier les performances

### Rollback

En cas de problème :
```bash
# Vercel
vercel rollback

# Render
# Utiliser l'interface web pour revenir à la version précédente
```

---

## 📚 Ressources

### Documentation Technique

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [NextUI Components](https://nextui.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Outils de Développement

- [VS Code Extensions](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Postman](https://www.postman.com/)

### Accessibilité

- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Autism-Friendly Design](https://www.autism.org.uk/advice-and-guidance/professional-practice/designing-autism-friendly-spaces)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Communauté

- **Discord** : [Lien vers le serveur Discord]
- **GitHub Discussions** : [Lien vers les discussions]
- **Email** : contact@autistudy.com

---

## 🎯 Roadmap

### Version 2.0 (Q2 2024)
- [ ] Mode hors ligne
- [ ] Application mobile native
- [ ] Reconnaissance vocale
- [ ] Gamification avancée

### Version 2.1 (Q3 2024)
- [ ] Intégration IA pour personnalisation
- [ ] Tableau de bord parents/enseignants
- [ ] Rapports de progression détaillés
- [ ] Support multi-langues

### Version 3.0 (Q4 2024)
- [ ] Réalité augmentée pour l'apprentissage
- [ ] Collaboration en temps réel
- [ ] Marketplace de contenu
- [ ] API publique

---

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent AutiStudy possible :

- **Développeurs** : Pour le code et les fonctionnalités
- **Designers** : Pour l'expérience utilisateur
- **Testeurs** : Pour la qualité et la fiabilité
- **Éducateurs** : Pour les retours pédagogiques
- **Familles** : Pour les retours d'utilisation

Ensemble, nous créons une plateforme qui fait la différence dans la vie des enfants autistes et de leurs familles.

---

**Besoin d'aide ?** N'hésitez pas à ouvrir une issue ou à nous contacter sur Discord !

*Dernière mise à jour : Janvier 2024*
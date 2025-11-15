# Documentation Technique - AutiStudy

## Vue d'ensemble du projet

**AutiStudy** est une plateforme éducative spécialement conçue pour les enfants autistes, offrant un environnement d'apprentissage adapté et personnalisé.

### Technologies utilisées

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Framework**: NextUI, Material-UI (MUI)
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Base de données**: MongoDB
- **Authentification**: JWT (JSON Web Tokens)
- **Tests**: Jest, React Testing Library
- **Outils de développement**: ESLint, Prettier

## Architecture du projet

### Structure des dossiers

```
frontend/
├── app/                    # Pages Next.js (App Router)
├── components/             # Composants React réutilisables
├── hooks/                  # Hooks personnalisés
├── utils/                  # Utilitaires et helpers
├── lib/                    # Configurations et bibliothèques
├── public/                 # Assets statiques
├── __tests__/              # Tests unitaires et d'intégration
└── docs/                   # Documentation

backend/
├── api/
│   ├── controllers/        # Contrôleurs API
│   ├── routes/            # Routes Express
│   ├── models/            # Modèles de données
│   └── utils/             # Utilitaires backend
└── config/                # Configuration serveur
```

### Architecture Frontend

#### App Router (Next.js 14)
Le projet utilise le nouveau système de routage de Next.js 14 avec le dossier `app/`.

```typescript
app/
├── layout.tsx              # Layout principal
├── page.tsx               # Page d'accueil
├── login/
│   └── page.tsx           # Page de connexion
├── signup/
│   └── page.tsx           # Page d'inscription
├── dashboard/
│   └── page.tsx           # Tableau de bord
└── profile/
    └── page.tsx           # Profil utilisateur
```

#### Composants

Les composants sont organisés par fonctionnalité :

- **UI Components**: Composants d'interface réutilisables
- **Layout Components**: Composants de mise en page
- **Feature Components**: Composants spécifiques aux fonctionnalités
- **Error Boundaries**: Gestion des erreurs React

#### Hooks personnalisés

```typescript
hooks/
├── useEleveStats.ts       # Statistiques des élèves
├── useMobileOptimization.ts # Optimisation mobile
├── useOptimizedApi.ts     # API optimisée
├── useAuth.ts             # Authentification
└── useErrorHandler.ts     # Gestion d'erreurs
```

## Système d'authentification

### JWT Implementation

L'authentification utilise des tokens JWT avec refresh tokens :

```typescript
// Structure du token
interface JWTPayload {
  userId: string;
  email: string;
  role: 'eleve' | 'enseignant' | 'admin';
  exp: number;
}
```

### Flow d'authentification

1. **Login**: Envoi des credentials → Validation → Génération des tokens
2. **Token Storage**: Stockage sécurisé dans localStorage
3. **Auto-refresh**: Renouvellement automatique des tokens expirés
4. **Logout**: Suppression des tokens et redirection

### Sécurité

- Validation côté client et serveur
- Hachage des mots de passe avec bcrypt
- Protection CSRF
- Validation des entrées utilisateur

## Gestion des erreurs

### Error Boundaries

```typescript
// ErrorBoundary avec monitoring
class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log vers service de monitoring
    this.logErrorToService(error, errorInfo);
  }
}
```

### Système de retry

```typescript
// Retry automatique avec backoff exponentiel
const withRetry = async <T>(
  fn: () => Promise<T>,
  options: { maxRetries: number; retryDelay: number }
): Promise<T> => {
  // Implementation avec retry logic
};
```

### Types d'erreurs gérées

- **Network Errors**: Problèmes de connexion
- **API Errors**: Erreurs serveur (4xx, 5xx)
- **Validation Errors**: Erreurs de validation
- **Runtime Errors**: Erreurs d'exécution React

## Optimisations de performance

### Core Web Vitals

Le projet est optimisé pour les Core Web Vitals :

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Techniques d'optimisation

#### Lazy Loading
```typescript
// Lazy loading des composants
const LazyComponent = lazy(() => import('./Component'));

// Lazy loading des images
<Image
  src="/image.jpg"
  loading="lazy"
  placeholder="blur"
/>
```

#### Memoization
```typescript
// Memoization des calculs coûteux
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Memoization des composants
const MemoizedComponent = memo(Component);
```

#### Code Splitting
```typescript
// Splitting par route
const DashboardPage = dynamic(() => import('./Dashboard'), {
  loading: () => <LoadingSpinner />
});
```

### Optimisation mobile

```typescript
// Hook d'optimisation mobile
const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  return {
    isMobile,
    shouldReduceAnimations: isMobile,
    shouldLazyLoad: isMobile,
  };
};
```

## API et gestion des données

### Structure des endpoints

```
/api/users/
├── POST /login          # Connexion
├── POST /signup         # Inscription
├── POST /refresh        # Refresh token
├── GET /profile         # Profil utilisateur
└── PUT /profile         # Mise à jour profil

/api/stats/
├── GET /eleve/:id       # Statistiques élève
└── GET /global          # Statistiques globales
```

### Gestion du cache

```typescript
// Cache avec SWR pattern
const useEleveStats = (eleveId: string) => {
  const { data, error, mutate } = useSWR(
    `/api/stats/eleve/${eleveId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );
};
```

### Assets statiques et rafraîchissement CDN

- Les images sous `public/` peuvent être fortement mises en cache par le CDN/navigateur.
- Pour forcer le rafraîchissement après mise à jour d’un asset sans changer son nom, utiliser un paramètre de version:

```
app/page.tsx:183
avatar: "/assets/family/avatar/marie.webp?v=20251113"

app/page.tsx:190
avatar: "/assets/family/avatar/thomas.webp?v=20251113"
```

- En cas de PWA installée, une actualisation forcée (`Cmd + Shift + R`) ou vidage du cache peut être nécessaire.

### Contenu d’interface mis à jour

- CTA d’inscription: sous‑titre précisant l’essai complet de 7 jours
- Bloc explicatif Alia: exemples d’adaptation concrète des activités
- En‑tête Shop: clarification produits complémentaires vs abonnement
- Témoignages: note sur le double rôle du fondateur/papa

### Validation des données

```typescript
// Validation avec Zod
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nom: z.string().min(2),
  prenom: z.string().min(2),
});
```

## Tests

### Structure des tests

```
__tests__/
├── components/          # Tests de composants
├── hooks/              # Tests de hooks
├── integration/        # Tests d'intégration
└── utils/              # Tests d'utilitaires
```

### Types de tests

#### Tests unitaires
```typescript
// Test d'un hook
describe('useEleveStats', () => {
  it('should load stats correctly', async () => {
    const { result } = renderHook(() => useEleveStats('123'));
    
    await waitFor(() => {
      expect(result.current.stats).toBeDefined();
    });
  });
});
```

#### Tests d'intégration
```typescript
// Test du flow d'authentification
describe('Auth Flow', () => {
  it('should login user successfully', async () => {
    render(<LoginPage />);
    
    // Simulate user interaction
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });
});
```

### Configuration Jest

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
```

## Monitoring et logging

### Error Tracking

```typescript
// Integration avec service de monitoring
const logErrorToService = (error: Error, context: string) => {
  if (process.env.NODE_ENV === 'production') {
    // Sentry, LogRocket, etc.
    errorService.captureException(error, { context });
  }
};
```

### Performance Monitoring

```typescript
// Métriques de performance
const trackPerformance = (metric: string, value: number) => {
  if (process.env.NODE_ENV === 'production') {
    analytics.track(metric, { value, timestamp: Date.now() });
  }
};
```

### User Analytics

```typescript
// Tracking des interactions utilisateur
const trackUserAction = (action: string, properties?: object) => {
  analytics.track(action, {
    userId: user?.id,
    timestamp: Date.now(),
    ...properties,
  });
};
```

## Déploiement

### Variables d'environnement

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=development

# Backend (.env)
PORT=3001
MONGODB_URI=mongodb://localhost:27017/autistudy
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### Build et déploiement

```bash
# Build de production
npm run build

# Démarrage en production
npm start

# Tests avant déploiement
npm run test:ci
npm run lint
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm run test:ci
      - name: Run linting
        run: npm run lint
      - name: Build application
        run: npm run build
```

## Maintenance et évolution

### Code Quality

- **ESLint**: Règles de linting strictes
- **Prettier**: Formatage automatique du code
- **TypeScript**: Typage strict
- **Husky**: Git hooks pour la qualité

### Documentation du code

```typescript
/**
 * Hook pour gérer les statistiques d'un élève
 * @param eleveId - ID de l'élève
 * @returns Objet contenant les stats et les méthodes de gestion
 */
const useEleveStats = (eleveId: string) => {
  // Implementation
};
```

### Versioning

- **Semantic Versioning**: MAJOR.MINOR.PATCH
- **Changelog**: Documentation des changements
- **Git Flow**: Branches feature/develop/main

## Sécurité

### Bonnes pratiques

- Validation des entrées utilisateur
- Sanitisation des données
- Protection XSS et CSRF
- Chiffrement des données sensibles
- Audit régulier des dépendances

### Conformité RGPD

- Consentement utilisateur
- Droit à l'oubli
- Portabilité des données
- Chiffrement des données personnelles

## Support et contact

Pour toute question technique ou suggestion d'amélioration :

- **Documentation**: `/docs`
- **Issues**: GitHub Issues
- **Tests**: `npm test`
- **Build**: `npm run build`

---

*Cette documentation est maintenue à jour avec chaque version du projet.*

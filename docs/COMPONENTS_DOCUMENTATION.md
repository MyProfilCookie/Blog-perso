# Documentation des Composants React - AutiStudy

## Vue d'ensemble

Cette documentation présente tous les composants React utilisés dans l'application AutiStudy, leurs props, interfaces TypeScript et exemples d'utilisation.

---

## 🎨 Composants UI (Shadcn/UI)

### Button

Composant de bouton réutilisable avec plusieurs variantes et tailles.

**Interface:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

**Variantes:**
- `default` - Bouton principal bleu
- `destructive` - Bouton rouge pour actions destructives
- `outline` - Bouton avec bordure
- `secondary` - Bouton secondaire gris
- `ghost` - Bouton transparent
- `link` - Style de lien

**Tailles:**
- `default` - Taille standard (h-10)
- `sm` - Petit (h-9)
- `lg` - Grand (h-11)
- `icon` - Carré pour icônes (h-10 w-10)

**Exemple:**
```tsx
<Button variant="default" size="lg">
  Cliquez ici
</Button>
```

### Input

Composant d'entrée de texte stylisé.

**Props:**
```typescript
React.ComponentProps<"input"> & {
  className?: string;
  type?: string;
}
```

**Exemple:**
```tsx
<Input 
  type="email" 
  placeholder="votre@email.com"
  className="w-full"
/>
```

### Card, CardHeader, CardContent

Composants de carte pour organiser le contenu.

**Props:**
```typescript
// Card
React.HTMLAttributes<HTMLDivElement>

// CardHeader, CardContent
React.HTMLAttributes<HTMLDivElement>
```

**Exemple:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu de la carte
  </CardContent>
</Card>
```

### Dialog

Composant de dialogue modal.

**Composants:**
- `Dialog` - Conteneur principal
- `DialogTrigger` - Élément déclencheur
- `DialogContent` - Contenu du dialogue
- `DialogHeader` - En-tête
- `DialogTitle` - Titre
- `DialogDescription` - Description
- `DialogFooter` - Pied de page

**Exemple:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Ouvrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre du dialogue</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Fermer</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Sheet

Composant de panneau latéral coulissant.

**Interface:**
```typescript
interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {
  side?: "top" | "right" | "bottom" | "left";
}
```

**Composants:**
- `Sheet` - Conteneur
- `SheetTrigger` - Déclencheur
- `SheetContent` - Contenu avec position
- `SheetHeader` - En-tête
- `SheetTitle` - Titre
- `SheetDescription` - Description

### Table

Composants de tableau stylisés.

**Composants:**
- `Table` - Tableau principal
- `TableHeader` - En-tête
- `TableBody` - Corps
- `TableFooter` - Pied
- `TableRow` - Ligne
- `TableHead` - Cellule d'en-tête
- `TableCell` - Cellule de données

### Pagination

Composant de pagination avec navigation.

**Interface:**
```typescript
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> & React.ComponentProps<"a">;
```

**Composants:**
- `Pagination` - Conteneur
- `PaginationContent` - Liste des éléments
- `PaginationItem` - Élément individuel
- `PaginationLink` - Lien de page
- `PaginationPrevious` - Bouton précédent
- `PaginationNext` - Bouton suivant
- `PaginationEllipsis` - Points de suspension

---

## 🏗️ Composants Métier

### ErrorBoundary

Composant de gestion d'erreurs React avec fallback personnalisé.

**Interface:**
```typescript
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}
```

**Fonctionnalités:**
- Capture les erreurs JavaScript
- Affichage de fallback personnalisé
- Logging automatique des erreurs
- Gestion spéciale des erreurs de chunks
- Bouton de retry avec nettoyage du cache

**Exemple:**
```tsx
<ErrorBoundary 
  onError={(error, errorInfo) => console.log(error)}
  fallback={<div>Erreur personnalisée</div>}
>
  <MonComposant />
</ErrorBoundary>
```

### ChunkErrorFallback

Composant spécialisé pour les erreurs de chargement de chunks.

**Interface:**
```typescript
interface ChunkErrorFallbackProps {
  onRetry?: () => void;
}
```

**Fonctionnalités:**
- Auto-retry après 3 secondes
- Nettoyage du cache navigateur
- Nettoyage du localStorage
- Rechargement automatique de la page
- Interface utilisateur informative

### PremiumGuard (HOC)

Higher-Order Component pour protéger les fonctionnalités premium.

**Interface:**
```typescript
interface SubscriptionInfo {
  type: string;
  status: string;
  expiresAt?: string;
  role?: string;
  subscription?: {
    type: string;
    status: string;
  };
}

function withPremiumGuard<P extends object>(
  WrappedComponent: React.ComponentType<any>
): React.ComponentType<P>
```

**Fonctionnalités:**
- Vérification de l'abonnement
- Redirection automatique
- Gestion du thème sombre
- Loading states
- Messages d'erreur personnalisés

**Exemple:**
```tsx
const PremiumComponent = withPremiumGuard(MonComposant);
```

### StatsSync

Composant de synchronisation des statistiques utilisateur.

**Interface:**
```typescript
interface StatsSyncProps {
  userId: string;
  onSyncComplete?: (stats: any) => void;
}
```

**Fonctionnalités:**
- Synchronisation manuelle/automatique
- Indicateurs visuels de statut
- Gestion des erreurs
- Callback de completion

**Exemple:**
```tsx
<StatsSync 
  userId="user123"
  onSyncComplete={(stats) => console.log(stats)}
/>
```

### AutiStudyHeader

Composant d'en-tête principal de l'application.

**Fonctionnalités:**
- Navigation responsive
- Menu utilisateur avec dropdown
- Changement de thème
- Gestion de l'authentification
- Menu mobile avec Sheet

### OrdersSection

Composant d'affichage des commandes utilisateur.

**Interface:**
```typescript
interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}
```

**Fonctionnalités:**
- Affichage des commandes paginées
- Filtres par statut
- Détails des produits
- Calculs automatiques
- Interface responsive

---

## 🎯 Composants Spécialisés

### QuizHebdomadaire

Composant de quiz interactif avec animations.

**Fonctionnalités:**
- Questions à choix multiples
- Animations Framer Motion
- Système de scoring
- Progression visuelle
- Sauvegarde automatique
- Feedback immédiat

### AIAssistant

Assistant IA intégré pour l'aide aux utilisateurs.

**Interface:**
```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
}
```

**Fonctionnalités:**
- Chat en temps réel
- Historique des messages
- Indicateurs de frappe
- Gestion d'erreurs
- Interface conversationnelle

### OrderHistoryDialog

Dialogue d'historique des commandes avec lazy loading.

**Fonctionnalités:**
- Chargement paresseux des données
- Tableau paginé
- Filtres de recherche
- Export des données
- Mise à jour en temps réel

---

## 🎨 Composants d'Optimisation

### LazyComponents

Composants avec chargement paresseux pour optimiser les performances.

**Composants disponibles:**
```typescript
export const LazyCharts = dynamic(() => import('./Charts'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

export const LazyDashboard = dynamic(() => import('./OptimizedDashboard'), {
  loading: () => <DashboardSkeleton />,
});

export const LazyAIAssistant = dynamic(() => import('./AIAssistant'), {
  loading: () => <AssistantSkeleton />,
  ssr: false,
});
```

### SkeletonLoaders

Collection de composants skeleton pour les états de chargement.

**Composants disponibles:**
- `CardSkeleton` - Skeleton pour cartes
- `ImageSkeleton` - Skeleton pour images
- `ChartSkeleton` - Skeleton pour graphiques
- `ListSkeleton` - Skeleton pour listes
- `TableSkeleton` - Skeleton pour tableaux
- `GridSkeleton` - Skeleton pour grilles
- `ProfileSkeleton` - Skeleton pour profils
- `StatsSkeleton` - Skeleton pour statistiques
- `FormSkeleton` - Skeleton pour formulaires

**Hook utilitaire:**
```typescript
const useSkeletonLoader = (loading: boolean, delay: number = 200) => {
  // Retourne showSkeleton: boolean
}
```

### OptimizedNextUI

Exports optimisés des composants NextUI pour réduire la taille du bundle.

**Composants exportés:**
```typescript
export { Button, Card, CardBody, Input, Textarea, Select, Modal, Tabs, Progress, Avatar, Badge, Spinner, Tooltip } from '@nextui-org/react';
```

---

## 🎭 Composants de Thème

### ThemeAwareToaster

Composant de notifications adaptatif au thème.

**Fonctionnalités:**
- Adaptation automatique au thème
- Positionnement configurable
- Couleurs riches
- Bouton de fermeture

**Exemple:**
```tsx
<ThemeAwareToaster />
```

### ThemeSwitch

Composant de basculement de thème avec icônes.

**Fonctionnalités:**
- Basculement clair/sombre
- Icônes animées
- Persistance des préférences
- Détection du thème système

---

## 📊 Composants de Données

### LazyCharts

Composant de graphiques avec chargement paresseux.

**Interface:**
```typescript
interface LazyChartsProps {
  type: 'line' | 'bar' | 'doughnut';
  data: any;
  options: any;
  fallback?: React.ReactNode;
}
```

**Fonctionnalités:**
- Support multiple types de graphiques
- Chargement paresseux
- Fallback personnalisable
- Gestion d'erreurs
- Performance optimisée

---

## 🔧 Composants Utilitaires

### HeaderAutisme

Composant d'en-tête spécialisé pour les pages d'information sur l'autisme.

**Interface:**
```typescript
interface HeaderAutismeProps {
  heading?: string;
  subheading?: string;
  description?: string;
}
```

### BackButton

Composant de bouton de retour avec navigation.

**Fonctionnalités:**
- Navigation automatique
- Icône de retour
- Styles cohérents
- Accessibilité

### QuestionSection

Composant pour afficher les sections de questions dans les rapports.

**Interface:**
```typescript
interface Question {
  _id: string;
  text?: string;
  options: string[];
  answer?: string;
  category?: string;
}

interface QuestionSectionProps {
  questions: Question[];
  selectedAnswers: Record<string, string>;
  onAnswerSelect: (questionId: string, answer: string) => void;
}
```

---

## 🧪 Composants de Test

### TokenTestComponent

Composant de test pour la fonctionnalité de reconnexion automatique.

**Fonctionnalités:**
- Test des tokens d'authentification
- Simulation de requêtes
- Affichage des résultats
- Interface de débogage

---

## 📱 Responsive Design

Tous les composants sont conçus pour être responsive avec :

- **Mobile First** : Optimisés pour mobile d'abord
- **Breakpoints Tailwind** : sm, md, lg, xl, 2xl
- **Flexbox/Grid** : Layouts adaptatifs
- **Touch Friendly** : Éléments tactiles optimisés

## 🎨 Système de Design

### Couleurs
- **Primary** : Bleu principal de l'application
- **Secondary** : Gris pour éléments secondaires
- **Accent** : Couleurs d'accentuation
- **Destructive** : Rouge pour actions destructives
- **Muted** : Couleurs atténuées pour texte secondaire

### Typographie
- **Headings** : h1-h6 avec tailles responsives
- **Body** : Texte principal lisible
- **Caption** : Texte de légende plus petit
- **Code** : Police monospace pour code

### Espacement
- **Padding** : p-1 à p-12 (4px à 48px)
- **Margin** : m-1 à m-12 (4px à 48px)
- **Gap** : gap-1 à gap-12 pour flexbox/grid

## 🔄 États des Composants

### Loading States
- Skeletons pour chargement
- Spinners pour actions
- Progress bars pour progression

### Error States
- Messages d'erreur clairs
- Boutons de retry
- Fallbacks gracieux

### Empty States
- Messages informatifs
- Actions suggérées
- Illustrations appropriées

## 📚 Bonnes Pratiques

### Performance
- Lazy loading pour composants lourds
- Memoization avec React.memo
- Optimisation des re-renders
- Code splitting automatique

### Accessibilité
- Labels ARIA appropriés
- Navigation au clavier
- Contraste suffisant
- Screen reader friendly

### Maintenabilité
- Props TypeScript typées
- Documentation inline
- Tests unitaires
- Storybook pour documentation

## 🔗 Dépendances Principales

- **React 18** : Framework principal
- **Next.js 14** : Framework full-stack
- **NextUI** : Composants UI modernes
- **Shadcn/UI** : Composants UI personnalisables
- **Tailwind CSS** : Framework CSS utilitaire
- **Framer Motion** : Animations fluides
- **Lucide React** : Icônes modernes
- **Radix UI** : Primitives UI accessibles

Cette documentation couvre l'ensemble des composants React utilisés dans AutiStudy. Chaque composant est conçu pour être réutilisable, accessible et performant.
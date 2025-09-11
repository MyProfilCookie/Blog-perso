# 🧩 Système de Quiz Hebdomadaires AutiStudy

## 📋 Vue d'ensemble

Le système de quiz hebdomadaires est conçu spécialement pour les enfants autistes de 6 à 18 ans, avec des adaptations visuelles et cognitives pour faciliter l'apprentissage.

## 🏗️ Architecture

### Backend (Base de données)
- **Modèle Quiz** : `backend/models/Quiz.js`
- **Routes API** : `backend/routes/quiz.js`
- **Script d'import** : `backend/scripts/import-quizzes.js`

### Frontend (Interface utilisateur)
- **Composant principal** : `frontend/components/quiz/QuizHebdomadaire.tsx`
- **Page de sélection** : `frontend/pages/controle/quiz-hebdomadaire.tsx`
- **Données** : `frontend/autistudy_quizzes_52.json` (52 quiz complets)

## 🚀 Installation et Configuration

### 1. Configuration de la base de données

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Importer les quiz dans la base de données
npm run import-quizzes
```

### 2. Variables d'environnement

Assurez-vous que `NEXT_PUBLIC_API_URL` est configuré dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📊 Structure des données

### Modèle Quiz
```javascript
{
  _id: ObjectId,
  week: Number,           // 1-52
  title: String,          // "Quiz Hebdomadaire 1"
  description: String,    // Description optionnelle
  questions: [
    {
      id: Number,
      subject: String,    // "Mathématiques", "Français", etc.
      question: String,
      options: [String],  // Tableau des choix
      answer: String,     // Réponse correcte
      difficulty: String, // "facile", "moyen", "difficile"
      ageRange: {
        min: Number,      // 6-18
        max: Number       // 6-18
      },
      imageUrl: String,   // URL d'image optionnelle
      explanation: String // Explication de la réponse
    }
  ],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId
}
```

### Modèle QuizResult
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  quizId: ObjectId,
  week: Number,
  score: Number,
  totalQuestions: Number,
  percentage: Number,
  answers: [
    {
      questionId: Number,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
      timeSpent: Number
    }
  ],
  timeSpent: Number,
  completedAt: Date,
  attempts: Number
}
```

## 🔌 API Endpoints

### Quiz
- `GET /api/quiz` - Récupérer tous les quiz actifs
- `GET /api/quiz/week/:week` - Récupérer un quiz par semaine
- `GET /api/quiz/:id` - Récupérer un quiz par ID
- `POST /api/quiz` - Créer un nouveau quiz (Admin)
- `PUT /api/quiz/:id` - Mettre à jour un quiz (Admin)
- `DELETE /api/quiz/:id` - Supprimer un quiz (Admin)

### Résultats
- `POST /api/quiz/:id/submit` - Soumettre les réponses d'un quiz
- `GET /api/quiz/results/user/:userId` - Récupérer les résultats d'un utilisateur
- `GET /api/quiz/results/user/:userId/stats` - Statistiques d'un utilisateur
- `GET /api/quiz/results/week/:week` - Résultats pour une semaine (Admin)

### Statistiques
- `GET /api/quiz/stats/overview` - Statistiques générales (Admin)

## 🎨 Adaptations pour l'autisme

### Visuelles
- **Couleurs par matière** : Chaque matière a sa couleur distinctive
- **Icônes** : Représentation visuelle de chaque matière
- **Animations douces** : Transitions fluides avec Framer Motion
- **Feedback immédiat** : Validation visuelle des réponses

### Cognitives
- **Questions simples** : Phrases courtes et claires
- **Une difficulté à la fois** : Pas de surcharge cognitive
- **Feedback positif** : Encouragements constants
- **Progression visible** : Barre de progression claire

### Techniques
- **Responsive design** : Adapté mobile/tablette/desktop
- **Mode sombre** : Support complet du thème sombre
- **Accessibilité** : Navigation au clavier, ARIA labels
- **Performance** : Chargement optimisé des ressources

## 📱 Utilisation

### Pour les utilisateurs
1. Accéder à `/controle/quiz-hebdomadaire`
2. Choisir un quiz par semaine
3. Répondre aux questions avec feedback immédiat
4. Voir les résultats et statistiques

### Pour les administrateurs
1. Créer/modifier des quiz via l'API
2. Consulter les statistiques globales
3. Suivre les performances des utilisateurs
4. Gérer le contenu des quiz

## 🔧 Développement

### Ajouter un nouveau quiz
```javascript
const newQuiz = {
  week: 53,
  title: "Quiz Hebdomadaire 53",
  description: "Nouveau quiz",
  questions: [
    {
      id: 1,
      subject: "Mathématiques",
      question: "Combien font 3 + 2 ?",
      options: ["4", "5", "6"],
      answer: "5",
      difficulty: "facile",
      ageRange: { min: 6, max: 8 }
    }
  ]
};
```

### Personnaliser les couleurs
Modifier le dictionnaire `subjectColors` dans `QuizHebdomadaire.tsx` :

```javascript
const subjectColors = {
  'Mathématiques': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Français': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  // ...
};
```

## 📈 Statistiques et Analytics

Le système collecte automatiquement :
- Scores par utilisateur et par semaine
- Temps passé sur chaque question
- Taux de réussite par matière
- Progression dans le temps
- Tentatives multiples

## 🚀 Déploiement

1. **Backend** : Déployer sur votre serveur avec MongoDB
2. **Frontend** : Build et déploiement sur Vercel/Netlify
3. **Import** : Exécuter le script d'import des quiz
4. **Configuration** : Mettre à jour les URLs d'API

## 🔍 Dépannage

### Problèmes courants
- **Quiz non trouvés** : Vérifier l'import des données
- **Erreurs API** : Vérifier la configuration MongoDB
- **Problèmes d'affichage** : Vérifier les variables d'environnement

### Logs utiles
```bash
# Backend
npm run dev

# Frontend
npm run dev
```

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs de la console
2. Consulter la documentation API
3. Tester les endpoints avec Postman/Insomnia

---

**AutiStudy** - Système de quiz adapté pour l'autisme 🧩

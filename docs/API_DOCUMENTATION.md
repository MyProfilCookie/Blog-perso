# Documentation API AutiStudy

## Base URL
```
Production: https://blog-perso.onrender.com/api
Development: http://localhost:3001/api
```

## Authentification

L'API utilise l'authentification JWT (JSON Web Tokens). Pour accéder aux routes protégées, incluez le token dans l'en-tête Authorization :

```
Authorization: Bearer <your-jwt-token>
```

## Codes de Réponse

| Code | Description |
|------|-------------|
| 200  | Succès |
| 201  | Créé avec succès |
| 400  | Requête invalide |
| 401  | Non authentifié |
| 403  | Accès interdit |
| 404  | Ressource non trouvée |
| 500  | Erreur serveur |

---

## 👤 Authentification & Utilisateurs

### Base: `/api/users`

#### POST `/signup`
Inscription d'un nouvel utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Réponse:**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token"
}
```

#### POST `/login`
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "student"
  },
  "token": "jwt_token"
}
```

#### GET `/me` 🔒
Obtenir les informations de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

**Réponse:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student"
}
```

#### GET `/`
Récupérer tous les utilisateurs.

**Réponse:**
```json
[
  {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
]
```

#### GET `/:id`
Obtenir un utilisateur par ID.

**Réponse:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student"
}
```

#### PUT `/:id` 🔒
Mettre à jour un utilisateur.

**Body:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated"
}
```

#### DELETE `/:id` 🔒
Supprimer un utilisateur.

#### POST `/promote/:userId` 🔒
Promouvoir un utilisateur en administrateur.

---

## 🛒 Produits & Boutique

### Base: `/api/products`

#### GET `/`
Récupérer tous les produits.

**Réponse:**
```json
[
  {
    "id": "product_id",
    "name": "Cours de Mathématiques",
    "description": "Cours complet de mathématiques",
    "price": 29.99,
    "category": "education",
    "image": "image_url"
  }
]
```

#### GET `/:id`
Récupérer un produit par ID.

#### POST `/` 🔒
Créer un nouveau produit.

**Body:**
```json
{
  "name": "Nouveau Cours",
  "description": "Description du cours",
  "price": 39.99,
  "category": "education"
}
```

#### PUT `/:id` 🔒
Mettre à jour un produit.

#### DELETE `/:id` 🔒
Supprimer un produit.

---

## 📦 Commandes

### Base: `/api/orders`

#### POST `/` 🔒
Créer une nouvelle commande.

**Body:**
```json
{
  "products": [
    {
      "productId": "product_id",
      "quantity": 1
    }
  ],
  "totalAmount": 29.99
}
```

#### GET `/` 🔒
Obtenir toutes les commandes.

#### GET `/:id` 🔒
Obtenir une commande par ID.

#### PUT `/:id` 🔒
Mettre à jour une commande.

#### DELETE `/:id` 🔒
Supprimer une commande.

#### POST `/checkout` 🔒
Processus de checkout.

#### GET `/user/:userId` 🔒
Obtenir les commandes d'un utilisateur.

#### GET `/users/:userId/orders` 🔒
Obtenir les commandes d'un utilisateur (compatible frontend).

#### GET `/users/:userId/order-counts` 🔒
Obtenir les compteurs de commandes d'un utilisateur.

#### PUT `/:id/status` 🔒
Mettre à jour le statut d'une commande.

#### GET `/:id/status-history` 🔒
Obtenir l'historique des statuts d'une commande.

---

## 💳 Paiements

### Base: `/api/payments`

#### POST `/webhook/stripe`
Webhook Stripe pour traiter les paiements.

**Note:** Cette route utilise `express.raw()` pour traiter les données brutes de Stripe.

---

## 🎓 Cours & Leçons

### Base: `/api/lessons`

#### GET `/lesson-of-the-day`
Récupérer la leçon du jour.

**Réponse:**
```json
{
  "id": "lesson_id",
  "title": "Leçon du jour",
  "content": "Contenu de la leçon",
  "subject": "mathematics",
  "date": "2024-01-15"
}
```

#### POST `/` 🔒
Créer une nouvelle leçon.

#### GET `/`
Obtenir toutes les leçons.

#### GET `/:id`
Obtenir une leçon par ID.

#### PUT `/:id` 🔒
Mettre à jour une leçon.

#### DELETE `/:id` 🔒
Supprimer une leçon.

### Cours Mensuels: `/api/monthly`

#### POST `/create` 🔒
Créer un nouveau cours mensuel.

#### GET `/`
Récupérer tous les cours mensuels.

#### GET `/:id`
Récupérer un cours par ID.

#### PUT `/update/:id` 🔒
Mettre à jour un cours.

#### DELETE `/delete/:id` 🔒
Supprimer un cours.

#### GET `/monthly`
Récupérer les cours d'un mois spécifique.

**Query Params:** `?month=2024-09`

---

## 📊 Rapports & Statistiques

### Base: `/api/reports`

#### GET `/` 🔒 👑
Récupérer tous les rapports (admin seulement).

#### GET `/user/:userId` 🔒
Récupérer tous les rapports d'un utilisateur.

#### GET `/user/:userId/week/:weekNumber` 🔒
Récupérer un rapport spécifique par utilisateur et semaine.

### Rapports Hebdomadaires: `/api/rapport-hebdo`

#### GET `/` 🔒
Récupérer les rapports hebdomadaires.

#### POST `/` 🔒
Créer un rapport hebdomadaire.

### Trimestres: `/api/trimestres`

#### GET `/` 🔒
Récupérer les données trimestrielles.

#### POST `/` 🔒
Créer des données trimestrielles.

### Statistiques: `/api/stats`

#### GET `/` 🔒
Obtenir les statistiques utilisateur.

**Réponse:**
```json
{
  "totalQuizzes": 45,
  "averageScore": 85.5,
  "completedLessons": 23,
  "weeklyProgress": [
    { "week": 1, "score": 80 },
    { "week": 2, "score": 90 }
  ]
}
```

---

## 👨‍🎓 Élèves

### Base: `/api/eleves`

#### GET `/` 🔒
Récupérer tous les élèves.

#### POST `/` 🔒
Créer un profil élève.

#### GET `/:id` 🔒
Récupérer un élève par ID.

#### PUT `/:id` 🔒
Mettre à jour un profil élève.

#### DELETE `/:id` 🔒
Supprimer un profil élève.

---

## 📚 Articles & Blog

### Base: `/api/articles`

#### GET `/`
Récupérer tous les articles.

#### POST `/` 🔒 👑
Ajouter un nouvel article (admin seulement).

#### PUT `/:id` 🔒 👑
Mettre à jour un article (admin seulement).

#### DELETE `/:id` 🔒 👑
Supprimer un article (admin seulement).

### Blog: `/api/blogs`

#### GET `/`
Récupérer tous les articles de blog avec pagination.

#### GET `/:id`
Récupérer un article de blog par ID.

#### POST `/` 🔒
Créer un nouvel article de blog.

#### PUT `/:id` 🔒
Mettre à jour un article de blog.

#### DELETE `/:id` 🔒
Supprimer un article de blog.

---

## 📧 Messages & Contact

### Base: `/api/messages`

#### GET `/`
Récupérer tous les messages.

#### POST `/`
Créer un nouveau message.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question",
  "message": "Contenu du message"
}
```

#### GET `/:id`
Récupérer un message par ID.

#### DELETE `/:id` 🔒
Supprimer un message.

### Contact: `/api/contact`

Routes pour gérer les formulaires de contact.

---

## 🔧 Administration

### Base: `/api/admin`

**Note:** Toutes les routes admin nécessitent le rôle administrateur 👑

#### Gestion des utilisateurs

#### GET `/users` 🔒 👑
Obtenir tous les utilisateurs.

#### POST `/users/promote/:userId` 🔒 👑
Promouvoir un utilisateur en admin.

#### POST `/users/demote/:id` 🔒 👑
Rétrograder un admin en utilisateur.

#### DELETE `/users/:id` 🔒 👑
Supprimer un utilisateur.

#### Gestion des cours

#### GET `/courses` 🔒 👑
Obtenir tous les cours.

#### POST `/courses` 🔒 👑
Ajouter un nouveau cours.

#### PUT `/courses/:id` 🔒 👑
Mettre à jour un cours.

#### DELETE `/courses/:id` 🔒 👑
Supprimer un cours.

#### Gestion des articles

#### GET `/articles` 🔒 👑
Obtenir tous les articles.

#### POST `/articles` 🔒 👑
Ajouter un nouvel article.

#### PUT `/articles/:id` 🔒 👑
Mettre à jour un article.

#### DELETE `/articles/:id` 🔒 👑
Supprimer un article.

#### Gestion des messages

#### GET `/messages` 🔒 👑
Obtenir tous les messages des utilisateurs.

---

## 💰 Abonnements

### Base: `/api/subscriptions`

#### GET `/info` 🔒
Obtenir les informations d'abonnement.

**Réponse:**
```json
{
  "type": "premium",
  "status": "active",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "features": ["unlimited_quizzes", "advanced_stats"]
}
```

#### POST `/create-checkout-session` 🔒
Créer une session de paiement Stripe pour l'abonnement.

**Body:**
```json
{
  "priceId": "price_stripe_id",
  "successUrl": "https://yoursite.com/success",
  "cancelUrl": "https://yoursite.com/cancel"
}
```

#### POST `/webhook`
Webhook pour traiter les événements d'abonnement Stripe.

---

## 📖 Matières

### Base: `/api/subjects`

#### GET `/`
Récupérer toutes les matières disponibles.

**Réponse:**
```json
[
  {
    "id": "math",
    "name": "Mathématiques",
    "description": "Cours de mathématiques",
    "icon": "calculator"
  },
  {
    "id": "french",
    "name": "Français",
    "description": "Cours de français",
    "icon": "book"
  }
]
```

#### POST `/` 🔒 👑
Créer une nouvelle matière.

#### PUT `/:id` 🔒 👑
Mettre à jour une matière.

#### DELETE `/:id` 🔒 👑
Supprimer une matière.

---

## 🔄 Erreurs de Révision

### Base: `/api/revision-errors`

#### GET `/` 🔒
Récupérer les erreurs de révision.

#### POST `/` 🔒
Enregistrer une erreur de révision.

**Body:**
```json
{
  "questionId": "question_id",
  "userAnswer": "réponse_utilisateur",
  "correctAnswer": "bonne_réponse",
  "subject": "mathematics"
}
```

#### PUT `/:id` 🔒
Mettre à jour une erreur de révision.

#### DELETE `/:id` 🔒
Supprimer une erreur de révision.

---

## 📋 Légende

- 🔒 : Authentification requise
- 👑 : Rôle administrateur requis
- 📊 : Retourne des données statistiques
- 💳 : Traitement de paiement

## Exemples d'utilisation

### Authentification
```javascript
// Connexion
const response = await fetch('/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();

// Utilisation du token pour les requêtes protégées
const userResponse = await fetch('/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Récupération des statistiques
```javascript
const statsResponse = await fetch('/api/stats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const stats = await statsResponse.json();
console.log('Statistiques utilisateur:', stats);
```

## Gestion d'erreurs

L'API retourne des erreurs au format JSON :

```json
{
  "message": "Description de l'erreur",
  "error": "Détails techniques (en développement)",
  "code": "ERROR_CODE"
}
```

## Rate Limiting

L'API implémente un rate limiting pour prévenir les abus :
- 100 requêtes par minute pour les utilisateurs authentifiés
- 20 requêtes par minute pour les utilisateurs non authentifiés

## Versioning

Version actuelle : **v1**

Les futures versions seront préfixées : `/api/v2/...`
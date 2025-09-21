# Documentation API - AutiStudy

## Vue d'ensemble

L'API AutiStudy fournit les endpoints nécessaires pour la gestion des utilisateurs, l'authentification, et les statistiques de la plateforme éducative.

**Base URL**: `http://localhost:3001/api`

## Authentification

L'API utilise l'authentification JWT avec des tokens d'accès et de rafraîchissement.

### Headers requis

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### Authentification

#### POST /users/login
Connexion d'un utilisateur.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "64a7b8c9d1e2f3g4h5i6j7k8",
    "email": "user@example.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "role": "eleve",
    "dateCreation": "2023-07-07T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400`: Données manquantes ou invalides
- `401`: Identifiants incorrects
- `429`: Trop de tentatives de connexion

---

#### POST /users/signup
Inscription d'un nouvel utilisateur.

**Request Body:**
```json
{
  "nom": "Dupont",
  "prenom": "Marie",
  "email": "marie.dupont@example.com",
  "password": "password123",
  "role": "eleve"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "user": {
    "id": "64a7b8c9d1e2f3g4h5i6j7k9",
    "email": "marie.dupont@example.com",
    "nom": "Dupont",
    "prenom": "Marie",
    "role": "eleve",
    "dateCreation": "2023-07-07T10:35:00.000Z"
  }
}
```

**Errors:**
- `400`: Données manquantes ou format invalide
- `409`: Email déjà utilisé
- `422`: Mot de passe trop faible

---

#### POST /users/refresh
Rafraîchissement du token d'accès.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401`: Token de rafraîchissement invalide ou expiré
- `403`: Token révoqué

---

#### POST /users/logout
Déconnexion de l'utilisateur.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

### Gestion des utilisateurs

#### GET /users/profile
Récupération du profil utilisateur.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "64a7b8c9d1e2f3g4h5i6j7k8",
    "email": "user@example.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "role": "eleve",
    "dateCreation": "2023-07-07T10:30:00.000Z",
    "derniereConnexion": "2023-07-07T14:20:00.000Z",
    "preferences": {
      "theme": "light",
      "notifications": true
    }
  }
}
```

**Errors:**
- `401`: Token manquant ou invalide
- `404`: Utilisateur non trouvé

---

#### PUT /users/profile
Mise à jour du profil utilisateur.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "nom": "Nouveau Nom",
  "prenom": "Nouveau Prénom",
  "preferences": {
    "theme": "dark",
    "notifications": false
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profil mis à jour avec succès",
  "user": {
    "id": "64a7b8c9d1e2f3g4h5i6j7k8",
    "email": "user@example.com",
    "nom": "Nouveau Nom",
    "prenom": "Nouveau Prénom",
    "role": "eleve",
    "preferences": {
      "theme": "dark",
      "notifications": false
    }
  }
}
```

**Errors:**
- `400`: Données invalides
- `401`: Non autorisé
- `422`: Validation échouée

### Statistiques

#### GET /stats/eleve/:id
Récupération des statistiques d'un élève.

**Headers:** `Authorization: Bearer <access_token>`

**Parameters:**
- `id` (string): ID de l'élève

**Query Parameters:**
- `period` (string, optional): Période des stats (`week`, `month`, `year`)
- `subject` (string, optional): Matière spécifique

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "eleveId": "64a7b8c9d1e2f3g4h5i6j7k8",
    "periode": "month",
    "exercicesCompletes": 45,
    "tempsTotal": 1800, // en secondes
    "moyenneReussite": 85.5,
    "progression": {
      "mathematiques": {
        "niveau": 3,
        "progression": 75,
        "exercicesCompletes": 20,
        "moyenneReussite": 88.2
      },
      "francais": {
        "niveau": 2,
        "progression": 60,
        "exercicesCompletes": 15,
        "moyenneReussite": 82.1
      }
    },
    "activiteRecente": [
      {
        "date": "2023-07-07T14:00:00.000Z",
        "exercice": "Addition simple",
        "matiere": "mathematiques",
        "reussite": true,
        "temps": 120
      }
    ],
    "objectifs": {
      "hebdomadaire": {
        "exercices": 10,
        "progres": 7
      },
      "mensuel": {
        "exercices": 40,
        "progres": 35
      }
    }
  }
}
```

**Errors:**
- `401`: Non autorisé
- `403`: Accès refusé (pas le bon élève ou enseignant)
- `404`: Élève non trouvé

---

#### GET /stats/global
Statistiques globales de la plateforme (admin uniquement).

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "utilisateursActifs": 1250,
    "exercicesCompletes": 15420,
    "tempsApprentissageTotal": 89400, // en secondes
    "moyenneReussiteGlobale": 78.5,
    "repartitionNiveaux": {
      "niveau1": 420,
      "niveau2": 380,
      "niveau3": 290,
      "niveau4": 160
    },
    "activiteParJour": [
      {
        "date": "2023-07-01",
        "exercices": 245,
        "utilisateurs": 89
      }
    ]
  }
}
```

**Errors:**
- `401`: Non autorisé
- `403`: Accès refusé (rôle admin requis)

### Exercices et contenu

#### GET /exercices
Liste des exercices disponibles.

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `matiere` (string, optional): Filtrer par matière
- `niveau` (number, optional): Filtrer par niveau (1-5)
- `page` (number, optional): Page de pagination (défaut: 1)
- `limit` (number, optional): Nombre d'éléments par page (défaut: 20)

**Response (200):**
```json
{
  "success": true,
  "exercices": [
    {
      "id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "titre": "Addition simple",
      "description": "Exercices d'addition avec des nombres à 1 chiffre",
      "matiere": "mathematiques",
      "niveau": 1,
      "dureeEstimee": 300, // en secondes
      "objectifs": ["Maîtriser l'addition", "Calcul mental"],
      "adapteAutisme": true,
      "dateCreation": "2023-07-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

---

#### GET /exercices/:id
Détails d'un exercice spécifique.

**Headers:** `Authorization: Bearer <access_token>`

**Parameters:**
- `id` (string): ID de l'exercice

**Response (200):**
```json
{
  "success": true,
  "exercice": {
    "id": "64a7b8c9d1e2f3g4h5i6j7k8",
    "titre": "Addition simple",
    "description": "Exercices d'addition avec des nombres à 1 chiffre",
    "matiere": "mathematiques",
    "niveau": 1,
    "dureeEstimee": 300,
    "instructions": "Résolvez les additions suivantes...",
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice",
        "question": "Combien font 2 + 3 ?",
        "options": ["4", "5", "6", "7"],
        "reponseCorrecte": "5",
        "explication": "2 + 3 = 5"
      }
    ],
    "adaptations": {
      "supportVisuel": true,
      "tempsSupplementaire": true,
      "pausesPossibles": true
    }
  }
}
```

---

#### POST /exercices/:id/tentative
Soumettre une tentative d'exercice.

**Headers:** `Authorization: Bearer <access_token>`

**Parameters:**
- `id` (string): ID de l'exercice

**Request Body:**
```json
{
  "reponses": [
    {
      "questionId": "q1",
      "reponse": "5"
    }
  ],
  "tempsEcoule": 180, // en secondes
  "pausesUtilisees": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "resultat": {
    "id": "64a7b8c9d1e2f3g4h5i6j7k9",
    "exerciceId": "64a7b8c9d1e2f3g4h5i6j7k8",
    "eleveId": "64a7b8c9d1e2f3g4h5i6j7k8",
    "score": 85,
    "tempsEcoule": 180,
    "questionsCorrectes": 8,
    "questionsTotal": 10,
    "dateCompletion": "2023-07-07T14:30:00.000Z",
    "feedback": {
      "message": "Excellent travail ! Tu progresses bien.",
      "pointsForts": ["Calcul rapide", "Bonne concentration"],
      "ameliorations": ["Attention aux retenues"]
    }
  }
}
```

## Codes d'erreur

### Codes HTTP standards

- `200`: Succès
- `201`: Créé avec succès
- `400`: Requête invalide
- `401`: Non authentifié
- `403`: Accès refusé
- `404`: Ressource non trouvée
- `409`: Conflit (ex: email déjà utilisé)
- `422`: Entité non traitable (validation échouée)
- `429`: Trop de requêtes
- `500`: Erreur serveur interne

### Format des erreurs

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Les données fournies sont invalides",
    "details": {
      "email": "Format d'email invalide",
      "password": "Le mot de passe doit contenir au moins 8 caractères"
    }
  }
}
```

## Rate Limiting

L'API implémente un système de limitation du taux de requêtes :

- **Authentification**: 5 tentatives par minute par IP
- **API générale**: 100 requêtes par minute par utilisateur
- **Upload de fichiers**: 10 requêtes par minute par utilisateur

## Versioning

L'API utilise le versioning par URL :

- Version actuelle: `v1`
- URL complète: `http://localhost:3001/api/v1/`

## Environnements

### Développement
- **URL**: `http://localhost:3001/api`
- **Base de données**: MongoDB local
- **Logs**: Niveau DEBUG

### Production
- **URL**: `https://api.autistudy.com/api`
- **Base de données**: MongoDB Atlas
- **Logs**: Niveau INFO
- **SSL**: Obligatoire
- **Rate limiting**: Activé

## Exemples d'utilisation

### JavaScript/TypeScript

```typescript
// Configuration Axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour l'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exemple de connexion
const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/users/login', { email, password });
    const { user, accessToken, refreshToken } = response.data;
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return user;
  } catch (error) {
    console.error('Erreur de connexion:', error.response.data);
    throw error;
  }
};

// Exemple de récupération des stats
const getEleveStats = async (eleveId: string) => {
  try {
    const response = await api.get(`/stats/eleve/${eleveId}`);
    return response.data.stats;
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    throw error;
  }
};
```

### cURL

```bash
# Connexion
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Récupération du profil
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Récupération des stats
curl -X GET http://localhost:3001/api/stats/eleve/64a7b8c9d1e2f3g4h5i6j7k8 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Support et contact

Pour toute question concernant l'API :

- **Documentation**: Cette documentation
- **Issues**: GitHub Issues
- **Email**: support@autistudy.com

---

*Cette documentation est maintenue à jour avec chaque version de l'API.*
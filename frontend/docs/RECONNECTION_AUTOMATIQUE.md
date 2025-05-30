# 🔄 Système de Reconnexion Automatique

## Vue d'ensemble

Ce système implémente une reconnexion automatique transparente lorsque les tokens d'authentification expirent. L'utilisateur n'a pas besoin d'être déconnecté et reconnecté manuellement.

## Architecture

### 1. Configuration Axios Centralisée (`frontend/utils/axiosConfig.js`)

- **Intercepteur de requête** : Ajoute automatiquement le token d'authentification à toutes les requêtes
- **Intercepteur de réponse** : Détecte les erreurs 401 et tente automatiquement le refresh du token
- **Gestion de la file d'attente** : Évite les appels multiples simultanés de refresh
- **Fallback de sécurité** : Déconnecte l'utilisateur si le refresh échoue

### 2. Hook Personnalisé (`frontend/hooks/useAuthenticatedApi.js`)

- Fournit des méthodes simplifiées pour les appels API authentifiés
- Utilise la configuration axios centralisée
- Gestion d'erreurs intégrée

### 3. Contexte d'Authentification Amélioré (`frontend/context/AuthContext.js`)

- Intercepteurs axios intégrés au contexte
- Gestion cohérente des tokens
- Nettoyage automatique en cas d'échec

## Fonctionnalités

### ✅ Reconnexion Transparente
- Détection automatique des tokens expirés (erreur 401)
- Tentative de refresh automatique avec le refresh token
- Relance automatique de la requête originale après refresh

### ✅ Gestion des Requêtes Simultanées
- File d'attente pour éviter les appels multiples de refresh
- Traitement en lot des requêtes en attente

### ✅ Sécurité
- Nettoyage automatique des tokens en cas d'échec
- Redirection vers la page de connexion si nécessaire
- Protection contre les boucles infinies

### ✅ Compatibilité
- Support des tokens existants (userToken, accessToken)
- Intégration transparente avec le code existant

## Utilisation

### Avec le Hook Personnalisé

```javascript
import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";

const MyComponent = () => {
  const { authenticatedGet, authenticatedPost } = useAuthenticatedApi();

  const fetchData = async () => {
    try {
      const response = await authenticatedGet("/api/data");
      // La reconnexion automatique se fait en arrière-plan si nécessaire
      console.log(response.data);
    } catch (error) {
      // Gestion d'erreur normale
      console.error(error);
    }
  };

  return <button onClick={fetchData}>Charger les données</button>;
};
```

### Avec les Fonctions Utilitaires

```javascript
import { apiGet, apiPost } from "@/utils/axiosConfig";

const fetchUserData = async () => {
  try {
    const response = await apiGet("/users/me");
    return response.data;
  } catch (error) {
    // La reconnexion automatique a été tentée si nécessaire
    throw error;
  }
};
```

## Configuration Backend Requise

### Endpoint de Refresh Token

Le backend doit fournir un endpoint `/auth/refresh-token` qui :

1. Accepte un refresh token dans le body de la requête
2. Valide le refresh token
3. Retourne un nouveau access token (et optionnellement un nouveau refresh token)

```javascript
// Exemple de réponse attendue
{
  "accessToken": "nouveau_access_token_jwt",
  "refreshToken": "nouveau_refresh_token_jwt" // optionnel
}
```

### Gestion des Tokens

- **Access Token** : Durée de vie courte (15 minutes recommandé)
- **Refresh Token** : Durée de vie longue (7 jours recommandé)
- **Stockage** : localStorage pour les deux tokens

## Test et Débogage

### Composant de Test

Un composant de test est disponible (`frontend/components/TokenTestComponent.jsx`) pour :

- Vérifier l'état des tokens
- Tester les appels API
- Simuler l'expiration de tokens
- Tester le flux complet de reconnexion

### Logs de Débogage

Le système produit des logs détaillés :

```
🔄 Tentative de rafraîchissement du token...
✅ Token rafraîchi avec succès
❌ Échec du rafraîchissement du token: [erreur]
```

## Intégration dans les Composants Existants

### Remplacement des Appels Axios Directs

**Avant :**
```javascript
const response = await axios.get(url, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**Après :**
```javascript
const { authenticatedGet } = useAuthenticatedApi();
const response = await authenticatedGet(url);
```

### Migration Progressive

1. Remplacer les appels axios directs par le hook personnalisé
2. Supprimer la gestion manuelle des tokens
3. Simplifier la gestion d'erreurs

## Avantages

- **Expérience utilisateur améliorée** : Pas de déconnexion intempestive
- **Sécurité renforcée** : Tokens à durée de vie courte
- **Code simplifié** : Gestion automatique des tokens
- **Robustesse** : Gestion des cas d'erreur et des requêtes simultanées

## Limitations

- Nécessite un refresh token valide
- Dépend de la configuration backend appropriée
- Fonctionne uniquement avec les erreurs 401 (Unauthorized)

## Maintenance

- Surveiller les logs de refresh pour détecter les problèmes
- Ajuster les durées de vie des tokens selon les besoins
- Tester régulièrement avec le composant de test

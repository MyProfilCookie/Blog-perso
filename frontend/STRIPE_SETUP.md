# Configuration Stripe pour AutiStudy

## 🚨 Erreur actuelle
Vous rencontrez l'erreur : `IntegrationError: Missing value for Stripe(): apiKey should be a string.`

Cela signifie que la clé publique Stripe n'est pas configurée.

## 🔧 Solution

### 1. Créer un fichier `.env.local`

Dans le dossier `frontend/`, créez un fichier `.env.local` avec le contenu suivant :

```bash
# Configuration API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Configuration Stripe (clés de test)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_votre_cle_ici
```

### 2. Obtenir vos clés Stripe

1. **Créer un compte Stripe** :
   - Allez sur https://stripe.com
   - Créez un compte gratuit

2. **Récupérer vos clés** :
   - Connectez-vous à votre Dashboard Stripe
   - Allez dans **Developers** > **API keys**
   - Copiez la **Publishable key** (commence par `pk_test_`)

3. **Remplacez dans `.env.local`** :
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG
   ```

### 3. Configuration Backend

Dans le dossier `backend/`, créez aussi un fichier `.env` avec :

```bash
# Clé secrète Stripe (commence par sk_test_)
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici

# Webhook secret (optionnel pour les tests)
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret_ici
```

### 4. Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

## 🧪 Clés de test Stripe

Pour les tests, vous pouvez utiliser ces cartes de test :

- **Visa** : `4242424242424242`
- **Mastercard** : `5555555555554444`
- **Date d'expiration** : `12/25`
- **CVC** : `123`

## 🚀 Production

Pour la production, remplacez les clés de test par les clés live :
- `pk_test_` → `pk_live_`
- `sk_test_` → `sk_live_`

## 📝 Notes importantes

- Le fichier `.env.local` est ignoré par Git (sécurité)
- Ne partagez jamais vos clés secrètes
- Les clés de test sont gratuites et sécurisées
- Stripe propose un mode test complet pour développer

## 🔍 Vérification

Après configuration, vous devriez voir dans la console :
```
✅ Clé Stripe chargée : pk_test_51ABC123...
```

Au lieu de :
```
✅ Clé Stripe chargée : undefined
```

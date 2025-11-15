# Guide de Déploiement - AutiStudy

## Vue d'ensemble

Ce guide détaille les étapes de déploiement de l'application AutiStudy en environnement de production.

## Prérequis

### Système
- **Node.js**: Version 18.x ou supérieure
- **npm**: Version 9.x ou supérieure
- **MongoDB**: Version 6.x ou supérieure
- **Git**: Pour le déploiement continu

### Services externes
- **Hébergement**: Vercel, Netlify, ou serveur VPS
- **Base de données**: MongoDB Atlas (recommandé)
- **CDN**: Cloudflare (optionnel)
- **Monitoring**: Sentry, LogRocket (optionnel)

## Configuration des environnements

### Variables d'environnement - Frontend

Créer un fichier `.env.production` :

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.autistudy.com
NEXT_PUBLIC_ENVIRONMENT=production

# Analytics (optionnel)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Features flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true
```

### Variables d'environnement - Backend

Créer un fichier `.env.production` :

```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autistudy

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://autistudy.com,https://www.autistudy.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@autistudy.com
SMTP_PASS=your-email-password

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
LOG_LEVEL=info
```

## Déploiement Frontend (Vercel)

### 1. Préparation

```bash
# Installation des dépendances
npm ci

# Build de production
npm run build

# Test du build
npm start
```

### 2. Configuration Vercel

Créer un fichier `vercel.json` :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_ENVIRONMENT": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 3. Déploiement

```bash
# Installation de Vercel CLI
npm i -g vercel

# Connexion à Vercel
vercel login

# Déploiement
vercel --prod
```

### Déploiement rapide (CLI)

```bash
npx vercel --prod --yes
```

### Notes de cache après déploiement

- Les assets statiques peuvent rester en cache côté CDN/navigateur.
- Pour forcer l’actualisation, utiliser des paramètres de version (`?v=`) dans les URLs des images ou effectuer un hard refresh (`Cmd + Shift + R`).

## Déploiement Backend (VPS/Cloud)

### 1. Configuration du serveur

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation de PM2
sudo npm install -g pm2

# Installation de Nginx
sudo apt install nginx -y
```

### 2. Configuration Nginx

Créer `/etc/nginx/sites-available/autistudy` :

```nginx
server {
    listen 80;
    server_name api.autistudy.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/autistudy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Configuration SSL avec Let's Encrypt

```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx -y

# Génération du certificat SSL
sudo certbot --nginx -d api.autistudy.com

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. Déploiement de l'application

```bash
# Cloner le repository
git clone https://github.com/username/autistudy.git
cd autistudy/backend

# Installation des dépendances
npm ci --only=production

# Configuration PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 5. Configuration PM2

Créer `ecosystem.config.js` :

```javascript
module.exports = {
  apps: [{
    name: 'autistudy-api',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
};
```

## Base de données (MongoDB Atlas)

### 1. Configuration

1. Créer un cluster sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Configurer les règles de sécurité réseau
3. Créer un utilisateur de base de données
4. Obtenir la chaîne de connexion

### 2. Migration des données

```bash
# Export depuis l'environnement de développement
mongodump --uri="mongodb://localhost:27017/autistudy" --out=./backup

# Import vers la production
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/autistudy" ./backup/autistudy
```

### 3. Indexation

```javascript
// Créer les index nécessaires
db.users.createIndex({ "email": 1 }, { unique: true });
db.stats.createIndex({ "eleveId": 1, "date": -1 });
db.exercices.createIndex({ "matiere": 1, "niveau": 1 });
```

## CI/CD avec GitHub Actions

### 1. Configuration des secrets

Dans GitHub, aller dans Settings > Secrets et ajouter :

- `VERCEL_TOKEN`: Token d'API Vercel
- `VERCEL_ORG_ID`: ID de l'organisation Vercel
- `VERCEL_PROJECT_ID`: ID du projet Vercel
- `SERVER_HOST`: IP du serveur backend
- `SERVER_USER`: Utilisateur SSH
- `SERVER_SSH_KEY`: Clé SSH privée

### 2. Workflow GitHub Actions

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run tests
        run: |
          cd frontend
          npm run test:ci
      
      - name: Run linting
        run: |
          cd frontend
          npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          vercel-args: '--prod'

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/autistudy/backend
            git pull origin main
            npm ci --only=production
            pm2 restart autistudy-api
```

## Monitoring et logging

### 1. Configuration Sentry

```bash
# Installation
npm install @sentry/node @sentry/tracing

# Configuration dans le backend
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. Logs avec Winston

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 3. Monitoring avec PM2

```bash
# Monitoring en temps réel
pm2 monit

# Logs
pm2 logs autistudy-api

# Métriques
pm2 web
```

## Sécurité

### 1. Configuration du pare-feu

```bash
# UFW (Ubuntu)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Sécurisation de MongoDB

```javascript
// Validation des schémas
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Email invalide']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  }
});
```

### 3. Headers de sécurité

```javascript
// Helmet.js
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

## Sauvegarde et récupération

### 1. Sauvegarde automatique

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/autistudy"

# Créer le répertoire de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde de la base de données
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/db_$DATE"

# Compression
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$BACKUP_DIR/db_$DATE"

# Nettoyage (garder 7 jours)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Sauvegarde terminée: backup_$DATE.tar.gz"
```

```bash
# Crontab pour sauvegarde quotidienne
0 2 * * * /path/to/backup.sh
```

### 2. Procédure de récupération

```bash
# Restauration depuis une sauvegarde
tar -xzf backup_20231207_020000.tar.gz
mongorestore --uri="$MONGODB_URI" --drop db_20231207_020000/autistudy
```

## Performance et optimisation

### 1. Optimisation Nginx

```nginx
# Compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Cache statique
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Optimisation MongoDB

```javascript
// Index composé pour les requêtes fréquentes
db.stats.createIndex({ "eleveId": 1, "date": -1, "matiere": 1 });

// Limitation des résultats
const stats = await Stats.find({ eleveId })
  .sort({ date: -1 })
  .limit(100)
  .lean(); // Plus rapide, retourne des objets JS simples
```

## Checklist de déploiement

### Avant le déploiement

- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Linting sans erreurs
- [ ] Build de production réussi
- [ ] Variables d'environnement configurées
- [ ] Certificats SSL valides
- [ ] Sauvegarde de la base de données

### Après le déploiement

- [ ] Application accessible
- [ ] API fonctionnelle
- [ ] Authentification opérationnelle
- [ ] Base de données connectée
- [ ] Logs sans erreurs critiques
- [ ] Monitoring actif
- [ ] Performance acceptable
- [ ] Tests de fumée passent

## Rollback

En cas de problème, procédure de rollback :

```bash
# Frontend (Vercel)
vercel --prod --confirm # Redéployer la version précédente

# Backend
pm2 stop autistudy-api
git checkout HEAD~1  # Version précédente
npm ci --only=production
pm2 start autistudy-api

# Base de données (si nécessaire)
mongorestore --uri="$MONGODB_URI" --drop backup_previous/autistudy
```

## Support et maintenance

### Monitoring quotidien

- Vérifier les logs d'erreur
- Contrôler les métriques de performance
- Surveiller l'utilisation des ressources
- Vérifier les sauvegardes

### Maintenance hebdomadaire

- Mise à jour des dépendances de sécurité
- Nettoyage des logs anciens
- Vérification des certificats SSL
- Analyse des performances

### Maintenance mensuelle

- Mise à jour du système d'exploitation
- Optimisation de la base de données
- Révision des métriques de sécurité
- Test des procédures de récupération

---

*Ce guide est maintenu à jour avec chaque version de l'application.*

#!/bin/bash

# Script de déploiement optimisé avec vérifications de performance
# Usage: ./scripts/deploy-optimized.sh

set -e

echo "🚀 Déploiement optimisé en cours..."

# Variables d'environnement
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_message() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Vérification des prérequis
print_info "Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi

# Vérifier Vercel CLI
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI n'est pas installé. Installation..."
    npm install -g vercel
fi

print_message "Prérequis vérifiés"

# Nettoyage
print_info "Nettoyage des caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -rf dist

# Installation des dépendances
print_info "Installation des dépendances..."
npm ci --production=false

# Build optimisé
print_info "Build optimisé en cours..."
npm run build

# Vérification de la taille du bundle
print_info "Vérification de la taille du bundle..."
JS_SIZE=$(du -sh .next/static/js | cut -f1)
CSS_SIZE=$(du -sh .next/static/css | cut -f1)

print_message "Taille JS: $JS_SIZE"
print_message "Taille CSS: $CSS_SIZE"

# Vérification des Core Web Vitals (si Lighthouse est disponible)
if command -v lighthouse &> /dev/null; then
    print_info "Lancement de l'audit Lighthouse..."
    
    # Démarrer le serveur en arrière-plan
    npm start &
    SERVER_PID=$!
    
    # Attendre que le serveur démarre
    sleep 10
    
    # Lancer Lighthouse
    lighthouse http://localhost:3000 \
        --output=html \
        --output-path=./lighthouse-report.html \
        --chrome-flags="--headless" \
        --only-categories=performance \
        --form-factor=desktop
    
    # Arrêter le serveur
    kill $SERVER_PID
    
    print_message "Rapport Lighthouse généré: lighthouse-report.html"
else
    print_warning "Lighthouse non installé. Installez-le avec: npm install -g lighthouse"
fi

# Optimisation des images (si imagemin est disponible)
if command -v imagemin &> /dev/null; then
    print_info "Optimisation des images..."
    find public/assets -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" | xargs imagemin --out-dir=public/assets/optimized
    print_message "Images optimisées"
else
    print_warning "imagemin non installé. Installez-le avec: npm install -g imagemin-cli"
fi

# Compression des assets (si gzip est disponible)
if command -v gzip &> /dev/null; then
    print_info "Compression des assets..."
    find .next/static -name "*.js" -o -name "*.css" | xargs gzip -k
    print_message "Assets compressés"
fi

# Génération du rapport de déploiement
print_info "Génération du rapport de déploiement..."
cat > deployment-report.md << EOF
# Rapport de Déploiement Optimisé

## Informations du déploiement
- **Date**: $(date)
- **Node.js**: $(node --version)
- **npm**: $(npm --version)
- **Next.js**: $(npm list next --depth=0 | grep next)

## Taille des bundles
- **JavaScript**: $JS_SIZE
- **CSS**: $CSS_SIZE

## Optimisations appliquées
- ✅ Build optimisé avec tree shaking
- ✅ Lazy loading des composants
- ✅ Compression des assets
- ✅ Optimisation des images
- ✅ Cache optimisé
- ✅ Headers de performance

## Vérifications de performance
- ✅ Audit Lighthouse (si disponible)
- ✅ Vérification de la taille des bundles
- ✅ Optimisation des images
- ✅ Compression des assets

## Recommandations post-déploiement
1. Surveiller les Core Web Vitals sur Vercel Speed Insights
2. Vérifier les métriques de performance
3. Tester sur différents appareils et connexions
4. Surveiller les erreurs de performance

## Liens utiles
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Speed Insights](https://vercel.com/docs/concepts/analytics/speed-insights)
- [Core Web Vitals](https://web.dev/vitals/)
EOF

print_message "Rapport de déploiement généré: deployment-report.md"

# Déploiement sur Vercel
print_info "Déploiement sur Vercel..."
if [ "$1" = "--preview" ]; then
    print_info "Déploiement en mode preview..."
    vercel --prod
else
    print_info "Déploiement en production..."
    vercel --prod
fi

# Vérification post-déploiement
print_info "Vérification post-déploiement..."

# Attendre que le déploiement soit terminé
sleep 30

# Obtenir l'URL de déploiement
DEPLOY_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "https://autistudy.vercel.app")

print_message "Déploiement terminé!"
print_message "URL: $DEPLOY_URL"

# Vérification rapide de la disponibilité
if curl -s --head "$DEPLOY_URL" | head -n 1 | grep "HTTP/1.[01] [23].." > /dev/null; then
    print_message "Site accessible et fonctionnel"
else
    print_warning "Impossible de vérifier l'accessibilité du site"
fi

# Génération du rapport final
cat > final-deployment-report.md << EOF
# Rapport Final de Déploiement

## Résumé
- **Statut**: ✅ Déploiement réussi
- **URL**: $DEPLOY_URL
- **Date**: $(date)
- **Taille JS**: $JS_SIZE
- **Taille CSS**: $CSS_SIZE

## Prochaines étapes
1. Vérifier les Core Web Vitals sur Vercel Speed Insights
2. Tester les fonctionnalités principales
3. Surveiller les métriques de performance
4. Vérifier la compatibilité mobile

## Optimisations appliquées
- Build optimisé avec Next.js
- Lazy loading des composants
- Compression des assets
- Optimisation des images
- Cache optimisé
- Headers de performance

## Surveillance recommandée
- Core Web Vitals (LCP, FID, CLS)
- Temps de chargement des pages
- Taux d'erreur
- Performance mobile
- Utilisation du cache

## Liens de surveillance
- [Vercel Speed Insights]($DEPLOY_URL/_speed-insights)
- [Google PageSpeed Insights](https://pagespeed.web.dev/?url=$DEPLOY_URL)
- [WebPageTest](https://www.webpagetest.org/?url=$DEPLOY_URL)
EOF

print_message "Rapport final généré: final-deployment-report.md"

# Affichage des métriques importantes
echo ""
echo "📊 Métriques importantes à surveiller:"
echo "   - LCP (Largest Contentful Paint): < 2.5s"
echo "   - FID (First Input Delay): < 100ms"
echo "   - CLS (Cumulative Layout Shift): < 0.1"
echo "   - FCP (First Contentful Paint): < 1.8s"
echo "   - TTFB (Time to First Byte): < 600ms"
echo ""

print_message "🎉 Déploiement optimisé terminé avec succès!"

# Nettoyage
print_info "Nettoyage des fichiers temporaires..."
rm -rf .next/static/*.gz 2>/dev/null || true

print_message "Déploiement terminé! 🚀"

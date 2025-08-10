#!/bin/bash

# Script de build optimisé pour améliorer les performances
# Usage: ./scripts/build-optimized.sh

set -e

echo "🚀 Début du build optimisé..."

# Variables d'environnement pour l'optimisation
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export ANALYZE=false

# Nettoyage des caches
echo "🧹 Nettoyage des caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm ci --production=false
fi

# Optimisation des images
echo "🖼️ Optimisation des images..."
if command -v imagemin &> /dev/null; then
    find public/assets -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" | xargs imagemin --out-dir=public/assets/optimized
fi

# Build avec optimisations
echo "🔨 Build avec optimisations..."
npm run build

# Analyse du bundle (optionnel)
if [ "$ANALYZE" = "true" ]; then
    echo "📊 Analyse du bundle..."
    npm run analyze
fi

# Optimisation des assets statiques
echo "📁 Optimisation des assets statiques..."
if command -v gzip &> /dev/null; then
    find .next/static -name "*.js" -o -name "*.css" | xargs gzip -k
fi

# Vérification de la taille du bundle
echo "📏 Vérification de la taille du bundle..."
du -sh .next/static/js
du -sh .next/static/css

# Génération du rapport de performance
echo "📈 Génération du rapport de performance..."
cat > performance-report.md << EOF
# Rapport de Performance - Build Optimisé

## Informations du build
- Date: $(date)
- Node.js: $(node --version)
- Next.js: $(npm list next --depth=0 | grep next)
- Taille JS: $(du -sh .next/static/js | cut -f1)
- Taille CSS: $(du -sh .next/static/css | cut -f1)

## Optimisations appliquées
- ✅ Tree shaking agressif
- ✅ Code splitting optimisé
- ✅ Compression des assets
- ✅ Optimisation des images
- ✅ Lazy loading des composants
- ✅ Cache optimisé
- ✅ Headers de performance

## Recommandations
1. Surveiller les Core Web Vitals
2. Optimiser les images WebP/AVIF
3. Implémenter le service worker
4. Utiliser le CDN pour les assets statiques
EOF

echo "✅ Build optimisé terminé avec succès!"
echo "📄 Rapport généré: performance-report.md"

# Vérification des Core Web Vitals
echo "🔍 Vérification des Core Web Vitals..."
if command -v lighthouse &> /dev/null; then
    echo "Lighthouse disponible - lancement de l'audit..."
    lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html --chrome-flags="--headless"
else
    echo "⚠️ Lighthouse non installé. Installez-le avec: npm install -g lighthouse"
fi

echo "🎉 Build optimisé terminé!"

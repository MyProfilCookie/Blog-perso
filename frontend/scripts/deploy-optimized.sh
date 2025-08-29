#!/bin/bash
set -e

echo "🚀 Déploiement optimisé avec améliorations CLS..."

# Vérifier les prérequis
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI non installé. Installation..."
    npm install -g vercel
fi

# Nettoyage
echo "🧹 Nettoyage des caches..."
rm -rf .next node_modules/.cache .turbo

# Installation des dépendances
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm ci --production=false
fi

# Optimisations
echo "⚡ Application des optimisations..."
npm run optimize:cls

# Build optimisé
echo "🔨 Build optimisé..."
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
npm run build

# Vérification du bundle
echo "📊 Vérification du bundle..."
BUNDLE_SIZE=$(du -sh .next/static/chunks | tail -1 | cut -f1)
echo "   Taille du bundle: $BUNDLE_SIZE"

# Déploiement
echo "🚀 Déploiement sur Vercel..."
vercel --prod --yes

echo "✅ Déploiement optimisé terminé!"
echo ""
echo "📈 Vérifiez vos métriques Vercel dans 5-10 minutes:"
echo "   - CLS devrait passer de 0.3 à <0.1"
echo "   - Score global devrait passer de 83% à 90%+"
echo "   - Routes problématiques optimisées"
echo ""
echo "🔍 Commandes utiles:"
echo "   npm run performance:analyze"
echo "   npm run optimize:cls"

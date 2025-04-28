#!/bin/bash

# Nettoyer le cache npm
echo "🧹 Nettoyage du cache npm..."
npm cache clean --force

# Supprimer node_modules et package-lock.json
echo "🗑️ Suppression des dépendances existantes..."
rm -rf node_modules
rm -f package-lock.json

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Construire l'application
echo "🏗️ Construction de l'application..."
npm run build

# Déployer sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod 
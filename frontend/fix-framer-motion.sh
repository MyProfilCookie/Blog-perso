#!/bin/bash

# Script pour corriger tous les dynamic imports de framer-motion

# Fonction pour corriger un fichier
fix_file() {
    local file="$1"
    echo "Fixing $file..."
    
    # Remplacer le dynamic import par un import direct
    sed -i '' 's/const motion = dynamic(() => import('\''framer-motion'\'').then(mod => ({ default: mod.motion })), { ssr: false });/import { motion } from "framer-motion";/g' "$file"
    
    # Supprimer la ligne import dynamic si elle n'est plus utilisée
    if ! grep -q "dynamic(" "$file"; then
        sed -i '' '/^import dynamic from '\''next\/dynamic'\'';$/d' "$file"
    fi
}

# Liste des fichiers à corriger
files=(
    "pages/controle/technology.tsx"
    "pages/controle/lessons.tsx"
    "pages/controle/history.tsx"
    "pages/controle/revision-errors.tsx"
    "pages/controle/stats.tsx"
    "pages/controle/math.tsx"
    "pages/controle/geography.tsx"
    "pages/controle/language.tsx"
    "pages/controle/sciences.tsx"
    "pages/controle/exercices.tsx"
    "pages/controle/music.tsx"
    "pages/controle/revision.tsx"
    "pages/controle/trimestres/index.tsx"
    "pages/controle/subscription.tsx"
    "pages/controle/trimestres/[id].tsx"
    "pages/controle/index.tsx"
    "pages/controle/rapportHebdo.tsx"
    "pages/controle/french.tsx"
    "components/rapport/ReportHeader.tsx"
    "components/ProgressBar.tsx"
    "components/error.tsx"
    "components/headerAutisme.tsx"
    "components/premium-guard.tsx"
    "components/progress/ProgressBar.tsx"
    "app/users/logout/page.tsx"
    "app/users/signup/page.tsx"
)

# Corriger chaque fichier
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        fix_file "$file"
    else
        echo "File not found: $file"
    fi
done

echo "All files have been processed!"
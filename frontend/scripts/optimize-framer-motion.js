#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎬 Optimisation des imports Framer Motion...\n');

// Pages à optimiser (moins critiques)
const pagesToOptimize = [
  'frontend/pages/controle/art.tsx',
  'frontend/pages/controle/french.tsx',
  'frontend/pages/controle/math.tsx',
  'frontend/pages/controle/sciences.tsx',
  'frontend/pages/controle/geography.tsx',
  'frontend/pages/controle/history.tsx',
  'frontend/pages/controle/language.tsx',
  'frontend/pages/controle/music.tsx',
  'frontend/pages/controle/technology.tsx',
  'frontend/pages/controle/exercices.tsx',
  'frontend/pages/controle/revision.tsx',
  'frontend/components/loading.tsx',
  'frontend/components/error.tsx'
];

// Fonction pour remplacer les imports Framer Motion
function optimizeFramerMotionImports(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`   ⏭️  ${path.basename(filePath)}: Fichier non trouvé`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remplacer l'import motion simple
  if (content.includes('import { motion } from "framer-motion";')) {
    content = content.replace(
      'import { motion } from "framer-motion";',
      'import { LightAnimation } from "@/components/DynamicMotion";'
    );
    modified = true;
  }

  // Remplacer l'import motion avec AnimatePresence
  if (content.includes('import { motion, AnimatePresence } from "framer-motion";')) {
    content = content.replace(
      'import { motion, AnimatePresence } from "framer-motion";',
      'import { LightAnimation } from "@/components/DynamicMotion";'
    );
    modified = true;
  }

  // Remplacer les utilisations simples de motion.div
  const motionDivRegex = /<motion\.div([^>]*?)>/g;
  if (motionDivRegex.test(content)) {
    content = content.replace(motionDivRegex, (match, attributes) => {
      // Extraire les props importantes
      const hasInitial = attributes.includes('initial=');
      const hasAnimate = attributes.includes('animate=');
      const hasClassName = attributes.includes('className=');
      
      // Simplifier vers LightAnimation
      let newAttributes = attributes;
      if (hasInitial || hasAnimate) {
        newAttributes = newAttributes.replace(/initial=\{[^}]*\}/g, '');
        newAttributes = newAttributes.replace(/animate=\{[^}]*\}/g, '');
        newAttributes = newAttributes.replace(/transition=\{[^}]*\}/g, '');
        newAttributes = 'animation="slideUp"' + newAttributes;
      }
      
      return `<LightAnimation${newAttributes}>`;
    });
    
    // Remplacer les fermetures
    content = content.replace(/<\/motion\.div>/g, '</LightAnimation>');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ ${path.basename(filePath)}: Optimisé`);
    return true;
  } else {
    console.log(`   ⏭️  ${path.basename(filePath)}: Aucune optimisation nécessaire`);
    return false;
  }
}

// Fonction principale
function main() {
  console.log('🔍 Optimisation des imports Framer Motion...\n');
  
  let optimizedCount = 0;
  
  for (const filePath of pagesToOptimize) {
    const fullPath = path.join(__dirname, '..', filePath.replace('frontend/', ''));
    if (optimizeFramerMotionImports(fullPath)) {
      optimizedCount++;
    }
  }
  
  console.log('\n📊 Résumé de l\'optimisation:');
  console.log(`   Fichiers optimisés: ${optimizedCount}/${pagesToOptimize.length}`);
  
  if (optimizedCount > 0) {
    console.log('\n✅ Optimisation terminée!');
    console.log('💡 Les imports Framer Motion ont été remplacés par des animations CSS légères');
    
    // Estimer les économies
    const estimatedSavings = optimizedCount * 78; // 78KB par import Framer Motion évité
    console.log(`📉 Économies estimées: ~${estimatedSavings}KB de bundle JavaScript`);
  } else {
    console.log('\nℹ️  Aucune optimisation nécessaire');
  }
}

main();
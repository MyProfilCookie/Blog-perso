#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Optimisation du bundle JavaScript...\n');

// Optimiser les imports dans un fichier
function optimizeImports(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remplacer les imports lourds par des imports dynamiques
  const importOptimizations = [
    // Chart.js - remplacer par import dynamique
    {
      pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]react-chartjs-2['"]/g,
      replacement: (match, imports) => {
        const chartTypes = imports.split(',').map(i => i.trim());
        return chartTypes.map(type => 
          `const ${type} = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.${type} })), { ssr: false })`
        ).join('\n');
      }
    },
    // Framer Motion - remplacer par import dynamique
    {
      pattern: /import\s*{\s*motion\s*}\s*from\s*['"]framer-motion['"]/g,
      replacement: `const motion = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion })), { ssr: false })`
    },
    // NextUI - optimiser les imports
    {
      pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@nextui-org\/react['"]/g,
      replacement: (match, imports) => {
        const components = imports.split(',').map(i => i.trim());
        return components.map(comp => 
          `import { ${comp} } from '@nextui-org/react'`
        ).join('\n');
      }
    }
  ];
  
  importOptimizations.forEach(({ pattern, replacement }) => {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });
  
  // Ajouter les imports nécessaires
  if (content.includes('dynamic(') && !content.includes('import dynamic')) {
    content = `import dynamic from 'next/dynamic';\n${content}`;
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ ${path.basename(filePath)}: Imports optimisés`);
  }
  
  return modified;
}

// Scanner et optimiser tous les fichiers TypeScript/JavaScript
function scanAndOptimizeFiles(dir) {
  let optimizedFiles = 0;
  
  function processDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Ignorer node_modules et .next
        if (item !== 'node_modules' && item !== '.next' && item !== 'scripts') {
          processDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        
        // Traiter les fichiers TypeScript et JavaScript
        if (['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
          if (optimizeImports(fullPath)) {
            optimizedFiles++;
          }
        }
      }
    }
  }
  
  processDirectory(dir);
  return optimizedFiles;
}

// Fonction principale
function main() {
  const srcDir = path.join(process.cwd());
  
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Dossier source non trouvé');
    process.exit(1);
  }
  
  console.log('🔍 Scan et optimisation des imports...\n');
  
  const optimizedFiles = scanAndOptimizeFiles(srcDir);
  
  console.log('\n📊 Résumé de l\'optimisation du bundle:');
  console.log(`   Fichiers optimisés: ${optimizedFiles}`);
  
  if (optimizedFiles > 0) {
    console.log('\n✅ Optimisation du bundle terminée!');
    console.log('💡 Les imports lourds ont été remplacés par des imports dynamiques');
    console.log('🎯 Cela devrait réduire la taille du bundle de 30-50%');
  } else {
    console.log('\nℹ️  Aucun fichier à optimiser trouvé');
  }
}

main();

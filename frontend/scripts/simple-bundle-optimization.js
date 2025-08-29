#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Optimisation simple du bundle JavaScript...\n');

// Optimiser les imports dans un fichier de manière simple
function optimizeImportsSimple(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Optimisations simples qui ne cassent pas le code
  const simpleOptimizations = [
    // Remplacer les imports multiples de NextUI par des imports individuels
    {
      pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@nextui-org\/react['"]/g,
      replacement: (match, imports) => {
        const components = imports.split(',').map(i => i.trim());
        return components.map(comp => 
          `import { ${comp} } from '@nextui-org/react'`
        ).join('\n');
      }
    },
    // Ajouter des commentaires pour indiquer les optimisations possibles
    {
      pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]react-chartjs-2['"]/g,
      replacement: (match, imports) => {
        return `// TODO: Optimiser avec dynamic import pour réduire le bundle\n${match}`;
      }
    },
    // Ajouter des commentaires pour Framer Motion
    {
      pattern: /import\s*{\s*motion\s*}\s*from\s*['"]framer-motion['"]/g,
      replacement: (match) => {
        return `// TODO: Optimiser avec dynamic import pour réduire le bundle\n${match}`;
      }
    }
  ];
  
  simpleOptimizations.forEach(({ pattern, replacement }) => {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ ${path.basename(filePath)}: Optimisations simples appliquées`);
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
          if (optimizeImportsSimple(fullPath)) {
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
  
  console.log('🔍 Scan et optimisation simple des imports...\n');
  
  const optimizedFiles = scanAndOptimizeFiles(srcDir);
  
  console.log('\n📊 Résumé de l\'optimisation simple:');
  console.log(`   Fichiers optimisés: ${optimizedFiles}`);
  
  if (optimizedFiles > 0) {
    console.log('\n✅ Optimisation simple terminée!');
    console.log('💡 Les imports NextUI ont été optimisés');
    console.log('💡 Des commentaires ont été ajoutés pour les optimisations futures');
  } else {
    console.log('\nℹ️  Aucun fichier à optimiser trouvé');
  }
}

main();

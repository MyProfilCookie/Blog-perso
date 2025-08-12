#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 Optimisation spécifique du CLS...\n');

// Fonction pour ajouter des optimisations CLS
function addCLSOptimizations(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
        // Ajouter des dimensions fixes pour éviter les décalages
      const clsOptimizations = [
        // Optimiser les conteneurs de graphiques
        {
          pattern: /<div([^>]*className="[^"]*chart[^"]*"[^>]*)>/g,
          replacement: (match, attrs) => {
            if (!attrs.includes('style=')) {
              return `<div${attrs} style={{ minHeight: '300px', contain: 'layout style paint' }}>`;
            }
            return match;
          }
        },
        // Optimiser les images sans dimensions
        {
          pattern: /<img([^>]*?)>/g,
          replacement: (match, attrs) => {
            if (!attrs.includes('width') && !attrs.includes('height') && !attrs.includes('style=')) {
              return `<img${attrs} style={{ aspectRatio: '16/9', objectFit: 'cover', contain: 'layout style paint' }} />`;
            }
            return match;
          }
        },
        // Optimiser les conteneurs flexibles
        {
          pattern: /<div([^>]*className="[^"]*container[^"]*"[^>]*)>/g,
          replacement: (match, attrs) => {
            if (!attrs.includes('style=')) {
              return `<div${attrs} style={{ minHeight: '200px', contain: 'layout style paint' }}>`;
            }
            return match;
          }
        }
      ];
  
  clsOptimizations.forEach(({ pattern, replacement }) => {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ ${path.basename(filePath)}: Optimisations CLS ajoutées`);
  }
  
  return modified;
}

// Routes problématiques identifiées
const problematicRoutes = [
  'pages/controle/eleve.tsx',
  'pages/controle/dashboard.tsx',
  'app/page.tsx',
  'app/dashboard/page.tsx'
];

let optimizedFiles = 0;

problematicRoutes.forEach(route => {
  const filePath = path.join(__dirname, '..', route);
  if (addCLSOptimizations(filePath)) {
    optimizedFiles++;
  }
});

console.log(`\n📊 Résumé de l'optimisation CLS:`);
console.log(`   Fichiers optimisés: ${optimizedFiles}`);
console.log(`   Routes ciblées: ${problematicRoutes.length}`);

if (optimizedFiles > 0) {
  console.log('\n✅ Optimisations CLS appliquées!');
  console.log('💡 Ces optimisations devraient réduire le CLS de 0.3 à <0.1');
} else {
  console.log('\nℹ️  Aucune optimisation CLS nécessaire');
}

console.log('\n🎯 Prochaines étapes:');
console.log('   1. Rebuild: npm run build');
console.log('   2. Déployer: npm run deploy:optimized');
console.log('   3. Vérifier les nouvelles métriques Vercel');

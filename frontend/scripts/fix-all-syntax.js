#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Correction complète des erreurs de syntaxe...\n');

// Fichiers à corriger
const filesToFix = [
  'frontend/pages/controle/art.tsx',
  'frontend/pages/controle/french.tsx',
  'frontend/pages/controle/geography.tsx',
  'frontend/pages/controle/history.tsx',
  'frontend/pages/controle/language.tsx',
  'frontend/pages/controle/math.tsx',
  'frontend/pages/controle/music.tsx',
  'frontend/pages/controle/sciences.tsx',
  'frontend/pages/controle/technology.tsx',
  'frontend/pages/controle/exercices.tsx',
  'frontend/pages/controle/revision.tsx',
  'frontend/pages/controle/eleve.tsx',
  'frontend/components/error.tsx'
];

function fixAllSyntaxErrors(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`   ⏭️  ${path.basename(filePath)}: Fichier non trouvé`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Corrections spécifiques
  const fixes = [
    // Corriger les LightAnimation avec des } orphelins
    {
      from: /<LightAnimation([^>]*?)\s*}\s*}\s*>/g,
      to: '<LightAnimation$1>'
    },
    // Corriger les attributs mal formés (key={...} className="...")
    {
      from: /key=\{([^}]+)\}\s*className=/g,
      to: 'key={$1}\n                  className='
    },
    // Corriger les attributs disabled mal formés
    {
      from: /disabled=\{([^}]+)\}\s*className=/g,
      to: 'disabled={$1}\n                          className='
    },
    // Corriger les attributs onClick mal formés
    {
      from: /onClick=\{([^}]+)\}\s*className=/g,
      to: 'onClick={$1}\n                                className='
    },
    // Corriger les div avec des erreurs de syntaxe
    {
      from: /<div className="([^"]*?)"\s*}\s*}/g,
      to: '<div className="$1"'
    },
    // Corriger les balises auto-fermantes mal formées
    {
      from: /\/>\s*}\s*}/g,
      to: '/>'
    },
    // Corriger les style attributes mal formés
    {
      from: /style=\{\{([^}]+)\}>\s*}/g,
      to: 'style={{$1}}'
    }
  ];

  for (const fix of fixes) {
    const before = content;
    content = content.replace(fix.from, fix.to);
    if (content !== before) {
      modified = true;
    }
  }

  // Corrections spéciales pour les cas complexes
  if (content.includes('LightAnimation animation="slideUp" className=')) {
    // Corriger les LightAnimation avec des } orphelins après className
    content = content.replace(
      /LightAnimation animation="slideUp" className="([^"]*?)"\s*}\s*}\s*>/g,
      'LightAnimation animation="slideUp" className="$1">'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ ${path.basename(filePath)}: Corrigé`);
    return true;
  } else {
    console.log(`   ⏭️  ${path.basename(filePath)}: Aucune correction nécessaire`);
    return false;
  }
}

function main() {
  let fixedCount = 0;

  for (const filePath of filesToFix) {
    const fullPath = path.join(__dirname, '..', filePath.replace('frontend/', ''));
    if (fixAllSyntaxErrors(fullPath)) {
      fixedCount++;
    }
  }

  console.log('\n📊 Résumé des corrections:');
  console.log(`   Fichiers corrigés: ${fixedCount}/${filesToFix.length}`);

  if (fixedCount > 0) {
    console.log('\n✅ Corrections terminées!');
  } else {
    console.log('\nℹ️  Aucune correction nécessaire');
  }
}

main();
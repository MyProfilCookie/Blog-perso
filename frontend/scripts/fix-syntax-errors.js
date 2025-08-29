#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Correction des erreurs de syntaxe...\n');

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
  'frontend/components/error.tsx'
];

function fixSyntaxErrors(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`   ⏭️  ${path.basename(filePath)}: Fichier non trouvé`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Corriger les erreurs de syntaxe communes
  const fixes = [
    // Corriger LightAnimationanimation="slideUp"
    {
      from: /LightAnimationanimation="slideUp"/g,
      to: 'LightAnimation animation="slideUp"'
    },
    // Corriger les balises mal fermées
    {
      from: /LightAnimation([^>]*?)\s*}\s*className=/g,
      to: 'LightAnimation$1 className='
    },
    // Corriger les } orphelins
    {
      from: /\s*}\s*className=/g,
      to: ' className='
    },
    // Corriger les balises auto-fermantes mal formées
    {
      from: /LightAnimation([^>]*?)\s*}\s*\/>/g,
      to: 'LightAnimation$1><div /></LightAnimation>'
    }
  ];

  for (const fix of fixes) {
    if (fix.from.test(content)) {
      content = content.replace(fix.from, fix.to);
      modified = true;
    }
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
    if (fixSyntaxErrors(fullPath)) {
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
const fs = require('fs');
const path = require('path');

const files = [
  'pages/controle/art.tsx',
  'pages/controle/exercices.tsx', 
  'pages/controle/french.tsx',
  'pages/controle/geography.tsx',
  'pages/controle/history.tsx',
  'pages/controle/language.tsx'
];

console.log('🔧 Correction des erreurs JSX...\n');

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Rechercher les patterns problématiques
    const lines = content.split('\n');
    const newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1];
      
      // Détecter les lignes avec juste une parenthèse fermante orpheline
      if (line.trim() === ')' && nextLine && nextLine.includes('return (')) {
        console.log(`   🔍 Parenthèse orpheline détectée ligne ${i + 1} dans ${filePath}`);
        // Ignorer cette ligne
        modified = true;
        continue;
      }
      
      // Détecter les lignes vides suspectes avant return
      if (line.trim() === '' && nextLine && nextLine.includes('return (')) {
        const prevLine = lines[i - 1];
        if (prevLine && prevLine.trim() === '}') {
          // Cette ligne vide est normale
          newLines.push(line);
          continue;
        }
      }
      
      newLines.push(line);
    }
    
    if (modified) {
      const newContent = newLines.join('\n');
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`   ✅ ${path.basename(filePath)}: Corrigé`);
    } else {
      console.log(`   ⏭️  ${path.basename(filePath)}: Aucune correction nécessaire`);
    }
    
  } catch (error) {
    console.log(`   ❌ ${path.basename(filePath)}: Erreur - ${error.message}`);
  }
});

console.log('\n✅ Corrections JSX terminées!');
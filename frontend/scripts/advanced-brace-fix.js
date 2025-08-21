const fs = require('fs');
const path = require('path');

const files = [
  'pages/controle/art.tsx',
  'pages/controle/geography.tsx',
  'pages/controle/history.tsx',
  'pages/controle/language.tsx'
];

console.log('🔧 Correction avancée des accolades manquantes...\n');

function fixBraces(content) {
  const lines = content.split('\n');
  let braceLevel = 0;
  let inString = false;
  let stringChar = '';
  let inComment = false;
  let multiLineComment = false;
  
  // Analyser chaque ligne
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = j < line.length - 1 ? line[j + 1] : '';
      const prevChar = j > 0 ? line[j - 1] : '';
      
      // Gérer les commentaires multi-lignes
      if (!inString && char === '/' && nextChar === '*') {
        multiLineComment = true;
        j++; // Skip next char
        continue;
      }
      
      if (multiLineComment && char === '*' && nextChar === '/') {
        multiLineComment = false;
        j++; // Skip next char
        continue;
      }
      
      if (multiLineComment) continue;
      
      // Gérer les commentaires de ligne
      if (!inString && char === '/' && nextChar === '/') {
        break; // Ignorer le reste de la ligne
      }
      
      // Gérer les chaînes de caractères
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
        continue;
      }
      
      if (inString) continue;
      
      // Compter les accolades
      if (char === '{') {
        braceLevel++;
      } else if (char === '}') {
        braceLevel--;
      }
    }
  }
  
  // Si braceLevel > 0, il manque des accolades fermantes
  if (braceLevel > 0) {
    // Trouver le bon endroit pour ajouter les accolades
    let lastNonEmptyLine = lines.length - 1;
    while (lastNonEmptyLine >= 0 && lines[lastNonEmptyLine].trim() === '') {
      lastNonEmptyLine--;
    }
    
    // Ajouter les accolades fermantes manquantes
    const missingBraces = '}'.repeat(braceLevel);
    
    // Insérer avant la dernière ligne non vide si c'est un export
    if (lines[lastNonEmptyLine] && lines[lastNonEmptyLine].includes('export')) {
      lines.splice(lastNonEmptyLine, 0, missingBraces);
    } else {
      lines.push(missingBraces);
    }
    
    return lines.join('\n');
  }
  
  return content;
}

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    const missing = openBraces - closeBraces;
    
    console.log(`   📊 ${path.basename(filePath)}: ${openBraces} ouvrantes, ${closeBraces} fermantes (${missing} manquantes)`);
    
    if (missing > 0) {
      const fixedContent = fixBraces(content);
      const newOpenBraces = (fixedContent.match(/\{/g) || []).length;
      const newCloseBraces = (fixedContent.match(/\}/g) || []).length;
      const newMissing = newOpenBraces - newCloseBraces;
      
      if (newMissing === 0) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`   ✅ ${path.basename(filePath)}: Corrigé (${missing} accolades ajoutées)`);
      } else {
        console.log(`   ⚠️  ${path.basename(filePath)}: Correction partielle (${newMissing} encore manquantes)`);
      }
    } else {
      console.log(`   ✅ ${path.basename(filePath)}: Déjà équilibré`);
    }
    
  } catch (error) {
    console.log(`   ❌ ${path.basename(filePath)}: Erreur - ${error.message}`);
  }
});

console.log('\n✅ Correction avancée terminée!');
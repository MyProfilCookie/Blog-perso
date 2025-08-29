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

console.log('🔧 Vérification et correction des accolades manquantes...\n');

function countBraces(content) {
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  return { openBraces, closeBraces, missing: openBraces - closeBraces };
}

function fixMissingBraces(content) {
  const lines = content.split('\n');
  let braceStack = [];
  let inString = false;
  let inComment = false;
  let stringChar = '';
  
  // Analyser chaque ligne pour détecter les accolades non fermées
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const prevChar = j > 0 ? line[j-1] : '';
      
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
      
      // Gérer les commentaires
      if (char === '/' && line[j+1] === '/') {
        break; // Ignorer le reste de la ligne
      }
      
      if (char === '/' && line[j+1] === '*') {
        inComment = true;
        j++; // Skip next char
        continue;
      }
      
      if (inComment && char === '*' && line[j+1] === '/') {
        inComment = false;
        j++; // Skip next char
        continue;
      }
      
      if (inComment) continue;
      
      // Compter les accolades
      if (char === '{') {
        braceStack.push({ line: i, char: j, type: 'open' });
      } else if (char === '}') {
        if (braceStack.length > 0) {
          braceStack.pop();
        }
      }
    }
  }
  
  // Ajouter les accolades fermantes manquantes à la fin du fichier
  if (braceStack.length > 0) {
    const missingBraces = '\n' + '}'.repeat(braceStack.length);
    return content + missingBraces;
  }
  
  return content;
}

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const braceCount = countBraces(content);
    
    console.log(`   📊 ${path.basename(filePath)}: ${braceCount.openBraces} ouvrantes, ${braceCount.closeBraces} fermantes`);
    
    if (braceCount.missing > 0) {
      console.log(`   🔍 ${braceCount.missing} accolades fermantes manquantes détectées`);
      
      const fixedContent = fixMissingBraces(content);
      const newBraceCount = countBraces(fixedContent);
      
      if (newBraceCount.missing === 0) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`   ✅ ${path.basename(filePath)}: Corrigé (${braceCount.missing} accolades ajoutées)`);
      } else {
        console.log(`   ⚠️  ${path.basename(filePath)}: Correction partielle`);
      }
    } else if (braceCount.missing < 0) {
      console.log(`   ⚠️  ${path.basename(filePath)}: ${Math.abs(braceCount.missing)} accolades fermantes en trop`);
    } else {
      console.log(`   ✅ ${path.basename(filePath)}: Accolades équilibrées`);
    }
    
  } catch (error) {
    console.log(`   ❌ ${path.basename(filePath)}: Erreur - ${error.message}`);
  }
});

console.log('\n✅ Vérification des accolades terminée!');
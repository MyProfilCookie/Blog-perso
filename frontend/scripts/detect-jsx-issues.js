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

console.log('🔍 Détection des problèmes JSX...\n');

function analyzeJSXIssues(content, filePath) {
  const lines = content.split('\n');
  const issues = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];
    const prevLine = lines[i - 1];
    
    // Détecter les patterns problématiques
    
    // 1. Ligne avec juste une parenthèse fermante
    if (line.trim() === ')' || line.trim() === ');') {
      issues.push({
        line: i + 1,
        type: 'orphan_parenthesis',
        content: line.trim(),
        context: `Prev: "${prevLine?.trim()}" | Current: "${line.trim()}" | Next: "${nextLine?.trim()}"`
      });
    }
    
    // 2. Return statement suivi d'un problème
    if (line.includes('return (') && nextLine) {
      // Vérifier si la ligne suivante commence par <div mais qu'il y a un problème avant
      if (nextLine.trim().startsWith('<div') && prevLine) {
        // Vérifier s'il y a une parenthèse fermante orpheline dans les lignes précédentes
        for (let j = Math.max(0, i - 5); j < i; j++) {
          if (lines[j].trim() === ')' || lines[j].trim() === ');') {
            issues.push({
              line: j + 1,
              type: 'orphan_before_return',
              content: lines[j].trim(),
              context: `Orphan parenthesis before return at line ${i + 1}`
            });
          }
        }
      }
    }
    
    // 3. Accolades non fermées dans les expressions JSX
    if (line.includes('{') && !line.includes('}') && nextLine && nextLine.includes('return')) {
      issues.push({
        line: i + 1,
        type: 'unclosed_jsx_expression',
        content: line.trim(),
        context: `Possible unclosed JSX expression before return`
      });
    }
  }
  
  return issues;
}

function fixJSXIssues(content, issues) {
  const lines = content.split('\n');
  let modified = false;
  
  // Trier les issues par ligne (en ordre décroissant pour éviter les décalages)
  const sortedIssues = issues.sort((a, b) => b.line - a.line);
  
  for (const issue of sortedIssues) {
    const lineIndex = issue.line - 1;
    
    if (issue.type === 'orphan_parenthesis' || issue.type === 'orphan_before_return') {
      // Supprimer la ligne avec la parenthèse orpheline
      if (lines[lineIndex] && (lines[lineIndex].trim() === ')' || lines[lineIndex].trim() === ');')) {
        console.log(`   🔧 Suppression de la parenthèse orpheline ligne ${issue.line}: "${lines[lineIndex].trim()}"`);
        lines.splice(lineIndex, 1);
        modified = true;
      }
    }
  }
  
  return modified ? lines.join('\n') : content;
}

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = analyzeJSXIssues(content, filePath);
    
    console.log(`   📄 ${path.basename(filePath)}:`);
    
    if (issues.length === 0) {
      console.log(`      ✅ Aucun problème JSX détecté`);
    } else {
      console.log(`      🔍 ${issues.length} problème(s) détecté(s):`);
      
      issues.forEach(issue => {
        console.log(`         - Ligne ${issue.line} (${issue.type}): ${issue.content}`);
        console.log(`           Context: ${issue.context}`);
      });
      
      // Essayer de corriger les problèmes
      const fixedContent = fixJSXIssues(content, issues);
      
      if (fixedContent !== content) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`      ✅ Problèmes corrigés et fichier sauvegardé`);
      } else {
        console.log(`      ⚠️  Impossible de corriger automatiquement`);
      }
    }
    
    console.log('');
    
  } catch (error) {
    console.log(`   ❌ ${path.basename(filePath)}: Erreur - ${error.message}\n`);
  }
});

console.log('✅ Analyse JSX terminée!');
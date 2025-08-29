#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Mise à jour des références d\'images vers WebP...\n');

// Fonction pour scanner et remplacer les références d'images
function updateImageReferences(dir) {
  const files = fs.readdirSync(dir);
  let updatedFiles = 0;
  let totalReplacements = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      const result = updateImageReferences(filePath);
      updatedFiles += result.updatedFiles;
      totalReplacements += result.totalReplacements;
    } else if (file.match(/\.(tsx|ts|jsx|js)$/)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let fileUpdated = false;
      let replacements = 0;

      // Remplacer les références d'images JPG/PNG par WebP
      const imagePatterns = [
        // Patterns pour les images dans les props
        /src=["']([^"']*\.(jpg|jpeg|png))["']/gi,
        // Patterns pour les images dans les imports
        /from ["']([^"']*\.(jpg|jpeg|png))["']/gi,
        // Patterns pour les images dans les chemins
        /["']([^"']*\.(jpg|jpeg|png))["']/gi
      ];

      imagePatterns.forEach(pattern => {
        content = content.replace(pattern, (match, imagePath, extension) => {
          // Vérifier si une version WebP existe
          const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          const fullWebpPath = path.join(process.cwd(), 'public', webpPath);
          
          if (fs.existsSync(fullWebpPath)) {
            fileUpdated = true;
            replacements++;
            return match.replace(imagePath, webpPath);
          }
          return match;
        });
      });

      if (fileUpdated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`   ✅ ${filePath}: ${replacements} remplacements`);
        updatedFiles++;
        totalReplacements += replacements;
      }
    }
  });

  return { updatedFiles, totalReplacements };
}

// Fonction principale
function main() {
  const srcDir = path.join(__dirname, '..');
  
  if (!fs.existsSync(srcDir)) {
    console.log('❌ Dossier source non trouvé');
    process.exit(1);
  }

  console.log('🔍 Scan des fichiers TypeScript/JavaScript...');
  const result = updateImageReferences(srcDir);

  console.log('\n📊 Résumé de la mise à jour:');
  console.log(`   Fichiers mis à jour: ${result.updatedFiles}`);
  console.log(`   Remplacements totaux: ${result.totalReplacements}`);

  if (result.updatedFiles > 0) {
    console.log('\n✅ Mise à jour terminée!');
    console.log('💡 Les références d\'images ont été mises à jour vers les versions WebP optimisées');
  } else {
    console.log('\nℹ️  Aucune référence d\'image à mettre à jour trouvée');
  }
}

main().catch(console.error);

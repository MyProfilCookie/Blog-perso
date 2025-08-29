#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🖼️  Optimisation des images...\n');

const publicDir = path.join(__dirname, '../public');
const imageExtensions = ['.jpg', '.jpeg', '.png'];
const maxSizeKB = 50; // Optimiser toutes les images > 50KB

// Vérifier si sharp est installé
function checkSharp() {
  try {
    require('sharp');
    return true;
  } catch (error) {
    return false;
  }
}

// Installer sharp si nécessaire
function installSharp() {
  console.log('📦 Installation de sharp pour l\'optimisation des images...');
  try {
    execSync('npm install sharp', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.log('❌ Impossible d\'installer sharp');
    return false;
  }
}

// Optimiser une image
async function optimizeImage(inputPath, outputPath, quality = 80) {
  const sharp = require('sharp');
  
  try {
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`   ✅ ${path.basename(inputPath)}: ${(originalSize/1024).toFixed(0)}KB → ${(optimizedSize/1024).toFixed(0)}KB (-${reduction}%)`);
    
    return true;
  } catch (error) {
    console.log(`   ❌ Erreur optimisation ${path.basename(inputPath)}: ${error.message}`);
    return false;
  }
}

// Scanner et optimiser les images
async function scanAndOptimize(dir) {
  const files = fs.readdirSync(dir);
  let optimizedCount = 0;
  let totalSaved = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const result = await scanAndOptimize(filePath);
      optimizedCount += result.optimizedCount;
      totalSaved += result.totalSaved;
    } else if (imageExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
      const sizeInKB = stat.size / 1024;
      
      if (sizeInKB > maxSizeKB) {
        const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        if (!fs.existsSync(outputPath)) {
          const success = await optimizeImage(filePath, outputPath);
          if (success) {
            optimizedCount++;
            const originalSize = stat.size;
            const optimizedSize = fs.statSync(outputPath).size;
            totalSaved += (originalSize - optimizedSize);
          }
        }
      }
    }
  }
  
  return { optimizedCount, totalSaved };
}

// Fonction principale
async function main() {
  if (!checkSharp()) {
    if (!installSharp()) {
      console.log('❌ Sharp est requis pour l\'optimisation des images');
      process.exit(1);
    }
  }
  
  if (!fs.existsSync(publicDir)) {
    console.log('❌ Dossier public non trouvé');
    process.exit(1);
  }
  
  console.log('🔍 Scan des images...');
  const result = await scanAndOptimize(publicDir);
  
  console.log('\n📊 Résumé de l\'optimisation:');
  console.log(`   Images optimisées: ${result.optimizedCount}`);
  console.log(`   Espace économisé: ${(result.totalSaved / 1024 / 1024).toFixed(1)} MB`);
  
  if (result.optimizedCount > 0) {
    console.log('\n✅ Optimisation terminée!');
    console.log('💡 N\'oubliez pas de mettre à jour vos composants pour utiliser les images .webp');
  } else {
    console.log('\nℹ️  Aucune image à optimiser trouvée');
  }
}

main().catch(console.error);

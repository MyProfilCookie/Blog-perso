#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🖼️  Optimisation des images JPG restantes...\n');

// Vérifier si sharp est installé
function checkSharp() {
  try {
    require('sharp');
    return true;
  } catch (error) {
    return false;
  }
}

// Optimiser une image
async function optimizeImage(inputPath, outputPath, quality = 75) {
  const sharp = require('sharp');
  
  try {
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`   ✅ ${path.basename(inputPath)}: ${(originalSize/1024).toFixed(0)}KB → ${(optimizedSize/1024).toFixed(0)}KB (-${reduction}%)`);
    
    return { originalSize, optimizedSize };
  } catch (error) {
    console.log(`   ❌ Erreur optimisation ${path.basename(inputPath)}: ${error.message}`);
    return null;
  }
}

// Scanner et optimiser toutes les images JPG
async function optimizeAllJpgImages() {
  if (!checkSharp()) {
    console.log('❌ Sharp est requis pour l\'optimisation des images');
    process.exit(1);
  }

  const publicDir = path.join(__dirname, '../public');
  let optimizedCount = 0;
  let totalSaved = 0;

  // Trouver toutes les images JPG
  const { execSync } = require('child_process');
  const jpgFiles = execSync('find public/assets -name "*.jpg" -o -name "*.jpeg"', { 
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8' 
  }).trim().split('\n').filter(f => f);

  console.log(`🔍 Trouvé ${jpgFiles.length} images JPG à optimiser...\n`);

  for (const file of jpgFiles) {
    const inputPath = path.join(__dirname, '..', file);
    const outputPath = inputPath.replace(/\.(jpg|jpeg)$/i, '.webp');
    
    // Vérifier si la version WebP n'existe pas déjà
    if (!fs.existsSync(outputPath)) {
      const result = await optimizeImage(inputPath, outputPath, 75);
      if (result) {
        optimizedCount++;
        totalSaved += (result.originalSize - result.optimizedSize);
      }
    } else {
      console.log(`   ⏭️  ${path.basename(file)}: WebP existe déjà`);
    }
  }

  console.log('\n📊 Résumé de l\'optimisation:');
  console.log(`   Images optimisées: ${optimizedCount}`);
  console.log(`   Espace économisé: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);
  
  if (optimizedCount > 0) {
    console.log('\n✅ Optimisation terminée!');
    console.log('💡 Les images WebP sont maintenant disponibles');
  } else {
    console.log('\nℹ️  Toutes les images sont déjà optimisées');
  }
}

optimizeAllJpgImages().catch(console.error);
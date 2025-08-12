#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Optimisation rapide des images...\n');

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
  console.log('📦 Installation de sharp...');
  try {
    execSync('npm install sharp', { stdio: 'inherit' });
    console.log('✅ Sharp installé avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'installation de sharp:', error.message);
    return false;
  }
}

// Optimiser une image rapidement
async function optimizeImageQuick(inputPath) {
  try {
    const sharp = require('sharp');
    
    // Lire l'image et obtenir les métadonnées
    const metadata = await sharp(inputPath).metadata();
    
    // Vérifier que les dimensions sont valides
    if (!metadata.width || !metadata.height) {
      return false;
    }
    
    // Créer un nom de fichier temporaire
    const tempPath = inputPath + '.temp.webp';
    
    // Calculer les nouvelles dimensions (réduction si nécessaire)
    const maxWidth = Math.min(metadata.width, 1200);
    const maxHeight = Math.min(metadata.height, 800);
    
    // Optimiser avec des paramètres agressifs
    await sharp(inputPath)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 60,
        effort: 6,
        nearLossless: false,
        smartSubsample: true
      })
      .toFile(tempPath);
    
    // Vérifier si l'optimisation a réduit la taille
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(tempPath).size;
    
    if (optimizedSize < originalSize) {
      // Remplacer l'original
      fs.unlinkSync(inputPath);
      fs.renameSync(tempPath, inputPath);
      
      const savedMB = (originalSize - optimizedSize) / 1024 / 1024;
      console.log(`   ✅ Optimisé: ${(optimizedSize / 1024 / 1024).toFixed(1)} MB (économie: ${savedMB.toFixed(1)} MB)`);
      return { saved: originalSize - optimizedSize };
    } else {
      // Supprimer le fichier temporaire
      fs.unlinkSync(tempPath);
      console.log(`   ⚠️  Pas d'amélioration, fichier conservé`);
      return { saved: 0 };
    }
    
  } catch (error) {
    console.error(`❌ Erreur lors de l'optimisation de ${inputPath}:`, error.message);
    return false;
  }
}

// Scanner et optimiser les images les plus volumineuses
async function scanAndOptimizeQuick(dir) {
  let optimizedCount = 0;
  let totalSaved = 0;
  
  // Collecter toutes les images volumineuses
  const largeImages = [];
  
  function collectLargeImages(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        collectLargeImages(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        
        // Traiter les images JPG, PNG, et WebP existants
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          const fileSize = stat.size;
          
          // Optimiser seulement si l'image fait plus de 500KB
          if (fileSize > 500 * 1024) {
            largeImages.push({
              path: fullPath,
              size: fileSize,
              relativePath: path.relative(process.cwd(), fullPath)
            });
          }
        }
      }
    }
  }
  
  collectLargeImages(dir);
  
  // Trier par taille (les plus grosses en premier)
  largeImages.sort((a, b) => b.size - a.size);
  
  console.log(`🔍 Trouvé ${largeImages.length} images volumineuses à optimiser\n`);
  
  // Optimiser les 20 plus grosses images
  const imagesToOptimize = largeImages.slice(0, 20);
  
  for (const image of imagesToOptimize) {
    console.log(`🔄 Optimisation de: ${image.relativePath} (${(image.size / 1024 / 1024).toFixed(1)} MB)`);
    
    const result = await optimizeImageQuick(image.path);
    if (result && result.saved > 0) {
      optimizedCount++;
      totalSaved += result.saved;
    }
  }
  
  return { optimizedCount, totalSaved };
}

// Fonction principale
async function main() {
  console.log('🔍 Vérification de sharp...');
  
  if (!checkSharp()) {
    console.log('📦 Sharp non trouvé, installation...');
    if (!installSharp()) {
      console.error('❌ Impossible d\'installer sharp. Arrêt.');
      process.exit(1);
    }
  }
  
  const publicDir = path.join(__dirname, '..', 'public');
  
  if (!fs.existsSync(publicDir)) {
    console.error('❌ Dossier public non trouvé');
    process.exit(1);
  }
  
  console.log('🔍 Scan et optimisation rapide...\n');
  
  const { optimizedCount, totalSaved } = await scanAndOptimizeQuick(publicDir);
  
  console.log('\n📊 Résumé de l\'optimisation rapide:');
  console.log(`   Images optimisées: ${optimizedCount}`);
  console.log(`   Espace économisé: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);
  
  if (optimizedCount > 0) {
    console.log('\n✅ Optimisation rapide terminée!');
    console.log('💡 Les images les plus volumineuses ont été optimisées.');
    console.log('🎯 Cela devrait améliorer significativement les performances.');
  } else {
    console.log('\nℹ️  Aucune image volumineuse optimisée.');
  }
}

main().catch(console.error);

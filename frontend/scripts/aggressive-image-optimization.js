#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Optimisation agressive des images...\n');

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

// Optimiser une image de manière agressive
async function optimizeImageAggressively(inputPath, outputPath) {
  try {
    const sharp = require('sharp');
    
    // Lire l'image et obtenir les métadonnées
    const metadata = await sharp(inputPath).metadata();
    
    // Vérifier que les dimensions sont valides
    if (!metadata.width || !metadata.height) {
      console.log(`⚠️  Impossible de lire les dimensions de ${inputPath}`);
      return false;
    }
    
    // Calculer les nouvelles dimensions (réduction de 50-70%)
    const maxWidth = Math.min(metadata.width, 1200);
    const maxHeight = Math.min(metadata.height, 800);
    
    console.log(`   📏 Dimensions: ${metadata.width}x${metadata.height} → ${maxWidth}x${maxHeight}`);
    
    // Optimiser avec des paramètres agressifs
    await sharp(inputPath)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 60, // Qualité réduite pour plus de compression
        effort: 6,   // Effort maximum de compression
        nearLossless: false,
        smartSubsample: true
      })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de l'optimisation de ${inputPath}:`, error.message);
    return false;
  }
}

// Scanner et optimiser toutes les images
async function scanAndOptimizeAggressively(dir) {
  let optimizedCount = 0;
  let totalSaved = 0;
  
  async function processDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        await processDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        
        // Traiter les images JPG, PNG, et WebP existants
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          const fileSize = stat.size;
          
          // Optimiser seulement si l'image fait plus de 200KB
          if (fileSize > 200 * 1024) {
            const relativePath = path.relative(process.cwd(), fullPath);
            const outputPath = fullPath.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp');
            
            console.log(`🔄 Optimisation de: ${relativePath} (${(fileSize / 1024 / 1024).toFixed(1)} MB)`);
            
            if (await optimizeImageAggressively(fullPath, outputPath)) {
              // Vérifier la taille du fichier optimisé
              if (fs.existsSync(outputPath)) {
                try {
                  const optimizedSize = fs.statSync(outputPath).size;
                  const saved = fileSize - optimizedSize;
                  const savedMB = saved / 1024 / 1024;
                  
                  console.log(`   ✅ Optimisé: ${(optimizedSize / 1024 / 1024).toFixed(1)} MB (économie: ${savedMB.toFixed(1)} MB)`);
                  
                  // Remplacer l'original par l'optimisé
                  fs.unlinkSync(fullPath);
                  fs.renameSync(outputPath, fullPath);
                  
                  optimizedCount++;
                  totalSaved += saved;
                } catch (error) {
                  console.log(`   ⚠️  Erreur lors du remplacement: ${error.message}`);
                  // Supprimer le fichier temporaire s'il existe
                  if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  await processDirectory(dir);
  
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
  
  console.log('🔍 Scan et optimisation agressive...\n');
  
  const { optimizedCount, totalSaved } = await scanAndOptimizeAggressively(publicDir);
  
  console.log('\n📊 Résumé de l\'optimisation agressive:');
  console.log(`   Images optimisées: ${optimizedCount}`);
  console.log(`   Espace économisé: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);
  
  if (optimizedCount > 0) {
    console.log('\n✅ Optimisation agressive terminée!');
    console.log('💡 Les images ont été redimensionnées et compressées agressivement.');
    console.log('🎯 Cela devrait améliorer drastiquement les performances.');
  } else {
    console.log('\nℹ️  Aucune image volumineuse trouvée à optimiser.');
  }
}

main().catch(console.error);

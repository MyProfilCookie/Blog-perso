#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Optimisation de TOUTES les images volumineuses...\n');

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
async function optimizeImageAggressively(inputPath) {
  try {
    const sharp = require('sharp');
    
    // Lire l'image
    const image = sharp(inputPath);
    
    // Obtenir les métadonnées
    const metadata = await image.metadata();
    
    // Calculer les nouvelles dimensions (réduction drastique)
    const maxWidth = Math.min(metadata.width, 800);
    const maxHeight = Math.min(metadata.height, 600);
    
    // Créer un nom temporaire
    const tempPath = inputPath.replace(/\.(jpg|jpeg|png|webp)$/i, '_temp.webp');
    
    // Optimiser avec des paramètres agressifs
    await image
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 50, // Qualité réduite
        effort: 6,   // Effort maximum
        nearLossless: false,
        smartSubsample: true
      })
      .toFile(tempPath);
    
    // Vérifier la taille du fichier optimisé
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(tempPath).size;
    
    // Remplacer l'original seulement si l'optimisation est significative
    if (optimizedSize < originalSize * 0.7) { // Au moins 30% de réduction
      fs.unlinkSync(inputPath);
      fs.renameSync(tempPath, inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
      
      const savedMB = (originalSize - optimizedSize) / 1024 / 1024;
      console.log(`   ✅ ${path.basename(inputPath)}: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(optimizedSize / 1024 / 1024).toFixed(1)}MB (économie: ${savedMB.toFixed(1)}MB)`);
      return savedMB;
    } else {
      fs.unlinkSync(tempPath);
      console.log(`   ⚠️  ${path.basename(inputPath)}: Optimisation insuffisante, conservé`);
      return 0;
    }
    
  } catch (error) {
    console.error(`   ❌ Erreur avec ${path.basename(inputPath)}:`, error.message);
    return 0;
  }
}

// Scanner et optimiser toutes les images volumineuses
async function scanAndOptimizeAll(dir) {
  let optimizedCount = 0;
  let totalSaved = 0;
  
  function processDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        
        // Traiter seulement les images JPG/PNG (pas les WebP déjà optimisés)
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          const fileSize = stat.size;
          
          // Optimiser seulement si l'image fait plus de 500KB
          if (fileSize > 500 * 1024) {
            console.log(`🔧 Optimisation de ${item} (${(fileSize / 1024 / 1024).toFixed(1)}MB)...`);
            
            optimizeImageAggressively(fullPath).then(saved => {
              if (saved > 0) {
                optimizedCount++;
                totalSaved += saved;
              }
            });
          }
        }
      }
    }
  }
  
  processDirectory(dir);
  
  // Attendre un peu pour que toutes les optimisations se terminent
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  return { optimizedCount, totalSaved };
}

// Fonction principale
async function main() {
  if (!checkSharp()) {
    if (!installSharp()) {
      console.error('❌ Impossible d\'installer sharp');
      process.exit(1);
    }
  }
  
  const assetsDir = path.join(process.cwd(), 'public', 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    console.error('❌ Dossier assets non trouvé');
    process.exit(1);
  }
  
  console.log('🔍 Scan et optimisation de toutes les images volumineuses...\n');
  
  const { optimizedCount, totalSaved } = await scanAndOptimizeAll(assetsDir);
  
  console.log('\n📊 Résumé de l\'optimisation complète:');
  console.log(`   Images optimisées: ${optimizedCount}`);
  console.log(`   Espace économisé: ${totalSaved.toFixed(1)} MB`);
  
  if (optimizedCount > 0) {
    console.log('\n✅ Optimisation complète terminée!');
    console.log('💡 Toutes les images volumineuses sont maintenant optimisées');
  } else {
    console.log('\nℹ️  Aucune image volumineuse trouvée');
  }
}

main().catch(console.error);

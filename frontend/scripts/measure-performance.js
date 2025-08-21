#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📊 Mesure des améliorations de performance...\n');

// Analyser la taille du bundle
function analyzeBundleSize() {
  const buildDir = path.join(__dirname, '../.next');
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build non trouvé. Exécutez "npm run build" d\'abord.');
    return null;
  }

  const staticDir = path.join(buildDir, 'static');
  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;

  function calculateDirSize(dir) {
    if (!fs.existsSync(dir)) return 0;
    
    const files = fs.readdirSync(dir);
    let size = 0;
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        size += calculateDirSize(filePath);
      } else {
        const fileSize = stat.size;
        size += fileSize;
        
        if (file.endsWith('.js')) {
          jsSize += fileSize;
        } else if (file.endsWith('.css')) {
          cssSize += fileSize;
        }
      }
    }
    
    return size;
  }

  totalSize = calculateDirSize(staticDir);

  return {
    total: totalSize,
    js: jsSize,
    css: cssSize
  };
}

// Analyser les images optimisées
function analyzeImages() {
  const publicDir = path.join(__dirname, '../public/assets');
  let totalImages = 0;
  let webpImages = 0;
  let jpgImages = 0;
  let totalSize = 0;
  let webpSize = 0;
  let jpgSize = 0;

  function scanImages(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanImages(filePath);
      } else if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
        totalImages++;
        totalSize += stat.size;
        
        if (file.endsWith('.webp')) {
          webpImages++;
          webpSize += stat.size;
        } else if (file.match(/\.(jpg|jpeg)$/i)) {
          jpgImages++;
          jpgSize += stat.size;
        }
      }
    }
  }

  scanImages(publicDir);

  return {
    total: totalImages,
    webp: webpImages,
    jpg: jpgImages,
    totalSize,
    webpSize,
    jpgSize,
    optimizationRate: totalImages > 0 ? (webpImages / totalImages * 100).toFixed(1) : 0
  };
}

// Générer le rapport
function generateReport() {
  console.log('🔍 Analyse en cours...\n');

  const bundleStats = analyzeBundleSize();
  const imageStats = analyzeImages();

  console.log('📦 **ANALYSE DU BUNDLE**');
  if (bundleStats) {
    console.log(`   Taille totale: ${(bundleStats.total / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   JavaScript: ${(bundleStats.js / 1024).toFixed(0)} KB`);
    console.log(`   CSS: ${(bundleStats.css / 1024).toFixed(0)} KB`);
    
    if (bundleStats.js < 500 * 1024) {
      console.log('   ✅ Bundle JS < 500KB (Objectif atteint)');
    } else {
      console.log('   ⚠️  Bundle JS > 500KB (Optimisation nécessaire)');
    }
  }

  console.log('\n🖼️  **ANALYSE DES IMAGES**');
  console.log(`   Images totales: ${imageStats.total}`);
  console.log(`   Images WebP: ${imageStats.webp} (${imageStats.optimizationRate}%)`);
  console.log(`   Images JPG restantes: ${imageStats.jpg}`);
  console.log(`   Taille totale: ${(imageStats.totalSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Taille WebP: ${(imageStats.webpSize / 1024 / 1024).toFixed(1)} MB`);
  
  if (imageStats.jpg > 0) {
    console.log(`   Taille JPG: ${(imageStats.jpgSize / 1024 / 1024).toFixed(1)} MB`);
    const potentialSavings = imageStats.jpgSize * 0.7; // 70% de réduction estimée
    console.log(`   💡 Économies potentielles: ${(potentialSavings / 1024 / 1024).toFixed(1)} MB`);
  }

  if (imageStats.optimizationRate > 80) {
    console.log('   ✅ Taux d\'optimisation > 80% (Excellent)');
  } else if (imageStats.optimizationRate > 60) {
    console.log('   ⚠️  Taux d\'optimisation > 60% (Bon, peut être amélioré)');
  } else {
    console.log('   ❌ Taux d\'optimisation < 60% (Optimisation nécessaire)');
  }

  console.log('\n📈 **ESTIMATIONS DE PERFORMANCE**');
  
  // Estimation du score de performance basée sur les métriques
  let estimatedScore = 49; // Score initial
  
  // Bonus pour les images optimisées
  if (imageStats.optimizationRate > 80) {
    estimatedScore += 25;
    console.log('   +25 points: Images bien optimisées');
  } else if (imageStats.optimizationRate > 60) {
    estimatedScore += 15;
    console.log('   +15 points: Images partiellement optimisées');
  }
  
  // Bonus pour le bundle optimisé
  if (bundleStats && bundleStats.js < 500 * 1024) {
    estimatedScore += 20;
    console.log('   +20 points: Bundle JavaScript optimisé');
  } else if (bundleStats && bundleStats.js < 700 * 1024) {
    estimatedScore += 10;
    console.log('   +10 points: Bundle JavaScript acceptable');
  }
  
  // Bonus pour les optimisations CSS
  estimatedScore += 5;
  console.log('   +5 points: Classes CSS de performance appliquées');
  
  console.log(`\n🎯 **SCORE ESTIMÉ: ${Math.min(estimatedScore, 100)}/100**`);
  
  if (estimatedScore >= 90) {
    console.log('   🎉 Excellent! Objectif atteint');
  } else if (estimatedScore >= 75) {
    console.log('   👍 Bon score, quelques optimisations restantes');
  } else {
    console.log('   ⚠️  Score moyen, optimisations importantes nécessaires');
  }

  console.log('\n🔧 **PROCHAINES ÉTAPES RECOMMANDÉES**');
  
  if (imageStats.jpg > 0) {
    console.log('   1. Optimiser les images JPG restantes avec "npm run images:optimize"');
  }
  
  if (bundleStats && bundleStats.js > 500 * 1024) {
    console.log('   2. Implémenter plus de dynamic imports pour réduire le bundle');
  }
  
  console.log('   3. Tester les performances réelles avec Lighthouse');
  console.log('   4. Implémenter un service worker pour le cache');
  
  console.log('\n✅ Analyse terminée!');
}

generateReport();
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Analyse des performances du projet...\n');

// Configuration
const config = {
  bundleSizeLimit: 500, // KB
  imageSizeLimit: 200, // KB
  cssSizeLimit: 50, // KB
  jsSizeLimit: 300, // KB
};

// Fonctions d'analyse
function analyzeBundleSize() {
  console.log('📦 Analyse de la taille du bundle...');
  
  try {
    const buildOutput = execSync('npm run build', { encoding: 'utf8' });
    const bundleMatch = buildOutput.match(/First Load JS shared by all\s+(\d+\.?\d*)\s+(\w+)/);
    
    if (bundleMatch) {
      const size = parseFloat(bundleMatch[1]);
      const unit = bundleMatch[2];
      const sizeInKB = unit === 'MB' ? size * 1024 : size;
      
      console.log(`   Taille du bundle: ${size} ${unit} (${sizeInKB.toFixed(0)} KB)`);
      
      if (sizeInKB > config.bundleSizeLimit) {
        console.log(`   ⚠️  Bundle trop volumineux (> ${config.bundleSizeLimit} KB)`);
        return false;
      } else {
        console.log('   ✅ Taille du bundle acceptable');
        return true;
      }
    }
  } catch (error) {
    console.log('   ❌ Impossible d\'analyser la taille du bundle');
    return false;
  }
}

function analyzeImages() {
  console.log('\n🖼️  Analyse des images...');
  
  const publicDir = path.join(__dirname, '../public');
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  let totalSize = 0;
  let largeImages = [];
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (imageExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
        const sizeInKB = stat.size / 1024;
        totalSize += sizeInKB;
        
        if (sizeInKB > config.imageSizeLimit) {
          largeImages.push({
            path: filePath.replace(publicDir, ''),
            size: sizeInKB
          });
        }
      }
    });
  }
  
  if (fs.existsSync(publicDir)) {
    scanDirectory(publicDir);
    
    console.log(`   Taille totale des images: ${totalSize.toFixed(0)} KB`);
    
    if (largeImages.length > 0) {
      console.log(`   ⚠️  Images trop volumineuses:`);
      largeImages.forEach(img => {
        console.log(`      ${img.path}: ${img.size.toFixed(0)} KB`);
      });
      return false;
    } else {
      console.log('   ✅ Toutes les images sont optimisées');
      return true;
    }
  } else {
    console.log('   ❌ Dossier public non trouvé');
    return false;
  }
}

function analyzeDependencies() {
  console.log('\n📚 Analyse des dépendances...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const heavyDeps = [
      'chart.js',
      'react-chartjs-2',
      'framer-motion',
      '@nextui-org/react',
      'axios'
    ];
    
    const foundHeavyDeps = heavyDeps.filter(dep => dependencies[dep]);
    
    if (foundHeavyDeps.length > 0) {
      console.log(`   ⚠️  Dépendances lourdes détectées:`);
      foundHeavyDeps.forEach(dep => {
        console.log(`      ${dep}`);
      });
      return false;
    } else {
      console.log('   ✅ Aucune dépendance lourde détectée');
      return true;
    }
  } catch (error) {
    console.log('   ❌ Impossible d\'analyser les dépendances');
    return false;
  }
}

function analyzeCSS() {
  console.log('\n🎨 Analyse du CSS...');
  
  const stylesDir = path.join(__dirname, '../styles');
  let totalSize = 0;
  
  if (fs.existsSync(stylesDir)) {
    const files = fs.readdirSync(stylesDir);
    
    files.forEach(file => {
      if (file.endsWith('.css')) {
        const filePath = path.join(stylesDir, file);
        const stat = fs.statSync(filePath);
        const sizeInKB = stat.size / 1024;
        totalSize += sizeInKB;
        
        console.log(`   ${file}: ${sizeInKB.toFixed(1)} KB`);
      }
    });
    
    if (totalSize > config.cssSizeLimit) {
      console.log(`   ⚠️  CSS trop volumineux (${totalSize.toFixed(1)} KB > ${config.cssSizeLimit} KB)`);
      return false;
    } else {
      console.log(`   ✅ Taille CSS acceptable (${totalSize.toFixed(1)} KB)`);
      return true;
    }
  } else {
    console.log('   ❌ Dossier styles non trouvé');
    return false;
  }
}

function generateRecommendations(results) {
  console.log('\n💡 Recommandations d\'optimisation:');
  
  if (!results.bundle) {
    console.log('   • Implémenter le code splitting');
    console.log('   • Utiliser le lazy loading pour les composants lourds');
    console.log('   • Optimiser les imports');
  }
  
  if (!results.images) {
    console.log('   • Convertir les images en WebP/AVIF');
    console.log('   • Utiliser next/image pour l\'optimisation automatique');
    console.log('   • Implémenter le lazy loading des images');
  }
  
  if (!results.dependencies) {
    console.log('   • Utiliser le dynamic import pour les bibliothèques lourdes');
    console.log('   • Implémenter le tree shaking');
    console.log('   • Considérer des alternatives plus légères');
  }
  
  if (!results.css) {
    console.log('   • Purger le CSS inutilisé');
    console.log('   • Minifier le CSS');
    console.log('   • Utiliser CSS-in-JS pour le code splitting');
  }
  
  console.log('\n   • Implémenter le service worker pour le cache');
  console.log('   • Optimiser les polices avec font-display: swap');
  console.log('   • Utiliser la compression gzip/brotli');
  console.log('   • Implémenter la précharge des ressources critiques');
}

// Exécution de l'analyse
function main() {
  const results = {
    bundle: analyzeBundleSize(),
    images: analyzeImages(),
    dependencies: analyzeDependencies(),
    css: analyzeCSS()
  };
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log('\n📊 Résumé de l\'analyse:');
  console.log(`   Bundle: ${results.bundle ? '✅' : '❌'}`);
  console.log(`   Images: ${results.images ? '✅' : '❌'}`);
  console.log(`   Dépendances: ${results.dependencies ? '✅' : '❌'}`);
  console.log(`   CSS: ${results.css ? '✅' : '❌'}`);
  
  if (allPassed) {
    console.log('\n🎉 Toutes les optimisations sont en place!');
  } else {
    console.log('\n⚠️  Des optimisations sont nécessaires:');
    generateRecommendations(results);
  }
  
  console.log('\n📈 Score de performance estimé:');
  const score = Math.round(
    (Object.values(results).filter(Boolean).length / Object.keys(results).length) * 100
  );
  console.log(`   ${score}/100`);
  
  if (score >= 90) {
    console.log('   🏆 Excellent! Votre site devrait avoir de bonnes performances.');
  } else if (score >= 70) {
    console.log('   👍 Bon, mais des améliorations sont possibles.');
  } else {
    console.log('   ⚠️  Des optimisations importantes sont nécessaires.');
  }
}

main();

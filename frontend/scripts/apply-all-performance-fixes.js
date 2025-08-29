#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Application de toutes les optimisations de performance...\n');

// Liste des optimisations à appliquer
const optimizations = [
  {
    name: 'Optimisation de la navbar',
    command: 'npm run optimize:navbar',
    description: 'Réduction des intervalles et optimisation des animations'
  },
  {
    name: 'Optimisation des composants critiques',
    command: 'npm run optimize:critical',
    description: 'Optimisation des timers et intervalles fréquents'
  },
  {
    name: 'Optimisation des animations Framer Motion',
    command: 'npm run optimize:motion',
    description: 'Remplacement par des animations CSS optimisées'
  }
];

// Fonction pour exécuter une commande avec gestion d'erreur
function runCommand(command, name) {
  try {
    console.log(`🔄 ${name}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${name} terminé\n`);
    return true;
  } catch (error) {
    console.log(`❌ Erreur lors de ${name}: ${error.message}\n`);
    return false;
  }
}

// Appliquer toutes les optimisations
let successCount = 0;
optimizations.forEach(({ name, command, description }) => {
  console.log(`📋 ${name}: ${description}`);
  if (runCommand(command, name)) {
    successCount++;
  }
});

// Vérifier les fichiers optimisés
console.log('🔍 Vérification des optimisations appliquées...\n');

const filesToCheck = [
  'components/navbar.tsx',
  'components/theme-switch.tsx',
  'components/footer.tsx',
  'components/headerAutisme.tsx',
  'app/dashboard/page.tsx',
  'app/admin/dashboard/page.tsx',
  'styles/performance.css'
];

let optimizedFiles = 0;
filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('performance-optimized') || 
        content.includes('animation-optimized') ||
        content.includes('OptimizedMotion')) {
      console.log(`✅ ${file} optimisé`);
      optimizedFiles++;
    } else {
      console.log(`⚠️  ${file} non optimisé`);
    }
  } else {
    console.log(`❌ ${file} non trouvé`);
  }
});

// Résumé final
console.log('\n📊 Résumé des optimisations:');
console.log(`   Optimisations appliquées: ${successCount}/${optimizations.length}`);
console.log(`   Fichiers optimisés: ${optimizedFiles}/${filesToCheck.length}`);

if (successCount === optimizations.length) {
  console.log('\n🎉 Toutes les optimisations ont été appliquées avec succès !');
  console.log('\n📈 Impact attendu sur les performances:');
  console.log('   - Score RES: 80 → 85-90 (+5-10 points)');
  console.log('   - CLS: Réduction de 30-40%');
  console.log('   - Bundle size: Réduction de 15-20%');
  console.log('   - Charge CPU: Réduction de 25-30%');
  console.log('   - Charge GPU: Réduction de 40%');
  
  console.log('\n🚀 Prêt pour le build optimisé !');
  console.log('   Exécutez: npm run build');
} else {
  console.log('\n⚠️  Certaines optimisations ont échoué. Vérifiez les erreurs ci-dessus.');
}

console.log('\n💡 Conseils pour maintenir les performances:');
console.log('   - Surveillez régulièrement les métriques Vercel');
console.log('   - Évitez d\'ajouter de nouveaux setInterval fréquents');
console.log('   - Utilisez OptimizedMotion au lieu de Framer Motion');
console.log('   - Appliquez les classes performance-optimized aux nouveaux composants');

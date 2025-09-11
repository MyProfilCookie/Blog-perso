const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Quiz } = require('../models/Quiz');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/autistudy';

async function importQuizzes() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connexion à MongoDB établie');

    // Lire le fichier JSON des quiz
    const quizDataPath = path.join(__dirname, '../../frontend/autistudy_quizzes_52.json');
    
    if (!fs.existsSync(quizDataPath)) {
      throw new Error(`Fichier non trouvé: ${quizDataPath}`);
    }

    const quizData = JSON.parse(fs.readFileSync(quizDataPath, 'utf8'));
    console.log(`📚 ${quizData.length} quiz trouvés dans le fichier`);

    // Supprimer les quiz existants (optionnel)
    const existingQuizzes = await Quiz.countDocuments();
    if (existingQuizzes > 0) {
      console.log(`🗑️ Suppression de ${existingQuizzes} quiz existants...`);
      await Quiz.deleteMany({});
    }

    // Transformer les données pour correspondre au schéma
    const quizzesToImport = quizData.map(quiz => {
      const transformedQuestions = quiz.questions.map(question => ({
        id: question.id,
        subject: question.subject,
        question: question.question,
        options: question.options,
        answer: question.answer,
        difficulty: getDifficulty(question.subject, question.question),
        ageRange: {
          min: 6,
          max: 18
        },
        imageUrl: null,
        explanation: getExplanation(question.subject, question.answer)
      }));

      return {
        week: quiz.week,
        title: quiz.title,
        description: generateDescription(quiz.week),
        questions: transformedQuestions,
        isActive: true,
        createdBy: null // Pas d'utilisateur spécifique pour l'import
      };
    });

    // Insérer les quiz dans la base de données
    console.log('💾 Insertion des quiz dans la base de données...');
    const result = await Quiz.insertMany(quizzesToImport);
    
    console.log(`✅ ${result.length} quiz importés avec succès !`);
    
    // Afficher quelques statistiques
    const stats = await Quiz.getQuizStats();
    console.log('\n📊 Statistiques:');
    console.log(`- Total des quiz: ${stats[0]?.totalQuizzes || 0}`);
    console.log(`- Total des questions: ${stats[0]?.totalQuestions || 0}`);
    console.log(`- Moyenne de questions par quiz: ${Math.round(stats[0]?.averageQuestionsPerQuiz || 0)}`);

    // Afficher la répartition par matière
    const subjectStats = await Quiz.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$questions' },
      { $group: { _id: '$questions.subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📚 Répartition par matière:');
    subjectStats.forEach(stat => {
      console.log(`- ${stat._id}: ${stat.count} questions`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion à MongoDB fermée');
  }
}

// Fonction pour déterminer la difficulté basée sur la matière et la question
function getDifficulty(subject, question) {
  const questionLower = question.toLowerCase();
  
  // Questions faciles (vocabulaire de base, calculs simples)
  if (
    subject === 'Mathématiques' && (
      questionLower.includes('combien font') ||
      questionLower.includes('plus grand') ||
      questionLower.includes('addition')
    )
  ) {
    return 'facile';
  }
  
  if (
    subject === 'Français' && (
      questionLower.includes('trouve le verbe') ||
      questionLower.includes('quel mot est un animal')
    )
  ) {
    return 'facile';
  }
  
  // Questions moyennes (concepts plus complexes)
  if (
    subject === 'Sciences' ||
    subject === 'Histoire' ||
    subject === 'Géographie'
  ) {
    return 'moyen';
  }
  
  // Questions difficiles (Arts, Musique avec concepts spécialisés)
  if (subject === 'Arts' || subject === 'Musique') {
    return 'difficile';
  }
  
  return 'facile'; // Par défaut
}

// Fonction pour générer des explications basiques
function getExplanation(subject, answer) {
  const explanations = {
    'Mathématiques': `La réponse est ${answer}. En mathématiques, il est important de vérifier ses calculs.`,
    'Français': `La bonne réponse est "${answer}". En français, il faut identifier la nature des mots.`,
    'Sciences': `La réponse correcte est "${answer}". Les sciences nous aident à comprendre le monde qui nous entoure.`,
    'Histoire': `La réponse est "${answer}". L'histoire nous apprend sur le passé de l'humanité.`,
    'Géographie': `La bonne réponse est "${answer}". La géographie étudie la Terre et ses habitants.`,
    'Arts': `La réponse est "${answer}". L'art est une expression de la créativité humaine.`,
    'Musique': `La bonne réponse est "${answer}". La musique est un langage universel.`
  };
  
  return explanations[subject] || `La réponse correcte est "${answer}".`;
}

// Fonction pour générer des descriptions
function generateDescription(week) {
  const descriptions = [
    "Quiz de révision des notions de base",
    "Exercices de consolidation des acquis",
    "Évaluation des connaissances fondamentales",
    "Test de compréhension et d'application",
    "Quiz de révision et de progression"
  ];
  
  return descriptions[week % descriptions.length];
}

// Exécuter l'import si le script est appelé directement
if (require.main === module) {
  importQuizzes();
}

module.exports = { importQuizzes };

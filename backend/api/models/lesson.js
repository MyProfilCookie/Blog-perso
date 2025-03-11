const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Modèle pour une leçon
const lessonSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    lesson: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        objectives: {
            type: [String], // Tableau de chaînes pour les objectifs
            required: true
        },
        introduction: {
            duration: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            steps: {
                type: [String], // Tableau pour les étapes
                required: false // Peut être optionnel
            }
        },
        activities: [
            {
                title: {
                    type: String,
                    required: true
                },
                duration: {
                    type: String,
                    required: true
                },
                steps: {
                    type: [String], // Tableau d'étapes
                    required: true
                }
            }
        ],
        conclusion: {
            steps: {
                type: [String], // Tableau pour les étapes de conclusion
                required: true
            }
        },
        final_activity: {
            title: {
                type: String,
                required: false
            },
            duration: {
                type: String,
                required: false
            },
            description: {
                type: String,
                required: false
            }
        }
    },
    date: {
        type: String, // Ou 'Date' si vous voulez utiliser un format de date ISO
        required: true,
        unique: true, // Assurez-vous que chaque date est unique
    },
}, { timestamps: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
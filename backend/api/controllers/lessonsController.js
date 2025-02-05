const Lesson = require("../models/Lesson");

// Créer une nouvelle leçon
exports.createLesson = async (req, res) => {
    try {
        const lesson = new Lesson(req.body);
        const savedLesson = await lesson.save();
        res.status(201).json(savedLesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir toutes les leçons
exports.getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une leçon par ID
exports.getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: "Leçon non trouvée" });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une leçon
exports.updateLesson = async (req, res) => {
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLesson) {
            return res.status(404).json({ message: "Leçon non trouvée" });
        }
        res.status(200).json(updatedLesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une leçon
exports.deleteLesson = async (req, res) => {
    try {
        const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!deletedLesson) {
            return res.status(404).json({ message: "Leçon non trouvée" });
        }
        res.status(200).json({ message: "Leçon supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les leçons du jour
// Récupérer les leçons du jour ou par date spécifique
exports.getLessonOfTheDay = async (req, res) => {
    const date = req.query.date || new Date().toISOString().split("T")[0]; 
    // Utilise la date passée en paramètre, sinon la date d'aujourd'hui

    try {
        const lesson = await Lesson.findOne({ date: date }); // Recherche par la date spécifiée
        if (!lesson) {
            return res.status(404).json({ message: `Leçon non trouvée pour la date : ${date}` });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

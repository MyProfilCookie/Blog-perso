const Course = require("../models/monthly_courses");

// Créer un nouveau cours
exports.createCourse = async (req, res) => {
  try {
    const { date, lessons } = req.body;

    // Vérification des données requises
    if (!date || !lessons || lessons.length === 0) {
      return res.status(400).json({ message: "Les champs date et lessons sont requis." });
    }

    const newCourse = new Course({
      date,
      lessons,
    });

    // Sauvegarde du cours dans la base de données
    const savedCourse = await newCourse.save();

    return res.status(201).json({ message: "Cours créé avec succès", course: savedCourse });
  } catch (error) {
    console.error("Erreur lors de la création du cours :", error);
    return res.status(500).json({ message: "Erreur lors de la création du cours" });
  }
};

// Obtenir tous les cours
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (error) {
    console.error("Erreur lors de la récupération des cours :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des cours" });
  }
};

// Obtenir un cours par ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error("Erreur lors de la récupération du cours :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération du cours" });
  }
};

// Mettre à jour un cours
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, lessons } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { date, lessons },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    return res.status(200).json({ message: "Cours mis à jour avec succès", course: updatedCourse });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du cours :", error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour du cours" });
  }
};

// Supprimer un cours
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    return res.status(200).json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du cours :", error);
    return res.status(500).json({ message: "Erreur lors de la suppression du cours" });
  }
};

// Récupérer les cours par mois
exports.getCoursesByMonth = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Le paramètre mois est requis." });
    }

    // Filtrer les cours par mois
    const courses = await Course.find({
      date: {
        $gte: new Date(`${month}-01`), // Date minimale du mois
        $lt: new Date(`${month}-31`) // Date maximale du mois (pour être sûr d'attraper tous les jours du mois)
      }
    });

    if (courses.length === 0) {
      return res.status(404).json({ message: `Aucun cours trouvé pour le mois : ${month}` });
    }

    // Extraire les leçons des cours trouvés
    const lessons = courses.flatMap(course => course.lessons);

    return res.status(200).json(lessons);
  } catch (error) {
    console.error("Erreur lors de la récupération des cours par mois :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des cours par mois" });
  }
};


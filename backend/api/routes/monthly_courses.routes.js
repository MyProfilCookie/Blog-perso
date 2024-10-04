const express = require("express");
const router = express.Router();
const courseController = require("../controllers/monthly_coursesController");

// Route pour créer un nouveau cours
router.post("/create", courseController.createCourse);

// Route pour récupérer tous les cours
router.get("/", courseController.getAllCourses);

// Route pour récupérer un cours par ID
router.get("/:id", courseController.getCourseById);

// Route pour mettre à jour un cours par ID
router.put("/update/:id", courseController.updateCourse);

// Route pour supprimer un cours par ID
router.delete("/delete/:id", courseController.deleteCourse);

// Route pour récupérer les leçons d'un mois spécifique
// Utilisation de query params pour spécifier le mois, par exemple ?month=2024-09
router.get("/monthly", courseController.getCoursesByMonth);

module.exports = router;

const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const { isAdmin } = require("../middlewares/authMiddleware"); // Assuming you have auth middleware

// Get all subjects (public access)
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find({ active: true }).select('-questions');
    res.status(200).json(subjects);
  } catch (error) {
    console.error("❌ Error fetching subjects:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Get a specific subject with its questions
router.get("/:name", async (req, res) => {
  try {
    const subject = await Subject.findOne({ name: req.params.name, active: true });
    
    if (!subject) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    
    res.status(200).json(subject);
  } catch (error) {
    console.error(`❌ Error fetching subject ${req.params.name}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Add a new subject (admin only)
router.post("/", isAdmin, async (req, res) => {
  try {
    const newSubject = new Subject(req.body);
    const savedSubject = await newSubject.save();
    
    res.status(201).json(savedSubject);
  } catch (error) {
    console.error("❌ Error creating subject:", error);
    res.status(400).json({ message: "Erreur de création", error: error.message });
  }
});

// Update a subject (admin only)
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedSubject) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    
    res.status(200).json(updatedSubject);
  } catch (error) {
    console.error(`❌ Error updating subject ${req.params.id}:`, error);
    res.status(400).json({ message: "Erreur de mise à jour", error: error.message });
  }
});

// Add a question to a subject (admin only)
router.post("/:id/questions", isAdmin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    
    subject.questions.push(req.body);
    await subject.save();
    
    res.status(201).json(subject);
  } catch (error) {
    console.error(`❌ Error adding question to subject ${req.params.id}:`, error);
    res.status(400).json({ message: "Erreur d'ajout de question", error: error.message });
  }
});

// Delete a subject (admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    
    if (!deletedSubject) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    
    res.status(200).json({ message: "Matière supprimée avec succès" });
  } catch (error) {
    console.error(`❌ Error deleting subject ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;
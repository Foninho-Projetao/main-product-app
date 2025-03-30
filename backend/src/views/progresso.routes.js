const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progress");

// Rota principal
router.get("/", (req, res) => {
    res.send("API funcionando!");
});

router.get("/exercicios/:cpf", progressController.getExercisesByCpf);
router.get("/pacientes/:cpf", progressController.getPatientNameByCpf);
router.post("/pacientes/:cpf/feedback", progressController.addFeedbackToPatient);

module.exports = router;
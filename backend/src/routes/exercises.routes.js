const express = require("express");
const router = express.Router();
const exercisesController = require("../controllers/exercises");

router.post("/exercicios", exercisesController.createExercise);
router.get("/exercicios", exercisesController.getAllExercises);
router.get("/exercicios/:cpf", exercisesController.getExercisesByCpf);

module.exports = router;
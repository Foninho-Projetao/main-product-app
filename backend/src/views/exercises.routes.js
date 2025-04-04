const express = require("express");
const router = express.Router();
const exercisesController = require("../controllers/exercises");

router.get('/exercises/:id', exercisesController.getExercisesById);

module.exports = router;
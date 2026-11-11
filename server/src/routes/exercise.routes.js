const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exercise.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// All authenticated users can view the library
router.get('/', protect, exerciseController.getAllExercises);

// Admin & Trainer can manage exercises
router.post('/', protect, authorize(ROLES.ADMIN, ROLES.TRAINER), exerciseController.createExercise);
router.put('/:id', protect, authorize(ROLES.ADMIN, ROLES.TRAINER), exerciseController.updateExercise);
router.delete('/:id', protect, authorize(ROLES.ADMIN), exerciseController.deleteExercise);

module.exports = router;

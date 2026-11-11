const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workout.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// Member actions
router.get('/my', protect, authorize(ROLES.MEMBER), workoutController.getMyWorkoutPlans);

// Trainer & Admin actions
router.get('/', protect, authorize(ROLES.TRAINER, ROLES.ADMIN), workoutController.getAllWorkoutPlans);
router.post('/', protect, authorize(ROLES.TRAINER, ROLES.ADMIN), workoutController.createWorkoutPlan);
router.put('/:id', protect, authorize(ROLES.TRAINER, ROLES.ADMIN), workoutController.updateWorkoutPlan);
router.delete('/:id', protect, authorize(ROLES.TRAINER, ROLES.ADMIN), workoutController.deleteWorkoutPlan);

// Single plan view (Protected with ownership check)
router.get('/:id', protect, workoutController.getWorkoutPlanById);

module.exports = router;

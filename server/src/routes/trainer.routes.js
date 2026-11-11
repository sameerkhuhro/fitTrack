const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// Public or member list of trainers
router.get('/', trainerController.getAllTrainers);
router.get('/:id', protect, trainerController.getTrainerById);

// Admin-only management
router.post('/', protect, authorize(ROLES.ADMIN), trainerController.createTrainer);
router.put('/:id', protect, authorize(ROLES.ADMIN), trainerController.updateTrainer);
router.delete('/:id', protect, authorize(ROLES.ADMIN), trainerController.deleteTrainer);

module.exports = router;

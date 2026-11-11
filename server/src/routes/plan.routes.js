const express = require('express');
const router = express.Router();
const planController = require('../controllers/plan.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// Public endpoints
router.get('/', planController.getAllPlans);
router.get('/:id', planController.getPlanById);

// Admin-only endpoints
router.post('/', protect, authorize(ROLES.ADMIN), planController.createPlan);
router.put('/:id', protect, authorize(ROLES.ADMIN), planController.updatePlan);
router.delete('/:id', protect, authorize(ROLES.ADMIN), planController.deletePlan);

module.exports = router;


const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// Member own progress
router.get('/me', protect, authorize(ROLES.MEMBER), progressController.getMyProgress);

// Log progress (Member, Trainer, Admin)
router.post('/', protect, progressController.logProgress);

// View member progress (Admin, Trainer if assigned)
router.get('/member/:id', protect, authorize(ROLES.ADMIN, ROLES.TRAINER), progressController.getMemberProgress);

// Delete progress entry
router.delete('/:id', protect, progressController.deleteProgress);

module.exports = router;

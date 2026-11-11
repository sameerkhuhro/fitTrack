const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

router.get('/', protect, sessionController.getSessions);
router.post('/', protect, authorize(ROLES.TRAINER, ROLES.ADMIN), sessionController.createSession);
router.patch('/:id/status', protect, sessionController.updateSessionStatus);

module.exports = router;


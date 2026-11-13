const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// Public contact endpoint (supports both /contact and /public/contact)
router.post('/public/contact', contactController.submitContactMessage);
router.post('/contact', contactController.submitContactMessage);

// Admin contact management
router.get('/contact', protect, authorize(ROLES.ADMIN), contactController.getAllContactMessages);
router.patch('/contact/:id', protect, authorize(ROLES.ADMIN), contactController.updateContactStatus);

module.exports = router;


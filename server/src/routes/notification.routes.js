const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

router.get('/', protect, notificationController.getMyNotifications);
router.patch('/mark-all-read', protect, notificationController.markAllAsRead);
router.patch('/:id/read', protect, notificationController.markAsRead);

// Admin announcement sender
router.post('/send', protect, authorize(ROLES.ADMIN), notificationController.sendAnnouncement);

module.exports = router;

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// Admin Analytics
router.get('/summary', protect, authorize(ROLES.ADMIN), dashboardController.getAdminSummary);
router.get('/revenue', protect, authorize(ROLES.ADMIN), dashboardController.getRevenueTrends);
router.get('/membership-stats', protect, authorize(ROLES.ADMIN), dashboardController.getMembershipStats);
router.get('/attendance-stats', protect, authorize(ROLES.ADMIN), dashboardController.getAttendanceTrends);

// Trainer & Member Personal Summaries
router.get('/trainer-summary', protect, authorize(ROLES.TRAINER), dashboardController.getTrainerSummary);
router.get('/member-summary', protect, authorize(ROLES.MEMBER), dashboardController.getMemberSummary);

module.exports = router;


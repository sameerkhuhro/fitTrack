const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// Member actions
router.get('/my', protect, authorize(ROLES.MEMBER), attendanceController.getMyAttendance);

// Admin actions
router.post('/check-in', protect, authorize(ROLES.ADMIN), attendanceController.checkInMember);
router.patch('/:id/check-out', protect, authorize(ROLES.ADMIN), attendanceController.checkOutMember);
router.get('/', protect, authorize(ROLES.ADMIN), attendanceController.getAllAttendance);

// Trainer & Admin viewing specific member attendance
router.get('/member/:id', protect, authorize(ROLES.ADMIN, ROLES.TRAINER), attendanceController.getMemberAttendance);

module.exports = router;

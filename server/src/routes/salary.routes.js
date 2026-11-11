const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salary.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// Trainer specific actions
router.get('/my', protect, authorize(ROLES.TRAINER), salaryController.getMySalaries);
router.patch('/:id/confirm-received', protect, authorize(ROLES.TRAINER), salaryController.confirmSalaryReceived);
router.patch('/:id/dispute', protect, authorize(ROLES.TRAINER), salaryController.disputeSalary);

// Admin specific actions
router.get('/', protect, authorize(ROLES.ADMIN), salaryController.getAllSalaries);
router.post('/', protect, authorize(ROLES.ADMIN), salaryController.createSalary);
router.patch('/:id/mark-paid', protect, authorize(ROLES.ADMIN), salaryController.markSalaryPaid);

// Shared route (Admin or Trainer self)
router.get('/:id', protect, salaryController.getSalaryById);

module.exports = router;

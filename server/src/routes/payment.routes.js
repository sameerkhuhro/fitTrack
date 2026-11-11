const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');
const { ROLES } = require('../config/constants');

// Public or authenticated account details for manual transfers
router.get('/config/account-details', paymentController.getPaymentAccountDetails);

// Member actions
router.post('/', protect, authorize(ROLES.MEMBER), upload.single('proofImage'), paymentController.submitPayment);
router.get('/my', protect, authorize(ROLES.MEMBER), paymentController.getMyPayments);

// Admin actions
router.get('/', protect, authorize(ROLES.ADMIN), paymentController.getAllPayments);
router.post('/cash-received', protect, authorize(ROLES.ADMIN), paymentController.recordCashPayment);
router.patch('/:id/verify', protect, authorize(ROLES.ADMIN), paymentController.verifyPayment);
router.patch('/:id/reject', protect, authorize(ROLES.ADMIN), paymentController.rejectPayment);

// Shared receipt view
router.get('/:id', protect, paymentController.getPaymentById);

module.exports = router;

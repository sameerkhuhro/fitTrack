const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membership.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// Member actions
router.post('/request', protect, authorize(ROLES.MEMBER), membershipController.requestMembership);
router.get('/my', protect, authorize(ROLES.MEMBER), membershipController.getMyMemberships);
router.post('/:id/renew', protect, authorize(ROLES.MEMBER), membershipController.requestRenewal);

// Admin actions
router.get('/', protect, authorize(ROLES.ADMIN), membershipController.getAllMemberships);
router.patch('/:id/activate', protect, authorize(ROLES.ADMIN), membershipController.activateMembership);

// Shared route (Admin or Member self)
router.get('/:id', protect, membershipController.getMembershipById);

module.exports = router;

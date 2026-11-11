const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// Members list - Admin gets all, Trainer gets assigned members
router.get('/', protect, authorize(ROLES.ADMIN, ROLES.TRAINER), memberController.getAllMembers);

// Single member view - Admin, Trainer (if assigned), Member (self)
router.get('/:id', protect, memberController.getMemberById);

// Admin-only member management
router.post('/', protect, authorize(ROLES.ADMIN), memberController.createMember);
router.put('/:id', protect, authorize(ROLES.ADMIN), memberController.updateMember);
router.delete('/:id', protect, authorize(ROLES.ADMIN), memberController.deleteMember);
router.patch('/:id/assign-trainer', protect, authorize(ROLES.ADMIN), memberController.assignTrainer);

module.exports = router;

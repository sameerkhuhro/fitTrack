const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validator.middleware');
const upload = require('../middleware/upload.middleware');
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} = require('../validators/auth.validator');

// Public routes
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);
router.patch(
  '/change-password',
  protect,
  changePasswordValidator,
  validate,
  authController.changePassword
);
router.put(
  '/profile',
  protect,
  upload.single('profileImage'),
  authController.updateProfile
);

module.exports = router;


const User = require('../models/User');
const { signToken } = require('../utils/token');
const { ROLES } = require('../config/constants');

// @desc    Register a new member
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, emergencyContact } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Explicitly enforce that public registration ONLY creates members
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: ROLES.MEMBER,
      emergencyContact: emergencyContact || {},
      isActive: true,
      mustChangePassword: false,
    });

    const token = signToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Admin, Trainer, Member)
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact gym administration.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = signToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        specialization: user.specialization,
        mustChangePassword: user.mustChangePassword,
        assignedTrainer: user.assignedTrainer,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('assignedTrainer', 'name email phone specialization profileImage');

    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      specialization: user.specialization,
      monthlySalary: user.role === ROLES.TRAINER ? user.monthlySalary : undefined,
      assignedTrainer: user.assignedTrainer,
      emergencyContact: user.emergencyContact,
      mustChangePassword: user.mustChangePassword,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      user: userProfile,
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PATCH /api/v1/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, emergencyContact } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (emergencyContact) user.emergencyContact = emergencyContact;

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        emergencyContact: user.emergencyContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// @desc    Quick demo login for evaluation / demonstration
// @route   POST /api/v1/auth/demo-login
// @access  Public
const demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'trainer', 'member'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid demo role requested. Allowed roles: admin, trainer, member.',
      });
    }

    let user;
    if (role === 'admin') {
      user = await User.findOne({ role: 'admin', isActive: true });
    } else if (role === 'trainer') {
      user = await User.findOne({ role: 'trainer', isActive: true });
    } else {
      user = await User.findOne({ role: 'member', isActive: true });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No active ${role} account available for demo login.`,
      });
    }

    const token = signToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: `Signed in successfully as demo ${user.role}.`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        specialization: user.specialization,
        mustChangePassword: user.mustChangePassword,
        assignedTrainer: user.assignedTrainer,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  updateProfile,
  logout,
  demoLogin,
};


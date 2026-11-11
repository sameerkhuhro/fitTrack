const User = require('../models/User');
const { ROLES } = require('../config/constants');

// @desc    Get all trainers (Admin view with salary & stats, or Trainer/Member view)
// @route   GET /api/v1/trainers
// @access  Private / Public
const getAllTrainers = async (req, res, next) => {
  try {
    const isAdmin = req.user && req.user.role === ROLES.ADMIN;
    
    // Select appropriate fields based on role
    const fields = isAdmin
      ? 'name email phone specialization monthlySalary joiningDate isActive mustChangePassword createdAt'
      : 'name email phone specialization profileImage';

    const filter = isAdmin ? { role: ROLES.TRAINER } : { role: ROLES.TRAINER, isActive: true };

    const trainers = await User.find(filter).select(fields).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trainer by ID
// @route   GET /api/v1/trainers/:id
// @access  Private
const getTrainerById = async (req, res, next) => {
  try {
    const trainer = await User.findOne({ _id: req.params.id, role: ROLES.TRAINER });
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: trainer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new trainer (Admin only)
// @route   POST /api/v1/trainers
// @access  Admin
const createTrainer = async (req, res, next) => {
  try {
    const { name, email, phone, specialization, monthlySalary, joiningDate, tempPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Default temporary password if not provided
    const password = tempPassword || 'Trainer@FitTrack2026!';

    const trainer = await User.create({
      name,
      email,
      phone,
      password,
      role: ROLES.TRAINER,
      specialization: specialization || 'General Fitness',
      monthlySalary: Number(monthlySalary) || 0,
      joiningDate: joiningDate || Date.now(),
      isActive: true,
      mustChangePassword: true, // Forces password change on first login
    });

    res.status(201).json({
      success: true,
      message: 'Trainer account created successfully.',
      temporaryPassword: password,
      data: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        specialization: trainer.specialization,
        monthlySalary: trainer.monthlySalary,
        joiningDate: trainer.joiningDate,
        mustChangePassword: trainer.mustChangePassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trainer details (Admin only)
// @route   PUT /api/v1/trainers/:id
// @access  Admin
const updateTrainer = async (req, res, next) => {
  try {
    const { name, phone, specialization, monthlySalary, isActive } = req.body;

    const trainer = await User.findOne({ _id: req.params.id, role: ROLES.TRAINER });
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    if (name) trainer.name = name;
    if (phone) trainer.phone = phone;
    if (specialization) trainer.specialization = specialization;
    if (monthlySalary !== undefined) trainer.monthlySalary = Number(monthlySalary);
    if (isActive !== undefined) trainer.isActive = isActive;

    await trainer.save();

    res.status(200).json({
      success: true,
      message: 'Trainer details updated successfully.',
      data: trainer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate trainer (Admin only)
// @route   DELETE /api/v1/trainers/:id
// @access  Admin
const deleteTrainer = async (req, res, next) => {
  try {
    const trainer = await User.findOne({ _id: req.params.id, role: ROLES.TRAINER });
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    trainer.isActive = false;
    await trainer.save();

    res.status(200).json({
      success: true,
      message: 'Trainer deactivated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
};


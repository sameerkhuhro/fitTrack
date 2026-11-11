const User = require('../models/User');
const Membership = require('../models/Membership');
const Payment = require('../models/Payment');
const { ROLES } = require('../config/constants');

// @desc    Get all members (Admin) or Assigned members (Trainer)
// @route   GET /api/v1/members
// @access  Admin, Trainer
const getAllMembers = async (req, res, next) => {
  try {
    let filter = { role: ROLES.MEMBER };

    // If Trainer, strictly filter by assignedTrainer == req.user._id
    if (req.user.role === ROLES.TRAINER) {
      filter.assignedTrainer = req.user._id;
    }

    const members = await User.find(filter)
      .populate('assignedTrainer', 'name email phone specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single member details with active membership & payment summary
// @route   GET /api/v1/members/:id
// @access  Admin, Trainer (if assigned), Member (self only)
const getMemberById = async (req, res, next) => {
  try {
    const memberId = req.params.id;

    // Security Ownership Check
    if (req.user.role === ROLES.MEMBER && req.user._id.toString() !== memberId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own member profile.',
      });
    }

    const member = await User.findOne({ _id: memberId, role: ROLES.MEMBER })
      .populate('assignedTrainer', 'name email phone specialization');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    // If Trainer, verify this member is assigned to them
    if (req.user.role === ROLES.TRAINER) {
      if (!member.assignedTrainer || member.assignedTrainer._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only access members assigned to you.',
        });
      }
    }

    // Fetch active membership and historical memberships
    const memberships = await Membership.find({ member: memberId })
      .populate('plan')
      .sort({ createdAt: -1 });

    const activeMembership = memberships.find((m) => m.status === 'active') || null;

    // Fetch verified payments
    const payments = await Payment.find({ member: memberId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        member,
        activeMembership,
        memberships,
        payments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin creates a member directly
// @route   POST /api/v1/members
// @access  Admin
const createMember = async (req, res, next) => {
  try {
    const { name, email, password, phone, assignedTrainer, emergencyContact } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const member = await User.create({
      name,
      email,
      password: password || 'Member@FitTrack2026!',
      phone,
      role: ROLES.MEMBER,
      assignedTrainer: assignedTrainer || null,
      emergencyContact: emergencyContact || {},
      isActive: true,
      mustChangePassword: false,
    });

    res.status(201).json({
      success: true,
      message: 'Member created successfully.',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member
// @route   PUT /api/v1/members/:id
// @access  Admin
const updateMember = async (req, res, next) => {
  try {
    const { name, phone, assignedTrainer, isActive, emergencyContact } = req.body;

    const member = await User.findOne({ _id: req.params.id, role: ROLES.MEMBER });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    if (name) member.name = name;
    if (phone) member.phone = phone;
    if (assignedTrainer !== undefined) member.assignedTrainer = assignedTrainer || null;
    if (isActive !== undefined) member.isActive = isActive;
    if (emergencyContact) member.emergencyContact = emergencyContact;

    await member.save();

    res.status(200).json({
      success: true,
      message: 'Member updated successfully.',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate member (soft delete)
// @route   DELETE /api/v1/members/:id
// @access  Admin
const deleteMember = async (req, res, next) => {
  try {
    const member = await User.findOne({ _id: req.params.id, role: ROLES.MEMBER });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    member.isActive = false;
    await member.save();

    res.status(200).json({
      success: true,
      message: 'Member deactivated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign trainer to member
// @route   PATCH /api/v1/members/:id/assign-trainer
// @access  Admin
const assignTrainer = async (req, res, next) => {
  try {
    const { trainerId } = req.body;

    const member = await User.findOne({ _id: req.params.id, role: ROLES.MEMBER });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    if (trainerId) {
      const trainer = await User.findOne({ _id: trainerId, role: ROLES.TRAINER });
      if (!trainer) {
        return res.status(404).json({
          success: false,
          message: 'Trainer not found',
        });
      }
      member.assignedTrainer = trainerId;
    } else {
      member.assignedTrainer = null;
    }

    await member.save();

    res.status(200).json({
      success: true,
      message: 'Trainer assignment updated successfully.',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  assignTrainer,
};


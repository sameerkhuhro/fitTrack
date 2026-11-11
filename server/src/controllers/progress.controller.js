const ProgressRecord = require('../models/ProgressRecord');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

// @desc    Log a new progress measurement entry
// @route   POST /api/v1/progress
// @access  Member, Trainer, Admin
const logProgress = async (req, res, next) => {
  try {
    const { memberId, weightKg, heightCm, waistCm, chestCm, armsCm, hipsCm, bodyFatPercentage, notes, recordedDate } = req.body;

    const targetMemberId = req.user.role === ROLES.MEMBER ? req.user._id : memberId;

    if (!targetMemberId) {
      return res.status(400).json({
        success: false,
        message: 'Member ID is required.',
      });
    }

    // Ownership check if trainer
    if (req.user.role === ROLES.TRAINER) {
      const member = await User.findById(targetMemberId);
      if (!member || !member.assignedTrainer || member.assignedTrainer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only record progress for members assigned to you.',
        });
      }
    }

    const progress = await ProgressRecord.create({
      member: targetMemberId,
      weightKg: Number(weightKg),
      heightCm: heightCm ? Number(heightCm) : null,
      waistCm: waistCm ? Number(waistCm) : null,
      chestCm: chestCm ? Number(chestCm) : null,
      armsCm: armsCm ? Number(armsCm) : null,
      hipsCm: hipsCm ? Number(hipsCm) : null,
      bodyFatPercentage: bodyFatPercentage ? Number(bodyFatPercentage) : null,
      notes: notes || '',
      recordedDate: recordedDate || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: 'Fitness progress logged successfully.',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in member's progress history (ordered for charts)
// @route   GET /api/v1/progress/me
// @access  Member
const getMyProgress = async (req, res, next) => {
  try {
    const records = await ProgressRecord.find({ member: req.user._id })
      .sort({ recordedDate: 1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress of a specific member
// @route   GET /api/v1/progress/member/:id
// @access  Admin, Trainer (if assigned)
const getMemberProgress = async (req, res, next) => {
  try {
    const memberId = req.params.id;

    if (req.user.role === ROLES.TRAINER) {
      const member = await User.findById(memberId);
      if (!member || !member.assignedTrainer || member.assignedTrainer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only view progress of your assigned members.',
        });
      }
    }

    const records = await ProgressRecord.find({ member: memberId })
      .sort({ recordedDate: 1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a progress entry
// @route   DELETE /api/v1/progress/:id
// @access  Member (self), Admin
const deleteProgress = async (req, res, next) => {
  try {
    const record = await ProgressRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    if (req.user.role === ROLES.MEMBER && record.member.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    await ProgressRecord.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Progress entry deleted.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logProgress,
  getMyProgress,
  getMemberProgress,
  deleteProgress,
};

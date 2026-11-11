const WorkoutPlan = require('../models/WorkoutPlan');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { ROLES } = require('../config/constants');

// @desc    Create workout plan for a member
// @route   POST /api/v1/workouts
// @access  Trainer, Admin
const createWorkoutPlan = async (req, res, next) => {
  try {
    const { title, memberId, description, exercises, scheduleDays, startDate, endDate } = req.body;
    const trainerId = req.user.role === ROLES.TRAINER ? req.user._id : req.body.trainerId;

    const member = await User.findOne({ _id: memberId, role: ROLES.MEMBER });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found.',
      });
    }

    // If Trainer, enforce ownership rule: member must be assigned to this trainer
    if (req.user.role === ROLES.TRAINER) {
      if (!member.assignedTrainer || member.assignedTrainer.toString() !== trainerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only assign workout plans to members assigned to you.',
        });
      }
    }

    const plan = await WorkoutPlan.create({
      title,
      trainer: trainerId,
      member: memberId,
      description: description || '',
      exercises: exercises || [],
      scheduleDays: scheduleDays || [],
      startDate: startDate || Date.now(),
      endDate: endDate || null,
      status: 'active',
    });

    // Notify member
    await Notification.create({
      recipient: memberId,
      title: 'New Workout Plan Assigned!',
      message: `Your trainer has assigned you a new workout plan: "${title}". Check your workout portal for details.`,
      type: 'workout',
      relatedEntity: {
        entityType: 'WorkoutPlan',
        entityId: plan._id,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Workout plan created and assigned successfully.',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workout plans (Admin / Trainer view)
// @route   GET /api/v1/workouts
// @access  Trainer, Admin
const getAllWorkoutPlans = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === ROLES.TRAINER) {
      filter.trainer = req.user._id;
    }

    const plans = await WorkoutPlan.find(filter)
      .populate('trainer', 'name email specialization')
      .populate('member', 'name email phone profileImage')
      .populate('exercises.exercise')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get member's own workout plans
// @route   GET /api/v1/workouts/my
// @access  Member
const getMyWorkoutPlans = async (req, res, next) => {
  try {
    const plans = await WorkoutPlan.find({ member: req.user._id, status: 'active' })
      .populate('trainer', 'name email phone specialization profileImage')
      .populate('exercises.exercise')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get workout plan by ID
// @route   GET /api/v1/workouts/:id
// @access  Authenticated
const getWorkoutPlanById = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id)
      .populate('trainer', 'name email phone specialization')
      .populate('member', 'name email phone profileImage')
      .populate('exercises.exercise');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found.',
      });
    }

    // Role security
    if (req.user.role === ROLES.MEMBER && plan.member._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }
    if (req.user.role === ROLES.TRAINER && plan.trainer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update workout plan
// @route   PUT /api/v1/workouts/:id
// @access  Trainer, Admin
const updateWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Workout plan not found.' });
    }

    if (req.user.role === ROLES.TRAINER && plan.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const { title, description, exercises, scheduleDays, status } = req.body;
    if (title) plan.title = title;
    if (description !== undefined) plan.description = description;
    if (exercises) plan.exercises = exercises;
    if (scheduleDays) plan.scheduleDays = scheduleDays;
    if (status) plan.status = status;

    await plan.save();

    res.status(200).json({
      success: true,
      message: 'Workout plan updated.',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Archive workout plan
// @route   DELETE /api/v1/workouts/:id
// @access  Trainer, Admin
const deleteWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Workout plan not found.' });
    }

    if (req.user.role === ROLES.TRAINER && plan.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    plan.status = 'archived';
    await plan.save();

    res.status(200).json({
      success: true,
      message: 'Workout plan archived.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkoutPlan,
  getAllWorkoutPlans,
  getMyWorkoutPlans,
  getWorkoutPlanById,
  updateWorkoutPlan,
  deleteWorkoutPlan,
};


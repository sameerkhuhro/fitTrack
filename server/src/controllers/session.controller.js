const WorkoutSession = require('../models/WorkoutSession');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

// @desc    Get workout sessions (Admin gets all, Trainer gets own, Member gets own)
// @route   GET /api/v1/sessions
// @access  Authenticated
const getSessions = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === ROLES.TRAINER) {
      filter.trainer = req.user._id;
    } else if (req.user.role === ROLES.MEMBER) {
      filter.member = req.user._id;
    }

    const sessions = await WorkoutSession.find(filter)
      .populate('trainer', 'name specialization profileImage')
      .populate('member', 'name email phone profileImage')
      .populate('workoutPlan', 'title')
      .sort({ sessionDate: 1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule a new workout session
// @route   POST /api/v1/sessions
// @access  Trainer, Admin
const createSession = async (req, res, next) => {
  try {
    const { memberId, workoutPlanId, sessionDate, durationMinutes, trainerNotes } = req.body;
    const trainerId = req.user.role === ROLES.TRAINER ? req.user._id : req.body.trainerId;

    const session = await WorkoutSession.create({
      trainer: trainerId,
      member: memberId,
      workoutPlan: workoutPlanId || null,
      sessionDate,
      durationMinutes: durationMinutes || 60,
      trainerNotes: trainerNotes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Workout session scheduled.',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update session status (completed, missed, cancelled)
// @route   PATCH /api/v1/sessions/:id/status
// @access  Trainer, Admin, Member
const updateSessionStatus = async (req, res, next) => {
  try {
    const { status, trainerNotes, memberFeedback } = req.body;

    const session = await WorkoutSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    if (status) session.status = status;
    if (trainerNotes && (req.user.role === ROLES.TRAINER || req.user.role === ROLES.ADMIN)) {
      session.trainerNotes = trainerNotes;
    }
    if (memberFeedback && req.user.role === ROLES.MEMBER) {
      session.memberFeedback = memberFeedback;
    }

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Session status updated.',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSessions,
  createSession,
  updateSessionStatus,
};

const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { ROLES, ATTENDANCE_STATUSES } = require('../config/constants');

// Helper to get normalized YYYY-MM-DD
const getDateString = (date = new Date()) => {
  return new Date(date).toISOString().slice(0, 10);
};

// @desc    Check-in member at gym (Admin/Reception)
// @route   POST /api/v1/attendance/check-in
// @access  Admin
const checkInMember = async (req, res, next) => {
  try {
    const { memberId, notes } = req.body;
    const todayStr = getDateString();

    const member = await User.findOne({ _id: memberId, role: ROLES.MEMBER });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found.',
      });
    }

    // Check if already checked in today
    const existing = await Attendance.findOne({ member: memberId, dateString: todayStr });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `${member.name} has already checked in today at ${new Date(existing.checkIn).toLocaleTimeString()}.`,
        data: existing,
      });
    }

    const attendance = await Attendance.create({
      member: memberId,
      dateString: todayStr,
      checkIn: new Date(),
      status: ATTENDANCE_STATUSES.PRESENT,
      recordedBy: req.user._id,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: `Check-in recorded for ${member.name}.`,
      data: attendance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate check-in prevented: Member is already marked present for today.',
      });
    }
    next(error);
  }
};

// @desc    Check-out member (Admin/Reception)
// @route   PATCH /api/v1/attendance/:id/check-out
// @access  Admin
const checkOutMember = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate('member', 'name');
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found.',
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Member has already checked out.',
      });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.status(200).json({
      success: true,
      message: `Check-out recorded for ${attendance.member.name}.`,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attendance records (Admin view)
// @route   GET /api/v1/attendance
// @access  Admin
const getAllAttendance = async (req, res, next) => {
  try {
    const { date, memberId } = req.query;
    const filter = {};

    if (date) filter.dateString = date;
    if (memberId) filter.member = memberId;

    const records = await Attendance.find(filter)
      .populate('member', 'name email phone profileImage')
      .populate('recordedBy', 'name email')
      .sort({ checkIn: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in member's attendance history
// @route   GET /api/v1/attendance/my
// @access  Member
const getMyAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ member: req.user._id })
      .sort({ checkIn: -1 });

    const totalDays = records.length;
    // Calculate streak or monthly visits
    const thisMonth = new Date().toISOString().slice(0, 7);
    const thisMonthVisits = records.filter((r) => r.dateString.startsWith(thisMonth)).length;

    res.status(200).json({
      success: true,
      stats: {
        totalVisits: totalDays,
        thisMonthVisits,
      },
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get member attendance by member ID (for Admin or assigned Trainer)
// @route   GET /api/v1/attendance/member/:id
// @access  Admin, Trainer
const getMemberAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ member: req.params.id })
      .sort({ checkIn: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkInMember,
  checkOutMember,
  getAllAttendance,
  getMyAttendance,
  getMemberAttendance,
};

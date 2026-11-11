const User = require('../models/User');
const Membership = require('../models/Membership');
const Payment = require('../models/Payment');
const TrainerSalary = require('../models/TrainerSalary');
const Attendance = require('../models/Attendance');
const WorkoutPlan = require('../models/WorkoutPlan');
const WorkoutSession = require('../models/WorkoutSession');
const ProgressRecord = require('../models/ProgressRecord');
const Notification = require('../models/Notification');
const { ROLES, MEMBERSHIP_STATUSES, PAYMENT_STATUSES, SALARY_STATUSES } = require('../config/constants');

// @desc    Admin overall summary metrics
// @route   GET /api/v1/dashboard/summary
// @access  Admin
const getAdminSummary = async (req, res, next) => {
  try {
    const totalMembers = await User.countDocuments({ role: ROLES.MEMBER });
    const totalTrainers = await User.countDocuments({ role: ROLES.TRAINER, isActive: true });

    const activeMembers = await Membership.countDocuments({ status: MEMBERSHIP_STATUSES.ACTIVE });
    const expiredMembers = await Membership.countDocuments({ status: MEMBERSHIP_STATUSES.EXPIRED });
    const pendingRequests = await Membership.countDocuments({ status: MEMBERSHIP_STATUSES.PENDING });

    // Revenue: STRICTLY count only verified payments
    const verifiedPayments = await Payment.find({ status: PAYMENT_STATUSES.VERIFIED });
    const totalRevenue = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);

    // This month's revenue
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const thisMonthRevenue = verifiedPayments
      .filter((p) => new Date(p.verifiedAt || p.createdAt) >= startOfMonth)
      .reduce((sum, p) => sum + p.amount, 0);

    // Calculate total dues across all active/pending memberships
    const allMemberships = await Membership.find({
      status: { $in: [MEMBERSHIP_STATUSES.ACTIVE, MEMBERSHIP_STATUSES.PENDING] },
    });
    const totalExpectedFee = allMemberships.reduce((sum, m) => sum + m.totalAmount, 0);
    const pendingDues = Math.max(0, totalExpectedFee - totalRevenue);

    // Salary obligations for current month
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentMonthSalaries = await TrainerSalary.find({ month: currentMonth, year: currentYear });
    const salaryObligations = currentMonthSalaries.reduce((sum, s) => sum + s.amount, 0);
    const pendingSalaryConfirmations = await TrainerSalary.countDocuments({
      status: SALARY_STATUSES.PAID_AWAITING_CONFIRMATION,
    });

    // Today's attendance
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayAttendanceCount = await Attendance.countDocuments({ dateString: todayStr });

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        expiredMembers,
        pendingRequests,
        totalTrainers,
        totalRevenue,
        thisMonthRevenue,
        pendingDues,
        salaryObligations,
        pendingSalaryConfirmations,
        todayAttendanceCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Revenue Trends (by month for Recharts)
// @route   GET /api/v1/dashboard/revenue
// @access  Admin
const getRevenueTrends = async (req, res, next) => {
  try {
    const verifiedPayments = await Payment.find({ status: PAYMENT_STATUSES.VERIFIED }).sort({ createdAt: 1 });

    const monthMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize past 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      monthMap[key] = 0;
    }

    verifiedPayments.forEach((p) => {
      const pDate = new Date(p.verifiedAt || p.createdAt);
      const key = `${months[pDate.getMonth()]} ${pDate.getFullYear()}`;
      if (monthMap[key] !== undefined) {
        monthMap[key] += p.amount;
      }
    });

    const chartData = Object.keys(monthMap).map((key) => ({
      month: key,
      revenue: monthMap[key],
    }));

    res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Membership Distribution Stats (Active vs Expired vs Pending)
// @route   GET /api/v1/dashboard/membership-stats
// @access  Admin
const getMembershipStats = async (req, res, next) => {
  try {
    const active = await Membership.countDocuments({ status: MEMBERSHIP_STATUSES.ACTIVE });
    const expired = await Membership.countDocuments({ status: MEMBERSHIP_STATUSES.EXPIRED });
    const pending = await Membership.countDocuments({ status: MEMBERSHIP_STATUSES.PENDING });

    res.status(200).json({
      success: true,
      data: [
        { name: 'Active', value: active, color: '#10B981' },
        { name: 'Expired', value: expired, color: '#EF4444' },
        { name: 'Pending', value: pending, color: '#F59E0B' },
      ],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Attendance Trends (past 7 days)
// @route   GET /api/v1/dashboard/attendance-stats
// @access  Admin
const getAttendanceTrends = async (req, res, next) => {
  try {
    const days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const count = await Attendance.countDocuments({ dateString: dateStr });
      days.push({ day: dayName, date: dateStr, count });
    }

    res.status(200).json({
      success: true,
      data: days,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trainer Dashboard Summary
// @route   GET /api/v1/dashboard/trainer-summary
// @access  Trainer
const getTrainerSummary = async (req, res, next) => {
  try {
    const trainerId = req.user._id;

    const assignedMembersCount = await User.countDocuments({
      role: ROLES.MEMBER,
      assignedTrainer: trainerId,
      isActive: true,
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaySessions = await WorkoutSession.countDocuments({
      trainer: trainerId,
      sessionDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const activeWorkoutPlans = await WorkoutPlan.countDocuments({
      trainer: trainerId,
      status: 'active',
    });

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentSalary = await TrainerSalary.findOne({
      trainer: trainerId,
      month: currentMonth,
      year: currentYear,
    });

    res.status(200).json({
      success: true,
      data: {
        assignedMembersCount,
        todaySessions,
        activeWorkoutPlans,
        currentSalary,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Member Dashboard Summary
// @route   GET /api/v1/dashboard/member-summary
// @access  Member
const getMemberSummary = async (req, res, next) => {
  try {
    const memberId = req.user._id;

    // Active membership
    const activeMembership = await Membership.findOne({
      member: memberId,
      status: MEMBERSHIP_STATUSES.ACTIVE,
    }).populate('plan');

    let daysRemaining = 0;
    if (activeMembership && activeMembership.expiryDate) {
      const diffMs = new Date(activeMembership.expiryDate) - new Date();
      daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    // Pending membership
    const pendingMembership = await Membership.findOne({
      member: memberId,
      status: MEMBERSHIP_STATUSES.PENDING,
    }).populate('plan');

    // Payments & Dues calculation
    const allMemberships = await Membership.find({ member: memberId });
    const totalFees = allMemberships.reduce((sum, m) => sum + (m.totalAmount || 0), 0);

    const verifiedPayments = await Payment.find({
      member: memberId,
      status: PAYMENT_STATUSES.VERIFIED,
    });
    const verifiedPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
    const outstandingDues = Math.max(0, totalFees - verifiedPaid);

    // Latest progress
    const latestProgress = await ProgressRecord.findOne({ member: memberId }).sort({ recordedDate: -1 });

    // Active workout plan
    const activePlan = await WorkoutPlan.findOne({ member: memberId, status: 'active' })
      .populate('trainer', 'name phone email specialization')
      .populate('exercises.exercise');

    // Unread notifications count
    const unreadNotifications = await Notification.countDocuments({
      recipient: memberId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: {
        activeMembership,
        pendingMembership,
        daysRemaining,
        outstandingDues,
        verifiedPaid,
        latestProgress,
        activePlan,
        unreadNotifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminSummary,
  getRevenueTrends,
  getMembershipStats,
  getAttendanceTrends,
  getTrainerSummary,
  getMemberSummary,
};

const TrainerSalary = require('../models/TrainerSalary');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { SALARY_STATUSES, ROLES } = require('../config/constants');

// @desc    Admin creates a monthly salary record for a trainer
// @route   POST /api/v1/salaries
// @access  Admin
const createSalary = async (req, res, next) => {
  try {
    const { trainerId, month, year, amount, adminNotes } = req.body;

    const trainer = await User.findOne({ _id: trainerId, role: ROLES.TRAINER });
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found.',
      });
    }

    // Check unique constraint for trainer + month + year
    const existingSalary = await TrainerSalary.findOne({
      trainer: trainerId,
      month: Number(month),
      year: Number(year),
    });

    if (existingSalary) {
      return res.status(400).json({
        success: false,
        message: `Salary record already exists for ${trainer.name} for month ${month}/${year}.`,
      });
    }

    const salaryAmount = amount !== undefined ? Number(amount) : trainer.monthlySalary;

    const salary = await TrainerSalary.create({
      trainer: trainerId,
      month: Number(month),
      year: Number(year),
      amount: salaryAmount,
      status: SALARY_STATUSES.PENDING,
      adminNotes: adminNotes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Monthly salary record created successfully.',
      data: salary,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A salary record for this trainer, month, and year already exists.',
      });
    }
    next(error);
  }
};

// @desc    Admin marks salary as paid / sent
// @route   PATCH /api/v1/salaries/:id/mark-paid
// @access  Admin
const markSalaryPaid = async (req, res, next) => {
  try {
    const { paymentMethod, transactionReference, adminNotes } = req.body;

    const salary = await TrainerSalary.findById(req.params.id).populate('trainer', 'name email');
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found.',
      });
    }

    if (salary.status === SALARY_STATUSES.CONFIRMED) {
      return res.status(400).json({
        success: false,
        message: 'This salary has already been confirmed by the trainer.',
      });
    }

    // Status advances to 'paid_awaiting_confirmation'
    salary.status = SALARY_STATUSES.PAID_AWAITING_CONFIRMATION;
    salary.paidAt = new Date();
    salary.paidBy = req.user._id;
    if (paymentMethod) salary.paymentMethod = paymentMethod;
    if (transactionReference) salary.transactionReference = transactionReference;
    if (adminNotes) salary.adminNotes = adminNotes;

    await salary.save();

    // Trigger in-app notification for Trainer
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[salary.month - 1] || salary.month;

    await Notification.create({
      recipient: salary.trainer._id,
      title: 'Salary Payment Sent – Confirmation Required',
      message: `Your salary of Rs. ${salary.amount} for ${monthName} ${salary.year} has been marked as paid via ${salary.paymentMethod}. Please verify your bank/wallet and confirm receipt in your portal.`,
      type: 'salary',
      relatedEntity: {
        entityType: 'TrainerSalary',
        entityId: salary._id,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Salary marked as paid. Trainer notified to confirm receipt.',
      data: salary,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trainer confirms receipt of their salary
// @route   PATCH /api/v1/salaries/:id/confirm-received
// @access  Trainer (Own salary only)
const confirmSalaryReceived = async (req, res, next) => {
  try {
    const salary = await TrainerSalary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found.',
      });
    }

    // Ownership check: trainer can ONLY confirm their own salary
    if (salary.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only confirm your own salary records.',
      });
    }

    // Business rule: Trainer can only confirm if marked as paid
    if (salary.status !== SALARY_STATUSES.PAID_AWAITING_CONFIRMATION) {
      return res.status(400).json({
        success: false,
        message: `Cannot confirm salary with status '${salary.status}'. Salary must be marked as paid by Admin first.`,
      });
    }

    salary.status = SALARY_STATUSES.CONFIRMED;
    salary.confirmedAt = new Date();
    await salary.save();

    res.status(200).json({
      success: true,
      message: 'Salary receipt confirmed successfully.',
      data: salary,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trainer disputes salary payment
// @route   PATCH /api/v1/salaries/:id/dispute
// @access  Trainer (Own salary only)
const disputeSalary = async (req, res, next) => {
  try {
    const { disputeReason } = req.body;
    if (!disputeReason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for disputing this salary payment.',
      });
    }

    const salary = await TrainerSalary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found.',
      });
    }

    if (salary.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only dispute your own salary.',
      });
    }

    salary.status = SALARY_STATUSES.DISPUTED;
    salary.disputeReason = disputeReason;
    salary.disputedAt = new Date();
    await salary.save();

    res.status(200).json({
      success: true,
      message: 'Salary payment marked as disputed. Admin has been alerted.',
      data: salary,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all salaries (Admin view)
// @route   GET /api/v1/salaries
// @access  Admin
const getAllSalaries = async (req, res, next) => {
  try {
    const { month, year, status, trainerId } = req.query;
    const filter = {};

    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    if (status) filter.status = status;
    if (trainerId) filter.trainer = trainerId;

    const salaries = await TrainerSalary.find(filter)
      .populate('trainer', 'name email phone specialization monthlySalary')
      .populate('paidBy', 'name email')
      .sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      count: salaries.length,
      data: salaries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in trainer's salary history
// @route   GET /api/v1/salaries/my
// @access  Trainer
const getMySalaries = async (req, res, next) => {
  try {
    const salaries = await TrainerSalary.find({ trainer: req.user._id })
      .populate('paidBy', 'name email')
      .sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      count: salaries.length,
      data: salaries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single salary record
// @route   GET /api/v1/salaries/:id
// @access  Admin, Trainer (self)
const getSalaryById = async (req, res, next) => {
  try {
    const salary = await TrainerSalary.findById(req.params.id)
      .populate('trainer', 'name email phone specialization monthlySalary')
      .populate('paidBy', 'name email');

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found.',
      });
    }

    if (req.user.role === ROLES.TRAINER && salary.trainer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own salary record.',
      });
    }

    res.status(200).json({
      success: true,
      data: salary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSalary,
  markSalaryPaid,
  confirmSalaryReceived,
  disputeSalary,
  getAllSalaries,
  getMySalaries,
  getSalaryById,
};
